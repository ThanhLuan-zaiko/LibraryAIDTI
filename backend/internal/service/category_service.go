package service

import (
	"backend/internal/domain"
	"backend/internal/utils"
	"strings"

	"github.com/google/uuid"
)

type categoryService struct {
	repo      domain.CategoryRepository
	auditServ domain.AuditService
}

func NewCategoryService(repo domain.CategoryRepository, auditServ domain.AuditService) domain.CategoryService {
	return &categoryService{repo: repo, auditServ: auditServ}
}

func (s *categoryService) CreateCategory(category *domain.Category, userID uuid.UUID) error {
	if category.Slug == "" {
		category.Slug = utils.GenerateSlug(category.Name)
	}
	category.Slug = strings.ToLower(category.Slug)
	if err := s.repo.Create(category); err != nil {
		return err
	}

	s.auditServ.LogAction(userID, "CREATE", "categories", category.ID, nil, category)
	return nil
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

func (s *categoryService) GetCategoryStats() ([]domain.CategoryStats, error) {
	return s.repo.GetStats()
}

func (s *categoryService) GetCategoryTree() ([]domain.Category, error) {
	return s.repo.GetTree()
}

func (s *categoryService) GetCategoryList(page, limit int, search, sortBy, order string, minimal bool) (*domain.PaginatedResult[domain.Category], error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}
	return s.repo.GetList(page, limit, search, sortBy, order, minimal)
}

func (s *categoryService) UpdateCategory(category *domain.Category, userID uuid.UUID) error {
	existing, _ := s.repo.GetByID(category.ID)

	// Always sync slug with name on update to satisfy requirement
	if category.Name != "" {
		category.Slug = utils.GenerateSlug(category.Name)
	}
	category.Slug = strings.ToLower(category.Slug)
	if err := s.repo.Update(category); err != nil {
		return err
	}

	s.auditServ.LogAction(userID, "UPDATE", "categories", category.ID, existing, category)
	return nil
}

func (s *categoryService) DeleteCategory(id uuid.UUID, userID uuid.UUID) error {
	existing, _ := s.repo.GetByID(id)
	if err := s.repo.Delete(id); err != nil {
		return err
	}
	s.auditServ.LogAction(userID, "DELETE", "categories", id, existing, nil)
	return nil
}
