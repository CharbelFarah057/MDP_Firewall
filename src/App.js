import React from 'react';
import './App.css';

const LoginPage = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Add logic for authentication here
  };

  return (
    <div className="container">
      <h1>Linux Firewall</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <LoginPage />
    </div>
  );
}

export default App;
