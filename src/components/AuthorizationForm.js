import React, { useState } from "react";
import axios from "axios";
import userEvent from "@testing-library/user-event";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/auth/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      login(data.token);

      window.location.href = "/main";
    } catch (error) {
      console.error("Ошибка авторизации:", error.message);
    }
  };
  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Логин:</label>
        <input type="text" value={email} onChange={handleEmailChange} />
      </div>
      <div>
        <label>Пароль:</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <button type="submit">Войти</button>
    </form>
  );
};

export default LoginForm;
