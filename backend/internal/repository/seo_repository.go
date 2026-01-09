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
	if err := r.db.First(&redirect, "from_slug = ?", slug).Error; err != nil {
		return nil, err
	}
	return &redirect, nil
}

func (r *seoRepository) GetAllRedirects(page, limit int, search string) ([]domain.SeoRedirect, int64, error) {
	var redirects []domain.SeoRedirect
	var total int64

	query := r.db.Model(&domain.SeoRedirect{})

	if search != "" {
		searchTerm := "%" + search + "%"
		query = query.Where("from_slug ILIKE ? OR to_slug ILIKE ?", searchTerm, searchTerm)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	err := query.Order("created_at desc").
		Offset(offset).
		Limit(limit).
		Find(&redirects).Error

	return redirects, total, err
}

func (r *seoRepository) UpdateRedirect(redirect *domain.SeoRedirect) error {
	return r.db.Model(redirect).Select("FromSlug", "ToSlug").Updates(redirect).Error
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
	if err := r.db.Preload("Article").First(&redirect, "from_slug = ?", slug).Error; err != nil {
		return nil, err
	}
	return &redirect, nil
}

func (r *seoRepository) GetAllArticleRedirects(page, limit int, search string) ([]domain.ArticleSeoRedirect, int64, error) {
	var redirects []domain.ArticleSeoRedirect
	var total int64

	query := r.db.Model(&domain.ArticleSeoRedirect{}).Preload("Article")

	if search != "" {
		searchTerm := "%" + search + "%"
		// Filter by slug OR article title
		query = query.Joins("LEFT JOIN articles ON articles.id = article_seo_redirects.article_id").
			Where("article_seo_redirects.from_slug ILIKE ? OR article_seo_redirects.to_slug ILIKE ? OR articles.title ILIKE ?",
				searchTerm, searchTerm, searchTerm)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	err := query.Order("article_seo_redirects.created_at desc").
		Offset(offset).
		Limit(limit).
		Find(&redirects).Error

	return redirects, total, err
}

func (r *seoRepository) GetRedirectsByArticleID(articleID uuid.UUID) ([]domain.ArticleSeoRedirect, error) {
	var redirects []domain.ArticleSeoRedirect
	err := r.db.Where("article_id = ?", articleID).Find(&redirects).Error
	return redirects, err
}

func (r *seoRepository) DeleteArticleRedirect(id uuid.UUID) error {
	return r.db.Delete(&domain.ArticleSeoRedirect{}, "id = ?", id).Error
}

func (r *seoRepository) GetSeoTrends(months int) ([]domain.SeoTrendData, error) {
	var trends []domain.SeoTrendData

	// For GORM raw query with replacement, check if $1 works or need ?
	// GORM uses ? for parameters usually.

	queryGorm := `
		WITH date_series AS (
			SELECT generate_series(
				date_trunc('month', CURRENT_DATE) - (? * INTERVAL '1 month'),
				date_trunc('month', CURRENT_DATE),
				'1 month'::interval
			) as month
		)
		SELECT 
			TO_CHAR(ds.month, 'MM/YYYY') as date,
			COALESCE(COUNT(DISTINCT r.id), 0) as redirects,
			COALESCE(COUNT(DISTINCT a.id), 0) as articles
		FROM date_series ds
		LEFT JOIN article_seo_redirects r ON date_trunc('month', r.created_at) = ds.month
		LEFT JOIN articles a ON date_trunc('month', a.created_at) = ds.month
		GROUP BY ds.month
		ORDER BY ds.month ASC
	`

	if err := r.db.Raw(queryGorm, months-1).Scan(&trends).Error; err != nil {
		return nil, err
	}

	return trends, nil
}
