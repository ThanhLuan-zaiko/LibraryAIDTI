package domain

import (
	"time"

	"github.com/google/uuid"
)

type UserSession struct {
	ID           uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	UserID       uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	RefreshToken string    `gorm:"unique;not null" json:"refresh_token"`
	IPAddress    string    `json:"ip_address"`
	UserAgent    string    `json:"user_agent"`
	ExpiresAt    time.Time `gorm:"not null" json:"expires_at"`
	CreatedAt    time.Time `gorm:"default:now()" json:"created_at"`
}
