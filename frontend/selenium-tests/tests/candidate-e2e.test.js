/**
 * Candidate E2E Test Suite
 * Tests the complete candidate workflow:
 * 1. Signup
 * 2. Login
 * 3. Fill Profile Details
 * 4. View Dashboard
 *
 * Run with: npm run candidate-e2e
 */

const { Builder, By, until, Key } = require('selenium-webdriver');
require('chromedriver');
const reportGenerator = require('../reportGenerator');

// Test configuration
const BASE_URL = 'http://localhost:8189/interview_assist';
const TEST_USER = {
  email: `testcandidate${Date.now()}@example.com`,
  fullName: 'Test Candidate',
  password: 'testpass123',
  phone: '9876543210',
  location: 'Bengaluru, Karnataka',
  degree: 'B.Tech in Computer Science',
  university: 'Test University',
  graduationYear: '2024',
  gpa: '8.5',
  currentRole: 'Software Developer',
  company: 'Test Company',
  years: '2',
  summary: 'Experienced software developer with knowledge in web technologies.',
  skills: ['JavaScript', 'React', 'Node.js'],
  portfolio: 'https://portfolio.example.com',
  linkedin: 'https://linkedin.com/in/testcandidate',
  github: 'https://github.com/testcandidate'
};

// Re-export the reporter functions for use in tests
const log = (message, level) => reportGenerator.log(message, level);
const addResult = (testName, passed, error) => reportGenerator.addResult(testName, passed, error);

describe('Candidate E2E Workflow', function() {
  this.timeout(180000); // 3 minutes timeout for entire suite

  let driver;

  before(async () => {
    reportGenerator.init();
    log('Initializing WebDriver...');
    driver = await new Builder()
      .forBrowser('chrome')
      .build();
    await driver.manage().window().maximize();
    log('WebDriver initialized successfully');
  });

  after(async () => {
    if (driver) {
      log('Closing WebDriver...');
      await driver.quit();
    }
    // Generate Excel report
    const report = await reportGenerator.generateAndPrint();
    // Exit with error code if tests failed
    if (report.failed > 0) {
      process.exit(1);
    }
  });

  // ============================================================
  // TEST 1: SIGNUP
  // ============================================================
  describe('1. Signup', function() {
    it('should navigate to signup page and create new account', async function() {
      try {
        log('Starting Signup test...');

        // Navigate to signup page
        log('Navigating to signup page...');
        await driver.get(`${BASE_URL}/#/signup`);

        // Wait for page to load - look for form
        await driver.wait(until.elementLocated(By.css('form')), 15000);
        log('Signup page loaded successfully');

        // Find all input fields in the form
        const inputs = await driver.findElements(By.css('form input'));
        log(`Found ${inputs.length} input fields in signup form`);

        if (inputs.length < 4) {
          throw new Error(`Expected at least 4 input fields, found ${inputs.length}`);
        }

        // Fill in signup form based on order
        // Input 0: Full Name, Input 1: Email, Input 2: Password, Input 3: Confirm Password
        log(`Filling signup form with email: ${TEST_USER.email}`);

        // Full Name (first input)
        await inputs[0].sendKeys(TEST_USER.fullName);
        log('Entered full name');

        // Email (second input)
        await inputs[1].sendKeys(TEST_USER.email);
        log('Entered email');

        // Password (third input)
        await inputs[2].sendKeys(TEST_USER.password);
        log('Entered password');

        // Confirm Password (fourth input)
        await inputs[3].sendKeys(TEST_USER.password);
        log('Entered confirm password');

        // Click signup button
        log('Clicking signup button...');
        const buttons = await driver.findElements(By.css('form button'));
        for (const button of buttons) {
          const text = await button.getText();
          if (text.toLowerCase().includes('sign up') || text.toLowerCase().includes('signUp')) {
            await button.click();
            log('Clicked signup button');
            break;
          }
        }

        // Wait for navigation or success message
        await driver.sleep(3000);

        // Check current URL
        const currentUrl = await driver.getCurrentUrl();
        log(`Current URL after signup: ${currentUrl}`);

        addResult('Signup - Create new account', true);
        log('Signup completed successfully');

      } catch (error) {
        addResult('Signup - Create new account', false, error.message);
        throw error;
      }
    });
  });

  // ============================================================
  // TEST 2: LOGIN
  // ============================================================
  describe('2. Login', function() {
    it('should login with newly created account', async function() {
      try {
        log('Starting Login test...');

        // Navigate to login page
        log('Navigating to login page...');
        await driver.get(`${BASE_URL}/#/login`);

        // Wait for email field
        await driver.wait(until.elementLocated(By.css('form input[type="email"]')), 10000);
        log('Login page loaded successfully');

        // Find input fields - email and password
        const emailInput = await driver.findElement(By.css('form input[type="email"]'));
        const passwordInput = await driver.findElement(By.css('form input[type="password"]'));

        log(`Entering email: ${TEST_USER.email}`);
        await emailInput.sendKeys(TEST_USER.email);

        await passwordInput.sendKeys(TEST_USER.password);
        log('Entered password');

        // Click login button
        log('Clicking login button...');
        const buttons = await driver.findElements(By.css('form button'));
        for (const button of buttons) {
          const text = await button.getText();
          if (text.toLowerCase().includes('sign in') || text.toLowerCase().includes('login')) {
            await button.click();
            log('Clicked login button');
            break;
          }
        }

        // Wait for dashboard to load
        await driver.wait(until.urlContains('dashboard'), 15000);
        log('Successfully redirected to dashboard');

        // Verify we're on candidate dashboard
        const currentUrl = await driver.getCurrentUrl();
        const isCandidateDashboard = currentUrl.includes('/candidate/dashboard');

        if (isCandidateDashboard) {
          addResult('Login - Login with new account', true);
          log('Login test completed successfully');
        } else {
          addResult('Login - Login with new account', false, `Expected candidate dashboard, got: ${currentUrl}`);
        }

      } catch (error) {
        addResult('Login - Login with new account', false, error.message);
        throw error;
      }
    });
  });

  // ============================================================
  // TEST 3: FILL PROFILE DETAILS
  // ============================================================
  describe('3. Fill Profile Details', function() {

    it('should navigate to profile page', async function() {
      try {
        log('Navigating to profile page...');
        await driver.get(`${BASE_URL}/#/candidate/profile`);

        // Wait for page to load - look for section with id="personal"
        await driver.wait(until.elementLocated(By.id('personal')), 15000);
        await driver.sleep(1000);

        const currentUrl = await driver.getCurrentUrl();
        log(`Profile page URL: ${currentUrl}`);

        addResult('Profile - Navigate to profile page', true);
      } catch (error) {
        addResult('Profile - Navigate to profile page', false, error.message);
        throw error;
      }
    });

    it('should fill personal information', async function() {
      try {
        log('Filling personal information...');

        // Find all inputs in the personal section
        const personalSection = await driver.findElement(By.id('personal'));
        const inputs = await personalSection.findElements(By.css('input:not([type="file"]):not([type="checkbox"])'));
        log(`Found ${inputs.length} input fields in personal section`);

        // Find phone input by label text containing "Phone"
        const phoneInput = await personalSection.findElement(By.xpath('.//label[contains(., "Phone")]/following-sibling::input'));
        await phoneInput.clear();
        await phoneInput.sendKeys(TEST_USER.phone);
        log('Entered phone number');

        // Find location input by label text containing "Location"
        const locationInput = await personalSection.findElement(By.xpath('.//label[contains(., "Location")]/following-sibling::input'));
        await locationInput.clear();
        await locationInput.sendKeys(TEST_USER.location);
        log('Entered location');

        addResult('Profile - Fill personal information', true);

      } catch (error) {
        addResult('Profile - Fill personal information', false, error.message);
        log(`Error filling personal info: ${error.message}`);
      }
    });

    it('should fill education details', async function() {
      try {
        log('Filling education details...');

        // Scroll to education section
        const educationSection = await driver.findElement(By.id('education'));
        await driver.executeScript('arguments[0].scrollIntoView(true);', educationSection);
        await driver.sleep(500);

        // Fill degree - find by label text "Degree"
        const degreeInput = await educationSection.findElement(By.xpath('.//label[contains(., "Degree")]/following-sibling::input'));
        await degreeInput.clear();
        await degreeInput.sendKeys(TEST_USER.degree);
        log('Entered degree');

        // Fill university
        const universityInput = await educationSection.findElement(By.xpath('.//label[contains(., "University")]/following-sibling::input'));
        await universityInput.clear();
        await universityInput.sendKeys(TEST_USER.university);
        log('Entered university');

        // Fill graduation year
        const yearInput = await educationSection.findElement(By.xpath('.//label[contains(., "Graduation")]/following-sibling::input'));
        await yearInput.clear();
        await yearInput.sendKeys(TEST_USER.graduationYear);
        log('Entered graduation year');

        // Fill GPA
        const gpaInput = await educationSection.findElement(By.xpath('.//label[contains(., "GPA")]/following-sibling::input'));
        await gpaInput.clear();
        await gpaInput.sendKeys(TEST_USER.gpa);
        log('Entered GPA');

        addResult('Profile - Fill education details', true);

      } catch (error) {
        addResult('Profile - Fill education details', false, error.message);
        log(`Error filling education: ${error.message}`);
      }
    });

    it('should fill experience details', async function() {
      try {
        log('Filling experience details...');

        // Scroll to experience section
        const experienceSection = await driver.findElement(By.id('experience'));
        await driver.executeScript('arguments[0].scrollIntoView(true);', experienceSection);
        await driver.sleep(500);

        // Fill job role - find by label text "Job Role"
        const roleInput = await experienceSection.findElement(By.xpath('.//label[contains(., "Job Role")]/following-sibling::input'));
        await roleInput.clear();
        await roleInput.sendKeys(TEST_USER.currentRole);
        log('Entered job role');

        // Fill company
        const companyInput = await experienceSection.findElement(By.xpath('.//label[contains(., "Company")]/following-sibling::input'));
        await companyInput.clear();
        await companyInput.sendKeys(TEST_USER.company);
        log('Entered company');

        // Fill years of experience
        const yearsInput = await experienceSection.findElement(By.xpath('.//label[contains(., "Years")]/following-sibling::input'));
        await yearsInput.clear();
        await yearsInput.sendKeys(TEST_USER.years);
        log('Entered years of experience');

        // Fill summary (textarea)
        const summaryTextarea = await experienceSection.findElement(By.css('textarea'));
        await summaryTextarea.clear();
        await summaryTextarea.sendKeys(TEST_USER.summary);
        log('Entered experience summary');

        addResult('Profile - Fill experience details', true);

      } catch (error) {
        addResult('Profile - Fill experience details', false, error.message);
        log(`Error filling experience: ${error.message}`);
      }
    });

    it('should add skills', async function() {
      try {
        log('Adding skills...');

        // Scroll to skills section
        const skillsSection = await driver.findElement(By.id('skills'));
        await driver.executeScript('arguments[0].scrollIntoView(true);', skillsSection);
        await driver.sleep(500);

        // Find skill input by placeholder text in the skills section
        const skillInput = await skillsSection.findElement(By.css('input[placeholder*="skill" i]'));

        // Add each skill
        for (const skill of TEST_USER.skills) {
          await skillInput.clear();
          await skillInput.sendKeys(skill);
          await skillInput.sendKeys(Key.ENTER);
          log(`Added skill: ${skill}`);
          await driver.sleep(500);
        }

        addResult('Profile - Add skills', true);

      } catch (error) {
        addResult('Profile - Add skills', false, error.message);
        log(`Error adding skills: ${error.message}`);
      }
    });

    it('should fill job application preferences', async function() {
      try {
        log('Filling job application preferences...');

        // Scroll to preferences section (role & location)
        const preferencesSection = await driver.findElement(By.id('preferences'));
        await driver.executeScript('arguments[0].scrollIntoView(true);', preferencesSection);
        await driver.sleep(1000);

        // Find the role select dropdown - first select in the section
        const selects = await preferencesSection.findElements(By.css('select'));
        log(`Found ${selects.length} select elements in preferences section`);

        if (selects.length >= 2) {
          const roleSelect = selects[0];
          const options = await roleSelect.findElements(By.css('option'));
          log(`Found ${options.length} role options`);

          // Select the first available role (not the default "Select a role" option)
          if (options.length > 1) {
            await roleSelect.click();
            await driver.sleep(300);
            // Select second option (first real role)
            await options[1].click();
            log('Selected a job role');
          }

          // Find and fill location dropdown - second select
          const locationSelect = selects[1];
          await locationSelect.click();
          await driver.sleep(300);

          // Select Bengaluru option
          const locationOptions = await locationSelect.findElements(By.css('option'));
          for (const option of locationOptions) {
            const text = await option.getText();
            if (text.includes('Bengaluru')) {
              await option.click();
              log('Selected location: Bengaluru');
              break;
            }
          }
        } else {
          log('Only one select found, skipping location selection');
        }

        addResult('Profile - Fill job application preferences', true);

      } catch (error) {
        addResult('Profile - Fill job application preferences', false, error.message);
        log(`Error filling preferences: ${error.message}`);
      }
    });

    it('should fill links (portfolio, linkedin, github)', async function() {
      try {
        log('Filling links...');

        // Scroll to links section
        const linksSection = await driver.findElement(By.id('links'));
        await driver.executeScript('arguments[0].scrollIntoView(true);', linksSection);
        await driver.sleep(500);

        // Find link inputs by label text
        const portfolioInput = await linksSection.findElement(By.xpath('.//label[contains(., "Portfolio")]/following-sibling::input'));
        await portfolioInput.clear();
        await portfolioInput.sendKeys(TEST_USER.portfolio);
        log('Entered portfolio URL');

        const linkedinInput = await linksSection.findElement(By.xpath('.//label[contains(., "LinkedIn")]/following-sibling::input'));
        await linkedinInput.clear();
        await linkedinInput.sendKeys(TEST_USER.linkedin);
        log('Entered LinkedIn URL');

        const githubInput = await linksSection.findElement(By.xpath('.//label[contains(., "GitHub")]/following-sibling::input'));
        await githubInput.clear();
        await githubInput.sendKeys(TEST_USER.github);
        log('Entered GitHub URL');

        addResult('Profile - Fill links', true);

      } catch (error) {
        addResult('Profile - Fill links', false, error.message);
        log(`Error filling links: ${error.message}`);
      }
    });

    it('should save profile', async function() {
      try {
        log('Saving profile...');

        // Scroll to bottom to find save buttons
        await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
        await driver.sleep(500);

        // Find all buttons and look for Save
        const buttons = await driver.findElements(By.css('button'));
        let saveClicked = false;

        for (const button of buttons) {
          const text = await button.getText();
          if (text.toLowerCase().includes('save') || text.toLowerCase().includes('draft')) {
            await button.click();
            log(`Clicked button: ${text}`);
            saveClicked = true;
            break;
          }
        }

        if (!saveClicked) {
          log('Save button not found, trying alternative...');
          // Try clicking the Save Draft button specifically
          const saveButtons = await driver.findElements(By.css('button:contains("Save"), button:contains("Draft")'));
          if (saveButtons.length > 0) {
            await saveButtons[0].click();
            log('Clicked save button (alternative)');
            saveClicked = true;
          }
        }

        // Wait for save to complete
        await driver.sleep(3000);

        if (saveClicked) {
          addResult('Profile - Save profile', true);
        } else {
          addResult('Profile - Save profile', false, 'Save button not found');
        }

      } catch (error) {
        addResult('Profile - Save profile', false, error.message);
        log(`Error saving profile: ${error.message}`);
      }
    });
  });

  // ============================================================
  // TEST 4: VIEW DASHBOARD
  // ============================================================
  describe('4. View Dashboard', function() {

    it('should navigate to dashboard', async function() {
      try {
        log('Navigating to dashboard...');
        await driver.get(`${BASE_URL}/#/candidate/dashboard`);

        // Wait for dashboard to load
        await driver.wait(until.elementLocated(By.css('body')), 10000);
        await driver.sleep(2000);

        const currentUrl = await driver.getCurrentUrl();
        log(`Dashboard URL: ${currentUrl}`);

        addResult('Dashboard - Navigate to dashboard', true);

      } catch (error) {
        addResult('Dashboard - Navigate to dashboard', false, error.message);
        throw error;
      }
    });

    it('should verify dashboard elements are present', async function() {
      try {
        log('Verifying dashboard elements...');

        // Get page source to check for elements
        const pageSource = await driver.getPageSource();

        // Check for common dashboard elements
        const hasWelcome = pageSource.includes('Welcome') || pageSource.includes('welcome');
        const hasDashboard = pageSource.includes('Dashboard') || pageSource.includes('dashboard');

        log(`Welcome message found: ${hasWelcome}`);
        log(`Dashboard text found: ${hasDashboard}`);

        if (hasDashboard) {
          addResult('Dashboard - Verify dashboard elements', true);
          log('Dashboard verification completed');
        } else {
          addResult('Dashboard - Verify dashboard elements', false, 'Dashboard elements not found in page source');
        }

      } catch (error) {
        addResult('Dashboard - Verify dashboard elements', false, error.message);
        throw error;
      }
    });

    it('should verify user is logged in', async function() {
      try {
        log('Verifying user session...');

        // Check localStorage for user data
        const userData = await driver.executeScript(() => {
          return localStorage.getItem('user');
        });

        if (userData) {
          const user = JSON.parse(userData);
          log(`User logged in: ${user.full_name || user.email || 'Unknown'}`);
          addResult('Dashboard - Verify user is logged in', true);
        } else {
          addResult('Dashboard - Verify user is logged in', false, 'No user data found in localStorage');
        }

      } catch (error) {
        addResult('Dashboard - Verify user is logged in', false, error.message);
        throw error;
      }
    });
  });
});