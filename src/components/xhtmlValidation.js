export const validateXhtmlTags = (text) => {
  if (!/<[a-zA-Z]/.test(text)) {
    if (!/<\/[a-zA-Z]/.test(text)) {
      return true;
    }
  }
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "application/xml");
    const errors = doc.getElementsByTagName("parsererror");
    return errors.length === 0;
  } catch (error) {
    return false;
  }
};
