import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { ScoreRing } from "../score-ring";

describe("ScoreRing", () => {
  it("renders accessible label with score", () => {
    render(<ScoreRing score={78} />);
    expect(screen.getByRole("img", { name: /78 out of 100/i })).toBeInTheDocument();
  });
});
