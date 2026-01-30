package worker

import (
	"backend/internal/domain"
	"log"
	"strconv"
	"time"
)

type LogWorker struct {
	settingServ domain.SettingService
	auditServ   domain.AuditService
}

func NewLogWorker(settingServ domain.SettingService, auditServ domain.AuditService) *LogWorker {
	return &LogWorker{
		settingServ: settingServ,
		auditServ:   auditServ,
	}
}

func (w *LogWorker) Start() {
	log.Println("Starting Log Cleanup Worker...")

	// Run immediately on start
	w.runCleanup()

	// Then run every 24 hours
	ticker := time.NewTicker(24 * time.Hour)
	go func() {
		for range ticker.C {
			w.runCleanup()
		}
	}()
}

func (w *LogWorker) runCleanup() {
	settings, err := w.settingServ.GetSettings()
	if err != nil {
		log.Printf("LogWorker: Failed to fetch settings: %v", err)
		return
	}

	retentionDays := 30 // Default
	if val, ok := settings["log_retention_days"]; ok {
		switch v := val.(type) {
		case float64:
			retentionDays = int(v)
		case string:
			if i, err := strconv.Atoi(v); err == nil {
				retentionDays = i
			}
		case int:
			retentionDays = v
		}
	}

	log.Printf("LogWorker: Running cleanup with retention: %d days", retentionDays)
	if err := w.auditServ.CleanupOldLogs(retentionDays); err != nil {
		log.Printf("LogWorker: Cleanup failed: %v", err)
	} else {
		log.Println("LogWorker: Cleanup completed successfully")
	}
}
