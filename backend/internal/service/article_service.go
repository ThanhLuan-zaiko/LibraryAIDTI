package service

import (
	"backend/internal/domain"
	"backend/internal/utils"
	"backend/internal/ws"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
)

type articleService struct {
	repo domain.ArticleRepository
	hub  *ws.Hub // Directly using Hub for simplicity, ideally should be an interface
}

func NewArticleService(repo domain.ArticleRepository, hub *ws.Hub) domain.ArticleService {
	return &articleService{
		repo: repo,
		hub:  hub,
	}
}

func (s *articleService) CreateArticle(article *domain.Article) error {
	// 1. Generate Slug if empty
	if article.Slug == "" {
		article.Slug = utils.GenerateSlug(article.Title)
	}
	// Check slug uniqueness
	existing, _ := s.repo.GetBySlug(article.Slug)
	if existing != nil {
		return errors.New("slug already exists")
	}

	// 2. Set Default Values
	if article.Status == "" {
		article.Status = domain.StatusDraft
	}

	now := time.Now()
	if article.Status == domain.StatusPublished && article.PublishedAt == nil {
		article.PublishedAt = &now
	}

	// 3. Create
	if err := s.repo.Create(article); err != nil {
		return err
	}

	// 4. Broadcast Event
	s.broadcastEvent("article_created", article)

	return nil
}

func (s *articleService) GetArticles(page, limit int, filter map[string]interface{}) ([]domain.Article, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	offset := (page - 1) * limit

	return s.repo.GetAll(offset, limit, filter)
}

func (s *articleService) GetArticleByID(id uuid.UUID) (*domain.Article, error) {
	return s.repo.GetByID(id)
}

func (s *articleService) GetArticleBySlug(slug string) (*domain.Article, error) {
	return s.repo.GetBySlug(slug)
}

func (s *articleService) UpdateArticle(article *domain.Article) error {
	// 1. Get existing to check status and create version
	existing, err := s.repo.GetByID(article.ID)
	if err != nil {
		return err
	}

	// 2. Create Version if content/title changed
	if existing.Content != article.Content || existing.Title != article.Title {
		version := domain.ArticleVersion{
			ArticleID:     article.ID,
			Title:         existing.Title,
			Content:       existing.Content,
			Summary:       existing.Summary,
			VersionNumber: len(existing.Versions) + 1,
			CreatedBy:     existing.AuthorID, // Or current user if we had context here
		}
		article.Versions = append(article.Versions, version)
	}

	// 3. Handle Status Change via Update?
	// Usually strict status changes go through ChangeStatus, but for general update we might allow it if it's draft.
	// For now, let's assume this Update is for Content primarily. To be safe, we keep status from existing if not intended to change here.
	if article.Status == "" {
		article.Status = existing.Status
	}

	// 4. Update
	if err := s.repo.Update(article); err != nil {
		return err
	}

	// 5. Broadcast Event
	s.broadcastEvent("article_updated", article)

	return nil
}

func (s *articleService) DeleteArticle(id uuid.UUID) error {
	if err := s.repo.Delete(id); err != nil {
		return err
	}
	s.broadcastEvent("article_deleted", map[string]interface{}{"id": id})
	return nil
}

func (s *articleService) ChangeStatus(id uuid.UUID, newStatus domain.ArticleStatus, changedBy uuid.UUID, note string) error {
	article, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}

	if article.Status == newStatus {
		return nil
	}

	oldStatus := article.Status
	article.Status = newStatus

	now := time.Now()
	if newStatus == domain.StatusPublished && article.PublishedAt == nil {
		article.PublishedAt = &now
	}

	// Create Status Log
	log := domain.ArticleStatusLog{
		ArticleID: id,
		OldStatus: oldStatus,
		NewStatus: newStatus,
		ChangedBy: changedBy,
		Note:      note,
	}
	article.StatusLogs = append(article.StatusLogs, log)

	if err := s.repo.Update(article); err != nil {
		return err
	}

	// Broadcast
	s.broadcastEvent("article_status_changed", map[string]interface{}{
		"id":         id,
		"old_status": oldStatus,
		"new_status": newStatus,
	})

	return nil
}

func (s *articleService) broadcastEvent(eventType string, payload interface{}) {
	s.hub.Broadcast <- []byte(fmt.Sprintf(`{"type":"%s","payload":%v}`, eventType, utils.ToJSON(payload)))
}
