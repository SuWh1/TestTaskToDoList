import React, { useState } from 'react';

const TaskInput = ({ onAddTask, loading }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(0); // 0 = Low, 1 = Medium, 2 = High
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await onAddTask(title.trim(), priority, dueDate);
      setTitle('');
      setPriority(0);
      setDueDate('');
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const priorityOptions = [
    { value: 0, label: 'Low', color: 'text-green-600', bgColor: 'theme-bg-primary theme-border' },
    { value: 1, label: 'Medium', color: 'text-yellow-600', bgColor: 'theme-bg-primary theme-border' },
    { value: 2, label: 'High', color: 'text-red-600', bgColor: 'theme-bg-primary theme-border' }
  ];

  const currentPriority = priorityOptions[priority];

  return (
    <div className="theme-bg-primary rounded-xl shadow-lg theme-border border p-6 mb-8">
      <h2 className="text-lg font-semibold theme-text-primary mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add New Task
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Title */}
        <div>
          <label className="block text-sm font-medium theme-text-secondary mb-2">
            Task Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-4 py-3 theme-border border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent theme-bg-primary theme-text-primary transition-all duration-200"
            disabled={loading}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Priority Selection */}
          <div>
            <label className="block text-sm font-medium theme-text-secondary mb-2">
              Priority Level
            </label>
            <div className="relative">
              <select
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent theme-bg-primary theme-text-primary transition-all duration-200 appearance-none cursor-pointer ${currentPriority.bgColor} ${currentPriority.color}`}
                disabled={loading}
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value} className="theme-bg-primary theme-text-primary">
                    {option.label} Priority
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
          
          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium theme-text-secondary mb-2">
              Due Date (Optional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 theme-border border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent theme-bg-primary theme-text-primary transition-all duration-200"
              disabled={loading}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={!title.trim() || loading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.01] disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-md flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding Task...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Task
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TaskInput;