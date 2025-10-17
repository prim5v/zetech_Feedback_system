import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import IssueCard from '../components/IssueCard';
import { FilterIcon, RefreshCwIcon, PieChartIcon, BarChartIcon, XIcon, CpuIcon } from 'lucide-react';
import api from "../../utils/ApiSocket";

const AdminDashboardPage = () => {
  const { user } = useAuth();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // AI Insights
  const [aiInsights, setAiInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState('');
  const [showAiInsights, setShowAiInsights] = useState(false);

  // Priority & Old Issues
  const [priorityIssues, setPriorityIssues] = useState([]);
  const [oldIssues, setOldIssues] = useState({ Pending: [], "In Review": [] });

  // 🔥 Fetch issues from backend with silent polling every 5 seconds
  useEffect(() => {
    let interval;

    const fetchIssues = async (silent = false) => {
      try {
        if (!silent) setLoading(true);

        const res = await api.get("/api/get_all_issues"); // Axios
        const data = res.data;

        if (data?.Issues) {
          const mappedIssues = data.Issues.map(issue => ({
            id: issue.issue_id,
            ticketId: issue.ticket_id,
            title: issue.title,
            description: issue.description,
            category: issue.category || "Others",
            status: issue.status
              ? issue.status.charAt(0).toUpperCase() + issue.status.slice(1)
              : "Pending",
            createdAt: new Date(issue.submitted_at),
            updatedAt: new Date(issue.updated_at),
            isAnonymous: issue.submission_type === "Anonymous",
            studentName: issue.name,
            studentEmail: issue.email,
            contactNumber: issue.contact_number,
            admissionNumber: issue.admission_number,
            response_count: issue.response_count || 0,
          }));

          setIssues(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(mappedIssues)) {
              setLastUpdated(new Date().toLocaleTimeString());
              return mappedIssues;
            }
            return prev;
          });

          // Calculate Priority Issues
          const titleCounts = {};
          const oldIssuesMap = { Pending: [], "In Review": [] };
          const now = new Date();

          mappedIssues.forEach(issue => {
            // Count repetitions
            titleCounts[issue.title] = (titleCounts[issue.title] || 0) + 1;

            // Old unresolved (>7 days)
            const ageDays = (now - issue.createdAt) / (1000 * 60 * 60 * 24);
            if ((issue.status === "Pending" || issue.status === "In Review") && ageDays >= 7) {
              oldIssuesMap[issue.status].push(issue.title);
            }
          });

          // Sort by repetition count descending
          const sortedPriority = Object.entries(titleCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([title, count]) => `${title} (${count}x)`);

          setPriorityIssues(sortedPriority);
          setOldIssues(oldIssuesMap);

        } else {
          console.error("Failed to fetch issues: ", data?.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        if (!silent) setLoading(false);
      }
    };

    // Initial fetch
    fetchIssues();

    // Silent polling every 5 seconds
    interval = setInterval(() => fetchIssues(true), 5000);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  // Fetch AI insights
  const fetchAiInsights = async () => {
    setLoadingInsights(true);
    setInsightsError('');
    setAiInsights('');

    try {
      const res = await api.get("/api/admin/ai_insights");
      const data = res.data;

      if (data?.insights) {
        setAiInsights(data.insights);
        setShowAiInsights(true);
      } else {
        setInsightsError(data?.error || "Failed to fetch AI insights");
      }
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      setInsightsError("Failed to fetch AI insights");
    } finally {
      setLoadingInsights(false);
    }
  };

  // Filters & sorting
  const filteredIssues = issues.filter(issue => {
    if (statusFilter !== 'All' && issue.status !== statusFilter) return false;
    if (categoryFilter !== 'All' && issue.category !== categoryFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        issue.title.toLowerCase().includes(query) ||
        issue.description.toLowerCase().includes(query) ||
        issue.ticketId.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (dateFilter === 'newest') return b.createdAt.getTime() - a.createdAt.getTime();
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  const resetFilters = () => {
    setStatusFilter('All');
    setCategoryFilter('All');
    setDateFilter('newest');
    setSearchQuery('');
  };

  const calculateStats = () => {
    const statusCounts = { Pending: 0, 'In Review': 0, Resolved: 0, Closed: 0 };
    const categoryCounts = {};
    issues.forEach(issue => {
      if (statusCounts[issue.status] !== undefined) statusCounts[issue.status]++;
      if (issue.category) categoryCounts[issue.category] = (categoryCounts[issue.category] || 0) + 1;
    });
    return { statusCounts, categoryCounts };
  };
  const stats = calculateStats();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header + Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-zetech-blue-dark">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.username}</p>
          {lastUpdated && <p className="text-xs text-gray-500 mt-1">Last updated: {lastUpdated}</p>}
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-all">
            <FilterIcon size={18} className="mr-2" /> Filters
          </button>
          <button onClick={() => setShowStats(!showStats)} className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-all">
            <BarChartIcon size={18} className="mr-2" /> Statistics
          </button>
          <button onClick={fetchAiInsights} className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-all">
            <CpuIcon size={18} className="mr-2" /> AI Insights
          </button>
        </div>
      </div>

      {/* Priority Issues */}
      {/* {priorityIssues.length > 0 && (
        <div className="zetech-card p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Priority Issues (Most Repeated)</h2>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {priorityIssues.map((title, idx) => <li key={idx}>{title}</li>)}
          </ul>
        </div>
      )} */}

      {/* Old Unresolved Issues */}
      {(oldIssues.Pending.length > 0 || oldIssues["In Review"].length > 0) && (
        <div className="zetech-card p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Old Unresolved Issues (&gt;7 days)</h2>
          {Object.entries(oldIssues).map(([status, issuesList]) => (
            issuesList.length > 0 && (
              <div key={status} className="mb-2">
                <h3 className="text-sm font-medium">{status}:</h3>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {issuesList.map((title, idx) => <li key={idx}>{title}</li>)}
                </ul>
              </div>
            )
          ))}
        </div>
      )}

      {/* AI Insights */}
      {showAiInsights && (
        <div className="zetech-card p-4 mb-6 max-h-72 overflow-y-auto relative">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold flex items-center">
              <CpuIcon size={18} className="mr-2 text-zetech-blue" /> AI Insights
            </h2>
            <button onClick={() => setShowAiInsights(false)} className="text-gray-500 hover:text-gray-700 transition-all absolute top-2 right-2">
              <XIcon size={18} />
            </button>
          </div>
          {loadingInsights ? <p className="text-gray-500">Generating AI insights...</p> :
            insightsError ? <p className="text-red-500">{insightsError}</p> :
              <pre className="whitespace-pre-wrap text-sm">{aiInsights}</pre>
          }
        </div>
      )}

      {/* Filters Section */}
      {showFilters && (
        <div className="zetech-card p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <FilterIcon size={20} className="mr-2 text-zetech-blue" /> Filters
            </h2>
            <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700 transition-all">
              <XIcon size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-input w-full">
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="In Review">In Review</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="form-input w-full">
                <option value="All">All</option>
                {[...new Set(issues.map(i => i.category))].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="form-input w-full">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input type="text" placeholder="Search by title, desc, ticket ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="form-input w-full" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={resetFilters} className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-all">
              <RefreshCwIcon size={16} className="mr-1" /> Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Stats Section */}
      {showStats && (
        <div className="zetech-card p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <PieChartIcon size={20} className="mr-2 text-zetech-blue" /> Issue Statistics
            </h2>
            <button onClick={() => setShowStats(false)} className="text-gray-500 hover:text-gray-700 transition-all">
              <XIcon size={18} />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Issues by Status</h3>
              <div className="space-y-2">
                {Object.entries(stats.statusCounts).map(([status, count]) => (
                  <div key={status} className="flex items-center">
                    <StatusBadge status={status} size="sm" />
                    <div className="ml-2 flex-grow">
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${
                          status === 'Pending' ? 'bg-yellow-500' :
                          status === 'In Review' ? 'bg-zetech-blue' :
                          status === 'Resolved' ? 'bg-green-500' : 'bg-gray-500'
                        }`} style={{ width: `${issues.length ? (count / issues.length) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                    <span className="ml-2 text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Issues by Category</h3>
              <div className="space-y-2">
                {Object.entries(stats.categoryCounts).map(([category, count]) => (
                  <div key={category} className="flex items-center">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded w-24 truncate">{category}</span>
                    <div className="ml-2 flex-grow">
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-zetech-blue-light" style={{ width: `${issues.length ? (count / issues.length) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                    <span className="ml-2 text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Issues List */}
      <div className="zetech-card p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">All Issues</h2>
          <p className="text-sm text-gray-500">
            {loading ? "Loading issues..." : `Showing ${sortedIssues.length} of ${issues.length} issues`}
          </p>
        </div>
        {loading ? (
          <p className="text-center py-6">Fetching issues...</p>
        ) : sortedIssues.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No issues found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedIssues.map(issue => (
              <IssueCard key={issue.id} issue={issue} linkPath={`/admin/issues/${issue.id}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
