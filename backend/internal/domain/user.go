package domain

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID            uuid.UUID  `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	Email         string     `gorm:"unique;not null" json:"email"`
	PasswordHash  string     `gorm:"not null" json:"-"`
	FullName      string     `json:"full_name"`
	AvatarURL     string     `json:"avatar_url"`
	IsActive      bool       `gorm:"default:true" json:"is_active"`
	EmailVerified bool       `gorm:"default:false" json:"email_verified"`
	LastLoginAt   *time.Time `json:"last_login_at"`
	CreatedAt     time.Time  `gorm:"default:now()" json:"created_at"`
	UpdatedAt     time.Time  `gorm:"default:now()" json:"updated_at"`
	Roles         []Role     `gorm:"many2many:user_roles;" json:"roles"`
}

type Role struct {
	ID          uuid.UUID    `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	Name        string       `gorm:"unique;not null" json:"name"`
	Description string       `json:"description"`
	Permissions []Permission `gorm:"many2many:role_permissions;" json:"permissions"`
}

type Permission struct {
	ID          uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	Code        string    `gorm:"unique;not null" json:"code"`
	Description string    `json:"description"`
}

type UserRole struct {
	UserID uuid.UUID `gorm:"type:uuid;primaryKey"`
	RoleID uuid.UUID `gorm:"type:uuid;primaryKey"`
}

type RolePermission struct {
	RoleID       uuid.UUID `gorm:"type:uuid;primaryKey"`
	PermissionID uuid.UUID `gorm:"type:uuid;primaryKey"`
}
