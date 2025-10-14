import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquareIcon, SearchIcon, UsersIcon } from 'lucide-react';
// Zetech University logo URL
const ZETECH_LOGO = "download.jpeg";
const HomePage = () => {
  return <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-12 px-4">
        <img src={ZETECH_LOGO} alt="Zetech University" className="h-24 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-zetech-blue-dark mb-4">
          Zetech Univesity Feedback Portal
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A platform for students to share issues and suggestions anonymously or with their identity.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/submit" className="btn-zetech">
            Submit an Issue
          </Link>
          <Link to="/track" className="btn-zetech-secondary">
            Track an Issue
          </Link>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-zetech-blue-dark">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="zetech-card p-6 text-center hover-scale">
            <div className="w-16 h-16 bg-zetech-blue-dark bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquareIcon size={30} className="text-zetech-blue-dark" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Submit</h3>
            <p className="text-gray-600">
              Submit your issue or suggestion with details and category. Choose
              to submit anonymously or with your information.
            </p>
          </div>
          {/* Step 2 */}
          <div className="zetech-card p-6 text-center hover-scale">
            <div className="w-16 h-16 bg-zetech-blue-dark bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon size={30} className="text-zetech-blue-dark" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Review</h3>
            <p className="text-gray-600">
              University administrators review your submission and work on
              addressing the issue or implementing suggestions.
            </p>
          </div>
          {/* Step 3 */}
          <div className="zetech-card p-6 text-center hover-scale">
            <div className="w-16 h-16 bg-zetech-blue-dark bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon size={30} className="text-zetech-blue-dark" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track</h3>
            <p className="text-gray-600">
              Track the status of your submission using your ticket ID or by
              logging in to see all your submissions.
            </p>
          </div>
        </div>
      </section>
      {/* Categories Section */}
      <section className="py-12 px-4 bg-zetech-gray rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-zetech-blue-dark">
          Issue Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Academics', 'Facilities', 'Cafeteria', 'Administration', 'Library', 'Technology', 'Sports', 'Others'].map(category => <div key={category} className="zetech-card p-4 text-center hover-scale">
              <h3 className="font-medium text-gray-800">{category}</h3>
            </div>)}
        </div>
      </section>
      {/* Call to Action */}
      <section className="py-12 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-zetech-blue-dark">
          Ready to make a difference at Zetech?
        </h2>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Your feedback helps us improve the university experience for everyone.
        </p>
        <Link to="/submit" className="btn-zetech inline-block">
          Submit an Issue or Suggestion
        </Link>
      </section>
    </div>;
};
export default HomePage;