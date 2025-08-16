// Blackjack Payout Trainer - Main Application
// Module structure for game components

/**
 * Main Application Class
 * Coordinates all game components and manages overall application state
 */
class BlackjackPayoutTrainer {
    constructor() {
        try {
            this.gameState = new GameState();
            this.chipManager = new ChipManager(this.gameState);
            this.scenarioManager = new ScenarioManager();
            this.payoutCalculator = new PayoutCalculator();
            this.uiController = new UIController();
            this.feedbackSystem = new FeedbackSystem();
            
            // Performance monitoring
            this.performanceMetrics = {
                startTime: Date.now(),
                scenarioGenerationTimes: [],
                payoutValidationTimes: []
            };
            
            this.init();
        } catch (error) {
            console.error('Failed to initialize Blackjack Payout Trainer:', error);
            this.handleCriticalError(error);
        }
    }

    /**
     * Handle critical application errors
     */
    handleCriticalError(error) {
        const errorMessage = `
            <h4>❌ Application Error</h4>
            <p>The application encountered a critical error and cannot continue:</p>
            <p style="color: #ff6347; font-family: monospace;">${error.message}</p>
            <p>Please refresh the page to restart the application.</p>
            <button onclick="location.reload()" class="submit-btn">Refresh Page</button>
        `;
        
        const feedbackElement = document.getElementById('feedback-content');
        if (feedbackElement) {
            feedbackElement.innerHTML = errorMessage;
        } else {
            alert('Critical error: ' + error.message + '\nPlease refresh the page.');
        }
    }

    /**
     * Initialize the application
     */
    init() {
        console.log('Initializing Blackjack Payout Trainer...');
        
        // Set up component relationships
        this.gameState.setUIController(this.uiController);
        
        // Initialize components
        this.chipManager.initializeChipTray();
        this.setupEventListeners();
        
        // Run basic component tests
        this.scenarioManager.runTests();
        this.payoutCalculator.runTests();
        this.gameState.runTests();
        
        // Generate first scenario
        this.generateNewScenario();
        
        console.log('All systems initialized successfully!');
        console.log('💡 Tip: Press T to run the comprehensive test suite, or H for keyboard shortcuts.');
    }

    /**
     * Set up basic event listeners for the interface
     */
    setupEventListeners() {
        // Reset game button
        const resetBtn = document.getElementById('reset-game');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetGame());
        }

        // Submit payout button
        const submitBtn = document.getElementById('submit-payout');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitPayout());
        }

        // Clear payout button
        const clearBtn = document.getElementById('clear-payout');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearPayout());
        }

        // Show stats button
        const statsBtn = document.getElementById('show-stats');
        if (statsBtn) {
            statsBtn.addEventListener('click', () => this.showDetailedStats());
        }

        // Run tests button
        const testBtn = document.getElementById('run-tests');
        if (testBtn) {
            testBtn.addEventListener('click', () => this.runTestSuite());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardInput(e));
    }

    /**
     * Display welcome message in feedback area
     */
    displayWelcomeMessage() {
        this.feedbackSystem.showWelcomeMessage();
    }

    /**
     * Reset the game
     */
    resetGame() {
        console.log('Resetting game...');
        
        // Show confirmation for reset if there's progress
        if (this.gameState.score.total > 0) {
            const stats = this.gameState.getSessionStats();
            this.feedbackSystem.showFeedback(`
                <h4>⚠️ Reset Game?</h4>
                <p>You will lose your current progress:</p>
                <div class="progress-stats">
                    <div class="stat-item">
                        <span class="stat-label">Current Score:</span>
                        <span class="stat-value">${this.gameState.score.correct}/${this.gameState.score.total}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Accuracy:</span>
                        <span class="stat-value">${this.gameState.getAccuracy()}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Best Streak:</span>
                        <span class="stat-value">${stats.bestStreak}</span>
                    </div>
                </div>
                <div style="margin-top: 15px;">
                    <button onclick="window.blackjackTrainer.confirmReset()" class="submit-btn" style="margin-right: 10px;">Confirm Reset</button>
                    <button onclick="window.blackjackTrainer.cancelReset()" class="clear-btn">Cancel</button>
                </div>
            `, 'warning');
        } else {
            this.performReset();
        }
    }

    /**
     * Confirm reset action
     */
    confirmReset() {
        this.performReset();
    }

    /**
     * Cancel reset action
     */
    cancelReset() {
        this.displayCurrentScenario();
    }

    /**
     * Perform the actual reset
     */
    performReset() {
        this.gameState.reset();
        this.chipManager.clearAllSelections();
        this.displayWelcomeMessage();
        this.feedbackSystem.showFeedback('🔄 Game reset successfully! Starting fresh...', 'info', { autoHide: true, duration: 2000 });
        
        // Generate new scenario after brief delay
        setTimeout(() => this.generateNewScenario(), 2500);
    }

    /**
     * Display current scenario (for cancel reset)
     */
    displayCurrentScenario() {
        if (this.gameState.currentScenario) {
            this.displayScenario(this.gameState.currentScenario);
        } else {
            this.generateNewScenario();
        }
    }

    /**
     * Handle keyboard input for accessibility
     */
    handleKeyboardInput(event) {
        // Don't interfere with typing in input fields
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (event.key) {
            case 'Enter':
            case ' ':
                // Submit payout
                event.preventDefault();
                this.submitPayout();
                break;
            case 'Escape':
                // Clear payout
                event.preventDefault();
                this.clearPayout();
                break;
            case '1':
                event.preventDefault();
                this.selectChipByValue(1);
                break;
            case '2':
                event.preventDefault();
                this.selectChipByValue(2.50);
                break;
            case '3':
                event.preventDefault();
                this.selectChipByValue(5);
                break;
            case '4':
                event.preventDefault();
                this.selectChipByValue(25);
                break;
            case '5':
                event.preventDefault();
                this.selectChipByValue(100);
                break;
            case '6':
                event.preventDefault();
                this.selectChipByValue(500);
                break;
            case '7':
                event.preventDefault();
                this.selectChipByValue(1000);
                break;
            case 's':
            case 'S':
                // Show stats
                event.preventDefault();
                this.showDetailedStats();
                break;
            case 't':
            case 'T':
                // Run tests
                event.preventDefault();
                this.runTestSuite();
                break;
            case 'r':
            case 'R':
                // Reset game
                event.preventDefault();
                this.resetGame();
                break;
            case 'p':
            case 'P':
                // Show performance metrics
                event.preventDefault();
                this.showPerformanceMetrics();
                break;
            case 'h':
            case 'H':
            case '?':
                // Show help
                event.preventDefault();
                this.showKeyboardHelp();
                break;
        }
    }

    /**
     * Select chip by value using keyboard
     */
    selectChipByValue(value) {
        const chip = this.chipManager.getChipByValue(value);
        if (chip) {
            this.chipManager.selectChip(chip, { preventDefault: () => {} });
        }
    }

    /**
     * Show keyboard help
     */
    showKeyboardHelp() {
        this.feedbackSystem.showFeedback(`
            <h4>⌨️ Keyboard Shortcuts</h4>
            <div class="keyboard-help">
                <div class="help-section">
                    <h5>Chip Selection</h5>
                    <p><strong>1-7:</strong> Select chips ($1, $2.50, $5, $25, $100, $500, $1000)</p>
                </div>
                <div class="help-section">
                    <h5>Game Controls</h5>
                    <p><strong>Enter/Space:</strong> Submit payout</p>
                    <p><strong>Escape:</strong> Clear selection</p>
                    <p><strong>S:</strong> Show statistics</p>
                    <p><strong>T:</strong> Run tests</p>
                    <p><strong>P:</strong> Show performance metrics</p>
                    <p><strong>R:</strong> Reset game</p>
                    <p><strong>H/?:</strong> Show this help</p>
                </div>
            </div>
        `, 'info');
    }

    /**
     * Show performance metrics
     */
    showPerformanceMetrics() {
        const metrics = this.performanceMetrics;
        const uptime = Date.now() - metrics.startTime;
        
        const avgScenarioTime = metrics.scenarioGenerationTimes.length > 0 ?
            metrics.scenarioGenerationTimes.reduce((a, b) => a + b, 0) / metrics.scenarioGenerationTimes.length : 0;
        
        const avgValidationTime = metrics.payoutValidationTimes.length > 0 ?
            metrics.payoutValidationTimes.reduce((a, b) => a + b, 0) / metrics.payoutValidationTimes.length : 0;
        
        this.feedbackSystem.showFeedback(`
            <h4>⚡ Performance Metrics</h4>
            <div class="performance-metrics">
                <div class="progress-stats">
                    <div class="stat-item">
                        <span class="stat-label">Uptime:</span>
                        <span class="stat-value">${Math.round(uptime / 1000)}s</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Scenarios Generated:</span>
                        <span class="stat-value">${metrics.scenarioGenerationTimes.length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Avg Scenario Time:</span>
                        <span class="stat-value">${avgScenarioTime.toFixed(2)}ms</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Validations:</span>
                        <span class="stat-value">${metrics.payoutValidationTimes.length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Avg Validation Time:</span>
                        <span class="stat-value">${avgValidationTime.toFixed(2)}ms</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Memory Usage:</span>
                        <span class="stat-value">${this.getMemoryUsage()}</span>
                    </div>
                </div>
            </div>
        `, 'info');
    }

    /**
     * Get estimated memory usage
     */
    getMemoryUsage() {
        if (performance.memory) {
            const used = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
            return `${used}MB`;
        }
        return 'N/A';
    }

    /**
     * Run the comprehensive test suite
     */
    async runTestSuite() {
        if (typeof initializeTestSuite === 'undefined') {
            this.feedbackSystem.showFeedback('❌ Test suite not available.', 'error');
            return;
        }

        this.feedbackSystem.showFeedback(`
            <div class="loading-spinner"></div>
            <h4>🧪 Running Test Suite...</h4>
            <p>This may take a few moments. Check the console for detailed results.</p>
        `, 'info');

        try {
            const testSuite = initializeTestSuite();
            const results = await testSuite.runAllTests();
            
            const successRate = Math.round((results.passed / results.total) * 100);
            const statusIcon = results.failed === 0 ? '✅' : '⚠️';
            const statusColor = results.failed === 0 ? '#00ff00' : '#ffa500';
            
            this.feedbackSystem.showFeedback(`
                <h4>${statusIcon} Test Suite Complete</h4>
                <div class="test-results">
                    <div class="progress-stats">
                        <div class="stat-item">
                            <span class="stat-label">Total Tests:</span>
                            <span class="stat-value">${results.total}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Passed:</span>
                            <span class="stat-value" style="color: #00ff00">${results.passed}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Failed:</span>
                            <span class="stat-value" style="color: #ff6347">${results.failed}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Success Rate:</span>
                            <span class="stat-value" style="color: ${statusColor}">${successRate}%</span>
                        </div>
                    </div>
                    <div class="test-summary">
                        <p><strong>Status:</strong> ${results.failed === 0 ? 'All tests passed!' : `${results.failed} test(s) failed`}</p>
                        <p><strong>Note:</strong> Check the browser console for detailed test output.</p>
                        ${results.failed > 0 ? '<p style="color: #ffa500;">Some tests failed. This may indicate issues that need attention.</p>' : ''}
                    </div>
                </div>
            `, results.failed === 0 ? 'success' : 'warning');
            
        } catch (error) {
            console.error('Test suite error:', error);
            this.feedbackSystem.showFeedback(`
                <h4>❌ Test Suite Error</h4>
                <p>An error occurred while running the test suite:</p>
                <p style="color: #ff6347; font-family: monospace;">${error.message}</p>
                <p>Check the console for more details.</p>
            `, 'error');
        }
    }

    /**
     * Show detailed statistics
     */
    showDetailedStats() {
        const stats = this.gameState.getSessionStats();
        const performance = this.gameState.getPerformanceRating();
        const progressSummary = this.gameState.getProgressSummary();
        
        let historySection = '';
        if (progressSummary) {
            historySection = `
                <div class="stats-section">
                    <h5>Historical Progress</h5>
                    <div class="progress-stats">
                        <div class="stat-item">
                            <span class="stat-label">Total Sessions:</span>
                            <span class="stat-value">${progressSummary.totalSessions}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">All-Time Attempts:</span>
                            <span class="stat-value">${progressSummary.totalAttempts}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Average Accuracy:</span>
                            <span class="stat-value">${progressSummary.averageAccuracy}%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Best Accuracy:</span>
                            <span class="stat-value" style="color: #ffd700">${progressSummary.bestAccuracy}%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">All-Time Best Streak:</span>
                            <span class="stat-value" style="color: #ffd700">${progressSummary.bestStreak}</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        this.feedbackSystem.showFeedback(`
            <h4>📊 Detailed Statistics</h4>
            <div class="detailed-stats">
                <div class="stats-section">
                    <h5>Current Session</h5>
                    <div class="progress-stats">
                        <div class="stat-item">
                            <span class="stat-label">Attempts:</span>
                            <span class="stat-value">${this.gameState.score.total}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Correct:</span>
                            <span class="stat-value" style="color: #00ff00">${this.gameState.score.correct}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Incorrect:</span>
                            <span class="stat-value" style="color: #ff6347">${this.gameState.score.total - this.gameState.score.correct}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Accuracy:</span>
                            <span class="stat-value" style="color: ${performance.color}">${this.gameState.getAccuracy()}%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Session Time:</span>
                            <span class="stat-value">${stats.sessionTimeFormatted}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Current Streak:</span>
                            <span class="stat-value">${stats.currentStreak}</span>
                        </div>
                    </div>
                </div>
                ${historySection}
                <div class="stats-section">
                    <h5>Performance Rating</h5>
                    <div class="performance-rating" style="color: ${performance.color}; font-size: 1.2rem; font-weight: bold; text-align: center; margin: 10px 0;">
                        ${performance.rating}
                    </div>
                    <div style="text-align: center; margin-top: 15px;">
                        <button onclick="window.blackjackTrainer.gameState.clearSavedProgress(); window.blackjackTrainer.feedbackSystem.showFeedback('Progress history cleared!', 'info', {autoHide: true});" class="clear-btn" style="font-size: 0.9rem;">Clear History</button>
                    </div>
                </div>
            </div>
        `, 'info');
    }

    /**
     * Submit payout attempt
     */
    submitPayout() {
        const currentScenario = this.gameState.currentScenario;
        if (!currentScenario) {
            this.feedbackSystem.showFeedback('No scenario available. Please reset the game.', 'error');
            return;
        }

        const totalPayout = this.chipManager.getTotalValue();
        console.log(`Payout submitted: $${totalPayout.toFixed(2)}`);
        
        // Since we're always doing blackjack now, remove lose scenario handling

        // Validate the payout with performance monitoring
        const startTime = performance.now();
        const validation = this.payoutCalculator.validatePayout(currentScenario, totalPayout);
        const endTime = performance.now();
        
        // Track performance
        this.performanceMetrics.payoutValidationTimes.push(endTime - startTime);
        
        if (validation.isCorrect) {
            // Correct payout
            this.gameState.enterFeedbackPhase();
            this.gameState.recordCorrect();
            this.feedbackSystem.showValidationResult(validation, currentScenario);
            
            // Show payout breakdown faster
            const breakdown = this.payoutCalculator.getPayoutBreakdown(currentScenario);
            setTimeout(() => {
                this.feedbackSystem.showPayoutExplanation(currentScenario, breakdown);
            }, 500);
            
            // Generate new scenario much faster for rapid practice
            setTimeout(() => this.generateNewScenario(), 1000);
            
        } else {
            // Incorrect payout
            this.gameState.enterFeedbackPhase();
            this.gameState.recordIncorrect();
            this.feedbackSystem.showValidationResult(validation, currentScenario);
            
            // Show optimal chip combination
            const optimalChips = this.payoutCalculator.calculateOptimalChips(
                validation.correctAmount, 
                this.chipManager.chips
            );
            
            if (optimalChips) {
                setTimeout(() => {
                    const chipSuggestion = optimalChips.map(item => 
                        `${item.count}x ${item.chip.label}`
                    ).join(', ');
                    
                    this.feedbackSystem.showFeedback(`
                        <h4>💡 Try: ${chipSuggestion}</h4>
                        <p>Correct answer: $${validation.correctAmount.toFixed(2)} (3:2 payout)</p>
                        <div class="progress-stats">
                            <div class="stat-item">
                                <span class="stat-label">Accuracy:</span>
                                <span class="stat-value">${this.gameState.getAccuracy()}%</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Streak Reset:</span>
                                <span class="stat-value">0</span>
                            </div>
                        </div>
                        <p style="color: #d4af37; font-style: italic;">Clear and try again quickly!</p>
                    `, 'info');
                }, 400);
            }
        }
    }

    /**
     * Clear payout selection
     */
    clearPayout() {
        console.log('Clearing payout selection...');
        this.chipManager.clearAllSelections();
        this.feedbackSystem.showFeedback('Payout selection cleared.', 'info');
    }

    /**
     * Generate and display a new scenario with performance monitoring
     */
    generateNewScenario() {
        try {
            const startTime = performance.now();
            const scenario = this.scenarioManager.generateScenario();
            const endTime = performance.now();
            
            // Track performance
            this.performanceMetrics.scenarioGenerationTimes.push(endTime - startTime);
            
            this.gameState.setCurrentScenario(scenario);
            this.displayScenario(scenario);
            this.chipManager.clearAllSelections();
            
            // Log performance if it's slow
            const generationTime = endTime - startTime;
            if (generationTime > 50) {
                console.warn(`Slow scenario generation: ${generationTime.toFixed(2)}ms`);
            }
        } catch (error) {
            console.error('Error generating scenario:', error);
            this.feedbackSystem.showFeedback(`
                <h4>❌ Scenario Generation Error</h4>
                <p>Failed to generate a new scenario. Please try again.</p>
                <button onclick="window.blackjackTrainer.generateNewScenario()" class="submit-btn">Try Again</button>
            `, 'error');
        }
    }

    /**
     * Display the current scenario in the UI with animations
     */
    displayScenario(scenario) {
        // Add faster transition class to game table
        const gameTable = document.querySelector('.game-table');
        if (gameTable) {
            gameTable.classList.add('scenario-transition');
            setTimeout(() => gameTable.classList.remove('scenario-transition'), 400);
        }

        // Update dealer cards with faster animation
        const dealerCards = document.getElementById('dealer-cards');
        if (dealerCards) {
            dealerCards.style.opacity = '0';
            dealerCards.style.transform = 'translateY(-5px)';
            
            setTimeout(() => {
                dealerCards.innerHTML = `
                    <div class="hand-display">
                        <div class="cards">${scenario.dealerHand.getCardsDisplay()}</div>
                        <div class="hand-value">${scenario.dealerHand.getDisplayValue()}</div>
                    </div>
                `;
                
                dealerCards.style.transition = 'all 0.2s ease';
                dealerCards.style.opacity = '1';
                dealerCards.style.transform = 'translateY(0)';
            }, 50);
        }

        // Update player cards with faster animation
        const playerCards = document.getElementById('player-cards');
        if (playerCards) {
            playerCards.style.opacity = '0';
            playerCards.style.transform = 'translateY(-5px)';
            
            setTimeout(() => {
                playerCards.innerHTML = `
                    <div class="hand-display">
                        <div class="cards">${scenario.playerHand.getCardsDisplay()}</div>
                        <div class="hand-value">${scenario.playerHand.getDisplayValue()}</div>
                    </div>
                `;
                
                playerCards.style.transition = 'all 0.2s ease';
                playerCards.style.opacity = '1';
                playerCards.style.transform = 'translateY(0)';
            }, 100);
        }

        // Update bet chips display with animation
        const betChipsDisplay = document.getElementById('bet-chips');
        if (betChipsDisplay) {
            betChipsDisplay.style.transform = 'scale(0.8)';
            betChipsDisplay.style.opacity = '0';
            
            setTimeout(() => {
                // Calculate bet chips and organize them casino-style
                const betChips = this.payoutCalculator.calculateBetChips(scenario.betAmount);
                let chipsHtml = '';
                
                // Group chips by denomination and create proper casino-style stacks
                betChips.forEach(chipType => {
                    chipsHtml += `<div class="bet-chip-group">`;
                    
                    if (chipType.count <= 5) {
                        // Small stack - show individual chips
                        chipsHtml += `<div class="bet-chip-stack">`;
                        for (let i = 0; i < chipType.count; i++) {
                            chipsHtml += `<div class="bet-chip ${chipType.color}" style="z-index: ${chipType.count - i}">${chipType.label}</div>`;
                        }
                        chipsHtml += `</div>`;
                    } else {
                        // Large stack - show as organized casino stack
                        const fullStacks = Math.floor(chipType.count / 5);
                        const remainder = chipType.count % 5;
                        
                        // Show full stacks of 5
                        for (let stack = 0; stack < fullStacks; stack++) {
                            chipsHtml += `<div class="bet-chip-stack casino-stack">`;
                            for (let i = 0; i < 5; i++) {
                                chipsHtml += `<div class="bet-chip ${chipType.color}" style="z-index: ${5 - i}">${chipType.label}</div>`;
                            }
                            chipsHtml += `<div class="stack-count">5</div>`;
                            chipsHtml += `</div>`;
                        }
                        
                        // Show remainder chips
                        if (remainder > 0) {
                            chipsHtml += `<div class="bet-chip-stack">`;
                            for (let i = 0; i < remainder; i++) {
                                chipsHtml += `<div class="bet-chip ${chipType.color}" style="z-index: ${remainder - i}">${chipType.label}</div>`;
                            }
                            chipsHtml += `</div>`;
                        }
                    }
                    
                    chipsHtml += `</div>`;
                });
                
                betChipsDisplay.innerHTML = chipsHtml;
                betChipsDisplay.style.transition = 'all 0.2s ease';
                betChipsDisplay.style.transform = 'scale(1)';
                betChipsDisplay.style.opacity = '1';
            }, 150);
        }

        // Update hand result with faster animation
        const handResult = document.getElementById('hand-result');
        if (handResult) {
            handResult.style.transform = 'scale(0.9)';
            handResult.style.opacity = '0';
            
            setTimeout(() => {
                handResult.textContent = scenario.getResultDisplay();
                handResult.className = `result-value result-${scenario.result}`;
                handResult.style.transition = 'all 0.2s ease';
                handResult.style.transform = 'scale(1)';
                handResult.style.opacity = '1';
                
                // Add special effect for blackjack
                if (scenario.result === 'blackjack') {
                    handResult.style.animation = 'chipPulse 0.3s ease';
                }
            }, 200);
        }

        // Update instruction with faster animation
        const instruction = document.getElementById('payout-instruction-text');
        if (instruction) {
            instruction.style.opacity = '0';
            
            setTimeout(() => {
                // Since we're always doing blackjack now
                instruction.textContent = `Calculate the blackjack payout (${scenario.payoutRatio})`;
                
                instruction.style.transition = 'opacity 0.2s ease';
                instruction.style.opacity = '1';
            }, 250);
        }

        // Show current stats instead of scenario details for faster practice
        setTimeout(() => {
            const stats = this.gameState.getSessionStats();
            const performance = this.gameState.getPerformanceRating();
            
            this.feedbackSystem.showFeedback(`
                <h4>⚡ Speed Training Mode</h4>
                <div class="progress-stats">
                    <div class="stat-item">
                        <span class="stat-label">Score:</span>
                        <span class="stat-value">${this.gameState.score.correct}/${this.gameState.score.total}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Accuracy:</span>
                        <span class="stat-value" style="color: ${performance.color}">${this.gameState.getAccuracy()}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Current Streak:</span>
                        <span class="stat-value">${stats.currentStreak}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Best Streak:</span>
                        <span class="stat-value">${stats.bestStreak}</span>
                    </div>
                </div>
                <p style="margin-top: 10px; font-style: italic; color: #d4af37;">Calculate 3:2 payout quickly! Required: $${scenario.correctPayout.toFixed(2)}</p>
            `, 'info');
        }, 200);
    }
}

/**
 * Game State Management Module
 * Manages the current state of the game including scenarios, selections, and scoring
 */
class GameState {
    constructor() {
        this.currentScenario = null;
        this.selectedChips = [];
        this.currentPayout = 0;
        this.score = {
            correct: 0,
            total: 0,
            accuracy: 0
        };
        this.gameActive = false;
        this.uiController = null;
        this.sessionStats = {
            startTime: Date.now(),
            scenariosCompleted: 0,
            averageTime: 0,
            bestStreak: 0,
            currentStreak: 0
        };
        this.gamePhase = 'waiting'; // waiting, playing, feedback, complete
        
        // Load saved progress
        this.loadProgress();
    }

    /**
     * Set UI controller reference
     */
    setUIController(uiController) {
        this.uiController = uiController;
    }

    /**
     * Update selected chips
     */
    updateSelectedChips(chips) {
        this.selectedChips = chips;
        this.saveProgress();
    }

    /**
     * Update current payout total
     */
    updatePayoutTotal(total) {
        this.currentPayout = total;
        if (this.uiController) {
            this.uiController.updatePayoutTotal(total);
        }
    }

    /**
     * Set current scenario and transition to playing phase
     */
    setCurrentScenario(scenario) {
        this.currentScenario = scenario;
        this.gamePhase = 'playing';
        this.gameActive = true;
        this.scenarioStartTime = Date.now();
        this.saveProgress();
    }

    /**
     * Transition to feedback phase
     */
    enterFeedbackPhase() {
        this.gamePhase = 'feedback';
        this.gameActive = false;
    }

    /**
     * Complete current scenario
     */
    completeScenario() {
        if (this.scenarioStartTime) {
            const timeSpent = Date.now() - this.scenarioStartTime;
            this.updateSessionStats(timeSpent);
        }
        this.sessionStats.scenariosCompleted++;
        this.gamePhase = 'waiting';
        this.saveProgress();
    }

    /**
     * Update session statistics
     */
    updateSessionStats(timeSpent) {
        const totalTime = this.sessionStats.averageTime * (this.sessionStats.scenariosCompleted - 1) + timeSpent;
        this.sessionStats.averageTime = totalTime / this.sessionStats.scenariosCompleted;
    }

    /**
     * Update the score display in the UI with animations
     */
    updateScoreDisplay() {
        const correctCount = document.getElementById('correct-count');
        const totalCount = document.getElementById('total-count');
        const accuracyPercent = document.getElementById('accuracy-percent');
        const scoreDisplay = document.querySelector('.score-display');

        // Add update animation
        if (scoreDisplay) {
            scoreDisplay.classList.add('score-update');
            setTimeout(() => scoreDisplay.classList.remove('score-update'), 500);
        }

        if (correctCount) {
            correctCount.style.transform = 'scale(1.2)';
            correctCount.textContent = this.score.correct;
            setTimeout(() => {
                correctCount.style.transition = 'transform 0.3s ease';
                correctCount.style.transform = 'scale(1)';
            }, 100);
        }

        if (totalCount) {
            totalCount.style.transform = 'scale(1.2)';
            totalCount.textContent = this.score.total;
            setTimeout(() => {
                totalCount.style.transition = 'transform 0.3s ease';
                totalCount.style.transform = 'scale(1)';
            }, 150);
        }

        if (accuracyPercent) {
            const accuracy = this.getAccuracy();
            accuracyPercent.style.transform = 'scale(1.2)';
            accuracyPercent.textContent = accuracy;
            
            // Add color coding for accuracy with animation
            let color = '#ff6347';
            if (accuracy >= 90) {
                color = '#00ff00';
            } else if (accuracy >= 70) {
                color = '#ffd700';
            }
            
            setTimeout(() => {
                accuracyPercent.style.transition = 'all 0.3s ease';
                accuracyPercent.style.transform = 'scale(1)';
                accuracyPercent.style.color = color;
            }, 200);
        }
    }

    /**
     * Record a correct answer
     */
    recordCorrect() {
        this.score.correct++;
        this.score.total++;
        this.sessionStats.currentStreak++;
        
        // Update best streak
        if (this.sessionStats.currentStreak > this.sessionStats.bestStreak) {
            this.sessionStats.bestStreak = this.sessionStats.currentStreak;
        }
        
        this.updateScoreDisplay();
        this.completeScenario();
        this.saveProgress();
    }

    /**
     * Record an incorrect answer
     */
    recordIncorrect() {
        this.score.total++;
        this.sessionStats.currentStreak = 0; // Reset streak
        this.updateScoreDisplay();
        this.saveProgress();
    }

    /**
     * Reset the game state
     */
    reset() {
        this.currentScenario = null;
        this.selectedChips = [];
        this.currentPayout = 0;
        this.score = {
            correct: 0,
            total: 0,
            accuracy: 0
        };
        this.sessionStats = {
            startTime: Date.now(),
            scenariosCompleted: 0,
            averageTime: 0,
            bestStreak: 0,
            currentStreak: 0
        };
        this.gameActive = false;
        this.gamePhase = 'waiting';
        this.updateScoreDisplay();
        this.saveProgress();
    }

    /**
     * Get current accuracy percentage
     */
    getAccuracy() {
        return this.score.total > 0 ? 
            Math.round((this.score.correct / this.score.total) * 100) : 0;
    }

    /**
     * Get session statistics
     */
    getSessionStats() {
        const sessionTime = Date.now() - this.sessionStats.startTime;
        return {
            ...this.sessionStats,
            sessionTime: Math.round(sessionTime / 1000), // in seconds
            averageTimeFormatted: this.formatTime(this.sessionStats.averageTime),
            sessionTimeFormatted: this.formatTime(sessionTime)
        };
    }

    /**
     * Format time in milliseconds to readable string
     */
    formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${remainingSeconds}s`;
    }

    /**
     * Check if game is in a specific phase
     */
    isInPhase(phase) {
        return this.gamePhase === phase;
    }

    /**
     * Get performance rating based on accuracy
     */
    getPerformanceRating() {
        const accuracy = this.getAccuracy();
        if (accuracy >= 95) return { rating: 'Excellent', color: '#00ff00' };
        if (accuracy >= 85) return { rating: 'Great', color: '#32cd32' };
        if (accuracy >= 75) return { rating: 'Good', color: '#ffd700' };
        if (accuracy >= 60) return { rating: 'Fair', color: '#ffa500' };
        return { rating: 'Needs Practice', color: '#ff6347' };
    }

    /**
     * Save progress to localStorage
     */
    saveProgress() {
        try {
            const saveData = {
                score: this.score,
                sessionStats: this.sessionStats,
                gamePhase: this.gamePhase,
                timestamp: Date.now(),
                version: '1.0' // For future compatibility
            };
            localStorage.setItem('blackjack-payout-trainer-progress', JSON.stringify(saveData));
            
            // Also save to session history
            this.saveToHistory();
        } catch (error) {
            console.warn('Could not save progress to localStorage:', error);
        }
    }

    /**
     * Save session to history
     */
    saveToHistory() {
        try {
            const historyKey = 'blackjack-payout-trainer-history';
            let history = JSON.parse(localStorage.getItem(historyKey) || '[]');
            
            // Add current session if it has meaningful progress
            if (this.score.total > 0) {
                const sessionData = {
                    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                    score: { ...this.score },
                    sessionStats: { ...this.sessionStats },
                    accuracy: this.getAccuracy(),
                    performance: this.getPerformanceRating(),
                    timestamp: Date.now()
                };
                
                // Remove existing entry for today and add new one
                history = history.filter(entry => entry.date !== sessionData.date);
                history.push(sessionData);
                
                // Keep only last 30 days
                history = history.slice(-30);
                
                localStorage.setItem(historyKey, JSON.stringify(history));
            }
        } catch (error) {
            console.warn('Could not save session history:', error);
        }
    }

    /**
     * Get session history
     */
    getSessionHistory() {
        try {
            const historyKey = 'blackjack-payout-trainer-history';
            return JSON.parse(localStorage.getItem(historyKey) || '[]');
        } catch (error) {
            console.warn('Could not load session history:', error);
            return [];
        }
    }

    /**
     * Get progress summary
     */
    getProgressSummary() {
        const history = this.getSessionHistory();
        if (history.length === 0) return null;

        const totalSessions = history.length;
        const totalAttempts = history.reduce((sum, session) => sum + session.score.total, 0);
        const totalCorrect = history.reduce((sum, session) => sum + session.score.correct, 0);
        const averageAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
        const bestAccuracy = Math.max(...history.map(session => session.accuracy));
        const bestStreak = Math.max(...history.map(session => session.sessionStats.bestStreak));

        return {
            totalSessions,
            totalAttempts,
            totalCorrect,
            averageAccuracy,
            bestAccuracy,
            bestStreak,
            recentSessions: history.slice(-7) // Last 7 sessions
        };
    }

    /**
     * Load progress from localStorage
     */
    loadProgress() {
        try {
            const savedData = localStorage.getItem('blackjack-payout-trainer-progress');
            if (savedData) {
                const data = JSON.parse(savedData);
                
                // Only load if saved within last 24 hours
                const hoursSinceLastSave = (Date.now() - data.timestamp) / (1000 * 60 * 60);
                if (hoursSinceLastSave < 24) {
                    this.score = data.score || this.score;
                    this.sessionStats = { ...this.sessionStats, ...data.sessionStats };
                    console.log('Progress loaded from previous session');
                }
            }
        } catch (error) {
            console.warn('Could not load progress from localStorage:', error);
        }
    }

    /**
     * Clear saved progress
     */
    clearSavedProgress() {
        try {
            localStorage.removeItem('blackjack-payout-trainer-progress');
            console.log('Saved progress cleared');
        } catch (error) {
            console.warn('Could not clear saved progress:', error);
        }
    }

    /**
     * Run unit tests for game state management
     */
    runTests() {
        console.log('Running GameState tests...');

        // Test score tracking
        const initialCorrect = this.score.correct;
        this.recordCorrect();
        console.assert(this.score.correct === initialCorrect + 1, 'Should increment correct score');

        // Test accuracy calculation
        this.score.correct = 8;
        this.score.total = 10;
        console.assert(this.getAccuracy() === 80, 'Should calculate 80% accuracy');

        // Test phase transitions
        this.gamePhase = 'waiting';
        console.assert(this.isInPhase('waiting'), 'Should be in waiting phase');

        // Test performance rating
        this.score.correct = 95;
        this.score.total = 100;
        const rating = this.getPerformanceRating();
        console.assert(rating.rating === 'Excellent', 'Should get excellent rating for 95%');

        console.log('GameState tests passed!');
    }
}

/**
 * Chip Data Model
 * Represents a single chip with its properties and state
 */
class Chip {
    constructor(value, color, label) {
        this.value = value;
        this.color = color;
        this.label = label;
        this.count = 50; // Available chips in tray
        this.selected = 0; // Currently selected chips
        this.id = `chip-${value.toString().replace('.', '-')}`;
    }

    /**
     * Check if chip can be selected
     */
    canSelect() {
        return this.count > this.selected;
    }

    /**
     * Select one chip
     */
    select() {
        if (this.canSelect()) {
            this.selected++;
            return true;
        }
        return false;
    }

    /**
     * Deselect one chip
     */
    deselect() {
        if (this.selected > 0) {
            this.selected--;
            return true;
        }
        return false;
    }

    /**
     * Get total value of selected chips
     */
    getSelectedValue() {
        return this.value * this.selected;
    }

    /**
     * Reset selection
     */
    resetSelection() {
        this.selected = 0;
    }
}

/**
 * Chip Management Module
 * Handles chip denominations, visual representations, and selection logic
 */
class ChipManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.chips = [
            new Chip(1, 'chip-1', '$1'),
            new Chip(2.50, 'chip-2-50', '$2.50'),
            new Chip(5, 'chip-5', '$5'),
            new Chip(25, 'chip-25', '$25'),
            new Chip(100, 'chip-100', '$100'),
            new Chip(500, 'chip-500', '$500'),
            new Chip(1000, 'chip-1000', '$1000')
        ];
        this.chipElements = new Map();
        this.payoutAreaElement = null;
    }

    /**
     * Initialize the chip tray display
     */
    initializeChipTray() {
        const chipTray = document.getElementById('chip-tray');
        if (!chipTray) return;

        chipTray.innerHTML = '';
        this.chipElements.clear();
        
        this.chips.forEach((chip, index) => {
            const chipContainer = document.createElement('div');
            chipContainer.className = 'chip-container';
            chipContainer.dataset.number = (index + 1).toString();
            
            const chipElement = document.createElement('div');
            chipElement.className = `chip ${chip.color}`;
            chipElement.dataset.value = chip.value;
            chipElement.innerHTML = chip.label;
            chipElement.title = `Select ${chip.label} chip (${chip.count - chip.selected} available) - Press ${index + 1}`;
            chipElement.id = chip.id;
            chipElement.tabIndex = 0; // Make focusable for keyboard navigation
            chipElement.setAttribute('role', 'button');
            chipElement.setAttribute('aria-pressed', 'false');
            chipElement.setAttribute('aria-describedby', `chip-help-${chip.id}`);
            
            // Add click event listener
            chipElement.addEventListener('click', (e) => this.selectChip(chip, e));
            
            // Add keyboard event listener
            chipElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectChip(chip, e);
                } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.focusNextChip(index);
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.focusPreviousChip(index);
                }
            });
            
            // Add focus event listener for screen reader announcements
            chipElement.addEventListener('focus', () => {
                this.announceChipFocus(chip);
            });
            
            // Add hover effects
            chipElement.addEventListener('mouseenter', () => this.showChipHover(chipElement, chip));
            chipElement.addEventListener('mouseleave', () => this.hideChipHover(chipElement));
            
            chipContainer.appendChild(chipElement);
            chipTray.appendChild(chipContainer);
            
            this.chipElements.set(chip.id, chipElement);
        });

        // Initialize payout area reference
        this.payoutAreaElement = document.getElementById('payout-chips');
    }

    /**
     * Handle chip selection with visual feedback
     */
    selectChip(chip, event) {
        if (!chip.canSelect()) {
            this.showFeedback('No more chips of this denomination available', 'error');
            return;
        }

        // Select the chip
        if (chip.select()) {
            // Update visual feedback
            this.updateChipVisuals(chip);
            
            // Add chip to payout area
            this.addChipToPayoutArea(chip);
            
            // Update game state
            if (this.gameState) {
                this.gameState.updateSelectedChips(this.getSelectedChips());
                this.gameState.updatePayoutTotal(this.getTotalValue());
            }

            // Visual selection feedback
            const chipElement = this.chipElements.get(chip.id);
            if (chipElement) {
                chipElement.classList.add('chip-selected');
                chipElement.setAttribute('aria-pressed', 'true');
                setTimeout(() => {
                    chipElement.classList.remove('chip-selected');
                    chipElement.setAttribute('aria-pressed', 'false');
                }, 200);
            }

            // Announce selection to screen readers
            const totalValue = this.getTotalValue();
            this.announceToScreenReader(`${chip.label} chip selected. ${chip.selected} selected. Payout total: $${totalValue.toFixed(2)}`);

            // Play selection sound effect (placeholder)
            this.playChipSound();
        }
    }

    /**
     * Add selected chip to payout area with stacking
     */
    addChipToPayoutArea(chip) {
        if (!this.payoutAreaElement) return;

        // Find existing stack for this chip type or create new one
        let chipStack = this.payoutAreaElement.querySelector(`[data-chip-type="${chip.id}"]`);
        
        if (!chipStack) {
            // Create new chip stack
            chipStack = document.createElement('div');
            chipStack.className = 'chip-stack';
            chipStack.dataset.chipType = chip.id;
            chipStack.dataset.count = '0';
            this.payoutAreaElement.appendChild(chipStack);
        }

        // Create the chip element
        const payoutChip = document.createElement('div');
        payoutChip.className = `chip ${chip.color} payout-chip`;
        payoutChip.dataset.value = chip.value;
        payoutChip.innerHTML = chip.label;
        payoutChip.title = `Click to remove ${chip.label} chip`;
        
        // Add click handler to remove chip
        payoutChip.addEventListener('click', () => this.removeChipFromPayout(chip, payoutChip, chipStack));
        
        // Calculate stacking position
        const currentCount = parseInt(chipStack.dataset.count);
        const stackOffset = currentCount * 3; // 3px offset per chip
        
        // Position the chip in the stack
        payoutChip.style.position = 'relative';
        payoutChip.style.zIndex = currentCount + 1;
        payoutChip.style.marginTop = currentCount > 0 ? `-${77 - stackOffset}px` : '0';
        payoutChip.style.marginLeft = currentCount > 0 ? `${stackOffset}px` : '0';
        
        // Add with animation
        payoutChip.style.opacity = '0';
        payoutChip.style.transform = 'scale(0.8) translateY(20px)';
        chipStack.appendChild(payoutChip);
        
        // Update stack count
        chipStack.dataset.count = (currentCount + 1).toString();
        
        // Add stack count indicator
        this.updateStackCountIndicator(chipStack, chip);
        
        // Animate in
        requestAnimationFrame(() => {
            payoutChip.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            payoutChip.style.opacity = '1';
            payoutChip.style.transform = 'scale(1) translateY(0)';
        });

        // Add chip movement sound effect
        this.playChipStackSound();
    }

    /**
     * Remove chip from payout area with stack management
     */
    removeChipFromPayout(chip, chipElement, chipStack) {
        if (chip.deselect()) {
            // Animate out
            chipElement.style.transition = 'all 0.3s ease';
            chipElement.style.opacity = '0';
            chipElement.style.transform = 'scale(0.8) translateY(-20px)';
            
            setTimeout(() => {
                if (chipElement.parentNode) {
                    chipElement.parentNode.removeChild(chipElement);
                    
                    // Update stack count
                    const currentCount = parseInt(chipStack.dataset.count) - 1;
                    chipStack.dataset.count = currentCount.toString();
                    
                    // Remove stack if empty
                    if (currentCount === 0) {
                        chipStack.remove();
                    } else {
                        // Update stack count indicator
                        this.updateStackCountIndicator(chipStack, chip);
                        // Reposition remaining chips in stack
                        this.repositionChipsInStack(chipStack);
                    }
                }
            }, 300);

            // Update visuals and state
            this.updateChipVisuals(chip);
            
            if (this.gameState) {
                this.gameState.updateSelectedChips(this.getSelectedChips());
                this.gameState.updatePayoutTotal(this.getTotalValue());
            }

            // Play removal sound
            this.playChipRemoveSound();
        }
    }

    /**
     * Update stack count indicator
     */
    updateStackCountIndicator(chipStack, chip) {
        const count = parseInt(chipStack.dataset.count);
        
        // Remove existing indicator
        const existingIndicator = chipStack.querySelector('.stack-count');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        // Add new indicator if more than 1 chip
        if (count > 1) {
            const indicator = document.createElement('div');
            indicator.className = 'stack-count';
            indicator.textContent = count;
            indicator.title = `${count} × ${chip.label} = $${(count * chip.value).toFixed(2)}`;
            chipStack.appendChild(indicator);
        }
    }

    /**
     * Reposition chips in a stack after removal
     */
    repositionChipsInStack(chipStack) {
        const chips = chipStack.querySelectorAll('.payout-chip');
        chips.forEach((chipElement, index) => {
            const stackOffset = index * 3;
            chipElement.style.zIndex = index + 1;
            chipElement.style.marginTop = index > 0 ? `-${77 - stackOffset}px` : '0';
            chipElement.style.marginLeft = index > 0 ? `${stackOffset}px` : '0';
        });
    }

    /**
     * Update chip visual state
     */
    updateChipVisuals(chip) {
        const chipElement = this.chipElements.get(chip.id);
        if (!chipElement) return;

        // Update tooltip
        chipElement.title = `Select ${chip.label} chip (${chip.count - chip.selected} available)`;
        
        // Update visual state based on availability
        if (!chip.canSelect()) {
            chipElement.classList.add('chip-unavailable');
        } else {
            chipElement.classList.remove('chip-unavailable');
        }

        // Show selection count if any selected
        if (chip.selected > 0) {
            chipElement.classList.add('chip-has-selection');
            chipElement.dataset.selectedCount = chip.selected;
        } else {
            chipElement.classList.remove('chip-has-selection');
            delete chipElement.dataset.selectedCount;
        }
    }

    /**
     * Show hover feedback
     */
    showChipHover(chipElement, chip) {
        chipElement.style.transform = 'translateY(-3px) scale(1.05)';
        
        // Show denomination info
        const info = document.createElement('div');
        info.className = 'chip-hover-info';
        info.innerHTML = `${chip.label}<br>Available: ${chip.count - chip.selected}`;
        info.style.position = 'absolute';
        info.style.bottom = '100%';
        info.style.left = '50%';
        info.style.transform = 'translateX(-50%)';
        info.style.background = 'rgba(0,0,0,0.8)';
        info.style.color = 'white';
        info.style.padding = '5px 10px';
        info.style.borderRadius = '5px';
        info.style.fontSize = '0.8rem';
        info.style.whiteSpace = 'nowrap';
        info.style.zIndex = '1000';
        
        chipElement.style.position = 'relative';
        chipElement.appendChild(info);
    }

    /**
     * Hide hover feedback
     */
    hideChipHover(chipElement) {
        chipElement.style.transform = '';
        
        const hoverInfo = chipElement.querySelector('.chip-hover-info');
        if (hoverInfo) {
            hoverInfo.remove();
        }
    }

    /**
     * Get all selected chips
     */
    getSelectedChips() {
        return this.chips.filter(chip => chip.selected > 0);
    }

    /**
     * Get total value of selected chips
     */
    getTotalValue() {
        return this.chips.reduce((total, chip) => total + chip.getSelectedValue(), 0);
    }

    /**
     * Clear all selections with animation
     */
    clearAllSelections() {
        // Animate out all payout chips
        const payoutChips = this.payoutAreaElement ? 
            this.payoutAreaElement.querySelectorAll('.payout-chip') : [];
        
        payoutChips.forEach((chipElement, index) => {
            setTimeout(() => {
                chipElement.style.transition = 'all 0.3s ease';
                chipElement.style.opacity = '0';
                chipElement.style.transform = 'scale(0.8) translateY(-20px)';
            }, index * 50); // Stagger the animations
        });

        // Clear chip selections and update visuals
        setTimeout(() => {
            this.chips.forEach(chip => {
                chip.resetSelection();
                this.updateChipVisuals(chip);
            });

            // Clear payout area
            if (this.payoutAreaElement) {
                this.payoutAreaElement.innerHTML = '';
            }

            // Update game state
            if (this.gameState) {
                this.gameState.updateSelectedChips([]);
                this.gameState.updatePayoutTotal(0);
            }
        }, payoutChips.length * 50 + 300);
    }

    /**
     * Get total count of selected chips
     */
    getTotalChipCount() {
        return this.chips.reduce((total, chip) => total + chip.selected, 0);
    }

    /**
     * Get selected chips breakdown
     */
    getSelectedChipsBreakdown() {
        return this.chips
            .filter(chip => chip.selected > 0)
            .map(chip => ({
                denomination: chip.label,
                count: chip.selected,
                value: chip.value,
                totalValue: chip.getSelectedValue()
            }));
    }

    /**
     * Play chip selection sound (placeholder)
     */
    playChipSound() {
        // Placeholder for sound effect
        console.log('Chip selection sound');
    }

    /**
     * Play chip stacking sound (placeholder)
     */
    playChipStackSound() {
        // Placeholder for sound effect
        console.log('Chip stack sound');
    }

    /**
     * Play chip removal sound (placeholder)
     */
    playChipRemoveSound() {
        // Placeholder for sound effect
        console.log('Chip remove sound');
    }

    /**
     * Show feedback message
     */
    showFeedback(message, type) {
        // This will be enhanced when feedback system is implemented
        console.log(`${type.toUpperCase()}: ${message}`);
    }

    /**
     * Get chip by value
     */
    getChipByValue(value) {
        return this.chips.find(chip => chip.value === value);
    }

    /**
     * Focus next chip for keyboard navigation
     */
    focusNextChip(currentIndex) {
        const nextIndex = (currentIndex + 1) % this.chips.length;
        const nextChip = this.chips[nextIndex];
        const nextElement = this.chipElements.get(nextChip.id);
        if (nextElement) {
            nextElement.focus();
        }
    }

    /**
     * Focus previous chip for keyboard navigation
     */
    focusPreviousChip(currentIndex) {
        const prevIndex = currentIndex === 0 ? this.chips.length - 1 : currentIndex - 1;
        const prevChip = this.chips[prevIndex];
        const prevElement = this.chipElements.get(prevChip.id);
        if (prevElement) {
            prevElement.focus();
        }
    }

    /**
     * Announce chip focus for screen readers
     */
    announceChipFocus(chip) {
        const announcement = `${chip.label} chip. ${chip.count - chip.selected} available. ${chip.selected} selected. Press Enter or Space to select.`;
        this.announceToScreenReader(announcement);
    }

    /**
     * Announce message to screen readers
     */
    announceToScreenReader(message) {
        // Create or update screen reader announcement element
        let announcer = document.getElementById('screen-reader-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'screen-reader-announcer';
            announcer.setAttribute('aria-live', 'assertive');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.style.position = 'absolute';
            announcer.style.left = '-10000px';
            announcer.style.width = '1px';
            announcer.style.height = '1px';
            announcer.style.overflow = 'hidden';
            document.body.appendChild(announcer);
        }
        
        // Clear and set new message
        announcer.textContent = '';
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
    }

    /**
     * Validate if current selection matches target amount
     */
    validateSelection(targetAmount) {
        const currentTotal = this.getTotalValue();
        return Math.abs(currentTotal - targetAmount) < 0.01; // Account for floating point precision
    }
}

/**
 * Card Class
 * Represents a playing card with suit and rank
 */
class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
        this.value = this.getCardValue();
        this.display = this.getDisplayString();
    }

    /**
     * Get the blackjack value of the card
     */
    getCardValue() {
        if (this.rank === 'A') return 11; // Ace high initially
        if (['K', 'Q', 'J'].includes(this.rank)) return 10;
        return parseInt(this.rank);
    }

    /**
     * Get display string for the card
     */
    getDisplayString() {
        const suitSymbols = {
            'hearts': '♥',
            'diamonds': '♦',
            'clubs': '♣',
            'spades': '♠'
        };
        return `${this.rank}${suitSymbols[this.suit]}`;
    }

    /**
     * Check if card is an Ace
     */
    isAce() {
        return this.rank === 'A';
    }
}

/**
 * Hand Class
 * Represents a blackjack hand with cards and value calculation
 */
class Hand {
    constructor() {
        this.cards = [];
        this.value = 0;
        this.softAces = 0;
        this.isBlackjack = false;
        this.isBust = false;
    }

    /**
     * Add a card to the hand
     */
    addCard(card) {
        this.cards.push(card);
        this.calculateValue();
    }

    /**
     * Calculate the hand value considering Aces
     */
    calculateValue() {
        this.value = 0;
        this.softAces = 0;

        // Add up all card values
        for (const card of this.cards) {
            this.value += card.value;
            if (card.isAce()) {
                this.softAces++;
            }
        }

        // Convert Aces from 11 to 1 if needed
        while (this.value > 21 && this.softAces > 0) {
            this.value -= 10;
            this.softAces--;
        }

        // Check for blackjack (21 with exactly 2 cards)
        this.isBlackjack = (this.value === 21 && this.cards.length === 2);
        
        // Check for bust
        this.isBust = (this.value > 21);
    }

    /**
     * Get the display value of the hand
     */
    getDisplayValue() {
        if (this.isBust) return `${this.value} (BUST)`;
        if (this.isBlackjack) return `${this.value} (BLACKJACK)`;
        return this.value.toString();
    }

    /**
     * Get cards display string
     */
    getCardsDisplay() {
        return this.cards.map(card => card.display).join(' ');
    }

    /**
     * Check if hand is soft (contains usable Ace)
     */
    isSoft() {
        return this.softAces > 0;
    }
}

/**
 * Blackjack Scenario Class
 * Represents a complete blackjack scenario for practice
 */
class BlackjackScenario {
    constructor(playerHand, dealerHand, betAmount) {
        this.playerHand = playerHand;
        this.dealerHand = dealerHand;
        this.betAmount = betAmount;
        this.result = this.determineResult();
        this.correctPayout = this.calculateCorrectPayout();
        this.payoutRatio = this.getPayoutRatio();
    }

    /**
     * Determine the result of the hand - ALWAYS BLACKJACK for training
     */
    determineResult() {
        // Force blackjack result for training purposes
        // Player always has blackjack and always gets 3:2 payout
        return 'blackjack';
    }

    /**
     * Calculate the correct payout amount - ALWAYS 3:2 for blackjack training
     */
    calculateCorrectPayout() {
        // Always calculate 3:2 payout for blackjack training
        return this.betAmount * 1.5; // 3:2 payout (1.5 times the bet)
    }

    /**
     * Get the payout ratio string
     */
    getPayoutRatio() {
        switch (this.result) {
            case 'blackjack':
                return '3:2';
            case 'win':
                return '1:1';
            case 'push':
                return 'Push';
            case 'lose':
                return 'Lose';
            default:
                return 'Unknown';
        }
    }

    /**
     * Get result display string
     */
    getResultDisplay() {
        switch (this.result) {
            case 'blackjack':
                return 'BLACKJACK!';
            case 'win':
                return 'WIN';
            case 'push':
                return 'PUSH';
            case 'lose':
                return 'LOSE';
            default:
                return 'UNKNOWN';
        }
    }
}

/**
 * Scenario Management Module
 * Generates and manages blackjack scenarios for practice
 */
class ScenarioManager {
    constructor() {
        this.scenarios = [];
        this.currentScenarioIndex = 0;
        this.deck = [];
        // More realistic bet amounts with some unusual ones
        this.betAmounts = [
            // Common amounts
            5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 75, 100, 125, 150, 200, 250, 300, 500,
            // Unusual amounts to challenge calculation skills
            7, 12, 17, 22, 27, 32, 37, 42, 47, 52, 67, 72, 87, 92, 107, 117, 137, 147, 167, 177
        ];
        this.initializeDeck();
    }

    /**
     * Initialize a standard 52-card deck
     */
    initializeDeck() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        this.deck = [];
        for (const suit of suits) {
            for (const rank of ranks) {
                this.deck.push(new Card(suit, rank));
            }
        }
    }

    /**
     * Shuffle the deck
     */
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    /**
     * Deal a card from the deck
     */
    dealCard() {
        if (this.deck.length < 10) {
            this.initializeDeck();
            this.shuffleDeck();
        }
        return this.deck.pop();
    }

    /**
     * Generate a new practice scenario - ALWAYS BLACKJACK
     */
    generateScenario() {
        this.shuffleDeck();
        
        // Create hands
        const playerHand = new Hand();
        const dealerHand = new Hand();
        
        // FORCE PLAYER BLACKJACK - Deal Ace and 10-value card
        const aceCards = this.deck.filter(card => card.rank === 'A');
        const tenCards = this.deck.filter(card => ['10', 'J', 'Q', 'K'].includes(card.rank));
        
        if (aceCards.length > 0 && tenCards.length > 0) {
            // Remove and add ace
            const aceIndex = this.deck.indexOf(aceCards[0]);
            const ace = this.deck.splice(aceIndex, 1)[0];
            playerHand.addCard(ace);
            
            // Remove and add ten-value card
            const tenIndex = this.deck.indexOf(tenCards[0]);
            const ten = this.deck.splice(tenIndex, 1)[0];
            playerHand.addCard(ten);
        } else {
            // Fallback - create new cards if deck is low
            playerHand.addCard(new Card('hearts', 'A'));
            playerHand.addCard(new Card('spades', 'K'));
        }
        
        // Deal dealer cards normally (non-blackjack)
        dealerHand.addCard(this.dealCard());
        let secondCard = this.dealCard();
        // Ensure dealer doesn't get blackjack
        while (dealerHand.cards[0].value === 11 && secondCard.value === 10) {
            secondCard = this.dealCard();
        }
        dealerHand.addCard(secondCard);
        
        // Simulate dealer play (hit until 17 or bust)
        while (dealerHand.value < 17 && !dealerHand.isBust) {
            dealerHand.addCard(this.dealCard());
        }
        
        // Random bet amount
        const betAmount = this.betAmounts[Math.floor(Math.random() * this.betAmounts.length)];
        
        // Create scenario
        const scenario = new BlackjackScenario(playerHand, dealerHand, betAmount);
        
        console.log('Generated BLACKJACK scenario:', {
            player: `${playerHand.getCardsDisplay()} = ${playerHand.getDisplayValue()}`,
            dealer: `${dealerHand.getCardsDisplay()} = ${dealerHand.getDisplayValue()}`,
            bet: `$${betAmount}`,
            result: scenario.getResultDisplay(),
            payout: `$${scenario.correctPayout.toFixed(2)}`
        });
        
        return scenario;
    }

    /**
     * Generate a scenario with specific result type
     */
    generateScenarioWithResult(resultType) {
        let scenario;
        let attempts = 0;
        const maxAttempts = 50;
        
        do {
            scenario = this.generateScenario();
            attempts++;
        } while (scenario.result !== resultType && attempts < maxAttempts);
        
        return scenario;
    }

    /**
     * Generate a balanced set of scenarios
     */
    generateBalancedScenarios(count = 10) {
        const scenarios = [];
        const resultTypes = ['blackjack', 'win', 'lose', 'push'];
        const scenariosPerType = Math.floor(count / resultTypes.length);
        
        for (const resultType of resultTypes) {
            for (let i = 0; i < scenariosPerType; i++) {
                scenarios.push(this.generateScenarioWithResult(resultType));
            }
        }
        
        // Fill remaining slots with random scenarios
        while (scenarios.length < count) {
            scenarios.push(this.generateScenario());
        }
        
        // Shuffle the scenarios
        for (let i = scenarios.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [scenarios[i], scenarios[j]] = [scenarios[j], scenarios[i]];
        }
        
        return scenarios;
    }

    /**
     * Run unit tests for scenario generation
     */
    runTests() {
        console.log('Running ScenarioManager tests...');
        
        // Test card creation
        const card = new Card('hearts', 'A');
        console.assert(card.value === 11, 'Ace should have value 11');
        console.assert(card.isAce(), 'Ace should be identified as ace');
        
        // Test hand calculation
        const hand = new Hand();
        hand.addCard(new Card('hearts', 'A'));
        hand.addCard(new Card('spades', 'K'));
        console.assert(hand.isBlackjack, 'A-K should be blackjack');
        console.assert(hand.value === 21, 'A-K should equal 21');
        
        // Test soft ace conversion
        const softHand = new Hand();
        softHand.addCard(new Card('hearts', 'A'));
        softHand.addCard(new Card('spades', '6'));
        softHand.addCard(new Card('clubs', '8'));
        console.assert(softHand.value === 15, 'A-6-8 should equal 15 (soft ace)');
        
        // Test scenario generation
        const scenario = this.generateScenario();
        console.assert(scenario instanceof BlackjackScenario, 'Should generate BlackjackScenario');
        console.assert(scenario.betAmount > 0, 'Bet amount should be positive');
        console.assert(['blackjack', 'win', 'lose', 'push'].includes(scenario.result), 'Result should be valid');
        
        console.log('All tests passed!');
    }
}

/**
 * Payout Calculator Module
 * Handles payout calculations and validation
 */
class PayoutCalculator {
    constructor() {
        this.payoutRules = {
            blackjack: 1.5,  // 3:2 payout - ALWAYS for blackjack training
            win: 1.0,        // 1:1 payout
            push: 0.0,       // Return original bet (no additional payout)
            lose: 0.0        // No payout
        };
        this.tolerance = 0.01; // Floating point tolerance
    }

    /**
     * Calculate correct payout for a scenario - ALWAYS 3:2 for blackjack training
     */
    calculatePayout(scenario) {
        if (!scenario) return 0;

        const betAmount = scenario.betAmount;
        const result = scenario.result;

        // Since we're always doing blackjack training, always use 3:2 payout
        if (result === 'blackjack') {
            return betAmount * 1.5; // 3:2 payout (ALWAYS for blackjack)
        }

        // Fallback for any other results (shouldn't happen in blackjack training mode)
        switch (result) {
            case 'win':
                return betAmount * this.payoutRules.win; // 1:1 payout
            case 'push':
                return 0; // Return original bet only (no additional payout)
            case 'lose':
                return 0; // House keeps the bet
            default:
                console.warn(`Unknown result type: ${result}`);
                return 0;
        }
    }

    /**
     * Validate if the selected payout amount is correct
     */
    validatePayout(scenario, selectedAmount) {
        if (!scenario) return { isCorrect: false, message: 'No scenario provided' };

        const correctPayout = this.calculatePayout(scenario);
        const isCorrect = Math.abs(selectedAmount - correctPayout) < this.tolerance;

        return {
            isCorrect,
            correctAmount: correctPayout,
            selectedAmount,
            difference: selectedAmount - correctPayout,
            message: this.getValidationMessage(scenario, selectedAmount, correctPayout, isCorrect)
        };
    }

    /**
     * Get detailed validation message
     */
    getValidationMessage(scenario, selectedAmount, correctAmount, isCorrect) {
        const betAmount = scenario.betAmount;
        const result = scenario.result;

        if (isCorrect) {
            return this.getSuccessMessage(result, betAmount, correctAmount);
        } else {
            return this.getErrorMessage(result, betAmount, selectedAmount, correctAmount);
        }
    }

    /**
     * Get success message for correct payout
     */
    getSuccessMessage(result, betAmount, correctAmount) {
        switch (result) {
            case 'blackjack':
                return `✅ Correct! Blackjack pays 3:2. $${betAmount} × 1.5 = $${correctAmount.toFixed(2)}`;
            case 'win':
                return `✅ Correct! Regular win pays 1:1. $${betAmount} × 1 = $${correctAmount.toFixed(2)}`;
            case 'push':
                return `✅ Correct! Push means no additional payout (return original bet only).`;
            case 'lose':
                return `✅ Correct! House wins - no payout needed.`;
            default:
                return `✅ Correct payout!`;
        }
    }

    /**
     * Get error message for incorrect payout
     */
    getErrorMessage(result, betAmount, selectedAmount, correctAmount) {
        const difference = selectedAmount - correctAmount;
        const overUnder = difference > 0 ? 'over' : 'under';
        
        let explanation = '';
        switch (result) {
            case 'blackjack':
                explanation = `Blackjack pays 3:2. Calculate: $${betAmount} × 1.5 = $${correctAmount.toFixed(2)}`;
                break;
            case 'win':
                explanation = `Regular win pays 1:1. Calculate: $${betAmount} × 1 = $${correctAmount.toFixed(2)}`;
                break;
            case 'push':
                explanation = `Push means no additional payout. Only return the original bet.`;
                break;
            case 'lose':
                explanation = `House wins - no payout is made.`;
                break;
        }

        return `❌ Incorrect. You selected $${selectedAmount.toFixed(2)} but the correct payout is $${correctAmount.toFixed(2)} (${overUnder} by $${Math.abs(difference).toFixed(2)}). ${explanation}`;
    }

    /**
     * Get payout breakdown for educational purposes
     */
    getPayoutBreakdown(scenario) {
        if (!scenario) return null;

        const betAmount = scenario.betAmount;
        const result = scenario.result;
        const payout = this.calculatePayout(scenario);

        return {
            betAmount,
            result,
            payoutMultiplier: this.payoutRules[result] || 0,
            payoutAmount: payout,
            totalReturn: result === 'push' ? betAmount : (result === 'lose' ? 0 : betAmount + payout),
            explanation: this.getPayoutExplanation(result, betAmount, payout)
        };
    }

    /**
     * Get detailed payout explanation
     */
    getPayoutExplanation(result, betAmount, payout) {
        switch (result) {
            case 'blackjack':
                return `Blackjack pays 3:2. Original bet: $${betAmount}. Payout: $${betAmount} × 1.5 = $${payout.toFixed(2)}. Total return: $${(betAmount + payout).toFixed(2)}`;
            case 'win':
                return `Regular win pays 1:1. Original bet: $${betAmount}. Payout: $${betAmount} × 1 = $${payout.toFixed(2)}. Total return: $${(betAmount + payout).toFixed(2)}`;
            case 'push':
                return `Push - tie game. Return original bet of $${betAmount}. No additional payout.`;
            case 'lose':
                return `House wins. Player loses original bet of $${betAmount}. No payout.`;
            default:
                return `Unknown result type: ${result}`;
        }
    }

    /**
     * Calculate optimal chip combination for a payout amount
     */
    calculateOptimalChips(payoutAmount, availableChips) {
        if (payoutAmount <= 0) return [];

        // Sort chips by value (descending)
        const sortedChips = [...availableChips].sort((a, b) => b.value - a.value);
        const result = [];
        let remaining = payoutAmount;

        for (const chip of sortedChips) {
            const count = Math.floor(remaining / chip.value);
            if (count > 0) {
                result.push({ chip, count });
                remaining = Math.round((remaining - (count * chip.value)) * 100) / 100; // Handle floating point
            }
        }

        return remaining < this.tolerance ? result : null; // Return null if exact change not possible
    }

    /**
     * Convert bet amount to chip representation for display - Casino style
     */
    calculateBetChips(betAmount) {
        // Standard chip denominations for bet display (casino order: largest to smallest)
        const chipDenominations = [
            { value: 1000, color: 'chip-1000', label: '$1K' },
            { value: 500, color: 'chip-500', label: '$500' },
            { value: 100, color: 'chip-100', label: '$100' },
            { value: 25, color: 'chip-25', label: '$25' },
            { value: 5, color: 'chip-5', label: '$5' },
            { value: 2.50, color: 'chip-2-50', label: '$2.50' },
            { value: 1, color: 'chip-1', label: '$1' }
        ];

        const result = [];
        let remaining = betAmount;

        // Use casino-style chip distribution (prefer certain denominations)
        for (const chipType of chipDenominations) {
            let count = Math.floor(remaining / chipType.value);
            
            // Casino logic: prefer using standard denominations efficiently
            if (chipType.value === 25 && count > 0) {
                // Use 25s efficiently but not excessively
                count = Math.min(count, Math.floor(remaining / 25));
            } else if (chipType.value === 5 && count > 0) {
                // Use 5s for smaller amounts
                count = Math.min(count, Math.floor(remaining / 5));
            }
            
            if (count > 0) {
                result.push({ ...chipType, count });
                remaining = Math.round((remaining - (count * chipType.value)) * 100) / 100;
            }
        }

        return result;
    }

    /**
     * Run unit tests for payout calculations
     */
    runTests() {
        console.log('Running PayoutCalculator tests...');

        // Test blackjack payout
        const blackjackScenario = { betAmount: 10, result: 'blackjack' };
        const blackjackPayout = this.calculatePayout(blackjackScenario);
        console.assert(blackjackPayout === 15, `Blackjack payout should be 15, got ${blackjackPayout}`);

        // Test regular win payout
        const winScenario = { betAmount: 25, result: 'win' };
        const winPayout = this.calculatePayout(winScenario);
        console.assert(winPayout === 25, `Win payout should be 25, got ${winPayout}`);

        // Test push payout
        const pushScenario = { betAmount: 50, result: 'push' };
        const pushPayout = this.calculatePayout(pushScenario);
        console.assert(pushPayout === 0, `Push payout should be 0, got ${pushPayout}`);

        // Test lose payout
        const loseScenario = { betAmount: 100, result: 'lose' };
        const losePayout = this.calculatePayout(loseScenario);
        console.assert(losePayout === 0, `Lose payout should be 0, got ${losePayout}`);

        // Test validation
        const validation = this.validatePayout(blackjackScenario, 15);
        console.assert(validation.isCorrect, 'Validation should pass for correct amount');

        const wrongValidation = this.validatePayout(blackjackScenario, 10);
        console.assert(!wrongValidation.isCorrect, 'Validation should fail for incorrect amount');

        // Test optimal chips calculation
        const chips = [
            { value: 1 }, { value: 5 }, { value: 25 }, { value: 100 }
        ];
        const optimal = this.calculateOptimalChips(37, chips);
        console.assert(optimal && optimal.length === 3, 'Should find optimal chip combination');

        console.log('PayoutCalculator tests passed!');
    }
}

/**
 * UI Controller Module
 * Manages user interface interactions and updates
 */
class UIController {
    constructor() {
        this.elements = this.cacheElements();
    }

    /**
     * Cache frequently used DOM elements
     */
    cacheElements() {
        return {
            dealerCards: document.getElementById('dealer-cards'),
            playerCards: document.getElementById('player-cards'),
            betAmount: document.getElementById('bet-amount'),
            handResult: document.getElementById('hand-result'),
            payoutChips: document.getElementById('payout-chips'),
            payoutTotal: document.getElementById('payout-total'),
            feedbackContent: document.getElementById('feedback-content')
        };
    }

    /**
     * Update the payout total display
     */
    updatePayoutTotal(total) {
        if (this.elements.payoutTotal) {
            this.elements.payoutTotal.textContent = `$${total.toFixed(2)}`;
        }
    }
}

/**
 * Feedback System Module
 * Provides user feedback and educational content
 */
class FeedbackSystem {
    constructor() {
        this.feedbackElement = document.getElementById('feedback-content');
        this.currentFeedbackType = null;
        this.feedbackHistory = [];
        this.educationalTips = [
            "💡 Tip: Blackjack always pays 3:2 (1.5 times your bet)",
            "💡 Tip: Regular wins pay 1:1 (equal to your bet)",
            "💡 Tip: A push means return the original bet only",
            "💡 Tip: Use larger denomination chips first for efficiency",
            "💡 Tip: Practice mental math: $15 bet × 1.5 = $22.50",
            "💡 Tip: Always double-check your chip count before submitting"
        ];
        this.tipIndex = 0;
    }

    /**
     * Display feedback message with enhanced formatting
     */
    showFeedback(message, type = 'info', options = {}) {
        if (!this.feedbackElement) return;

        const { 
            autoHide = false, 
            duration = 5000, 
            showIcon = true,
            animate = true 
        } = options;

        // Store feedback in history
        this.feedbackHistory.push({
            message,
            type,
            timestamp: Date.now()
        });

        // Keep only last 10 feedback messages
        if (this.feedbackHistory.length > 10) {
            this.feedbackHistory.shift();
        }

        const feedbackClass = `feedback-${type}`;
        const icon = this.getFeedbackIcon(type);
        
        const feedbackContent = `
            <div class="${feedbackClass} ${animate ? 'feedback-animate' : ''}" id="current-feedback">
                ${showIcon ? `<div class="feedback-icon">${icon}</div>` : ''}
                <div class="feedback-message">${message}</div>
                ${type === 'error' ? '<div class="feedback-retry">Try again or click "Clear" to reset your selection.</div>' : ''}
            </div>
        `;

        this.feedbackElement.innerHTML = feedbackContent;
        this.currentFeedbackType = type;

        // Add animation class
        if (animate) {
            const feedbackDiv = document.getElementById('current-feedback');
            if (feedbackDiv) {
                feedbackDiv.style.opacity = '0';
                feedbackDiv.style.transform = 'translateY(20px)';
                
                requestAnimationFrame(() => {
                    feedbackDiv.style.transition = 'all 0.4s ease';
                    feedbackDiv.style.opacity = '1';
                    feedbackDiv.style.transform = 'translateY(0)';
                });
            }
        }

        // Auto-hide if requested
        if (autoHide) {
            setTimeout(() => this.clearFeedback(), duration);
        }

        // Show educational tip for errors
        if (type === 'error') {
            setTimeout(() => this.showEducationalTip(), 3000);
        }
    }

    /**
     * Get appropriate icon for feedback type
     */
    getFeedbackIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️',
            tip: '💡'
        };
        return icons[type] || 'ℹ️';
    }

    /**
     * Show educational tip
     */
    showEducationalTip() {
        if (this.currentFeedbackType === 'error') {
            const tip = this.educationalTips[this.tipIndex];
            this.tipIndex = (this.tipIndex + 1) % this.educationalTips.length;
            
            const tipElement = document.createElement('div');
            tipElement.className = 'educational-tip';
            tipElement.innerHTML = `
                <div class="tip-content">
                    ${tip}
                </div>
            `;
            
            if (this.feedbackElement) {
                this.feedbackElement.appendChild(tipElement);
                
                // Animate in
                tipElement.style.opacity = '0';
                tipElement.style.transform = 'translateY(10px)';
                
                requestAnimationFrame(() => {
                    tipElement.style.transition = 'all 0.3s ease';
                    tipElement.style.opacity = '1';
                    tipElement.style.transform = 'translateY(0)';
                });
            }
        }
    }

    /**
     * Show validation result with detailed explanation
     */
    showValidationResult(validation, scenario) {
        const { isCorrect, correctAmount, selectedAmount, message } = validation;
        
        if (isCorrect) {
            this.showFeedback(`
                <h4>🎉 Correct!</h4>
                <p>${message}</p>
                <div class="validation-details">
                    <p><strong>Your Selection:</strong> $${selectedAmount.toFixed(2)}</p>
                    <p><strong>Correct Amount:</strong> $${correctAmount.toFixed(2)}</p>
                </div>
            `, 'success');
        } else {
            this.showFeedback(`
                <h4>Try Again</h4>
                <p>${message}</p>
                <div class="validation-details">
                    <p><strong>Your Selection:</strong> $${selectedAmount.toFixed(2)}</p>
                    <p><strong>Correct Amount:</strong> $${correctAmount.toFixed(2)}</p>
                    <p><strong>Difference:</strong> $${Math.abs(selectedAmount - correctAmount).toFixed(2)}</p>
                </div>
            `, 'error');
        }
    }

    /**
     * Show payout explanation
     */
    showPayoutExplanation(scenario, breakdown) {
        const explanationContent = `
            <h4>📚 Payout Explanation</h4>
            <div class="payout-explanation">
                <p><strong>Scenario:</strong> ${scenario.getResultDisplay()}</p>
                <p><strong>Original Bet:</strong> $${scenario.betAmount}</p>
                <p><strong>Payout Rule:</strong> ${scenario.payoutRatio}</p>
                <p><strong>Calculation:</strong> ${breakdown.explanation}</p>
                <div class="calculation-steps">
                    ${this.getCalculationSteps(scenario)}
                </div>
            </div>
        `;
        
        this.showFeedback(explanationContent, 'info');
    }

    /**
     * Get step-by-step calculation
     */
    getCalculationSteps(scenario) {
        const steps = [];
        
        switch (scenario.result) {
            case 'blackjack':
                steps.push(`Step 1: Identify blackjack (21 with 2 cards)`);
                steps.push(`Step 2: Apply 3:2 payout rule`);
                steps.push(`Step 3: $${scenario.betAmount} × 1.5 = $${scenario.correctPayout.toFixed(2)}`);
                break;
            case 'win':
                steps.push(`Step 1: Player wins with ${scenario.playerHand.value}`);
                steps.push(`Step 2: Apply 1:1 payout rule`);
                steps.push(`Step 3: $${scenario.betAmount} × 1 = $${scenario.correctPayout.toFixed(2)}`);
                break;
            case 'push':
                steps.push(`Step 1: Tie game (both have ${scenario.playerHand.value})`);
                steps.push(`Step 2: Return original bet only`);
                steps.push(`Step 3: No additional payout needed`);
                break;
            case 'lose':
                steps.push(`Step 1: House wins`);
                steps.push(`Step 2: Player loses bet`);
                steps.push(`Step 3: No payout made`);
                break;
        }
        
        return steps.map((step, index) => 
            `<div class="calculation-step">${step}</div>`
        ).join('');
    }

    /**
     * Show progress update
     */
    showProgressUpdate(gameState) {
        const stats = gameState.getSessionStats();
        const performance = gameState.getPerformanceRating();
        
        const progressContent = `
            <h4>📊 Your Progress</h4>
            <div class="progress-stats">
                <div class="stat-item">
                    <span class="stat-label">Accuracy:</span>
                    <span class="stat-value" style="color: ${performance.color}">${gameState.getAccuracy()}%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Current Streak:</span>
                    <span class="stat-value">${stats.currentStreak}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Best Streak:</span>
                    <span class="stat-value">${stats.bestStreak}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Scenarios Completed:</span>
                    <span class="stat-value">${stats.scenariosCompleted}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Performance:</span>
                    <span class="stat-value" style="color: ${performance.color}">${performance.rating}</span>
                </div>
            </div>
        `;
        
        this.showFeedback(progressContent, 'info');
    }

    /**
     * Show welcome message with instructions
     */
    showWelcomeMessage() {
        const welcomeContent = `
            <h3>🃏 Blackjack Payout Trainer - Speed Mode!</h3>
            <div class="welcome-instructions">
                <p>Practice calculating blackjack payouts quickly and accurately:</p>
                <ul>
                    <li><strong>Every hand is BLACKJACK</strong> - Always pays 3:2 (1.5× the bet)</li>
                    <li><strong>Look at the bet chips</strong> - Calculate the payout from the chip stacks</li>
                    <li><strong>Work fast</strong> - Build your payout quickly with the chip tray</li>
                    <li><strong>Get accurate</strong> - Master those 3:2 calculations!</li>
                </ul>
                <p><strong>Quick tip:</strong> For any bet amount, multiply by 1.5 for the payout!</p>
            </div>
        `;
        
        this.showFeedback(welcomeContent, 'info');
    }

    /**
     * Clear feedback display with animation
     */
    clearFeedback(animate = true) {
        if (!this.feedbackElement) return;

        if (animate) {
            const currentFeedback = this.feedbackElement.querySelector('#current-feedback');
            if (currentFeedback) {
                currentFeedback.style.transition = 'all 0.3s ease';
                currentFeedback.style.opacity = '0';
                currentFeedback.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    this.feedbackElement.innerHTML = '';
                    this.currentFeedbackType = null;
                }, 300);
            }
        } else {
            this.feedbackElement.innerHTML = '';
            this.currentFeedbackType = null;
        }
    }

    /**
     * Get feedback history
     */
    getFeedbackHistory() {
        return this.feedbackHistory;
    }

    /**
     * Show feedback history
     */
    showFeedbackHistory() {
        if (this.feedbackHistory.length === 0) {
            this.showFeedback('No feedback history available.', 'info');
            return;
        }

        const historyContent = `
            <h4>📝 Recent Feedback</h4>
            <div class="feedback-history">
                ${this.feedbackHistory.slice(-5).map((item, index) => `
                    <div class="history-item feedback-${item.type}">
                        <div class="history-message">${item.message}</div>
                        <div class="history-time">${new Date(item.timestamp).toLocaleTimeString()}</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        this.showFeedback(historyContent, 'info');
    }
}

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // Try to show error in feedback area
    const feedbackElement = document.getElementById('feedback-content');
    if (feedbackElement && window.blackjackTrainer) {
        window.blackjackTrainer.feedbackSystem.showFeedback(`
            <h4>⚠️ Unexpected Error</h4>
            <p>An unexpected error occurred: ${event.error.message}</p>
            <p>The application will continue to function, but some features may not work correctly.</p>
            <button onclick="location.reload()" class="clear-btn">Refresh Page</button>
        `, 'warning');
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault(); // Prevent default browser behavior
});

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting Blackjack Payout Trainer...');
    
    try {
        // Check for required browser features
        if (!window.localStorage) {
            console.warn('localStorage not available - progress will not be saved');
        }
        
        if (!window.performance) {
            console.warn('Performance API not available - performance metrics disabled');
        }
        
        // Create the main application instance
        window.blackjackTrainer = new BlackjackPayoutTrainer();
        
        console.log('Application initialized successfully!');
        
        // Add visibility change handler for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page is hidden, pause any animations or timers
                console.log('Page hidden - pausing non-essential operations');
            } else {
                // Page is visible again
                console.log('Page visible - resuming operations');
            }
        });
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        
        // Fallback error display
        const feedbackElement = document.getElementById('feedback-content');
        if (feedbackElement) {
            feedbackElement.innerHTML = `
                <div class="feedback-error">
                    <h4>❌ Initialization Failed</h4>
                    <p>The application failed to start: ${error.message}</p>
                    <p>Please refresh the page and try again.</p>
                    <button onclick="location.reload()" class="submit-btn">Refresh Page</button>
                </div>
            `;
        }
    }
});

// Export classes for potential future module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BlackjackPayoutTrainer,
        GameState,
        ChipManager,
        ScenarioManager,
        PayoutCalculator,
        UIController,
        FeedbackSystem
    };
}