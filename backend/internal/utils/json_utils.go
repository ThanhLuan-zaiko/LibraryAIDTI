package utils

import (
	"encoding/json"
	"log"
)

func ToJSON(v interface{}) string {
	b, err := json.Marshal(v)
	if err != nil {
		log.Printf("Error marshaling to JSON: %v", err)
		return "{}"
	}
	return string(b)
}
