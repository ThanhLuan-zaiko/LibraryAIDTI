package domain

import "github.com/google/uuid"

// CategoryHierarchyStats contains statistics about category hierarchy
type CategoryHierarchyStats struct {
	RootCount   int64   `json:"root_count"`   // Number of root categories
	ChildCount  int64   `json:"child_count"`  // Number of child categories
	AvgChildren float64 `json:"avg_children"` // Average children per parent
	MaxDepth    int     `json:"max_depth"`    // Maximum depth of category tree
}

// CategoryNode represents a node in the category tree with article counts
type CategoryNode struct {
	ID           uuid.UUID      `json:"id"`
	Name         string         `json:"name"`
	Slug         string         `json:"slug"`
	ArticleCount int64          `json:"article_count"`
	Level        int            `json:"level"`
	Children     []CategoryNode `json:"children,omitempty"`
}

// CategoryTreeData contains the full category tree with article counts
type CategoryTreeData struct {
	Roots []CategoryNode         `json:"roots"`
	Stats CategoryHierarchyStats `json:"stats"`
}
