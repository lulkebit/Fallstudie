import React from 'react';

const LandingNavbar = () => {
  const navigateToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className='bg-white shadow-md fixed w-full z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          <div className='flex items-center'>
            <span className='text-2xl font-bold text-indigo-600'>
              TrackMyGoal
            </span>
          </div>
          <div className='hidden sm:flex flex-1 justify-center space-x-8'>
            <button
              onClick={() => navigateToSection('second-section')}
              className='text-gray-500 hover:text-gray-700'
            >
              Unsere Vision
            </button>
            <button
              onClick={() => navigateToSection('third-section')}
              className='text-gray-500 hover:text-gray-700'
            >
              Vorteile
            </button>
            <button
              onClick={() => navigateToSection('fourth-section')}
              className='text-gray-500 hover:text-gray-700'
            >
              TrackMyGoal Team
            </button>
            <button
              onClick={() => navigateToSection('last-section')}
              className='text-gray-500 hover:text-gray-700'
            >
              FAQ
            </button>
          </div>
          <div className='hidden sm:flex items-center ml-auto'>
            <button className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700'>
              Jetzt registrieren
            </button>
            <button className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 ml-4'>
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
