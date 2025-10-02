import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { CalendarIcon, MessageSquareIcon } from 'lucide-react';

const IssueCard = ({
  issue,
  showLink = true,
  linkPath = `/admin/issues/${issue.id}`
}) => {
  const formatDate = date => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="zetech-card hover-scale overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {issue.title}
          </h3>
          <StatusBadge status={issue.status} />
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {issue.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <CalendarIcon size={14} className="mr-1" />
            <span>{formatDate(issue.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <span className="bg-gray-100 px-2 py-0.5 rounded">
              {issue.category}
            </span>
          </div>
          <div className="flex items-center">
            <MessageSquareIcon size={14} className="mr-1" />
            {/* Use response_count from backend */}
            <span>{issue.response_count} response{issue.response_count !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {showLink && (
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
          <Link
            to={linkPath}
            className="text-zetech-blue hover:text-zetech-blue-dark text-sm font-medium transition-all"
          >
            View Details →
          </Link>
        </div>
      )}
    </div>
  );
};

export default IssueCard;
