import React, { useEffect, useState, createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
// Create context
const IssueContext = createContext();
// Generate random ticket ID
const generateTicketId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
export const IssueProvider = ({
  children
}) => {
  const [issues, setIssues] = useState([]);
  // Load issues from local storage on initial load
  useEffect(() => {
    const storedIssues = localStorage.getItem('issues');
    if (storedIssues) {
      // Convert string dates back to Date objects
      const parsedIssues = JSON.parse(storedIssues).map(issue => ({
        ...issue,
        createdAt: new Date(issue.createdAt),
        updatedAt: new Date(issue.updatedAt),
        responses: issue.responses.map(response => ({
          ...response,
          createdAt: new Date(response.createdAt)
        }))
      }));
      setIssues(parsedIssues);
    }
  }, []);
  // Save issues to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('issues', JSON.stringify(issues));
  }, [issues]);
  // Add a new issue
  const addIssue = issueData => {
    const ticketId = generateTicketId();
    const now = new Date();
    const newIssue = {
      id: uuidv4(),
      ticketId,
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
      responses: [],
      ...issueData
    };
    setIssues(prevIssues => [...prevIssues, newIssue]);
    return ticketId;
  };
  // Get issue by ticket ID (for anonymous tracking)
  const getIssueByTicketId = ticketId => {
    return issues.find(issue => issue.ticketId === ticketId);
  };
  // Get issues by student ID
  const getIssuesByStudentId = studentId => {
    return issues.filter(issue => issue.studentId === studentId);
  };
  // Get issue by ID
  const getIssueById = id => {
    return issues.find(issue => issue.id === id);
  };
  // Update issue status
  const updateIssueStatus = (id, status) => {
    setIssues(prevIssues => prevIssues.map(issue => issue.id === id ? {
      ...issue,
      status,
      updatedAt: new Date()
    } : issue));
  };
  // Add response to an issue
  const addResponse = (issueId, responseData) => {
    const newResponse = {
      id: uuidv4(),
      createdAt: new Date(),
      ...responseData
    };
    setIssues(prevIssues => prevIssues.map(issue => issue.id === issueId ? {
      ...issue,
      responses: [...issue.responses, newResponse],
      updatedAt: new Date()
    } : issue));
  };
  return <IssueContext.Provider value={{
    issues,
    addIssue,
    getIssueByTicketId,
    getIssuesByStudentId,
    getIssueById,
    updateIssueStatus,
    addResponse
  }}>
      {children}
    </IssueContext.Provider>;
};
// Custom hook to use issue context
export const useIssues = () => {
  const context = useContext(IssueContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
};