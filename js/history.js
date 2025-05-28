import { storageKeys, MAX_HISTORY_SIZE } from './constants.js';
import { saveData } from './storage.js';
import { showStatus, formatTimestamp, escapeHtml, openUrlInBackground } from './ui.js';
import { generateId } from './utils.js';

// --- Module-Scoped Variables ---
let localHistoryList = [];
let domElements = {}; // To store references to DOM elements
let isHistoryTabActive = () => false; // Function to check if history tab is active, will be set by init

// --- Initialization ---
/**
 * Initializes the history module with necessary DOM elements.
 * @param {object} elements - An object containing DOM element references.
 * Expected elements: historyListUl, historySearchInput, historySortSelect, 
 *                    historyStatusDiv, clearHistoryBtn
 * @param {function} isActiveFn - A function that returns true if the history tab is currently active.
 */
export const initHistoryModule = (elements, isActiveFn) => {
  domElements.historyListUl = elements.historyListUl;
  domElements.historySearchInput = elements.historySearchInput;
  domElements.historySortSelect = elements.historySortSelect;
  domElements.historyStatusDiv = elements.historyStatusDiv;
  domElements.clearHistoryBtn = elements.clearHistoryBtn; 

  isHistoryTabActive = isActiveFn;

  if (domElements.historySearchInput) {
    domElements.historySearchInput.addEventListener("input", renderHistory);
  }
  if (domElements.historySortSelect) {
    domElements.historySortSelect.addEventListener("change", renderHistory);
  }
  if (domElements.clearHistoryBtn) {
    domElements.clearHistoryBtn.addEventListener("click", clearHistory);
  }
};

// --- History List Management ---
/**
 * Sets the internal history list for the module.
 * @param {Array} newList - The new list of history items.
 */
export const setHistoryList = (newList) => {
  localHistoryList = newList;
};

// --- Core History Functions (previously in popup.js) ---

export const renderHistory = () => {
  if (!domElements.historyListUl || !domElements.historySearchInput || !domElements.historySortSelect) {
    console.error("History UI elements not initialized in history.js");
    return;
  }
  domElements.historyListUl.innerHTML = ""; // Clear list

  const searchTerm = domElements.historySearchInput.value.toLowerCase();
  const sortBy = domElements.historySortSelect.value;

  let filteredList = localHistoryList.filter((item) =>
    (item.url || '').toLowerCase().includes(searchTerm) 
  );

  filteredList.sort((a, b) => {
    if (sortBy === "oldest") {
      return (a.timestamp || 0) - (b.timestamp || 0);
    } else { 
      return (b.timestamp || 0) - (a.timestamp || 0);
    }
  });

  if (filteredList.length === 0) {
    domElements.historyListUl.innerHTML = `<li>No history items found matching criteria.</li>`; // Template literal
    return;
  }

  filteredList.forEach((item) => {
    const li = document.createElement("li");
    // Already using template literal and escapeHtml correctly for most parts.
    // Added escapeHtml around formatTimestamp for extra safety.
    li.innerHTML = `
            <div class="item-content">
                <span class="item-value">${escapeHtml(item.url)}</span>
                 ${item.regexName
                   ? `<span class="item-detail">Matched by: ${escapeHtml(item.regexName)}</span>`
                   : ""
                 }
                <span class="item-detail">Added: ${escapeHtml(formatTimestamp(item.timestamp))}</span>
            </div>
            <div class="item-actions">
                <button class="open-url-btn" data-url="${escapeHtml(item.url)}">Open</button>
             </div>
        `;
    li.querySelector(".open-url-btn").addEventListener("click", (e) => {
      openUrlInBackground(e.target.dataset.url, domElements.historyStatusDiv);
    });
    domElements.historyListUl.appendChild(li);
  });
};

export const addToHistory = async (urlsToAdd, regexName) => {
  const now = Date.now();
  const newHistoryItems = urlsToAdd.map((url) => ({
    id: generateId(),
    url: url,
    timestamp: now,
    regexName: regexName,
  }));

  localHistoryList = [...newHistoryItems, ...localHistoryList];
  if (localHistoryList.length > MAX_HISTORY_SIZE) {
    localHistoryList = localHistoryList.slice(0, MAX_HISTORY_SIZE);
  }

  await saveData(storageKeys.history, localHistoryList);
  
  if (isHistoryTabActive()) {
    renderHistory();
  }
};

export const clearHistory = async () => {
  if (!domElements.historyStatusDiv) {
     console.error("History status div not initialized in history.js");
     if (!confirm("Are you sure you want to clear your extraction history? (Error: status div missing)")) return;
  } else {
     if (!confirm("Are you sure you want to clear your extraction history?")) return;
  }

  localHistoryList = [];
  await saveData(storageKeys.history, localHistoryList);
  renderHistory(); 
  if (domElements.historyStatusDiv) {
    showStatus(domElements.historyStatusDiv, "History cleared.", "success");
  } else {
    console.log("History cleared (status div missing).")
  }
};
