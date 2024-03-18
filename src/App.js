import React from "react";
import Registration from "./pages/Registration";
import Login from "./pages/Authorization";
import Main from "./pages/Main";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
} from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/" element={<Navigate to="/registration" />} />
      </Routes>
    </Router>
  );
};

export default App;
