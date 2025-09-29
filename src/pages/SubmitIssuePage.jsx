import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssueContext';
import { AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
const SubmitIssuePage = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    loginAsStudent
  } = useAuth();
  const {
    addIssue
  } = useIssues();
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academics');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  // Pre-fill form if user is logged in
  useEffect(() => {
    if (user && user.role === 'student') {
      setIsAnonymous(false);
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!isAnonymous) {
      if (!name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Email is invalid';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    // If not anonymous and not logged in, log in as student
    if (!isAnonymous && !isAuthenticated) {
      loginAsStudent(name, email);
    }
    const issueData = {
      title,
      description,
      category,
      isAnonymous,
      ...(isAnonymous ? {} : {
        studentId: user?.id || '',
        studentName: name,
        studentEmail: email
      })
    };
    const newTicketId = addIssue(issueData);
    setTicketId(newTicketId);
    setSubmitted(true);
  };
  const handleNewSubmission = () => {
    setTitle('');
    setDescription('');
    setCategory('Academics');
    setSubmitted(false);
    setTicketId('');
  };
  const categories = ['Academics', 'Facilities', 'Cafeteria', 'Administration', 'Others'];
  if (submitted) {
    return <div className="max-w-2xl mx-auto zetech-card p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircleIcon size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-zetech-blue-dark">
            Submission Successful!
          </h2>
        </div>
        <div className="bg-zetech-gray p-4 rounded-md mb-6 text-center">
          <p className="text-gray-600 mb-2">
            Your issue has been submitted successfully.
          </p>
          <p className="text-gray-800 font-medium mb-1">Ticket ID:</p>
          <p className="text-xl font-bold text-zetech-blue mb-2">{ticketId}</p>
          {isAnonymous && <p className="text-sm text-gray-500">
              Please save this Ticket ID to track the status of your issue.
            </p>}
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={handleNewSubmission} className="btn-zetech">
            Submit Another Issue
          </button>
          {isAnonymous ? <button onClick={() => navigate('/track')} className="btn-zetech-secondary">
              Track Your Issue
            </button> : <button onClick={() => navigate('/student/dashboard')} className="btn-zetech-secondary">
              View Your Issues
            </button>}
        </div>
      </div>;
  }
  return <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-zetech-blue-dark mb-6">
        Submit an Issue or Suggestion
      </h1>
      <form onSubmit={handleSubmit} className="zetech-card p-6">
        {/* Submission Type */}
        <div className="mb-6">
          <label className="form-label">
            Submission Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input type="radio" checked={isAnonymous} onChange={() => setIsAnonymous(true)} className="mr-2 accent-zetech-blue" />
              Submit Anonymously
            </label>
            <label className="flex items-center">
              <input type="radio" checked={!isAnonymous} onChange={() => setIsAnonymous(false)} className="mr-2 accent-zetech-blue" />
              With Contact Info
            </label>
          </div>
        </div>
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="form-label">
            Title <span className="text-red-500">*</span>
          </label>
          <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className={`form-input ${errors.title ? 'border-red-500 ring-red-500' : ''}`} placeholder="Brief title of your issue or suggestion" />
          {errors.title && <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircleIcon size={16} className="mr-1" />
              {errors.title}
            </p>}
        </div>
        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="form-label">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={5} className={`form-input ${errors.description ? 'border-red-500 ring-red-500' : ''}`} placeholder="Detailed description of your issue or suggestion"></textarea>
          {errors.description && <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircleIcon size={16} className="mr-1" />
              {errors.description}
            </p>}
        </div>
        {/* Category */}
        <div className="mb-6">
          <label htmlFor="category" className="form-label">
            Category <span className="text-red-500">*</span>
          </label>
          <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="form-input">
            {categories.map(cat => <option key={cat} value={cat}>
                {cat}
              </option>)}
          </select>
        </div>
        {/* Contact Information - only if not anonymous */}
        {!isAnonymous && <div className="mb-6 p-4 bg-zetech-gray rounded-md">
            <h3 className="font-medium text-gray-800 mb-3">
              Contact Information
            </h3>
            <div className="mb-4">
              <label htmlFor="name" className="form-label">
                Name <span className="text-red-500">*</span>
              </label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={`form-input ${errors.name ? 'border-red-500 ring-red-500' : ''}`} placeholder="Your full name" disabled={isAuthenticated} />
              {errors.name && <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircleIcon size={16} className="mr-1" />
                  {errors.name}
                </p>}
            </div>
            <div>
              <label htmlFor="email" className="form-label">
                Email <span className="text-red-500">*</span>
              </label>
              <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className={`form-input ${errors.email ? 'border-red-500 ring-red-500' : ''}`} placeholder="Your email address" disabled={isAuthenticated} />
              {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircleIcon size={16} className="mr-1" />
                  {errors.email}
                </p>}
            </div>
          </div>}
        <div className="flex justify-end">
          <button type="submit" className="btn-zetech">
            Submit
          </button>
        </div>
      </form>
    </div>;
};
export default SubmitIssuePage;