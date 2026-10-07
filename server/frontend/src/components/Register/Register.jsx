import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const registeruser = async (e) => {
    e.preventDefault();

    let register_url = window.location.origin + "/djangoapp/register/";
    
    const res = await fetch(register_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "userName": userName,
        "password": password,
        "firstName": firstName,
        "lastName": lastName,
        "email": email
      }),
    });

    const json = await res.json();
    if (json.status === "Authenticated") {
      sessionStorage.setItem('username', json.userName);
      window.location.href = window.location.origin;
    } else if (json.error === "Already Registered") {
      alert("The user with this username already exists");
    } else {
      alert(json.message || "Registration failed");
    }
  };

  return (
    <div className="register_container" style={{ width: "50%", margin: "5% auto" }}>
      <div className="header" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <span className="text" style={{ fontSize: "36px", fontWeight: "bold" }}>Sign Up</span>
      </div>
      <hr />
      <form onSubmit={registeruser}>
        <div className="inputs">
          <div className="input">
            <span className="input_name">Username</span>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="input_field"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="input">
            <span className="input_name">First Name</span>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              className="input_field"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="input">
            <span className="input_name">Last Name</span>
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              className="input_field"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="input">
            <span className="input_name">Email</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input_field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input">
            <span className="input_name">Password</span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input_field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="submit_panel" style={{ marginTop: "20px" }}>
          <input className="btn btn-primary" type="submit" value="Register" />
        </div>
      </form>
    </div>
  );
};

export default Register;
