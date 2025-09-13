package services

import (
	"fmt"
	"strings"
	"time"

	"todo-app/backend/models"
	"todo-app/backend/repository"

	"github.com/google/uuid"
)

// TaskService handles business logic for tasks
type TaskService struct {
	repo repository.TaskRepositoryInterface
}

// NewTaskService creates a new task service
func NewTaskService(repo repository.TaskRepositoryInterface) *TaskService {
	return &TaskService{
		repo: repo,
	}
}

// AddTask adds a new task
func (s *TaskService) AddTask(title string, priority models.Priority, dueDate *time.Time) (*models.Task, error) {
	// Validate title
	title = strings.TrimSpace(title)
	if title == "" {
		return nil, fmt.Errorf("task title cannot be empty")
	}

	// Create new task
	task := models.Task{
		ID:        uuid.New().String(),
		Title:     title,
		Done:      false,
		CreatedAt: time.Now(),
		Priority:  priority,
		DueDate:   dueDate,
	}

	// Create task in repository
	if err := s.repo.CreateTask(&task); err != nil {
		return nil, fmt.Errorf("failed to create task: %w", err)
	}

	return &task, nil
}

// DeleteTask deletes a task by ID
func (s *TaskService) DeleteTask(id string) error {
	if id == "" {
		return fmt.Errorf("task ID cannot be empty")
	}

	// Delete task from repository
	if err := s.repo.DeleteTask(id); err != nil {
		return fmt.Errorf("failed to delete task: %w", err)
	}

	return nil
}

// ToggleTask toggles the completion status of a task
func (s *TaskService) ToggleTask(id string) (*models.Task, error) {
	if id == "" {
		return nil, fmt.Errorf("task ID cannot be empty")
	}

	// Get task from repository
	task, err := s.repo.GetTaskByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get task: %w", err)
	}

	// Toggle completion status
	task.Done = !task.Done

	// Update task in repository
	if err := s.repo.UpdateTask(task); err != nil {
		return nil, fmt.Errorf("failed to update task: %w", err)
	}

	return task, nil
}

// GetTasks returns all tasks with optional filtering and sorting
func (s *TaskService) GetTasks(filter models.TaskFilter) ([]models.Task, error) {
	// Get tasks from repository with filtering and sorting
	tasks, err := s.repo.GetTasks(filter)
	if err != nil {
		return nil, fmt.Errorf("failed to get tasks: %w", err)
	}

	return tasks, nil
}

// GetTaskStats returns statistics about tasks
func (s *TaskService) GetTaskStats() (*models.TaskStats, error) {
	stats, err := s.repo.GetTaskStats()
	if err != nil {
		return nil, fmt.Errorf("failed to get task stats: %w", err)
	}

	return stats, nil
}
