package models

import (
	"time"
)

// Priority represents the priority level of a task
type Priority int

const (
	Low Priority = iota
	Medium
	High
)

// String returns the string representation of priority
func (p Priority) String() string {
	switch p {
	case Low:
		return "Low"
	case Medium:
		return "Medium"
	case High:
		return "High"
	default:
		return "Low"
	}
}

// Task represents a todo task
type Task struct {
	ID        string     `json:"id"`
	Title     string     `json:"title"`
	Done      bool       `json:"done"`
	CreatedAt time.Time  `json:"created_at"`
	Priority  Priority   `json:"priority"`
	DueDate   *time.Time `json:"due_date,omitempty"`
}

// TaskFilter represents filter options for tasks
type TaskFilter struct {
	Status string // "all", "active", "completed"
	SortBy string // "created_at", "priority", "due_date"
}

// TaskStats represents statistics about tasks
type TaskStats struct {
	Total     int `json:"total"`
	Active    int `json:"active"`
	Completed int `json:"completed"`
}
