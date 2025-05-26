import { storageKeys, defaultRegexPatterns } from './constants.js';
import { showStatus } from './ui.js'; // Import the real showStatus

export const loadData = async (key) => {
  try {
    const result = await chrome.storage.local.get(key);
    return result[key] || [];
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    showStatus(null, `Error loading data (${key}): ${error.message}`, "error"); // Pass null for element
    return [];
  }
};

export const saveData = async (key, data) => {
  try {
    await chrome.storage.local.set({ [key]: data });
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    showStatus(null, `Error saving data (${key}): ${error.message}`, "error"); // Pass null for element
  }
};

// Function to load regex patterns from storage with default fallback
export const loadRegexPatterns = async (/* renderRegexListCallback */) => {
  // `regexList` is not defined here. This function should return the patterns,
  // and the caller (popup.js) should be responsible for setting its local regexList.
  let patterns;
  try {
    const result = await chrome.storage.local.get(storageKeys.regex);
    if (
      result[storageKeys.regex] &&
      Array.isArray(result[storageKeys.regex]) &&
      result[storageKeys.regex].length > 0
    ) {
      patterns = result[storageKeys.regex];
    } else {
      // Initialize with default patterns if no patterns exist
      patterns = defaultRegexPatterns.map(p => ({...p, id: p.id || Date.now() + Math.random()})); // Ensure IDs are unique if Date.now() is the same
      // Save default patterns to storage
      await saveData(storageKeys.regex, patterns);
      console.log("Default regex patterns initialized in storage.");
    }
    // renderRegexList(); // Commented out as per instructions
    // if (renderRegexListCallback) renderRegexListCallback(patterns);
    return patterns;
  } catch (error) {
    console.error(`Error loading regex patterns:`, error);
    showStatus(null, `Error loading regex patterns: ${error.message}`, "error"); // Pass null for element
    return defaultRegexPatterns.map(p => ({...p, id: p.id || Date.now() + Math.random()})); // Return defaults on error
  }
};
