package database

import (
	"database/sql"
	"embed"
	"fmt"

	"todo-app/backend/config"

	_ "github.com/lib/pq" // PostgreSQL driver
)

//go:embed schema.sql
var schemaFS embed.FS

// InitDatabase initializes the PostgreSQL database connection and schema
func InitDatabase(config *config.DatabaseConfig) (*sql.DB, error) {
	// Open database connection
	db, err := sql.Open("postgres", config.ConnectionString())
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %w", err)
	}

	// Test the connection
	if err := db.Ping(); err != nil {
		db.Close()
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	// Configure connection pool
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)

	// Initialize schema
	if err := initSchema(db); err != nil {
		db.Close()
		return nil, fmt.Errorf("failed to initialize schema: %w", err)
	}

	return db, nil
}

// initSchema reads and executes the schema.sql file
func initSchema(db *sql.DB) error {
	// Read schema file
	schemaBytes, err := schemaFS.ReadFile("schema.sql")
	if err != nil {
		return fmt.Errorf("failed to read schema file: %w", err)
	}

	// Execute schema
	if _, err := db.Exec(string(schemaBytes)); err != nil {
		return fmt.Errorf("failed to execute schema: %w", err)
	}

	return nil
}
