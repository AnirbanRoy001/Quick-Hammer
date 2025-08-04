import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css'; 

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:1000/api/v1/sign-in', credentials);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('username', res.data.user.username);

      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
      

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-image-side" style={{ backgroundImage: "url('https://thumbs.dreamstime.com/b/auction-vector-stamp-36874249.jpg')" }}>
        <div className="auth-image-content">
          <h2>Discover Your Next Collection</h2>
          <p>Thousands of Items are waiting to be explored in our digital platform.</p>
        </div>
      </div>
      
      <div className="auth-container">
        <div className="auth-header">
          <h1>Quick Hammer</h1>
          <p>Your portal to magnificent collections</p>
        </div>
        
        <div className="auth-box">
          <h2>Welcome Back</h2>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <i className="icon-user"></i>
              <input 
                type="text" 
                name="username" 
                placeholder="Username" 
                value={credentials.username} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="input-group">
              <i className="icon-lock"></i>
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={credentials.password} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <button type="submit" className="auth-button">Login</button>
          </form>
          
          <div className="auth-footer">
            <p>New to AUCTION PLATFORM? <Link to="/signup" className="auth-link">Create an account</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;