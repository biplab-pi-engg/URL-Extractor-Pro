import { validateRegexInput } from "../regex.js";

describe("validateRegexInput", () => {
  test("should return isValid: true for valid name and regex value", () => {
    const result = validateRegexInput("Valid Name", "valid[regex]+");
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeUndefined();
  });

  test("should return isValid: false for empty name", () => {
    const result = validateRegexInput("", "valid[regex]+");
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Name and Regex Value cannot be empty.");
  });

  test("should return isValid: false for empty regex value", () => {
    const result = validateRegexInput("Valid Name", "");
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Name and Regex Value cannot be empty.");
  });

  test("should return isValid: false for regex value starting with /", () => {
    const result = validateRegexInput("Valid Name", "/invalid");
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Do not include leading/trailing slashes in the regex value.");
  });

  test("should return isValid: false for regex value ending with /", () => {
    const result = validateRegexInput("Valid Name", "invalid/");
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Do not include leading/trailing slashes in the regex value.");
  });

  test("should return isValid: false for an invalid regex pattern (e.g., '(')", () => {
    const result = validateRegexInput("Invalid Pattern", "(");
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toMatch(/^Invalid Regex: /); // Error message can vary slightly
  });
  
  test("should return isValid: false for another invalid regex pattern (e.g., '[')", () => {
    const result = validateRegexInput("Invalid Pattern", "[");
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toMatch(/^Invalid Regex: /);
  });

  test("should return isValid: true for a valid complex regex", () => {
    const complexRegex = "^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$";
    const result = validateRegexInput("Complex URL Regex", complexRegex);
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeUndefined();
  });

  test("should return isValid: true for regex with escaped slashes", () => {
    const result = validateRegexInput("Escaped Slashes", "https:\\/\\/example\\.com\\/path");
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeUndefined();
  });
});
