# Panel Members Import Guide

## Overview
The Panel Members Import feature allows you to bulk import panel members from an Excel file. Panel members (panelists) are interviewers who conduct interviews for candidates.

## How to Use

### Step 1: Download the Template
1. Go to the Admin Dashboard → **Panels** page
2. Click the **"Template"** button to download the Excel template file
3. The template will be saved as `panel_import_template.xlsx`

### Step 2: Fill in the Template

#### Required Fields (Marked with *)
These fields **MUST** be filled for each panel member:

| Column | Field Name | Description | Example |
|--------|-----------|-------------|---------|
| A | **full_name*** | Complete name of the panel member | Rajesh Kumar |
| B | **email*** | Valid, unique email address | rajesh.kumar@example.com |
| C | **password*** | Initial login password (min 8 chars) | Password123! |

#### Optional Fields
These fields can be left empty if not applicable:

| Column | Field Name | Description | Example |
|--------|-----------|-------------|---------|
| D | role | User role (default: 'panel') | panel, hr, technical |
| E | hr_panelists_name | Name for HR round panelist | Rajesh Kumar |
| F | hr_panelist_grade | Grade/Level of the panelist | Senior Manager |
| G | hr_panel_mobile | Contact number | +91-9876543210 |
| H | tag_coordinator | Assigned coordinator | Coordinator A |
| I | slots | Available interview slots | 5-10, 10-15 |
| J | team_link | Microsoft Teams/Meeting link | https://teams.microsoft.com/... |
| K | interview_type | Type of interview round | Technical Round, HR Round |

### Step 3: Add Panel Members
1. Keep the header row as-is (do not modify it)
2. Add one panel member per row
3. Fill in all required fields (columns A, B, C)
4. Fill optional fields if you have the information
5. Leave optional cells empty if data is not available

### Sample Data
The template includes 3 sample entries to show the format. You can:
- Delete these rows and add your own data
- Keep them as reference and add more rows below

### Step 4: Upload the File
1. Go back to the Admin Dashboard → **Panels** page
2. Click the **"Import Excel"** button
3. Select your filled Excel file
4. The system will process the file and create the panel members

## Important Rules & Restrictions

✅ **DO:**
- Use the provided template format exactly
- Ensure email addresses are unique (no duplicates)
- Use strong passwords (minimum 8 characters, mix of letters/numbers/special chars)
- Fill all three required fields (full_name, email, password)
- Put one panel member per row

❌ **DO NOT:**
- Modify the header row
- Leave required fields empty
- Use duplicate email addresses
- Use non-English characters in critical fields
- Exceed 1000 records per import

## File Requirements

- **Format**: `.xlsx` (Excel format)
- **Size**: Maximum 10 MB
- **Rows**: Maximum 1000 panel members per file
- **Columns**: Follow the exact column order from the template

## What Happens After Import

When you upload the file, the system will:

1. ✅ **Validate** all records
2. ✅ **Check** for duplicate emails
3. ✅ **Create user accounts** for each panel member
4. ✅ **Create panel records** with the provided information
5. ✅ **Generate a report** showing:
   - Total records imported
   - Number of failures
   - Details of any errors

## Understanding Import Results

### Success Message
```
Successfully imported 15 panel members
```

### Partial Success
```
Imported 14 records, 1 failed
```

### With Errors
```
Row 5: Email already exists
Row 8: Missing required field: password
```

## Example Excel Content

| full_name | email | password | role | hr_panelists_name | hr_panelist_grade | hr_panel_mobile | tag_coordinator | slots | team_link | interview_type |
|-----------|-------|----------|------|-------------------|-------------------|-----------------|-----------------|-------|-----------|-----------------|
| Rajesh Kumar | rajesh.kumar@example.com | Password123! | panel | Rajesh Kumar | Senior Manager | +91-9876543210 | Coordinator A | 5-10 | https://teams.microsoft.com/... | Technical Round |
| Priya Singh | priya.singh@example.com | SecurePass456# | panel | Priya Singh | Manager | +91-9876543211 | Coordinator B | 10-15 | https://teams.microsoft.com/... | HR Round |

## Troubleshooting

### Import Failed - "Email already exists"
**Cause:** The email is already registered in the system
**Solution:** Use a unique email address or check if the member already exists

### Import Failed - "Missing required fields"
**Cause:** One or more required fields (full_name, email, password) are empty
**Solution:** Ensure all three required fields have values

### Import Failed - "File format not supported"
**Cause:** The file is not in .xlsx format
**Solution:** Save the file as an Excel file (.xlsx) and try again

### No Records Imported
**Cause:** File might be empty or all records have errors
**Solution:** Check the template and add valid data

## Password Requirements

Initial passwords must meet these criteria:
- Minimum 8 characters long
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Should contain a special character for better security

**Examples of valid passwords:**
- `Panel@2024Secure`
- `Interview#Admin123`
- `Secure$Password99`

## Support

For issues or questions:
1. Check the import error details provided in the system
2. Verify all required fields are filled
3. Ensure email addresses are unique
4. Download a fresh template and try again
5. Contact your administrator if problems persist

---

**Note:** Panel members will receive their credentials (email and temporary password) and can log in to the Interview Assist system immediately after import.
