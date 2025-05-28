import { storageKeys } from './js/constants.js';
import { loadData } from './js/storage.js';
import { showStatus, formatTimestamp, escapeHtml, displayGroupedUrls } from './js/ui.js';
// cryptoGenerateId from utils.js is not directly used in popup.js anymore after history.js refactoring.
// import { generateId as cryptoGenerateId } from './js/utils.js'; 
import { 
  initRegexModule, 
  setRegexList, 
  getRegexList, 
  renderRegexList as renderRegexListFromModule, 
  saveRegex as saveRegexFromModule 
} from './js/regex.js';
import {
  initHistoryModule,
  setHistoryList,
  renderHistory as renderHistoryFromModule,
  addToHistory as addToHistoryFromModule
  // clearHistory is implicitly called via event listener in history.js
} from './js/history.js';
import { extractAndDisplayUrls as extractAndDisplayUrlsFromExtractor } from './js/extractor.js';

document.addEventListener("DOMContentLoaded", () => {
  // --- Globals ---
  // regexList is now managed by js/regex.js
  // historyList is now managed by js/history.js

  // --- DOM Elements ---
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  // Extract Tab Elements
  const extractBtn = document.getElementById("extractBtn");
  const extractResultsDiv = document.getElementById("extractResults");
  const extractStatusDiv = document.getElementById("extractStatus");
  const extractLoadingDiv = document.getElementById("extractLoading");

  // Regex Tab Elements
  const regexForm = document.getElementById("regexForm");
  const regexNameInput = document.getElementById("regexName");
  const regexValueInput = document.getElementById("regexValue");
  const regexEditIdInput = document.getElementById("regexEditId");
  const saveRegexBtn = document.getElementById("saveRegexBtn");
  const regexListUl = document.getElementById("regexList");
  const regexStatusDiv = document.getElementById("regexStatus");

  // History Tab Elements
  const historySearchInput = document.getElementById("historySearch");
  const historySortSelect = document.getElementById("historySort");
  const historyListUl = document.getElementById("historyList");
  const historyStatusDiv = document.getElementById("historyStatus");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn"); // New button

  // --- Utility Functions ---
  // showStatus, formatTimestamp, escapeHtml are now imported from ./ui.js
  // generateId is now imported from ./utils.js as cryptoGenerateId

  // --- Tab Switching Logic ---
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.dataset.tab;

      // Update button active state
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Update content active state
      tabContents.forEach((content) => {
        if (content.id === targetTab) {
          content.classList.add("active");
        } else {
          content.classList.remove("active");
        }
      });
      // Refresh lists when switching to their tabs
      if (targetTab === "regexTab") renderRegexListFromModule(); 
      if (targetTab === "historyTab") renderHistoryFromModule(); // Use imported history function
    });
  });

  // --- Regex Management ---
  // All regex functions are now in js/regex.js
  // Event listeners related to regex management will be set up in initialize

  // --- History Management ---
  // renderHistory, addToHistory, clearHistory are now in js/history.js
  // Event listeners for history controls are set up in history.js's initHistoryModule.

  // --- URL Extraction ---
  // extractAndDisplayUrls is now imported from js/extractor.js

  // --- Initialization ---
  const initialize = async () => {
    // Initialize Regex Module
    const regexDomElements = {
      regexListUl,
      regexNameInput,
      regexValueInput,
      regexEditIdInput,
      saveRegexBtn,
      regexStatusDiv,
      regexForm 
    };
    initRegexModule(regexDomElements);
    
    // Load data
    const loadedRegexPatterns = await loadRegexPatternsFromStorage();
    setRegexList(loadedRegexPatterns); // Pass loaded patterns to regex.js
    renderRegexListFromModule(); 

    // Initialize History Module
    const historyDomElements = {
      historyListUl,
      historySearchInput,
      historySortSelect,
      historyStatusDiv,
      clearHistoryBtn // Pass the button itself
    };
    // Function to check if history tab is active
    const isHistoryTabActiveFn = () => {
      const historyTabElement = document.getElementById("historyTab");
      return historyTabElement && historyTabElement.classList.contains("active");
    };
    initHistoryModule(historyDomElements, isHistoryTabActiveFn);

    const loadedHistory = await loadData(storageKeys.history);
    setHistoryList(loadedHistory); // Pass loaded history to history.js
    // Initial render of history if tab is active is handled by history.js or tab switching logic
    if (isHistoryTabActiveFn()) {
        renderHistoryFromModule();
    }


    // Setup Regex Tab
    if(regexForm) regexForm.addEventListener("submit", saveRegexFromModule);

    // Setup History Tab - Event listeners are now set up within initHistoryModule in history.js
    // historySearchInput.addEventListener("input", renderHistoryFromModule); // Handled by history.js
    // historySortSelect.addEventListener("change", renderHistoryFromModule); // Handled by history.js
    // clearHistoryBtn.addEventListener("click", clearHistoryFromModule); // Handled by history.js

    // Setup Extract Tab
    if (extractBtn) {
      extractBtn.addEventListener("click", () => {
        extractAndDisplayUrlsFromExtractor(
          { extractResultsDiv, extractLoadingDiv, extractStatusDiv },
          getRegexList,      // from regex.js
          addToHistoryFromModule, // from history.js
          displayGroupedUrls, // from ui.js
          showStatus,         // from ui.js
          escapeHtml          // from ui.js
        );
      });
    }

    // Initial Render (only for the default active tab, others render on switch)
    // Assuming 'extractTab' is the default active tab, no initial render needed here.
    // If 'regexTab' or 'historyTab' were default, call their render functions here.

    // Set default tab (if needed, default is first tab 'Extract')
    // document.querySelector('.tab-button[data-tab="extractTab"]').click();

    console.log("Extension initialized.");
  };

  initialize(); // Start the extension logic
});
