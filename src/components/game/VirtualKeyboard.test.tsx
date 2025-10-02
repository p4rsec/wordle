import { render, screen, fireEvent } from "@testing-library/react";
import VirtualKeyboard from "./VirtualKeyboard";
import { LetterState } from "../../../types";

describe("VirtualKeyboard", () => {
  const mockOnKeyPress = jest.fn();
  const mockGetKeyboardClass = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetKeyboardClass.mockReturnValue("");
  });

  it("renders all keyboard rows", () => {
    render(
      <VirtualKeyboard
        keyboardState={{}}
        onKeyPress={mockOnKeyPress}
        getKeyboardClass={mockGetKeyboardClass}
      />
    );

    // Should have 3 rows
    const rows = screen
      .getAllByRole("generic")
      .filter((el) => el.className.includes("flex gap-1.5 justify-center"));
    expect(rows).toHaveLength(3);
  });

  it("renders all letters in the first row", () => {
    render(
      <VirtualKeyboard
        keyboardState={{}}
        onKeyPress={mockOnKeyPress}
        getKeyboardClass={mockGetKeyboardClass}
      />
    );

    const firstRowLetters = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
    firstRowLetters.forEach((letter) => {
      expect(screen.getByText(letter)).toBeInTheDocument();
    });
  });

  it("renders all letters in the second row", () => {
    render(
      <VirtualKeyboard
        keyboardState={{}}
        onKeyPress={mockOnKeyPress}
        getKeyboardClass={mockGetKeyboardClass}
      />
    );

    const secondRowLetters = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
    secondRowLetters.forEach((letter) => {
      expect(screen.getByText(letter)).toBeInTheDocument();
    });
  });

  it("renders all letters in the third row", () => {
    render(
      <VirtualKeyboard
        keyboardState={{}}
        onKeyPress={mockOnKeyPress}
        getKeyboardClass={mockGetKeyboardClass}
      />
    );

    const thirdRowLetters = ["Z", "X", "C", "V", "B", "N", "M"];
    thirdRowLetters.forEach((letter) => {
      expect(screen.getByText(letter)).toBeInTheDocument();
    });
  });

  it("renders ENTER and BACKSPACE buttons", () => {
    render(
      <VirtualKeyboard
        keyboardState={{}}
        onKeyPress={mockOnKeyPress}
        getKeyboardClass={mockGetKeyboardClass}
      />
    );

    expect(screen.getByText("ENTER")).toBeInTheDocument();
    expect(screen.getByText("⌫")).toBeInTheDocument(); // BACKSPACE symbol
  });

  it("calls onKeyPress when a letter button is clicked", () => {
    render(
      <VirtualKeyboard
        keyboardState={{}}
        onKeyPress={mockOnKeyPress}
        getKeyboardClass={mockGetKeyboardClass}
      />
    );

    fireEvent.click(screen.getByText("A"));
    expect(mockOnKeyPress).toHaveBeenCalledWith("A");
  });

  it("calls onKeyPress when ENTER button is clicked", () => {
    render(
      <VirtualKeyboard
        keyboardState={{}}
        onKeyPress={mockOnKeyPress}
        getKeyboardClass={mockGetKeyboardClass}
      />
    );

    fireEvent.click(screen.getByText("ENTER"));
    expect(mockOnKeyPress).toHaveBeenCalledWith("ENTER");
  });

  it("calls onKeyPress when BACKSPACE button is clicked", () => {
    render(
      <VirtualKeyboard
        keyboardState={{}}
        onKeyPress={mockOnKeyPress}
        getKeyboardClass={mockGetKeyboardClass}
      />
    );

    fireEvent.click(screen.getByText("⌫"));
    expect(mockOnKeyPress).toHaveBeenCalledWith("BACKSPACE");
  });

  it("applies keyboard class styling", () => {
    mockGetKeyboardClass.mockReturnValue("bg-green-500 text-white");

    render(
      <VirtualKeyboard
        keyboardState={{}}
        onKeyPress={mockOnKeyPress}
        getKeyboardClass={mockGetKeyboardClass}
      />
    );

    const button = screen.getByText("A");
    expect(button).toHaveClass("bg-green-500", "text-white");
  });

  it("calls getKeyboardClass for each key", () => {
    render(
      <VirtualKeyboard
        keyboardState={{}}
        onKeyPress={mockOnKeyPress}
        getKeyboardClass={mockGetKeyboardClass}
      />
    );

    // Should call getKeyboardClass for all keys
    expect(mockGetKeyboardClass).toHaveBeenCalledWith("Q");
    expect(mockGetKeyboardClass).toHaveBeenCalledWith("ENTER");
    expect(mockGetKeyboardClass).toHaveBeenCalledWith("BACKSPACE");
  });

  it("handles keyboard state correctly", () => {
    const keyboardState = {
      A: "correct" as LetterState,
      B: "present" as LetterState,
      C: "absent" as LetterState,
    };

    mockGetKeyboardClass
      .mockReturnValueOnce("bg-green-500")
      .mockReturnValueOnce("bg-yellow-500")
      .mockReturnValueOnce("bg-gray-500");

    render(
      <VirtualKeyboard
        keyboardState={keyboardState}
        onKeyPress={mockOnKeyPress}
        getKeyboardClass={mockGetKeyboardClass}
      />
    );

    expect(mockGetKeyboardClass).toHaveBeenCalledWith("A");
    expect(mockGetKeyboardClass).toHaveBeenCalledWith("B");
    expect(mockGetKeyboardClass).toHaveBeenCalledWith("C");
  });

  it("renders all buttons as clickable", () => {
    render(
      <VirtualKeyboard
        keyboardState={{}}
        onKeyPress={mockOnKeyPress}
        getKeyboardClass={mockGetKeyboardClass}
      />
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);

    // All buttons should be clickable
    buttons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
  });
});
