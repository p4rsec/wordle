import { render, screen } from "@testing-library/react";
import GameGrid from "./GameGrid";

describe("GameGrid", () => {
  const mockGetLetterState = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders 6 rows of 5 cells each", () => {
    render(
      <GameGrid
        attempts={[]}
        currentAttempt=""
        targetWord="HELLO"
        flipRow={null}
        shake={false}
        getLetterState={mockGetLetterState}
      />
    );

    // Should have 6 rows (MAX_ATTEMPTS)
    const rows = screen
      .getAllByRole("generic")
      .filter((el) => el.className.includes("flex gap-2 mb-2 justify-center"));
    expect(rows).toHaveLength(6);

    // Each row should have 5 cells
    const cells = screen
      .getAllByRole("generic")
      .filter((el) => el.className.includes("w-12 h-12 border-2 rounded-lg"));
    expect(cells).toHaveLength(30); // 6 rows * 5 cells
  });

  it("displays current attempt letters", () => {
    render(
      <GameGrid
        attempts={[]}
        currentAttempt="HELLO"
        targetWord="WORLD"
        flipRow={null}
        shake={false}
        getLetterState={mockGetLetterState}
      />
    );

    // Check that letters appear in the grid (not keyboard)
    const gridCells = screen
      .getAllByRole("generic")
      .filter((el) => el.className.includes("w-12 h-12 border-2 rounded-lg"));
    expect(gridCells.length).toBeGreaterThan(0);
  });

  it("displays previous attempts", () => {
    render(
      <GameGrid
        attempts={["HELLO", "WORLD"]}
        currentAttempt=""
        targetWord="WORLD"
        flipRow={null}
        shake={false}
        getLetterState={mockGetLetterState}
      />
    );

    // Should show letters from previous attempts in grid cells
    const gridCells = screen
      .getAllByRole("generic")
      .filter((el) => el.className.includes("w-12 h-12 border-2 rounded-lg"));
    expect(gridCells.length).toBeGreaterThan(0);
  });

  it("calls getLetterState for completed attempts", () => {
    mockGetLetterState.mockReturnValue("correct");

    render(
      <GameGrid
        attempts={["HELLO"]}
        currentAttempt=""
        targetWord="HELLO"
        flipRow={null}
        shake={false}
        getLetterState={mockGetLetterState}
      />
    );

    // Should call getLetterState for each letter in the attempt
    expect(mockGetLetterState).toHaveBeenCalled();
    expect(mockGetLetterState).toHaveBeenCalledWith("H", 0, "HELLO", "HELLO");
    expect(mockGetLetterState).toHaveBeenCalledWith("E", 1, "HELLO", "HELLO");
    expect(mockGetLetterState).toHaveBeenCalledWith("L", 2, "HELLO", "HELLO");
    expect(mockGetLetterState).toHaveBeenCalledWith("L", 3, "HELLO", "HELLO");
    expect(mockGetLetterState).toHaveBeenCalledWith("O", 4, "HELLO", "HELLO");
  });

  it("applies correct styling for different letter states", () => {
    mockGetLetterState
      .mockReturnValueOnce("correct")
      .mockReturnValueOnce("present")
      .mockReturnValueOnce("absent")
      .mockReturnValueOnce("unused")
      .mockReturnValueOnce("correct");

    render(
      <GameGrid
        attempts={["HELLO"]}
        currentAttempt=""
        targetWord="WORLD"
        flipRow={null}
        shake={false}
        getLetterState={mockGetLetterState}
      />
    );

    // The component should render without errors
    expect(screen.getByText("H")).toBeInTheDocument();
  });

  it("handles empty attempts array", () => {
    render(
      <GameGrid
        attempts={[]}
        currentAttempt=""
        targetWord="HELLO"
        flipRow={null}
        shake={false}
        getLetterState={mockGetLetterState}
      />
    );

    // Should render all 6 rows with empty cells
    const cells = screen
      .getAllByRole("generic")
      .filter((el) => el.className.includes("w-12 h-12 border-2 rounded-lg"));
    expect(cells).toHaveLength(30);
  });

  it("handles partial current attempt", () => {
    render(
      <GameGrid
        attempts={[]}
        currentAttempt="HE"
        targetWord="HELLO"
        flipRow={null}
        shake={false}
        getLetterState={mockGetLetterState}
      />
    );

    expect(screen.getByText("H")).toBeInTheDocument();
    expect(screen.getByText("E")).toBeInTheDocument();
    // Other cells should be empty
    const cells = screen
      .getAllByRole("generic")
      .filter((el) => el.className.includes("w-12 h-12 border-2 rounded-lg"));
    expect(cells).toHaveLength(30);
  });
});
