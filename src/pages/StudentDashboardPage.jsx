import React from 'react';
import HomePage from './HomePage'; // adjust this import path if your Home component is elsewhere

const StudentDashboardPage = () => {
  return <HomePage />;
};

export default StudentDashboardPage;



// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useIssues } from '../context/IssueContext';
// import IssueCard from '../components/IssueCard';
// import StatusBadge from '../components/StatusBadge';
// import { PlusIcon } from 'lucide-react';
// const StudentDashboardPage = () => {
//   const {
//     user
//   } = useAuth();
//   const {
//     getIssuesByStudentId
//   } = useIssues();
//   const studentIssues = user ? getIssuesByStudentId(user.id) : [];
//   // Group issues by status
//   const pendingIssues = studentIssues.filter(issue => issue.status === 'Pending');
//   const inReviewIssues = studentIssues.filter(issue => issue.status === 'In Review');
//   const resolvedIssues = studentIssues.filter(issue => issue.status === 'Resolved');
//   const closedIssues = studentIssues.filter(issue => issue.status === 'Closed');
//   return <div className="max-w-6xl mx-auto">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-zetech-blue-dark">My Issues</h1>
//           <p className="text-gray-600">Welcome, {user?.name}</p>
//         </div>
//         <Link to="/submit" className="mt-4 md:mt-0 flex items-center btn-zetech">
//           <PlusIcon size={18} className="mr-2" />
//           New Issue
//         </Link>
//       </div>
//       {studentIssues.length === 0 ? <div className="zetech-card p-8 text-center">
//           <h2 className="text-xl font-semibold text-zetech-blue-dark mb-2">
//             No Issues Yet
//           </h2>
//           <p className="text-gray-600 mb-6">
//             You haven't submitted any issues or suggestions yet.
//           </p>
//           <Link to="/submit" className="btn-zetech inline-block">
//             Submit Your First Issue
//           </Link>
//         </div> : <div className="space-y-8">
//           {/* Pending Issues */}
//           <div>
//             <div className="flex items-center mb-4">
//               <StatusBadge status="Pending" />
//               <h2 className="text-xl font-semibold text-zetech-blue-dark ml-2">
//                 Pending
//               </h2>
//             </div>
//             {pendingIssues.length === 0 ? <p className="text-gray-500 italic">No pending issues.</p> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {pendingIssues.map(issue => <IssueCard key={issue.id} issue={issue} linkPath={`/track?ticketId=${issue.ticketId}`} />)}
//               </div>}
//           </div>
//           {/* In Review Issues */}
//           <div>
//             <div className="flex items-center mb-4">
//               <StatusBadge status="In Review" />
//               <h2 className="text-xl font-semibold text-zetech-blue-dark ml-2">
//                 In Review
//               </h2>
//             </div>
//             {inReviewIssues.length === 0 ? <p className="text-gray-500 italic">No issues in review.</p> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {inReviewIssues.map(issue => <IssueCard key={issue.id} issue={issue} linkPath={`/track?ticketId=${issue.ticketId}`} />)}
//               </div>}
//           </div>
//           {/* Resolved Issues */}
//           <div>
//             <div className="flex items-center mb-4">
//               <StatusBadge status="Resolved" />
//               <h2 className="text-xl font-semibold text-zetech-blue-dark ml-2">
//                 Resolved
//               </h2>
//             </div>
//             {resolvedIssues.length === 0 ? <p className="text-gray-500 italic">No resolved issues.</p> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {resolvedIssues.map(issue => <IssueCard key={issue.id} issue={issue} linkPath={`/track?ticketId=${issue.ticketId}`} />)}
//               </div>}
//           </div>
//           {/* Closed Issues */}
//           {closedIssues.length > 0 && <div>
//               <div className="flex items-center mb-4">
//                 <StatusBadge status="Closed" />
//                 <h2 className="text-xl font-semibold text-zetech-blue-dark ml-2">
//                   Closed
//                 </h2>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {closedIssues.map(issue => <IssueCard key={issue.id} issue={issue} linkPath={`/track?ticketId=${issue.ticketId}`} />)}
//               </div>
//             </div>}
//         </div>}
//     </div>;
// };
// export default StudentDashboardPage;