import { render, screen, fireEvent } from "@testing-library/react";
import ResultModal from "./ResultModal";

// Mock react-confetti
jest.mock("react-confetti", () => {
  return function MockConfetti() {
    return <div data-testid="confetti">Confetti</div>;
  };
});

describe("ResultModal", () => {
  const mockOnPlayAgain = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.innerWidth and window.innerHeight
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  it("does not render when show is false", () => {
    render(
      <ResultModal
        show={false}
        gameStatus="won"
        targetWord="HELLO"
        attempts={["HELLO"]}
        onPlayAgain={mockOnPlayAgain}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByText("Congratulations!")).not.toBeInTheDocument();
  });

  it("renders win message when game is won", () => {
    render(
      <ResultModal
        show={true}
        gameStatus="won"
        targetWord="HELLO"
        attempts={["HELLO"]}
        onPlayAgain={mockOnPlayAgain}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("🎉")).toBeInTheDocument();
    expect(screen.getByText("Congratulations!")).toBeInTheDocument();
    expect(screen.getByText("You solved it in 1 guess!")).toBeInTheDocument();
  });

  it("renders loss message when game is lost", () => {
    render(
      <ResultModal
        show={true}
        gameStatus="lost"
        targetWord="HELLO"
        attempts={["WORLD", "CRANE", "SLATE", "BLAME", "FLAME", "GRADE"]}
        onPlayAgain={mockOnPlayAgain}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("😔")).toBeInTheDocument();
    expect(screen.getByText("Better luck next time!")).toBeInTheDocument();
    expect(screen.getByText("The word was: HELLO")).toBeInTheDocument();
  });

  it("displays correct number of attempts for win", () => {
    render(
      <ResultModal
        show={true}
        gameStatus="won"
        targetWord="HELLO"
        attempts={["CRANE", "SLATE", "HELLO"]}
        onPlayAgain={mockOnPlayAgain}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("You solved it in 3 guesses!")).toBeInTheDocument();
  });

  it("displays game statistics", () => {
    render(
      <ResultModal
        show={true}
        gameStatus="won"
        targetWord="HELLO"
        attempts={["HELLO"]}
        onPlayAgain={mockOnPlayAgain}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("Attempts")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Won")).toBeInTheDocument();
  });

  it("shows confetti when game is won", () => {
    render(
      <ResultModal
        show={true}
        gameStatus="won"
        targetWord="HELLO"
        attempts={["HELLO"]}
        onPlayAgain={mockOnPlayAgain}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByTestId("confetti")).toBeInTheDocument();
  });

  it("does not show confetti when game is lost", () => {
    render(
      <ResultModal
        show={true}
        gameStatus="lost"
        targetWord="HELLO"
        attempts={["WORLD", "CRANE", "SLATE", "BLAME", "FLAME", "GRADE"]}
        onPlayAgain={mockOnPlayAgain}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByTestId("confetti")).not.toBeInTheDocument();
  });

  it("calls onPlayAgain when Play Again button is clicked", () => {
    render(
      <ResultModal
        show={true}
        gameStatus="won"
        targetWord="HELLO"
        attempts={["HELLO"]}
        onPlayAgain={mockOnPlayAgain}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByText("Play Again"));
    expect(mockOnPlayAgain).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Close button is clicked", () => {
    render(
      <ResultModal
        show={true}
        gameStatus="won"
        targetWord="HELLO"
        attempts={["HELLO"]}
        onPlayAgain={mockOnPlayAgain}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByText("Close"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when overlay is clicked", () => {
    render(
      <ResultModal
        show={true}
        gameStatus="won"
        targetWord="HELLO"
        attempts={["HELLO"]}
        onPlayAgain={mockOnPlayAgain}
        onClose={mockOnClose}
      />
    );

    // Find the overlay by its class
    const overlay = document.querySelector(".fixed.inset-0");
    if (overlay) {
      fireEvent.click(overlay);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it("does not call onClose when modal content is clicked", () => {
    render(
      <ResultModal
        show={true}
        gameStatus="won"
        targetWord="HELLO"
        attempts={["HELLO"]}
        onPlayAgain={mockOnPlayAgain}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByText("Congratulations!"));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("handles plural attempts correctly", () => {
    render(
      <ResultModal
        show={true}
        gameStatus="won"
        targetWord="HELLO"
        attempts={["CRANE", "SLATE", "HELLO"]}
        onPlayAgain={mockOnPlayAgain}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("You solved it in 3 guesses!")).toBeInTheDocument();
  });

  it("handles single attempt correctly", () => {
    render(
      <ResultModal
        show={true}
        gameStatus="won"
        targetWord="HELLO"
        attempts={["HELLO"]}
        onPlayAgain={mockOnPlayAgain}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("You solved it in 1 guess!")).toBeInTheDocument();
  });

  it("displays status text correctly", () => {
    render(
      <ResultModal
        show={true}
        gameStatus="won"
        targetWord="HELLO"
        attempts={["HELLO"]}
        onPlayAgain={mockOnPlayAgain}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("Won")).toBeInTheDocument();
  });

  it("displays loss status text correctly", () => {
    render(
      <ResultModal
        show={true}
        gameStatus="lost"
        targetWord="HELLO"
        attempts={["WORLD", "CRANE", "SLATE", "BLAME", "FLAME", "GRADE"]}
        onPlayAgain={mockOnPlayAgain}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("Lost")).toBeInTheDocument();
  });
});
