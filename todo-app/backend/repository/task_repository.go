package repository

import (
	"encoding/json"
	"os"
	"path/filepath"

	"todo-app/backend/models"
)

// TaskRepository handles task persistence
type TaskRepository struct {
	filePath string
}

// NewTaskRepository creates a new task repository
func NewTaskRepository() *TaskRepository {
	// Create data directory if it doesn't exist
	dataDir := filepath.Join(".", "data")
	os.MkdirAll(dataDir, 0755)

	return &TaskRepository{
		filePath: filepath.Join(dataDir, "tasks.json"),
	}
}

// LoadTasks loads tasks from JSON file
func (r *TaskRepository) LoadTasks() ([]models.Task, error) {
	// Check if file exists
	if _, err := os.Stat(r.filePath); os.IsNotExist(err) {
		// Return empty slice if file doesn't exist
		return []models.Task{}, nil
	}

	// Read file
	data, err := os.ReadFile(r.filePath)
	if err != nil {
		return nil, err
	}

	// Parse JSON
	var tasks []models.Task
	if err := json.Unmarshal(data, &tasks); err != nil {
		return nil, err
	}

	return tasks, nil
}

// SaveTasks saves tasks to JSON file
func (r *TaskRepository) SaveTasks(tasks []models.Task) error {
	// Ensure data directory exists
	dataDir := filepath.Dir(r.filePath)
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		return err
	}

	// Marshal tasks to JSON
	data, err := json.MarshalIndent(tasks, "", "  ")
	if err != nil {
		return err
	}

	// Write to file
	return os.WriteFile(r.filePath, data, 0644)
}
