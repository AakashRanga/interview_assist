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
const BASE_URL = 'https://aakashranga.github.io/interview_assist/';
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
  this.timeout(600000); // 10 minutes timeout for entire suite

  let driver;
  let testStarted = false;

  before(async () => {
    reportGenerator.init();
    log('Initializing WebDriver...');
    try {
      driver = await new Builder()
        .forBrowser('chrome')
        .build();
      await driver.manage().window().maximize();
      await driver.manage().setTimeouts({ implicit: 10000, pageLoad: 30000 });
      log('WebDriver initialized successfully');
    } catch (error) {
      log(`WebDriver init error: ${error.message}`);
    }
  });

  after(async () => {
    if (driver) {
      try {
        log('Closing WebDriver...');
        await driver.quit();
      } catch (e) {
        log(`Driver quit error: ${e.message}`);
      }
    }
    // Generate Excel report
    const report = await reportGenerator.generateAndPrint();
    log(`Tests completed: ${report.passed} passed, ${report.failed} failed`);
  });

  // Helper to ensure driver is still available
  async function safeNavigate(url) {
    if (!driver) return false;
    try {
      await driver.get(url);
      return true;
    } catch (e) {
      log(`Navigation error: ${e.message}`);
      return false;
    }
  }

  // Helper to safely get page source
  async function safeGetPageSource() {
    if (!driver) return '';
    try {
      return await driver.getPageSource();
    } catch (e) {
      return '';
    }
  }

  // Helper to safely get current URL
  async function safeGetUrl() {
    if (!driver) return '';
    try {
      return await driver.getCurrentUrl();
    } catch (e) {
      return '';
    }
  }

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

  // ============================================================
  // FAILING TEST CASES - To demonstrate test failures
  // ============================================================

  describe('Failing Test Cases', function() {

    it('FAILING TEST 1: Signup with short password (less than 6 chars) should fail', async function() {
      try {
        log('Testing signup with short password...');

        const shortPassword = 'abc'; // Less than 6 characters

        // Navigate to signup page
        await driver.get(`${BASE_URL}/#/signup`);
        await driver.wait(until.elementLocated(By.css('form')), 15000);

        const inputs = await driver.findElements(By.css('form input'));
        log(`Found ${inputs.length} input fields`);

        // Fill form with short password
        await inputs[0].sendKeys('Short PW Test');
        await inputs[1].sendKeys(`shortpw${Date.now()}@example.com`);
        await inputs[2].sendKeys(shortPassword); // Only 3 characters
        await inputs[3].sendKeys(shortPassword);
        log(`Entered short password: ${shortPassword}`);

        // Click signup button
        const buttons = await driver.findElements(By.css('form button'));
        for (const button of buttons) {
          const text = await button.getText();
          if (text.toLowerCase().includes('sign up')) {
            await button.click();
            break;
          }
        }

        // Wait for validation
        await driver.sleep(2000);
        const pageSource = await driver.getPageSource();

        // Check if validation error appears for short password
        const hasPasswordError = pageSource.includes('6') ||
                                 pageSource.includes('minimum') ||
                                 pageSource.includes('characters') ||
                                 pageSource.includes('password') ||
                                 pageSource.includes('least');

        // This test expects validation to FAIL - if signup succeeds, that's unexpected
        if (!hasPasswordError) {
          throw new Error('Signup succeeded with short password (3 chars) - should require minimum 6 characters!');
        }

        addResult('FAILING TEST - Short password validation works', true);

      } catch (error) {
        addResult('FAILING TEST - Short password validation works', false, error.message);
        // Don't throw - continue to next test
      }
    });

    it('FAILING TEST 2: Signup with mismatched passwords should fail', async function() {
      try {
        log('Testing signup with mismatched passwords...');

        // Navigate to signup page
        await driver.get(`${BASE_URL}/#/signup`);
        await driver.wait(until.elementLocated(By.css('form')), 15000);

        const inputs = await driver.findElements(By.css('form input'));

        // Fill form with mismatched passwords
        await inputs[0].sendKeys('Mismatch PW Test');
        await inputs[1].sendKeys(`mismatch${Date.now()}@example.com`);
        await inputs[2].sendKeys('password123');
        await inputs[3].sendKeys('password456'); // Different!
        log('Entered mismatched passwords');

        // Click signup button
        const buttons = await driver.findElements(By.css('form button'));
        for (const button of buttons) {
          const text = await button.getText();
          if (text.toLowerCase().includes('sign up')) {
            await button.click();
            break;
          }
        }

        // Wait for validation
        await driver.sleep(2000);
        const pageSource = await driver.getPageSource();
        const currentUrl = await driver.getCurrentUrl();

        // Check if validation error appears for mismatched passwords
        const hasMismatchError = pageSource.includes('match') ||
                                pageSource.includes('same') ||
                                pageSource.includes('confirm');

        // This test expects validation to FAIL - if signup succeeds, that's unexpected
        if (!hasMismatchError && currentUrl.includes('dashboard')) {
          throw new Error('Signup succeeded with mismatched passwords - should have been rejected!');
        }

        addResult('FAILING TEST - Mismatched password validation works', true);

      } catch (error) {
        addResult('FAILING TEST - Mismatched password validation works', false, error.message);
        // Don't throw - continue to next test
      }
    });

    it('FAILING TEST 3: Access admin panel as candidate should fail', async function() {
      try {
        log('Testing unauthorized admin access...');

        // Try to access admin routes directly
        await driver.get(`${BASE_URL}/#/admin/dashboard`);
        await driver.sleep(2000);

        const currentUrl = await driver.getCurrentUrl();
        const pageSource = await driver.getPageSource();

        // Check if we're blocked from admin panel
        const isBlocked = pageSource.includes('Access Denied') ||
                         pageSource.includes('Unauthorized') ||
                         pageSource.includes('403') ||
                         pageSource.includes('Forbidden') ||
                         currentUrl.includes('login');

        // This test expects access to be DENIED - if we see admin dashboard, that's unexpected
        if (!isBlocked && currentUrl.includes('admin/dashboard')) {
          throw new Error('Candidate was able to access admin panel - this should have been blocked!');
        }

        addResult('FAILING TEST - Admin access blocked for candidate', true);

      } catch (error) {
        addResult('FAILING TEST - Admin access blocked for candidate', false, error.message);
        // Don't throw - continue to next test
      }
    });

    it('FAILING TEST 4: Login with invalid email format should fail', async function() {
      try {
        log('Testing login with invalid email format...');

        // Navigate to login page
        await driver.get(`${BASE_URL}/#/login`);
        await driver.wait(until.elementLocated(By.css('form input[type="email"]')), 10000);

        // Enter invalid email format
        const emailInput = await driver.findElement(By.css('form input[type="email"]'));
        const passwordInput = await driver.findElement(By.css('form input[type="password"]'));

        await emailInput.sendKeys('notanemail'); // Invalid format
        await passwordInput.sendKeys('somepassword');

        // Click login button
        const buttons = await driver.findElements(By.css('form button'));
        for (const button of buttons) {
          const text = await button.getText();
          if (text.toLowerCase().includes('sign in') || text.toLowerCase().includes('login')) {
            await button.click();
            break;
          }
        }

        // Wait for validation
        await driver.sleep(2000);
        const pageSource = await driver.getPageSource();
        const currentUrl = await driver.getCurrentUrl();

        // Check if validation error appears
        const hasEmailError = pageSource.includes('email') ||
                             pageSource.includes('invalid') ||
                             pageSource.includes('format');

        // This test expects validation to FAIL - if we get to dashboard, that's unexpected
        if (!hasEmailError && currentUrl.includes('dashboard')) {
          throw new Error('Login succeeded with invalid email format - should have been rejected!');
        }

        addResult('FAILING TEST - Invalid email format validation works', true);

      } catch (error) {
        addResult('FAILING TEST - Invalid email format validation works', false, error.message);
        // Don't throw - continue to next test
      }
    });
  });

  // ============================================================
  // PASSING TESTS - Valid inputs that should succeed
  // ============================================================

  describe('Passing Validation Tests', function() {

    it('PASSING TEST 1: Signup with valid 6+ char password should succeed', async function() {
      try {
        log('Testing signup with valid password...');

        const validPassword = 'password123'; // 12 characters

        await driver.get(`${BASE_URL}/#/signup`);
        await driver.wait(until.elementLocated(By.css('form')), 15000);

        const inputs = await driver.findElements(By.css('form input'));
        await inputs[0].sendKeys('Valid PW User');
        await inputs[1].sendKeys(`validpw${Date.now()}@example.com`);
        await inputs[2].sendKeys(validPassword);
        await inputs[3].sendKeys(validPassword);

        const buttons = await driver.findElements(By.css('form button'));
        for (const button of buttons) {
          const text = await button.getText();
          if (text.toLowerCase().includes('sign up')) {
            await button.click();
            break;
          }
        }

        await driver.sleep(3000);
        const currentUrl = await driver.getCurrentUrl();

        // This should succeed - valid password
        if (currentUrl.includes('dashboard') || currentUrl.includes('profile')) {
          addResult('PASSING TEST - Valid password accepted', true);
        } else {
          addResult('PASSING TEST - Valid password accepted', false, 'Navigation did not occur');
        }

      } catch (error) {
        addResult('PASSING TEST - Valid password accepted', false, error.message);
      }
    });

    it('PASSING TEST 2: Login with correct credentials should succeed', async function() {
      try {
        log('Testing login with correct credentials...');

        await driver.get(`${BASE_URL}/#/login`);
        await driver.wait(until.elementLocated(By.css('form input[type="email"]')), 10000);

        const emailInput = await driver.findElement(By.css('form input[type="email"]'));
        const passwordInput = await driver.findElement(By.css('form input[type="password"]'));

        await emailInput.sendKeys('akashranga27@gmail.com');
        await passwordInput.sendKeys('123456');

        const buttons = await driver.findElements(By.css('form button'));
        for (const button of buttons) {
          const text = await button.getText();
          if (text.toLowerCase().includes('sign in') || text.toLowerCase().includes('login')) {
            await button.click();
            break;
          }
        }

        await driver.wait(until.urlContains('dashboard'), 15000);
        const currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes('dashboard')) {
          addResult('PASSING TEST - Valid login succeeds', true);
        } else {
          addResult('PASSING TEST - Valid login succeeds', false, 'Did not redirect to dashboard');
        }

      } catch (error) {
        addResult('PASSING TEST - Valid login succeeds', false, error.message);
      }
    });
  });

  // ============================================================
  // FAILING TESTS - DB Validation & Field Length
  // ============================================================

  describe('DB Validation & Field Length Tests', function() {

    it('FAILING TEST 5: Name field exceeding 100 chars should be rejected', async function() {
      try {
        log('Testing name field length validation...');

        const longName = 'A'.repeat(150); // 150 chars, should be limited to 100

        await driver.get(`${BASE_URL}/#/signup`);
        await driver.wait(until.elementLocated(By.css('form')), 15000);

        const inputs = await driver.findElements(By.css('form input'));
        await inputs[0].sendKeys(longName);
        await inputs[1].sendKeys(`longname${Date.now()}@example.com`);
        await inputs[2].sendKeys('password123');
        await inputs[3].sendKeys('password123');

        const buttons = await driver.findElements(By.css('form button'));
        for (const button of buttons) {
          const text = await button.getText();
          if (text.toLowerCase().includes('sign up')) {
            await button.click();
            break;
          }
        }

        await driver.sleep(3000);
        const pageSource = await driver.getPageSource();

        // Check if length validation error appears
        const hasLengthError = pageSource.includes('100') ||
                              pageSource.includes('characters') ||
                              pageSource.includes('limit') ||
                              pageSource.includes('too long');

        if (!hasLengthError) {
          throw new Error('150-char name was accepted - should be limited to 100 characters!');
        }

        addResult('FAILING TEST - Name field length validation', true);

      } catch (error) {
        addResult('FAILING TEST - Name field length validation', false, error.message);
      }
    });

    it('FAILING TEST 6: Email field exceeding 255 chars should be rejected', async function() {
      try {
        log('Testing email field length validation...');

        const longEmail = 'a'.repeat(250) + '@test.com'; // Very long email

        await driver.get(`${BASE_URL}/#/signup`);
        await driver.wait(until.elementLocated(By.css('form')), 15000);

        const inputs = await driver.findElements(By.css('form input'));
        await inputs[0].sendKeys('Long Email Test');
        await inputs[1].sendKeys(longEmail);
        await inputs[2].sendKeys('password123');
        await inputs[3].sendKeys('password123');

        const buttons = await driver.findElements(By.css('form button'));
        for (const button of buttons) {
          const text = await button.getText();
          if (text.toLowerCase().includes('sign up')) {
            await button.click();
            break;
          }
        }

        await driver.sleep(2000);
        const pageSource = await driver.getPageSource();

        const hasEmailLengthError = pageSource.includes('255') ||
                                    pageSource.includes('too long') ||
                                    pageSource.includes('limit');

        if (!hasEmailLengthError) {
          throw new Error('Very long email was accepted - should be limited to 255 characters!');
        }

        addResult('FAILING TEST - Email field length validation', true);

      } catch (error) {
        addResult('FAILING TEST - Email field length validation', false, error.message);
      }
    });

    it('FAILING TEST 7: Phone field exceeding 20 chars should be rejected', async function() {
      try {
        log('Testing phone field length validation...');

        await driver.get(`${BASE_URL}/#/candidate/profile`);
        await driver.wait(until.elementLocated(By.id('personal')), 10000);

        const longPhone = '1'.repeat(25); // 25 chars, should be limited to 20

        const phoneInput = await driver.findElement(By.xpath('.//label[contains(., "Phone")]/following-sibling::input'));
        await phoneInput.clear();
        await phoneInput.sendKeys(longPhone);

        await driver.sleep(1000);
        const pageSource = await driver.getPageSource();

        const hasPhoneError = pageSource.includes('20') ||
                             pageSource.includes('limit') ||
                             pageSource.includes('too long');

        if (!hasPhoneError) {
          throw new Error('25-char phone was accepted - should be limited to 20 characters!');
        }

        addResult('FAILING TEST - Phone field length validation', true);

      } catch (error) {
        addResult('FAILING TEST - Phone field length validation', false, error.message);
      }
    });

    it('FAILING TEST 8: Location field exceeding 255 chars should be rejected', async function() {
      try {
        log('Testing location field length validation...');

        const longLocation = 'Address Line 1, Address Line 2, Address Line 3, City, State, Country, Pincode '.repeat(5);

        await driver.get(`${BASE_URL}/#/candidate/profile`);
        await driver.wait(until.elementLocated(By.id('personal')), 10000);

        const locationInput = await driver.findElement(By.xpath('.//label[contains(., "Location")]/following-sibling::input'));
        await locationInput.clear();
        await locationInput.sendKeys(longLocation);

        await driver.sleep(1000);
        const pageSource = await driver.getPageSource();

        const hasLocationError = pageSource.includes('255') ||
                                pageSource.includes('limit') ||
                                pageSource.includes('too long');

        if (!hasLocationError) {
          throw new Error('Very long location was accepted - should be limited to 255 characters!');
        }

        addResult('FAILING TEST - Location field length validation', true);

      } catch (error) {
        addResult('FAILING TEST - Location field length validation', false, error.message);
      }
    });

    it('FAILING TEST 9: Skills field exceeding 500 chars should be rejected', async function() {
      try {
        log('Testing skills field length validation...');

        const longSkills = 'JavaScript, React, Node.js, Python, Java, SQL, MongoDB, Docker, Kubernetes, AWS, GCP, Azure, Git, CI/CD, DevOps, Microservices, REST API, GraphQL '.repeat(6);

        await driver.get(`${BASE_URL}/#/candidate/profile`);
        await driver.wait(until.elementLocated(By.id('skills')), 10000);

        const skillInput = await driver.findElement(By.css('input[placeholder*="skill" i]'));
        await skillInput.clear();
        await skillInput.sendKeys(longSkills);

        await driver.sleep(1000);
        const pageSource = await driver.getPageSource();

        const hasSkillsError = pageSource.includes('500') ||
                              pageSource.includes('limit') ||
                              pageSource.includes('too long');

        if (!hasSkillsError) {
          throw new Error('Very long skills was accepted - should be limited to 500 characters!');
        }

        addResult('FAILING TEST - Skills field length validation', true);

      } catch (error) {
        addResult('FAILING TEST - Skills field length validation', false, error.message);
      }
    });

    it('FAILING TEST 10: Experience summary exceeding 1000 chars should be rejected', async function() {
      try {
        log('Testing experience summary field length validation...');

        const longSummary = 'Worked on multiple projects. '.repeat(150); // > 1000 chars

        await driver.get(`${BASE_URL}/#/candidate/profile`);
        await driver.wait(until.elementLocated(By.id('experience')), 10000);

        const summaryTextarea = await driver.findElement(By.css('textarea'));
        await summaryTextarea.clear();
        await summaryTextarea.sendKeys(longSummary);

        await driver.sleep(1000);
        const pageSource = await driver.getPageSource();

        const hasSummaryError = pageSource.includes('1000') ||
                                pageSource.includes('limit') ||
                                pageSource.includes('too long');

        if (!hasSummaryError) {
          throw new Error('Very long summary was accepted - should be limited to 1000 characters!');
        }

        addResult('FAILING TEST - Experience summary length validation', true);

      } catch (error) {
        addResult('FAILING TEST - Experience summary length validation', false, error.message);
      }
    });
  });

  // ============================================================
  // FAILING TESTS - Security & Vulnerability Tests
  // ============================================================

  describe('Security & Vulnerability Tests', function() {

    it('FAILING TEST 11: XSS in name field should be sanitized', async function() {
      try {
        log('Testing XSS vulnerability in name field...');

        const xssName = '<script>alert("XSS")</script>Test';

        await driver.get(`${BASE_URL}/#/signup`);
        await driver.wait(until.elementLocated(By.css('form')), 15000);

        const inputs = await driver.findElements(By.css('form input'));
        await inputs[0].sendKeys(xssName);
        await inputs[1].sendKeys(`xss${Date.now()}@example.com`);
        await inputs[2].sendKeys('password123');
        await inputs[3].sendKeys('password123');

        const buttons = await driver.findElements(By.css('form button'));
        for (const button of buttons) {
          const text = await button.getText();
          if (text.toLowerCase().includes('sign up')) {
            await button.click();
            break;
          }
        }

        await driver.sleep(3000);

        // Check if XSS is reflected unsanitized
        const pageSource = await driver.getPageSource();
        const hasXSS = pageSource.includes('<script>') ||
                      pageSource.includes('alert(') ||
                      pageSource.includes('XSS');

        if (hasXSS) {
          throw new Error('XSS payload was reflected without sanitization!');
        }

        addResult('FAILING TEST - XSS in name field sanitized', true);

      } catch (error) {
        addResult('FAILING TEST - XSS in name field sanitized', false, error.message);
      }
    });

    it('FAILING TEST 12: SQL injection in search should be blocked', async function() {
      try {
        log('Testing SQL injection vulnerability...');

        const sqliPayload = "' OR '1'='1";

        await driver.get(`${BASE_URL}/#/candidate/jobs`);
        await driver.sleep(2000);

        // Try to find search input and inject SQL
        const searchInputs = await driver.findElements(By.css('input[type="search"]'));
        if (searchInputs.length > 0) {
          await searchInputs[0].sendKeys(sqliPayload);
          await driver.sleep(1000);
        }

        // Check for SQL error in page
        const pageSource = await driver.getPageSource();
        const hasSQLError = pageSource.includes('SQL') ||
                           pageSource.includes('syntax') ||
                           pageSource.includes('error') ||
                           pageSource.includes('mysql');

        // Should NOT show SQL errors
        if (hasSQLError) {
          throw new Error('SQL injection payload caused SQL error - vulnerable!');
        }

        addResult('FAILING TEST - SQL injection blocked', true);

      } catch (error) {
        addResult('FAILING TEST - SQL injection blocked', false, error.message);
      }
    });

    it('FAILING TEST 13: Stored XSS in profile should be sanitized', async function() {
      try {
        log('Testing stored XSS in profile fields...');

        const xssPayload = '<img src=x onerror=alert("XSS")>';

        await driver.get(`${BASE_URL}/#/candidate/profile`);
        await driver.wait(until.elementLocated(By.id('personal')), 10000);

        // Inject XSS in location field
        const locationInput = await driver.findElement(By.xpath('.//label[contains(., "Location")]/following-sibling::input'));
        await locationInput.clear();
        await locationInput.sendKeys(xssPayload);

        // Save profile
        await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
        await driver.sleep(500);

        const buttons = await driver.findElements(By.css('button'));
        for (const button of buttons) {
          const text = await button.getText();
          if (text.toLowerCase().includes('save')) {
            await button.click();
            break;
          }
        }

        await driver.sleep(2000);

        // Navigate away and back to check if XSS is stored
        await driver.get(`${BASE_URL}/#/candidate/dashboard`);
        await driver.sleep(2000);
        await driver.get(`${BASE_URL}/#/candidate/profile`);
        await driver.sleep(2000);

        const pageSource = await driver.getPageSource();
        const hasStoredXSS = pageSource.includes('<img') ||
                            pageSource.includes('onerror');

        if (hasStoredXSS) {
          throw new Error('Stored XSS was not sanitized and is visible!');
        }

        addResult('FAILING TEST - Stored XSS sanitized', true);

      } catch (error) {
        addResult('FAILING TEST - Stored XSS sanitized', false, error.message);
      }
    });

    it('FAILING TEST 14: No rate limiting on login endpoint', async function() {
      try {
        log('Testing rate limiting on login...');

        await driver.get(`${BASE_URL}/#/login`);

        // Try multiple rapid login attempts
        for (let i = 0; i < 10; i++) {
          await driver.get(`${BASE_URL}/#/login`);
          await driver.wait(until.elementLocated(By.css('form')), 5000);

          const emailInput = await driver.findElement(By.css('form input[type="email"]'));
          const passwordInput = await driver.findElement(By.css('form input[type="password"]'));

          await emailInput.sendKeys('bruteforce@test.com');
          await passwordInput.sendKeys('wrongpass');

          const buttons = await driver.findElements(By.css('form button'));
          for (const button of buttons) {
            const text = await button.getText();
            if (text.toLowerCase().includes('login')) {
              await button.click();
              break;
            }
          }

          await driver.sleep(200); // Very fast attempts
        }

        await driver.sleep(1000);
        const pageSource = await driver.getPageSource();

        // Check if rate limiting message appears
        const hasRateLimit = pageSource.includes('rate') ||
                            pageSource.includes('too many') ||
                            pageSource.includes('blocked') ||
                            pageSource.includes('try again later');

        if (!hasRateLimit) {
          throw new Error('No rate limiting detected - 10 rapid login attempts succeeded!');
        }

        addResult('FAILING TEST - Rate limiting on login', true);

      } catch (error) {
        addResult('FAILING TEST - Rate limiting on login', false, error.message);
      }
    });

    it('FAILING TEST 15: IDOR - View other candidate profiles', async function() {
      try {
        log('Testing IDOR vulnerability...');

        // Try to access another candidate's profile directly
        await driver.get(`${BASE_URL}/#/candidate/profile/2`);
        await driver.sleep(2000);

        const pageSource = await driver.getPageSource();
        const currentUrl = await driver.getCurrentUrl();

        // Should either redirect to own profile or show access denied
        const isOwnProfile = currentUrl.includes('/profile') && !currentUrl.includes('/2');
        const isDenied = pageSource.includes('Access Denied') ||
                       pageSource.includes('Unauthorized') ||
                       pageSource.includes('Forbidden');

        if (!isOwnProfile && !isDenied) {
          throw new Error('IDOR vulnerability - can view other candidate profiles by changing ID in URL!');
        }

        addResult('FAILING TEST - IDOR vulnerability fixed', true);

      } catch (error) {
        addResult('FAILING TEST - IDOR vulnerability fixed', false, error.message);
      }
    });

    it('FAILING TEST 16: Weak password validation (123456 should be rejected)', async function() {
      try {
        log('Testing weak password validation...');

        await driver.get(`${BASE_URL}/#/signup`);
        await driver.wait(until.elementLocated(By.css('form')), 15000);

        const inputs = await driver.findElements(By.css('form input'));
        await inputs[0].sendKeys('Weak PW Test');
        await inputs[1].sendKeys(`weakpw${Date.now()}@example.com`);
        await inputs[2].sendKeys('123456'); // Common weak password
        await inputs[3].sendKeys('123456');

        const buttons = await driver.findElements(By.css('form button'));
        for (const button of buttons) {
          const text = await button.getText();
          if (text.toLowerCase().includes('sign up')) {
            await button.click();
            break;
          }
        }

        await driver.sleep(2000);
        const pageSource = await driver.getPageSource();

        const hasWeakPWError = pageSource.includes('weak') ||
                               pageSource.includes('common') ||
                               pageSource.includes('123456');

        if (!hasWeakPWError) {
          throw new Error('Weak password "123456" was accepted - should be rejected!');
        }

        addResult('FAILING TEST - Weak password validation', true);

      } catch (error) {
        addResult('FAILING TEST - Weak password validation', false, error.message);
      }
    });

    it('FAILING TEST 17: Missing CSRF protection', async function() {
      try {
        log('Testing CSRF protection...');

        // This test checks if CSRF token is present in forms
        await driver.get(`${BASE_URL}/#/candidate/profile`);
        await driver.wait(until.elementLocated(By.css('form')), 10000);

        const pageSource = await driver.getPageSource();

        // Check for CSRF token in form
        const hasCSRF = pageSource.includes('csrf') ||
                       pageSource.includes('token') ||
                       pageSource.includes('_token');

        if (!hasCSRF) {
          throw new Error('No CSRF token found in form - vulnerable to CSRF attacks!');
        }

        addResult('FAILING TEST - CSRF protection present', true);

      } catch (error) {
        addResult('FAILING TEST - CSRF protection present', false, error.message);
      }
    });

    it('FAILING TEST 18: JWT token not expire', async function() {
      try {
        log('Testing JWT token expiration...');

        // Login and get token
        await driver.get(`${BASE_URL}/#/login`);
        await driver.wait(until.elementLocated(By.css('form')), 10000);

        const emailInput = await driver.findElement(By.css('form input[type="email"]'));
        const passwordInput = await driver.findElement(By.css('form input[type="password"]'));

        await emailInput.sendKeys('akashranga27@gmail.com');
        await passwordInput.sendKeys('123456');

        const buttons = await driver.findElements(By.css('form button'));
        for (const button of buttons) {
          const text = await button.getText();
          if (text.toLowerCase().includes('login')) {
            await button.click();
            break;
          }
        }

        await driver.wait(until.urlContains('dashboard'), 15000);

        // Check token in localStorage
        const tokenData = await driver.executeScript(() => {
          const token = localStorage.getItem('token');
          if (!token) return null;
          try {
            // Check if token has expiration
            const payload = JSON.parse(atob(token.split('.')[1]));
            return { exp: payload.exp, hasExp: !!payload.exp };
          } catch (e) {
            return null;
          }
        });

        if (!tokenData || !tokenData.hasExp) {
          throw new Error('JWT token does not have expiration - vulnerable!');
        }

        addResult('FAILING TEST - JWT token has expiration', true);

      } catch (error) {
        addResult('FAILING TEST - JWT token has expiration', false, error.message);
      }
    });

    it('FAILING TEST 19: No input sanitization - HTML tags allowed', async function() {
      try {
        log('Testing HTML input sanitization...');

        const htmlInput = '<div style="color:red">Styled Text</div><script>alert(1)</script>';

        await driver.get(`${BASE_URL}/#/candidate/profile`);
        await driver.wait(until.elementLocated(By.id('personal')), 10000);

        const locationInput = await driver.findElement(By.xpath('.//label[contains(., "Location")]/following-sibling::input'));
        await locationInput.clear();
        await locationInput.sendKeys(htmlInput);

        // Save
        await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
        await driver.sleep(500);

        const saveButtons = await driver.findElements(By.css('button'));
        for (const button of saveButtons) {
          const text = await button.getText();
          if (text.toLowerCase().includes('save')) {
            await button.click();
            break;
          }
        }

        await driver.sleep(2000);

        // Check if HTML is stored as-is
        const pageSource = await driver.getPageSource();
        const hasRawHTML = pageSource.includes('<div') ||
                          pageSource.includes('style=') ||
                          pageSource.includes('<script');

        if (hasRawHTML) {
          throw new Error('HTML tags are not sanitized - stored as raw HTML!');
        }

        addResult('FAILING TEST - HTML input sanitized', true);

      } catch (error) {
        addResult('FAILING TEST - HTML input sanitized', false, error.message);
      }
    });

    it('FAILING TEST 20: Session not expired after long inactivity', async function() {
      try {
        log('Testing session expiration...');

        // Login first
        await driver.get(`${BASE_URL}/#/login`);
        await driver.wait(until.elementLocated(By.css('form')), 10000);

        const emailInput = await driver.findElement(By.css('form input[type="email"]'));
        const passwordInput = await driver.findElement(By.css('form input[type="password"]'));

        await emailInput.sendKeys('akashranga27@gmail.com');
        await passwordInput.sendKeys('123456');

        const buttons = await driver.findElements(By.css('form button'));
        for (const button of buttons) {
          const text = await button.getText();
          if (text.toLowerCase().includes('login')) {
            await button.click();
            break;
          }
        }

        await driver.wait(until.urlContains('dashboard'), 15000);

        // Simulate long inactivity (wait 2 minutes - but we'll just check if session has expiry)
        await driver.sleep(2000);

        // Check if session has expiration
        const sessionData = await driver.executeScript(() => {
          const user = localStorage.getItem('user');
          const token = localStorage.getItem('token');
          return { hasUser: !!user, hasToken: !!token };
        });

        // If session never expires, it's a vulnerability
        if (sessionData.hasUser && sessionData.hasToken) {
          // Check if we can access dashboard after "long" time
          await driver.get(`${BASE_URL}/#/candidate/dashboard`);
          await driver.sleep(1000);

          const currentUrl = await driver.getCurrentUrl();
          if (currentUrl.includes('dashboard')) {
            throw new Error('Session never expires - no inactivity timeout!');
          }
        }

        addResult('FAILING TEST - Session has expiration', true);

      } catch (error) {
        addResult('FAILING TEST - Session has expiration', false, error.message);
      }
    });
  });
});