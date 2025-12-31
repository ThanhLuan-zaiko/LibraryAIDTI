package repository

import (
	"backend/internal/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type seoRepository struct {
	db *gorm.DB
}

func NewSeoRepository(db *gorm.DB) domain.SeoRepository {
	return &seoRepository{db: db}
}

// Global Redirects

func (r *seoRepository) CreateRedirect(redirect *domain.SeoRedirect) error {
	return r.db.Create(redirect).Error
}

func (r *seoRepository) GetRedirectByFromSlug(slug string) (*domain.SeoRedirect, error) {
	var redirect domain.SeoRedirect
	err := r.db.First(&redirect, "from_slug = ?", slug).Error
	return &redirect, err
}

func (r *seoRepository) DeleteRedirect(id uuid.UUID) error {
	return r.db.Delete(&domain.SeoRedirect{}, "id = ?", id).Error
}

// Article Redirects

func (r *seoRepository) CreateArticleRedirect(redirect *domain.ArticleSeoRedirect) error {
	return r.db.Create(redirect).Error
}

func (r *seoRepository) GetArticleRedirectByFromSlug(slug string) (*domain.ArticleSeoRedirect, error) {
	var redirect domain.ArticleSeoRedirect
	err := r.db.First(&redirect, "from_slug = ?", slug).Error
	return &redirect, err
}

func (r *seoRepository) GetRedirectsByArticleID(articleID uuid.UUID) ([]domain.ArticleSeoRedirect, error) {
	var redirects []domain.ArticleSeoRedirect
	err := r.db.Where("article_id = ?", articleID).Find(&redirects).Error
	return redirects, err
}
