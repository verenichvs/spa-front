import React, { useState, useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "../styles/image-styles.css";
import "../styles/main-page-style.css";
import { validateXhtmlTags } from "./xhtmlValidation";
import {
  handleTagClick,
  handleTextSelection,
  parseHtmlTags,
} from "./TagsButtonLogic";
import io from "socket.io-client";

const Comment = ({ comment, onReply }) => {
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [comments, setComments] = useState([]);
  const imageUrl = `data:${comment.fileName};base64,${comment.file}`;
  const [selectedTag, setSelectedTag] = useState(null);
  const baseUrl = process.env.REACT_APP_SERVER;

  const handleReply = async () => {
    // if (recaptchaValue === null) {
    //   alert("Пройдите капчу ");
    //   return;
    // }
    if (replyText.trim() === "") {
      alert("Введите текст комментария ");
      return;
    }
    const isValidXhtml = validateXhtmlTags(replyText);

    if (!isValidXhtml) {
      alert("Текст комментария содержит недопустимые XHTML теги");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("parrentCommentId", comment.id);
      formData.append("text", replyText);
      if (attachment) {
        formData.append("file", attachment);
      }

      const token = getToken();
      const response = await fetch(`${baseUrl}/comments/add`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке комментария");
      }
      if (response.ok) {
        const socket = io(baseUrl);
        socket.emit("getComments");

        socket.on("comments", (data) => {
          setComments(data);
        });

        setReplyText("");
        setIsReplying(false);
        setAttachment(null);

        return <CommentsList comments={comments} />;
      }

      // const responseData = await response.json();
      // onReply(responseData);
    } catch (error) {
      console.error(error);
      alert("Произошла ошибка при отправке комментария");
    }
  };

  return (
    <div key={comment.id}>
      <strong>{comment.user.username}:</strong> {comment.user.email}
      {" postedAt: "}
      {comment.createdAt} <div>{" Добавил комментарий: "}</div>
      <div dangerouslySetInnerHTML={{ __html: parseHtmlTags(comment.text) }} />
      {comment.file && (
        <div>
          {comment.fileName && comment.fileName.startsWith("image/") ? (
            <img
              className="comment-image "
              src={imageUrl}
              alt="Картинка комментария"
              style={{ maxWidth: "320px", maxHeight: "240px" }}
            />
          ) : (
            <a
              href={`data:text/plain;charset=utf-8;base64,${comment.file}`}
              download={`${comment.fileName}`}
            >
              Скачать прикреплённый текстовый файл
            </a>
          )}
        </div>
      )}
      <div>
        {isReplying ? (
          <div>
            <textarea
              id="commentTextarea"
              type="text"
              placeholder="Ваш комментарий"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button
              onClick={handleTagClick(
                selectedTag,
                setReplyText,
                setSelectedTag
              )}
            >
              Применить тег
            </button>
            <button onClick={() => handleTextSelection(setSelectedTag)("i")}>
              [i]
            </button>
            <button
              onClick={() => handleTextSelection(setSelectedTag)("strong")}
            >
              [strong]
            </button>
            <button onClick={() => handleTextSelection(setSelectedTag)("code")}>
              [code]
            </button>
            <button onClick={() => handleTextSelection(setSelectedTag)("a")}>
              [a]
            </button>
            <input
              type="file"
              accept=".jpg, .jpeg, .png, .gif, .txt"
              onChange={(e) => setAttachment(e.target.files[0])}
            />
            {/* <ReCAPTCHA
              sitekey="6LcKsZUpAAAAAMHFENxnbTqDLHqH_038E7pq3l5e"
              onChange={(value) => setRecaptchaValue(value)}
            />
            <button disabled={!recaptchaValue} onClick={handleReply}> */}
            <button onClick={handleReply}>Ответить</button>
          </div>
        ) : (
          <button onClick={() => setIsReplying(true)}>Ответить</button>
        )}
      </div>
      {comment.children.length > 0 && (
        <div style={{ marginLeft: "20px" }}>
          {comment.children.map((child) => (
            <Comment key={child.id} comment={child} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentsList = ({ comments, onReply }) => {
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentAttachment, setNewCommentAttachment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [commentaries, setComments] = useState([]);
  const commentsPerPage = 25;
  const baseUrl = process.env.REACT_APP_SERVER;

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const handleSortChange = (field) => {
    if (field === sortField) {
      // If the same field is clicked again, toggle the sort order
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      // If a different field is clicked, set it as the new sorting field with default ascending order
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedComments = () => {
    if (!sortField) {
      // If no sorting is applied, return the original comments array
      return comments;
    }

    return comments.slice().sort((a, b) => {
      const fieldA = getField(a, sortField);
      const fieldB = getField(b, sortField);

      // Compare values based on the selected field and sort order
      if (sortOrder === "asc") {
        return fieldA.localeCompare(fieldB, undefined, { sensitivity: "base" });
      } else {
        return fieldB.localeCompare(fieldA, undefined, { sensitivity: "base" });
      }
    });
  };

  const getField = (comment, field) => {
    // Helper function to extract nested fields
    const keys = field.split(".");
    return keys.reduce((obj, key) => obj && obj[key], comment);
  };

  const currentComments = sortedComments().slice(
    indexOfFirstComment,
    indexOfLastComment
  );

  const totalPages = Math.ceil(comments.length / commentsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNewComment = async () => {
    if (recaptchaValue === null) {
      alert("Пройдите капчу ");
      return;
    }
    if (newCommentText.trim() === "") {
      alert("Введите текст комментария ");
      return;
    }
    const isValidXhtml = validateXhtmlTags(newCommentText);

    if (!isValidXhtml) {
      alert("Текст комментария содержит недопустимые XHTML теги");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("text", newCommentText);
      if (newCommentAttachment) {
        formData.append("file", newCommentAttachment);
      }

      const token = getToken();
      const response = await fetch(`${baseUrl}/comments/add`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке комментария");
      }
      if (response.ok) {
        const socket = io(baseUrl);
        socket.emit("getComments");

        socket.on("comments", (data) => {
          setComments(data);
        });
        setNewCommentText("");
        setNewCommentAttachment(null);
        return <CommentsList commentaries={commentaries} />;
      }
    } catch (error) {
      console.error(error);
      alert("Произошла ошибка при отправке комментария");
    }
  };

  return (
    <div>
      <h2>Комментарии</h2>
      <div>
        <button onClick={() => handleSortChange("user.username")}>
          Сортировать по Имени пользователя
        </button>
        <button onClick={() => handleSortChange("user.email")}>
          Сортировать по E-mail
        </button>
        <button onClick={() => handleSortChange("createdAt")}>
          Сортировать по Дате добавления
        </button>
      </div>
      {currentComments.map((comment) => (
        <Comment key={comment.id} comment={comment} onReply={onReply} />
      ))}
      {totalPages > 1 && (
        <div>
          <ul className="pagination">
            {Array.from({ length: totalPages }).map((_, index) => (
              <li key={index} onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <textarea
          id="commentTextarea"
          type="text"
          placeholder="Ваш комментарий"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
        <button
          onClick={handleTagClick(
            selectedTag,
            setNewCommentText,
            setSelectedTag
          )}
        >
          Применить тег
        </button>
        <button onClick={() => handleTextSelection(setSelectedTag)("i")}>
          [i]
        </button>
        <button onClick={() => handleTextSelection(setSelectedTag)("strong")}>
          [strong]
        </button>
        <button onClick={() => handleTextSelection(setSelectedTag)("code")}>
          [code]
        </button>
        <button onClick={() => handleTextSelection(setSelectedTag)("a")}>
          [a]
        </button>
        <input
          type="file"
          accept=".jpg, .jpeg, .png, .gif, .txt"
          onChange={(e) => setNewCommentAttachment(e.target.files[0])}
        />
        <ReCAPTCHA
          sitekey="6LcKsZUpAAAAAMHFENxnbTqDLHqH_038E7pq3l5e"
          onChange={(value) => setRecaptchaValue(value)}
        />
        <button disabled={!recaptchaValue} onClick={handleNewComment}>
          Добавить комментарий
        </button>
      </div>
    </div>
  );
};

const getToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

export default CommentsList;
