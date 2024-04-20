describe("validateUsernameAndPassword", () => {
  it("should return true for valid username and password", () => {
    const isValid = validateUsernameAndPassword("user123", "password123");
    expect(isValid).toBe(true);
  });

  it("should return false if username is empty", () => {
    const isValid = validateUsernameAndPassword("", "password123");
    expect(isValid).toBe(false);
  });

  it("should return false if password is empty", () => {
    const isValid = validateUsernameAndPassword("user123", "");
    expect(isValid).toBe(false);
  });

  it("should return false if username contains special characters", () => {
    const isValid = validateUsernameAndPassword("user@123", "password123");
    expect(isValid).toBe(false);
  });

  it("should return false if password length is less than 6 characters", () => {
    const isValid = validateUsernameAndPassword("user123", "pass");
    expect(isValid).toBe(false);
  });
});
