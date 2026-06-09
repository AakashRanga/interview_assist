# Sample Panel Import Data

## How to Use This File

This file provides sample CSV/Excel data that you can use to test or understand the import format.

## Sample Dataset 1: Minimal Required Fields Only

```
full_name,email,password,role
John Smith,john.smith@example.com,SecurePass123!,panel
Sarah Johnson,sarah.johnson@example.com,SecurePass456#,panel
Michael Chen,michael.chen@example.com,SecurePass789$,panel
Emily Rodriguez,emily.rodriguez@example.com,SecurePass101@,panel
David Park,david.park@example.com,SecurePass202#,panel
```

**Use Case**: Quick import with minimal data
**Result**: Creates 5 users and 5 basic panel records

---

## Sample Dataset 2: Complete Information (Recommended)

```
full_name,email,password,role,hr_panelists_name,hr_panelist_grade,hr_panel_mobile,tag_coordinator,slots,team_link,interview_type
Rajesh Kumar,rajesh.kumar@example.com,Password123!,panel,Rajesh Kumar,Senior Manager,+91-9876543210,Coordinator A,5-10,https://teams.microsoft.com/l/meetup-join/19:meeting_id1@thread.v2,Technical Round
Priya Singh,priya.singh@example.com,SecurePass456#,panel,Priya Singh,Manager,+91-9876543211,Coordinator B,10-15,https://teams.microsoft.com/l/meetup-join/19:meeting_id2@thread.v2,HR Round
Amit Patel,amit.patel@example.com,MyPassword789$,panel,Amit Patel,Lead,+91-9876543212,Coordinator C,15-20,https://teams.microsoft.com/l/meetup-join/19:meeting_id3@thread.v2,Final Round
Neha Desai,neha.desai@example.com,PassNeha@2024,panel,Neha Desai,Senior,+91-9876543213,Coordinator A,5-10,https://teams.microsoft.com/l/meetup-join/19:meeting_id4@thread.v2,Technical Round
Vikram Rao,vikram.rao@example.com,VikPass#2024,panel,Vikram Rao,Manager,+91-9876543214,Coordinator B,10-15,https://teams.microsoft.com/l/meetup-join/19:meeting_id5@thread.v2,HR Round
```

**Use Case**: Production import with all panel details
**Result**: Creates 5 fully configured panel members

---

## Sample Dataset 3: Multiple Roles

```
full_name,email,password,role,hr_panelists_name,hr_panelist_grade,hr_panel_mobile,tag_coordinator,slots,team_link,interview_type
Rajesh Kumar,rajesh.kumar@example.com,Password123!,panel,Rajesh Kumar,Senior Manager,+91-9876543210,Coordinator A,5-10,https://teams.microsoft.com/...,Technical
Admin User,admin.user@example.com,AdminPass123!,admin,Admin User,Director,+91-9999999999,Coordinator,All,https://teams.microsoft.com/...,Admin
HR Lead,hr.lead@example.com,HRPass456#,hr,HR Lead,Manager,+91-8888888888,Coordinator,10-15,https://teams.microsoft.com/...,HR
Technical Lead,tech.lead@example.com,TechPass789$,technical,Tech Lead,Senior Manager,+91-7777777777,Coordinator,15-20,https://teams.microsoft.com/...,Technical
```

**Use Case**: Import with different user roles
**Result**: Creates users with various roles

---

## Sample Dataset 4: Large Batch Import (25 members)

```
full_name,email,password,role,hr_panelists_name,hr_panelist_grade,hr_panel_mobile,tag_coordinator,slots,team_link,interview_type
Panel Member 1,panel1@example.com,Pass001@2024,panel,Panel Member 1,Senior,+91-9876543201,Coordinator A,5-10,https://teams.microsoft.com/...,Technical
Panel Member 2,panel2@example.com,Pass002@2024,panel,Panel Member 2,Manager,+91-9876543202,Coordinator B,10-15,https://teams.microsoft.com/...,HR
Panel Member 3,panel3@example.com,Pass003@2024,panel,Panel Member 3,Lead,+91-9876543203,Coordinator C,15-20,https://teams.microsoft.com/...,Final
Panel Member 4,panel4@example.com,Pass004@2024,panel,Panel Member 4,Senior,+91-9876543204,Coordinator A,5-10,https://teams.microsoft.com/...,Technical
Panel Member 5,panel5@example.com,Pass005@2024,panel,Panel Member 5,Manager,+91-9876543205,Coordinator B,10-15,https://teams.microsoft.com/...,HR
Panel Member 6,panel6@example.com,Pass006@2024,panel,Panel Member 6,Lead,+91-9876543206,Coordinator C,15-20,https://teams.microsoft.com/...,Final
Panel Member 7,panel7@example.com,Pass007@2024,panel,Panel Member 7,Senior,+91-9876543207,Coordinator A,5-10,https://teams.microsoft.com/...,Technical
Panel Member 8,panel8@example.com,Pass008@2024,panel,Panel Member 8,Manager,+91-9876543208,Coordinator B,10-15,https://teams.microsoft.com/...,HR
Panel Member 9,panel9@example.com,Pass009@2024,panel,Panel Member 9,Lead,+91-9876543209,Coordinator C,15-20,https://teams.microsoft.com/...,Final
Panel Member 10,panel10@example.com,Pass010@2024,panel,Panel Member 10,Senior,+91-9876543210,Coordinator A,5-10,https://teams.microsoft.com/...,Technical
Panel Member 11,panel11@example.com,Pass011@2024,panel,Panel Member 11,Manager,+91-9876543211,Coordinator B,10-15,https://teams.microsoft.com/...,HR
Panel Member 12,panel12@example.com,Pass012@2024,panel,Panel Member 12,Lead,+91-9876543212,Coordinator C,15-20,https://teams.microsoft.com/...,Final
Panel Member 13,panel13@example.com,Pass013@2024,panel,Panel Member 13,Senior,+91-9876543213,Coordinator A,5-10,https://teams.microsoft.com/...,Technical
Panel Member 14,panel14@example.com,Pass014@2024,panel,Panel Member 14,Manager,+91-9876543214,Coordinator B,10-15,https://teams.microsoft.com/...,HR
Panel Member 15,panel15@example.com,Pass015@2024,panel,Panel Member 15,Lead,+91-9876543215,Coordinator C,15-20,https://teams.microsoft.com/...,Final
Panel Member 16,panel16@example.com,Pass016@2024,panel,Panel Member 16,Senior,+91-9876543216,Coordinator A,5-10,https://teams.microsoft.com/...,Technical
Panel Member 17,panel17@example.com,Pass017@2024,panel,Panel Member 17,Manager,+91-9876543217,Coordinator B,10-15,https://teams.microsoft.com/...,HR
Panel Member 18,panel18@example.com,Pass018@2024,panel,Panel Member 18,Lead,+91-9876543218,Coordinator C,15-20,https://teams.microsoft.com/...,Final
Panel Member 19,panel19@example.com,Pass019@2024,panel,Panel Member 19,Senior,+91-9876543219,Coordinator A,5-10,https://teams.microsoft.com/...,Technical
Panel Member 20,panel20@example.com,Pass020@2024,panel,Panel Member 20,Manager,+91-9876543220,Coordinator B,10-15,https://teams.microsoft.com/...,HR
Panel Member 21,panel21@example.com,Pass021@2024,panel,Panel Member 21,Lead,+91-9876543221,Coordinator C,15-20,https://teams.microsoft.com/...,Final
Panel Member 22,panel22@example.com,Pass022@2024,panel,Panel Member 22,Senior,+91-9876543222,Coordinator A,5-10,https://teams.microsoft.com/...,Technical
Panel Member 23,panel23@example.com,Pass023@2024,panel,Panel Member 23,Manager,+91-9876543223,Coordinator B,10-15,https://teams.microsoft.com/...,HR
Panel Member 24,panel24@example.com,Pass024@2024,panel,Panel Member 24,Lead,+91-9876543224,Coordinator C,15-20,https://teams.microsoft.com/...,Final
Panel Member 25,panel25@example.com,Pass025@2024,panel,Panel Member 25,Senior,+91-9876543225,Coordinator A,5-10,https://teams.microsoft.com/...,Technical
```

**Use Case**: Large batch import (performance testing)
**Result**: Creates 25 panel members at once

---

## Sample Dataset 5: Mixed - Some with Full Data, Some Minimal

```
full_name,email,password,role,hr_panelists_name,hr_panelist_grade,hr_panel_mobile,tag_coordinator,slots,team_link,interview_type
Rajesh Kumar,rajesh.kumar@example.com,Password123!,panel,Rajesh Kumar,Senior Manager,+91-9876543210,Coordinator A,5-10,https://teams.microsoft.com/...,Technical Round
Quick Add 1,quickadd1@example.com,QuickPass123!,panel,,,,,
Mixed Data 3,mixeddata3@example.com,MixedPass456#,panel,Mixed Data 3,Manager,,Coordinator B,10-15,,HR Round
Quick Add 4,quickadd4@example.com,QuickPass789$,panel,,,,,
Complete 5,complete5@example.com,CompletePass@2024,panel,Complete 5,Lead,+91-9876543225,Coordinator C,15-20,https://teams.microsoft.com/...,Final Round
```

**Use Case**: Real-world scenario with varying data completeness
**Result**: Creates 5 members with mixed data levels

---

## Sample Dataset 6: Test Case - Different Grades

```
full_name,email,password,role,hr_panelists_name,hr_panelist_grade,hr_panel_mobile,tag_coordinator,slots,team_link,interview_type
Entry Level Member,entry@example.com,EntryPass123!,panel,Entry Level Member,Associate,+91-9000000001,Coordinator,5-10,https://teams.microsoft.com/...,Fresher Round
Junior Member,junior@example.com,JuniorPass456#,panel,Junior Member,Senior Associate,+91-9000000002,Coordinator,10-15,https://teams.microsoft.com/...,Junior Developer
Mid Level Member,midlevel@example.com,MidPass789$,panel,Mid Level Member,Manager,+91-9000000003,Coordinator,15-20,https://teams.microsoft.com/...,Senior Developer
Senior Member,senior@example.com,SeniorPass@2024,panel,Senior Member,Senior Manager,+91-9000000004,Coordinator,20-25,https://teams.microsoft.com/...,Tech Lead
Leadership Member,lead@example.com,LeadPass#2024,panel,Leadership Member,Director,+91-9000000005,Coordinator,25-30,https://teams.microsoft.com/...,Director Round
```

**Use Case**: Testing different seniority levels
**Result**: Creates members across all grades

---

## Conversion to Excel Format

To use these datasets in Excel:

1. **Open Excel** or LibreOffice Calc
2. **Create new spreadsheet**
3. **Copy the data** from above
4. **Paste into Excel**
5. **Save as** `panel_import_data.xlsx`
6. **Import** using the admin panel

### Excel Import Format Conversion

The header row should always be:
```
full_name | email | password | role | hr_panelists_name | hr_panelist_grade | hr_panel_mobile | tag_coordinator | slots | team_link | interview_type
```

---

## Password Guidelines

When creating sample data, use strong passwords:

✅ **Good Passwords**:
- `SecurePass123!` (12 chars, mixed case, number, special char)
- `Password2024#` (13 chars, mixed case, number, special char)
- `Admin@Pass789` (13 chars, mixed case, number, special char)
- `Panel#2024Secure` (15 chars, mixed case, number, special char)

❌ **Weak Passwords**:
- `password123` (no special char)
- `12345678` (only numbers)
- `abcdefgh` (only letters)
- `Pass1` (too short)

---

## Phone Number Formats

Use international format with country code:
- India: `+91-XXXXXXXXXX`
- US: `+1-XXXXXXXXXX`
- UK: `+44-XXXXXXXXXX`

Or simple format:
- `9876543210`
- `(555) 123-4567`

---

## Interview Types (Common Values)

- Technical Round
- HR Round
- Managerial Round
- Final Round
- Screening
- Coding Round
- System Design
- Behavioral

---

## Coordinator Names (Common Values)

- Coordinator A
- Coordinator B
- Coordinator C
- Central Coordinator
- Regional Coordinator
- Front Desk

---

## Available Slots Format (Common Values)

- `5-10` (5 to 10 slots)
- `10-15` (10 to 15 slots)
- `15-20` (15 to 20 slots)
- `20+` (20 or more)
- `1` (single slot)

---

## User Roles Available

- `panel` (Interview panelist) - Default
- `admin` (Administrator)
- `hr` (HR staff)
- `technical` (Technical staff)
- `candidate` (Job candidate)

---

## Notes

- All sample data is fictional and for testing purposes
- Emails in samples are not real
- Passwords in samples are examples only
- Phone numbers are in valid format but fictional
- Team links are placeholders and should be real URLs
- Replace placeholders with actual data before production use

---

**Created**: 2026-06-08
**Purpose**: Sample data reference for panel import testing
**Status**: Ready for use
