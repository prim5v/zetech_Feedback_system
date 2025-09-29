import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIssues } from '../context/IssueContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { ArrowLeftIcon, UserIcon, CalendarIcon, TagIcon, MailIcon, AlertCircleIcon } from 'lucide-react';
// Sample data for UI demonstration
const DUMMY_ISSUES = {
  'dummy-1': {
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
  },
  'dummy-2': {
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
  }
};
const IssueDetailsPage = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    getIssueById,
    updateIssueStatus,
    addResponse
  } = useIssues();
  const [responseText, setResponseText] = useState('');
  const [error, setError] = useState('');
  // Check if it's a dummy issue or a real one
  let issue = id && id.startsWith('dummy') ? DUMMY_ISSUES[id] : getIssueById(id);
  if (!issue) {
    return <div className="max-w-3xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-zetech-blue-dark mb-2">
          Issue Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The issue you are looking for does not exist or has been removed.
        </p>
        <button onClick={() => navigate('/admin/dashboard')} className="btn-zetech">
          Back to Dashboard
        </button>
      </div>;
  }
  const formatDate = date => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const handleStatusChange = e => {
    if (!id.startsWith('dummy')) {
      updateIssueStatus(issue.id, e.target.value);
    } else {
      // Just for UI demonstration, update the dummy issue status
      issue.status = e.target.value;
      issue.updatedAt = new Date();
    }
  };
  const handleSubmitResponse = e => {
    e.preventDefault();
    if (!responseText.trim()) {
      setError('Response text is required');
      return;
    }
    if (!id.startsWith('dummy')) {
      addResponse(issue.id, {
        text: responseText,
        adminId: user?.id || '',
        adminName: user?.name || 'Admin'
      });
    } else {
      // Just for UI demonstration, add response to dummy issue
      issue.responses.push({
        id: `resp-${Date.now()}`,
        text: responseText,
        adminId: user?.id || '',
        adminName: user?.name || 'Admin',
        createdAt: new Date()
      });
      issue.updatedAt = new Date();
    }
    setResponseText('');
    setError('');
  };
  return <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate('/admin/dashboard')} className="flex items-center text-zetech-blue hover:text-zetech-blue-dark transition-all mb-6">
        <ArrowLeftIcon size={16} className="mr-1" />
        Back to Dashboard
      </button>
      <div className="zetech-card overflow-hidden">
        {/* Issue Header */}
        <div className="bg-zetech-gray p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-zetech-blue-dark">
                {issue.title}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Ticket ID: {issue.ticketId}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <span className="mr-3 text-sm text-gray-600">Status:</span>
              <select value={issue.status} onChange={handleStatusChange} className="form-input py-1 px-3 text-sm">
                <option value="Pending">Pending</option>
                <option value="In Review">In Review</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>
        {/* Issue Details */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Description</h2>
            <p className="bg-zetech-gray p-4 rounded-md text-gray-800">
              {issue.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-zetech-gray p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Issue Details
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <TagIcon size={16} className="text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">Category:</span>{' '}
                    {issue.category}
                  </span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon size={16} className="text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">Submitted:</span>{' '}
                    {formatDate(issue.createdAt)}
                  </span>
                </div>
                <div className="flex items-center">
                  <StatusBadge status={issue.status} size="sm" />
                  <span className="text-sm text-gray-700 ml-2">
                    <span className="font-medium">Last updated:</span>{' '}
                    {formatDate(issue.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-zetech-gray p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Submitter Information
              </h3>
              {issue.isAnonymous ? <div className="flex items-center">
                  <UserIcon size={16} className="text-gray-500 mr-2" />
                  <span className="text-sm italic text-gray-700">
                    Anonymous submission
                  </span>
                </div> : <div className="space-y-2">
                  <div className="flex items-center">
                    <UserIcon size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">
                      <span className="font-medium">Name:</span>{' '}
                      {issue.studentName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MailIcon size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">
                      <span className="font-medium">Email:</span>{' '}
                      {issue.studentEmail}
                    </span>
                  </div>
                </div>}
            </div>
          </div>
          {/* Responses Section */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Responses</h2>
            {issue.responses.length === 0 ? <p className="text-gray-500 italic">No responses yet.</p> : <div className="space-y-4">
                {issue.responses.map(response => <div key={response.id} className="bg-zetech-blue bg-opacity-5 p-4 rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{response.adminName}</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(response.createdAt)}
                      </span>
                    </div>
                    <p>{response.text}</p>
                  </div>)}
              </div>}
          </div>
          {/* Add Response Form */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold mb-4">Add Response</h2>
            <form onSubmit={handleSubmitResponse}>
              <div className="mb-4">
                <textarea value={responseText} onChange={e => setResponseText(e.target.value)} rows={4} className={`form-input ${error ? 'border-red-500 ring-red-500' : ''}`} placeholder="Enter your response..."></textarea>
                {error && <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircleIcon size={16} className="mr-1" />
                    {error}
                  </p>}
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn-zetech">
                  Submit Response
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>;
};
export default IssueDetailsPage;