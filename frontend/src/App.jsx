import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Form data
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    fullName: "", email: "", username: "", password: "", confirmPassword: ""
  });

const API_BASE = "https://ex9-j2qf.onrender.com";

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${API_BASE}/login`, loginData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        setMessage("✅ Login successful! Welcome to dashboard.");
      } else {
        setMessage("❌ " + response.data.message);
      }
    } catch (error) {
      setMessage("❌ Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle register
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (registerData.password !== registerData.confirmPassword) {
      setMessage("❌ Passwords don't match!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/register`, registerData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        setMessage("✅ Registration successful! Welcome to dashboard.");
      } else {
        setMessage("❌ " + response.data.message);
      }
    } catch (error) {
      setMessage("❌ Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setMessage("✅ Logged out successfully.");
  };

  // Check if user is logged in on page load
  useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // If user is logged in, show dashboard
  if (user) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header bg-success text-white text-center">
                <h3>🏨 Hotel Dashboard</h3>
              </div>
              <div className="card-body text-center">
                <h4>Hello, {user.fullName}!</h4>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Username:</strong> {user.username}</p>
                {message && <div className="alert alert-info">{message}</div>}
                <button onClick={handleLogout} className="btn btn-danger">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login/Register form
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className={`card-header text-white text-center ${isLogin ? 'bg-primary' : 'bg-success'}`}>
              <h3>{isLogin ? "🔐 Login" : "👤 Register"}</h3>
              <h3>URK23CS1010</h3>
            </div>
            <div className="card-body">
              {message && <div className="alert alert-info">{message}</div>}

              {isLogin ? (
                // Login Form
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Username or Email"
                      className="form-control"
                      value={loginData.username}
                      onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      placeholder="Password"
                      className="form-control"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>
              ) : (
                // Register Form
                <form onSubmit={handleRegister}>
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="form-control"
                      value={registerData.fullName}
                      onChange={(e) => setRegisterData({...registerData, fullName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      placeholder="Email"
                      className="form-control"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Username"
                      className="form-control"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      placeholder="Password"
                      className="form-control"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className="form-control"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success w-100" disabled={loading}>
                    {loading ? "Creating Account..." : "Register"}
                  </button>
                </form>
              )}

              <div className="text-center mt-3">
                <button 
                  className="btn btn-link" 
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Need an account? Register" : "Already have an account? Login"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;