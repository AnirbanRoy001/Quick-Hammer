import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', address: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:1000/api/v1/sign-up', formData);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
    <div className="auth-image-side" style={{ backgroundImage: "url('https://img.freepik.com/premium-photo/legal-gavel-with-auction-tag_165073-581.jpg?semt=ais_hybrid&w=740')" }}>
      <div className="auth-image-content">
        <h2>Join Our Auction Community</h2>
        <p>Create an account to access our vast collection and personalized recommendations.</p>
      </div>
    </div>
      
      <div className="auth-container">
        <div className="auth-header">
          <h1>Quick Hammer</h1>
          <p>Begin your auction journey</p>
        </div>
        
        <div className="auth-box">
          <h2>Create Account</h2>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <i className="icon-user"></i>
              <input type="text" name="username" placeholder="Username" onChange={handleChange} value={formData.username} required />
            </div>
            
            <div className="input-group">
              <i className="icon-email"></i>
              <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} required />
            </div>
            
            <div className="input-group">
              <i className="icon-lock"></i>
              <input type="password" name="password" placeholder="Password" onChange={handleChange} value={formData.password} required />
            </div>
            
            <div className="input-group">
              <i className="icon-address"></i>
              <input type="text" name="address" placeholder="Address" onChange={handleChange} value={formData.address} required />
            </div>
            
            <button type="submit" className="auth-button">Sign Up</button>
          </form>
          
          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Log In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;