export const setLocalStorageItem = (key, value) => {
  try {
    const storedData = JSON.parse(localStorage.getItem('dashboard')); // Retrieve existing data from localStorage
    const newData = { ...storedData, [key]: value }; // Add or update the new key-value pair
    localStorage.setItem('dashboard', JSON.stringify(newData)); // Store the updated data in localStorage
  } catch (error) {
    console.error('Error storing item in localStorage:', error);
  }
};