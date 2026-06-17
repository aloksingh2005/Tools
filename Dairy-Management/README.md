# Milk Account Calculator

## Project Overview

The Milk Account Calculator is a web-based application designed to help dairy farmers and customers calculate their milk delivery accounts. It allows users to track delivery schedules, account for missed deliveries, calculate total quantities and costs, and generate reports for specific date ranges.

The application is particularly useful for:
- Dairy farmers tracking customer deliveries
- Customers monitoring their milk consumption and costs
- Managing accounts with customizable date ranges and delivery schedules

## File Structure

```
.
├── index.html      # Main HTML structure and UI elements
├── script.js       # JavaScript logic for calculations and functionality
└── styles.css      # CSS styling for the application
└── README.md       # This documentation file
```

## How to Run/Use the Project

1. **Setup**: Simply open `index.html` in any modern web browser
2. **Usage**:
   - Enter a date range (start and end dates in DD/MM/YY format)
   - Specify any missing delivery dates
   - Enter customer details (name, milk quantity per day, price per liter)
   - View automatically calculated results including:
     - Total days in the period
     - Number of missing delivery days
     - Actual delivery days
     - Total milk quantity delivered
     - Total cost
     - Potential earnings if no deliveries were missed
   - Export data as CSV or share via WhatsApp

## Key Features and Functionality

### Core Features
- **Date Range Management**: Set custom date ranges or use quick buttons for common periods (this month, last 30 days, last 7 days)
- **Delivery Tracking**: Account for missed delivery dates
- **Customer Management**: Save and switch between multiple customer profiles
- **Automatic Calculations**: Real-time calculation of delivery metrics
- **Sunday Delivery Exclusion**: One-click option to mark all Sundays as non-delivery days
- **Price Memory**: Remembers the last used price for convenience
- **Detailed Breakdown**: Toggle view for daily delivery details
- **Data Export**: Download account summaries as CSV files
- **Sharing**: Share account summaries via WhatsApp

### UI Components
- **Date Range Inputs**: Set start and end dates for calculation periods
- **Missing Dates Input**: Comma-separated list of dates with no delivery
- **Customer Management**: Add and switch between customer profiles
- **Milk Details**: Configure daily quantity and price per liter
- **Results Display**: Comprehensive summary of calculations
- **Daily Breakdown**: Detailed view of each day's delivery status
- **Export Options**: CSV download and WhatsApp sharing buttons

## Dependencies and Requirements

### Browser Requirements
- Modern web browser with JavaScript enabled
- localStorage support for data persistence

### External Libraries
- None (Vanilla JavaScript, HTML, and CSS only)

### Storage
- Uses browser localStorage to persist:
  - Customer profiles
  - Last used price
  - Previous calculations

## Technical Implementation Details

### HTML Structure
The application uses semantic HTML with a clean, card-based layout:
- Main container with responsive design
- Input cards for different configuration sections
- Results card with grid-based metrics display
- Daily breakdown section (toggleable)

### JavaScript Functionality
The application logic is organized around several key components:

#### Date Handling
- Custom date parsing and formatting functions for DD/MM/YY format
- Date range validation and calculation
- Automatic handling of date inclusivity

#### Customer Management
- localStorage-based customer profile system
- Add, switch, and save customer functionality
- Automatic loading of previously used customers

#### Calculation Engine
- Total days calculation (inclusive of start and end dates)
- Missing days identification and counting
- Delivery days calculation (total days minus missing days)
- Milk quantity and cost calculations
- Potential earnings calculation (if no deliveries were missed)

#### UI Features
- Real-time updates on input changes
- Quick date range buttons (this month, last 30 days, last 7 days)
- Sunday marking functionality
- Last price recall feature
- Daily breakdown generation
- Export and sharing capabilities

#### Data Persistence
- localStorage used for:
  - Customer profiles
  - Last used price
  - Current session data

### CSS Styling
The application features a modern, responsive design:
- Dark theme with gradient background
- Card-based layout with subtle animations
- Responsive grid for results display
- Mobile-friendly layout with media queries
- Smooth transitions and hover effects
- Consistent color scheme and typography

### Key Functions
- `parseDateDDMMYY()`: Custom date parsing for DD/MM/YY format
- `formatDateDDMMYY()`: Date formatting to DD/MM/YY format
- `updateResults()`: Main calculation function triggered on input changes
- `addCustomer()`: Customer profile creation
- `switchCustomer()`: Customer profile switching
- `markSundays()`: Automatic Sunday marking as non-delivery days
- `downloadCSV()`: Export functionality
- `shareWhatsApp()`: Sharing functionality
- `updateDailyBreakdown()`: Detailed daily view generation

### Data Flow
1. User inputs data through form elements
2. Input events trigger `updateResults()` function
3. Calculations are performed based on date ranges and inputs
4. Results are displayed in the results card
5. Customer data is saved to localStorage
6. Export functions generate CSV or WhatsApp share links

The application is designed to be self-contained with no external dependencies, making it easy to deploy and use in any environment with a modern web browser.
