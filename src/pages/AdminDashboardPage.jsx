import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIssues } from '../context/IssueContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import IssueCard from '../components/IssueCard';
import { FilterIcon, RefreshCwIcon, PieChartIcon, BarChartIcon, XIcon } from 'lucide-react';
// Sample data for UI demonstration
const DUMMY_ISSUES = [{
  id: 'dummy-1',
  ticketId: 'ZTH12345',
  title: 'Library Computer Issues',
  description: 'Several computers in the library are not working properly. Need maintenance.',
  category: 'Facilities',
  status: 'Pending',
  createdAt: new Date('2023-09-15T10:30:00'),
  updatedAt: new Date('2023-09-15T10:30:00'),
  isAnonymous: true,
  responses: []
}, {
  id: 'dummy-2',
  ticketId: 'ZTH12346',
  title: 'Cafeteria Food Quality',
  description: 'The food quality in the cafeteria has declined recently. Please improve the menu options.',
  category: 'Cafeteria',
  status: 'In Review',
  createdAt: new Date('2023-09-14T14:20:00'),
  updatedAt: new Date('2023-09-16T09:15:00'),
  isAnonymous: false,
  studentName: 'John Doe',
  studentEmail: 'john.doe@students.zetech.ac.ke',
  responses: [{
    id: 'resp-1',
    text: 'Thank you for your feedback. We are reviewing the cafeteria services.',
    adminId: '1',
    adminName: 'Admin User',
    createdAt: new Date('2023-09-16T09:15:00')
  }]
}, {
  id: 'dummy-3',
  ticketId: 'ZTH12347',
  title: 'Wi-Fi Connectivity Problems',
  description: 'The Wi-Fi in Block B is very slow and disconnects frequently. Please fix this issue.',
  category: 'Facilities',
  status: 'Resolved',
  createdAt: new Date('2023-09-10T11:45:00'),
  updatedAt: new Date('2023-09-17T16:30:00'),
  isAnonymous: false,
  studentName: 'Jane Smith',
  studentEmail: 'jane.smith@students.zetech.ac.ke',
  responses: [{
    id: 'resp-2',
    text: 'We have identified the issue with the router in Block B.',
    adminId: '1',
    adminName: 'Admin User',
    createdAt: new Date('2023-09-15T14:20:00')
  }, {
    id: 'resp-3',
    text: 'The router has been replaced and the Wi-Fi should be working properly now.',
    adminId: '1',
    adminName: 'Admin User',
    createdAt: new Date('2023-09-17T16:30:00')
  }]
}];
const AdminDashboardPage = () => {
  const {
    user
  } = useAuth();
  const {
    issues
  } = useIssues();
  // Combine real issues with dummy data for UI demonstration
  const allIssues = [...issues, ...DUMMY_ISSUES];
  // Filter states
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  // Apply filters
  const filteredIssues = allIssues.filter(issue => {
    // Status filter
    if (statusFilter !== 'All' && issue.status !== statusFilter) {
      return false;
    }
    // Category filter
    if (categoryFilter !== 'All' && issue.category !== categoryFilter) {
      return false;
    }
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return issue.title.toLowerCase().includes(query) || issue.description.toLowerCase().includes(query) || issue.ticketId.toLowerCase().includes(query);
    }
    return true;
  });
  // Sort by date
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (dateFilter === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });
  // Reset filters
  const resetFilters = () => {
    setStatusFilter('All');
    setCategoryFilter('All');
    setDateFilter('newest');
    setSearchQuery('');
  };
  // Calculate statistics
  const calculateStats = () => {
    const statusCounts = {
      Pending: 0,
      'In Review': 0,
      Resolved: 0,
      Closed: 0
    };
    const categoryCounts = {};
    allIssues.forEach(issue => {
      // Count by status
      if (statusCounts[issue.status] !== undefined) {
        statusCounts[issue.status]++;
      }
      // Count by category
      if (categoryCounts[issue.category]) {
        categoryCounts[issue.category]++;
      } else {
        categoryCounts[issue.category] = 1;
      }
    });
    return {
      statusCounts,
      categoryCounts
    };
  };
  const stats = calculateStats();
  return <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-zetech-blue-dark">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-all">
            <FilterIcon size={18} className="mr-2" />
            Filters
          </button>
          <button onClick={() => setShowStats(!showStats)} className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-all">
            <BarChartIcon size={18} className="mr-2" />
            Statistics
          </button>
        </div>
      </div>
      {/* Statistics Section */}
      {showStats && <div className="zetech-card p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <PieChartIcon size={20} className="mr-2 text-zetech-blue" />
              Issue Statistics
            </h2>
            <button onClick={() => setShowStats(false)} className="text-gray-500 hover:text-gray-700 transition-all">
              <XIcon size={18} />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Status Statistics */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Issues by Status
              </h3>
              <div className="space-y-2">
                {Object.entries(stats.statusCounts).map(([status, count]) => <div key={status} className="flex items-center">
                    <StatusBadge status={status} size="sm" />
                    <div className="ml-2 flex-grow">
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${status === 'Pending' ? 'bg-yellow-500' : status === 'In Review' ? 'bg-zetech-blue' : status === 'Resolved' ? 'bg-green-500' : 'bg-gray-500'}`} style={{
                    width: `${allIssues.length ? count / allIssues.length * 100 : 0}%`
                  }}></div>
                      </div>
                    </div>
                    <span className="ml-2 text-sm font-medium">{count}</span>
                  </div>)}
              </div>
            </div>
            {/* Category Statistics */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Issues by Category
              </h3>
              <div className="space-y-2">
                {Object.entries(stats.categoryCounts).map(([category, count]) => <div key={category} className="flex items-center">
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded w-24 truncate">
                        {category}
                      </span>
                      <div className="ml-2 flex-grow">
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-zetech-blue-light" style={{
                    width: `${allIssues.length ? count / allIssues.length * 100 : 0}%`
                  }}></div>
                        </div>
                      </div>
                      <span className="ml-2 text-sm font-medium">{count}</span>
                    </div>)}
              </div>
            </div>
          </div>
        </div>}
      {/* Filters Section */}
      {showFilters && <div className="zetech-card p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <FilterIcon size={20} className="mr-2 text-zetech-blue" />
              Filter Issues
            </h2>
            <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700 transition-all">
              <XIcon size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input type="text" id="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search issues..." className="form-input text-sm" />
            </div>
            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select id="status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-input text-sm">
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Review">In Review</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select id="category" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="form-input text-sm">
                <option value="All">All Categories</option>
                <option value="Academics">Academics</option>
                <option value="Facilities">Facilities</option>
                <option value="Cafeteria">Cafeteria</option>
                <option value="Administration">Administration</option>
                <option value="Others">Others</option>
              </select>
            </div>
            {/* Date Filter */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <select id="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="form-input text-sm">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={resetFilters} className="flex items-center text-zetech-blue hover:text-zetech-blue-dark transition-all">
              <RefreshCwIcon size={16} className="mr-1" />
              Reset Filters
            </button>
          </div>
        </div>}
      {/* Issues List */}
      <div className="zetech-card p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">All Issues</h2>
          <p className="text-sm text-gray-500">
            Showing {sortedIssues.length} of {allIssues.length} issues
          </p>
        </div>
        {sortedIssues.length === 0 ? <div className="text-center py-8">
            <p className="text-gray-500">
              No issues found matching your filters.
            </p>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedIssues.map(issue => <IssueCard key={issue.id} issue={issue} linkPath={`/admin/issues/${issue.id}`} />)}
          </div>}
      </div>
    </div>;
};
export default AdminDashboardPage;