package handler

import (
	apperrors "backend/internal/core/error"
	"backend/internal/core/response"
	"backend/internal/domain"
	"backend/internal/middleware"
	"backend/internal/ws"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type TagHandler struct {
	service domain.TagService
	cache   *middleware.ResponseCache
	hub     *ws.Hub
}

func NewTagHandler(service domain.TagService, cache *middleware.ResponseCache, hub *ws.Hub) *TagHandler {
	return &TagHandler{
		service: service,
		cache:   cache,
		hub:     hub,
	}
}

func (h *TagHandler) CreateTag(c *gin.Context) {
	var tag domain.Tag
	if err := c.ShouldBindJSON(&tag); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Extract userID from context
	userIDStr, _ := c.Get("user_id")
	userID, _ := userIDStr.(uuid.UUID)

	if err := h.service.CreateTag(&tag, userID); err != nil {
		if apperrors.IsUniqueConstraintViolation(err) {
			response.Error(c, apperrors.NewConflict("Thẻ với tên hoặc slug này đã tồn tại", err))
			return
		}
		response.Error(c, apperrors.NewInternalError(err))
		return
	}

	// Invalidate cache and broadcast update
	h.cache.ClearByPrefix("/api/v1/tags")
	h.cache.ClearByPrefix("/api/v1/admin")
	h.hub.BroadcastEvent("admin_data_updated", gin.H{"module": "tags", "action": "create"})

	c.JSON(http.StatusCreated, tag)
}

func (h *TagHandler) GetTags(c *gin.Context) {
	pageStr := c.Query("page")
	limitStr := c.Query("limit")
	search := c.Query("q")
	sortBy := c.Query("sort")
	order := c.Query("order")

	if pageStr != "" || limitStr != "" || search != "" || sortBy != "" || order != "" {
		page, _ := strconv.Atoi(pageStr)
		limit, _ := strconv.Atoi(limitStr)

		result, err := h.service.GetTagList(page, limit, search, sortBy, order)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, result)
		return
	}

	tags, err := h.service.GetTags()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tags)
}

func (h *TagHandler) GetTag(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		tag, err := h.service.GetTagBySlug(idStr)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Tag not found"})
			return
		}
		c.JSON(http.StatusOK, tag)
		return
	}

	tag, err := h.service.GetTagByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tag not found"})
		return
	}
	c.JSON(http.StatusOK, tag)
}

func (h *TagHandler) GetStats(c *gin.Context) {
	limitStr := c.Query("limit")
	limit := 20 // Default limit
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}

	stats, err := h.service.GetTagStats(limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, stats)
}

func (h *TagHandler) UpdateTag(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var tag domain.Tag
	if err := c.ShouldBindJSON(&tag); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	tag.ID = id

	// Extract userID from context
	userIDStr, _ := c.Get("user_id")
	userID, _ := userIDStr.(uuid.UUID)

	if err := h.service.UpdateTag(&tag, userID); err != nil {
		if apperrors.IsUniqueConstraintViolation(err) {
			response.Error(c, apperrors.NewConflict("Thẻ với tên hoặc slug này đã tồn tại", err))
			return
		}
		response.Error(c, apperrors.NewInternalError(err))
		return
	}

	// Invalidate cache and broadcast update
	h.cache.ClearByPrefix("/api/v1/tags")
	h.cache.ClearByPrefix("/api/v1/articles") // Articles might be filtered by tags
	h.cache.ClearByPrefix("/api/v1/admin")
	h.hub.BroadcastEvent("admin_data_updated", gin.H{"module": "tags", "action": "update"})

	c.JSON(http.StatusOK, tag)
}

func (h *TagHandler) DeleteTag(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	// Extract userID from context
	userIDStr, _ := c.Get("user_id")
	userID, _ := userIDStr.(uuid.UUID)

	if err := h.service.DeleteTag(id, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Invalidate cache and broadcast update
	h.cache.ClearByPrefix("/api/v1/tags")
	h.cache.ClearByPrefix("/api/v1/articles")
	h.cache.ClearByPrefix("/api/v1/admin")
	h.hub.BroadcastEvent("admin_data_updated", gin.H{"module": "tags", "action": "delete"})

	c.JSON(http.StatusOK, gin.H{"message": "Tag deleted successfully"})
}
