import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { toast } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ email, password });
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (error) {
      toast.error('Login failed, please try again');
    }
  };

  const handleGoogleLogin = () => {
    window.open(`${process.env.REACT_APP_API_URL}/auth/google`, "_self");
  };
  
  return (
    <div className="login">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="show-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <button type="submit">Login</button>
        <div className="register-link">
          <p>New User? <a href="/register">Register</a></p>
        </div>
        <button type="button" className="google-login" onClick={handleGoogleLogin}>
          Sign in with Google
        </button>
      </form>
    </div>
  );
}

export default Login;
