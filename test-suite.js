/**
 * Comprehensive Testing Suite for Blackjack Payout Trainer
 * Tests all components and user workflows
 */

class TestSuite {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
        this.startTime = null;
        this.endTime = null;
    }

    /**
     * Add a test to the suite
     */
    addTest(name, testFunction, category = 'general') {
        this.tests.push({
            name,
            testFunction,
            category,
            status: 'pending'
        });
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🧪 Starting Comprehensive Test Suite...');
        this.startTime = Date.now();
        this.results = { passed: 0, failed: 0, total: 0 };

        // Group tests by category
        const categories = [...new Set(this.tests.map(test => test.category))];
        
        for (const category of categories) {
            console.log(`\n📂 Testing ${category.toUpperCase()} components...`);
            const categoryTests = this.tests.filter(test => test.category === category);
            
            for (const test of categoryTests) {
                await this.runTest(test);
            }
        }

        this.endTime = Date.now();
        this.printSummary();
        return this.results;
    }

    /**
     * Run a single test
     */
    async runTest(test) {
        this.results.total++;
        
        try {
            console.log(`  ⏳ ${test.name}...`);
            await test.testFunction();
            test.status = 'passed';
            this.results.passed++;
            console.log(`  ✅ ${test.name} - PASSED`);
        } catch (error) {
            test.status = 'failed';
            test.error = error;
            this.results.failed++;
            console.error(`  ❌ ${test.name} - FAILED:`, error.message);
        }
    }

    /**
     * Print test summary
     */
    printSummary() {
        const duration = this.endTime - this.startTime;
        const successRate = Math.round((this.results.passed / this.results.total) * 100);
        
        console.log('\n' + '='.repeat(50));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(50));
        console.log(`Total Tests: ${this.results.total}`);
        console.log(`Passed: ${this.results.passed} ✅`);
        console.log(`Failed: ${this.results.failed} ❌`);
        console.log(`Success Rate: ${successRate}%`);
        console.log(`Duration: ${duration}ms`);
        console.log('='.repeat(50));

        if (this.results.failed > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.tests.filter(test => test.status === 'failed').forEach(test => {
                console.log(`  - ${test.name}: ${test.error.message}`);
            });
        }
    }

    /**
     * Assert helper function
     */
    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    /**
     * Assert equal helper function
     */
    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    }

    /**
     * Assert approximately equal (for floating point numbers)
     */
    assertApproxEqual(actual, expected, tolerance = 0.01, message) {
        if (Math.abs(actual - expected) > tolerance) {
            throw new Error(message || `Expected ${expected} ± ${tolerance}, got ${actual}`);
        }
    }

    /**
     * Assert throws helper function
     */
    assertThrows(fn, message) {
        let threw = false;
        try {
            fn();
        } catch (error) {
            threw = true;
        }
        if (!threw) {
            throw new Error(message || 'Expected function to throw an error');
        }
    }
}

/**
 * Initialize and run all tests
 */
function initializeTestSuite() {
    const testSuite = new TestSuite();

    // ===== CARD AND HAND TESTS =====
    testSuite.addTest('Card creation and values', () => {
        const aceHearts = new Card('hearts', 'A');
        testSuite.assertEqual(aceHearts.value, 11, 'Ace should have value 11');
        testSuite.assert(aceHearts.isAce(), 'Ace should be identified as ace');
        testSuite.assertEqual(aceHearts.display, 'A♥', 'Ace of hearts display should be A♥');

        const kingSpades = new Card('spades', 'K');
        testSuite.assertEqual(kingSpades.value, 10, 'King should have value 10');
        testSuite.assert(!kingSpades.isAce(), 'King should not be identified as ace');

        const fiveClubs = new Card('clubs', '5');
        testSuite.assertEqual(fiveClubs.value, 5, 'Five should have value 5');
    }, 'card-system');

    testSuite.addTest('Hand value calculation', () => {
        const hand = new Hand();
        hand.addCard(new Card('hearts', 'A'));
        hand.addCard(new Card('spades', 'K'));
        
        testSuite.assertEqual(hand.value, 21, 'A-K should equal 21');
        testSuite.assert(hand.isBlackjack, 'A-K should be blackjack');
        testSuite.assert(!hand.isBust, 'A-K should not be bust');
    }, 'card-system');

    testSuite.addTest('Soft ace conversion', () => {
        const hand = new Hand();
        hand.addCard(new Card('hearts', 'A'));
        hand.addCard(new Card('spades', '6'));
        hand.addCard(new Card('clubs', '8'));
        
        testSuite.assertEqual(hand.value, 15, 'A-6-8 should equal 15 (soft ace)');
        testSuite.assert(!hand.isBust, 'A-6-8 should not be bust');
        testSuite.assertEqual(hand.softAces, 1, 'Should have 1 soft ace');
    }, 'card-system');

    testSuite.addTest('Hand bust detection', () => {
        const hand = new Hand();
        hand.addCard(new Card('hearts', 'K'));
        hand.addCard(new Card('spades', 'Q'));
        hand.addCard(new Card('clubs', '5'));
        
        testSuite.assertEqual(hand.value, 25, 'K-Q-5 should equal 25');
        testSuite.assert(hand.isBust, 'K-Q-5 should be bust');
    }, 'card-system');

    // ===== CHIP SYSTEM TESTS =====
    testSuite.addTest('Chip creation and properties', () => {
        const chip = new Chip(25, 'chip-25', '$25');
        testSuite.assertEqual(chip.value, 25, 'Chip value should be 25');
        testSuite.assertEqual(chip.count, 50, 'Chip count should be 50');
        testSuite.assertEqual(chip.selected, 0, 'Initially no chips selected');
        testSuite.assert(chip.canSelect(), 'Should be able to select chip');
    }, 'chip-system');

    testSuite.addTest('Chip selection and deselection', () => {
        const chip = new Chip(5, 'chip-5', '$5');
        
        testSuite.assert(chip.select(), 'Should be able to select chip');
        testSuite.assertEqual(chip.selected, 1, 'Should have 1 selected');
        testSuite.assertEqual(chip.getSelectedValue(), 5, 'Selected value should be 5');
        
        testSuite.assert(chip.deselect(), 'Should be able to deselect chip');
        testSuite.assertEqual(chip.selected, 0, 'Should have 0 selected');
        testSuite.assertEqual(chip.getSelectedValue(), 0, 'Selected value should be 0');
    }, 'chip-system');

    testSuite.addTest('Chip selection limits', () => {
        const chip = new Chip(1, 'chip-1', '$1');
        
        // Select all available chips
        for (let i = 0; i < 50; i++) {
            chip.select();
        }
        
        testSuite.assertEqual(chip.selected, 50, 'Should have 50 selected');
        testSuite.assert(!chip.canSelect(), 'Should not be able to select more');
        testSuite.assert(!chip.select(), 'Select should return false when at limit');
    }, 'chip-system');

    // ===== SCENARIO GENERATION TESTS =====
    testSuite.addTest('Scenario generation', () => {
        const scenarioManager = new ScenarioManager();
        const scenario = scenarioManager.generateScenario();
        
        testSuite.assert(scenario instanceof BlackjackScenario, 'Should generate BlackjackScenario');
        testSuite.assert(scenario.betAmount > 0, 'Bet amount should be positive');
        testSuite.assert(['blackjack', 'win', 'lose', 'push'].includes(scenario.result), 'Result should be valid');
        testSuite.assert(scenario.correctPayout >= 0, 'Payout should be non-negative');
    }, 'scenario-system');

    testSuite.addTest('Scenario result determination', () => {
        const playerHand = new Hand();
        playerHand.addCard(new Card('hearts', 'A'));
        playerHand.addCard(new Card('spades', 'K'));
        
        const dealerHand = new Hand();
        dealerHand.addCard(new Card('clubs', '10'));
        dealerHand.addCard(new Card('diamonds', '9'));
        
        const scenario = new BlackjackScenario(playerHand, dealerHand, 10);
        testSuite.assertEqual(scenario.result, 'blackjack', 'Player blackjack vs dealer 19 should be blackjack');
        testSuite.assertEqual(scenario.correctPayout, 15, 'Blackjack payout should be 15 for $10 bet');
    }, 'scenario-system');

    testSuite.addTest('Balanced scenario generation', () => {
        const scenarioManager = new ScenarioManager();
        const scenarios = scenarioManager.generateBalancedScenarios(20);
        
        testSuite.assertEqual(scenarios.length, 20, 'Should generate 20 scenarios');
        
        const resultCounts = {};
        scenarios.forEach(scenario => {
            resultCounts[scenario.result] = (resultCounts[scenario.result] || 0) + 1;
        });
        
        testSuite.assert(Object.keys(resultCounts).length >= 3, 'Should have at least 3 different result types');
    }, 'scenario-system');

    // ===== PAYOUT CALCULATION TESTS =====
    testSuite.addTest('Blackjack payout calculation', () => {
        const calculator = new PayoutCalculator();
        const scenario = { betAmount: 20, result: 'blackjack' };
        
        const payout = calculator.calculatePayout(scenario);
        testSuite.assertEqual(payout, 30, 'Blackjack payout should be 30 for $20 bet');
    }, 'payout-system');

    testSuite.addTest('Regular win payout calculation', () => {
        const calculator = new PayoutCalculator();
        const scenario = { betAmount: 15, result: 'win' };
        
        const payout = calculator.calculatePayout(scenario);
        testSuite.assertEqual(payout, 15, 'Win payout should be 15 for $15 bet');
    }, 'payout-system');

    testSuite.addTest('Push payout calculation', () => {
        const calculator = new PayoutCalculator();
        const scenario = { betAmount: 25, result: 'push' };
        
        const payout = calculator.calculatePayout(scenario);
        testSuite.assertEqual(payout, 0, 'Push payout should be 0');
    }, 'payout-system');

    testSuite.addTest('Lose payout calculation', () => {
        const calculator = new PayoutCalculator();
        const scenario = { betAmount: 50, result: 'lose' };
        
        const payout = calculator.calculatePayout(scenario);
        testSuite.assertEqual(payout, 0, 'Lose payout should be 0');
    }, 'payout-system');

    testSuite.addTest('Payout validation', () => {
        const calculator = new PayoutCalculator();
        const scenario = { betAmount: 10, result: 'blackjack' };
        
        const correctValidation = calculator.validatePayout(scenario, 15);
        testSuite.assert(correctValidation.isCorrect, 'Should validate correct blackjack payout');
        
        const incorrectValidation = calculator.validatePayout(scenario, 10);
        testSuite.assert(!incorrectValidation.isCorrect, 'Should reject incorrect payout');
        testSuite.assertEqual(incorrectValidation.difference, -5, 'Should calculate correct difference');
    }, 'payout-system');

    testSuite.addTest('Optimal chip calculation', () => {
        const calculator = new PayoutCalculator();
        const chips = [
            { value: 1 }, { value: 5 }, { value: 25 }, { value: 100 }
        ];
        
        const optimal = calculator.calculateOptimalChips(37, chips);
        testSuite.assert(optimal !== null, 'Should find optimal combination for 37');
        
        const totalValue = optimal.reduce((sum, item) => sum + (item.chip.value * item.count), 0);
        testSuite.assertEqual(totalValue, 37, 'Optimal combination should equal target amount');
    }, 'payout-system');

    // ===== GAME STATE TESTS =====
    testSuite.addTest('Game state initialization', () => {
        const gameState = new GameState();
        testSuite.assertEqual(gameState.score.correct, 0, 'Initial correct score should be 0');
        testSuite.assertEqual(gameState.score.total, 0, 'Initial total score should be 0');
        testSuite.assertEqual(gameState.getAccuracy(), 0, 'Initial accuracy should be 0');
        testSuite.assert(!gameState.gameActive, 'Game should not be active initially');
    }, 'game-state');

    testSuite.addTest('Score tracking', () => {
        const gameState = new GameState();
        
        gameState.recordCorrect();
        testSuite.assertEqual(gameState.score.correct, 1, 'Should increment correct score');
        testSuite.assertEqual(gameState.score.total, 1, 'Should increment total score');
        testSuite.assertEqual(gameState.getAccuracy(), 100, 'Accuracy should be 100%');
        
        gameState.recordIncorrect();
        testSuite.assertEqual(gameState.score.correct, 1, 'Correct score should remain 1');
        testSuite.assertEqual(gameState.score.total, 2, 'Total score should be 2');
        testSuite.assertEqual(gameState.getAccuracy(), 50, 'Accuracy should be 50%');
    }, 'game-state');

    testSuite.addTest('Performance rating', () => {
        const gameState = new GameState();
        
        // Test excellent rating
        gameState.score.correct = 95;
        gameState.score.total = 100;
        let rating = gameState.getPerformanceRating();
        testSuite.assertEqual(rating.rating, 'Excellent', 'Should get excellent rating for 95%');
        
        // Test needs practice rating
        gameState.score.correct = 5;
        gameState.score.total = 10;
        rating = gameState.getPerformanceRating();
        testSuite.assertEqual(rating.rating, 'Needs Practice', 'Should get needs practice rating for 50%');
    }, 'game-state');

    // ===== INTEGRATION TESTS =====
    testSuite.addTest('Complete workflow simulation', async () => {
        // Simulate a complete user workflow
        const gameState = new GameState();
        const chipManager = new ChipManager(gameState);
        const scenarioManager = new ScenarioManager();
        const payoutCalculator = new PayoutCalculator();
        
        // Generate scenario
        const scenario = scenarioManager.generateScenario();
        gameState.setCurrentScenario(scenario);
        
        // Calculate correct payout
        const correctPayout = payoutCalculator.calculatePayout(scenario);
        
        // Simulate chip selection to match correct payout
        const chips = chipManager.chips;
        const optimalChips = payoutCalculator.calculateOptimalChips(correctPayout, chips);
        
        if (optimalChips) {
            // Select optimal chips
            for (const item of optimalChips) {
                for (let i = 0; i < item.count; i++) {
                    item.chip.select();
                }
            }
            
            const totalSelected = chipManager.getTotalValue();
            testSuite.assertApproxEqual(totalSelected, correctPayout, 0.01, 'Selected chips should match correct payout');
            
            // Validate payout
            const validation = payoutCalculator.validatePayout(scenario, totalSelected);
            testSuite.assert(validation.isCorrect, 'Validation should pass for correct selection');
        }
    }, 'integration');

    testSuite.addTest('Error handling', () => {
        const payoutCalculator = new PayoutCalculator();
        
        // Test null scenario
        const nullPayout = payoutCalculator.calculatePayout(null);
        testSuite.assertEqual(nullPayout, 0, 'Should handle null scenario gracefully');
        
        // Test invalid result type
        const invalidScenario = { betAmount: 10, result: 'invalid' };
        const invalidPayout = payoutCalculator.calculatePayout(invalidScenario);
        testSuite.assertEqual(invalidPayout, 0, 'Should handle invalid result type gracefully');
    }, 'integration');

    // ===== PERFORMANCE TESTS =====
    testSuite.addTest('Scenario generation performance', () => {
        const scenarioManager = new ScenarioManager();
        const startTime = Date.now();
        
        // Generate 100 scenarios
        for (let i = 0; i < 100; i++) {
            scenarioManager.generateScenario();
        }
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        testSuite.assert(duration < 1000, `Scenario generation should be fast (took ${duration}ms for 100 scenarios)`);
    }, 'performance');

    testSuite.addTest('Payout calculation performance', () => {
        const payoutCalculator = new PayoutCalculator();
        const scenario = { betAmount: 25, result: 'blackjack' };
        const startTime = Date.now();
        
        // Perform 1000 calculations
        for (let i = 0; i < 1000; i++) {
            payoutCalculator.calculatePayout(scenario);
        }
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        testSuite.assert(duration < 100, `Payout calculation should be fast (took ${duration}ms for 1000 calculations)`);
    }, 'performance');

    return testSuite;
}

// Export for use in main application
if (typeof window !== 'undefined') {
    window.TestSuite = TestSuite;
    window.initializeTestSuite = initializeTestSuite;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TestSuite, initializeTestSuite };
}