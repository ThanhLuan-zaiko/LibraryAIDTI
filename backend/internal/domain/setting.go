package domain

import (
	"database/sql/driver"
	"errors"
	"time"

	"github.com/google/uuid"
)

type SystemSetting struct {
	ID        uuid.UUID    `json:"id" gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	Key       string       `json:"key" gorm:"unique;not null;type:varchar(100)"`
	Value     SettingValue `json:"value" gorm:"type:jsonb;not null"`
	UpdatedAt time.Time    `json:"updated_at" gorm:"default:now()"`
}

type SettingValue []byte

func (s SettingValue) Value() (driver.Value, error) {
	if len(s) == 0 {
		return nil, nil
	}
	return string(s), nil
}

func (s *SettingValue) Scan(value interface{}) error {
	if value == nil {
		*s = nil
		return nil
	}
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	*s = make([]byte, len(bytes))
	copy(*s, bytes)
	return nil
}

type SettingRepository interface {
	GetByKey(key string) (*SystemSetting, error)
	GetAll() ([]SystemSetting, error)
	Save(setting *SystemSetting) error
	BatchSave(settings []SystemSetting) error
}

type SettingService interface {
	GetSettings() (map[string]interface{}, error)
	UpdateSettings(settings map[string]interface{}, userID uuid.UUID) error
}
