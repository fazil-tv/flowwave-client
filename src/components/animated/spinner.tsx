import React from 'react'

interface TaskSpinnerProps {
  size?: 'small' | 'medium' | 'large'

}

export function TaskSpinner({ size = 'medium',}: TaskSpinnerProps) {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  }

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-green-500',
    accent: 'text-purple-500'
  }

  return (
    <div role="status" className="inline-block">
      <svg
        className={`animate-spin ${sizeClasses[size]} text-white`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
        <path
          className="animate-pulse"
          fill="currentColor"
          d="M12 6v6l4 2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="sr-only">Loading tasks...</span>
    </div>
  )
}

