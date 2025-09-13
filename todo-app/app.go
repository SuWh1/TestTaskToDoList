package main

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"todo-app/backend/config"
	"todo-app/backend/database"
	"todo-app/backend/models"
	"todo-app/backend/repository"
	"todo-app/backend/services"
)

// App struct
type App struct {
	ctx         context.Context
	taskService *services.TaskService
	db          *sql.DB
}

// NewApp creates a new App application struct
func NewApp() *App {
	// Initialize database configuration
	dbConfig := config.NewDatabaseConfig()

	// Log connection attempt
	fmt.Printf("Attempting to connect to PostgreSQL at %s:%s/%s\n",
		dbConfig.Host, dbConfig.Port, dbConfig.Database)

	// Initialize database connection
	db, err := database.InitDatabase(dbConfig)
	if err != nil {
		fmt.Printf("Database connection failed: %v\n", err)
		fmt.Println("Please ensure PostgreSQL is running and accessible")
		fmt.Printf("Connection string: %s\n", dbConfig.ConnectionString())
		panic(fmt.Errorf("failed to initialize database: %w", err))
	}

	fmt.Println("✅ Successfully connected to PostgreSQL!")

	// Initialize repository and service
	repo := repository.NewPostgresTaskRepository(db)
	taskService := services.NewTaskService(repo)

	return &App{
		taskService: taskService,
		db:          db,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// shutdown is called when the app is shutting down
func (a *App) shutdown(ctx context.Context) {
	if a.db != nil {
		a.db.Close()
	}
}

// AddTask adds a new task
func (a *App) AddTask(title string, priority int, dueDateStr string) (*models.Task, error) {
	var dueDate *time.Time
	if dueDateStr != "" {
		if parsed, err := time.Parse("2006-01-02", dueDateStr); err == nil {
			dueDate = &parsed
		}
	}

	return a.taskService.AddTask(title, models.Priority(priority), dueDate)
}

// DeleteTask deletes a task by ID
func (a *App) DeleteTask(id string) error {
	return a.taskService.DeleteTask(id)
}

// ToggleTask toggles the completion status of a task
func (a *App) ToggleTask(id string) (*models.Task, error) {
	return a.taskService.ToggleTask(id)
}

// GetTasks returns filtered and sorted tasks
func (a *App) GetTasks(status string, sortBy string) ([]models.Task, error) {
	filter := models.TaskFilter{
		Status: status,
		SortBy: sortBy,
	}
	return a.taskService.GetTasks(filter)
}

// GetTaskStats returns task statistics
func (a *App) GetTaskStats() (*models.TaskStats, error) {
	return a.taskService.GetTaskStats()
}
