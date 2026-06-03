const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

describe('Login Test', function () {

    this.timeout(30000);

    let driver;

    before(async () => {
        driver = await new Builder()
            .forBrowser('chrome')
            .build();
    });

    after(async () => {
        await driver.quit();
    });

    it('should login successfully', async () => {

        await driver.get('http://localhost:8189/interview_assist/login');

        // Wait for email field
        await driver.wait(
            until.elementLocated(By.id('email')),
            10000
        );

        // Enter email
        await driver.findElement(By.id('email'))
            .sendKeys('admin@gmail.com');

        // Enter password
        await driver.findElement(By.id('password'))
            .sendKeys('123456');

        // Click login button
        await driver.findElement(
            By.css('button[type="submit"]')
        ).click();

        // Wait for dashboard
        await driver.wait(
            until.urlContains('dashboard'),
            10000
        );

        console.log("Login successful");

    });

});