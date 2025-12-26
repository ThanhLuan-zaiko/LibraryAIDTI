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

type categoryService struct {
	repo domain.CategoryRepository
}

func NewCategoryService(repo domain.CategoryRepository) domain.CategoryService {
	return &categoryService{repo: repo}
}

func (s *categoryService) CreateCategory(category *domain.Category) error {
	return s.repo.Create(category)
}

func (s *categoryService) GetCategories() ([]domain.Category, error) {
	return s.repo.GetAll()
}

func (s *categoryService) GetCategoryByID(id uuid.UUID) (*domain.Category, error) {
	return s.repo.GetByID(id)
}

func (s *categoryService) GetCategoryBySlug(slug string) (*domain.Category, error) {
	return s.repo.GetBySlug(slug)
}

func (s *categoryService) UpdateCategory(category *domain.Category) error {
	return s.repo.Update(category)
}

func (s *categoryService) DeleteCategory(id uuid.UUID) error {
	return s.repo.Delete(id)
}
