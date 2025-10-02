import React, { useState, useEffect, useRef } from 'react';
import StatusBadge from '../components/StatusBadge';
import { AlertCircleIcon, SearchIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

const TrackIssuePage = () => {
  const [ticketId, setTicketId] = useState('');
  const [searched, setSearched] = useState(false);
  const [issue, setIssue] = useState(null);
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState('');
  const [recentTickets, setRecentTickets] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const floaterRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  // Load recent tickets & floater position from localStorage
  useEffect(() => {
    const tickets = JSON.parse(localStorage.getItem('recentTickets') || '[]');
    setRecentTickets(tickets);

    const savedPosition = JSON.parse(localStorage.getItem('floaterPosition'));
    if (savedPosition) setPosition(savedPosition);
  }, []);

  // Auto-collapse when clicking outside floater
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (floaterRef.current && !floaterRef.current.contains(event.target)) {
        setCollapsed(true);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!ticketId.trim()) {
      setError('Please enter a Ticket ID');
      return;
    }

    try {
      const res = await fetch(
        "https://feedback4293.pythonanywhere.com/api/track_issue",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticket_id: ticketId }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setIssue(data.issue);
        setResponses(data.responses || []);
        setError('');

        const newTicket = { ticket_id: data.issue.ticket_id, title: data.issue.title };
        const updatedTickets = [newTicket, ...recentTickets.filter(t => t.ticket_id !== newTicket.ticket_id)].slice(0, 10);
        setRecentTickets(updatedTickets);
        localStorage.setItem('recentTickets', JSON.stringify(updatedTickets));
      } else {
        setIssue(null);
        setResponses([]);
        setError(data.message || data.error || "Issue not found");
      }
      setSearched(true);
    } catch (err) {
      console.error("Error tracking issue:", err);
      setError("Server error. Please try again later.");
      setSearched(true);
      setIssue(null);
      setResponses([]);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleTicketClick = (id) => {
    setTicketId(id);
    setSearched(false);
  };

  const handleClearTickets = () => {
    if (window.confirm("Are you sure you want to clear all recent tickets?")) {
      localStorage.removeItem('recentTickets');
      setRecentTickets([]);
    }
  };

  // Drag handlers
  const onMouseDown = (e) => {
    setDragging(true);
    offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const onMouseMove = (e) => {
    if (dragging) {
      let newX = e.clientX - offset.current.x;
      let newY = e.clientY - offset.current.y;

      // Prevent dragging outside viewport
      const floater = floaterRef.current;
      if (floater) {
        const rect = floater.getBoundingClientRect();
        newX = Math.max(0, Math.min(newX, window.innerWidth - rect.width));
        newY = Math.max(0, Math.min(newY, window.innerHeight - rect.height));
      }

      setPosition({ x: newX, y: newY });
    }
  };

  const onMouseUp = () => {
    setDragging(false);
    localStorage.setItem('floaterPosition', JSON.stringify(position));
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, position]);

  return (
    <div className="max-w-3xl mx-auto relative">
      <h1 className="text-3xl font-bold text-zetech-blue-dark mb-6">
        Track Your Issue
      </h1>

      {/* Floating Recent Tickets */}
      {recentTickets.length > 0 && (
        <div
          ref={floaterRef}
          className={`fixed bg-white border border-gray-200 rounded-lg shadow-lg w-64 max-h-96 overflow-hidden z-50 cursor-move transition-transform duration-150 ${
            dragging ? 'scale-105' : ''
          }`}
          style={{ top: position.y, left: position.x }}
        >
          <div
            className="flex justify-between items-center p-3 border-b border-gray-200 bg-zetech-blue-light rounded-t-lg text-white"
            onMouseDown={onMouseDown}
          >
            <span className="font-medium">Recent Tickets</span>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-red-500 px-2 py-0.5 rounded-full">{recentTickets.length}</span>
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="text-white hover:text-gray-200 px-2"
              >
                {collapsed ? <ChevronDownIcon size={16} /> : <ChevronUpIcon size={16} />}
              </button>
              <button
                onClick={handleClearTickets}
                className="ml-2 bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs font-medium"
              >
                Clear All
              </button>
            </div>
          </div>

          {!collapsed && (
            <div className="overflow-y-auto max-h-80">
              <ul className="divide-y divide-gray-200">
                {recentTickets.map((ticket, index) => (
                  <li key={ticket.ticket_id}>
                    <button
                      className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-zetech-blue-light hover:text-white transition-colors ${
                        index === 0 ? 'bg-zetech-blue text-white font-semibold' : 'text-zetech-blue'
                      }`}
                      onClick={() => handleTicketClick(ticket.ticket_id)}
                      title={ticket.title}
                    >
                      {ticket.ticket_id} {index === 0 && '(Latest)'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Search Form */}
      <div className="zetech-card p-6 mb-8">
        <form onSubmit={handleSearch}>
          <label htmlFor="ticketId" className="form-label">
            Enter your Ticket ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="ticketId"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value.toUpperCase())}
              className="form-input flex-1"
              placeholder="e.g., ABC12345"
            />
            <button type="submit" className="btn-zetech flex items-center">
              <SearchIcon size={18} className="mr-1" />
              Search
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <AlertCircleIcon size={16} className="mr-1" />
              {error}
            </p>
          )}
        </form>
      </div>

      {/* Before search */}
      {!searched && (
        <div className="zetech-card p-6 bg-gray-50 border border-dashed border-gray-300 text-center">
          <p className="text-gray-500 italic">
            Enter your ticket ID above to see the status and responses for your issue.
          </p>
        </div>
      )}

      {/* Search results */}
      {searched && issue && (
        <div className="zetech-card p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-zetech-blue-dark">
                {issue.title}
              </h2>
              <p className="text-sm text-gray-500">Ticket ID: {issue.ticket_id}</p>
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
              <p className="font-medium">{formatDate(issue.submitted_at)}</p>
            </div>
            <div>
              <p className="text-gray-500">Last Updated</p>
              <p className="font-medium">{formatDate(issue.updated_at)}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-gray-700 font-medium mb-3">Responses</h3>
            {responses.length === 0 ? (
              <p className="text-gray-500 italic">No responses yet.</p>
            ) : (
              <div className="space-y-4">
                {responses.map((response) => (
                  <div
                    key={response.response_id}
                    className="bg-zetech-blue bg-opacity-5 p-4 rounded-md"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">{response.username || "Admin"}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(response.responded_at)}
                      </p>
                    </div>
                    <p>{response.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackIssuePage;
