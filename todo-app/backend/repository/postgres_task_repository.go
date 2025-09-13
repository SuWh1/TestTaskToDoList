package repository

import (
	"database/sql"
	"fmt"

	"todo-app/backend/models"
)

// PostgresTaskRepository implements TaskRepositoryInterface for PostgreSQL
type PostgresTaskRepository struct {
	db *sql.DB
}

// NewPostgresTaskRepository creates a new PostgreSQL task repository
func NewPostgresTaskRepository(db *sql.DB) TaskRepositoryInterface {
	return &PostgresTaskRepository{
		db: db,
	}
}

// GetTasks retrieves tasks with filtering and sorting
func (r *PostgresTaskRepository) GetTasks(filter models.TaskFilter) ([]models.Task, error) {
	query := `
		SELECT id, title, done, created_at, priority, due_date 
		FROM tasks 
		WHERE ($1 = 'all' OR ($1 = 'active' AND done = FALSE) OR ($1 = 'completed' AND done = TRUE))
		ORDER BY 
			CASE WHEN $2 = 'priority' THEN priority END DESC,
			CASE WHEN $2 = 'due_date' THEN due_date END ASC NULLS LAST,
			created_at DESC
	`

	rows, err := r.db.Query(query, filter.Status, filter.SortBy)
	if err != nil {
		return nil, fmt.Errorf("failed to query tasks: %w", err)
	}
	defer rows.Close()

	var tasks []models.Task
	for rows.Next() {
		var task models.Task
		var dueDate sql.NullTime

		err := rows.Scan(
			&task.ID,
			&task.Title,
			&task.Done,
			&task.CreatedAt,
			&task.Priority,
			&dueDate,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan task: %w", err)
		}

		// Handle nullable due_date
		if dueDate.Valid {
			task.DueDate = &dueDate.Time
		}

		tasks = append(tasks, task)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating tasks: %w", err)
	}

	return tasks, nil
}

// CreateTask creates a new task
func (r *PostgresTaskRepository) CreateTask(task *models.Task) error {
	query := `
		INSERT INTO tasks (id, title, done, created_at, priority, due_date)
		VALUES ($1, $2, $3, $4, $5, $6)
	`

	var dueDate sql.NullTime
	if task.DueDate != nil {
		dueDate = sql.NullTime{Time: *task.DueDate, Valid: true}
	}

	_, err := r.db.Exec(query,
		task.ID,
		task.Title,
		task.Done,
		task.CreatedAt,
		task.Priority,
		dueDate,
	)

	if err != nil {
		return fmt.Errorf("failed to create task: %w", err)
	}

	return nil
}

// UpdateTask updates an existing task
func (r *PostgresTaskRepository) UpdateTask(task *models.Task) error {
	query := `
		UPDATE tasks 
		SET title = $2, done = $3, priority = $4, due_date = $5
		WHERE id = $1
	`

	var dueDate sql.NullTime
	if task.DueDate != nil {
		dueDate = sql.NullTime{Time: *task.DueDate, Valid: true}
	}

	result, err := r.db.Exec(query,
		task.ID,
		task.Title,
		task.Done,
		task.Priority,
		dueDate,
	)

	if err != nil {
		return fmt.Errorf("failed to update task: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("task with ID %s not found", task.ID)
	}

	return nil
}

// DeleteTask deletes a task by ID
func (r *PostgresTaskRepository) DeleteTask(id string) error {
	query := `DELETE FROM tasks WHERE id = $1`

	result, err := r.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("failed to delete task: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("task with ID %s not found", id)
	}

	return nil
}

// GetTaskStats returns task statistics
func (r *PostgresTaskRepository) GetTaskStats() (*models.TaskStats, error) {
	query := `
		SELECT 
			COUNT(*) as total,
			COUNT(CASE WHEN done = FALSE THEN 1 END) as active,
			COUNT(CASE WHEN done = TRUE THEN 1 END) as completed
		FROM tasks
	`

	var stats models.TaskStats
	err := r.db.QueryRow(query).Scan(&stats.Total, &stats.Active, &stats.Completed)
	if err != nil {
		return nil, fmt.Errorf("failed to get task stats: %w", err)
	}

	return &stats, nil
}

// GetTaskByID retrieves a single task by ID
func (r *PostgresTaskRepository) GetTaskByID(id string) (*models.Task, error) {
	query := `
		SELECT id, title, done, created_at, priority, due_date 
		FROM tasks 
		WHERE id = $1
	`

	var task models.Task
	var dueDate sql.NullTime

	err := r.db.QueryRow(query, id).Scan(
		&task.ID,
		&task.Title,
		&task.Done,
		&task.CreatedAt,
		&task.Priority,
		&dueDate,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("task with ID %s not found", id)
		}
		return nil, fmt.Errorf("failed to get task: %w", err)
	}

	// Handle nullable due_date
	if dueDate.Valid {
		task.DueDate = &dueDate.Time
	}

	return &task, nil
}

// Close closes the database connection
func (r *PostgresTaskRepository) Close() error {
	return r.db.Close()
}
