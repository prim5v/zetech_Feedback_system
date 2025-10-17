// src/pages/SubmitIssuePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../../utils/ApiSocket"; // centralized API with token
import { AlertCircleIcon, CheckCircleIcon } from "lucide-react";

const SubmitIssuePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [isAnonymous, setIsAnonymous] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(""); // start empty to show placeholder
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [admission, setAdmission] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  // Pre-fill logged-in student details
  useEffect(() => {
    if (user && user.role === "student") {
      setIsAnonymous(false);
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!category) newErrors.category = "Category is required";

    if (!isAnonymous) {
      if (!name.trim()) newErrors.name = "Name is required";
      if (!email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
      if (!phone.trim()) newErrors.phone = "Phone number is required";
      if (!admission.trim()) newErrors.admission = "Admission number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const issueData = {
      title,
      description,
      category,
      name: isAnonymous ? null : name,
      user_id: isAnonymous ? null : user?.user_id || null,
      email: isAnonymous ? null : email,
      phone: isAnonymous ? null : phone,
      admission: isAnonymous ? null : admission,
    };

    try {
      const { data } = await api.post("/api/submit_issue", issueData);

      setTicketId(data.ticket_id);
      setSubmitted(true);

      // store recent tickets in localStorage
      const existingTickets = JSON.parse(localStorage.getItem("recentTickets") || "[]");
      const newTicket = { ticket_id: data.ticket_id, title, date: new Date().toISOString() };
      const updated = [newTicket, ...existingTickets].slice(0, 10);
      localStorage.setItem("recentTickets", JSON.stringify(updated));
    } catch (err) {
      console.error("Error submitting issue:", err);
      setErrors({ api: err.response?.data?.error || "Server error. Try again later." });
    }
  };

  const handleNewSubmission = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPhone("");
    setAdmission("");
    setSubmitted(false);
    setTicketId("");
    setErrors({});
  };

  const categories = [
    "Academics",
    "Hostel",
    "Transport",
    "Examination",
    "Other",
    "Facilities",
    "Cafeteria",
    "Library",
    "Sports",
    "Health Services",
    "IT Services",
    "Administrative Services",
    "Clubs and Societies",
    "Security",
  ];

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto zetech-card p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircleIcon size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-zetech-blue-dark">Submission Successful!</h2>
        </div>
        <div className="bg-zetech-gray p-4 rounded-md mb-6 text-center">
          <p className="text-gray-600 mb-2">Your issue has been submitted successfully.</p>
          <p className="text-gray-800 font-medium mb-1">Ticket ID:</p>
          <p className="text-xl font-bold text-zetech-blue mb-2">{ticketId}</p>
          {isAnonymous && (
            <p className="text-sm text-gray-500">
              Please save this Ticket ID to track your issue later.
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={handleNewSubmission} className="btn-zetech">
            Submit Another
          </button>
          <button onClick={() => navigate("/track")} className="btn-zetech-secondary">
            Track Your Issue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-zetech-blue-dark mb-6">Submit an Issue</h1>

      <form onSubmit={handleSubmit} className="zetech-card p-6">
        {/* Submission Type */}
        <div className="mb-6">
          <label className="form-label">Submission Type</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={isAnonymous}
                onChange={() => setIsAnonymous(true)}
                className="mr-2 accent-zetech-blue"
              />
              Anonymous
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={!isAnonymous}
                onChange={() => setIsAnonymous(false)}
                className="mr-2 accent-zetech-blue"
              />
              With Contact Info
            </label>
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="form-label">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`form-input ${errors.title ? "border-red-500 ring-red-500" : ""}`}
            placeholder="Brief title of your issue"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircleIcon size={16} className="mr-1" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="form-label">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className={`form-input ${errors.description ? "border-red-500 ring-red-500" : ""}`}
            placeholder="Describe your issue clearly"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircleIcon size={16} className="mr-1" />
              {errors.description}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="mb-6">
          <label htmlFor="category" className="form-label">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`form-input ${errors.category ? "border-red-500 ring-red-500" : ""}`}
          >
            {/* Placeholder */}
            <option value="" disabled>
              Choose from this list
            </option>

            {/* Actual categories */}
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircleIcon size={16} className="mr-1" />
              {errors.category}
            </p>
          )}
        </div>

        {/* Contact Info */}
        {!isAnonymous && (
          <div className="mb-6 p-4 bg-zetech-gray rounded-md">
            <h3 className="font-medium text-gray-800 mb-3">Contact Information</h3>

            <div className="mb-4">
              <label htmlFor="name" className="form-label">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`form-input ${errors.name ? "border-red-500 ring-red-500" : ""}`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="form-label">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                disabled
                className="form-input bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="form-label">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`form-input ${errors.phone ? "border-red-500 ring-red-500" : ""}`}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="admission" className="form-label">
                Admission No. <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="admission"
                value={admission}
                onChange={(e) => setAdmission(e.target.value)}
                className={`form-input ${errors.admission ? "border-red-500 ring-red-500" : ""}`}
              />
            </div>
          </div>
        )}

        {/* API Error */}
        {errors.api && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <AlertCircleIcon size={16} className="mr-1" /> {errors.api}
          </p>
        )}

        <div className="flex justify-end">
          <button type="submit" className="btn-zetech">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitIssuePage;
