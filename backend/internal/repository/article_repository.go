package repository

import (
	"backend/internal/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type articleRepository struct {
	db *gorm.DB
}

func NewArticleRepository(db *gorm.DB) domain.ArticleRepository {
	return &articleRepository{db: db}
}

func (r *articleRepository) Create(article *domain.Article) error {
	return r.db.Create(article).Error
}

func (r *articleRepository) GetAll() ([]domain.Article, error) {
	var articles []domain.Article
	err := r.db.Preload("Category").Preload("Author").Find(&articles).Error
	return articles, err
}

func (r *articleRepository) GetByID(id uuid.UUID) (*domain.Article, error) {
	var article domain.Article
	err := r.db.Preload("Category").Preload("Author").First(&article, "id = ?", id).Error
	return &article, err
}

func (r *articleRepository) GetBySlug(slug string) (*domain.Article, error) {
	var article domain.Article
	err := r.db.Preload("Category").Preload("Author").First(&article, "slug = ?", slug).Error
	return &article, err
}

func (r *articleRepository) Update(article *domain.Article) error {
	return r.db.Save(article).Error
}

func (r *articleRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&domain.Article{}, "id = ?", id).Error
}

type categoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) domain.CategoryRepository {
	return &categoryRepository{db: db}
}

func (r *categoryRepository) Create(category *domain.Category) error {
	return r.db.Create(category).Error
}

func (r *categoryRepository) GetAll() ([]domain.Category, error) {
	var categories []domain.Category
	err := r.db.Find(&categories).Error
	return categories, err
}

func (r *categoryRepository) GetByID(id uuid.UUID) (*domain.Category, error) {
	var category domain.Category
	err := r.db.First(&category, "id = ?", id).Error
	return &category, err
}

func (r *categoryRepository) GetBySlug(slug string) (*domain.Category, error) {
	var category domain.Category
	err := r.db.First(&category, "slug = ?", slug).Error
	return &category, err
}

func (r *categoryRepository) Update(category *domain.Category) error {
	return r.db.Save(category).Error
}

func (r *categoryRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&domain.Category{}, "id = ?", id).Error
}
