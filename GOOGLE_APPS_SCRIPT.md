# Google Sheets Integration Guide & Apps Script Template

This file contains the production-ready Google Apps Script template and step-by-step instructions to connect the National Alliance React frontend to a target Google Spreadsheet.

---

## Part 1: Spreadsheet Configuration

1. Create a new **Google Sheet**.
2. Rename the default sheet/tab or create two tabs with these **exact names**:
   * **`Service Issues`** (for community reports)
   * **`Volunteers`** (for member registrations)
3. Set up the column headers in the first row of each tab:

### Tab 1: `Service Issues`
Place these headers in row 1 (Columns A to G):
* **Column A:** `Timestamp`
* **Column B:** `Reporter`
* **Column C:** `Ward/Area`
* **Column D:** `Issue Type`
* **Column E:** `Urgency`
* **Column F:** `Description`
* **Column G:** `Status`

### Tab 2: `Volunteers`
Place these headers in row 1 (Columns A to G):
* **Column A:** `Timestamp`
* **Column B:** `Full Name`
* **Column C:** `Email`
* **Column D:** `Cell Number`
* **Column E:** `Ward/Area`
* **Column F:** `Primary Contribution Skill`
* **Column G:** `Membership ID`

---

## Part 2: Google Apps Script Code

1. Inside your Google Sheet, click **Extensions** > **Apps Script**.
2. Delete any default code in the editor (`Code.gs`) and paste the script below:

```javascript
/**
 * National Alliance NMB - Form Integration Webhook
 * Handles incoming POST requests from the React Frontend to log form data.
 */

function doPost(e) {
  try {
    // 1. Parse incoming payload
    const postData = JSON.parse(e.postData.contents);
    const formType = postData.formType;
    const timestamp = postData.timestamp || new Date().toISOString();

    // 2. Open the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (formType === "issue") {
      // Access the Service Issues sheet
      const sheet = ss.getSheetByName("Service Issues");
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: "Tab 'Service Issues' not found."
        })).setMimeType(ContentService.MimeType.JSON);
      }

      // Extract payload properties
      const reporter = postData.submittedBy || "Anonymous";
      const ward = postData.ward || "";
      const issueType = postData.issueType || "";
      const urgency = postData.urgency || "medium";
      const description = postData.description || "";
      const status = "submitted";

      // Append row to Google Sheet
      sheet.appendRow([
        timestamp,
        reporter,
        ward,
        issueType,
        urgency,
        description,
        status
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Successfully logged service issue report."
      })).setMimeType(ContentService.MimeType.JSON);

    } else if (formType === "volunteer") {
      // Access the Volunteers sheet
      const sheet = ss.getSheetByName("Volunteers");
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: "Tab 'Volunteers' not found."
        })).setMimeType(ContentService.MimeType.JSON);
      }

      // Extract payload properties
      const name = postData.name || "";
      const email = postData.email || "";
      const phone = postData.phone || "";
      const ward = postData.ward || "";
      const skill = postData.skill || "";
      const membershipId = postData.membershipId || "";

      // Append row to Google Sheet
      sheet.appendRow([
        timestamp,
        name,
        email,
        phone,
        ward,
        skill,
        membershipId
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Successfully logged new volunteer registration."
      })).setMimeType(ContentService.MimeType.JSON);

    } else {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Invalid or unsupported formType specified."
      })).setMimeType(ContentService.MimeType.JSON);
    }

  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle simple HTTP GET requests (useful for sanity/health checking)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "National Alliance NMB Google Sheets integration endpoint is active."
  })).setMimeType(ContentService.MimeType.JSON);
}
```

---

## Part 3: Deploying the Web App

1. Click the **Deploy** button in the top right corner of the Apps Script interface.
2. Select **New deployment**.
3. Under "Select type" (gear icon), choose **Web app**.
4. Configure the following parameters:
   * **Description:** `National Alliance Form Webhook`
   * **Execute as:** `Me (your-email@gmail.com)`
   * **Who has access:** `Anyone` (This is critical to allow submissions from the website without authenticating visitors' individual Google accounts).
5. Click **Deploy**.
6. Google will request you to **Authorize Access**. Click **Authorize access**, log in with your account, click **Advanced**, and then click **Go to Untitled project (unsafe)** or **Go to [Project Name]** to confirm permissions.
7. Once deployed, copy the generated **Web app URL**. It will look like this:
   ```text
   https://script.google.com/macros/s/AKfycb.../exec
   ```

---

## Part 4: Saving Endpoint in AI Studio/Local Environment

To make the website connect to your Google Sheet:
1. Copy the Web App URL from Part 3.
2. Open your project settings or `.env` file and set the value:
   ```env
   VITE_APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycb.../exec"
   ```
3. Restart your dev server. The app's submission flows will automatically route to Google Sheets!
