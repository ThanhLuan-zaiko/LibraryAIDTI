package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// RequestSizeMiddleware limits the size of the request body
func RequestSizeMiddleware(maxSize int64) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.ContentLength > maxSize {
			c.JSON(http.StatusRequestEntityTooLarge, gin.H{
				"error": "Dữ liệu gửi lên quá lớn. Vui lòng giảm bớt kích thước.",
			})
			c.Abort()
			return
		}
		c.Next()
	}
}
