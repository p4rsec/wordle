# 🎯 Wordle Game

A modern, animated Wordle game built with Next.js 15, React 19, TypeScript, and Tailwind CSS 4. Features programming-themed words and smooth animations powered by Framer Motion.

## ✨ Features

- **Modern Tech Stack**: Built with the latest Next.js 15, React 19, and Tailwind CSS 4
- **Smooth Animations**: Beautiful animations using Framer Motion
- **Programming Words**: 5-letter programming and technology-related words
- **Dark Mode Support**: Automatic dark mode detection and styling
- **Statistics Tracking**: Track your games played, win rate, and streaks
- **Share Results**: Share your game results with emoji squares
- **Local Storage**: Game state persists between sessions
- **Responsive Design**: Works perfectly on desktop and mobile
- **Virtual Keyboard**: On-screen keyboard with visual feedback
- **Keyboard Support**: Full keyboard navigation support

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

1. **Objective**: Guess the 5-letter programming word in 6 attempts
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
├── app/
│   ├── components/
│   │   └── WordleGame.tsx    # Main game component
│   ├── data/
│   │   └── words.ts          # 5-letter word list
│   ├── globals.css           # Global styles and animations
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page
├── package.json
└── README.md
```

## 🎨 Features in Detail

### Animations

- **Entry Animations**: Staggered animations for game grid and keyboard
- **Letter Animations**: 3D flip animations when letters are entered
- **Shake Animation**: Visual feedback for invalid attempts
- **Modal Animations**: Smooth transitions for stats and share modals
- **Hover Effects**: Interactive button animations

### Game Logic

- **Word Validation**: Ensures 5-letter words only
- **State Management**: Comprehensive game state with React hooks
- **Persistence**: Local storage for game progress and statistics
- **Daily Reset**: New word each day (based on date)

### UI/UX

- **Responsive Design**: Optimized for all screen sizes
- **Dark Mode**: Automatic theme detection
- **Accessibility**: Keyboard navigation and screen reader support
- **Visual Feedback**: Color-coded keyboard and grid tiles

## 🎯 Word Categories

The game includes 5-letter words from various programming and technology categories:

- **Programming Languages**: REACT, NEXT, RUST, SWIFT, KOTLIN, DART, PHP, JAVA, SCALA
- **Frameworks & Tools**: VUE, ANGULAR, DOCKER, REDIS, MONGO, GITHUB, AWS, GCP
- **Build Tools**: WEBPACK, VITE, ROLLUP, ESBUILD, SWC, BABEL
- **Databases**: POSTGRES, MYSQL, SQLITE, CASSANDRA, DYNAMO
- **Monitoring**: ELASTIC, KIBANA, PROMETHEUS, GRAFANA, SENTRY
- **And many more...**

## 📊 Statistics

Track your performance with comprehensive statistics:

- Games played
- Win rate percentage
- Current streak
- Maximum streak
- Guess distribution

## 🔧 Customization

### Adding New Words

Edit the `WORDS` array in `src/app/data/words.ts`:

```typescript
export const WORDS = [
  "REACT",
  "NEXT",
  "NODE",
  "RUST",
  "SWIFT",
  // Add your 5-letter words here
];
```

### Styling

Modify the Tailwind classes in the component or update `src/app/globals.css` for custom animations.

### Game Settings

Adjust constants in the component:

- `WORD_LENGTH`: Length of target words (default: 5)
- `MAX_ATTEMPTS`: Maximum number of guesses (default: 6)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:

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

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the original Wordle game
- Built with modern web technologies
- Special thanks to the Next.js, React, and Tailwind CSS communities

---

**Happy coding and happy guessing! 🎉**
