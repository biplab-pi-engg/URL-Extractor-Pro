// This module handles the core URL extraction logic.

// Note: The actual chrome API calls (chrome.tabs.query, chrome.scripting.executeScript)
// remain within this function as they are central to its purpose.

export const extractAndDisplayUrls = async (
  domElements,
  getRegexListFn,
  addToHistoryFn,
  displayGroupedUrlsFn,
  showStatusFn,
  escapeHtmlFn
) => {
  if (domElements.extractResultsDiv) domElements.extractResultsDiv.innerHTML = "";
  showStatusFn(domElements.extractStatusDiv, "", "info");
  if (domElements.extractLoadingDiv) domElements.extractLoadingDiv.style.display = "block";

  const currentRegexList = getRegexListFn();
  if (currentRegexList.length === 0) {
    showStatusFn(
      domElements.extractStatusDiv,
      'No regex patterns defined. Add patterns in the "Manage Regex" tab.',
      "error"
    );
    if (domElements.extractLoadingDiv) domElements.extractLoadingDiv.style.display = "none";
    return;
  }

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab) throw new Error("Could not find active tab.");
    if (
      tab.url &&
      (tab.url.startsWith("chrome://") ||
        tab.url.startsWith("https://chrome.google.com/webstore"))
    ) {
      throw new Error("Cannot extract HTML from this special page.");
    }

    const injectionResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.documentElement.outerHTML,
    });

    if (
      chrome.runtime.lastError ||
      !injectionResults ||
      injectionResults.length === 0 ||
      !injectionResults[0].result
    ) {
      let errorMsg = "Failed to retrieve HTML from the page.";
      if (chrome.runtime.lastError)
        errorMsg += ` Error: ${chrome.runtime.lastError.message}`;
      throw new Error(errorMsg);
    }

    const htmlContent = injectionResults[0].result;
    const groupedUrls = {};
    const allFoundUrls = new Set();

    currentRegexList.forEach((regexItem) => {
      try {
        const regex = new RegExp(regexItem.value, "g");
        const matches = htmlContent.match(regex);

        if (matches && matches.length > 0) {
          const uniqueMatches = [...new Set(matches)];
          groupedUrls[regexItem.name] = uniqueMatches;
          uniqueMatches.forEach((url) => allFoundUrls.add(url));
        }
      } catch (e) {
        console.warn(
          `Invalid regex pattern "${regexItem.name}": ${e.message}`
        );
        showStatusFn(
          domElements.extractStatusDiv,
          `Warning: Regex "${escapeHtmlFn(
            regexItem.name
          )}" is invalid and was skipped.`,
          "error",
          5000
        );
      }
    });

    displayGroupedUrlsFn(
      groupedUrls,
      domElements.extractResultsDiv,
      domElements.extractLoadingDiv,
      domElements.extractStatusDiv
    );

    if (allFoundUrls.size > 0) {
      addToHistoryFn(Array.from(allFoundUrls), null);
    }
  } catch (error) {
    console.error("Extraction Error:", error);
    showStatusFn(domElements.extractStatusDiv, `Error: ${error.message}`, "error");
    if (domElements.extractLoadingDiv) domElements.extractLoadingDiv.style.display = "none";
    if (domElements.extractResultsDiv) domElements.extractResultsDiv.innerHTML = ""; // Clear results on error too
  }
};
