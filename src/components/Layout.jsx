import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
const Layout = ({
  children
}) => {
  return <div className="flex flex-col min-h-screen bg-zetech-gray font-poppins">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>;
};
export default Layout;