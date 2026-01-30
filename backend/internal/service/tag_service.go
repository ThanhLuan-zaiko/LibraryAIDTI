package service

import (
	"backend/internal/domain"
	"backend/internal/utils"
	"strings"

	"github.com/google/uuid"
)

type tagService struct {
	repo      domain.TagRepository
	auditServ domain.AuditService
}

func NewTagService(repo domain.TagRepository, auditServ domain.AuditService) domain.TagService {
	return &tagService{repo: repo, auditServ: auditServ}
}

func (s *tagService) CreateTag(tag *domain.Tag, userID uuid.UUID) error {
	if tag.Slug == "" {
		tag.Slug = utils.GenerateSlug(tag.Name)
	}
	tag.Slug = strings.ToLower(tag.Slug)
	if err := s.repo.Create(tag); err != nil {
		return err
	}

	s.auditServ.LogAction(userID, "CREATE", "tags", tag.ID, nil, tag)
	return nil
}

func (s *tagService) GetTags() ([]domain.Tag, error) {
	return s.repo.GetAll()
}

func (s *tagService) GetTagByID(id uuid.UUID) (*domain.Tag, error) {
	return s.repo.GetByID(id)
}

func (s *tagService) GetTagBySlug(slug string) (*domain.Tag, error) {
	return s.repo.GetBySlug(slug)
}

func (s *tagService) GetTagList(page, limit int, search, sortBy, order string) (*domain.PaginatedResult[domain.Tag], error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}
	return s.repo.GetList(page, limit, search, sortBy, order)
}

func (s *tagService) GetTagStats(limit int) ([]domain.TagStats, error) {
	return s.repo.GetStats(limit)
}

func (s *tagService) UpdateTag(tag *domain.Tag, userID uuid.UUID) error {
	existing, _ := s.repo.GetByID(tag.ID)

	// Always sync slug with name on update to satisfy requirement
	if tag.Name != "" {
		tag.Slug = utils.GenerateSlug(tag.Name)
	}
	tag.Slug = strings.ToLower(tag.Slug)
	if err := s.repo.Update(tag); err != nil {
		return err
	}

	s.auditServ.LogAction(userID, "UPDATE", "tags", tag.ID, existing, tag)
	return nil
}

func (s *tagService) DeleteTag(id uuid.UUID, userID uuid.UUID) error {
	existing, _ := s.repo.GetByID(id)
	if err := s.repo.Delete(id); err != nil {
		return err
	}
	s.auditServ.LogAction(userID, "DELETE", "tags", id, existing, nil)
	return nil
}
