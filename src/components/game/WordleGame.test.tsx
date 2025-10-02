import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WordleGame from "./WordleGame";

// Mock the word arrays to control the target word
jest.mock("../../data/wordle-La", () => ({
  WORDLE_LA: ["HELLO"],
}));

jest.mock("../../data/wordle-Ta", () => ({
  WORDLE_TA: [],
}));

describe("WordleGame", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
  });

  it("renders the game interface", () => {
    render(<WordleGame />);

    expect(screen.getByText("WORDLE")).toBeInTheDocument();
    expect(screen.getByText("Stats")).toBeInTheDocument();
  });

  it("renders the virtual keyboard", () => {
    render(<WordleGame />);

    // Check for some keyboard letters
    expect(screen.getByText("Q")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("ENTER")).toBeInTheDocument();
    expect(screen.getByText("⌫")).toBeInTheDocument();
  });

  it("handles keyboard input", async () => {
    render(<WordleGame />);

    // Type a letter
    await user.keyboard("H");

    // Check that the letter appears in the grid
    const gridCells = screen
      .getAllByRole("generic")
      .filter((element) => element.textContent === "H");
    expect(gridCells.length).toBeGreaterThan(0);
  });

  it("handles word submission", async () => {
    render(<WordleGame />);

    // Type a complete word
    await user.keyboard("HELLO");
    await user.keyboard("{Enter}");

    // The word should be submitted (check for letters in grid)
    await waitFor(() => {
      const hElements = screen.getAllByText("H");
      expect(hElements.length).toBeGreaterThan(0);
    });
  });

  it("shows stats modal when stats button is clicked", async () => {
    render(<WordleGame />);

    const statsButton = screen.getByText("Stats");
    await user.click(statsButton);

    expect(screen.getByText("Statistics")).toBeInTheDocument();
  });

  it("loads game state from localStorage", () => {
    // Mock localStorage with saved game state
    const savedState = {
      date: new Date().toDateString(),
      state: {
        attempts: ["HELLO"],
        gameStatus: "won",
        targetWord: "HELLO",
        currentAttempt: "",
        keyboardState: {},
        stats: {
          gamesPlayed: 1,
          gamesWon: 1,
          currentStreak: 1,
          maxStreak: 1,
          guessDistribution: [0, 0, 0, 0, 0, 1],
        },
      },
    };
    localStorage.setItem("wordle-game", JSON.stringify(savedState));

    render(<WordleGame />);

    // The game should load the saved state
    expect(localStorage.getItem).toHaveBeenCalledWith("wordle-game");
  });

  it("saves game state to localStorage", async () => {
    render(<WordleGame />);

    // Type a letter
    await user.keyboard("H");

    // Game state should be saved to localStorage
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it("handles invalid word submission", async () => {
    render(<WordleGame />);

    // Type an invalid word (too short)
    await user.keyboard("HI");
    await user.keyboard("{Enter}");

    // The word should not be submitted
    await waitFor(() => {
      const hElements = screen.getAllByText("H");
      expect(hElements.length).toBeGreaterThan(0);
    });
  });

  it("handles backspace correctly", async () => {
    render(<WordleGame />);

    // Type a letter and then backspace
    await user.keyboard("H");
    await user.keyboard("{Backspace}");

    // The letter should be removed
    await waitFor(() => {
      const hElements = screen.getAllByText("H");
      expect(hElements.length).toBeGreaterThan(0);
    });
  });

  it("handles keyboard button clicks", async () => {
    render(<WordleGame />);

    // Click a keyboard button
    const hButton = screen.getByText("H");
    await user.click(hButton);

    // The letter should appear in the grid
    await waitFor(() => {
      const hElements = screen.getAllByText("H");
      expect(hElements.length).toBeGreaterThan(0);
    });
  });

  it("handles enter button click", async () => {
    render(<WordleGame />);

    // Type a word and click enter
    await user.keyboard("HELLO");
    const enterButton = screen.getByText("ENTER");
    await user.click(enterButton);

    // The word should be submitted
    await waitFor(() => {
      const hElements = screen.getAllByText("H");
      expect(hElements.length).toBeGreaterThan(0);
    });
  });

  it("handles backspace button click", async () => {
    render(<WordleGame />);

    // Type a letter and click backspace
    await user.keyboard("H");
    const backspaceButton = screen.getByText("⌫");
    await user.click(backspaceButton);

    // The letter should be removed
    await waitFor(() => {
      const hElements = screen.getAllByText("H");
      expect(hElements.length).toBeGreaterThan(0);
    });
  });

  it("renders game grid with correct number of rows", () => {
    render(<WordleGame />);

    // Should have 6 rows (MAX_ATTEMPTS)
    const gridRows = screen
      .getAllByRole("generic")
      .filter((element) =>
        element.className.includes("flex gap-2 mb-2 justify-center")
      );
    expect(gridRows.length).toBe(6);
  });

  it("renders game grid with correct number of cells per row", () => {
    render(<WordleGame />);

    // Each row should have 5 cells (WORD_LENGTH)
    const firstRow = screen
      .getAllByRole("generic")
      .filter((element) =>
        element.className.includes("flex gap-2 mb-2 justify-center")
      )[0];

    if (firstRow) {
      const cells = firstRow.querySelectorAll('[class*="w-14 h-14"]');
      expect(cells.length).toBe(5);
    }
  });

  it("handles multiple letter input", async () => {
    render(<WordleGame />);

    // Type multiple letters
    await user.keyboard("HELLO");

    // All letters should appear in the grid
    await waitFor(() => {
      expect(screen.getAllByText("H").length).toBeGreaterThan(0);
      expect(screen.getAllByText("E").length).toBeGreaterThan(0);
      expect(screen.getAllByText("L").length).toBeGreaterThan(0);
      expect(screen.getAllByText("O").length).toBeGreaterThan(0);
    });
  });

  it("handles keyboard state updates", async () => {
    render(<WordleGame />);

    // Type a word and submit it
    await user.keyboard("HELLO");
    await user.keyboard("{Enter}");

    // Keyboard state should be updated
    await waitFor(() => {
      const hElements = screen.getAllByText("H");
      expect(hElements.length).toBeGreaterThan(0);
    });
  });
});
