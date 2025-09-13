import React, { useState, useEffect } from 'react';
import './style.css';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import ThemeToggle from './components/ThemeToggle';
import { AddTask, DeleteTask, ToggleTask, GetTasks, GetTaskStats } from "../wailsjs/go/main/App";

function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');

  // Load tasks and stats
  const loadTasks = async () => {
    try {
      setLoading(true);
      const [tasksData, statsData] = await Promise.all([
        GetTasks(filter, sortBy),
        GetTaskStats()
      ]);
      setTasks(tasksData || []);
      setStats(statsData || { total: 0, active: 0, completed: 0 });
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load tasks on component mount and when filter/sort changes
  useEffect(() => {
    loadTasks();
  }, [filter, sortBy]);

  // Add task
  const handleAddTask = async (title, priority, dueDate) => {
    try {
      setLoading(true);
      await AddTask(title, priority, dueDate);
      await loadTasks(); // Reload to get updated list
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion
  const handleToggleTask = async (id) => {
    try {
      await ToggleTask(id);
      await loadTasks(); // Reload to get updated list
    } catch (error) {
      console.error('Failed to toggle task:', error);
      throw error;
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      await DeleteTask(id);
      await loadTasks(); // Reload to get updated list
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen theme-bg-primary transition-all duration-300">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-blue-300/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-purple-300/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ToDo-List-TZ
                </h1>
              </div>
              <p className="theme-text-secondary text-lg ml-1">
                Keep track of ur tasks efficiently
              </p>
            </div>
            <ThemeToggle />
          </div>

          {/* Main content area */}
          <div className="space-y-6">
            {/* Task Input */}
            <div className="theme-bg-secondary backdrop-blur-xl rounded-2xl theme-border border shadow-xl">
              <TaskInput 
                onAddTask={handleAddTask} 
                loading={loading} 
              />
            </div>

            {/* Task List */}
            <div className="theme-bg-secondary backdrop-blur-xl rounded-2xl theme-border border shadow-xl overflow-hidden">
              <TaskList
                tasks={tasks}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                loading={loading}
                filter={filter}
                onFilterChange={setFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                stats={stats}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
