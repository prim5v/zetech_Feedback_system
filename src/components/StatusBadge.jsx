import React from 'react';
const StatusBadge = ({
  status,
  size = 'md'
}) => {
  const getStatusColor = status => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'In Review':
        return 'status-review';
      case 'Resolved':
        return 'status-resolved';
      case 'Closed':
        return 'status-closed';
      default:
        return 'status-closed';
    }
  };
  const getSizeClasses = size => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'md':
        return 'text-sm px-2.5 py-0.5';
      case 'lg':
        return 'text-base px-3 py-1';
      default:
        return 'text-sm px-2.5 py-0.5';
    }
  };
  return <span className={`inline-flex items-center rounded-full border ${getStatusColor(status)} ${getSizeClasses(size)} font-medium`}>
      {status}
    </span>;
};
export default StatusBadge;