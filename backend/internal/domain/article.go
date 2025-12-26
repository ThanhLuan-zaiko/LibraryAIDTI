package domain

import (
	"time"

	"github.com/google/uuid"
)

type Category struct {
	ID          uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	Name        string    `gorm:"unique;not null" json:"name"`
	Slug        string    `gorm:"unique;not null" json:"slug"`
	Description string    `json:"description"`
	CreatedAt   time.Time `gorm:"default:now()" json:"created_at"`
	UpdatedAt   time.Time `gorm:"default:now()" json:"updated_at"`
}

type ArticleStatus string

const (
	StatusDraft     ArticleStatus = "DRAFT"
	StatusPublished ArticleStatus = "PUBLISHED"
)

type Article struct {
	ID          uuid.UUID     `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	Title       string        `gorm:"not null" json:"title"`
	Slug        string        `gorm:"unique;not null" json:"slug"`
	Summary     string        `json:"summary"`
	Content     string        `gorm:"type:text" json:"content"`
	ImageURL    string        `json:"image_url"`
	Status      ArticleStatus `gorm:"default:'DRAFT'" json:"status"`
	ViewCount   int           `gorm:"default:0" json:"view_count"`
	CategoryID  uuid.UUID     `gorm:"type:uuid" json:"category_id"`
	Category    Category      `gorm:"foreignKey:CategoryID" json:"category"`
	AuthorID    uuid.UUID     `gorm:"type:uuid" json:"author_id"`
	Author      User          `gorm:"foreignKey:AuthorID" json:"author"`
	PublishedAt *time.Time    `json:"published_at"`
	CreatedAt   time.Time     `gorm:"default:now()" json:"created_at"`
	UpdatedAt   time.Time     `gorm:"default:now()" json:"updated_at"`
}

type ArticleRepository interface {
	Create(article *Article) error
	GetAll() ([]Article, error)
	GetByID(id uuid.UUID) (*Article, error)
	GetBySlug(slug string) (*Article, error)
	Update(article *Article) error
	Delete(id uuid.UUID) error
}

type CategoryRepository interface {
	Create(category *Category) error
	GetAll() ([]Category, error)
	GetByID(id uuid.UUID) (*Category, error)
	GetBySlug(slug string) (*Category, error)
	Update(category *Category) error
	Delete(id uuid.UUID) error
}

type ArticleService interface {
	CreateArticle(article *Article) error
	GetArticles() ([]Article, error)
	GetArticleByID(id uuid.UUID) (*Article, error)
	GetArticleBySlug(slug string) (*Article, error)
	UpdateArticle(article *Article) error
	DeleteArticle(id uuid.UUID) error
}

type CategoryService interface {
	CreateCategory(category *Category) error
	GetCategories() ([]Category, error)
	GetCategoryByID(id uuid.UUID) (*Category, error)
	GetCategoryBySlug(slug string) (*Category, error)
	UpdateCategory(category *Category) error
	DeleteCategory(id uuid.UUID) error
}
