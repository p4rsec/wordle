import { render, screen, fireEvent } from "@testing-library/react";
import GameHeader from "./GameHeader";

describe("GameHeader", () => {
  const mockOnStatsClick = jest.fn();
  const mockOnShareClick = jest.fn();
  const mockOnPlayAgainClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the title and description", () => {
    render(
      <GameHeader
        gameStatus="playing"
        onStatsClick={mockOnStatsClick}
        onShareClick={mockOnShareClick}
        onPlayAgainClick={mockOnPlayAgainClick}
      />
    );

    expect(screen.getByText("Wordle")).toBeInTheDocument();
    expect(screen.getByText("Guess the 5-letter word")).toBeInTheDocument();
  });

  it("renders stats button for all game statuses", () => {
    render(
      <GameHeader
        gameStatus="playing"
        onStatsClick={mockOnStatsClick}
        onShareClick={mockOnShareClick}
        onPlayAgainClick={mockOnPlayAgainClick}
      />
    );

    expect(screen.getByText("Stats")).toBeInTheDocument();
  });

  it("calls onStatsClick when stats button is clicked", () => {
    render(
      <GameHeader
        gameStatus="playing"
        onStatsClick={mockOnStatsClick}
        onShareClick={mockOnShareClick}
        onPlayAgainClick={mockOnPlayAgainClick}
      />
    );

    fireEvent.click(screen.getByText("Stats"));
    expect(mockOnStatsClick).toHaveBeenCalledTimes(1);
  });

  it("does not render share and play again buttons when game is playing", () => {
    render(
      <GameHeader
        gameStatus="playing"
        onStatsClick={mockOnStatsClick}
        onShareClick={mockOnShareClick}
        onPlayAgainClick={mockOnPlayAgainClick}
      />
    );

    expect(screen.queryByText("Share")).not.toBeInTheDocument();
    expect(screen.queryByText("Play Again")).not.toBeInTheDocument();
  });

  it("renders share and play again buttons when game is won", () => {
    render(
      <GameHeader
        gameStatus="won"
        onStatsClick={mockOnStatsClick}
        onShareClick={mockOnShareClick}
        onPlayAgainClick={mockOnPlayAgainClick}
      />
    );

    expect(screen.getByText("Share")).toBeInTheDocument();
    expect(screen.getByText("Play Again")).toBeInTheDocument();
  });

  it("renders share and play again buttons when game is lost", () => {
    render(
      <GameHeader
        gameStatus="lost"
        onStatsClick={mockOnStatsClick}
        onShareClick={mockOnShareClick}
        onPlayAgainClick={mockOnPlayAgainClick}
      />
    );

    expect(screen.getByText("Share")).toBeInTheDocument();
    expect(screen.getByText("Play Again")).toBeInTheDocument();
  });

  it("calls onShareClick when share button is clicked", () => {
    render(
      <GameHeader
        gameStatus="won"
        onStatsClick={mockOnStatsClick}
        onShareClick={mockOnShareClick}
        onPlayAgainClick={mockOnPlayAgainClick}
      />
    );

    fireEvent.click(screen.getByText("Share"));
    expect(mockOnShareClick).toHaveBeenCalledTimes(1);
  });

  it("calls onPlayAgainClick when play again button is clicked", () => {
    render(
      <GameHeader
        gameStatus="won"
        onStatsClick={mockOnStatsClick}
        onShareClick={mockOnShareClick}
        onPlayAgainClick={mockOnPlayAgainClick}
      />
    );

    fireEvent.click(screen.getByText("Play Again"));
    expect(mockOnPlayAgainClick).toHaveBeenCalledTimes(1);
  });
});
