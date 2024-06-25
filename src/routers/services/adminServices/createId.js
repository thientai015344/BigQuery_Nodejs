


function createId() {
    // Get the current date and time
    const now = new Date();
  
    // Create an object with the desired properties
    const dateTime = {
      day: now.getDate(),
      month: now.getMonth() + 1, // Months are zero-based, so add 1
      year: now.getFullYear(),
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds()
    };
  
    // Helper function to add leading zeros
    function padZero(num) {
      return num.toString().padStart(2, '0');
    }
  
    // Concatenate the date and time values into a single string
    const dateTimeString = `${padZero(dateTime.year)}${padZero(dateTime.month)}${padZero(dateTime.day)}${padZero(dateTime.hour)}${padZero(dateTime.minute)}${padZero(dateTime.second)}`;
  
    // Convert the concatenated string to a number
    const dateTimeNumber = Number(dateTimeString);
  
    // Return the number
    return dateTimeNumber;
  }


  module.exports = createId;
  
//   // Example usage
//   const result = getDateTimeNumber();
//   console.log(result);
  