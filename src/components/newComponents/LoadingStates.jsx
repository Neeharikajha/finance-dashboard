"use client";

// Loading spinner component
export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`}></div>
  );
};

// Skeleton loader for table rows
export const TableSkeleton = ({ rows = 5, columns = 6 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 animate-pulse">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={`h-4 bg-gray-200 rounded ${
                colIndex === 0 ? "w-16" : 
                colIndex === 1 ? "w-32" : 
                colIndex === 2 ? "w-20" : 
                colIndex === 3 ? "w-16" : 
                colIndex === 4 ? "w-16" : "w-24"
              }`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Skeleton loader for cards
export const CardSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white border rounded-lg p-4 animate-pulse">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="h-5 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="text-right">
              <div className="h-6 bg-gray-200 rounded w-20 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Skeleton loader for charts
export const ChartSkeleton = () => {
  return (
    <div className="h-full bg-white border rounded-lg p-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );
};

// Loading state wrapper
export const LoadingState = ({ loading, children, skeleton, error, empty, emptyMessage = "No data available" }) => {
  if (loading) {
    return skeleton || <div className="flex items-center justify-center h-32"><LoadingSpinner /></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-center">
        <div className="text-4xl mb-2">⚠️</div>
        <p className="text-red-600 font-medium">Error loading data</p>
        <p className="text-sm text-gray-500 mt-1">{error}</p>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-center">
        <div className="text-4xl mb-2">📊</div>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return children;
};

// Widget loading wrapper
export const WidgetLoadingWrapper = ({ 
  loading, 
  error, 
  children, 
  widgetType = "table",
  empty = false,
  emptyMessage 
}) => {
  const getSkeleton = () => {
    switch (widgetType) {
      case 'table':
        return <TableSkeleton />;
      case 'finance_card':
        return <CardSkeleton />;
      case 'chart':
        return <ChartSkeleton />;
      default:
        return <div className="flex items-center justify-center h-32"><LoadingSpinner /></div>;
    }
  };

  return (
    <LoadingState
      loading={loading}
      error={error}
      empty={empty}
      emptyMessage={emptyMessage}
      skeleton={getSkeleton()}
    >
      {children}
    </LoadingState>
  );
};
