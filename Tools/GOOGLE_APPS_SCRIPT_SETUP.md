# Google Apps Script Setup Guide

## Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new sheet named "Portfolio Submissions"
3. Add headers in row 1: `Timestamp | Name | Email | Message`

## Step 2: Create Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Create new project
3. Replace all code with this:

```javascript
// Google Apps Script Code
const SHEET_ID = "YOUR_SHEET_ID"; // Copy from URL: docs.google.com/spreadsheets/d/{SHEET_ID}
const EMAIL = "alokk298690@gmail.com"; // Your email

function doPost(e) {
  try {
    const params = e.parameter;
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Save to Google Sheet
    sheet.appendRow([
      new Date().toLocaleString('en-IN'),
      params.name || '',
      params.email || '',
      params.message || ''
    ]);
    
    // Send email notification
    GmailApp.sendEmail(
      EMAIL,
      `New Portfolio Inquiry from ${params.name}`,
      `Name: ${params.name}\nEmail: ${params.email}\nMessage:\n${params.message}`
    );
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: 'Form submitted successfully!' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Step 3: Deploy Script
1. Click **Deploy** → **New deployment**
2. Select type: **Web app**
3. Execute as: Your account
4. Who has access: **Anyone**
5. Click **Deploy**
6. Copy the deployment URL (looks like: `https://script.google.com/macros/d/{DEPLOYMENT_ID}/userweb`)

## Step 4: Update Your Portfolio
Replace `YOUR_DEPLOYMENT_URL` in your form's action attribute with the URL from Step 3.

Your form action should look like:
```
action="https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/userweb"
```

Done! Test by submitting the form.
