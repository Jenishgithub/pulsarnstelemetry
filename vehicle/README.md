# Vehicle Service Dashboard

A modern, responsive web dashboard for tracking vehicle service records with real-time data fetching from Google Sheets.

## Features

- 🚗 Track vehicle service history
- 📊 Calculate average km per month and week
- 📈 Display days since last service
- 🎨 Dark theme UI with professional design
- 📱 Fully responsive design
- 🔄 Real-time data sync from Google Sheets

## Architecture

This dashboard uses **Google Apps Script** to create a serverless API endpoint that reads data from a private Google Sheet and exposes it as JSON.

### Why Google Apps Script?

- ✅ Keeps your Sheet private (only the API endpoint is public)
- ✅ No backend server needed
- ✅ Free hosting
- ✅ Easy to maintain and update
- ✅ Secure read-only access

## Setup Instructions

### Step 1: Create the Google Apps Script

1. Open your Google Sheet (make sure your spreadsheet table starts with first row and first column)
2. Go to **Extensions** → **Apps Script**
3. Replace the default code with the following:

```javascript
function doGet() {
  const sheet = SpreadsheetApp.openById("YOUR_SHEET_ID_HERE");
  const ws = sheet.getSheetByName("Sheet1"); // Change if your tab name is different
  const data = ws.getDataRange().getValues();
  
  const headers = data.shift();
  const result = data.map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify(result))
                       .setMimeType(ContentService.MimeType.JSON);
}
```

4. Replace `YOUR_SHEET_ID_HERE` with your actual Google Sheet ID

### Step 2: Deploy the Script

1. Click **Deploy** → **New deployment**
2. Select **Web App** as the deployment type
3. Configure the following:
   - **Execute as**: Your Google account
   - **Who has access**: Anyone
4. Click **Deploy**
5. Copy the generated deployment URL

### Step 3: Update the Dashboard

You get a URL like:
https://script.google.com/macros/s/xxxxxxx/exec

6. Use this URL in JavaScript:
fetch("https://script.google.com/macros/s/xxxxxxx/exec")
  .then(r => r.json())
  .then(data => loadTable(data));

Update the `csvUrl` variable in `vehicle/script.js` with your deployment URL:

```javascript
const csvUrl = "YOUR_DEPLOYMENT_URL_HERE";
```

## Project Structure

```
vehicle/
├── index.html           # Main dashboard HTML
├── script.js           # JavaScript logic (fetch & data processing)
├── styles.css          # Dashboard styling
├── css/
│   └── bootstrap.min.css  # Bootstrap framework
├── img/
│   └── user.jpg       # User avatar image
└── README.md          # This file
```

## Data Format

Your Google Sheet should have the following columns:

| Servicing Date | Service Center | Cost | Distance Covered (Km) | Engine Oil |
|---|---|---|---|---|
| 2021-09-13 | Bikers Depot | 2320 | 8285 | Petronas sprinta f700 |
| 2022-02-15 | Bikers Depot | 2500 | 10115 | Petronas sprinta f700 |

## Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with dark theme
- **JavaScript (ES6+)** - Data fetching and processing
- **Bootstrap 5** - Responsive layout
- **Font Awesome 5** - Icons
- **jQuery** - DOM manipulation and animations
- **Google Apps Script** - Serverless API

## How It Works

1. **Page Load**: `script.js` fetches data from the Google Apps Script endpoint
2. **Data Processing**: JSON response is parsed and processed
3. **Table Population**: `loadTable()` function populates the service records table
4. **Statistics Calculation**: `calculateAndUpdateStats()` computes:
   - Average km per month
   - Average km per week
   - Days since last service
5. **UI Update**: Statistics are displayed on the dashboard

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - Feel free to use this project for personal or commercial use.

## Support

For issues or questions, please open an issue on the repository.


✔️ Your Google Sheet remains private
✔️ Only the script accesses it
✔️ People cannot view your sheet
✔️ Your website can read the JSON