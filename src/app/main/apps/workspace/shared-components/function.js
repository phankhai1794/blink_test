// TODO: combine with setLocalStorageItem at '/src/app/main/apps/dashboards/admin/components/index.js'
export const setLocalStorageItem = (key, value) => {
  try {
    const storedData = JSON.parse(localStorage.getItem('cdboard')); // Retrieve existing data from localStorage
    const newData = { ...storedData, [key]: value }; // Add or update the new key-value pair
    localStorage.setItem('cdboard', JSON.stringify(newData)); // Store the updated data in localStorage
  } catch (error) {
    console.error('Error storing item in localStorage:', error);
  }
};