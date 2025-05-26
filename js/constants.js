export const MAX_HISTORY_SIZE = 500;

export const storageKeys = {
  regex: "htmlExtractorRegexList",
  history: "htmlExtractorHistory",
};

export const defaultRegexPatterns = [
  {
    id: Date.now(), // Note: Date.now() will be evaluated when this module is loaded.
    name: "All HTTP/HTTPS URLs (demo)",
    value: "https?:\\/\\/[\\w\\.-]+\\.[a-zA-Z]{2,}(\\/[\\w\\.-]*)*",
  },
  {
    id: Date.now() + 1,
    name: "Image URLs (demo)",
    value:
      "https?:\\/\\/[\\w\\.-]+\\.[a-zA-Z]{2,}(\\/[\\w\\.-]*)*\\.(jpg|jpeg|png|gif|webp)",
  },
  {
    id: Date.now() + 2,
    name: "AWS CodeDeploy URLs (demo)",
    value:
      "https:\\/\\/console\\.aws\\.amazon\\.com\\/codedeploy\\/home\\?region=[a-zA-Z0-9-]+#\\/deployments\\/d-[A-Z0-9]+",
  },
];
