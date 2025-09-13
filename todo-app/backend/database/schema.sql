-- PostgreSQL schema for todo-app
-- This file contains the database schema for the todo application

-- Create database (run this manually if needed)
-- CREATE DATABASE todoapp;

-- Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    done BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    priority INTEGER NOT NULL DEFAULT 0,
    due_date TIMESTAMP WITH TIME ZONE NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_done ON tasks(done);

-- Comments for documentation
COMMENT ON TABLE tasks IS 'Stores todo tasks for the application';
COMMENT ON COLUMN tasks.id IS 'Unique identifier for the task (UUID)';
COMMENT ON COLUMN tasks.title IS 'Title/description of the task';
COMMENT ON COLUMN tasks.done IS 'Whether the task is completed';
COMMENT ON COLUMN tasks.created_at IS 'When the task was created';
COMMENT ON COLUMN tasks.priority IS 'Task priority: 0=Low, 1=Medium, 2=High';
COMMENT ON COLUMN tasks.due_date IS 'Optional due date for the task';