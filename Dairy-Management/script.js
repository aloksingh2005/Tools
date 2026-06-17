let lastPrice = localStorage.getItem('lastPrice') || 0;
let customers = JSON.parse(localStorage.getItem('customers')) || {};
let currentCustomer = '';

// Parse DD/MM/YY date
function parseDateDDMMYY(dateStr) {
    const [day, month, year] = dateStr.split('/').map(Number);
    if (!day || !month || !year || day < 1 || day > 31 || month < 1 || month > 12) return null;
    const fullYear = year < 100 ? 2000 + year : year;
    const date = new Date(fullYear, month - 1, day);
    return isNaN(date) ? null : date;
}

// Format Date to DD/MM/YY
function formatDateDDMMYY(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
}

function addCustomer() {
    const customerName = document.getElementById('customerName').value.trim();
    if (customerName && !customers[customerName]) {
        customers[customerName] = { startDate: '', endDate: '', missingDates: '', milkQty: 1, pricePerLiter: 0 };
        updateCustomerSelect();
        switchCustomer(customerName);
        localStorage.setItem('customers', JSON.stringify(customers));
    }
    updateResults();
}

function updateCustomerSelect() {
    const select = document.getElementById('customerSelect');
    select.innerHTML = '<option value="">Select Customer</option>';
    Object.keys(customers).forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    });
}

function switchCustomer(selectedName) {
    const customerName = selectedName || document.getElementById('customerSelect').value;
    if (customerName && customers[customerName]) {
        currentCustomer = customerName;
        const data = customers[customerName];
        document.getElementById('startDate').value = data.startDate;
        document.getElementById('endDate').value = data.endDate;
        document.getElementById('missingDates').value = data.missingDates;
        document.getElementById('milkQty').value = data.milkQty;
        document.getElementById('pricePerLiter').value = data.pricePerLiter;
        document.getElementById('currentCustomer').textContent = customerName;
        updateResults();
    }
}

function saveCustomerData() {
    if (currentCustomer) {
        customers[currentCustomer] = {
            startDate: document.getElementById('startDate').value || getDefaultStartDate(),
            endDate: document.getElementById('endDate').value || getDefaultEndDate(),
            missingDates: document.getElementById('missingDates').value,
            milkQty: parseFloat(document.getElementById('milkQty').value) || 1,
            pricePerLiter: parseFloat(document.getElementById('pricePerLiter').value) || 0
        };
        localStorage.setItem('customers', JSON.stringify(customers));
    }
}

function updateResults() {
    const startDateStr = document.getElementById('startDate').value || getDefaultStartDate();
    const endDateStr = document.getElementById('endDate').value || getDefaultEndDate();
    const missingDatesInput = document.getElementById('missingDates').value;
    const milkQty = parseFloat(document.getElementById('milkQty').value) || 1;
    const pricePerLiter = parseFloat(document.getElementById('pricePerLiter').value) || 0;

    const startDate = parseDateDDMMYY(startDateStr);
    const endDate = parseDateDDMMYY(endDateStr);

    if (!startDate || !endDate || startDate > endDate) {
        clearResults();
        return;
    }

    // Save last price and customer data
    if (pricePerLiter > 0) {
        localStorage.setItem('lastPrice', pricePerLiter);
        lastPrice = pricePerLiter;
    }
    saveCustomerData();

    // Calculate total days (inclusive)
    const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    // Parse missing dates
    const missingDates = missingDatesInput
        .split(',')
        .map(date => date.trim())
        .map(parseDateDDMMYY)
        .filter(date => date && date >= startDate && date <= endDate);
    const missingDays = missingDates.length;

    // Calculate delivery days
    const deliveryDays = totalDays - missingDays;

    // Calculate total milk and cost
    const totalMilk = deliveryDays * milkQty;
    const totalCost = totalMilk * pricePerLiter;
    const potentialCost = totalDays * milkQty * pricePerLiter;

    // Update UI
    document.getElementById('totalDays').textContent = totalDays;
    document.getElementById('missingDays').textContent = missingDays;
    document.getElementById('deliveryDays').textContent = deliveryDays;
    document.getElementById('totalMilk').textContent = `${totalMilk.toFixed(2)} liters`;
    document.getElementById('totalCost').textContent = `$${totalCost.toFixed(2)}`;
    document.getElementById('potentialCost').textContent = `$${potentialCost.toFixed(2)}`;

    // Daily Breakdown
    updateDailyBreakdown(startDate, endDate, missingDates, milkQty, pricePerLiter);
}

function clearResults() {
    document.getElementById('totalDays').textContent = '0';
    document.getElementById('missingDays').textContent = '0';
    document.getElementById('deliveryDays').textContent = '0';
    document.getElementById('totalMilk').textContent = '0 liters';
    document.getElementById('totalCost').textContent = '$0';
    document.getElementById('potentialCost').textContent = '$0';
    document.getElementById('dailyDetails').innerHTML = '';
}

function getDefaultStartDate() {
    const date = new Date();
    date.setDate(1); // First of current month
    return formatDateDDMMYY(date);
}

function getDefaultEndDate() {
    return formatDateDDMMYY(new Date()); // Today
}

function setThisMonth() {
    document.getElementById('startDate').value = getDefaultStartDate();
    document.getElementById('endDate').value = getDefaultEndDate();
    updateResults();
}

function setLast30Days() {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 29); // 30 days inclusive
    document.getElementById('startDate').value = formatDateDDMMYY(start);
    document.getElementById('endDate').value = formatDateDDMMYY(end);
    updateResults();
}

function setLast7Days() {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6); // 7 days inclusive
    document.getElementById('startDate').value = formatDateDDMMYY(start);
    document.getElementById('endDate').value = formatDateDDMMYY(end);
    updateResults();
}

function markSundays() {
    const startDate = parseDateDDMMYY(document.getElementById('startDate').value || getDefaultStartDate());
    const endDate = parseDateDDMMYY(document.getElementById('endDate').value || getDefaultEndDate());
    if (!startDate || !endDate) return;

    const sundays = [];
    let current = new Date(startDate);
    while (current <= endDate) {
        if (current.getDay() === 0) { // Sunday
            sundays.push(formatDateDDMMYY(current));
        }
        current.setDate(current.getDate() + 1);
    }
    document.getElementById('missingDates').value = sundays.join(', ');
    updateResults();
}

function useLastPrice() {
    document.getElementById('pricePerLiter').value = lastPrice;
    updateResults();
}

function updateDailyBreakdown(startDate, endDate, missingDates, milkQty, pricePerLiter) {
    const details = document.getElementById('dailyDetails');
    details.innerHTML = '';
    let current = new Date(startDate);
    let html = '<h4>Daily Breakdown</h4><ul>';
    while (current <= endDate) {
        const dateStr = formatDateDDMMYY(current);
        const isMissing = missingDates.some(d => d.toDateString() === current.toDateString());
        const qty = isMissing ? 0 : milkQty;
        const cost = qty * pricePerLiter;
        html += `<li>${dateStr}: ${qty.toFixed(2)} L, $${cost.toFixed(2)}</li>`;
        current.setDate(current.getDate() + 1);
    }
    html += '</ul>';
    details.innerHTML = html;
}

function toggleDetails() {
    const details = document.getElementById('dailyDetails');
    const toggleBtn = document.getElementById('detailsToggle');
    details.style.display = details.style.display === 'none' ? 'block' : 'none';
    toggleBtn.textContent = details.style.display === 'none' ? 'Show Daily Breakdown' : 'Hide Daily Breakdown';
}

function downloadCSV() {
    const startDate = document.getElementById('startDate').value || getDefaultStartDate();
    const endDate = document.getElementById('endDate').value || getDefaultEndDate();
    const missingDates = document.getElementById('missingDates').value;
    const milkQty = document.getElementById('milkQty').value;
    const pricePerLiter = document.getElementById('pricePerLiter').value;

    let csv = 'Field,Value\n';
    csv += `Customer Name,${currentCustomer || 'Unknown'}\n`;
    csv += `Start Date,${startDate}\n`;
    csv += `End Date,${endDate}\n`;
    csv += `Missing Dates,${missingDates || 'None'}\n`;
    csv += `Milk Quantity per Day (L),${milkQty}\n`;
    csv += `Price per Liter,${pricePerLiter}\n`;
    csv += `Total Days,${document.getElementById('totalDays').textContent}\n`;
    csv += `Missing Days,${document.getElementById('missingDays').textContent}\n`;
    csv += `Delivery Days,${document.getElementById('deliveryDays').textContent}\n`;
    csv += `Total Milk Delivered,${document.getElementById('totalMilk').textContent}\n`;
    csv += `Total Cost,${document.getElementById('totalCost').textContent}\n`;
    csv += `Potential Earnings,${document.getElementById('potentialCost').textContent}\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `milk_account_${currentCustomer || 'summary'}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function shareWhatsApp() {
    const text = `Milk Account Summary for ${currentCustomer || 'Customer'}\n` +
        `Start: ${document.getElementById('startDate').value || getDefaultStartDate()}\n` +
        `End: ${document.getElementById('endDate').value || getDefaultEndDate()}\n` +
        `Missing Dates: ${document.getElementById('missingDates').value || 'None'}\n` +
        `Total Milk: ${document.getElementById('totalMilk').textContent}\n` +
        `Total Cost: ${document.getElementById('totalCost').textContent}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    setThisMonth(); // Auto-fill with current month
    updateCustomerSelect();
    if (Object.keys(customers).length > 0) {
        switchCustomer(Object.keys(customers)[0]); // Load first customer
    }
});