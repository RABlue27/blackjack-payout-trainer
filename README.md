# 🎰 Blackjack Payout Trainer

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://your-username.github.io/blackjack-payout-trainer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-blue)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A fast-paced web-based training application for mastering blackjack payout calculations. Practice 3:2 blackjack payouts with realistic casino chip representations and instant feedback.

![Blackjack Payout Trainer Screenshot](https://via.placeholder.com/800x400/0f4c3a/ffffff?text=Blackjack+Payout+Trainer)

## ⚡ Speed Training Mode

- **Always Blackjack**: Every scenario is a blackjack (3:2 payout)
- **Realistic Bets**: Mix of common and unusual bet amounts ($5, $27, $150, etc.)
- **Casino Chips**: Visual chip stacks instead of dollar amounts
- **Rapid Practice**: Fast transitions for maximum training efficiency
- **Live Stats**: Real-time accuracy and streak tracking

## 🎯 Features

### Core Functionality
- **Realistic Blackjack Scenarios**: Automatically generated hands with various outcomes (blackjack, win, lose, push)
- **Interactive Chip Selection**: Click-to-select chip system with visual feedback and stacking
- **Payout Validation**: Instant feedback on payout accuracy with detailed explanations
- **Progress Tracking**: Score tracking, accuracy percentages, and session statistics
- **Educational Feedback**: Step-by-step payout calculations and helpful tips

### User Experience
- **Casino-Themed Design**: Professional green felt table with realistic chip colors
- **Responsive Layout**: Works on desktop and tablet devices (minimum 1024px width)
- **Smooth Animations**: Polished transitions and visual feedback
- **Keyboard Navigation**: Full keyboard support with shortcuts
- **Accessibility**: Screen reader compatible with ARIA labels

### Technical Features
- **Comprehensive Testing**: Built-in test suite for all components
- **Performance Monitoring**: Real-time performance metrics and optimization
- **Progress Persistence**: Automatic saving of progress and statistics
- **Error Handling**: Graceful error recovery and user feedback

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)
Visit the live demo: **[Play Now](https://your-username.github.io/blackjack-payout-trainer)**

### Option 2: Local Setup
```bash
# Clone the repository
git clone https://github.com/your-username/blackjack-payout-trainer.git
cd blackjack-payout-trainer

# Open in browser
open index.html
# OR serve locally
python -m http.server 8000
# Then visit http://localhost:8000
```

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)
- No dependencies or build process required

### File Structure
```
blackjack-payout-trainer/
├── index.html          # Main application page
├── styles.css          # All styling and animations
├── script.js           # Core application logic
├── test-suite.js       # Comprehensive testing framework
└── README.md           # This documentation
```

## 🎮 How to Use

### Basic Gameplay
1. **View the Scenario**: Each round presents a blackjack hand with player cards, dealer cards, and bet amount
2. **Calculate the Payout**: Determine the correct payout based on the hand result
3. **Select Chips**: Click chips from the tray to build your payout amount
4. **Submit**: Click "Submit Payout" or press Enter to validate your answer
5. **Learn**: Receive immediate feedback with explanations and move to the next scenario

### Payout Rules
- **Blackjack (21 with 2 cards)**: Pays 3:2 (1.5× the bet)
- **Regular Win**: Pays 1:1 (equal to the bet)
- **Push (Tie)**: Return original bet only (no additional payout)
- **Lose**: No payout needed

### Keyboard Shortcuts
- **1-7**: Select chip denominations ($1, $2.50, $5, $25, $100, $500, $1000)
- **Enter/Space**: Submit payout
- **Escape**: Clear selection
- **S**: Show statistics
- **T**: Run test suite
- **P**: Show performance metrics
- **R**: Reset game
- **H/?**: Show help

### Chip Denominations
- **$1** (White): Basic denomination
- **$2.50** (Pink): Half-unit for precise payouts
- **$5** (Red): Standard small denomination
- **$25** (Green): Quarter unit
- **$100** (Black): Standard large denomination
- **$500** (Purple): High denomination
- **$1000** (Gold): Premium denomination

## 📊 Statistics and Progress

### Score Tracking
- **Accuracy Percentage**: Real-time calculation of correct vs. total attempts
- **Current Streak**: Consecutive correct answers
- **Best Streak**: Highest consecutive correct answers achieved
- **Session Statistics**: Time played, scenarios completed, performance rating

### Performance Ratings
- **Excellent**: 95%+ accuracy
- **Great**: 85-94% accuracy
- **Good**: 75-84% accuracy
- **Fair**: 60-74% accuracy
- **Needs Practice**: Below 60% accuracy

### Data Persistence
- Progress automatically saved to browser localStorage
- Session history maintained for up to 30 days
- Statistics persist across browser sessions

## 🧪 Testing

### Built-in Test Suite
The application includes a comprehensive test suite covering:
- Card and hand logic
- Chip selection mechanics
- Scenario generation
- Payout calculations
- Game state management
- Integration workflows
- Performance benchmarks

### Running Tests
- Click the "🧪 Tests" button in the header
- Press **T** on the keyboard
- Check browser console for detailed results

### Test Categories
- **Card System**: Card values, hand calculations, blackjack detection
- **Chip System**: Selection, stacking, value calculations
- **Scenario System**: Generation, result determination, balance
- **Payout System**: Calculations, validation, optimal combinations
- **Game State**: Score tracking, progress, performance ratings
- **Integration**: Complete user workflows
- **Performance**: Speed and memory usage benchmarks

## 🔧 Technical Details

### Architecture
- **Modular Design**: Separate classes for each major component
- **Event-Driven**: Responsive to user interactions and state changes
- **Performance Optimized**: Efficient DOM manipulation and memory usage
- **Error Resilient**: Comprehensive error handling and recovery

### Core Components
- **BlackjackPayoutTrainer**: Main application coordinator
- **GameState**: Progress tracking and session management
- **ChipManager**: Chip selection and visual management
- **ScenarioManager**: Blackjack hand generation and logic
- **PayoutCalculator**: Payout validation and calculations
- **UIController**: User interface updates and interactions
- **FeedbackSystem**: User feedback and educational content

### Browser Compatibility
- **Chrome**: 90+ (recommended)
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Performance Features
- **GPU Acceleration**: Smooth animations using CSS transforms
- **Memory Management**: Efficient object lifecycle and cleanup
- **Lazy Loading**: Optimized resource loading
- **Reduced Motion**: Respects user accessibility preferences

## ♿ Accessibility

### Screen Reader Support
- **ARIA Labels**: Comprehensive labeling for all interactive elements
- **Live Regions**: Dynamic content announcements
- **Semantic HTML**: Proper heading structure and landmarks
- **Focus Management**: Logical tab order and focus indicators

### Keyboard Navigation
- **Full Keyboard Support**: All functionality accessible via keyboard
- **Arrow Key Navigation**: Navigate between chips using arrow keys
- **Shortcut Keys**: Quick access to common functions
- **Focus Indicators**: Clear visual focus indicators

### Visual Accessibility
- **High Contrast Support**: Enhanced visibility in high contrast mode
- **Reduced Motion**: Respects prefers-reduced-motion setting
- **Scalable Text**: Responsive to browser zoom levels
- **Color Independence**: Information not conveyed by color alone

## 🚀 Deployment

### GitHub Pages (Recommended)
1. Fork this repository
2. Go to Settings → Pages
3. Select "Deploy from a branch" → "main"
4. Your app will be live at `https://your-username.github.io/blackjack-payout-trainer`

### Other Options
- **Netlify**: Drag and drop the folder for instant deployment
- **Vercel**: Connect your GitHub repository for automatic deployments
- **Any Web Server**: Copy files to your server directory

### Local Development
```bash
# Simple HTTP server (Python 3)
python -m http.server 8000

# Simple HTTP server (Node.js)
npx http-server

# Then open http://localhost:8000
```

### Production Considerations
- **HTTPS**: Recommended for localStorage persistence
- **Caching**: Set appropriate cache headers for static assets
- **Compression**: Enable gzip compression for better performance
- **CDN**: Consider using a CDN for global distribution

## 🐛 Troubleshooting

### Common Issues

**Application won't load**
- Check browser console for JavaScript errors
- Ensure all files are in the same directory
- Try refreshing the page or clearing browser cache

**Progress not saving**
- Check if localStorage is enabled in browser settings
- Ensure the site is served over HTTPS in production
- Private/incognito mode may prevent localStorage

**Performance issues**
- Check performance metrics (press P)
- Close other browser tabs to free memory
- Refresh the page to reset application state

**Accessibility issues**
- Ensure screen reader is compatible (NVDA, JAWS, VoiceOver)
- Check browser accessibility settings
- Use keyboard navigation if mouse is problematic

### Error Reporting
If you encounter issues:
1. Check the browser console for error messages
2. Note the browser version and operating system
3. Describe the steps that led to the issue
4. Include any error messages displayed

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional chip denominations
- More scenario types (insurance, splits, doubles)
- Sound effects and audio feedback
- Mobile device optimization
- Multiplayer training modes
- Advanced statistics and analytics

## 📞 Support

For questions, issues, or suggestions:
- Check the troubleshooting section above
- Review the built-in help (press H)
- Run the test suite to verify functionality (press T)

---

**Happy Training!** 🎰

Practice makes perfect in blackjack payout calculations. Use this trainer regularly to build confidence and accuracy in real casino situations.