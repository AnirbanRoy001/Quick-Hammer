import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      &copy; {new Date().getFullYear()} AUCTION PLATFORM. All rights reserved.
    </div>
  );
};

export default Footer;
