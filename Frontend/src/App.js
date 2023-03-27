import React, { useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage('Please enter your username and password.');
      return;
    }

    // Implement actual authentication logic here
    setErrorMessage('');
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Linux Firewall</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Insert error-message-container here */}
          <div className="error-message-container">
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}

export default App;
