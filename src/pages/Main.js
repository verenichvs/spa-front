import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentsList from "../components/MainPageForm";

const CommentsPage = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/comments/comment",
          {
            hl: "DESC",
            userEmailDate: "date",
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setComments(response.data);
      } catch (error) {
        console.error("Ошибка при получении комментариев:", error.message);
      }
    };
    fetchComments();
  }, []);

  const handleReply = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/comments/comment",
        {
          hl: "DESC",
          userEmailDate: "date",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setComments(response.data);
    } catch (error) {
      console.error("Ошибка при получении комментариев:", error.message);
    }
  };

  return <CommentsList comments={comments} onReply={handleReply} />;
};

export default CommentsPage;
