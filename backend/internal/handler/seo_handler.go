package handler

import (
	"backend/internal/domain"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type SeoHandler struct {
	service domain.SeoService
}

func NewSeoHandler(service domain.SeoService) *SeoHandler {
	return &SeoHandler{service: service}
}

func (h *SeoHandler) GetRedirects(c *gin.Context) {

	type QueryParams struct {
		Page   int    `form:"page,default=1"`
		Limit  int    `form:"limit,default=25"`
		Search string `form:"search"`
	}
	var params QueryParams
	if err := c.ShouldBindQuery(&params); err != nil {
		// Fallback defaults are handled by tag `default`
	}
	// Clamp limits
	if params.Limit > 100 {
		params.Limit = 100
	}
	if params.Limit < 1 {
		params.Limit = 25
	}
	if params.Page < 1 {
		params.Page = 1
	}

	redirects, total, err := h.service.GetAllRedirects(params.Page, params.Limit, params.Search)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  redirects,
		"total": total,
		"page":  params.Page,
		"limit": params.Limit,
	})
}

func (h *SeoHandler) CreateRedirect(c *gin.Context) {
	var req struct {
		FromSlug string `json:"from_slug" binding:"required"`
		ToSlug   string `json:"to_slug" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.CreateRedirect(req.FromSlug, req.ToSlug); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Redirect created successfully"})
}

func (h *SeoHandler) DeleteRedirect(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	if err := h.service.DeleteRedirect(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Redirect deleted successfully"})
}

func (h *SeoHandler) UpdateRedirect(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var req struct {
		FromSlug string `json:"from_slug" binding:"required"`
		ToSlug   string `json:"to_slug" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.UpdateRedirect(id, req.FromSlug, req.ToSlug); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Redirect updated successfully"})
}

func (h *SeoHandler) GetArticleRedirects(c *gin.Context) {
	type QueryParams struct {
		Page   int    `form:"page,default=1"`
		Limit  int    `form:"limit,default=25"`
		Search string `form:"search"`
	}
	var params QueryParams
	if err := c.ShouldBindQuery(&params); err != nil {
		// defaults handled
	}

	if params.Limit > 100 {
		params.Limit = 100
	}
	if params.Limit < 1 {
		params.Limit = 25
	}
	if params.Page < 1 {
		params.Page = 1
	}

	redirects, total, err := h.service.GetAllArticleRedirects(params.Page, params.Limit, params.Search)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  redirects,
		"total": total,
		"page":  params.Page,
		"limit": params.Limit,
	})
}

func (h *SeoHandler) GetTrends(c *gin.Context) {
	monthsStr := c.DefaultQuery("months", "6")
	months := 6
	var m int
	if _, err := fmt.Sscanf(monthsStr, "%d", &m); err == nil {
		months = m
	}

	if months < 1 {
		months = 6
	}
	if months > 12 {
		months = 12
	}

	trends, err := h.service.GetSeoTrends(months)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": trends,
	})
}
