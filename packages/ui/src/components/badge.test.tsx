import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge (teste de fumaça)", () => {
  it("renderiza o texto em jsdom", () => {
    render(<Badge>Novo</Badge>);
    expect(screen.getByText("Novo")).toBeInTheDocument();
  });
});
