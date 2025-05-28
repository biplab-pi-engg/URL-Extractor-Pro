import { storageKeys } from './constants.js';
import { saveData } from './storage.js';
import { showStatus, escapeHtml } from './ui.js';
import { generateId } from './utils.js';

// --- Module-Scoped Variables ---
let localRegexList = [];
let domElements = {}; // To store references to DOM elements

// --- Initialization ---
export const initRegexModule = (elements) => {
  domElements.regexListUl = elements.regexListUl;
  domElements.regexNameInput = elements.regexNameInput;
  domElements.regexValueInput = elements.regexValueInput;
  domElements.regexEditIdInput = elements.regexEditIdInput;
  domElements.saveRegexBtn = elements.saveRegexBtn;
  domElements.regexStatusDiv = elements.regexStatusDiv;
  domElements.regexForm = elements.regexForm;
};

// --- Regex List Management ---
export const setRegexList = (newList) => {
  localRegexList = newList;
};

export const getRegexList = () => {
  return localRegexList;
};

// --- Validation ---
/**
 * Validates the regex name and value.
 * @param {string} name - The name of the regex pattern.
 * @param {string} value - The regex pattern string.
 * @returns {{isValid: boolean, errorMessage?: string}} Validation result.
 */
export const validateRegexInput = (name, value) => {
  if (!name || !value) {
    return { isValid: false, errorMessage: "Name and Regex Value cannot be empty." };
  }
  if (value.startsWith("/") || value.endsWith("/")) {
    return { isValid: false, errorMessage: "Do not include leading/trailing slashes in the regex value." };
  }
  try {
    new RegExp(value);
  } catch (e) {
    return { isValid: false, errorMessage: `Invalid Regex: ${e.message}` };
  }
  return { isValid: true };
};

// --- Core Regex Functions ---
export const renderRegexList = () => {
  if (!domElements.regexListUl) {
    console.error("Regex List UL not initialized in regex.js");
    return;
  }
  domElements.regexListUl.innerHTML = ""; 
  if (localRegexList.length === 0) {
    domElements.regexListUl.innerHTML = `<li>No regex patterns saved yet.</li>`;
    return;
  }
  localRegexList.forEach((regex) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <div class="item-content">
                <span class="item-name">${escapeHtml(regex.name)}</span>
                <span class="item-value">${escapeHtml(regex.value)}</span>
            </div>
            <div class="item-actions">
                <button class="edit-btn" data-id="${regex.id}">Edit</button>
                <button class="delete-btn" data-id="${regex.id}">Delete</button>
            </div>
        `;
    li.querySelector(".edit-btn").addEventListener("click", () => startEditRegex(regex.id));
    li.querySelector(".delete-btn").addEventListener("click", () => deleteRegex(regex.id));
    domElements.regexListUl.appendChild(li);
  });
};

export const resetRegexForm = () => {
  if (!domElements.regexForm || !domElements.regexEditIdInput || !domElements.saveRegexBtn) {
    console.error("Regex form elements not initialized in regex.js");
    return;
  }
  domElements.regexForm.reset();
  domElements.regexEditIdInput.value = "";
  domElements.saveRegexBtn.textContent = "Add Regex";
};

export const startEditRegex = (id) => {
  if (!domElements.regexEditIdInput || !domElements.regexNameInput || !domElements.regexValueInput || !domElements.saveRegexBtn) {
    console.error("Regex form elements for editing not initialized in regex.js");
    return;
  }
  const regexToEdit = localRegexList.find((r) => r.id === id);
  if (regexToEdit) {
    domElements.regexEditIdInput.value = id;
    domElements.regexNameInput.value = regexToEdit.name;
    domElements.regexValueInput.value = regexToEdit.value;
    domElements.saveRegexBtn.textContent = "Update Regex";
    domElements.regexNameInput.focus();
  }
};

export const saveRegex = async (event) => {
  event.preventDefault(); 
  if (!domElements.regexNameInput || !domElements.regexValueInput || !domElements.regexEditIdInput || !domElements.regexStatusDiv) {
    console.error("Regex form elements for saving not initialized in regex.js");
    return;
  }

  const name = domElements.regexNameInput.value.trim();
  const value = domElements.regexValueInput.value.trim();
  const editId = domElements.regexEditIdInput.value;

  const validation = validateRegexInput(name, value);
  if (!validation.isValid) {
    showStatus(domElements.regexStatusDiv, validation.errorMessage, "error");
    return;
  }

  if (editId) {
    const index = localRegexList.findIndex((r) => r.id === editId);
    if (index > -1) {
      localRegexList[index] = { ...localRegexList[index], name, value };
      showStatus(domElements.regexStatusDiv, "Regex updated successfully.", "success");
    }
  } else {
    const newRegex = { id: generateId(), name, value };
    localRegexList.push(newRegex);
    showStatus(domElements.regexStatusDiv, "Regex added successfully.", "success");
  }

  await saveData(storageKeys.regex, localRegexList);
  renderRegexList();
  resetRegexForm();
};

export const deleteRegex = async (id) => {
  if (confirm("Are you sure you want to delete this regex pattern?")) {
    localRegexList = localRegexList.filter((r) => r.id !== id);
    await saveData(storageKeys.regex, localRegexList);
    renderRegexList();
    if (domElements.regexEditIdInput && domElements.regexEditIdInput.value === id) {
        resetRegexForm();
    }
    showStatus(domElements.regexStatusDiv, "Regex deleted.", "success");
  }
};
