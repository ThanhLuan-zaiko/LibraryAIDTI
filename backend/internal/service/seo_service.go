package service

import (
	"backend/internal/domain"
	"errors"

	"github.com/google/uuid"
)

type seoService struct {
	repo domain.SeoRepository
}

func NewSeoService(repo domain.SeoRepository) domain.SeoService {
	return &seoService{repo: repo}
}

// Global Redirects

func (s *seoService) CreateRedirect(fromSlug, toSlug string) error {
	// Check if exists
	existing, _ := s.repo.GetRedirectByFromSlug(fromSlug)
	if existing != nil {
		return errors.New("redirect already exists for this slug")
	}

	redirect := &domain.SeoRedirect{
		FromSlug: fromSlug,
		ToSlug:   toSlug,
	}
	return s.repo.CreateRedirect(redirect)
}

func (s *seoService) GetDestination(slug string) (string, error) {
	// Check global redirect first
	if redirect, err := s.repo.GetRedirectByFromSlug(slug); err == nil {
		return redirect.ToSlug, nil
	}

	// Check article redirect
	if articleRedirect, err := s.repo.GetArticleRedirectByFromSlug(slug); err == nil {
		return articleRedirect.ToSlug, nil
	}

	return "", nil
}

// Article Redirects

func (s *seoService) CreateArticleRedirect(articleID uuid.UUID, fromSlug, toSlug string) error {
	// Check if exists
	existing, _ := s.repo.GetArticleRedirectByFromSlug(fromSlug)
	if existing != nil {
		// If it exists, we might want to update it or return error.
		// For now, let's assume strict uniqueness.
		return errors.New("article redirect already exists for this slug")
	}

	redirect := &domain.ArticleSeoRedirect{
		ArticleID: articleID,
		FromSlug:  fromSlug,
		ToSlug:    toSlug,
	}
	return s.repo.CreateArticleRedirect(redirect)
}
