import React, { useContext, useState } from "react"
import { useEffect } from "react";
import { UserContext } from "../UserContext"
import { useHistory } from 'react-router-dom';
import './Login.css';


function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userContext, setUserContext] = useContext(UserContext)

  const history = useHistory();

  useEffect(() => {
    if (userContext.token) {
      if (userContext.user.firstLogin) {
        history.push('/first-time-user');
      } else {
        history.push('/tmg');
      }
    }
  }, [userContext, history]);

  const formSubmitHandler = e => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // error message if password or username is empty
    if (username === "" || password === "") {
      setErrorMessage("Please fill all the fields correctly!")
      setIsSubmitting(false)
      return
    }
    fetch("http://localhost:3001/api/users/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password : password }),
    })
      .then(async response => {
        setIsSubmitting(false)
        if (!response.ok) {
          if (response.status === 400) {
            setError("Please fill all the fields correctly!")
          } else if (response.status === 401) {
            setError("Invalid email and password combination.")
          } else {
            setErrorMessage("Something went wrong! Please try again later.")
          }
        } else {
          const data = await response.json()
          setUserContext(oldValues => {
            return { ...oldValues, token: data.token, user:data.user }
          })
        }
      })
      .catch(error => {
        setIsSubmitting(false)
        setError(errorMessage)
      })
  }

  return (
    <>
      <form onSubmit={formSubmitHandler} className="auth-form"></form>
      <div className="App">
        <div className="container">
          <h1>Linux Firewall</h1>
          <form onSubmit={formSubmitHandler}>
            <input
              id = "username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              id = "password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Insert error-message-container here */}
            <div className="error-message-container">
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
            {error && ( <div className="error-message-container">
              {error}
              </div>)}
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? "Signing In" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
