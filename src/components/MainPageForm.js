import React, { useState } from "react";

const Comment = ({ comment, onReply }) => {
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [attachment, setAttachment] = useState(null);

  const handleReply = async () => {
    if (replyText.trim() === "" && !attachment) {
      alert("Введите текст комментария или загрузите изображение");
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
      const response = await fetch("http://localhost:4000/comments/add", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке комментария");
      }

      const responseData = await response.json();
      onReply(responseData);
    } catch (error) {
      console.error(error);
      alert("Произошла ошибка при отправке комментария");
    }

    setReplyText("");
    setIsReplying(false);
    setAttachment(null);
  };
  const parseHtmlTags = (text) => {
    const range = document.createRange();
    const fragment = range.createContextualFragment(text);
    const div = document.createElement("div");
    div.appendChild(fragment);
    return div.innerHTML;
  };

  return (
    <div key={comment.id}>
      <strong>{comment.user.username}:</strong>{" "}
      <div dangerouslySetInnerHTML={{ __html: parseHtmlTags(comment.text) }} />
      {comment.file && (
        <img
          src={`data:image/jpeg;base64,${comment.file}`}
          alt="Картинка комментария"
        />
      )}
      <div>
        {isReplying ? (
          <div>
            <input
              type="text"
              placeholder="Ваш комментарий"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <input
              type="file"
              accept=".jpg, .jpeg, .png, .txt"
              onChange={(e) => setAttachment(e.target.files[0])}
            />
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

  const handleNewComment = async () => {
    if (newCommentText.trim() === "" && !newCommentAttachment) {
      alert("Введите текст комментария или загрузите изображение");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("text", newCommentText);
      if (newCommentAttachment) {
        formData.append("file", newCommentAttachment);
      }

      const token = getToken();
      const response = await fetch("http://localhost:4000/comments/add", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке комментария");
      }

      const responseData = await response.json();
      onReply(responseData);
    } catch (error) {
      console.error(error);
      alert("Произошла ошибка при отправке комментария");
    }

    setNewCommentText("");
    setNewCommentAttachment(null);
  };

  return (
    <div>
      <h2>Комментарии</h2>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} onReply={onReply} />
      ))}
      <div>
        <input
          type="text"
          placeholder="Ваш комментарий"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
        <input
          type="file"
          accept=".jpg, .jpeg, .png, .txt"
          onChange={(e) => setNewCommentAttachment(e.target.files[0])}
        />
        <button onClick={handleNewComment}>Добавить комментарий</button>
      </div>
    </div>
  );
};

const parseHtmlTags = (text) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  return doc.body.innerHTML;
};

const getToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

export default CommentsList;
