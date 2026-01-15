package repository

import (
	"backend/internal/domain"

	"gorm.io/gorm"
)

type ratingRepository struct {
	db *gorm.DB
}

func NewRatingRepository(db *gorm.DB) domain.RatingRepository {
	return &ratingRepository{db: db}
}

func (r *ratingRepository) Upsert(rating *domain.ArticleRating) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Upsert rating
		if err := tx.Save(rating).Error; err != nil {
			return err
		}

		// Recalculate stats
		var stats struct {
			Avg   float64
			Count int64
		}
		err := tx.Model(&domain.ArticleRating{}).
			Where("article_id = ?", rating.ArticleID).
			Select("COALESCE(AVG(score), 0) as avg, COUNT(*) as count").
			Scan(&stats).Error
		if err != nil {
			return err
		}

		// Update Article denormalized fields
		return tx.Model(&domain.Article{}).
			Where("id = ?", rating.ArticleID).
			Updates(map[string]interface{}{
				"rating_avg":   stats.Avg,
				"rating_count": stats.Count,
			}).Error
	})
}

func (r *ratingRepository) GetByArticleAndUser(articleID, userID string) (*domain.ArticleRating, error) {
	var rating domain.ArticleRating
	err := r.db.Where("article_id = ? AND user_id = ?", articleID, userID).First(&rating).Error
	if err != nil {
		return nil, err
	}
	return &rating, nil
}

func (r *ratingRepository) GetStats(articleID string) (float64, int64, error) {
	var stats struct {
		Avg   float64
		Count int64
	}
	err := r.db.Model(&domain.ArticleRating{}).
		Where("article_id = ?", articleID).
		Select("COALESCE(AVG(score), 0) as avg, COUNT(*) as count").
		Scan(&stats).Error
	return stats.Avg, stats.Count, err
}
