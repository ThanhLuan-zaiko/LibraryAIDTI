package repository

import (
	"backend/internal/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type dashboardRepository struct {
	db *gorm.DB
}

func NewDashboardRepository(db *gorm.DB) domain.DashboardRepository {
	return &dashboardRepository{db: db}
}

func (r *dashboardRepository) GetAnalytics() (*domain.DashboardAnalyticsData, error) {
	var data domain.DashboardAnalyticsData

	// 1. Total Articles
	if err := r.db.Model(&domain.Article{}).Count(&data.TotalArticles).Error; err != nil {
		return nil, err
	}

	// 2. Total Views (Sum of view_count from article_stats)
	if err := r.db.Table("article_stats").Select("COALESCE(SUM(view_count), 0)").Scan(&data.TotalViews).Error; err != nil {
		return nil, err
	}

	// 3. Total Comments (Combine table if needed, or stick to comments table)
	if err := r.db.Model(&domain.Comment{}).Count(&data.TotalComments).Error; err != nil {
		return nil, err
	}

	// 4. Article Trend (Last 7 days)
	rows, err := r.db.Raw(`
		SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, COUNT(*) as count
		FROM articles
		WHERE created_at >= NOW() - INTERVAL '30 days'
		GROUP BY date
		ORDER BY date ASC
	`).Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var trend domain.ArticleTrend
		rows.Scan(&trend.Date, &trend.Count)
		data.ArticleTrend = append(data.ArticleTrend, trend)
	}

	// Fill missing dates if needed (skipped for simplicity, handled in frontend or basic query)

	// 5. Top Categories (Reuse existing logic or improved query)
	err = r.db.Table("categories").
		Select("categories.id, categories.name, count(articles.id) as article_count").
		Joins("LEFT JOIN articles ON articles.category_id = categories.id").
		Group("categories.id, categories.name").
		Order("article_count DESC").
		Limit(5).
		Scan(&data.TopCategories).Error
	if err != nil {
		return nil, err
	}

	// 6. Top Tags
	err = r.db.Table("tags").
		Select("tags.id, tags.name, tags.slug, count(article_tags.article_id) as usage_count").
		Joins("LEFT JOIN article_tags ON article_tags.tag_id = tags.id").
		Group("tags.id, tags.name, tags.slug").
		Order("usage_count DESC").
		Limit(5).
		Scan(&data.TopTags).Error
	if err != nil {
		return nil, err
	}

	return &data, nil
}

// GetCategoryHierarchyStats returns statistics about the category hierarchy
func (r *dashboardRepository) GetCategoryHierarchyStats() (*domain.CategoryHierarchyStats, error) {
	var stats domain.CategoryHierarchyStats

	// Count root categories (parent_id IS NULL)
	if err := r.db.Model(&domain.Category{}).Where("parent_id IS NULL").Count(&stats.RootCount).Error; err != nil {
		return nil, err
	}

	// Count child categories (parent_id IS NOT NULL)
	if err := r.db.Model(&domain.Category{}).Where("parent_id IS NOT NULL").Count(&stats.ChildCount).Error; err != nil {
		return nil, err
	}

	// Calculate average children per parent
	var avgResult struct {
		Avg float64
	}
	err := r.db.Raw(`
		SELECT AVG(child_count) as avg
		FROM (
			SELECT parent_id, COUNT(*) as child_count
			FROM categories
			WHERE parent_id IS NOT NULL
			GROUP BY parent_id
		) as parent_counts
	`).Scan(&avgResult).Error
	if err != nil {
		return nil, err
	}
	stats.AvgChildren = avgResult.Avg

	// Calculate max depth using recursive CTE
	var maxDepthResult struct {
		MaxDepth int
	}
	err = r.db.Raw(`
		WITH RECURSIVE category_tree AS (
			-- Base case: root categories have depth 0
			SELECT id, parent_id, 0 as depth
			FROM categories
			WHERE parent_id IS NULL
			
			UNION ALL
			
			-- Recursive case: children have depth + 1
			SELECT c.id, c.parent_id, ct.depth + 1
			FROM categories c
			INNER JOIN category_tree ct ON c.parent_id = ct.id
		)
		SELECT COALESCE(MAX(depth), 0) as max_depth
		FROM category_tree
	`).Scan(&maxDepthResult).Error
	if err != nil {
		return nil, err
	}
	stats.MaxDepth = maxDepthResult.MaxDepth

	return &stats, nil
}

// GetCategoryTree returns the full category tree with article counts
func (r *dashboardRepository) GetCategoryTree() ([]domain.CategoryNode, error) {
	// First, get all categories with their article counts
	var categories []struct {
		ID           string
		Name         string
		Slug         string
		ParentID     *string
		ArticleCount int64
	}

	err := r.db.Table("categories").
		Select("categories.id, categories.name, categories.slug, categories.parent_id, COUNT(articles.id) as article_count").
		Joins("LEFT JOIN articles ON articles.category_id = categories.id").
		Group("categories.id, categories.name, categories.slug, categories.parent_id").
		Order("categories.name ASC").
		Scan(&categories).Error
	if err != nil {
		return nil, err
	}

	// Build tree structure using pointers
	nodeMap := make(map[string]*domain.CategoryNode)

	// First pass: create all nodes
	for _, cat := range categories {
		id, _ := uuid.Parse(cat.ID)
		node := &domain.CategoryNode{
			ID:           id,
			Name:         cat.Name,
			Slug:         cat.Slug,
			ArticleCount: cat.ArticleCount,
			Children:     []domain.CategoryNode{},
		}
		nodeMap[cat.ID] = node
	}

	// Second pass: build relationships
	var roots []*domain.CategoryNode
	for _, cat := range categories {
		node := nodeMap[cat.ID]
		if cat.ParentID == nil {
			// Root category
			node.Level = 0
			roots = append(roots, node)
		} else {
			// Child category
			if parent, exists := nodeMap[*cat.ParentID]; exists {
				node.Level = parent.Level + 1
				parent.Children = append(parent.Children, *node)
			}
		}
	}

	// Convert from pointers to values for return
	result := make([]domain.CategoryNode, len(roots))
	for i, root := range roots {
		result[i] = *root
	}

	return result, nil
}
