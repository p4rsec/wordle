import { render, screen } from "@testing-library/react";
import Toast from "./Toast";

describe("Toast", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when show is false", () => {
    render(<Toast show={false} message="Test message" onClose={mockOnClose} />);
    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
  });

  it("renders toast message when show is true", () => {
    render(<Toast show={true} message="Test message" onClose={mockOnClose} />);
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("renders different messages", () => {
    const { rerender } = render(
      <Toast show={true} message="Genius!" onClose={mockOnClose} />
    );
    expect(screen.getByText("Genius!")).toBeInTheDocument();

    rerender(
      <Toast show={true} message="Magnificent!" onClose={mockOnClose} />
    );
    expect(screen.getByText("Magnificent!")).toBeInTheDocument();
  });

  it("applies correct styling", () => {
    render(<Toast show={true} message="Test message" onClose={mockOnClose} />);
    const toast = screen.getByText("Test message");
    expect(toast).toHaveClass(
      "bg-gray-900",
      "dark:bg-gray-100",
      "text-white",
      "dark:text-gray-900"
    );
  });

  it("renders with correct positioning", () => {
    render(<Toast show={true} message="Test message" onClose={mockOnClose} />);
    const toast = screen.getByText("Test message");
    const container = toast.closest(".fixed");
    expect(container).toHaveClass(
      "bottom-8",
      "left-1/2",
      "transform",
      "-translate-x-1/2",
      "z-50"
    );
  });
});
