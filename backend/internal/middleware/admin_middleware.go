package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		roles, exists := c.Get("roles")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Không tìm thấy thông tin quyền hạn"})
			c.Abort()
			return
		}

		roleList, ok := roles.([]string)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi định dạng quyền hạn"})
			c.Abort()
			return
		}

		isAdmin := false
		for _, role := range roleList {
			if role == "ADMIN" {
				isAdmin = true
				break
			}
		}

		if !isAdmin {
			c.JSON(http.StatusForbidden, gin.H{"error": "Bạn không có quyền truy cập tính năng này"})
			c.Abort()
			return
		}

		c.Next()
	}
}
