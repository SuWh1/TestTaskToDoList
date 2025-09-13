import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onToggle, onDelete, loading, filter, onFilterChange, sortBy, onSortChange, stats }) => {
  const filterOptions = [
    { value: 'all', label: 'All Tasks', icon: '📋' },
    { value: 'active', label: 'Active', icon: '⏳' },
    { value: 'completed', label: 'Completed', icon: '✅' }
  ];

  const sortOptions = [
    { value: 'created_at', label: 'Date Created', icon: '📅' },
    { value: 'priority', label: 'Priority', icon: '🔥' },
    { value: 'due_date', label: 'Due Date', icon: '⏰' }
  ];

  return (
    <div className="theme-bg-primary rounded-xl shadow-lg theme-border border overflow-hidden">
      {/* Header with Stats and Controls */}
      <div className="theme-bg-secondary p-6 theme-border border-b">
        {/* Stats Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold theme-text-primary flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Your Tasks
          </h2>
          
          <div className="flex items-center space-x-6">
            <div className="text-center theme-bg-primary px-4 py-2 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{stats?.total || 0}</div>
              <div className="text-xs theme-text-muted font-medium">Total</div>
            </div>
            <div className="text-center theme-bg-primary px-4 py-2 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-yellow-600">{stats?.active || 0}</div>
              <div className="text-xs theme-text-muted font-medium">Active</div>
            </div>
            <div className="text-center theme-bg-primary px-4 py-2 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">{stats?.completed || 0}</div>
              <div className="text-xs theme-text-muted font-medium">Done</div>
            </div>
          </div>
        </div>
        
        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium theme-text-secondary mb-2">
              Filter Tasks
            </label>
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => onFilterChange(e.target.value)}
                className="w-full px-4 py-2 theme-border border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent theme-bg-primary theme-text-primary text-sm appearance-none cursor-pointer"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 theme-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium theme-text-secondary mb-2">
              Sort By
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full px-4 py-2 theme-border border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent theme-bg-primary theme-text-primary text-sm appearance-none cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 theme-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Task List */}
      <div className="divide-y theme-border">
        {tasks.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="w-24 h-24 mx-auto mb-4 theme-text-muted">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium theme-text-primary mb-2">
              {filter === 'active' ? 'No active tasks' : 
               filter === 'completed' ? 'No completed tasks yet' : 
               'No tasks yet'}
            </h3>
            <p className="theme-text-muted max-w-sm mx-auto">
              {filter === 'active' ? 'All your tasks are completed! 🎉' : 
               filter === 'completed' ? 'Complete some tasks to see them here.' : 
               'Add your first task above to get started organizing your work.'}
            </p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">{tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
                loading={loading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;