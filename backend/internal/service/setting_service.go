package service

import (
	"backend/internal/domain"
	"encoding/json"

	"github.com/google/uuid"
)

type settingService struct {
	repo      domain.SettingRepository
	auditServ domain.AuditService
}

func NewSettingService(repo domain.SettingRepository, auditServ domain.AuditService) domain.SettingService {
	return &settingService{repo: repo, auditServ: auditServ}
}

func (s *settingService) GetSettings() (map[string]interface{}, error) {
	settings, err := s.repo.GetAll()
	if err != nil {
		return nil, err
	}

	result := make(map[string]interface{})
	for _, setting := range settings {
		var val interface{}
		if err := json.Unmarshal(setting.Value, &val); err == nil {
			result[setting.Key] = val
		}
	}
	return result, nil
}

func (s *settingService) UpdateSettings(settings map[string]interface{}, userID uuid.UUID) error {
	existing, _ := s.GetSettings()

	var toSave []domain.SystemSetting
	for k, v := range settings {
		valBytes, _ := json.Marshal(v)
		toSave = append(toSave, domain.SystemSetting{
			Key:   k,
			Value: domain.SettingValue(valBytes),
		})
	}

	err := s.repo.BatchSave(toSave)
	if err == nil {
		// Log to SystemLog
		s.auditServ.LogSystemEvent(&userID, "UPDATE_SETTINGS", "system_settings", uuid.Nil, existing, settings)
	}
	return err
}
