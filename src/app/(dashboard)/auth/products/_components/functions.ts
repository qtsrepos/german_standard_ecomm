const convertInput = (str: string) => {
  const parts = str.split("|").map(Number);
  if (parts.length === 1) {
    return { category: parts[0] };
  } else if (parts.length === 2) {
    return { category: parts[0], subCategory: parts[1] };
  } else {
    return {};
  }
};
export default convertInput;
