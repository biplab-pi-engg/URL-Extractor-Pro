// --- Utility Functions ---
export const escapeHtml = (unsafe) => {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const showStatus = (element, message, type = "info", duration = 3000) => {
  if (!element) {
    console.log(`Status (${type}): ${message}`); // Fallback if no element is provided
    return;
  }
  element.textContent = message;
  element.className = `status ${type}`; // type can be 'info', 'success', 'error'
  if (duration > 0) {
    setTimeout(() => {
      if (element.textContent === message) {
        element.textContent = "";
        element.className = "status";
      }
    }, duration);
  }
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "N/A";
  try {
    return new Date(timestamp).toLocaleString();
  } catch (e) {
    return "Invalid Date";
  }
};

// --- URL Opening ---
export const openUrlInBackground = (url, statusElement) => {
  chrome.tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => {
      if (tabs.length === 0) throw new Error("Could not find active tab.");
      return chrome.tabs.create({
        url: url,
        active: false,
        index: tabs[0].index + 1,
      });
    })
    .catch((error) => {
      console.error(`Error opening tab for ${url}:`, error);
      if (statusElement) {
        showStatus(
          statusElement,
          `Error opening tab: ${error.message}`,
          "error"
        );
      } else {
        console.error(`Error opening tab: ${error.message} (no status element provided)`);
      }
    });
};

// --- URL Display ---
export const displayGroupedUrls = (
  groupedUrls,
  extractResultsDiv,
  extractLoadingDiv,
  extractStatusDiv 
) => {
  extractResultsDiv.innerHTML = ""; 
  if (extractLoadingDiv) extractLoadingDiv.style.display = "none";

  const groupNames = Object.keys(groupedUrls);

  if (groupNames.length === 0) {
    extractResultsDiv.innerHTML = `<p class="status">No URLs found matching any regex pattern.</p>`; // Template literal
    return;
  }

  let totalUrls = 0;
  groupNames.forEach((groupName) => {
    const urls = groupedUrls[groupName];
    if (urls && urls.length > 0) {
      totalUrls += urls.length;

      const groupContainer = document.createElement("div");
      groupContainer.className = "url-group-container";

      const headerContainer = document.createElement("div");
      headerContainer.className = "group-header-container";

      const groupHeader = document.createElement("h2");
      groupHeader.textContent = escapeHtml(groupName); // Correctly uses escapeHtml with textContent
      groupHeader.className = "group-header";

      const openAllButton = document.createElement("button");
      openAllButton.textContent = `Open All (${urls.length})`;
      openAllButton.className = "open-all-btn small-btn";
      openAllButton.addEventListener("click", () => {
        urls.forEach((url) => {
          openUrlInBackground(url, extractStatusDiv); 
        });
        showStatus(
          extractStatusDiv,
          `Opening ${urls.length} URLs from "${escapeHtml(groupName)}" group.`, // escapeHtml used
          "success"
        );
      });

      headerContainer.appendChild(groupHeader);
      headerContainer.appendChild(openAllButton);
      groupContainer.appendChild(headerContainer);

      const hr = document.createElement("hr");
      hr.className = "header-underline";
      groupContainer.appendChild(hr);

      const ul = document.createElement("ul");
      ul.className = "url-list";

      urls.forEach((url) => {
        const li = document.createElement("li");

        const urlSpan = document.createElement("span");
        urlSpan.className = "url-text";
        // This uses textContent, which is safe. escapeHtml is correctly used.
        urlSpan.textContent =
          url.length > 80
            ? escapeHtml(url.substring(0, 77)) + "..." 
            : escapeHtml(url);
        urlSpan.title = url; // title attribute is also fine with unescaped text

        const actionButtons = document.createElement("div");
        actionButtons.className = "action-buttons";

        const openButton = document.createElement("button");
        openButton.innerHTML = `<i class="icon-open">↗</i>`; // Template literal for static HTML
        openButton.title = "Open URL in new tab";
        openButton.className = "icon-btn open-url-btn";
        openButton.dataset.url = url;
        openButton.addEventListener("click", (event) => {
          openUrlInBackground(event.target.closest(".open-url-btn").dataset.url, extractStatusDiv);
        });

        const copyButton = document.createElement("button");
        copyButton.innerHTML = `<i class="icon-copy">⎘</i>`; // Template literal for static HTML
        copyButton.title = "Copy URL to clipboard";
        copyButton.className = "icon-btn copy-url-btn";
        copyButton.dataset.url = url;
        copyButton.addEventListener("click", (event) => {
          const urlToCopy = event.target.closest(".copy-url-btn").dataset.url;
          navigator.clipboard
            .writeText(urlToCopy)
            .then(() => {
              const originalIcon = copyButton.innerHTML; // Storing old icon
              copyButton.innerHTML = `<i class="icon-check">✓</i>`; // Template literal for static HTML
              copyButton.classList.add("copied");
              setTimeout(() => {
                copyButton.innerHTML = originalIcon; // Restoring original icon
                copyButton.classList.remove("copied");
              }, 1500);
              showStatus(extractStatusDiv, "URL copied to clipboard", "success", 1500);
            })
            .catch((err) => {
              console.error("Could not copy text: ", err);
              showStatus(extractStatusDiv, "Failed to copy URL", "error", 1500);
            });
        });

        actionButtons.appendChild(openButton);
        actionButtons.appendChild(copyButton);
        li.appendChild(urlSpan);
        li.appendChild(actionButtons);
        ul.appendChild(li);
      });
      groupContainer.appendChild(ul);
      extractResultsDiv.appendChild(groupContainer);
    }
  });

  if (totalUrls > 0) {
    showStatus(
      extractStatusDiv,
      `Found ${totalUrls} URL(s) across ${groupNames.length} pattern(s).`, // escapeHtml not strictly needed for numbers, but good if groupNames could have HTML
      "success"
    );
  } else {
     if (groupNames.length > 0) { 
        extractResultsDiv.innerHTML = `<p class="status">No URLs found for the matched patterns.</p>`; // Template literal
     } else { 
        extractResultsDiv.innerHTML = `<p class="status">No URLs found matching any regex pattern.</p>`; // Template literal (already changed above)
     }
  }
};
