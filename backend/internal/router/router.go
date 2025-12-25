package router

import (
	"backend/internal/handler"
	"backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

type Router struct {
	bookHandler *handler.BookHandler
	authHandler *handler.AuthHandler
}

func NewRouter(bookHandler *handler.BookHandler, authHandler *handler.AuthHandler) *Router {
	return &Router{
		bookHandler: bookHandler,
		authHandler: authHandler,
	}
}

func (r *Router) Setup(engine *gin.Engine) {
	// CORS Middleware (simplified)
	engine.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	v1 := engine.Group("/api/v1")
	{
		// Auth routes
		auth := v1.Group("/auth")
		{
			auth.POST("/register", r.authHandler.Register)
			auth.POST("/login", r.authHandler.Login)
			auth.POST("/refresh", r.authHandler.RefreshToken)
		}

		// Book routes
		books := v1.Group("/books")
		{
			books.POST("", r.bookHandler.CreateBook)
			books.GET("", r.bookHandler.GetBooks)
			books.GET("/:id", r.bookHandler.GetBook)
		}

		// Protected routes
		protected := v1.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.PUT("/auth/profile", r.authHandler.UpdateProfile)
			protected.PUT("/auth/password", r.authHandler.ChangePassword)

			protected.GET("/protected/profile", func(c *gin.Context) {
				email, _ := c.Get("email")
				c.JSON(200, gin.H{"message": "Welcome!", "email": email})
			})
		}
	}
}
