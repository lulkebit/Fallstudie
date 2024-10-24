import React from 'react';
import Instalogo from '../images/instalogo.png';
import impressum from '../pages/impressum.jsx';

const Footer = () => {
  const navigate = (components) => {
    document.getElementById(components).scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <footer className='footer'>
      <div className='footer-content'>
        <p className='footer-italic-text'>Your Journey, Your Success!</p>
        <nav className='footer-links'>
          <button
            onClick={() => navigate(impressum)}
            className='text-gray-500 hover:text-gray-700'
          >
            Impressum
          </button>
          <a
            href='../pages/kontakt.jsx' // Verwende href anstelle von navigate
            className='text-gray-500 hover:text-gray-700'
          >
            Kontakt
          </a>
          <a
            href='/fourth-section' // Verwende href anstelle von navigate
            className='text-gray-500 hover:text-gray-700'
          >
            Über uns
          </a>
          <a
            href='https://www.instagram.com/trackmygoal2024/'
            target='_blank'
            rel='noopener noreferrer'
            className='link-icon'
          >
            <img src={Instalogo} alt='Instagram' className='instagram-icon' />
          </a>
        </nav>
      </div>
      <div className='footer-copyright'>
        © 2024 TrackMyGoal. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
};

export default Footer;
