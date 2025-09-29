import React from 'react';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-zetech-blue-dark text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Zetech University</h3>
            <p className="text-gray-300 text-sm mt-1">
              Feedback Hub – Empowering Student Voice
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-300 text-sm">
              &copy; {currentYear} Zetech University – Feedback Hub
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Transforming Lives Through Education
            </p>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;