import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const isLoggedIn = !!localStorage.getItem('token');
  const userId = localStorage.getItem('id');


  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleUserClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:1000/api/v1/get-user-info', {
        headers: {
          Authorization: `Bearer ${token}`,
          id: userId,
        },
      });
      console.log("User info response:", res.data); // Add this to inspect
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      navigate('/user-info');
    } catch (err) {
      console.error("User info fetch failed", err);
    }
  };
  

  const links = [
    { title: "Home", link: "/home" },
    { title: "About Us", link: "/about" },
    ...(role === "user" ? [{ title: "Auctions", link: "/auctions" }] : []),
    ...(role === "admin" ? [{ title: "Admin Panel", link: "/admin" }] : [])
  ];

  return (
    <div className="navbar">
      <div className="logo-section">
        <img 
          src="https://thumbs.dreamstime.com/b/auction-icon-3424582.jpg"
          alt="logo"
          className="logo"
        />
        <h1 className="site-title">Quick Hammer</h1>  
      </div>
      
      <div className="nav-links">
        {links.map((item, i) => (
          <Link key={i} to={item.link} className="nav-button">
            {item.title}
          </Link>
        ))}

        {isLoggedIn && (
          <>
            <span className="nav-button user-tag">
               {role === 'admin' ? `Admin: ${username}` : `User: ${username}`}
            </span>
            <button className="nav-button logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
