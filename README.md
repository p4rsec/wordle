# 🎯 Wordle Game

A modern, animated Wordle game built with Next.js 15, React 19, TypeScript, and Tailwind CSS 4. Features a comprehensive 5-letter word list and smooth animations powered by Framer Motion.

## ✨ Features

- **Modern Tech Stack**: Built with the latest Next.js 15, React 19, and Tailwind CSS 4
- **Smooth Animations**: Beautiful flip animations and transitions using Framer Motion
- **Comprehensive Word List**: 2,315 carefully curated 5-letter words
- **Dark Mode Support**: Automatic dark mode detection and optimized styling
- **Statistics Tracking**: Track your games played, win rate, and streaks
- **Share Results**: Share your game results with emoji squares
- **Local Storage**: Game state persists between sessions
- **Responsive Design**: Works perfectly on desktop and mobile
- **Virtual Keyboard**: On-screen keyboard with visual feedback
- **Keyboard Support**: Full keyboard navigation support
- **Smart Letter Highlighting**: Advanced logic for duplicate letter handling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd wordle
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎮 How to Play

1. **Objective**: Guess the 5-letter word in 6 attempts
2. **Input**: Type letters using your keyboard or the virtual keyboard
3. **Feedback**:
   - 🟩 Green: Letter is in the correct position
   - 🟨 Yellow: Letter is in the word but wrong position
   - ⬜ Gray: Letter is not in the word
4. **Submit**: Press Enter or click the Enter button
5. **Win**: Guess the word correctly
6. **Lose**: Run out of attempts

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4.1.12
- **Animations**: Framer Motion 12.23.12
- **Language**: TypeScript 5.9.2
- **Package Manager**: pnpm

## 📁 Project Structure

```
src/
├── components/               # Reusable components
│   ├── index.ts             # Main components export
│   └── game/                # Game-specific components
│       ├── index.ts         # Game components export
│       ├── WordleGame.tsx   # Main game orchestrator
│       ├── GameHeader.tsx   # Header component
│       ├── GameGrid.tsx     # Word grid component
│       ├── VirtualKeyboard.tsx # Keyboard component
│       ├── GameStatus.tsx   # Status component
│       ├── StatsModal.tsx   # Stats modal component
│       ├── ShareNotification.tsx # Share notification
│       └── gameLogic.ts     # Game logic utilities
├── data/                    # Data files
│   └── words.ts             # 5-letter word list (2,315 words)
├── types/                   # TypeScript type definitions
│   ├── index.ts             # Main types export
│   └── game.ts              # Game-specific types
├── app/                     # Next.js app directory
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── package.json
└── README.md
```

## 🎨 Features in Detail

### Animations

- **Flip Animations**: 3D flip animations when submitting words with color reveals
- **Staggered Animations**: Smooth entry animations for game grid and keyboard
- **Shake Animation**: Visual feedback for invalid attempts
- **Modal Animations**: Smooth transitions for stats and share modals
- **Hover Effects**: Interactive button animations

### Game Logic

- **Advanced Letter Highlighting**: Smart handling of duplicate letters
- **Word Validation**: Ensures 5-letter words only
- **State Management**: Comprehensive game state with React hooks
- **Persistence**: Local storage for game progress and statistics
- **Daily Reset**: New word each day (based on date)

### UI/UX

- **Responsive Design**: Optimized for all screen sizes
- **Dark Mode**: Optimized contrast and visibility in dark mode
- **Accessibility**: Keyboard navigation and screen reader support
- **Visual Feedback**: Color-coded keyboard with opacity states for used letters
- **Centered Layout**: Properly centered word grid and keyboard

## 📚 Word List

The game features a comprehensive list of 2,315 carefully curated 5-letter words, providing a rich and varied gameplay experience. The word list includes:

- Common English words
- Everyday vocabulary
- Accessible language for all players
- Balanced difficulty levels

## 📊 Statistics

Track your performance with comprehensive statistics:

- Games played
- Win rate percentage
- Current streak
- Maximum streak
- Guess distribution

## 🔧 Customization

### Adding New Words

Edit the `WORDS` array in `src/data/words.ts`:

```typescript
export const WORDS = [
  "ABACK",
  "ABASE",
  "ABATE",
  // Add your 5-letter words here
];
```

### Styling

Modify the Tailwind classes in the components or update `src/app/globals.css` for custom animations.

### Game Settings

Adjust constants in `src/components/game/gameLogic.ts`:

- `WORD_LENGTH`: Length of target words (default: 5)
- `MAX_ATTEMPTS`: Maximum number of guesses (default: 6)

## 🚀 Deployment

### Cloudflare Pages (Recommended)

1. Push your code to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Navigate to Pages and click "Create a project"
4. Connect your GitHub repository
5. Configure build settings:
   - **Framework preset**: Next.js
   - **Build command**: `pnpm build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (leave empty)
6. Click "Save and Deploy"

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Vercel
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](./LICENSE).

## 🙏 Acknowledgments

- Inspired by the original Wordle game
- Built with modern web technologies
- Special thanks to the Next.js, React, and Tailwind CSS communities

---

**Happy guessing! 🎉**
