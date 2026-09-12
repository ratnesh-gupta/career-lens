import { beforeEach, describe, expect, it } from "vitest";

import { useAuthStore } from "../auth.store";

describe("auth store", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      status: "unauthenticated",
    });
    localStorage.clear();
  });

  it("logout clears user", () => {
    useAuthStore.setState({
      user: {
        id: "1",
        email: "a@b.com",
        displayName: "A",
        avatarUrl: null,
        role: "free",
        isEmailVerified: true,
        createdAt: "",
        updatedAt: "",
      },
      isAuthenticated: true,
    });
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
