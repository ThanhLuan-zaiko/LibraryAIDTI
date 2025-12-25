package repository

import (
	"backend/internal/domain"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AuthRepository struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) *AuthRepository {
	return &AuthRepository{db: db}
}

func (r *AuthRepository) CreateUser(user *domain.User) error {
	return r.db.Create(user).Error
}

func (r *AuthRepository) GetUserByEmail(email string) (*domain.User, error) {
	var user domain.User
	err := r.db.Preload("Roles").Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *AuthRepository) GetUserByID(id uuid.UUID) (*domain.User, error) {
	var user domain.User
	err := r.db.Preload("Roles").First(&user, id).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *AuthRepository) GetRoleByName(name string) (*domain.Role, error) {
	var role domain.Role
	err := r.db.Where("name = ?", name).First(&role).Error
	if err != nil {
		return nil, err
	}
	return &role, nil
}

func (r *AuthRepository) CreateSession(session *domain.UserSession) error {
	return r.db.Create(session).Error
}

func (r *AuthRepository) GetSessionByToken(token string) (*domain.UserSession, error) {
	var session domain.UserSession
	err := r.db.Where("refresh_token = ?", token).First(&session).Error
	if err != nil {
		return nil, err
	}
	return &session, nil
}

func (r *AuthRepository) DeleteSession(token string) error {
	return r.db.Where("refresh_token = ?", token).Delete(&domain.UserSession{}).Error
}

func (r *AuthRepository) UpdateUser(user *domain.User) error {
	return r.db.Save(user).Error
}
