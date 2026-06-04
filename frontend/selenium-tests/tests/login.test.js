/**
 * Login E2E Test
 * Tests the login functionality
 *
 * Run with: npm run login
 */

const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');
const reportGenerator = require('../reportGenerator');

const BASE_URL = 'http://localhost:8189/interview_assist';

// Re-export reporter functions
const log = (message, level) => reportGenerator.log(message, level);
const addResult = (testName, passed, error) => reportGenerator.addResult(testName, passed, error);

describe('Login Test', function() {
  this.timeout(60000);

  let driver;

  before(async () => {
    reportGenerator.init();
    log('Initializing WebDriver...');
    driver = await new Builder()
      .forBrowser('chrome')
      .build();
    await driver.manage().window().maximize();
    log('WebDriver initialized');
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
    const report = await reportGenerator.generateAndPrint();
    if (report.failed > 0) {
      process.exit(1);
    }
  });

  it('should login successfully with existing account', async () => {
    try {
      log('Starting login test...');

      // Navigate to login page
      await driver.get(`${BASE_URL}/#/login`);
      log('Navigated to login page');

      // Wait for form to load
      await driver.wait(until.elementLocated(By.css('form')), 15000);
      log('Login form loaded');

      // Find email and password inputs - use CSS selector for form inputs
      const inputs = await driver.findElements(By.css('form input'));
      log(`Found ${inputs.length} input fields`);

      if (inputs.length < 2) {
        throw new Error('Expected at least 2 input fields (email, password)');
      }

      // Fill in credentials - order: email, password
      await inputs[0].sendKeys('akashranga27@gmail.com');
      log('Entered email');

      await inputs[1].sendKeys('123456');
      log('Entered password');

      // Click login button
      log('Clicking login button...');
      const buttons = await driver.findElements(By.css('form button'));
      for (const button of buttons) {
        const text = await button.getText();
        if (text.toLowerCase().includes('sign') || text.toLowerCase().includes('in')) {
          await button.click();
          log(`Clicked button: ${text}`);
          break;
        }
      }

      // Wait for dashboard
      await driver.wait(until.urlContains('dashboard'), 15000);
      log('Redirected to dashboard');

      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl.includes('dashboard')) {
        addResult('Login - successful login', true);
        log('Login test PASSED');
      } else {
        addResult('Login - successful login', false, `Unexpected URL: ${currentUrl}`);
      }

    } catch (error) {
      addResult('Login - successful login', false, error.message);
      throw error;
    }
  });
});