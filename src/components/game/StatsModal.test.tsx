import { render, screen, fireEvent } from "@testing-library/react";
import StatsModal from "./StatsModal";
import { GameStats } from "../../types";

describe("StatsModal", () => {
  const mockOnClose = jest.fn();
  const mockStats: GameStats = {
    gamesPlayed: 10,
    gamesWon: 7,
    currentStreak: 3,
    maxStreak: 5,
    guessDistribution: [0, 1, 2, 3, 1, 0],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when show is false", () => {
    render(<StatsModal show={false} stats={mockStats} onClose={mockOnClose} />);

    expect(screen.queryByText("Statistics")).not.toBeInTheDocument();
  });

  it("renders modal when show is true", () => {
    render(<StatsModal show={true} stats={mockStats} onClose={mockOnClose} />);

    expect(screen.getByText("Statistics")).toBeInTheDocument();
    expect(screen.getByText("Played")).toBeInTheDocument();
    expect(screen.getByText("Win Rate")).toBeInTheDocument();
    expect(screen.getByText("Current Streak")).toBeInTheDocument();
    expect(screen.getByText("Max Streak")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("displays correct statistics", () => {
    render(<StatsModal show={true} stats={mockStats} onClose={mockOnClose} />);

    expect(screen.getByText("10")).toBeInTheDocument(); // gamesPlayed
    expect(screen.getByText("70%")).toBeInTheDocument(); // win rate (7/10 * 100)
    expect(screen.getByText("3")).toBeInTheDocument(); // currentStreak
    expect(screen.getByText("5")).toBeInTheDocument(); // maxStreak
  });

  it("calculates win rate correctly", () => {
    const statsWithWins: GameStats = {
      gamesPlayed: 4,
      gamesWon: 3,
      currentStreak: 2,
      maxStreak: 3,
      guessDistribution: [0, 1, 1, 1, 0, 0],
    };

    render(
      <StatsModal show={true} stats={statsWithWins} onClose={mockOnClose} />
    );

    expect(screen.getByText("75%")).toBeInTheDocument(); // 3/4 * 100 = 75%
  });

  it("shows 0% win rate when no games played", () => {
    const emptyStats: GameStats = {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: [0, 0, 0, 0, 0, 0],
    };

    render(<StatsModal show={true} stats={emptyStats} onClose={mockOnClose} />);

    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("handles perfect win rate", () => {
    const perfectStats: GameStats = {
      gamesPlayed: 5,
      gamesWon: 5,
      currentStreak: 5,
      maxStreak: 5,
      guessDistribution: [1, 1, 1, 1, 1, 0],
    };

    render(
      <StatsModal show={true} stats={perfectStats} onClose={mockOnClose} />
    );

    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("calls onClose when Close button is clicked", () => {
    render(<StatsModal show={true} stats={mockStats} onClose={mockOnClose} />);

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    render(<StatsModal show={true} stats={mockStats} onClose={mockOnClose} />);

    // Find the backdrop by its class name
    const backdrop = document.querySelector(".fixed.inset-0");
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it("does not call onClose when modal content is clicked", () => {
    render(<StatsModal show={true} stats={mockStats} onClose={mockOnClose} />);

    const modalContent = screen.getByText("Statistics");
    fireEvent.click(modalContent);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("renders with zero stats", () => {
    const zeroStats: GameStats = {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: [0, 0, 0, 0, 0, 0],
    };

    render(<StatsModal show={true} stats={zeroStats} onClose={mockOnClose} />);

    // Check that all zero values are present
    const zeroElements = screen.getAllByText("0");
    expect(zeroElements.length).toBeGreaterThanOrEqual(3); // At least 3 zero values
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("renders with high stats", () => {
    const highStats: GameStats = {
      gamesPlayed: 100,
      gamesWon: 85,
      currentStreak: 15,
      maxStreak: 25,
      guessDistribution: [10, 20, 30, 20, 5, 0],
    };

    render(<StatsModal show={true} stats={highStats} onClose={mockOnClose} />);

    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  it("handles decimal win rate rounding", () => {
    const decimalStats: GameStats = {
      gamesPlayed: 3,
      gamesWon: 1,
      currentStreak: 1,
      maxStreak: 1,
      guessDistribution: [0, 1, 0, 0, 0, 0],
    };

    render(
      <StatsModal show={true} stats={decimalStats} onClose={mockOnClose} />
    );

    expect(screen.getByText("33%")).toBeInTheDocument(); // 1/3 * 100 = 33.33... rounded to 33
  });

  it("applies correct styling to Close button", () => {
    render(<StatsModal show={true} stats={mockStats} onClose={mockOnClose} />);

    const closeButton = screen.getByText("Close");
    expect(closeButton).toHaveClass(
      "bg-blue-500",
      "hover:bg-blue-600",
      "text-white",
      "py-2",
      "rounded-lg"
    );
  });

  it("displays all required labels", () => {
    render(<StatsModal show={true} stats={mockStats} onClose={mockOnClose} />);

    expect(screen.getByText("Played")).toBeInTheDocument();
    expect(screen.getByText("Win Rate")).toBeInTheDocument();
    expect(screen.getByText("Current Streak")).toBeInTheDocument();
    expect(screen.getByText("Max Streak")).toBeInTheDocument();
  });

  it("handles multiple close button clicks", () => {
    render(<StatsModal show={true} stats={mockStats} onClose={mockOnClose} />);

    const closeButton = screen.getByText("Close");

    fireEvent.click(closeButton);
    fireEvent.click(closeButton);
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(3);
  });

  it("renders modal with correct structure", () => {
    render(<StatsModal show={true} stats={mockStats} onClose={mockOnClose} />);

    // Check for the main elements
    expect(screen.getByText("Statistics")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();

    // Check that all stat values are displayed (gamesPlayed, currentStreak, maxStreak)
    const statValues = screen.getAllByText(/^\d+$/);
    expect(statValues.length).toBeGreaterThanOrEqual(3); // At least 3 numeric values
  });
});
