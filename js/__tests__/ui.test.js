import { formatTimestamp, escapeHtml } from "../ui.js";

describe("formatTimestamp", () => {
  test("should format a valid timestamp number", () => {
    const timestamp = new Date("2023-10-26T10:00:00Z").getTime();
    // The exact output of toLocaleString can vary by environment/locale.
    // We'll check if it produces a non-empty string that seems date-like.
    // For more robust tests, you might mock toLocaleString or use a library.
    expect(typeof formatTimestamp(timestamp)).toBe("string");
    expect(formatTimestamp(timestamp)).toMatch(/2023|10|26/); // Loosely check for parts of the date
  });

  test('should return "N/A" for null or undefined input', () => {
    expect(formatTimestamp(null)).toBe("N/A");
    expect(formatTimestamp(undefined)).toBe("N/A");
  });

  test('should return "Invalid Date" for an invalid date string input', () => {
    expect(formatTimestamp("this is not a date")).toBe("Invalid Date");
  });

  test("should handle timestamp 0 (Epoch time)", () => {
    // Output depends on locale, so check if it's a string and contains year '1970' or '1969' (TZ dependent)
    const formatted = formatTimestamp(0);
    expect(typeof formatted).toBe("string");
    expect(formatted).toMatch(/1970|1969/); 
  });
});

describe("escapeHtml", () => {
  test("should escape HTML special characters", () => {
    const input = '<div class="test">& \'script\'</div>';
    const expected = "&lt;div class=&quot;test&quot;&gt;&amp; &#039;script&#039;&lt;/div&gt;";
    expect(escapeHtml(input)).toBe(expected);
  });

  test("should return the same string if no escaping is needed", () => {
    const input = "This is a safe string.";
    expect(escapeHtml(input)).toBe(input);
  });

  test("should return an empty string for an empty string input", () => {
    expect(escapeHtml("")).toBe("");
  });

  test("should return the input as is for non-string input", () => {
    expect(escapeHtml(null)).toBeNull();
    expect(escapeHtml(undefined)).toBeUndefined();
    expect(escapeHtml(123)).toBe(123);
    const obj = { a: 1 };
    expect(escapeHtml(obj)).toBe(obj);
  });
});
