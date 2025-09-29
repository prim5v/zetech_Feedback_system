import React, { useState } from 'react';
import { useIssues } from '../context/IssueContext';
import StatusBadge from '../components/StatusBadge';
import { AlertCircleIcon, SearchIcon } from 'lucide-react';
const TrackIssuePage = () => {
  const {
    getIssueByTicketId
  } = useIssues();
  const [ticketId, setTicketId] = useState('');
  const [searched, setSearched] = useState(false);
  const [issue, setIssue] = useState(undefined);
  const [error, setError] = useState('');
  const handleSearch = e => {
    e.preventDefault();
    if (!ticketId.trim()) {
      setError('Please enter a Ticket ID');
      return;
    }
    const foundIssue = getIssueByTicketId(ticketId);
    setIssue(foundIssue);
    setSearched(true);
    if (!foundIssue) {
      setError(`No issue found with Ticket ID: ${ticketId}`);
    } else {
      setError('');
    }
  };
  const formatDate = date => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  return <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-zetech-blue-dark mb-6">
        Track Your Issue
      </h1>
      <div className="zetech-card p-6 mb-8">
        <form onSubmit={handleSearch}>
          <label htmlFor="ticketId" className="form-label">
            Enter your Ticket ID
          </label>
          <div className="flex gap-2">
            <input type="text" id="ticketId" value={ticketId} onChange={e => setTicketId(e.target.value.toUpperCase())} className="form-input flex-1" placeholder="e.g., ABC12345" />
            <button type="submit" className="btn-zetech flex items-center">
              <SearchIcon size={18} className="mr-1" />
              Search
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2 flex items-center">
              <AlertCircleIcon size={16} className="mr-1" />
              {error}
            </p>}
        </form>
      </div>
      {/* Placeholder area for response/feedback */}
      {!searched && <div className="zetech-card p-6 bg-gray-50 border border-dashed border-gray-300 text-center">
          <p className="text-gray-500 italic">
            Enter your ticket ID above to see the status and responses for your issue.
          </p>
        </div>}
      {searched && issue && <div className="zetech-card p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-zetech-blue-dark">{issue.title}</h2>
              <p className="text-sm text-gray-500">
                Ticket ID: {issue.ticketId}
              </p>
            </div>
            <StatusBadge status={issue.status} size="lg" />
          </div>
          <div className="mb-6">
            <h3 className="text-gray-700 font-medium mb-2">Description</h3>
            <p className="text-gray-800 bg-zetech-gray p-3 rounded-md">
              {issue.description}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-gray-500">Category</p>
              <p className="font-medium">{issue.category}</p>
            </div>
            <div>
              <p className="text-gray-500">Submitted On</p>
              <p className="font-medium">{formatDate(issue.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-500">Last Updated</p>
              <p className="font-medium">{formatDate(issue.updatedAt)}</p>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-gray-700 font-medium mb-3">Responses</h3>
            {issue.responses.length === 0 ? <p className="text-gray-500 italic">No responses yet.</p> : <div className="space-y-4">
                {issue.responses.map(response => <div key={response.id} className="bg-zetech-blue bg-opacity-5 p-4 rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">{response.adminName}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(response.createdAt)}
                      </p>
                    </div>
                    <p>{response.text}</p>
                  </div>)}
              </div>}
          </div>
        </div>}
    </div>;
};
export default TrackIssuePage;