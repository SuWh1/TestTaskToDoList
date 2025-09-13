import React, { useState } from 'react';

const TaskItem = ({ task, onToggle, onDelete, loading }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggle = async () => {
    try {
      await onToggle(task.id);
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } catch (error) {
      console.error('Failed to delete task:', error);
      setIsDeleting(false);
    }
    setShowDeleteConfirm(false);
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 2: 
        return { 
          color: 'text-red-600', 
          bg: 'theme-bg-secondary theme-border', 
          label: 'High',
          icon: '🔥'
        };
      case 1: 
        return { 
          color: 'text-yellow-600', 
          bg: 'theme-bg-secondary theme-border', 
          label: 'Medium',
          icon: '⚡'
        };
      default: 
        return { 
          color: 'text-green-600', 
          bg: 'theme-bg-secondary theme-border', 
          label: 'Low',
          icon: '🌱'
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const isOverdue = (dueDateString) => {
    if (!dueDateString) return false;
    const dueDate = new Date(dueDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && !task.done;
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const overdue = isOverdue(task.due_date);

  return (
    <>
      <div className={`group hover:theme-bg-secondary transition-all duration-200 p-4 ${task.done ? 'opacity-60' : ''} ${overdue ? 'theme-bg-secondary' : ''}`}>
        <div className="flex items-start space-x-4">
          {/* Checkbox */}
          <div className="pt-1">
            <input
              type="checkbox"
              checked={task.done}
              onChange={handleToggle}
              disabled={loading}
              className="w-5 h-5 text-blue-600 theme-bg-primary theme-border rounded focus:ring-blue-500 focus:ring-2 cursor-pointer disabled:cursor-not-allowed transition-all duration-200"
            />
          </div>
          
          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`font-medium text-lg leading-6 ${task.done ? 'line-through theme-text-muted' : 'theme-text-primary'} transition-all duration-200`}>
                  {task.title}
                </h3>
                
                <div className="flex items-center flex-wrap gap-3 mt-2">
                  {/* Priority Badge */}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${priorityConfig.bg} ${priorityConfig.color}`}>
                    <span className="mr-1">{priorityConfig.icon}</span>
                    {priorityConfig.label}
                  </span>
                  
                  {/* Due Date */}
                  {task.due_date && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${overdue ? 'theme-bg-secondary text-red-600 theme-border' : 'theme-bg-secondary text-blue-600 theme-border'}`}>
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      {formatDate(task.due_date)}
                      {overdue && ' (Overdue)'}
                    </span>
                  )}
                  
                  {/* Created Date */}
                  <span className="text-xs theme-text-muted">
                    Created {formatDate(task.created_at)}
                  </span>
                </div>
              </div>
              
              {/* Delete Button */}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading || isDeleting}
                className="opacity-0 group-hover:opacity-100 ml-4 p-2 theme-text-muted hover:text-red-500 disabled:theme-text-muted disabled:cursor-not-allowed transition-all duration-200 rounded-lg hover:theme-bg-secondary"
                title="Delete task"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="theme-bg-primary rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 theme-bg-secondary rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold theme-text-primary">
                  Delete Task
                </h3>
              </div>
              
              <p className="theme-text-secondary mb-6">
                Are you sure you want to delete <span className="font-medium">"{task.title}"</span>? This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete Task'
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 theme-bg-secondary hover:theme-bg-primary theme-text-primary py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskItem;