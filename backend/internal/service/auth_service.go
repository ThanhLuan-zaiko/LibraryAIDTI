package service

import (
	"backend/internal/domain"
	"backend/internal/repository"
	"backend/internal/utils"
	"errors"
	"time"

	"github.com/google/uuid"
)

type AuthService struct {
	repo *repository.AuthRepository
}

func NewAuthService(repo *repository.AuthRepository) *AuthService {
	return &AuthService{repo: repo}
}

func (s *AuthService) Register(email, password, fullName string) error {
	// Check if user already exists
	existingUser, _ := s.repo.GetUserByEmail(email)
	if existingUser != nil {
		return errors.New("Tài khoản đã tồn tại")
	}

	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return err
	}

	// Get default role SUBSCRIBER
	subscriberRole, err := s.repo.GetRoleByName("SUBSCRIBER")
	if err != nil {
		return errors.New("không tìm thấy vai trò mặc định SUBSCRIBER")
	}

	user := &domain.User{
		Email:        email,
		PasswordHash: hashedPassword,
		FullName:     fullName,
		Roles:        []domain.Role{*subscriberRole},
	}

	return s.repo.CreateUser(user)
}

type LoginResponse struct {
	AccessToken  string      `json:"access_token"`
	RefreshToken string      `json:"refresh_token"`
	User         domain.User `json:"user"`
}

func (s *AuthService) Login(email, password, ip, userAgent string) (*LoginResponse, error) {
	user, err := s.repo.GetUserByEmail(email)
	if err != nil {
		return nil, errors.New("email hoặc mật khẩu không chính xác")
	}

	match, err := utils.VerifyPassword(password, user.PasswordHash)
	if err != nil || !match {
		return nil, errors.New("email hoặc mật khẩu không chính xác")
	}

	roles := make([]string, len(user.Roles))
	for i, r := range user.Roles {
		roles[i] = r.Name
	}

	accessToken, err := utils.GenerateToken(user.ID, user.Email, roles, time.Hour*24) // 24h for access token
	if err != nil {
		return nil, err
	}

	refreshTokenVal, err := utils.GenerateRefreshToken()
	if err != nil {
		return nil, err
	}

	session := &domain.UserSession{
		UserID:       user.ID,
		RefreshToken: refreshTokenVal,
		IPAddress:    ip,
		UserAgent:    userAgent,
		ExpiresAt:    time.Now().Add(time.Hour * 24 * 7), // 7 days
	}

	if err := s.repo.CreateSession(session); err != nil {
		return nil, err
	}

	return &LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshTokenVal,
		User:         *user,
	}, nil
}

func (s *AuthService) RefreshToken(refreshToken string) (string, error) {
	session, err := s.repo.GetSessionByToken(refreshToken)
	if err != nil {
		return "", errors.New("mã token làm mới không hợp lệ")
	}

	if time.Now().After(session.ExpiresAt) {
		s.repo.DeleteSession(refreshToken)
		return "", errors.New("mã token làm mới đã hết hạn")
	}

	user, err := s.repo.GetUserByID(session.UserID)
	if err != nil {
		return "", err
	}

	roles := make([]string, len(user.Roles))
	for i, r := range user.Roles {
		roles[i] = r.Name
	}

	return utils.GenerateToken(user.ID, user.Email, roles, time.Hour*24)
}

func (s *AuthService) UpdateProfile(userID uuid.UUID, fullName string) error {
	user, err := s.repo.GetUserByID(userID)
	if err != nil {
		return errors.New("không tìm thấy người dùng")
	}

	user.FullName = fullName
	return s.repo.UpdateUser(user)
}

func (s *AuthService) ChangePassword(userID uuid.UUID, oldPassword, newPassword string) error {
	user, err := s.repo.GetUserByID(userID)
	if err != nil {
		return errors.New("không tìm thấy người dùng")
	}

	match, err := utils.VerifyPassword(oldPassword, user.PasswordHash)
	if err != nil || !match {
		return errors.New("mật khẩu cũ không chính xác")
	}

	hashedPassword, err := utils.HashPassword(newPassword)
	if err != nil {
		return err
	}

	user.PasswordHash = hashedPassword
	return s.repo.UpdateUser(user)
}
