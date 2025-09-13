package services

import (
	"fmt"
	"sort"
	"strings"
	"time"

	"todo-app/backend/models"
	"todo-app/backend/repository"

	"github.com/google/uuid"
)

// TaskService handles business logic for tasks
type TaskService struct {
	repo *repository.TaskRepository
}

// NewTaskService creates a new task service
func NewTaskService(repo *repository.TaskRepository) *TaskService {
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

	// Load existing tasks
	tasks, err := s.repo.LoadTasks()
	if err != nil {
		return nil, fmt.Errorf("failed to load tasks: %w", err)
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

	// Add to tasks list
	tasks = append(tasks, task)

	// Save tasks
	if err := s.repo.SaveTasks(tasks); err != nil {
		return nil, fmt.Errorf("failed to save tasks: %w", err)
	}

	return &task, nil
}

// DeleteTask deletes a task by ID
func (s *TaskService) DeleteTask(id string) error {
	if id == "" {
		return fmt.Errorf("task ID cannot be empty")
	}

	// Load existing tasks
	tasks, err := s.repo.LoadTasks()
	if err != nil {
		return fmt.Errorf("failed to load tasks: %w", err)
	}

	// Find and remove task
	found := false
	for i, task := range tasks {
		if task.ID == id {
			tasks = append(tasks[:i], tasks[i+1:]...)
			found = true
			break
		}
	}

	if !found {
		return fmt.Errorf("task with ID %s not found", id)
	}

	// Save tasks
	if err := s.repo.SaveTasks(tasks); err != nil {
		return fmt.Errorf("failed to save tasks: %w", err)
	}

	return nil
}

// ToggleTask toggles the completion status of a task
func (s *TaskService) ToggleTask(id string) (*models.Task, error) {
	if id == "" {
		return nil, fmt.Errorf("task ID cannot be empty")
	}

	// Load existing tasks
	tasks, err := s.repo.LoadTasks()
	if err != nil {
		return nil, fmt.Errorf("failed to load tasks: %w", err)
	}

	// Find and toggle task
	var updatedTask *models.Task
	for i, task := range tasks {
		if task.ID == id {
			tasks[i].Done = !tasks[i].Done
			updatedTask = &tasks[i]
			break
		}
	}

	if updatedTask == nil {
		return nil, fmt.Errorf("task with ID %s not found", id)
	}

	// Save tasks
	if err := s.repo.SaveTasks(tasks); err != nil {
		return nil, fmt.Errorf("failed to save tasks: %w", err)
	}

	return updatedTask, nil
}

// GetTasks returns all tasks with optional filtering and sorting
func (s *TaskService) GetTasks(filter models.TaskFilter) ([]models.Task, error) {
	// Load tasks from repository
	tasks, err := s.repo.LoadTasks()
	if err != nil {
		return nil, fmt.Errorf("failed to load tasks: %w", err)
	}

	// Apply status filter
	if filter.Status != "" && filter.Status != "all" {
		var filteredTasks []models.Task
		for _, task := range tasks {
			switch filter.Status {
			case "active":
				if !task.Done {
					filteredTasks = append(filteredTasks, task)
				}
			case "completed":
				if task.Done {
					filteredTasks = append(filteredTasks, task)
				}
			}
		}
		tasks = filteredTasks
	}

	// Apply sorting
	switch filter.SortBy {
	case "priority":
		sort.Slice(tasks, func(i, j int) bool {
			return tasks[i].Priority > tasks[j].Priority // High priority first
		})
	case "due_date":
		sort.Slice(tasks, func(i, j int) bool {
			if tasks[i].DueDate == nil && tasks[j].DueDate == nil {
				return tasks[i].CreatedAt.After(tasks[j].CreatedAt)
			}
			if tasks[i].DueDate == nil {
				return false // Tasks without due date go last
			}
			if tasks[j].DueDate == nil {
				return true
			}
			return tasks[i].DueDate.Before(*tasks[j].DueDate)
		})
	default: // "created_at" or empty
		sort.Slice(tasks, func(i, j int) bool {
			return tasks[i].CreatedAt.After(tasks[j].CreatedAt) // Newest first
		})
	}

	return tasks, nil
}

// GetTaskStats returns statistics about tasks
func (s *TaskService) GetTaskStats() (*models.TaskStats, error) {
	tasks, err := s.repo.LoadTasks()
	if err != nil {
		return nil, fmt.Errorf("failed to load tasks: %w", err)
	}

	stats := &models.TaskStats{
		Total: len(tasks),
	}

	for _, task := range tasks {
		if task.Done {
			stats.Completed++
		} else {
			stats.Active++
		}
	}

	return stats, nil
}
