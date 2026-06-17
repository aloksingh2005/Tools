(() => {
const APP_NAME = 'TimeBook';
const CURRENCY_SYMBOL = '₹';
const RATE_CONFIG = {
    hourly: parseInt(localStorage.getItem('fixed_hourly_rate') || '120', 10),
    minute: parseInt(localStorage.getItem('fixed_minute_rate') || '2', 10)
};

// Supabase Client Reference
let supabase = null;

// DOM Elements
const DOM = {
    hardRefresh: document.getElementById('hardRefresh'),
    themeToggle: document.getElementById('themeToggle'),
    paletteSelect: document.getElementById('paletteSelect'),
    body: document.body,
    toggleSidebar: document.getElementById('toggleSidebar'),
    sidebar: document.getElementById('sidebar'),
    sidebarOverlay: document.getElementById('sidebarOverlay'),
    navLinks: document.querySelectorAll('[data-nav]'),
    liveClock: document.getElementById('liveClock'),
    customerSelect: document.getElementById('customerSelect'),
    startTimeInput: document.getElementById('startTime'),
    endTimeInput: document.getElementById('endTime'),
    addTransactionBtn: document.getElementById('addTransaction'),
    exportJSONBtn: document.getElementById('exportJSON'),
    importDataInput: document.getElementById('importData'),
    historySearch: document.getElementById('historySearch'),
    clearSearchBtn: document.getElementById('clearSearch'),
    historyList: document.getElementById('historyList'),
    historyStartDate: document.getElementById('historyStartDate'),
    historyEndDate: document.getElementById('historyEndDate'),
    historySort: document.getElementById('historySort'),
    historyPrev: document.getElementById('historyPrev'),
    historyNext: document.getElementById('historyNext'),
    historyPageInfo: document.getElementById('historyPageInfo'),
    customerNameInput: document.getElementById('customerName'),
    customerContactInput: document.getElementById('customerContact'),
    addCustomerBtn: document.getElementById('addCustomer'),
    customerSearch: document.getElementById('customerSearch'),
    clearCustomerSearchBtn: document.getElementById('clearCustomerSearch'),
    customerList: document.getElementById('customerList'),
    analyticsDashboard: document.getElementById('analyticsDashboard'),
    actionModal: document.getElementById('actionModal'),
    modalMessage: document.getElementById('modalMessage'),
    editForm: document.getElementById('editForm'),
    editField: document.getElementById('editField'),
    confirmAction: document.getElementById('confirmAction'),
    cancelAction: document.getElementById('cancelAction'),
    rateType: document.getElementById('rateType'),
    rateDisplay: document.getElementById('rateDisplay'),
    calcDuration: document.getElementById('calcDuration'),
    calcRate: document.getElementById('calcRate'),
    calcAmount: document.getElementById('calcAmount'),
    bulkActions: document.getElementById('bulkActions'),
    bulkAddBtn: document.getElementById('bulkAddBtn'),
    selectedCount: document.getElementById('selectedCount'),
    historyCustomerFilter: document.getElementById('historyCustomerFilter'),
    historySummary: document.getElementById('historySummary'),
    bulkDeleteBtn: document.getElementById('bulkDeleteBtn'),
    sessionNotes: document.getElementById('sessionNotes')
};

// State
const state = {
    transactions: [],
    customers: [],
    actionTarget: null,
    selectedTransactions: new Set(),
    historyPage: 1,
    backendOnline: false,
    calculatorMode: 'duration' // default mode
};

function normalizeId(value) {
    if (value === null || value === undefined) return '';
    return String(value).trim();
}

function idsEqual(a, b) {
    const left = normalizeId(a);
    const right = normalizeId(b);
    return Boolean(left && right && left === right);
}

function getCustomerIdFromURL() {
    const rawId = new URLSearchParams(window.location.search).get('id');
    return normalizeId(rawId);
}

function refreshCustomerDetailsPage() {
    if (document.body?.dataset?.page !== 'customer-details') return;
    const customerId = getCustomerIdFromURL();
    const card = document.getElementById('customerDetailsCard');
    if (!card) return;
    if (!customerId) {
        card.innerHTML = '<div class="empty-state"><div class="empty-state-title">Invalid customer link</div></div>';
        return;
    }
    const customer = state.customers.find(c => idsEqual(c.id, customerId));
    if (!customer) {
        card.innerHTML = '<div class="empty-state"><div class="empty-state-title">Customer not found</div><div class="empty-state-text">This customer may have been removed.</div></div>';
        return;
    }
    renderCustomerDetailsCard(customer, card);
}

function hasSupabaseConfig() {
    const url = String(window.ENV_SUPABASE_URL || '').trim();
    const key = String(window.ENV_SUPABASE_KEY || '').trim();
    return Boolean(url && key);
}

// Database Initializer
function initSupabase() {
    let url = window.ENV_SUPABASE_URL || '';
    let key = window.ENV_SUPABASE_KEY || '';

    if (url && key) {
        try {
            supabase = window.supabase.createClient(url, key);
            state.backendOnline = true;
        } catch (e) {
            console.error('Supabase initialization failed:', e);
            supabase = null;
            state.backendOnline = false;
        }
    } else {
        supabase = null;
        state.backendOnline = false;
    }
}

// Database Connection Check
async function checkSupabaseConnection() {
    const statusEl = document.getElementById('connectionStatus');
    if (!statusEl) return;

    let url = window.ENV_SUPABASE_URL || '';
    let key = window.ENV_SUPABASE_KEY || '';

    if (!url || !key) {
        statusEl.innerHTML = '<i class="fas fa-exclamation-triangle" style="color:var(--danger)"></i> Disconnected (Credentials missing)';
        statusEl.style.color = 'var(--danger)';
        state.backendOnline = false;
        return;
    }

    if (!supabase) {
        initSupabase();
    }

    if (!supabase) {
        statusEl.innerHTML = '<i class="fas fa-exclamation-triangle" style="color:var(--danger)"></i> Initialization Failed';
        statusEl.style.color = 'var(--danger)';
        state.backendOnline = false;
        return;
    }

    try {
        statusEl.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Checking...';
        statusEl.style.color = 'var(--text-secondary)';

        // Quick query to verify credentials and connection
        const { error } = await supabase.from('customers').select('id').limit(1);
        if (error) throw error;

        statusEl.innerHTML = '<i class="fas fa-check-circle" style="color:var(--success)"></i> Connected';
        statusEl.style.color = 'var(--success)';
        state.backendOnline = true;
    } catch (e) {
        console.error('Supabase connection check failed:', e);
        statusEl.innerHTML = '<i class="fas fa-times-circle" style="color:var(--danger)"></i> Connection Error';
        statusEl.style.color = 'var(--danger)';
        state.backendOnline = false;
    }
}

// Database Mapping Helpers
function fromDbCustomer(c) {
    return {
        id: c.id,
        name: c.name,
        mobile: c.phone || '', // phone in DB is mobile in app state
        created_at: c.created_at
    };
}

function toDbCustomer(c) {
    return {
        name: c.name,
        phone: c.mobile || null // mobile in app state is phone in DB
    };
}

function fromDbCalculation(c) {
    const totalMinutes = (c.hours || 0) * 60 + (c.minutes || 0);
    return {
        id: c.id,
        customerId: normalizeId(c.customer_id),
        start: new Date(c.start_time),
        end: new Date(c.end_time),
        date: new Date(c.created_at || c.start_time),
        durationMinutes: totalMinutes,
        duration: {
            hours: c.hours || 0,
            minutes: c.minutes || 0,
            totalMinutes
        },
        rateType: c.rate_type,
        rateAmount: parseFloat(c.rate_amount) || 0,
        amount: parseFloat(c.total_amount) || 0,
        currency: CURRENCY_SYMBOL,
        combined: Boolean(c.combined),
        timeSlots: c.time_slots,
        paymentStatus: c.payment_status || 'due',
        paymentStatusUpdatedAt: c.payment_status_updated_at ? new Date(c.payment_status_updated_at) : null,
        notes: c.notes || '',
        deviceType: c.device_type || ''
    };
}

function toDbCalculation(t) {
    const totalMinutes = t.durationMinutes || (t.duration ? t.duration.totalMinutes : 0) || 0;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return {
        customer_id: normalizeId(t.customerId) || null,
        hours: hours,
        minutes: minutes,
        total_amount: t.amount,
        start_time: t.start instanceof Date ? t.start.toISOString() : t.start,
        end_time: t.end instanceof Date ? t.end.toISOString() : t.end,
        rate_type: t.rateType,
        rate_amount: t.rateAmount,
        payment_status: t.paymentStatus || 'due',
        payment_status_updated_at: t.paymentStatusUpdatedAt
            ? (t.paymentStatusUpdatedAt instanceof Date ? t.paymentStatusUpdatedAt.toISOString() : t.paymentStatusUpdatedAt)
            : null,
        combined: Boolean(t.combined),
        time_slots: t.timeSlots || null,
        created_at: t.date instanceof Date ? t.date.toISOString() : t.date,
        notes: t.notes || null,
        device_type: t.deviceType || null
    };
}

function handleBackendError(error) {
    console.error('Supabase Query Error:', error);
    state.backendOnline = false;
    showNotification('Database connection lost or query failed. Check settings.', true, 4000);
}

// Theme Toggle
if (DOM.themeToggle) {
    DOM.themeToggle.addEventListener('click', () => {
        DOM.body.classList.toggle('dark-mode');
        const icon = DOM.themeToggle.querySelector('i');
        const nowDark = DOM.body.classList.contains('dark-mode');
        if (icon) {
            icon.className = nowDark ? 'fas fa-sun' : 'fas fa-moon';
        }
        localStorage.setItem('theme', nowDark ? 'dark' : 'light');

        // Sync preferences theme toggle if exists
        const prefThemeToggle = document.getElementById('prefThemeToggle');
        const prefIcon = prefThemeToggle?.querySelector('i');
        if (prefIcon) {
            prefIcon.className = nowDark ? 'fas fa-sun' : 'fas fa-moon';
        }
    });
}

// Palette switching
function applyPalette(palette) {
    DOM.body.classList.remove('palette-blue');
    if (palette === 'blue') {
        DOM.body.classList.add('palette-blue');
    }
    localStorage.setItem('palette', palette);
}

if (DOM.paletteSelect) {
    DOM.paletteSelect.addEventListener('change', () => applyPalette(DOM.paletteSelect.value));
}

// Collapsible Sidebar Toggle
if (DOM.toggleSidebar) {
    DOM.toggleSidebar.addEventListener('click', () => {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            toggleSidebar(!DOM.sidebar.classList.contains('show'));
        } else {
            const wasCollapsed = DOM.body.classList.contains('sidebar-collapsed');
            DOM.body.classList.toggle('sidebar-collapsed', !wasCollapsed);
            localStorage.setItem('sidebarState', !wasCollapsed ? 'collapsed' : 'expanded');
        }
    });
}

if (DOM.sidebarOverlay) {
    DOM.sidebarOverlay.addEventListener('click', () => toggleSidebar(false));
}

function toggleSidebar(show) {
    if (!DOM.sidebar || !DOM.sidebarOverlay) return;
    DOM.sidebar.classList.toggle('show', show);
    DOM.sidebarOverlay.classList.toggle('show', show);
    document.body.style.overflow = show ? 'hidden' : '';
    if (show) {
        DOM.sidebar.style.maxHeight = `${window.innerHeight}px`;
    }
}

function setActiveNav() {
    const page = document.body.dataset.page;
    if (!page || !DOM.navLinks) return;
    const mappedPage = page === 'customer-details' ? 'customers' : page;
    DOM.navLinks.forEach((link) => {
        const matches = link.getAttribute('data-nav') === mappedPage;
        link.classList.toggle('active', matches);
    });
}

// Live Clock
function updateClock() {
    if (!DOM.liveClock) return;
    const now = new Date();
    let timeText = '';
    try {
        timeText = new Intl.DateTimeFormat(navigator.language || 'en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(now);
    } catch (_) {
        timeText = now.toLocaleTimeString('en-US', { hour12: true });
    }
    DOM.liveClock.textContent = timeText;
}

if (DOM.liveClock) {
    setInterval(updateClock, 1000);
    updateClock();
}

function setDateInputsToNow() {
    if (!DOM.startTimeInput || !DOM.endTimeInput) return;
    const now = new Date();
    const value = now.toISOString().slice(0, 16);
    DOM.startTimeInput.value = value;
    DOM.endTimeInput.value = value;
}

// Utility Functions
function calculateDuration(start, end) {
    const startMs = start.getTime();
    const endMs = end.getTime();
    if (!isFinite(startMs) || !isFinite(endMs) || endMs < startMs) {
        return { hours: 0, minutes: 0, totalMinutes: 0 };
    }
    const diffMinutes = Math.round((endMs - startMs) / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return { hours, minutes, totalMinutes: diffMinutes };
}

const userLocale = navigator.language || 'en-IN';

function formatCurrency(amount) {
    try {
        return new Intl.NumberFormat(userLocale, {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2
        }).format(amount || 0);
    } catch (_) {
        return `${CURRENCY_SYMBOL} ${(amount || 0).toFixed(2)}`;
    }
}

function formatDate(d) {
    try {
        return new Intl.DateTimeFormat(userLocale).format(d);
    } catch (_) {
        return d.toLocaleDateString();
    }
}

function formatTime(d) {
    try {
        return new Intl.DateTimeFormat(userLocale, { hour: '2-digit', minute: '2-digit' }).format(d);
    } catch (_) {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

function formatDateTime(d) {
    try {
        return new Intl.DateTimeFormat(userLocale, {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(d);
    } catch (_) {
        return d.toLocaleString();
    }
}

function showNotification(message, isError = false, duration = 3000) {
    const container = document.createElement('div');
    container.className = 'notification-container';
    const notification = document.createElement('div');
    notification.className = 'notification';
    if (isError) notification.classList.add('error');
    notification.textContent = message;
    container.appendChild(notification);
    document.body.appendChild(container);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => container.remove(), 300);
    }, duration);
}

function getRateAmount(rateType) {
    return RATE_CONFIG[rateType] || RATE_CONFIG.hourly;
}

function updateRateDisplay() {
    updateDynamicRatesDisplay();
}

function updateDynamicRatesDisplay() {
    const currentRatesDisplay = document.getElementById('currentRatesDisplay');
    if (currentRatesDisplay) {
        currentRatesDisplay.textContent = `₹${RATE_CONFIG.hourly}/hr`;
    }
    if (DOM.rateType) {
        const hourlyOpt = DOM.rateType.querySelector('option[value="hourly"]');
        if (hourlyOpt) {
            hourlyOpt.textContent = `₹${RATE_CONFIG.hourly} / hr`;
        }
        const minuteOpt = DOM.rateType.querySelector('option[value="minute"]');
        if (minuteOpt) {
            minuteOpt.textContent = `₹${RATE_CONFIG.minute} / min`;
        }
    }
    renderCalculationSummary();
}

function buildCalculation(showErrors = false) {
    if (!DOM.rateType) return null;

    let startTime, endTime, duration;
    const rateType = DOM.rateType.value === 'minute' ? 'minute' : 'hourly';
    const rateAmount = getRateAmount(rateType);

    if (state.calculatorMode === 'range') {
        if (!DOM.startTimeInput || !DOM.endTimeInput) return null;
        startTime = new Date(DOM.startTimeInput.value);
        endTime = new Date(DOM.endTimeInput.value);
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime()) || endTime <= startTime) {
            if (showErrors) {
                DOM.startTimeInput.classList.add('error');
                DOM.endTimeInput.classList.add('error');
                showNotification('Invalid time range. Ensure end is after start.', true);
            }
            return null;
        }
        duration = calculateDuration(startTime, endTime);
    } else {
        // duration mode
        const hoursInput = document.getElementById('durationHours');
        const minutesInput = document.getElementById('durationMinutes');
        const hours = parseInt(hoursInput?.value, 10) || 0;
        const minutes = parseInt(minutesInput?.value, 10) || 0;
        const totalMinutes = hours * 60 + minutes;

        if (totalMinutes <= 0) {
            if (showErrors) {
                showNotification('Please set a duration greater than 0 minutes.', true);
            }
            return null;
        }

        endTime = new Date();
        startTime = new Date(endTime.getTime() - totalMinutes * 60 * 1000);
        duration = {
            hours,
            minutes,
            totalMinutes
        };
    }

    const amount = rateType === 'hourly'
        ? (duration.hours + duration.minutes / 60) * rateAmount
        : duration.totalMinutes * rateAmount;

    return { startTime, endTime, duration, rateType, rateAmount, amount };
}

function renderCalculationSummary() {
    if (!DOM.calcDuration || !DOM.calcRate || !DOM.calcAmount) return;
    const calc = buildCalculation(false);
    if (!calc) {
        DOM.calcDuration.textContent = '0h 00m';
        DOM.calcRate.textContent = `${formatCurrency(getRateAmount(DOM.rateType.value))} / ${DOM.rateType.value === 'minute' ? 'minute' : 'hour'}`;
        DOM.calcAmount.textContent = formatCurrency(0);
        return;
    }
    DOM.calcDuration.textContent = `${calc.duration.hours}h ${calc.duration.minutes}m`;
    DOM.calcRate.textContent = `${formatCurrency(calc.rateAmount)} / ${calc.rateType === 'hourly' ? 'hour' : 'minute'}`;
    DOM.calcAmount.textContent = formatCurrency(calc.amount);
}

// Stepper Adjusters
function adjustHours(amount) {
    const hoursInput = document.getElementById('durationHours');
    if (!hoursInput) return;
    let val = parseInt(hoursInput.value, 10) || 0;
    val = Math.max(0, val + amount);
    hoursInput.value = val;
    renderCalculationSummary();
}

function adjustMinutes(amount) {
    const minutesInput = document.getElementById('durationMinutes');
    const hoursInput = document.getElementById('durationHours');
    if (!minutesInput || !hoursInput) return;
    let mins = parseInt(minutesInput.value, 10) || 0;
    let hrs = parseInt(hoursInput.value, 10) || 0;
    
    let totalMins = hrs * 60 + mins + amount;
    totalMins = Math.max(0, totalMins);
    
    hoursInput.value = Math.floor(totalMins / 60);
    minutesInput.value = totalMins % 60;
    renderCalculationSummary();
}

// Customer Loaders & CRUD
async function loadCustomers() {
    if (!supabase) {
        state.customers = [];
        updateCustomerList();
        updateCustomerSelect();
        updateCustomerFilterDropdown();
        return;
    }
    try {
        const { data, error } = await supabase.from('customers').select('*').order('name', { ascending: true });
        if (error) throw error;
        state.customers = (data || []).map(fromDbCustomer);
        updateCustomerList();
        updateCustomerSelect();
        updateCustomerFilterDropdown();
        state.backendOnline = true;
    } catch (error) {
        handleBackendError(error);
    }
}

async function addCustomer() {
    if (!DOM.customerNameInput) return;
    const name = DOM.customerNameInput.value.trim();
    const mobile = DOM.customerContactInput?.value.trim() || '';
    if (!name) {
        DOM.customerNameInput.classList.add('error');
        showNotification('Please enter a customer name', true);
        return;
    }
    DOM.customerNameInput.classList.remove('error');

    if (!state.backendOnline || !supabase) {
        showNotification('Database is offline. Credentials might be missing or incorrect.', true);
        return;
    }

    const payload = {
        name,
        phone: mobile || null
    };

    try {
        const { data, error } = await supabase.from('customers').insert([payload]).select();
        if (error) throw error;
        
        const created = fromDbCustomer(data[0]);
        state.customers.push(created);
        state.customers.sort((a, b) => a.name.localeCompare(b.name));

        updateCustomerList();
        updateCustomerSelect();
        updateCustomerFilterDropdown();
        DOM.customerNameInput.value = '';
        if (DOM.customerContactInput) DOM.customerContactInput.value = '';
        showNotification('Customer added successfully');
    } catch (error) {
        handleBackendError(error);
    }
}

function updateCustomerList(filter = '') {
    if (!DOM.customerList) return;
    DOM.customerList.innerHTML = '';
    const filtered = state.customers.filter(c => (c.name || '').toLowerCase().includes(filter.toLowerCase()));
    const escapeHTML = (str) => String(str ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    if (filtered.length === 0) {
        DOM.customerList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon"><i class="fas fa-users"></i></div>
                <div class="empty-state-title">${filter ? 'No customers found' : 'No customers yet'}</div>
                <div class="empty-state-text">${filter
                    ? `No results for "${escapeHTML(filter)}". Try a different name.`
                    : 'Add your first customer using the form above.'}</div>
            </div>`;
        return;
    }

    filtered.forEach(c => {
        const mobile = c.mobile ? escapeHTML(c.mobile) : '';
        const item = document.createElement('div');
        item.classList.add('customer-item');
        item.innerHTML = `
            <div class="customer-item-left">
                <div class="customer-info">
                    <div class="customer-name">${escapeHTML(c.name)}</div>
                    ${mobile
                        ? `<div class="customer-mobile"><i class="fas fa-phone" style="font-size:0.7rem"></i> ${mobile}</div>`
                        : `<div class="customer-mobile" style="color:var(--text-muted);font-style:italic">No mobile</div>`}
                </div>
            </div>
            <div class="history-actions">
                <button class="edit-btn" data-id="${c.id}" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" data-id="${c.id}" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        `;
        item.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            window.location.href = `customer-details.html?id=${encodeURIComponent(c.id)}`;
        });
        const editBtn = item.querySelector('.edit-btn');
        const deleteBtn = item.querySelector('.delete-btn');
        editBtn?.addEventListener('click', () => {
            state.actionTarget = { customer: c, item, action: 'editCustomer' };
            if (DOM.modalMessage) DOM.modalMessage.textContent = 'Edit Customer';
            if (DOM.editForm) {
                DOM.editForm.innerHTML = `
                    <div class="input-group" style="margin-bottom:1rem">
                        <label for="editCustomerName">Customer Name <span style="color:var(--danger)">*</span></label>
                        <input type="text" id="editCustomerName" class="select-input" value="${escapeHTML(c.name)}">
                    </div>
                    <div class="input-group">
                        <label for="editCustomerPhone">Mobile Number (optional)</label>
                        <input type="tel" id="editCustomerPhone" class="select-input" value="${escapeHTML(c.mobile || '')}">
                    </div>
                `;
                DOM.editForm.style.display = 'block';
            }
            DOM.actionModal?.classList.add('show');
        });
        deleteBtn?.addEventListener('click', () => {
            state.actionTarget = { customer: c, item, action: 'deleteCustomer' };
            if (DOM.modalMessage) DOM.modalMessage.textContent = 'Delete this customer?';
            if (DOM.editForm) DOM.editForm.style.display = 'none';
            DOM.actionModal?.classList.add('show');
        });
        DOM.customerList.appendChild(item);
    });
}

function updateCustomerSelect() {
    if (!DOM.customerSelect) return;
    DOM.customerSelect.innerHTML = '<option value="">No customer (quick calculation)</option>';
    state.customers
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.name;
            DOM.customerSelect.appendChild(option);
        });
    updateSaveButtonState();
}

// Transaction Loaders & CRUD
async function loadTransactions() {
    if (!supabase) {
        state.transactions = [];
        updateHistoryList();
        updateAnalytics();
        return;
    }
    try {
        const { data, error } = await supabase.from('sessions').select('*');
        if (error) throw error;
        state.transactions = Array.isArray(data) ? data.map(fromDbCalculation) : [];
        updateHistoryList();
        updateAnalytics();
        state.backendOnline = true;
    } catch (error) {
        handleBackendError(error);
    }
}

async function addTransaction() {
    const calculation = buildCalculation(true);
    if (!calculation) return;

    renderCalculationSummary();

    const customerId = normalizeId(DOM.customerSelect?.value);
    if (!customerId) {
        // Calculate Only mode: copy to clipboard
        const notes = DOM.sessionNotes?.value.trim() || '';
        const summaryText = `TimeBook Calculation Summary
------------------------------
Date: ${formatDate(new Date())}
Duration: ${calculation.duration.hours}h ${calculation.duration.minutes}m
Rate: ${formatCurrency(calculation.rateAmount)} / ${calculation.rateType === 'hourly' ? 'hour' : 'minute'}
Total Amount: ${formatCurrency(calculation.amount)}
${notes ? `Notes: ${notes}` : ''}`;
        try {
            await navigator.clipboard.writeText(summaryText.trim());
            showNotification('Calculation summary copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy summary:', err);
            showNotification('Failed to copy to clipboard', true);
        }
        return;
    }

    if (!state.backendOnline || !supabase) {
        showNotification('Database is offline. Credentials might be missing or incorrect.', true);
        return;
    }

    const notes = DOM.sessionNotes?.value.trim() || '';
    const isMobile = window.innerWidth <= 768;
    const deviceType = isMobile ? 'mobile' : 'desktop';

    const payload = toDbCalculation({
        customerId,
        start: calculation.startTime,
        end: calculation.endTime,
        durationMinutes: calculation.duration.totalMinutes,
        rateType: calculation.rateType,
        rateAmount: calculation.rateAmount,
        amount: calculation.amount,
        date: new Date(),
        combined: false,
        timeSlots: null,
        paymentStatus: 'due',
        notes,
        deviceType
    });

    try {
        const { error } = await supabase.from('sessions').insert([payload]);
        if (error) throw error;
        await loadTransactions();
        showNotification('Transaction saved successfully');

        // Clear notes
        if (DOM.sessionNotes) DOM.sessionNotes.value = '';

        if (state.calculatorMode === 'duration') {
            const hoursInput = document.getElementById('durationHours');
            const minutesInput = document.getElementById('durationMinutes');
            if (hoursInput) hoursInput.value = 0;
            if (minutesInput) minutesInput.value = 0;
        } else {
            setDateInputsToNow();
        }

        updateRateDisplay(); // Bug fix: restore rate display after save
        renderCalculationSummary();
        updateHistoryList();
        updateAnalytics();
    } catch (error) {
        handleBackendError(error);
    }
}

function updateHistoryList(filter = '') {
    if (!DOM.historyList) return;
    DOM.historyList.innerHTML = '';
    const searchTerm = filter.toLowerCase().trim();
    const startFilter = DOM.historyStartDate?.value ? new Date(DOM.historyStartDate.value) : null;
    const endFilter = DOM.historyEndDate?.value ? new Date(DOM.historyEndDate.value) : null;
    const sortValue = DOM.historySort?.value || 'date_desc';
    const selectedCustomerId = normalizeId(DOM.historyCustomerFilter?.value);

    let filtered = state.transactions.filter(t => {
        if (selectedCustomerId && !idsEqual(t.customerId, selectedCustomerId)) return false;
        const customer = state.customers.find(c => idsEqual(c.id, t.customerId));
        const customerName = customer?.name?.toLowerCase() || '';
        const date = formatDate(t.date);
        const amount = t.amount.toString();
        const time = `${formatTime(t.start)} - ${formatTime(t.end)}`;
        const textMatch = customerName.includes(searchTerm)
            || date.toLowerCase().includes(searchTerm)
            || amount.includes(searchTerm)
            || time.toLowerCase().includes(searchTerm);
        if (!textMatch) return false;
        if (startFilter && t.date < startFilter) return false;
        if (endFilter) {
            const endOfDay = new Date(endFilter);
            endOfDay.setHours(23, 59, 59, 999);
            if (t.date > endOfDay) return false;
        }
        return true;
    });

    const sorters = {
        date_desc: (a, b) => b.date - a.date,
        date_asc: (a, b) => a.date - b.date,
        amount_desc: (a, b) => b.amount - a.amount,
        amount_asc: (a, b) => a.amount - b.amount,
        duration_desc: (a, b) => b.duration.totalMinutes - a.duration.totalMinutes,
        duration_asc: (a, b) => a.duration.totalMinutes - b.duration.totalMinutes
    };
    filtered.sort(sorters[sortValue] || sorters.date_desc);

    const pageSize = 25;
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    if (state.historyPage > totalPages) state.historyPage = totalPages;
    const startIndex = (state.historyPage - 1) * pageSize;
    const pageItems = filtered.slice(startIndex, startIndex + pageSize);

    if (DOM.historyPageInfo) DOM.historyPageInfo.textContent = `Page ${state.historyPage} of ${totalPages}`;
    if (DOM.historyPrev) DOM.historyPrev.disabled = state.historyPage <= 1;
    if (DOM.historyNext) DOM.historyNext.disabled = state.historyPage >= totalPages;

    const escapeHTML = (str) => String(str ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    if (pageItems.length === 0) {
        DOM.historyList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon"><i class="fas fa-history"></i></div>
                <div class="empty-state-title">No transactions found</div>
                <div class="empty-state-text">${searchTerm
                    ? `No results for "${escapeHTML(filter)}". Try a different search or filter.`
                    : 'Start by calculating a session and selecting a customer on the Calculator page.'}</div>
            </div>`;
        return;
    }

    pageItems.forEach(t => {
        const customer = state.customers.find(c => idsEqual(c.id, t.customerId));
        const paymentStatus = t.paymentStatus === 'paid' ? 'paid' : 'due';
        const item = document.createElement('div');
        item.classList.add('history-item');
        item.innerHTML = `
            <div class="history-content ${t.combined ? 'combined-transaction' : ''}">
                <div class="history-meta">
                    <input type="checkbox" class="history-checkbox" data-id="${t.id}">
                    <span class="history-customer">${escapeHTML(customer?.name || 'Unknown')}</span>
                    <span class="history-date">${formatDate(t.date)}</span>
                    <span class="payment-status ${paymentStatus === 'paid' ? 'status-paid' : 'status-due'}">
                        <i class="fas ${paymentStatus === 'paid' ? 'fa-check-circle' : 'fa-clock'}"></i>
                        ${paymentStatus === 'paid' ? 'Paid' : 'Due'}
                    </span>
                    <button class="payment-toggle" data-id="${t.id}" title="Change payment status">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
                <div class="history-details">
                    <span class="history-detail-item"><i class="fas fa-clock"></i> ${formatTime(t.start)} &ndash; ${formatTime(t.end)}</span>
                    <span class="history-detail-item"><i class="fas fa-hourglass-half"></i> ${t.duration.hours}h ${t.duration.minutes}m</span>
                    <span class="history-detail-item"><i class="fas fa-tag"></i> ${formatCurrency(t.rateAmount)}/${t.rateType === 'hourly' ? 'hr' : 'min'}</span>
                    <span class="history-detail-item"><i class="fas fa-rupee-sign"></i> ${formatCurrency(t.amount)}</span>
                </div>
                ${t.timeSlots ? `
                    <div class="combined-slots">
                        <strong style="font-size:0.8rem;color:var(--text-secondary)">Combined sessions:</strong>
                        ${t.timeSlots.map(slot => `
                            <div class="combined-slot-item">
                                <span>${formatDate(new Date(slot.date))}</span>
                                <span>${formatTime(new Date(slot.start))} &ndash; ${formatTime(new Date(slot.end))}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="history-actions">
                <button class="delete-btn" data-id="${t.id}" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        `;

        const checkbox = item.querySelector('.history-checkbox');
        if (checkbox) checkbox.checked = state.selectedTransactions.has(t.id);
        DOM.historyList.appendChild(item);
    });

    updateCustomerFilterDropdown();

    if (selectedCustomerId) {
        const customerTransactions = filtered.filter(t => idsEqual(t.customerId, selectedCustomerId));
        updateHistorySummary(customerTransactions);
    } else if (DOM.historySummary) {
        DOM.historySummary.style.display = 'none';
    }
}

function updateCustomerFilterDropdown() {
    if (!DOM.historyCustomerFilter) return;
    const currentValue = DOM.historyCustomerFilter.value;
    DOM.historyCustomerFilter.innerHTML = '<option value="">All Customers</option>';
    state.customers.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.name;
        DOM.historyCustomerFilter.appendChild(option);
    });
    DOM.historyCustomerFilter.value = currentValue;
}

function updateHistorySummary(transactions) {
    if (!DOM.historySummary) return;
    if (transactions.length === 0) {
        DOM.historySummary.style.display = 'none';
        return;
    }
    const dates = transactions.map(t => t.date.getTime());
    const startDate = new Date(Math.min(...dates));
    const endDate = new Date(Math.max(...dates));
    const totalMinutes = transactions.reduce((sum, t) => sum + t.duration.totalMinutes, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const summary = DOM.historySummary.querySelector('.summary-details');
    if (summary) {
        summary.innerHTML = `
            <span class="date-range">Period: ${formatDate(startDate)} - ${formatDate(endDate)}</span>
            <span class="total-time">Total Time: ${hours}h ${minutes}m</span>
            <span class="total-amount">Total Amount: ${formatCurrency(totalAmount)}</span>
        `;
    }
    DOM.historySummary.style.display = 'block';
}

function initCustomerDetailsPage() {
    const card = document.getElementById('customerDetailsCard');
    if (!card) return;

    const customerId = getCustomerIdFromURL();
    if (!customerId) {
        window.location.href = 'customers.html';
        return;
    }
    card.innerHTML = '<div class="empty-state"><div class="empty-state-title">Loading customer...</div><div class="empty-state-text">Fetching customer profile and transactions.</div></div>';
    const customer = state.customers.find(c => idsEqual(c.id, customerId));

    if (!customer) {
        card.innerHTML = '<div class="empty-state"><div class="empty-state-title">Customer not found</div><div class="empty-state-text">This link may be invalid or the customer may have been deleted.</div></div>';
        return;
    }

    renderCustomerDetailsCard(customer, card);
}

function renderCustomerDetailsCard(customer, card) {
    const customerTransactions = state.transactions
        .filter(t => idsEqual(t.customerId, customer.id))
        .slice()
        .sort((a, b) => b.date - a.date);
    const totalAmount = customerTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalPaid = customerTransactions.filter(t => t.paymentStatus === 'paid').reduce((sum, t) => sum + t.amount, 0);
    const totalDue = customerTransactions.filter(t => t.paymentStatus !== 'paid').reduce((sum, t) => sum + t.amount, 0);
    const totalMinutes = customerTransactions.reduce((sum, t) => sum + t.duration.totalMinutes, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const phone = String(customer.mobile || '').trim();
    const phoneHref = phone ? phone.replace(/[^\d+]/g, '') : '';
    const escapeHTML = (str) => String(str ?? '').replace(/[&<>"']/g, (ch) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));

    card.innerHTML = `
        <div class="cd-header">
            <div class="cd-identity">
                <p class="eyebrow">Customer Details</p>
                <div class="cd-name">${escapeHTML(customer.name)}</div>
                <div class="cd-phone">
                    <i class="fas fa-phone"></i>
                    ${phone ? escapeHTML(phone) : '<span style="color:var(--text-muted);font-style:italic">No mobile number saved</span>'}
                </div>
            </div>
            <div class="cd-header-actions">
                ${phoneHref ? `<a class="btn btn-primary cd-call-btn" href="tel:${phoneHref}"><i class="fas fa-phone"></i> Call</a>` : ''}
                <button type="button" class="btn cd-action-btn" data-customer-action="edit"><i class="fas fa-edit"></i> Edit</button>
                <button type="button" class="btn btn-warning cd-action-btn" data-customer-action="mark-all-due"><i class="fas fa-clock"></i> Mark All Due</button>
                <button type="button" class="btn btn-success cd-action-btn" data-customer-action="mark-all-paid"><i class="fas fa-check-circle"></i> Mark All Paid</button>
                <button type="button" class="btn btn-danger cd-action-btn" data-customer-action="delete"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>

        <div class="cd-stats-grid">
            <div class="cd-stat-card">
                <span class="cd-stat-label">Sessions</span>
                <span class="cd-stat-value">${customerTransactions.length}</span>
            </div>
            <div class="cd-stat-card">
                <span class="cd-stat-label">Total Time</span>
                <span class="cd-stat-value">${hours}h ${minutes}m</span>
            </div>
            <div class="cd-stat-card cd-stat-paid">
                <span class="cd-stat-label">Total Paid</span>
                <span class="cd-stat-value">${formatCurrency(totalPaid)}</span>
            </div>
            <div class="cd-stat-card cd-stat-due">
                <span class="cd-stat-label">Total Due</span>
                <span class="cd-stat-value">${formatCurrency(totalDue)}</span>
            </div>
            <div class="cd-stat-card cd-stat-total">
                <span class="cd-stat-label">Total Billed</span>
                <span class="cd-stat-value">${formatCurrency(totalAmount)}</span>
            </div>
        </div>

        <div class="cd-section-title"><i class="fas fa-history"></i> Payment History</div>
        <div class="cd-tx-list">
            ${customerTransactions.length ? customerTransactions.map(t => {
                const paymentStatus = t.paymentStatus === 'paid' ? 'paid' : 'due';
                const updatedStr = t.paymentStatusUpdatedAt
                    ? formatDateTime(t.paymentStatusUpdatedAt)
                    : '';
                return `
                <div class="cd-tx-card" data-tx-id="${t.id}">
                    <div class="cd-tx-top">
                        <span class="cd-tx-date">${formatDate(t.date)}</span>
                        <span class="cd-tx-amount">${formatCurrency(t.amount)}</span>
                    </div>
                    <div class="cd-tx-details">
                        <span><i class="fas fa-clock"></i> ${formatTime(t.start)} &ndash; ${formatTime(t.end)}</span>
                        <span><i class="fas fa-hourglass-half"></i> ${t.duration.hours}h ${t.duration.minutes}m</span>
                        <span><i class="fas fa-tag"></i> ${formatCurrency(t.rateAmount)}/${t.rateType === 'hourly' ? 'hr' : 'min'}</span>
                    </div>
                    ${t.notes ? `<div class="cd-tx-notes"><i class="fas fa-sticky-note"></i> ${escapeHTML(t.notes)}</div>` : ''}
                    <div class="cd-tx-footer">
                        <div class="cd-tx-status-row">
                            <span class="payment-status ${paymentStatus === 'paid' ? 'status-paid' : 'status-due'}">
                                <i class="fas ${paymentStatus === 'paid' ? 'fa-check-circle' : 'fa-clock'}"></i>
                                ${paymentStatus === 'paid' ? 'Paid' : 'Due'}
                            </span>
                            ${updatedStr ? `<span class="cd-tx-updated">${updatedStr}</span>` : ''}
                        </div>
                        <div class="cd-tx-actions">
                            <button class="cd-tx-status-btn" data-tx-id="${t.id}" data-action="changeStatus">
                                <i class="fas fa-sync-alt"></i> Status
                            </button>
                            <button class="cd-tx-status-btn" data-tx-id="${t.id}" data-action="deleteTx" style="color:var(--danger)">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>`;
            }).join('') : '<div class="empty-state"><div class="empty-state-title">No transactions yet</div></div>'}
        </div>
    `;
}

function parseManualStatusDateTime(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function openPaymentStatusModal(transactionId) {
    const transaction = state.transactions.find(t => t.id === transactionId);
    if (!transaction || !DOM.editForm) return;

    const currentStamp = transaction.paymentStatusUpdatedAt instanceof Date
        ? transaction.paymentStatusUpdatedAt
        : (transaction.paymentStatusUpdatedAt ? new Date(transaction.paymentStatusUpdatedAt) : new Date());
    const localDateTime = new Date(currentStamp.getTime() - currentStamp.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    if (DOM.modalMessage) DOM.modalMessage.textContent = 'Set Payment Status';
    DOM.editForm.innerHTML = `
        <div class="payment-status-modal">
            <p class="payment-status-modal-subtitle">Select a status to apply immediately.</p>
            <div class="input-group">
                <label for="statusDateTime">Status Date & Time (optional manual value)</label>
                <input type="datetime-local" id="statusDateTime" class="select-input" value="${localDateTime}">
            </div>
            <div class="payment-status-options">
                <button type="button" class="btn btn-success payment-status-option" data-status="paid">Paid</button>
                <button type="button" class="btn btn-warning payment-status-option" data-status="due">Due</button>
            </div>
        </div>
    `;
    DOM.editForm.style.display = 'block';
    if (DOM.confirmAction) DOM.confirmAction.style.display = 'none';
    if (DOM.cancelAction) DOM.cancelAction.style.display = 'none';
    DOM.actionModal?.classList.add('show');
    state.actionTarget = { action: 'selectPaymentStatus', transactionId };
}

async function setPaymentStatus(transactionId, newStatus, manualDateTime = null) {
    const transaction = state.transactions.find(t => t.id === transactionId);
    if (!transaction) return;
    const oldStatus = transaction.paymentStatus;
    const oldUpdatedAt = transaction.paymentStatusUpdatedAt;
    const effectiveTimestamp = manualDateTime instanceof Date ? manualDateTime : new Date();
    transaction.paymentStatus = newStatus;
    transaction.paymentStatusUpdatedAt = effectiveTimestamp;

    if (supabase) {
        try {
            let { error } = await supabase
                .from('sessions')
                .update({
                    payment_status: newStatus,
                    payment_status_updated_at: effectiveTimestamp.toISOString()
                })
                .eq('id', transactionId);
            if (error && String(error.message || '').toLowerCase().includes('payment_status_updated_at')) {
                const fallback = await supabase.from('sessions').update({ payment_status: newStatus }).eq('id', transactionId);
                error = fallback.error;
            }
            if (error) throw error;
            showNotification(`Payment status changed to ${newStatus === 'paid' ? 'Paid' : 'Due'}`);
        } catch (error) {
            transaction.paymentStatus = oldStatus;
            transaction.paymentStatusUpdatedAt = oldUpdatedAt;
            handleBackendError(error);
        }
    }
    updateHistoryList(DOM.historySearch?.value || '');
    refreshCustomerDetailsPage();
}

// Client-Side Analytics Processing
function computeAnalyticsFromState() {
    const totalEarnings = state.transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalMinutes = state.transactions.reduce((sum, t) => sum + t.duration.totalMinutes, 0);
    const byDay = state.transactions.reduce((acc, t) => {
        const key = formatDate(t.date);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    const busiestDay = Object.entries(byDay).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    const byCustomerAmount = state.transactions.reduce((acc, t) => {
        acc[t.customerId] = (acc[t.customerId] || 0) + t.amount;
        return acc;
    }, {});
    const topCustomerEntry = Object.entries(byCustomerAmount).sort((a, b) => b[1] - a[1])[0];
    const topCustomerName = state.customers.find(c => idsEqual(c.id, topCustomerEntry?.[0]))?.name || 'N/A';
    return { totalEarnings, totalMinutes, busiestDay, topCustomerName };
}

function renderAnalytics(data) {
    if (!DOM.analyticsDashboard) return;
    const totalMinutes = data.totalMinutes || 0;
    const totalHours = totalMinutes / 60;
    const timeDisplay = totalHours >= 1
        ? `${totalHours.toFixed(1)}h`
        : `${totalMinutes}m`;
    DOM.analyticsDashboard.innerHTML = `
        <div class="analytics-card">
            <h3>Total Earnings</h3>
            <p>${formatCurrency(data.totalEarnings || 0)}</p>
        </div>
        <div class="analytics-card">
            <h3>Hours Tracked</h3>
            <p>${timeDisplay}</p>
        </div>
        <div class="analytics-card">
            <h3>Busiest Day</h3>
            <p>${data.busiestDay || 'N/A'}</p>
        </div>
        <div class="analytics-card">
            <h3>Top Customer</h3>
            <p>${data.topCustomerName || 'N/A'}</p>
        </div>
    `;
}

function updateAnalytics() {
    if (!DOM.analyticsDashboard) return;
    renderAnalytics(computeAnalyticsFromState());
}


// Modal Actions Triggered on Confirmation
if (DOM.confirmAction) {
    DOM.confirmAction.addEventListener('click', async () => {
        const { transaction, item, customer, action, transactions } = state.actionTarget || {};

        if (action === 'deleteTransaction') {
            const deletedId = transaction?.id;
            state.transactions = state.transactions.filter(t => t !== transaction);
            item?.remove();
            DOM.actionModal?.classList.remove('show');
            
            if (deletedId != null && supabase) {
                try {
                    const { error } = await supabase.from('sessions').delete().eq('id', deletedId);
                    if (error) throw error;
                    showNotification('Transaction deleted');
                    await loadTransactions();
                } catch (error) {
                    handleBackendError(error);
                }
            }
            updateHistoryList();
            updateAnalytics();

        } else if (action === 'editCustomer') {
            const editNameInput = document.getElementById('editCustomerName');
            const editPhoneInput = document.getElementById('editCustomerPhone');
            const newName = editNameInput ? editNameInput.value.trim() : '';
            const newPhone = editPhoneInput ? editPhoneInput.value.trim() : '';
            if (!newName) {
                showNotification('Please enter a name', true);
                return;
            }
            const oldName = customer.name;
            const oldMobile = customer.mobile;
            customer.name = newName;
            customer.mobile = newPhone;
            
            if (supabase) {
                try {
                    const { error } = await supabase.from('customers').update({ name: newName, phone: newPhone || null }).eq('id', customer.id);
                    if (error) throw error;
                    showNotification('Customer updated');
                } catch (error) {
                    customer.name = oldName;
                    customer.mobile = oldMobile;
                    handleBackendError(error);
                }
            }
            updateCustomerList();
            updateCustomerSelect();
            updateCustomerFilterDropdown();
            updateHistoryList();
            refreshCustomerDetailsPage();
            DOM.actionModal?.classList.remove('show');

        } else if (action === 'deleteCustomer') {
            const customerId = customer.id;
            state.transactions = state.transactions.filter(t => !idsEqual(t.customerId, customerId));
            state.customers = state.customers.filter(c => !idsEqual(c.id, customerId));
            item?.remove();
            DOM.actionModal?.classList.remove('show');
            
            updateCustomerList();
            updateCustomerSelect();
            updateHistoryList();
            updateAnalytics();
            showNotification('Customer deleted');
            if (document.body?.dataset?.page === 'customer-details' && idsEqual(getCustomerIdFromURL(), customerId)) {
                window.location.href = 'customers.html';
            }
            
            if (supabase) {
                try {
                    const { error } = await supabase.from('customers').delete().eq('id', customerId);
                    if (error) throw error;
                } catch (error) {
                    handleBackendError(error);
                }
            }

        } else if (action === 'bulkDelete') {
            const ids = Array.isArray(transactions) ? transactions : [];
            state.transactions = state.transactions.filter(t => !ids.includes(t.id));

            if (supabase) {
                try {
                    const { error } = await supabase.from('sessions').delete().in('id', ids);
                    if (error) throw error;
                    showNotification(`${ids.length} transactions deleted`);
                    await loadTransactions();
                } catch (error) {
                    handleBackendError(error);
                }
            }
            updateHistoryList();
            state.selectedTransactions.clear();
            updateBulkActionsVisibility();
            DOM.actionModal?.classList.remove('show');

        } else if (action === 'deleteCustomerDetailTransaction') {
            const deletedId = transaction?.id;
            state.transactions = state.transactions.filter(t => t !== transaction);
            DOM.actionModal?.classList.remove('show');

            if (deletedId != null && supabase) {
                try {
                    const { error } = await supabase.from('sessions').delete().eq('id', deletedId);
                    if (error) throw error;
                    showNotification('Transaction deleted');
                } catch (error) {
                    handleBackendError(error);
                }
            }
            updateHistoryList();
            updateAnalytics();
            refreshCustomerDetailsPage();
        }
        
        state.actionTarget = null;
    });
}

if (DOM.cancelAction) {
    DOM.cancelAction.addEventListener('click', () => {
        DOM.actionModal?.classList.remove('show');
        if (DOM.confirmAction) DOM.confirmAction.style.display = '';
        DOM.cancelAction.style.display = '';
        DOM.cancelAction.textContent = 'Cancel';
        state.actionTarget = null;
    });
}

// Modal A11y
if (DOM.actionModal) {
    const modal = DOM.actionModal;
    const modalContent = modal.querySelector('.modal-content');
    let lastFocusedElementBeforeModal;

    function openModalA11y() {
        lastFocusedElementBeforeModal = document.activeElement;
        setTimeout(() => {
            modalContent?.setAttribute('tabindex', '-1');
            modalContent?.focus();
        }, 0);
    }

    function closeModalA11y() {
        if (lastFocusedElementBeforeModal && typeof lastFocusedElementBeforeModal.focus === 'function') {
            lastFocusedElementBeforeModal.focus();
        }
    }

    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('show')) return;
        if (e.key === 'Escape') {
            e.preventDefault();
            DOM.actionModal?.classList.remove('show');
            state.actionTarget = null;
            closeModalA11y();
            return;
        }
        if (e.key === 'Tab') {
            const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
            const nodes = Array.from(modal.querySelectorAll(focusableSelectors)).filter(el => !el.hasAttribute('disabled'));
            if (nodes.length === 0) return;
            const first = nodes[0];
            const last = nodes[nodes.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    const modalObserver = new MutationObserver(() => {
        if (modal.classList.contains('show')) {
            openModalA11y();
        } else {
            closeModalA11y();
        }
    });
    modalObserver.observe(modal, { attributes: true, attributeFilter: ['class'] });
}

function updateBulkActionsVisibility() {
    if (!DOM.bulkActions || !DOM.selectedCount) return;
    const hasSelected = state.selectedTransactions.size > 0;
    DOM.bulkActions.style.display = hasSelected ? 'flex' : 'none';
    DOM.selectedCount.textContent = `${state.selectedTransactions.size} items selected`;
}

// Bulk Actions (Combine)
if (DOM.bulkAddBtn) {
    DOM.bulkAddBtn.addEventListener('click', async () => {
        const selectedTransactions = Array.from(state.selectedTransactions);
        const transactions = selectedTransactions
            .map(id => state.transactions.find(t => t.id === id))
            .filter(Boolean);

        if (transactions.length === 0) {
            showNotification('No transactions selected', true);
            return;
        }

        if (!state.backendOnline || !supabase) {
            showNotification('Database offline. Cannot save combined transactions.', true);
            return;
        }

        const groupedByCustomer = transactions.reduce((acc, t) => {
            if (!acc[t.customerId]) {
                acc[t.customerId] = [];
            }
            acc[t.customerId].push(t);
            return acc;
        }, {});

        const newCalculations = [];
        for (const [customerId, customerTransactions] of Object.entries(groupedByCustomer)) {
            const totalMinutes = customerTransactions.reduce((sum, t) => sum + t.duration.totalMinutes, 0);
            const totalAmount = customerTransactions.reduce((sum, t) => sum + t.amount, 0);
            const timeSlots = customerTransactions.map(t => ({
                start: t.start.toISOString(),
                end: t.end.toISOString(),
                date: t.date.toISOString()
            }));

            const payload = toDbCalculation({
                customerId: normalizeId(customerId),
                start: new Date(Math.min(...customerTransactions.map(t => t.start.getTime()))),
                end: new Date(Math.max(...customerTransactions.map(t => t.end.getTime()))),
                durationMinutes: totalMinutes,
                rateType: customerTransactions[0].rateType,
                rateAmount: customerTransactions[0].rateAmount,
                amount: totalAmount,
                combined: true,
                timeSlots,
                paymentStatus: 'due',
                date: new Date(),
                notes: 'Combined transaction',
                deviceType: window.innerWidth <= 768 ? 'mobile' : 'desktop'
            });
            newCalculations.push(payload);
        }

        const originalIds = transactions.map(t => t.id);

        try {
            const { data, error } = await supabase.from('sessions').insert(newCalculations).select();
            if (error) throw error;

            const { error: deleteError } = await supabase.from('sessions').delete().in('id', originalIds);
            if (deleteError) throw deleteError;

            state.transactions = state.transactions.filter(t => !originalIds.includes(t.id));

            data.forEach(created => {
                state.transactions.push(fromDbCalculation(created));
            });

            state.selectedTransactions.clear();
            updateHistoryList();
            updateBulkActionsVisibility();
            updateAnalytics();
            showNotification('Transactions combined successfully');
        } catch (error) {
            handleBackendError(error);
        }
    });
}

if (DOM.bulkDeleteBtn) {
    DOM.bulkDeleteBtn.addEventListener('click', () => {
        const selectedTransactions = Array.from(state.selectedTransactions);
        if (selectedTransactions.length === 0) {
            showNotification('No transactions selected', true);
            return;
        }
        if (DOM.modalMessage) {
            DOM.modalMessage.textContent = `Delete ${selectedTransactions.length} selected transactions?`;
        }
        if (DOM.editForm) DOM.editForm.style.display = 'none';
        DOM.actionModal?.classList.add('show');
        state.actionTarget = { action: 'bulkDelete', transactions: selectedTransactions };
    });
}

if (DOM.historyCustomerFilter) {
    DOM.historyCustomerFilter.addEventListener('change', () => {
        state.historyPage = 1;
        updateHistoryList(DOM.historySearch?.value || '');
    });
}

if (DOM.historyList) {
    DOM.historyList.addEventListener('click', (e) => {
        const target = e.target.closest('button, input');
        if (!target) return;
        
        if (target.classList.contains('delete-btn') || target.closest('.delete-btn')) {
            const itemEl = target.closest('.history-item');
            const id = parseInt(itemEl?.querySelector('.history-checkbox')?.dataset.id, 10);
            const transaction = state.transactions.find(t => t.id === id);
            if (!transaction) return;
            state.actionTarget = { transaction, item: itemEl, action: 'deleteTransaction' };
            if (DOM.modalMessage) DOM.modalMessage.textContent = 'Delete this transaction?';
            if (DOM.editForm) DOM.editForm.style.display = 'none';
            DOM.actionModal?.classList.add('show');
            return;
        }
        if (target.classList.contains('payment-toggle') || target.closest('.payment-toggle')) {
            const id = parseInt(target.closest('.history-content')?.querySelector('.history-checkbox')?.dataset.id, 10);
            if (!id) return;
            openPaymentStatusModal(id);
            return;
        }
        if (target.classList.contains('history-checkbox')) {
            const id = parseInt(target.dataset.id, 10);
            if (target.checked) {
                const curTx = state.transactions.find(t => t.id === id);
                if (curTx) {
                    let firstSelectedTx = null;
                    if (state.selectedTransactions.size > 0) {
                        const firstId = state.selectedTransactions.values().next().value;
                        firstSelectedTx = state.transactions.find(t => t.id === firstId);
                    }
                    if (firstSelectedTx && firstSelectedTx.customerId !== curTx.customerId) {
                        target.checked = false;
                        showNotification('Cannot select transactions of different customers', true);
                        return;
                    }
                }
                state.selectedTransactions.add(id);
            } else {
                state.selectedTransactions.delete(id);
            }
            updateBulkActionsVisibility();
        }
    });
}

if (DOM.historyPrev) {
    DOM.historyPrev.addEventListener('click', () => {
        if (state.historyPage > 1) {
            state.historyPage -= 1;
            updateHistoryList(DOM.historySearch?.value || '');
        }
    });
}

if (DOM.historyNext) {
    DOM.historyNext.addEventListener('click', () => {
        state.historyPage += 1;
        updateHistoryList(DOM.historySearch?.value || '');
    });
}

if (DOM.editForm) {
    DOM.editForm.addEventListener('click', (e) => {
        const optionBtn = e.target.closest('.payment-status-option');
        if (!optionBtn) return;
        const { action, transactionId } = state.actionTarget || {};
        if (action !== 'selectPaymentStatus' || !transactionId) return;
        const status = optionBtn.getAttribute('data-status');
        if (status !== 'paid' && status !== 'due') return;
        const manualValue = document.getElementById('statusDateTime')?.value || '';
        const manualDate = parseManualStatusDateTime(manualValue);
        setPaymentStatus(transactionId, status, manualDate);
        DOM.actionModal?.classList.remove('show');
        if (DOM.confirmAction) DOM.confirmAction.style.display = '';
        if (DOM.cancelAction) DOM.cancelAction.style.display = '';
        state.actionTarget = null;
    });
}

const customerDetailsCard = document.getElementById('customerDetailsCard');
if (customerDetailsCard) {
    customerDetailsCard.addEventListener('click', (e) => {
        const statusBtn = e.target.closest('.cd-tx-status-btn');
        const customerActionBtn = e.target.closest('[data-customer-action]');
        if (customerActionBtn) {
            const action = customerActionBtn.getAttribute('data-customer-action');
            const customerId = getCustomerIdFromURL();
            const customer = state.customers.find(c => idsEqual(c.id, customerId));
            if (!customer) {
                showNotification('Customer not found', true);
                return;
            }
            if (action === 'edit') {
                const esc = (str) => String(str ?? '').replace(/[&<>"']/g, (ch) => ({
                    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
                }[ch]));
                state.actionTarget = { customer, action: 'editCustomer' };
                if (DOM.modalMessage) DOM.modalMessage.textContent = 'Edit Customer';
                if (DOM.editForm) {
                    DOM.editForm.innerHTML = `
                        <div class="input-group" style="margin-bottom:1rem">
                            <label for="editCustomerName">Customer Name <span style="color:var(--danger)">*</span></label>
                            <input type="text" id="editCustomerName" class="select-input" value="${esc(customer.name)}">
                        </div>
                        <div class="input-group">
                            <label for="editCustomerPhone">Mobile Number (optional)</label>
                            <input type="tel" id="editCustomerPhone" class="select-input" value="${esc(customer.mobile || '')}">
                        </div>
                    `;
                    DOM.editForm.style.display = 'block';
                }
                DOM.actionModal?.classList.add('show');
            } else if (action === 'delete') {
                state.actionTarget = { customer, action: 'deleteCustomer' };
                if (DOM.modalMessage) DOM.modalMessage.textContent = 'Delete this customer and all related transactions?';
                if (DOM.editForm) DOM.editForm.style.display = 'none';
                DOM.actionModal?.classList.add('show');
            } else if (action === 'mark-all-paid' || action === 'mark-all-due') {
                const newStatus = action === 'mark-all-paid' ? 'paid' : 'due';
                const txs = state.transactions.filter(t => idsEqual(t.customerId, customer.id));
                Promise.all(txs.map(tx => setPaymentStatus(tx.id, newStatus))).then(() => {
                    showNotification(`Marked ${txs.length} transaction(s) as ${newStatus}`);
                });
            }
            return;
        }

        if (!statusBtn) return;
        const txId = parseInt(statusBtn.getAttribute('data-tx-id'), 10);
        const action = statusBtn.getAttribute('data-action');
        if (!txId || !action) return;

        if (action === 'changeStatus') {
            openPaymentStatusModal(txId);
        } else if (action === 'deleteTx') {
            const transaction = state.transactions.find(t => t.id === txId);
            if (!transaction) return;
            state.actionTarget = {
                transaction,
                action: 'deleteCustomerDetailTransaction',
                customerId: transaction.customerId
            };
            if (DOM.modalMessage) DOM.modalMessage.textContent = 'Delete this transaction?';
            if (DOM.editForm) DOM.editForm.style.display = 'none';
            DOM.actionModal?.classList.add('show');
        }
    });
}

// Backup Export & Import (Settings page exclusive)
if (DOM.exportJSONBtn) {
    DOM.exportJSONBtn.addEventListener('click', () => {
        const filenameDefault = `timebook_data_${new Date().toISOString().slice(0, 10)}.json`;
        const filename = prompt('Enter filename for JSON export:', filenameDefault) || filenameDefault;
        const data = {
            version: 2,
            exportedAt: new Date().toISOString(),
            appSettings: {
                theme: localStorage.getItem('theme') || 'light',
                palette: localStorage.getItem('palette') || 'mint',
                fixedHourlyRate: RATE_CONFIG.hourly,
                fixedMinuteRate: RATE_CONFIG.minute
            },
            transactions: state.transactions,
            customers: state.customers
        };
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    });
}

if (DOM.importDataInput) {
    DOM.importDataInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const raw = JSON.parse(event.target.result);
                const validArray = (a) => Array.isArray(a) ? a : [];
                const sanitizeString = (s) => typeof s === 'string' ? s.replace(/[\u0000-\u001F\u007F]/g, '').slice(0, 256) : '';

                const importedCustomers = validArray(raw.customers).map(c => ({
                    id: c?.id !== undefined ? parseInt(c.id, 10) : undefined,
                    name: sanitizeString(c?.name ?? ''),
                    mobile: sanitizeString(c?.mobile ?? c?.contact ?? c?.phone ?? '') || null
                })).filter(c => c.name);

                const existingNameMobile = new Set(
                    state.customers.map(c => `${(c.name || '').toLowerCase().trim()}|${(c.mobile || '').trim()}`)
                );

                const importedTransactions = validArray(raw.transactions).map((t, idx) => {
                    const start = new Date(t?.start || t?.start_time);
                    const end = new Date(t?.end || t?.end_time);
                    const date = new Date(t?.date || t?.created_at || t?.start || Date.now());
                    const id = t?.id !== undefined ? parseInt(t.id, 10) : (Date.now() + idx);
                    const duration = calculateDuration(start, end);
                    const rateType = t?.rateType ?? (t?.rate_type === 'minute' ? 'minute' : 'hourly');
                    const rawRateAmount = t?.rateAmount ?? t?.rate_amount;
                    const parsedRateAmount = typeof rawRateAmount === 'number'
                        ? rawRateAmount
                        : parseFloat(rawRateAmount);
                    const rateAmount = Number.isFinite(parsedRateAmount)
                        ? parsedRateAmount
                        : (rateType === 'minute' ? RATE_CONFIG.minute : RATE_CONFIG.hourly);
                    const paymentStatus = t?.paymentStatus ?? (t?.payment_status === 'paid' ? 'paid' : 'due');
                    return {
                        id,
                        customerId: normalizeId(t?.customerId || t?.customer_id),
                        start: start.toISOString(),
                        end: end.toISOString(),
                        durationMinutes: duration.totalMinutes,
                        rateType,
                        rateAmount,
                        amount: typeof t?.amount === 'number' && isFinite(t.amount) ? t.amount : (typeof t?.total_amount === 'number' && isFinite(t.total_amount) ? t.total_amount : 0),
                        currency: CURRENCY_SYMBOL,
                        date: date.toISOString(),
                        timeSlots: Array.isArray(t?.timeSlots || t?.time_slots) ? (t.timeSlots || t.time_slots) : null,
                        combined: Boolean(t?.combined),
                        paymentStatus,
                        notes: t?.notes || '',
                        deviceType: t?.deviceType || t?.device_type || ''
                    };
                }).filter(t => normalizeId(t.customerId) && t.durationMinutes > 0);

                if (!supabase) {
                    showNotification('Database is offline. Cannot import data.', true);
                    return;
                }

                showNotification('Importing customers...', false, 2000);

                // Map old customer IDs to new generated IDs
                const customerIdMap = {};

                for (const c of importedCustomers) {
                    const key = `${(c.name || '').toLowerCase().trim()}|${(c.mobile || '').trim()}`;
                    if (existingNameMobile.has(key)) {
                        const existingCustomer = state.customers.find(ex =>
                            (ex.name || '').toLowerCase().trim() === (c.name || '').toLowerCase().trim()
                            && (ex.mobile || '').trim() === (c.mobile || '').trim()
                        );
                        if (existingCustomer && c.id !== undefined) {
                            customerIdMap[c.id] = existingCustomer.id;
                        }
                        continue;
                    }
                    const payload = {
                        name: c.name,
                        phone: c.mobile || null
                    };
                    const { data, error } = await supabase.from('customers').insert([payload]).select();
                    if (error) throw error;
                    if (data && data[0]) {
                        const newCustomer = fromDbCustomer(data[0]);
                        state.customers.push(newCustomer);
                        existingNameMobile.add(key);
                        if (c.id !== undefined) {
                            customerIdMap[c.id] = newCustomer.id;
                        }
                    }
                }

                showNotification('Importing sessions...', false, 2000);

                const sessionsToInsert = [];
                for (const t of importedTransactions) {
                    const newCustId = customerIdMap[t.customerId];
                    if (!newCustId) continue;

                    const payload = toDbCalculation({
                        ...t,
                        customerId: newCustId
                    });
                    sessionsToInsert.push(payload);
                }

                if (sessionsToInsert.length > 0) {
                    const { error } = await supabase.from('sessions').insert(sessionsToInsert);
                    if (error) throw error;
                }

                if (raw.appSettings && typeof raw.appSettings === 'object') {
                    const importedHourly = parseInt(raw.appSettings.fixedHourlyRate, 10);
                    const importedMinute = parseInt(raw.appSettings.fixedMinuteRate, 10);
                    if (Number.isFinite(importedHourly) && importedHourly > 0) {
                        localStorage.setItem('fixed_hourly_rate', String(importedHourly));
                        RATE_CONFIG.hourly = importedHourly;
                    }
                    if (Number.isFinite(importedMinute) && importedMinute > 0) {
                        localStorage.setItem('fixed_minute_rate', String(importedMinute));
                        RATE_CONFIG.minute = importedMinute;
                    }
                    if (raw.appSettings.theme === 'dark' || raw.appSettings.theme === 'light') {
                        localStorage.setItem('theme', raw.appSettings.theme);
                    }
                    if (raw.appSettings.palette) {
                        localStorage.setItem('palette', String(raw.appSettings.palette));
                    }
                }

                await Promise.all([loadCustomers(), loadTransactions()]);
                showNotification('Data imported successfully');
            } catch (err) {
                console.error('Import error:', err);
                showNotification('Failed to import data. Please check file format.', true);
            }
            DOM.importDataInput.value = '';
        };
        reader.readAsText(file);
    });
}

// Settings Page Connect/Wipe Logic
function initSettingsPage() {
    const urlDisplayEl = document.getElementById('settingsSupabaseUrlDisplay');
    const clearBtn = document.getElementById('clearAllDataBtn');
    const prefThemeToggle = document.getElementById('prefThemeToggle');
    const apiSections = document.querySelectorAll('[data-api-settings]');

    if (apiSections.length > 0) {
        const configured = hasSupabaseConfig();
        apiSections.forEach((section) => {
            section.hidden = configured;
        });
    }
    const hourlyRateInput = document.getElementById('hourlyRateInput');
    const minuteRateInput = document.getElementById('minuteRateInput');

    if (hourlyRateInput) {
        hourlyRateInput.value = RATE_CONFIG.hourly;
        hourlyRateInput.addEventListener('input', () => {
            let val = parseInt(hourlyRateInput.value, 10);
            if (isNaN(val) || val < 0) val = 0;
            RATE_CONFIG.hourly = val;
            localStorage.setItem('fixed_hourly_rate', val);
            updateDynamicRatesDisplay();
        });
    }

    if (minuteRateInput) {
        minuteRateInput.value = RATE_CONFIG.minute;
        minuteRateInput.addEventListener('input', () => {
            let val = parseInt(minuteRateInput.value, 10);
            if (isNaN(val) || val < 0) val = 0;
            RATE_CONFIG.minute = val;
            localStorage.setItem('fixed_minute_rate', val);
            updateDynamicRatesDisplay();
        });
    }

    if (urlDisplayEl && window.ENV_SUPABASE_URL) {
        try {
            const urlObj = new URL(window.ENV_SUPABASE_URL);
            const hostname = urlObj.hostname;
            const parts = hostname.split('.');
            if (parts.length >= 3) {
                const subdomain = parts[0];
                const maskedSubdomain = subdomain.slice(0, 4) + '********';
                parts[0] = maskedSubdomain;
            }
            urlDisplayEl.textContent = `${urlObj.protocol}//${parts.join('.')}`;
        } catch (_) {
            urlDisplayEl.textContent = window.ENV_SUPABASE_URL;
        }
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', async () => {
            if (!confirm('Are you absolutely sure you want to delete ALL data? This will clear sessions and customers permanently.')) {
                return;
            }
            if (!supabase) {
                showNotification('Database offline. Cannot clear data.', true);
                return;
            }
            try {
                // Delete all transactions and customers matching non-empty identifier conditions
                const { error: calcError } = await supabase.from('sessions').delete().neq('id', 0);
                if (calcError) throw calcError;

                const { error: custError } = await supabase.from('customers').delete().neq('id', 0);
                if (custError) throw custError;

                state.transactions = [];
                state.customers = [];

                updateCustomerList();
                updateCustomerSelect();
                updateCustomerFilterDropdown();
                updateHistoryList();
                updateAnalytics();

                showNotification('All database records cleared successfully');
            } catch (e) {
                console.error('Clear database failure:', e);
                showNotification('Failed to clear database.', true);
            }
        });
    }

    if (prefThemeToggle) {
        const isDark = document.body.classList.contains('dark-mode');
        if (prefThemeToggle.tagName === 'INPUT') {
            prefThemeToggle.checked = isDark;
        } else {
            const icon = prefThemeToggle.querySelector('i');
            if (icon) {
                icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }
        }

        prefThemeToggle.addEventListener('change', () => {
            DOM.body.classList.toggle('dark-mode');
            const nowDark = DOM.body.classList.contains('dark-mode');
            localStorage.setItem('theme', nowDark ? 'dark' : 'light');
            
            const mainThemeToggle = document.getElementById('themeToggle');
            const mainIcon = mainThemeToggle?.querySelector('i');
            if (mainIcon) {
                mainIcon.className = nowDark ? 'fas fa-sun' : 'fas fa-moon';
            }
            if (prefThemeToggle.tagName === 'INPUT') {
                prefThemeToggle.checked = nowDark;
            } else {
                const icon = prefThemeToggle.querySelector('i');
                if (icon) {
                    icon.className = nowDark ? 'fas fa-sun' : 'fas fa-moon';
                }
            }
        });
    }
}

// Dynamic save button text behavior
function updateSaveButtonState() {
    if (!DOM.addTransactionBtn) return;
    const customerId = DOM.customerSelect?.value;
    if (!customerId) {
        DOM.addTransactionBtn.innerHTML = '<i class="fas fa-copy"></i> Calculate Only';
    } else {
        DOM.addTransactionBtn.innerHTML = '<i class="fas fa-save"></i> Save Session';
    }
}

// Calculator Logic Wiring
function initCalculatorPage() {
    const durationTab = document.getElementById('modeDurationTab');
    const rangeTab = document.getElementById('modeRangeTab');
    const durationContainer = document.getElementById('durationInputContainer');
    const rangeContainer = document.getElementById('rangeInputContainer');

    if (durationTab && rangeTab && durationContainer && rangeContainer) {
        durationTab.addEventListener('click', () => {
            durationTab.classList.add('active');
            durationTab.setAttribute('aria-selected', 'true');
            rangeTab.classList.remove('active');
            rangeTab.setAttribute('aria-selected', 'false');
            durationContainer.style.display = 'block';
            rangeContainer.style.display = 'none';
            state.calculatorMode = 'duration';
            renderCalculationSummary();
        });

        rangeTab.addEventListener('click', () => {
            rangeTab.classList.add('active');
            rangeTab.setAttribute('aria-selected', 'true');
            durationTab.classList.remove('active');
            durationTab.setAttribute('aria-selected', 'false');
            rangeContainer.style.display = 'block';
            durationContainer.style.display = 'none';
            state.calculatorMode = 'range';
            renderCalculationSummary();
        });
    }

    // Steppers and adjustments
    document.getElementById('decHours')?.addEventListener('click', () => adjustHours(-1));
    document.getElementById('incHours')?.addEventListener('click', () => adjustHours(1));
    document.getElementById('decMinutes')?.addEventListener('click', () => adjustMinutes(-1));
    document.getElementById('incMinutes')?.addEventListener('click', () => adjustMinutes(1));

    document.getElementById('presetAdd15m')?.addEventListener('click', () => adjustMinutes(15));
    document.getElementById('presetAdd30m')?.addEventListener('click', () => adjustMinutes(30));
    document.getElementById('presetAdd1h')?.addEventListener('click', () => adjustHours(1));
    document.getElementById('presetReset')?.addEventListener('click', () => {
        const hoursInput = document.getElementById('durationHours');
        const minutesInput = document.getElementById('durationMinutes');
        if (hoursInput) hoursInput.value = 0;
        if (minutesInput) minutesInput.value = 0;
        renderCalculationSummary();
    });

    const hoursInput = document.getElementById('durationHours');
    const minutesInput = document.getElementById('durationMinutes');
    hoursInput?.addEventListener('input', () => {
        let val = parseInt(hoursInput.value, 10) || 0;
        if (val < 0) hoursInput.value = 0;
        renderCalculationSummary();
    });
    minutesInput?.addEventListener('input', () => {
        let val = parseInt(minutesInput.value, 10) || 0;
        if (val < 0) {
            minutesInput.value = 0;
        } else if (val > 59) {
            const hoursInput = document.getElementById('durationHours');
            if (hoursInput) {
                let hrs = parseInt(hoursInput.value, 10) || 0;
                hoursInput.value = hrs + Math.floor(val / 60);
            }
            minutesInput.value = val % 60;
        }
        renderCalculationSummary();
    });

    DOM.startTimeInput?.addEventListener('input', renderCalculationSummary);
    DOM.endTimeInput?.addEventListener('input', renderCalculationSummary);

    // Initial state check and change listener
    updateSaveButtonState();
    DOM.customerSelect?.addEventListener('change', updateSaveButtonState);
}

// Event Listeners Initialization
if (DOM.hardRefresh) {
    DOM.hardRefresh.addEventListener('click', () => {
        if (confirm('Refresh the page?')) window.location.reload();
    });
}

if (DOM.addTransactionBtn) {
    DOM.addTransactionBtn.addEventListener('click', addTransaction);
}

if (DOM.addCustomerBtn) {
    DOM.addCustomerBtn.addEventListener('click', addCustomer);
}

let searchTimeout;
if (DOM.historySearch) {
    DOM.historySearch.addEventListener('input', () => {
        if (DOM.clearSearchBtn) {
            DOM.clearSearchBtn.style.display = DOM.historySearch.value ? 'flex' : 'none';
        }
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            state.historyPage = 1;
            updateHistoryList(DOM.historySearch.value);
        }, 300);
    });
}

if (DOM.clearSearchBtn) {
    DOM.clearSearchBtn.addEventListener('click', () => {
        if (DOM.historySearch) {
            DOM.historySearch.value = '';
            if (DOM.clearSearchBtn) DOM.clearSearchBtn.style.display = 'none';
            state.historyPage = 1;
            updateHistoryList();
        }
    });
}

DOM.historyStartDate?.addEventListener('change', () => {
    state.historyPage = 1;
    updateHistoryList(DOM.historySearch?.value || '');
});

DOM.historyEndDate?.addEventListener('change', () => {
    state.historyPage = 1;
    updateHistoryList(DOM.historySearch?.value || '');
});

DOM.historySort?.addEventListener('change', () => {
    state.historyPage = 1;
    updateHistoryList(DOM.historySearch?.value || '');
});

if (DOM.customerSearch) {
    DOM.customerSearch.addEventListener('input', () => {
        if (DOM.clearCustomerSearchBtn) {
            DOM.clearCustomerSearchBtn.style.display = DOM.customerSearch.value ? 'flex' : 'none';
        }
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => updateCustomerList(DOM.customerSearch.value), 300);
    });
}

if (DOM.clearCustomerSearchBtn) {
    DOM.clearCustomerSearchBtn.addEventListener('click', () => {
        if (DOM.customerSearch) {
            DOM.customerSearch.value = '';
            if (DOM.clearCustomerSearchBtn) DOM.clearCustomerSearchBtn.style.display = 'none';
            updateCustomerList();
        }
    });
}

if (DOM.rateType) {
    DOM.rateType.addEventListener('change', () => {
        updateRateDisplay();
        renderCalculationSummary();
    });
}

function attachValidation() {
    DOM.startTimeInput?.addEventListener('change', () => {
        const s = new Date(DOM.startTimeInput.value);
        const e = new Date(DOM.endTimeInput.value);
        if (isNaN(s) || (e && !isNaN(e) && e <= s)) {
            DOM.startTimeInput.classList.add('error');
            showNotification('Start time must be before end time', true);
        } else {
            DOM.startTimeInput.classList.remove('error');
            DOM.endTimeInput?.classList.remove('error');
        }
    });
    DOM.endTimeInput?.addEventListener('change', () => {
        const s = new Date(DOM.startTimeInput.value);
        const e = new Date(DOM.endTimeInput.value);
        if (isNaN(e) || (s && !isNaN(s) && e <= s)) {
            DOM.endTimeInput.classList.add('error');
            showNotification('End time must be after start time', true);
        } else {
            DOM.startTimeInput?.classList.remove('error');
            DOM.endTimeInput.classList.remove('error');
        }
    });
}
attachValidation();

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        window.location.href = 'customers.html';
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        window.location.href = 'history.html';
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        DOM.exportJSONBtn?.click();
    }
});

// App Startup Block
(async () => {
    try {
        // Theme sync
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            DOM.body.classList.add('dark-mode');
            const icon = DOM.themeToggle?.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-sun';
            }
        }
        
        // Palette sync
        const savedPalette = localStorage.getItem('palette') || 'mint';
        applyPalette(savedPalette);
        if (DOM.paletteSelect) DOM.paletteSelect.value = savedPalette;

        setActiveNav();
        setDateInputsToNow();
        
        // Sidebar state sync on desktop
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) {
            const savedState = localStorage.getItem('sidebarState');
            if (savedState === 'collapsed') {
                DOM.body.classList.add('sidebar-collapsed');
            } else {
                DOM.body.classList.remove('sidebar-collapsed');
            }
        }

        // Initialize Supabase & verify connection status
        initSupabase();
        await checkSupabaseConnection();

        // Load data from DB if credentials exist
        const needsCustomers = Boolean(DOM.customerSelect || DOM.customerList || DOM.historyCustomerFilter);
        const needsTransactions = Boolean(
            DOM.historyList
            || DOM.analyticsDashboard
            || DOM.customerList
            || document.getElementById('customerDetailsCard')
        );
        if (needsCustomers) await loadCustomers();
        if (needsTransactions) await loadTransactions();

        // Update default displays
        updateRateDisplay();
        renderCalculationSummary();

        // Page-specific setup
        const page = document.body.dataset.page;
        if (page === 'settings') {
            initSettingsPage();
        } else if (page === 'calculator') {
            initCalculatorPage();
        } else if (page === 'customer-details') {
            initCustomerDetailsPage();
        }

    } catch (error) {
        console.error('Initialization error:', error);
        showNotification('Failed to initialize application', true);
    }
})();
})();
