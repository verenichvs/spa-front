import React, { useState } from "react";
import axios from "axios";
import "../styles/registration-form-styles.css";

const RegistrationForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const baseUrl = process.env.REACT_APP_SERVER;
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.match(/^[a-zA-Z0-9]+$/)) {
      setError(
        "Логин должен содержать только буквы латинского алфавита и цифры."
      );
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(emailPattern)) {
      setError("Введите корректный адрес электронной почты.");
      return;
    }

    if (!password || password.length < 7) {
      setError("Пароль должен содержать не менее 7 символов.");
      return;
    }
    if (!password.match(/^[a-zA-Z0-9]+$/)) {
      setError(
        "Пароль должен содержать только буквы латинского алфавита и цифры."
      );
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/users`,
        {
          username,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      window.location.href = "/login";
    } catch (error) {
      console.error("Ошибка регистрации:", error.message);
      // alert(
      //   "Ошибка регистрации: Логин и пароль должны содержать только буквы латинского алфавита и цифры, пароль должен быть не короче 7 символов. Так же ошибку может вызвать некоректный email адрес. Использовать уже зарегистрированый email или логин нельзя!"
      // );
      setError(
        "Ошибка регистрации. Пользователь с такими данными существует. Попробуйте еще раз."
      );
    }
  };

  return (
    <div className="registration-form-container">
      <div className="registration-form">
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Логин:</label>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              className="text-input"
            />
          </div>
          <div className="form-field">
            <label>Email:</label>
            <input
              type="text"
              value={email}
              onChange={handleEmailChange}
              className="text-input"
            />
          </div>
          <div className="form-field">
            <label>Пароль:</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="text-input"
            />
          </div>
          <button type="submit">Зарегистрироваться</button>
        </form>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default RegistrationForm;
