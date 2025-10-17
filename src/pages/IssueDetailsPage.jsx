import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import api from "../../utils/ApiSocket";

// ✅ Valid Lucide imports for v0.546.0
import { 
  ArrowLeft, User, Calendar, Tag, Mail, AlertCircle, Cpu 
} from 'lucide-react';

const IssueDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [issue, setIssue] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState('');
  const [error, setError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch issue details
  useEffect(() => {
    const fetchIssueDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/get_issue_details/${id}`);
        const data = res.data;

        if (data?.issue) {
          const issueData = data.issue;
          setIssue({
            id: issueData.issue_id,
            ticketId: issueData.ticket_id,
            title: issueData.title,
            description: issueData.description,
            category: issueData.category || "Others",
            status: issueData.status
              ? issueData.status.charAt(0).toUpperCase() + issueData.status.slice(1)
              : "Pending",
            createdAt: new Date(issueData.submitted_at),
            updatedAt: new Date(issueData.updated_at),
            isAnonymous: issueData.submission_type === "Anonymous",
            studentName: issueData.name,
            studentEmail: issueData.email,
            contactNumber: issueData.contact_number,
            admissionNumber: issueData.admission_number,
          });

          setResponses((data.responses || []).map(r => ({
            id: r.response_id,
            text: r.message,
            adminId: r.responder_id,
            adminName: r.responder_name || "Admin",
            createdAt: new Date(r.responded_at)
          })));
        } else {
          console.error("Issue not found:", data.error || "Unknown error");
        }
      } catch (err) {
        console.error("Error fetching issue details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssueDetails();
  }, [id]);

  const formatDate = date => new Date(date).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      const res = await api.post('/api/update_status', { issue_id: issue.id, status: newStatus });
      if (res.data.success) {
        setIssue({ ...issue, status: newStatus, updatedAt: new Date() });
      } else {
        alert(res.data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) {
      setError('Response text is required');
      return;
    }
    try {
      const res = await api.post('/api/post_response_to_issue', {
        issue_id: issue.id,
        message: responseText
      });

      if (res.data.success) {
        setResponses([...responses, {
          id: `resp-${Date.now()}`,
          text: responseText,
          adminId: user?.user_id || '',
          adminName: user?.name || 'Admin',
          createdAt: new Date()
        }]);
        setResponseText('');
        setError('');
        setIssue({ ...issue, updatedAt: new Date() });
      } else {
        alert(res.data.error || "Failed to submit response");
      }
    } catch (err) {
      console.error("Error submitting response:", err);
    }
  };

  const handleGenerateAIResponse = async () => {
    if (!issue) return;
    setAiLoading(true);
    try {
      const res = await api.post('/api/generate_ai_response', {
        issue_description: issue.description
      });
      if (res.data.success) {
        setResponseText(res.data.ai_response);
        setError('');
      } else {
        alert(res.data.error || "Failed to generate AI response");
      }
    } catch (err) {
      console.error("Error generating AI response:", err);
      alert("AI response generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div className="max-w-3xl mx-auto text-center py-12">Loading issue details...</div>;

  if (!issue) return (
    <div className="max-w-3xl mx-auto text-center py-12">
      <h2 className="text-2xl font-bold text-zetech-blue-dark mb-2">Issue Not Found</h2>
      <button onClick={() => navigate('/admin/dashboard')} className="btn-zetech">Back to Dashboard</button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate('/admin/dashboard')} className="flex items-center text-zetech-blue hover:text-zetech-blue-dark transition-all mb-6">
        <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
      </button>

      <div className="zetech-card overflow-hidden">
        {/* Header */}
        <div className="bg-zetech-gray p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-zetech-blue-dark">{issue.title}</h1>
            <p className="text-gray-500 text-sm mt-1">Ticket ID: {issue.ticketId}</p>
          </div>
          <div className="flex items-center">
            <span className="mr-3 text-sm text-gray-600">Status:</span>
            <select value={issue.status} onChange={handleStatusChange} className="form-input py-1 px-3 text-sm">
              <option value="Pending">Pending</option>
              <option value="In Review">In Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Details */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-3">Description</h2>
          <p className="bg-zetech-gray p-4 rounded-md text-gray-800">{issue.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Issue Info */}
            <div className="bg-zetech-gray p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Issue Details</h3>
              <p><Tag size={16} className="inline mr-2 text-gray-500" /> <b>Category:</b> {issue.category}</p>
              <p><Calendar size={16} className="inline mr-2 text-gray-500" /> <b>Submitted:</b> {formatDate(issue.createdAt)}</p>
              <p><StatusBadge status={issue.status} size="sm" /> <b className="ml-2">Last updated:</b> {formatDate(issue.updatedAt)}</p>
            </div>

            {/* Submitter Info */}
            <div className="bg-zetech-gray p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Submitter Information</h3>
              {issue.isAnonymous ? (
                <p className="italic text-gray-700"><User size={16} className="inline mr-2" /> Anonymous submission</p>
              ) : (
                <>
                  <p><User size={16} className="inline mr-2 text-gray-500" /> <b>Name:</b> {issue.studentName}</p>
                  <p><Mail size={16} className="inline mr-2 text-gray-500" /> <b>Email:</b> {issue.studentEmail}</p>
                  <p><b>Phone:</b> {issue.contactNumber || "N/A"}</p>
                  <p><b>Admission:</b> {issue.admissionNumber || "N/A"}</p>
                </>
              )}
            </div>
          </div>

          {/* Responses */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Responses</h2>
            {responses.length === 0 ? (
              <p className="text-gray-500 italic">No responses yet.</p>
            ) : (
              <div className="space-y-4">
                {responses.map(resp => (
                  <div key={resp.id} className="bg-zetech-blue bg-opacity-5 p-4 rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{resp.adminName}</span>
                      <span className="text-xs text-gray-500">{formatDate(resp.createdAt)}</span>
                    </div>
                    <p>{resp.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Response */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Add Response</h2>
            <form onSubmit={handleSubmitResponse}>
              <textarea
                value={responseText}
                onChange={e => setResponseText(e.target.value)}
                rows={4}
                className={`form-input w-full ${error ? 'border-red-500' : ''}`}
                placeholder="Enter your response..."
              />
              {error && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle size={16} className="mr-1" /> {error}</p>}

              {/* AI Generate Button */}
              <div className="flex justify-between mt-2">
                <button
                  type="button"
                  onClick={handleGenerateAIResponse}
                  className="btn-zetech bg-yellow-400 hover:bg-yellow-500 flex items-center"
                  disabled={aiLoading}
                >
                  <Cpu size={16} className="mr-1" />
                  {aiLoading ? "Generating..." : "Generate AI Response"}
                </button>
              </div>

              <div className="flex justify-end mt-4">
                <button type="submit" className="btn-zetech">Submit Response</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default IssueDetailsPage;
