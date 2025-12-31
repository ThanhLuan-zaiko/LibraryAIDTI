package utils

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/nickalie/go-webpbin"
)

// ImageProcessor handles image conversion and optimization
type ImageProcessor struct {
	MaxWidth  int
	MaxHeight int
	Quality   int
}

// NewImageProcessor creates a new image processor with default settings
func NewImageProcessor() *ImageProcessor {
	return &ImageProcessor{
		MaxWidth:  1920,
		MaxHeight: 1080,
		Quality:   85,
	}
}

// ProcessBase64Image converts a base64 image to WebP and returns the file path
func (p *ImageProcessor) ProcessBase64Image(base64Data, articleID string) (string, error) {
	// Decode base64
	data, err := p.decodeBase64(base64Data)
	if err != nil {
		return "", fmt.Errorf("failed to decode base64: %w", err)
	}

	// Decode image
	img, _, err := image.Decode(bytes.NewReader(data))
	if err != nil {
		return "", fmt.Errorf("failed to decode image: %w", err)
	}

	// Resize if needed
	img = p.resizeIfNeeded(img)

	// Generate filename and path
	filename := p.generateFilename()
	relativePath := filepath.Join("uploads", "articles", articleID, filename)
	fullPath := filepath.Join(".", relativePath)

	// Create directory if not exists
	dir := filepath.Dir(fullPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return "", fmt.Errorf("failed to create directory: %w", err)
	}

	// Convert to WebP and save
	if err := webpbin.NewCWebP().
		Quality(uint(p.Quality)).
		InputImage(img).
		OutputFile(fullPath).
		Run(); err != nil {
		return "", fmt.Errorf("failed to encode to WebP: %w", err)
	}

	return "/" + filepath.ToSlash(relativePath), nil
}

// ProcessImageFile processes an uploaded file and converts it to WebP
func (p *ImageProcessor) ProcessImageFile(file io.Reader, articleID string) (string, error) {
	// Read file data
	data, err := io.ReadAll(file)
	if err != nil {
		return "", fmt.Errorf("failed to read file: %w", err)
	}

	// Decode image
	img, _, err := image.Decode(bytes.NewReader(data))
	if err != nil {
		return "", fmt.Errorf("failed to decode image: %w", err)
	}

	// Resize if needed
	img = p.resizeIfNeeded(img)

	// Generate filename and path
	filename := p.generateFilename()
	relativePath := filepath.Join("uploads", "articles", articleID, filename)
	fullPath := filepath.Join(".", relativePath)

	// Create directory if not exists
	dir := filepath.Dir(fullPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return "", fmt.Errorf("failed to create directory: %w", err)
	}

	// Convert to WebP and save
	if err := webpbin.NewCWebP().
		Quality(uint(p.Quality)).
		InputImage(img).
		OutputFile(fullPath).
		Run(); err != nil {
		return "", fmt.Errorf("failed to encode to WebP: %w", err)
	}

	return "/" + filepath.ToSlash(relativePath), nil
}

// decodeBase64 decodes base64 string and strips data URL prefix if present
func (p *ImageProcessor) decodeBase64(base64Data string) ([]byte, error) {
	// Remove data URL prefix if present (e.g., "data:image/png;base64,")
	if strings.Contains(base64Data, ",") {
		parts := strings.SplitN(base64Data, ",", 2)
		if len(parts) == 2 {
			base64Data = parts[1]
		}
	}

	return base64.StdEncoding.DecodeString(base64Data)
}

// resizeIfNeeded resizes image if it exceeds max dimensions while maintaining aspect ratio
func (p *ImageProcessor) resizeIfNeeded(img image.Image) image.Image {
	bounds := img.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()

	// Check if resize is needed
	if width <= p.MaxWidth && height <= p.MaxHeight {
		return img
	}

	// Calculate new dimensions maintaining aspect ratio
	var newWidth, newHeight int
	aspectRatio := float64(width) / float64(height)

	if width > height {
		newWidth = p.MaxWidth
		newHeight = int(float64(newWidth) / aspectRatio)
	} else {
		newHeight = p.MaxHeight
		newWidth = int(float64(newHeight) * aspectRatio)
	}

	// Create resized image
	resized := image.NewRGBA(image.Rect(0, 0, newWidth, newHeight))

	// Simple nearest-neighbor scaling
	for y := 0; y < newHeight; y++ {
		for x := 0; x < newWidth; x++ {
			srcX := x * width / newWidth
			srcY := y * height / newHeight
			resized.Set(x, y, img.At(srcX, srcY))
		}
	}

	return resized
}

// generateFilename generates a unique filename for the image
func (p *ImageProcessor) generateFilename() string {
	timestamp := time.Now().UnixMilli()
	shortID := uuid.New().String()[:8]
	return fmt.Sprintf("image-%d-%s.webp", timestamp, shortID)
}

// CleanupArticleImages removes all images for a specific article
func (p *ImageProcessor) CleanupArticleImages(articleID string) error {
	dirPath := filepath.Join("uploads", "articles", articleID)
	return os.RemoveAll(dirPath)
}
