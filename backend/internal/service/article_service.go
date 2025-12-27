package service

import (
	"backend/internal/domain"

	"github.com/google/uuid"
)

type articleService struct {
	repo domain.ArticleRepository
}

func NewArticleService(repo domain.ArticleRepository) domain.ArticleService {
	return &articleService{repo: repo}
}

func (s *articleService) CreateArticle(article *domain.Article) error {
	return s.repo.Create(article)
}

func (s *articleService) GetArticles() ([]domain.Article, error) {
	return s.repo.GetAll()
}

func (s *articleService) GetArticleByID(id uuid.UUID) (*domain.Article, error) {
	return s.repo.GetByID(id)
}

func (s *articleService) GetArticleBySlug(slug string) (*domain.Article, error) {
	return s.repo.GetBySlug(slug)
}

func (s *articleService) UpdateArticle(article *domain.Article) error {
	return s.repo.Update(article)
}

func (s *articleService) DeleteArticle(id uuid.UUID) error {
	return s.repo.Delete(id)
}
