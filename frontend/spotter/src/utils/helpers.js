
// Format date in a readable way
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  // Capitalize first letter of a string
  export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  export const roundTo6 = (num) => Math.round(num * 1e6) / 1e6;