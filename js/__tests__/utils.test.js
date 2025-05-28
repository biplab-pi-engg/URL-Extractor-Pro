import { generateId } from "../utils.js";

describe("generateId", () => {
  test("should return a string", () => {
    expect(typeof generateId()).toBe("string");
  });

  test("should return a string of the typical UUID length (36 characters)", () => {
    // Standard UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    expect(generateId()).toHaveLength(36);
  });

  test("should return different IDs on consecutive calls", () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  test("should return IDs that generally match the UUID format", () => {
    // This is a loose check for the UUID format.
    // A more robust test might involve a regex that strictly validates UUID v4.
    const id = generateId();
    // Example: "123e4567-e89b-12d3-a456-426614174000"
    // Check for 4 hyphens and correct segment lengths approximately
    const parts = id.split('-');
    expect(parts).toHaveLength(5);
    expect(parts[0]).toHaveLength(8);
    expect(parts[1]).toHaveLength(4);
    expect(parts[2]).toHaveLength(4);
    expect(parts[3]).toHaveLength(4);
    expect(parts[4]).toHaveLength(12);
  });
});
