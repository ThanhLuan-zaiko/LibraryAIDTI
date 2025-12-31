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
	ArticleID uuid.UUID `gorm:"type:uuid;unique;not null" json:"article_id"`
	FromSlug  string    `gorm:"unique;not null" json:"from_slug"`
	ToSlug    string    `gorm:"not null" json:"to_slug"`
	CreatedAt time.Time `gorm:"default:now()" json:"created_at"`
}

type SeoRepository interface {
	// Global Redirects
	CreateRedirect(redirect *SeoRedirect) error
	GetRedirectByFromSlug(slug string) (*SeoRedirect, error)
	DeleteRedirect(id uuid.UUID) error

	// Article Redirects
	CreateArticleRedirect(redirect *ArticleSeoRedirect) error
	GetArticleRedirectByFromSlug(slug string) (*ArticleSeoRedirect, error)
	GetRedirectsByArticleID(articleID uuid.UUID) ([]ArticleSeoRedirect, error)
}

type SeoService interface {
	CreateRedirect(fromSlug, toSlug string) error
	GetDestination(slug string) (string, error) // Returns toSlug if exists
	CreateArticleRedirect(articleID uuid.UUID, fromSlug, toSlug string) error
}
