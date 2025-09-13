package repository

import "todo-app/backend/models"

// TaskRepositoryInterface defines the interface for task data access
type TaskRepositoryInterface interface {
	// GetTasks retrieves tasks with filtering and sorting
	GetTasks(filter models.TaskFilter) ([]models.Task, error)

	// GetTaskByID retrieves a single task by ID
	GetTaskByID(id string) (*models.Task, error)

	// CreateTask creates a new task
	CreateTask(task *models.Task) error

	// UpdateTask updates an existing task
	UpdateTask(task *models.Task) error

	// DeleteTask deletes a task by ID
	DeleteTask(id string) error

	// GetTaskStats returns task statistics
	GetTaskStats() (*models.TaskStats, error)

	// Close closes the repository connection
	Close() error
}
