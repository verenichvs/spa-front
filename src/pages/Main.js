import React, { useState, useEffect, useRef } from "react";
import CommentsList from "../components/MainPageForm";
import io from "socket.io-client";
import axios from "axios";

const CommentsPage = () => {
  const [comments, setComments] = useState([]);
  const baseUrl = process.env.REACT_APP_SERVER;
  const socketRef = useRef();
  useEffect(() => {
    const socket = io(baseUrl);
    socketRef.current = socket;
    localStorage.setItem("socket", socketRef);
    socket.emit("getComments");

    socket.on("comments", (data) => {
      setComments(data);
    });

    // Обработка размонтирования компонента
    return () => {
      socket.disconnect();
    };
  }, []);
  return <CommentsList comments={comments} />;
};

export default CommentsPage;
