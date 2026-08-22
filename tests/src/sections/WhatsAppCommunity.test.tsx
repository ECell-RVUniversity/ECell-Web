import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WhatsAppCommunity from "@/src/sections/WhatsAppCommunity/WhatsAppCommunity";

describe("WhatsAppCommunity", () => {
  it("renders heading, CTA and interactive chat", () => {
    render(<WhatsAppCommunity />);

    expect(screen.getByRole("heading", { level: 2, name: /Your journey/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Join the community/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Type a question here.../i)).toBeInTheDocument();
  });

  it("submits a message through the input field", () => {
    render(<WhatsAppCommunity />);

    const input = screen.getByPlaceholderText(/Type a question here.../i);
    const form = input.closest("form")!;

    fireEvent.change(input, { target: { value: "Tell me about events" } });
    fireEvent.submit(form);

    expect(screen.getByText("Tell me about events")).toBeInTheDocument();
  });
});
