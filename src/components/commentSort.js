export const handleSortChange = (
  field,
  sortField,
  sortOrder,
  setSortField,
  setSortOrder
) => {
  return () => {
    if (field === sortField) {
      // If the same field is clicked again, toggle the sort order
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      // If a different field is clicked, set it as the new sorting field with default ascending order
      setSortField(field);
      setSortOrder("asc");
    }
  };
};

export const sortedComments = (comments, sortField, sortOrder, getField) => {
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

export const getCurrentComments = (
  comments,
  commentsPerPage,
  indexOfFirstComment,
  indexOfLastComment
) => {
  return comments.slice(indexOfFirstComment, indexOfLastComment);
};

export const getTotalPages = (comments, commentsPerPage) => {
  return Math.ceil(comments.length / commentsPerPage);
};
