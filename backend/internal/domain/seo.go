package domain

import (
	"time"

	"github.com/google/uuid"
)

// SeoRedirect represents the seo_redirects table (Global redirects)
type SeoRedirect struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	FromSlug  string    `gorm:"unique;not null" json:"from_slug"`
	ToSlug    string    `gorm:"not null" json:"to_slug"`
	CreatedAt time.Time `gorm:"default:now()" json:"created_at"`
}

// ArticleSeoRedirect represents the article_seo_redirects table
type ArticleSeoRedirect struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	ArticleID uuid.UUID `gorm:"type:uuid;not null" json:"article_id"`
	FromSlug  string    `gorm:"unique;not null" json:"from_slug"`
	ToSlug    string    `gorm:"not null" json:"to_slug"`
	CreatedAt time.Time `gorm:"default:now()" json:"created_at"`

	// Relations
	Article *Article `gorm:"foreignKey:ArticleID" json:"article"`
}

type SeoTrendData struct {
	Date      string `json:"date"`      // Format "MM/YYYY"
	Redirects int64  `json:"redirects"` // Number of new redirects
	Articles  int64  `json:"articles"`  // Number of new articles
}

type SeoRepository interface {
	// Global Redirects
	CreateRedirect(redirect *SeoRedirect) error
	GetRedirectByFromSlug(slug string) (*SeoRedirect, error)
	GetAllRedirects(page, limit int, search string) ([]SeoRedirect, int64, error)
	UpdateRedirect(redirect *SeoRedirect) error
	DeleteRedirect(id uuid.UUID) error

	// Article Redirects
	CreateArticleRedirect(redirect *ArticleSeoRedirect) error
	GetArticleRedirectByFromSlug(slug string) (*ArticleSeoRedirect, error)
	GetAllArticleRedirects(page, limit int, search string) ([]ArticleSeoRedirect, int64, error)
	GetRedirectsByArticleID(articleID uuid.UUID) ([]ArticleSeoRedirect, error)
	DeleteArticleRedirect(id uuid.UUID) error

	// Stats
	GetSeoTrends(months int) ([]SeoTrendData, error)
}

type SeoService interface {
	CreateRedirect(fromSlug, toSlug string) error
	GetDestination(slug string) (string, error) // Returns toSlug if exists
	GetAllRedirects(page, limit int, search string) ([]SeoRedirect, int64, error)
	UpdateRedirect(id uuid.UUID, fromSlug, toSlug string) error
	DeleteRedirect(id uuid.UUID) error

	CreateArticleRedirect(articleID uuid.UUID, fromSlug, toSlug string) error
	GetAllArticleRedirects(page, limit int, search string) ([]ArticleSeoRedirect, int64, error)
	DeleteArticleRedirect(id uuid.UUID) error

	GetSeoTrends(months int) ([]SeoTrendData, error)
}
