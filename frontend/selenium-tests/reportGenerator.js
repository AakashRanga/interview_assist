/**
 * Excel Report Generator for E2E Tests
 * Creates structured Excel report with auto-download to log folder
 */

const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

class ReportGenerator {
  constructor() {
    this.testResults = {
      passed: [],
      failed: [],
      steps: [],
      startTime: null,
      endTime: null
    };
    this.logFolder = path.join(__dirname, 'logs');
  }

  init() {
    this.testResults.startTime = new Date();
    // Create log folder if not exists
    if (!fs.existsSync(this.logFolder)) {
      fs.mkdirSync(this.logFolder, { recursive: true });
      console.log(`[REPORT] Created log folder: ${this.logFolder}`);
    }
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message };
    this.testResults.steps.push(logEntry);
    console.log(`[${timestamp}] [${level}] ${message}`);
  }

  addResult(testName, passed, error = null) {
    if (passed) {
      this.testResults.passed.push(testName);
      this.log(`✓ PASSED: ${testName}`, 'PASS');
    } else {
      this.testResults.failed.push({ testName, error });
      this.log(`✗ FAILED: ${testName} - ${error}`, 'FAIL');
    }
  }

  async generateExcelReport(testSuiteName = 'E2E Test') {
    this.testResults.endTime = new Date();
    const duration = this.testResults.endTime - this.testResults.startTime;
    const total = this.testResults.passed.length + this.testResults.failed.length;
    const passRate = total > 0 ? ((this.testResults.passed.length / total) * 100).toFixed(2) : '0.00';

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Selenium E2E Tests';
    workbook.created = new Date();

    // ========== SHEET 1: SUMMARY ==========
    const summarySheet = workbook.addWorksheet('Summary', {
      properties: { tabColor: { argb: '217346' } }
    });

    // Styling
    summarySheet.columns = [
      { header: 'Test Suite', key: 'suite', width: 30 },
      { header: 'Total Tests', key: 'total', width: 15 },
      { header: 'Passed', key: 'passed', width: 15 },
      { header: 'Failed', key: 'failed', width: 15 },
      { header: 'Pass Rate %', key: 'passRate', width: 15 },
      { header: 'Duration (sec)', key: 'duration', width: 18 },
      { header: 'Start Time', key: 'startTime', width: 25 },
      { header: 'End Time', key: 'endTime', width: 25 }
    ];

    // Add summary row
    summarySheet.addRow({
      suite: testSuiteName,
      total: total,
      passed: this.testResults.passed.length,
      failed: this.testResults.failed.length,
      passRate: passRate,
      duration: (duration / 1000).toFixed(2),
      startTime: this.testResults.startTime.toISOString(),
      endTime: this.testResults.endTime.toISOString()
    });

    // Style header row
    summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    summarySheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '217346' }
    };
    summarySheet.getRow(1).alignment = { horizontal: 'center' };

    // ========== SHEET 2: PASSED TESTS ==========
    const passedSheet = workbook.addWorksheet('Passed Tests', {
      properties: { tabColor: { argb: '00B050' } }
    });

    passedSheet.columns = [
      { header: 'No.', key: 'no', width: 8 },
      { header: 'Test Name', key: 'testName', width: 60 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Timestamp', key: 'timestamp', width: 25 }
    ];

    this.testResults.passed.forEach((test, index) => {
      passedSheet.addRow({
        no: index + 1,
        testName: test,
        status: 'PASSED',
        timestamp: new Date().toISOString()
      });
    });

    // Style header
    passedSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    passedSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '00B050' }
    };
    passedSheet.getRow(1).alignment = { horizontal: 'center' };

    // ========== SHEET 3: FAILED TESTS ==========
    const failedSheet = workbook.addWorksheet('Failed Tests', {
      properties: { tabColor: { argb: 'FF0000' } }
    });

    failedSheet.columns = [
      { header: 'No.', key: 'no', width: 8 },
      { header: 'Test Name', key: 'testName', width: 50 },
      { header: 'Error', key: 'error', width: 80 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Timestamp', key: 'timestamp', width: 25 }
    ];

    if (this.testResults.failed.length === 0) {
      failedSheet.addRow({
        no: '-',
        testName: 'No failures',
        error: '-',
        status: 'N/A',
        timestamp: '-'
      });
    } else {
      this.testResults.failed.forEach((test, index) => {
        failedSheet.addRow({
          no: index + 1,
          testName: test.testName,
          error: test.error,
          status: 'FAILED',
          timestamp: new Date().toISOString()
        });
      });
    }

    // Style header
    failedSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    failedSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0000' }
    };
    failedSheet.getRow(1).alignment = { horizontal: 'center' };

    // ========== SHEET 4: EXECUTION LOG ==========
    const logSheet = workbook.addWorksheet('Execution Log', {
      properties: { tabColor: { argb: '4472C4' } }
    });

    logSheet.columns = [
      { header: 'Timestamp', key: 'timestamp', width: 28 },
      { header: 'Level', key: 'level', width: 12 },
      { header: 'Message', key: 'message', width: 100 }
    ];

    this.testResults.steps.forEach(step => {
      logSheet.addRow({
        timestamp: step.timestamp,
        level: step.level,
        message: step.message
      });
    });

    // Style header
    logSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    logSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4472C4' }
    };
    logSheet.getRow(1).alignment = { horizontal: 'center' };

    // ========== SHEET 5: TEST DETAILS ==========
    const detailsSheet = workbook.addWorksheet('Test Details', {
      properties: { tabColor: { argb: 'FFC000' } }
    });

    detailsSheet.columns = [
      { header: 'No.', key: 'no', width: 8 },
      { header: 'Test Name', key: 'testName', width: 50 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Error Details', key: 'error', width: 80 }
    ];

    // Add all tests (passed + failed)
    let counter = 1;
    this.testResults.passed.forEach(test => {
      detailsSheet.addRow({
        no: counter++,
        testName: test,
        status: 'PASSED',
        error: '-'
      });
    });

    this.testResults.failed.forEach(test => {
      detailsSheet.addRow({
        no: counter++,
        testName: test.testName,
        status: 'FAILED',
        error: test.error
      });
    });

    // Style header
    detailsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    detailsSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFC000' }
    };
    detailsSheet.getRow(1).alignment = { horizontal: 'center' };

    // Save the workbook
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `E2E_Test_Report_${timestamp}.xlsx`;
    const filePath = path.join(this.logFolder, fileName);

    await workbook.xlsx.writeFile(filePath);

    console.log(`\n[REPORT] Excel report saved: ${filePath}`);
    console.log(`[REPORT] Log folder: ${this.logFolder}`);

    return {
      filePath,
      fileName,
      total,
      passed: this.testResults.passed.length,
      failed: this.testResults.failed.length,
      passRate,
      duration
    };
  }

  async generateAndPrint() {
    const report = await this.generateExcelReport('Candidate E2E Workflow');

    console.log('\n' + '='.repeat(60));
    console.log('             TEST EXECUTION COMPLETE');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${report.total}`);
    console.log(`Passed: ${report.passed}`);
    console.log(`Failed: ${report.failed}`);
    console.log(`Pass Rate: ${report.passRate}%`);
    console.log(`Duration: ${report.duration} seconds`);
    console.log(`\n📊 Report saved to: ${report.filePath}`);
    console.log('='.repeat(60) + '\n');

    return report;
  }
}

module.exports = new ReportGenerator();