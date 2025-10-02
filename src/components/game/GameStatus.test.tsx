import { render, screen, fireEvent } from "@testing-library/react";
import GameStatus from "./GameStatus";

describe("GameStatus", () => {
  const mockOnPlayAgain = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when game is playing", () => {
    render(
      <GameStatus
        gameStatus="playing"
        targetWord="HELLO"
        onPlayAgain={mockOnPlayAgain}
      />
    );

    expect(screen.queryByText("🎉 You Won!")).not.toBeInTheDocument();
    expect(screen.queryByText("😔 Game Over")).not.toBeInTheDocument();
    expect(screen.queryByText("Play Again")).not.toBeInTheDocument();
  });

  it("renders win message when game is won", () => {
    render(
      <GameStatus
        gameStatus="won"
        targetWord="HELLO"
        onPlayAgain={mockOnPlayAgain}
      />
    );

    expect(screen.getByText("🎉 You Won!")).toBeInTheDocument();
    expect(screen.getByText("The word was:")).toBeInTheDocument();
    expect(screen.getByText("HELLO")).toBeInTheDocument();
    expect(screen.getByText("Play Again")).toBeInTheDocument();
  });

  it("renders loss message when game is lost", () => {
    render(
      <GameStatus
        gameStatus="lost"
        targetWord="WORLD"
        onPlayAgain={mockOnPlayAgain}
      />
    );

    expect(screen.getByText("😔 Game Over")).toBeInTheDocument();
    expect(screen.getByText("The word was:")).toBeInTheDocument();
    expect(screen.getByText("WORLD")).toBeInTheDocument();
    expect(screen.getByText("Play Again")).toBeInTheDocument();
  });

  it("calls onPlayAgain when Play Again button is clicked", () => {
    render(
      <GameStatus
        gameStatus="won"
        targetWord="HELLO"
        onPlayAgain={mockOnPlayAgain}
      />
    );

    const playAgainButton = screen.getByText("Play Again");
    fireEvent.click(playAgainButton);

    expect(mockOnPlayAgain).toHaveBeenCalledTimes(1);
  });

  it("displays correct target word for won game", () => {
    render(
      <GameStatus
        gameStatus="won"
        targetWord="CRANE"
        onPlayAgain={mockOnPlayAgain}
      />
    );

    expect(screen.getByText("CRANE")).toBeInTheDocument();
  });

  it("displays correct target word for lost game", () => {
    render(
      <GameStatus
        gameStatus="lost"
        targetWord="SLATE"
        onPlayAgain={mockOnPlayAgain}
      />
    );

    expect(screen.getByText("SLATE")).toBeInTheDocument();
  });

  it("applies correct styling for won game", () => {
    render(
      <GameStatus
        gameStatus="won"
        targetWord="HELLO"
        onPlayAgain={mockOnPlayAgain}
      />
    );

    const winMessage = screen.getByText("🎉 You Won!");
    expect(winMessage).toHaveClass("text-green-600");
  });

  it("applies correct styling for lost game", () => {
    render(
      <GameStatus
        gameStatus="lost"
        targetWord="WORLD"
        onPlayAgain={mockOnPlayAgain}
      />
    );

    const lossMessage = screen.getByText("😔 Game Over");
    expect(lossMessage).toHaveClass("text-red-600");
  });

  it("renders Play Again button with correct styling", () => {
    render(
      <GameStatus
        gameStatus="won"
        targetWord="HELLO"
        onPlayAgain={mockOnPlayAgain}
      />
    );

    const playAgainButton = screen.getByText("Play Again");
    expect(playAgainButton).toHaveClass(
      "bg-blue-500",
      "hover:bg-blue-600",
      "text-white",
      "px-6",
      "py-2",
      "rounded-lg",
      "font-medium"
    );
  });

  it("handles multiple Play Again button clicks", () => {
    render(
      <GameStatus
        gameStatus="lost"
        targetWord="WORLD"
        onPlayAgain={mockOnPlayAgain}
      />
    );

    const playAgainButton = screen.getByText("Play Again");

    fireEvent.click(playAgainButton);
    fireEvent.click(playAgainButton);
    fireEvent.click(playAgainButton);

    expect(mockOnPlayAgain).toHaveBeenCalledTimes(3);
  });

  it("renders with different target words", () => {
    const { rerender } = render(
      <GameStatus
        gameStatus="won"
        targetWord="APPLE"
        onPlayAgain={mockOnPlayAgain}
      />
    );

    expect(screen.getByText("APPLE")).toBeInTheDocument();

    rerender(
      <GameStatus
        gameStatus="won"
        targetWord="BANANA"
        onPlayAgain={mockOnPlayAgain}
      />
    );

    expect(screen.getByText("BANANA")).toBeInTheDocument();
    expect(screen.queryByText("APPLE")).not.toBeInTheDocument();
  });

  it("handles empty target word", () => {
    render(
      <GameStatus
        gameStatus="won"
        targetWord=""
        onPlayAgain={mockOnPlayAgain}
      />
    );

    expect(screen.getByText("The word was:")).toBeInTheDocument();
    expect(screen.getByText("Play Again")).toBeInTheDocument();
  });

  it("handles long target words", () => {
    render(
      <GameStatus
        gameStatus="lost"
        targetWord="SUPERCALIFRAGILISTICEXPIALIDOCIOUS"
        onPlayAgain={mockOnPlayAgain}
      />
    );

    expect(
      screen.getByText("SUPERCALIFRAGILISTICEXPIALIDOCIOUS")
    ).toBeInTheDocument();
  });
});
