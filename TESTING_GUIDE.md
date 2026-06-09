# Panel Import Testing Guide

## Test Scenario 1: Import Valid Panel Members

### Sample Data
```
full_name,email,password,role,hr_panelists_name,hr_panelist_grade,hr_panel_mobile,tag_coordinator,slots,team_link,interview_type
Rajesh Kumar,rajesh.kumar@example.com,Password123!,panel,Rajesh Kumar,Senior Manager,9876543210,Coordinator A,5-10,https://teams.microsoft.com/test1,Technical Round
Priya Singh,priya.singh@example.com,SecurePass456#,panel,Priya Singh,Manager,9876543211,Coordinator B,10-15,https://teams.microsoft.com/test2,HR Round
Amit Patel,amit.patel@example.com,MyPassword789$,panel,Amit Patel,Lead,9876543212,Coordinator C,15-20,https://teams.microsoft.com/test3,Final Round
```

### Expected Result
```
{
  "status": "success",
  "message": "Import completed. 3 records imported, 0 failed.",
  "imported_count": 3,
  "failed_count": 0,
  "errors": []
}
```

### Database Verification
1. Check `users` table for 3 new records with role='panel'
2. Check `panels` table for 3 new records with hr_panelists_name, hr_panelist_grade, etc.

---

## Test Scenario 2: Import with Duplicate Email

### Sample Data
```
full_name,email,password,role,hr_panelists_name,hr_panelist_grade,hr_panel_mobile,tag_coordinator,slots,team_link,interview_type
Rajesh Kumar,rajesh.kumar@example.com,Password123!,panel,Rajesh Kumar,Senior Manager,9876543210,Coordinator A,5-10,https://teams.microsoft.com/test1,Technical Round
Duplicate User,rajesh.kumar@example.com,DifferentPass123!,panel,Duplicate,Manager,9876543220,Coordinator B,10-15,https://teams.microsoft.com/test2,HR Round
```

### Expected Result
```
{
  "status": "partial",
  "message": "Import completed. 1 records imported, 1 failed.",
  "imported_count": 1,
  "failed_count": 1,
  "errors": [
    {
      "row": 3,
      "error": "Email rajesh.kumar@example.com already exists"
    }
  ]
}
```

---

## Test Scenario 3: Import with Missing Required Fields

### Sample Data
```
full_name,email,password,role,hr_panelists_name,hr_panelist_grade,hr_panel_mobile,tag_coordinator,slots,team_link,interview_type
Rajesh Kumar,rajesh.kumar@example.com,Password123!,panel,Rajesh Kumar,Senior Manager,9876543210,Coordinator A,5-10,https://teams.microsoft.com/test1,Technical Round
,priya.singh@example.com,SecurePass456#,panel,Priya Singh,Manager,9876543211,Coordinator B,10-15,https://teams.microsoft.com/test2,HR Round
Amit Patel,,MyPassword789$,panel,Amit Patel,Lead,9876543212,Coordinator C,15-20,https://teams.microsoft.com/test3,Final Round
```

### Expected Result
```
{
  "status": "partial",
  "message": "Import completed. 1 records imported, 2 failed.",
  "imported_count": 1,
  "failed_count": 2,
  "errors": [
    {
      "row": 3,
      "error": "Missing required fields: full_name, email, or password"
    },
    {
      "row": 4,
      "error": "Missing required fields: full_name, email, or password"
    }
  ]
}
```

---

## Test Scenario 4: Import with Optional Fields Empty

### Sample Data
```
full_name,email,password,role,hr_panelists_name,hr_panelist_grade,hr_panel_mobile,tag_coordinator,slots,team_link,interview_type
Rajesh Kumar,rajesh.kumar@example.com,Password123!,panel,,,,,,
Priya Singh,priya.singh@example.com,SecurePass456#,panel,Priya Singh,Manager,9876543211,Coordinator B,,
```

### Expected Result
```
{
  "status": "success",
  "message": "Import completed. 2 records imported, 0 failed.",
  "imported_count": 2,
  "failed_count": 0,
  "errors": []
}
```

### Database Verification
- Optional fields should be NULL in database
- User records should still be created successfully

---

## Manual Testing Steps

### 1. Download Template
1. Navigate to: `http://localhost:8189/interview_assist/admin/panels`
2. Click "Template" button
3. Verify Excel file downloads with:
   - Header row with column names
   - Sample data rows
   - Instructions sheet
   - Proper formatting and colors

### 2. Test Valid Import
1. Open the downloaded template
2. Add 2-3 panel members with all required fields
3. Click "Import Excel" button
4. Select the file
5. Verify success message appears
6. Check admin panels page refreshes with new members

### 3. Test Error Handling
1. Create file with duplicate emails
2. Create file with missing required fields
3. Click "Import Excel" for each
4. Verify appropriate error messages display
5. Verify row numbers in error messages are accurate

### 4. Database Verification
After each import, verify:
```sql
-- Check users created
SELECT * FROM users WHERE email LIKE 'rajesh.kumar%';

-- Check panels created
SELECT * FROM panels WHERE hr_panelists_name IS NOT NULL;

-- Verify relationship
SELECT u.full_name, u.email, u.role, p.hr_panelists_name, p.interview_type
FROM users u
LEFT JOIN panels p ON u.id = p.id
WHERE u.role = 'panel';
```

---

## API Endpoint Testing

### Download Template
```bash
curl -X GET http://localhost:8189/admin/download-panel-template \
  -H "Content-Type: application/json" \
  -o template.xlsx
```

### Import File
```bash
curl -X POST http://localhost:8189/admin/import-panels \
  -H "admin_email: admin@example.com" \
  -F "file=@panel_data.xlsx"
```

---

## Performance Considerations

- **Small Import** (1-10 records): < 1 second
- **Medium Import** (10-100 records): < 5 seconds
- **Large Import** (100-1000 records): < 30 seconds

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Email already exists" | Duplicate email in system | Use unique email or update existing user |
| "Missing required fields" | Empty cell in A, B, or C column | Fill all required fields |
| File not accepted | Wrong file format | Save as .xlsx Excel format |
| Upload fails silently | Server error | Check browser console and server logs |
| Records not appearing | Import partial success | Check error details provided |

---

## Checklist for Live Deployment

- [ ] Backend service running
- [ ] ExcelService module imported correctly
- [ ] Admin routes endpoints accessible
- [ ] Excel template downloads successfully
- [ ] File upload handler configured
- [ ] Error messages display properly
- [ ] Database records created correctly
- [ ] Email validation working
- [ ] User records created with hashed passwords
- [ ] Panel records linked correctly
