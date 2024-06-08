// getDateTimeString.js

// Helper function to add leading zeros
function padZero(num) {
  return num.toString().padStart(2, '0');
}

// Function to get the current date and time as a formatted string
function getDateTimeString() {
  // Get the current date and time
  const now = new Date();

  // Create an object with the desired properties
  const dateTime = {
      day: padZero(now.getDate()),
      month: padZero(now.getMonth() + 1), // Months are zero-based, so add 1
      year: now.getFullYear(),
      hour: padZero(now.getHours()),
      minute: padZero(now.getMinutes()),
      second: padZero(now.getSeconds())
  };

  // Concatenate the date and time values into a single string in ISO format
  const dateTimeString = `${dateTime.year}-${dateTime.month}-${dateTime.day}T${dateTime.hour}:${dateTime.minute}:${dateTime.second}`;

  // Return the formatted string
  return dateTimeString;
}

// Export the function for use in other files
module.exports = getDateTimeString;
