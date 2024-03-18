export const handleTagClick = (selectedTag, setReplyText, setSelectedTag) => {
  return () => {
    if (!selectedTag) return;

    const textarea = document.getElementById("commentTextarea");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    if (selectedTag === "a") {
      const hrefValue = prompt("Введите значение для атрибута href:");
      const titleValue = prompt("Введите значение для атрибута title:");

      const wrappedText = `<${selectedTag} href="${hrefValue}" title="${titleValue}">${text.slice(
        start,
        end
      )}</${selectedTag}>`;

      const newText = `${text.slice(0, start)}${wrappedText}${text.slice(end)}`;
      setReplyText(newText);

      textarea.setSelectionRange(start, start + wrappedText.length);
    } else {
      const wrappedText = `<${selectedTag}>${text.slice(
        start,
        end
      )}</${selectedTag}>`;

      const newText = `${text.slice(0, start)}${wrappedText}${text.slice(end)}`;
      setReplyText(newText);

      textarea.setSelectionRange(start, start + wrappedText.length);
    }

    setSelectedTag(null);
  };
};

export const handleTextSelection = (setSelectedTag) => {
  return (tag) => {
    setSelectedTag(tag);
  };
};

export const parseHtmlTags = (text) => {
  const range = document.createRange();
  const fragment = range.createContextualFragment(text);
  const div = document.createElement("div");
  div.appendChild(fragment);
  return div.innerHTML;
};
