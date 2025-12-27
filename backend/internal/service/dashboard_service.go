package service

import (
	"backend/internal/domain"
)

type dashboardService struct {
	repo domain.DashboardRepository
}

func NewDashboardService(repo domain.DashboardRepository) domain.DashboardService {
	return &dashboardService{repo: repo}
}

func (s *dashboardService) GetAnalytics() (*domain.DashboardAnalyticsData, error) {
	return s.repo.GetAnalytics()
}

func (s *dashboardService) GetCategoryHierarchyStats() (*domain.CategoryHierarchyStats, error) {
	return s.repo.GetCategoryHierarchyStats()
}

func (s *dashboardService) GetCategoryTree() ([]domain.CategoryNode, error) {
	return s.repo.GetCategoryTree()
}
