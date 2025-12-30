const ORS_API_KEY = "5b3ce3597851110001cf6248f2a4d2c0e7e240db8fa43c2b4982bc9e";

/* ================================
   BANGLADESH MAP SETUP
================================ */

const BANGLADESH_BOUNDS = L.latLngBounds(
    [20.5, 88.0],
    [26.7, 92.7]
);

const map = L.map("map", {
    center: [23.8103, 90.4125],
    zoom: 7,
    minZoom: 6,
    maxZoom: 18,
    maxBounds: BANGLADESH_BOUNDS,
    maxBoundsViscosity: 1.0
});

// Google Maps tiles
const googleStreets = L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
    attribution: '&copy; Google Maps',
    maxZoom: 21
}).addTo(map);

const googleHybrid = L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
    maxZoom: 21
});

L.control.layers({
    "📍 Map": googleStreets,
    "🛰️ Satellite": googleHybrid
}, null, { position: "topright", collapsed: true }).addTo(map);

let routeLayer = null;
let startMarker = null;
let endMarker = null;

/* ================================
   CITY COORDINATES
================================ */

const CITY_COORDS = {
    "dhaka": { lat: 23.8103, lng: 90.4125, name: "Dhaka" },
    "chittagong": { lat: 22.3569, lng: 91.7832, name: "Chittagong" },
    "khulna": { lat: 22.8456, lng: 89.5403, name: "Khulna" },
    "rajshahi": { lat: 24.3745, lng: 88.6042, name: "Rajshahi" },
    "sylhet": { lat: 24.8949, lng: 91.8687, name: "Sylhet" },
    "rangpur": { lat: 25.7439, lng: 89.2752, name: "Rangpur" },
    "barisal": { lat: 22.7010, lng: 90.3535, name: "Barisal" },
    "mymensingh": { lat: 24.7471, lng: 90.4203, name: "Mymensingh" },
    "cox's bazar": { lat: 21.4272, lng: 91.9718, name: "Cox's Bazar" },
    "comilla": { lat: 23.4607, lng: 91.1809, name: "Comilla" },
    "gazipur": { lat: 23.9999, lng: 90.4203, name: "Gazipur" },
    "narayanganj": { lat: 23.6238, lng: 90.4996, name: "Narayanganj" },
    "bogra": { lat: 24.8510, lng: 89.3697, name: "Bogra" },
    "jessore": { lat: 23.1667, lng: 89.2167, name: "Jessore" },
    "dinajpur": { lat: 25.6217, lng: 88.6354, name: "Dinajpur" },
    "tangail": { lat: 24.2513, lng: 89.9167, name: "Tangail" },
    "savar": { lat: 23.8583, lng: 90.2667, name: "Savar" },
    "tongi": { lat: 23.9333, lng: 90.4000, name: "Tongi" },
    "brahmanbaria": { lat: 23.9571, lng: 91.1111, name: "Brahmanbaria" },
    "feni": { lat: 23.0159, lng: 91.3976, name: "Feni" },
    "noakhali": { lat: 22.8696, lng: 91.0995, name: "Noakhali" },
    "bandarban": { lat: 22.1953, lng: 92.2184, name: "Bandarban" },
    "rangamati": { lat: 22.6372, lng: 92.1988, name: "Rangamati" },
    "khagrachari": { lat: 23.1193, lng: 91.9847, name: "Khagrachari" },
    "sreemangal": { lat: 24.3065, lng: 91.7296, name: "Sreemangal" },
    "saint martin": { lat: 20.6273, lng: 92.3226, name: "Saint Martin" },
    "kuakata": { lat: 21.8167, lng: 90.1167, name: "Kuakata" },
    "sundarbans": { lat: 21.9497, lng: 89.1833, name: "Sundarbans" },
    "sajek": { lat: 23.3817, lng: 92.2931, name: "Sajek" },
    "teknaf": { lat: 20.8625, lng: 92.2900, name: "Teknaf" },
    "pabna": { lat: 24.0063, lng: 89.2372, name: "Pabna" },
    "jamalpur": { lat: 24.9375, lng: 89.9372, name: "Jamalpur" },
    "netrokona": { lat: 24.8833, lng: 90.7333, name: "Netrokona" },
    "kishoreganj": { lat: 24.4449, lng: 90.7766, name: "Kishoreganj" },
    "narsingdi": { lat: 23.9322, lng: 90.7151, name: "Narsingdi" },
    "manikganj": { lat: 23.8644, lng: 90.0047, name: "Manikganj" },
    "munshiganj": { lat: 23.5422, lng: 90.5305, name: "Munshiganj" },
    "faridpur": { lat: 23.6070, lng: 89.8429, name: "Faridpur" },
    "madaripur": { lat: 23.1641, lng: 90.1897, name: "Madaripur" },
    "gopalganj": { lat: 23.0050, lng: 89.8267, name: "Gopalganj" },
    "satkhira": { lat: 22.7185, lng: 89.0705, name: "Satkhira" },
    "bagerhat": { lat: 22.6512, lng: 89.7851, name: "Bagerhat" },
    "patuakhali": { lat: 22.3596, lng: 90.3290, name: "Patuakhali" },
    "bhola": { lat: 22.6859, lng: 90.6482, name: "Bhola" },
    "barguna": { lat: 22.1530, lng: 90.1266, name: "Barguna" },
    "jhalokati": { lat: 22.6406, lng: 90.1987, name: "Jhalokati" },
    "pirojpur": { lat: 22.5841, lng: 89.9720, name: "Pirojpur" }
};

/* ================================
   BUS OPERATORS
================================ */

const BUS_OPERATORS = {
    "greenline": {
        name: "Green Line Paribahan",
        logo: "🟢",
        type: "AC",
        rating: 4.5
    },
    "hanif": {
        name: "Hanif Enterprise",
        logo: "🔵",
        type: "AC/Non-AC",
        rating: 4.3
    },
    "shyamoli": {
        name: "Shyamoli Paribahan",
        logo: "🟡",
        type: "AC/Non-AC",
        rating: 4.2
    },
    "ena": {
        name: "Ena Transport",
        logo: "🔴",
        type: "AC",
        rating: 4.4
    },
    "saintmartin": {
        name: "Saint Martin Paribahan",
        logo: "🟣",
        type: "AC",
        rating: 4.1
    },
    "sohag": {
        name: "Sohag Paribahan",
        logo: "🟠",
        type: "Non-AC",
        rating: 3.9
    }
};

/* ================================
   BUS ROUTES & SCHEDULES
================================ */

const BUS_ROUTES = {
    "dhaka-chittagong": {
        from: "dhaka",
        to: "chittagong",
        distance: 264,
        duration: 5.5,
        buses: [
            { operator: "greenline", departure: "06:00", fare: 1200, seats: 36 },
            { operator: "greenline", departure: "10:00", fare: 1200, seats: 36 },
            { operator: "greenline", departure: "22:00", fare: 1400, seats: 36 },
            { operator: "hanif", departure: "07:00", fare: 1000, seats: 40 },
            { operator: "hanif", departure: "14:00", fare: 1000, seats: 40 },
            { operator: "hanif", departure: "23:00", fare: 1100, seats: 40 },
            { operator: "ena", departure: "08:00", fare: 1100, seats: 36 },
            { operator: "ena", departure: "21:00", fare: 1300, seats: 36 },
            { operator: "shyamoli", departure: "09:00", fare: 900, seats: 44 },
            { operator: "shyamoli", departure: "15:00", fare: 900, seats: 44 }
        ]
    },
    "dhaka-khulna": {
        from: "dhaka",
        to: "khulna",
        distance: 280,
        duration: 6,
        buses: [
            { operator: "greenline", departure: "07:00", fare: 1100, seats: 36 },
            { operator: "greenline", departure: "21:00", fare: 1300, seats: 36 },
            { operator: "hanif", departure: "08:00", fare: 950, seats: 40 },
            { operator: "hanif", departure: "22:00", fare: 1050, seats: 40 },
            { operator: "sohag", departure: "06:00", fare: 650, seats: 48 },
            { operator: "sohag", departure: "14:00", fare: 650, seats: 48 }
        ]
    },
    "dhaka-sylhet": {
        from: "dhaka",
        to: "sylhet",
        distance: 240,
        duration: 4.5,
        buses: [
            { operator: "greenline", departure: "06:30", fare: 1000, seats: 36 },
            { operator: "greenline", departure: "14:00", fare: 1000, seats: 36 },
            { operator: "shyamoli", departure: "07:00", fare: 800, seats: 44 },
            { operator: "shyamoli", departure: "15:00", fare: 800, seats: 44 },
            { operator: "ena", departure: "08:00", fare: 950, seats: 36 },
            { operator: "hanif", departure: "09:00", fare: 850, seats: 40 }
        ]
    },
    "dhaka-cox's bazar": {
        from: "dhaka",
        to: "cox's bazar",
        distance: 391,
        duration: 9,
        buses: [
            { operator: "greenline", departure: "21:00", fare: 1800, seats: 36 },
            { operator: "greenline", departure: "22:00", fare: 1800, seats: 36 },
            { operator: "hanif", departure: "20:00", fare: 1500, seats: 40 },
            { operator: "hanif", departure: "21:30", fare: 1500, seats: 40 },
            { operator: "saintmartin", departure: "21:00", fare: 1600, seats: 36 },
            { operator: "saintmartin", departure: "22:30", fare: 1600, seats: 36 }
        ]
    },
    "dhaka-rajshahi": {
        from: "dhaka",
        to: "rajshahi",
        distance: 254,
        duration: 5,
        buses: [
            { operator: "greenline", departure: "08:00", fare: 1050, seats: 36 },
            { operator: "greenline", departure: "22:00", fare: 1250, seats: 36 },
            { operator: "hanif", departure: "07:00", fare: 900, seats: 40 },
            { operator: "shyamoli", departure: "09:00", fare: 750, seats: 44 },
            { operator: "sohag", departure: "06:00", fare: 550, seats: 48 }
        ]
    },
    "dhaka-rangpur": {
        from: "dhaka",
        to: "rangpur",
        distance: 296,
        duration: 6,
        buses: [
            { operator: "greenline", departure: "21:00", fare: 1200, seats: 36 },
            { operator: "hanif", departure: "20:00", fare: 1000, seats: 40 },
            { operator: "hanif", departure: "22:00", fare: 1000, seats: 40 },
            { operator: "shyamoli", departure: "21:30", fare: 850, seats: 44 }
        ]
    },
    "dhaka-barisal": {
        from: "dhaka",
        to: "barisal",
        distance: 180,
        duration: 4,
        buses: [
            { operator: "greenline", departure: "07:00", fare: 900, seats: 36 },
            { operator: "hanif", departure: "08:00", fare: 750, seats: 40 },
            { operator: "shyamoli", departure: "06:30", fare: 650, seats: 44 },
            { operator: "sohag", departure: "09:00", fare: 500, seats: 48 }
        ]
    },
    "chittagong-cox's bazar": {
        from: "chittagong",
        to: "cox's bazar",
        distance: 152,
        duration: 3.5,
        buses: [
            { operator: "greenline", departure: "08:00", fare: 700, seats: 36 },
            { operator: "greenline", departure: "14:00", fare: 700, seats: 36 },
            { operator: "hanif", departure: "07:00", fare: 550, seats: 40 },
            { operator: "hanif", departure: "13:00", fare: 550, seats: 40 },
            { operator: "saintmartin", departure: "09:00", fare: 650, seats: 36 }
        ]
    }
};

/* ================================
   SEAT MANAGEMENT
================================ */

// Seat states: 'available', 'selected', 'pending', 'booked'
let seatData = {};
let selectedSeats = [];
let currentBooking = {
    route: null,
    bus: null,
    seats: [],
    passenger: null
};

// Generate random seat statuses for demo
function generateSeatData(busId, totalSeats) {
    const seats = {};
    const seatLayout = getSeatLayout(totalSeats);

    seatLayout.forEach(seatId => {
        if (seatId === 'aisle') return;

        const random = Math.random();
        if (random < 0.25) {
            seats[seatId] = 'booked';
        } else if (random < 0.35) {
            seats[seatId] = 'pending';
        } else {
            seats[seatId] = 'available';
        }
    });

    return seats;
}

// Get seat layout based on bus size
function getSeatLayout(totalSeats) {
    const layout = [];
    const rows = Math.ceil(totalSeats / 4);

    for (let row = 1; row <= rows; row++) {
        const rowLetter = String.fromCharCode(64 + row); // A, B, C, etc.
        layout.push(`${rowLetter}1`);
        layout.push(`${rowLetter}2`);
        layout.push('aisle');
        layout.push(`${rowLetter}3`);
        layout.push(`${rowLetter}4`);
    }

    return layout;
}

// Render seat grid
function renderSeats(busId, totalSeats) {
    const seatGrid = document.getElementById('seat-grid');
    seatGrid.innerHTML = '';

    seatData[busId] = seatData[busId] || generateSeatData(busId, totalSeats);
    selectedSeats = [];

    const layout = getSeatLayout(totalSeats);

    layout.forEach(seatId => {
        const seatDiv = document.createElement('div');
        seatDiv.className = 'seat';

        if (seatId === 'aisle') {
            seatDiv.classList.add('aisle');
        } else {
            const status = seatData[busId][seatId];
            seatDiv.classList.add(status);
            seatDiv.textContent = seatId;
            seatDiv.dataset.seatId = seatId;

            if (status === 'available') {
                seatDiv.onclick = () => toggleSeatSelection(busId, seatId, seatDiv);
            }
        }

        seatGrid.appendChild(seatDiv);
    });

    updateSeatSummary();
}

// Toggle seat selection
function toggleSeatSelection(busId, seatId, element) {
    const currentStatus = seatData[busId][seatId];

    if (currentStatus === 'available') {
        // Select the seat
        seatData[busId][seatId] = 'selected';
        element.classList.remove('available');
        element.classList.add('selected');
        selectedSeats.push(seatId);
    } else if (currentStatus === 'selected') {
        // Deselect the seat
        seatData[busId][seatId] = 'available';
        element.classList.remove('selected');
        element.classList.add('available');
        selectedSeats = selectedSeats.filter(s => s !== seatId);
    }

    updateSeatSummary();
}

// Update seat selection summary
function updateSeatSummary() {
    const seatsList = document.getElementById('selected-seats-list');
    const totalFare = document.getElementById('total-fare');
    const proceedBtn = document.getElementById('proceed-btn');

    if (selectedSeats.length === 0) {
        seatsList.textContent = 'None';
        totalFare.textContent = '৳0';
        proceedBtn.disabled = true;
    } else {
        seatsList.textContent = selectedSeats.join(', ');
        const fare = currentBooking.bus.fare * selectedSeats.length;
        totalFare.textContent = `৳${fare.toLocaleString()}`;
        proceedBtn.disabled = false;
    }
}

/* ================================
   BOOKING FLOW
================================ */

// Normalize city names to match route keys
function normalizeCityName(input) {
    const normalized = input.toLowerCase().trim();

    // Map common variations to route keys
    const cityMap = {
        'dhaka': 'dhaka', 'ঢাকা': 'dhaka',
        'chittagong': 'chittagong', 'chattogram': 'chittagong', 'চট্টগ্রাম': 'chittagong',
        'khulna': 'khulna', 'খুলনা': 'khulna',
        'rajshahi': 'rajshahi', 'রাজশাহী': 'rajshahi',
        'sylhet': 'sylhet', 'সিলেট': 'sylhet',
        'rangpur': 'rangpur', 'রংপুর': 'rangpur',
        'barisal': 'barisal', 'barishal': 'barisal', 'বরিশাল': 'barisal',
        'mymensingh': 'mymensingh', 'ময়মনসিংহ': 'mymensingh',
        "cox's bazar": "cox's bazar", 'coxs bazar': "cox's bazar", 'cox bazar': "cox's bazar", 'কক্সবাজার': "cox's bazar",
        'comilla': 'comilla', 'cumilla': 'comilla', 'কুমিল্লা': 'comilla',
        'gazipur': 'gazipur', 'গাজীপুর': 'gazipur',
        'narayanganj': 'narayanganj', 'নারায়ণগঞ্জ': 'narayanganj',
        'bogra': 'bogra', 'bogura': 'bogra', 'বগুড়া': 'bogra',
        'jessore': 'jessore', 'jashore': 'jessore', 'যশোর': 'jessore',
        'dinajpur': 'dinajpur', 'দিনাজপুর': 'dinajpur',
        'tangail': 'tangail', 'টাঙ্গাইল': 'tangail',
        'savar': 'savar', 'সাভার': 'savar',
        'bandarban': 'bandarban', 'বান্দরবান': 'bandarban',
        'rangamati': 'rangamati', 'রাঙামাটি': 'rangamati',
        'sreemangal': 'sreemangal', 'শ্রীমঙ্গল': 'sreemangal',
        'saint martin': 'saint martin', 'st martin': 'saint martin', 'সেন্ট মার্টিন': 'saint martin',
        'kuakata': 'kuakata', 'কুয়াকাটা': 'kuakata',
        'sundarbans': 'sundarbans', 'সুন্দরবন': 'sundarbans',
        'sajek': 'sajek', 'সাজেক': 'sajek',
        'teknaf': 'teknaf', 'টেকনাফ': 'teknaf'
    };

    // Try exact match first
    if (cityMap[normalized]) {
        return cityMap[normalized];
    }

    // Try partial match
    for (const [key, value] of Object.entries(cityMap)) {
        if (normalized.includes(key) || key.includes(normalized)) {
            return value;
        }
    }

    // Return as-is for custom locations
    return normalized;
}

let currentStep = 1;

// Set today as minimum date
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('travel-date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
});

// Swap cities
function swapCities() {
    const from = document.getElementById('from-city');
    const to = document.getElementById('to-city');
    const temp = from.value;
    from.value = to.value;
    to.value = temp;
}

// Search buses
async function searchBuses() {
    const fromInput = document.getElementById('from-city').value.trim();
    const toInput = document.getElementById('to-city').value.trim();
    const date = document.getElementById('travel-date').value;

    if (!fromInput || !toInput) {
        alert('Please enter both departure and destination cities');
        return;
    }

    if (fromInput.toLowerCase() === toInput.toLowerCase()) {
        alert('Departure and destination cannot be the same');
        return;
    }

    // Normalize city names to lowercase keys
    const from = normalizeCityName(fromInput);
    const to = normalizeCityName(toInput);

    // Find route
    const routeKey = `${from}-${to}`;
    const reverseRouteKey = `${to}-${from}`;
    let route = BUS_ROUTES[routeKey] || BUS_ROUTES[reverseRouteKey];

    if (!route) {
        // Generate a default route for cities without direct routes
        route = {
            from: from,
            to: to,
            distance: Math.floor(Math.random() * 200 + 150),
            duration: Math.floor(Math.random() * 4 + 3),
            buses: [
                { operator: "hanif", departure: "07:00", fare: 800, seats: 40 },
                { operator: "shyamoli", departure: "10:00", fare: 650, seats: 44 },
                { operator: "sohag", departure: "14:00", fare: 500, seats: 48 }
            ]
        };
    }

    currentBooking.route = { ...route, date: date, fromCity: from, toCity: to };

    // Show route on map
    await showRouteOnMap(from, to);

    // Display route summary
    renderRouteSummary();

    // Display bus list
    renderBusList(route.buses);

    // Go to step 2
    goToStep(2);
}

// Render route summary
function renderRouteSummary() {
    const summary = document.getElementById('route-summary');
    const route = currentBooking.route;
    const fromCity = CITY_COORDS[route.fromCity]?.name || route.fromCity;
    const toCity = CITY_COORDS[route.toCity]?.name || route.toCity;
    const dateStr = new Date(route.date).toLocaleDateString('en-BD', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });

    summary.innerHTML = `
        <div class="route-cities">
            <span class="city-name">${fromCity}</span>
            <span class="route-arrow">→</span>
            <span class="city-name">${toCity}</span>
        </div>
        <span class="route-date">📅 ${dateStr}</span>
    `;
}

// Render bus list
function renderBusList(buses) {
    const busList = document.getElementById('bus-list');
    busList.innerHTML = '';

    buses.forEach((bus, index) => {
        const operator = BUS_OPERATORS[bus.operator];
        const arrivalTime = calculateArrivalTime(bus.departure, currentBooking.route.duration);

        const busCard = document.createElement('div');
        busCard.className = 'bus-card';
        busCard.onclick = () => selectBus(index, bus);

        busCard.innerHTML = `
            <div class="bus-header">
                <div class="bus-operator">
                    <span class="operator-logo">${operator.logo}</span>
                    <div class="operator-info">
                        <h3>${operator.name}</h3>
                        <span class="operator-type">${operator.type}</span>
                    </div>
                </div>
                <div class="bus-fare">
                    <div class="fare-amount">৳${bus.fare.toLocaleString()}</div>
                    <div class="fare-label">per seat</div>
                </div>
            </div>
            <div class="bus-details">
                <div class="detail-item">
                    <span class="detail-label">Departure</span>
                    <span class="detail-value">${bus.departure}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Arrival</span>
                    <span class="detail-value">${arrivalTime}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Duration</span>
                    <span class="detail-value">${currentBooking.route.duration}h</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Seats</span>
                    <span class="detail-value">${bus.seats}</span>
                </div>
            </div>
        `;

        busList.appendChild(busCard);
    });
}

// Select a bus
function selectBus(index, bus) {
    // Highlight selected bus
    document.querySelectorAll('.bus-card').forEach((card, i) => {
        card.classList.toggle('selected', i === index);
    });

    currentBooking.bus = bus;

    // Generate unique bus ID for seat tracking
    const busId = `${currentBooking.route.fromCity}-${currentBooking.route.toCity}-${bus.operator}-${bus.departure}`;
    currentBooking.busId = busId;

    // Update selected bus info
    const operator = BUS_OPERATORS[bus.operator];
    document.getElementById('selected-bus-info').innerHTML = `
        <div>
            <span>${operator.logo}</span>
            <strong>${operator.name}</strong>
            <span style="color: var(--text-muted);"> • ${bus.departure}</span>
        </div>
        <div style="color: var(--primary); font-weight: 600;">৳${bus.fare}/seat</div>
    `;

    // Render seats
    renderSeats(busId, bus.seats);

    // Update journey info
    updateJourneyInfo(bus);

    // Go to seat selection
    goToStep(3);
}

// Calculate arrival time
function calculateArrivalTime(departure, durationHours) {
    const [hours, minutes] = departure.split(':').map(Number);
    const departureDate = new Date();
    departureDate.setHours(hours, minutes, 0, 0);

    const arrivalDate = new Date(departureDate.getTime() + durationHours * 60 * 60 * 1000);

    return arrivalDate.toLocaleTimeString('en-BD', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

// Proceed to passenger info
function proceedToPassengerInfo() {
    if (selectedSeats.length === 0) {
        alert('Please select at least one seat');
        return;
    }

    currentBooking.seats = [...selectedSeats];

    // Render booking summary
    renderBookingSummary();

    goToStep(4);
}

// Render booking summary
function renderBookingSummary() {
    const summary = document.getElementById('booking-summary');
    const route = currentBooking.route;
    const bus = currentBooking.bus;
    const operator = BUS_OPERATORS[bus.operator];
    const fromCity = CITY_COORDS[route.fromCity]?.name || route.fromCity;
    const toCity = CITY_COORDS[route.toCity]?.name || route.toCity;
    const totalFare = bus.fare * currentBooking.seats.length;

    summary.innerHTML = `
        <div class="summary-title">🧾 Booking Summary</div>
        <div class="summary-row">
            <span class="label">Route</span>
            <span class="value">${fromCity} → ${toCity}</span>
        </div>
        <div class="summary-row">
            <span class="label">Date</span>
            <span class="value">${new Date(route.date).toLocaleDateString('en-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <div class="summary-row">
            <span class="label">Bus</span>
            <span class="value">${operator.name}</span>
        </div>
        <div class="summary-row">
            <span class="label">Departure</span>
            <span class="value">${bus.departure}</span>
        </div>
        <div class="summary-row">
            <span class="label">Seats</span>
            <span class="value">${currentBooking.seats.join(', ')}</span>
        </div>
        <div class="summary-row">
            <span class="label">Fare per Seat</span>
            <span class="value">৳${bus.fare.toLocaleString()}</span>
        </div>
        <div class="summary-total">
            <span class="label">Total Amount</span>
            <span class="value">৳${totalFare.toLocaleString()}</span>
        </div>
    `;
}

// Confirm booking
function confirmBooking() {
    const name = document.getElementById('passenger-name').value.trim();
    const phone = document.getElementById('passenger-phone').value.trim();

    if (!name || !phone) {
        alert('Please enter your name and phone number');
        return;
    }

    currentBooking.passenger = {
        name: name,
        phone: phone,
        email: document.getElementById('passenger-email').value.trim(),
        nid: document.getElementById('passenger-nid').value.trim()
    };

    // Mark selected seats as booked
    currentBooking.seats.forEach(seatId => {
        seatData[currentBooking.busId][seatId] = 'booked';
    });

    // Generate ticket
    generateTicket();

    // Show confirmation modal
    document.getElementById('confirmation-modal').classList.remove('hidden');
}

// Generate ticket
function generateTicket() {
    const ticket = document.getElementById('ticket');
    const route = currentBooking.route;
    const bus = currentBooking.bus;
    const operator = BUS_OPERATORS[bus.operator];
    const passenger = currentBooking.passenger;
    const fromCity = CITY_COORDS[route.fromCity]?.name || route.fromCity;
    const toCity = CITY_COORDS[route.toCity]?.name || route.toCity;
    const arrivalTime = calculateArrivalTime(bus.departure, route.duration);
    const totalFare = bus.fare * currentBooking.seats.length;
    const bookingId = 'BD' + Date.now().toString().slice(-8);

    ticket.innerHTML = `
        <div class="ticket-header">
            <h2>🚌 BD Bus</h2>
            <p>E-Ticket Confirmation</p>
        </div>
        <div class="ticket-body">
            <div class="ticket-route">
                <div class="ticket-city">
                    <div class="city">${fromCity}</div>
                    <div class="time">${bus.departure}</div>
                </div>
                <div class="ticket-arrow">✈</div>
                <div class="ticket-city">
                    <div class="city">${toCity}</div>
                    <div class="time">${arrivalTime}</div>
                </div>
            </div>
            
            <div class="ticket-details">
                <div class="ticket-detail">
                    <div class="label">Passenger</div>
                    <div class="value">${passenger.name}</div>
                </div>
                <div class="ticket-detail">
                    <div class="label">Phone</div>
                    <div class="value">${passenger.phone}</div>
                </div>
                <div class="ticket-detail">
                    <div class="label">Date</div>
                    <div class="value">${new Date(route.date).toLocaleDateString('en-BD')}</div>
                </div>
                <div class="ticket-detail">
                    <div class="label">Duration</div>
                    <div class="value">${route.duration} hours</div>
                </div>
                <div class="ticket-detail">
                    <div class="label">Bus</div>
                    <div class="value">${operator.name}</div>
                </div>
                <div class="ticket-detail">
                    <div class="label">Seat(s)</div>
                    <div class="value">${currentBooking.seats.join(', ')}</div>
                </div>
                <div class="ticket-detail">
                    <div class="label">Booking ID</div>
                    <div class="value">${bookingId}</div>
                </div>
                <div class="ticket-detail">
                    <div class="label">Total Paid</div>
                    <div class="value" style="color: var(--primary);">৳${totalFare.toLocaleString()}</div>
                </div>
            </div>
            
            <div class="ticket-qr">
                <div class="qr-placeholder">📱</div>
                <p>Scan for verification</p>
            </div>
        </div>
    `;
}

// Print ticket
function printTicket() {
    window.print();
}

// New booking
function newBooking() {
    document.getElementById('confirmation-modal').classList.add('hidden');

    // Reset form
    document.getElementById('from-city').value = '';
    document.getElementById('to-city').value = '';
    document.getElementById('passenger-name').value = '';
    document.getElementById('passenger-phone').value = '';
    document.getElementById('passenger-email').value = '';
    document.getElementById('passenger-nid').value = '';

    // Reset booking state
    currentBooking = { route: null, bus: null, seats: [], passenger: null };
    selectedSeats = [];

    // Clear map
    if (routeLayer) {
        map.removeLayer(routeLayer);
        routeLayer = null;
    }
    if (startMarker) {
        map.removeLayer(startMarker);
        startMarker = null;
    }
    if (endMarker) {
        map.removeLayer(endMarker);
        endMarker = null;
    }

    document.getElementById('journey-info').classList.add('hidden');

    // Go to step 1
    goToStep(1);
}

// Navigate between steps
function goToStep(step) {
    // Hide all steps
    document.querySelectorAll('.booking-step').forEach(s => s.classList.add('hidden'));

    // Show target step
    document.getElementById(`step-${step}`).classList.remove('hidden');

    // Update step indicator
    document.querySelectorAll('.step').forEach((s, i) => {
        const stepNum = i + 1;
        s.classList.remove('active', 'completed');
        if (stepNum < step) {
            s.classList.add('completed');
        } else if (stepNum === step) {
            s.classList.add('active');
        }
    });

    currentStep = step;
}

/* ================================
   GEOCODING FOR CUSTOM LOCATIONS
================================ */

async function geocodeCity(cityName) {
    try {
        // Use Nominatim for geocoding
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName + ", Bangladesh")}&countrycodes=bd&limit=1`;

        const res = await fetch(url);
        const data = await res.json();

        if (data && data.length > 0) {
            return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        }
        return null;
    } catch (err) {
        console.error('Geocoding error:', err);
        return null;
    }
}

/* ================================
   MAP FUNCTIONS
================================ */

async function showRouteOnMap(from, to) {
    let fromCoords = CITY_COORDS[from];
    let toCoords = CITY_COORDS[to];

    // If coordinates not found in database, try geocoding
    if (!fromCoords) {
        const geocoded = await geocodeCity(from);
        if (geocoded) {
            fromCoords = { lat: geocoded[0], lng: geocoded[1], name: from.charAt(0).toUpperCase() + from.slice(1) };
        }
    }

    if (!toCoords) {
        const geocoded = await geocodeCity(to);
        if (geocoded) {
            toCoords = { lat: geocoded[0], lng: geocoded[1], name: to.charAt(0).toUpperCase() + to.slice(1) };
        }
    }

    if (!fromCoords || !toCoords) {
        showToast('Could not find location coordinates. Please try a different city.', 3000);
        return;
    }

    // Clear previous route elements
    clearRouteFromMap();

    // Google Maps style markers
    const startIcon = L.divIcon({
        className: 'gmap-marker',
        html: `
            <div class="gmap-marker-start">
                <div class="gmap-circle">A</div>
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });

    const endIcon = L.divIcon({
        className: 'gmap-marker',
        html: `
            <div class="gmap-marker-end">
                <div class="gmap-pin"></div>
            </div>
        `,
        iconSize: [27, 43],
        iconAnchor: [13, 43]
    });

    // Add markers
    startMarker = L.marker([fromCoords.lat, fromCoords.lng], { icon: startIcon })
        .addTo(map)
        .bindPopup(`<div style="padding:5px;"><strong>${fromCoords.name}</strong><br><small>Departure Point</small></div>`);

    endMarker = L.marker([toCoords.lat, toCoords.lng], { icon: endIcon })
        .addTo(map)
        .bindPopup(`<div style="padding:5px;"><strong>${toCoords.name}</strong><br><small>Destination</small></div>`);

    try {
        // Fetch route from ORS
        const routeURL = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${fromCoords.lng},${fromCoords.lat}&end=${toCoords.lng},${toCoords.lat}`;

        const res = await fetch(routeURL);
        const data = await res.json();

        if (data.features && data.features.length) {
            const routeCoords = data.features[0].geometry.coordinates.map(
                ([lng, lat]) => [lat, lng]
            );

            // Google Maps style route - dark blue border
            const routeBorder = L.polyline(routeCoords, {
                color: '#1a73e8',
                weight: 8,
                opacity: 0.5,
                lineCap: 'round',
                lineJoin: 'round'
            }).addTo(map);

            // Google Maps style route - main blue line
            routeLayer = L.polyline(routeCoords, {
                color: '#4285F4',
                weight: 5,
                opacity: 1,
                lineCap: 'round',
                lineJoin: 'round'
            }).addTo(map);

            // Store border for cleanup
            routeLayer.border = routeBorder;

            // Fit map to show entire route
            map.fitBounds(routeLayer.getBounds(), { padding: [60, 60] });

            // Get route info
            const routeInfo = data.features[0].properties.summary;
            if (routeInfo) {
                console.log(`Route: ${(routeInfo.distance / 1000).toFixed(1)} km, ${(routeInfo.duration / 60).toFixed(0)} mins`);
            }
        }
    } catch (err) {
        console.error('Route fetch error:', err);
        // Fallback: draw curved line
        drawFallbackRoute(fromCoords, toCoords);
    }
}

// Clear route from map
function clearRouteFromMap() {
    if (routeLayer) {
        if (routeLayer.border) map.removeLayer(routeLayer.border);
        if (routeLayer.animated) map.removeLayer(routeLayer.animated);
        if (routeLayer.waypoints) {
            routeLayer.waypoints.forEach(w => map.removeLayer(w));
        }
        map.removeLayer(routeLayer);
        routeLayer = null;
    }
    if (startMarker) {
        map.removeLayer(startMarker);
        startMarker = null;
    }
    if (endMarker) {
        map.removeLayer(endMarker);
        endMarker = null;
    }
}

// Add waypoint markers along route
function addWaypointMarkers(routeCoords) {
    const waypoints = [];
    const step = Math.floor(routeCoords.length / 6); // Add ~5 waypoints

    for (let i = step; i < routeCoords.length - step; i += step) {
        const waypointIcon = L.divIcon({
            className: 'waypoint-marker',
            html: '<div class="waypoint-dot"></div>',
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });

        const waypoint = L.marker(routeCoords[i], { icon: waypointIcon })
            .addTo(map);
        waypoints.push(waypoint);
    }

    if (routeLayer) {
        routeLayer.waypoints = waypoints;
    }
}

// Draw fallback curved route when API fails
function drawFallbackRoute(fromCoords, toCoords) {
    // Create a curved path using bezier-like points
    const midLat = (fromCoords.lat + toCoords.lat) / 2;
    const midLng = (fromCoords.lng + toCoords.lng) / 2;
    const offset = 0.3; // Curve offset

    const curvePoints = [
        [fromCoords.lat, fromCoords.lng],
        [midLat + offset, midLng - offset * 0.5],
        [toCoords.lat, toCoords.lng]
    ];

    // Draw border
    const routeBorder = L.polyline(curvePoints, {
        color: '#064e3b',
        weight: 8,
        opacity: 0.4,
        smoothFactor: 1.5
    }).addTo(map);

    // Draw main line
    routeLayer = L.polyline(curvePoints, {
        color: '#10b981',
        weight: 5,
        opacity: 0.9,
        dashArray: '15, 10',
        smoothFactor: 1.5
    }).addTo(map);

    routeLayer.border = routeBorder;

    map.fitBounds(routeLayer.getBounds(), { padding: [80, 80] });
}

// Add CSS for Google Maps style markers
const markerStyles = document.createElement('style');
markerStyles.textContent = `
    .gmap-marker {
        background: none !important;
        border: none !important;
    }
    
    /* Google Maps style start marker - green circle with A */
    .gmap-marker-start {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .gmap-circle {
        width: 28px;
        height: 28px;
        background: #34a853;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        font-family: Arial, sans-serif;
    }
    
    /* Google Maps style end marker - red pin */
    .gmap-marker-end {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .gmap-pin {
        width: 27px;
        height: 43px;
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 43'%3E%3Cpath fill='%23EA4335' d='M13.5 0C6.044 0 0 6.044 0 13.5 0 24.75 13.5 43 13.5 43S27 24.75 27 13.5C27 6.044 20.956 0 13.5 0z'/%3E%3Ccircle fill='%23B31412' cx='13.5' cy='13.5' r='5'/%3E%3Ccircle fill='white' cx='13.5' cy='13.5' r='3'/%3E%3C/svg%3E") no-repeat center;
        background-size: contain;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }
`;
document.head.appendChild(markerStyles);

function updateJourneyInfo(bus) {
    const route = currentBooking.route;
    const fromCity = CITY_COORDS[route.fromCity]?.name || route.fromCity;
    const toCity = CITY_COORDS[route.toCity]?.name || route.toCity;
    const arrivalTime = calculateArrivalTime(bus.departure, route.duration);

    document.getElementById('journey-title').textContent = `${fromCity} → ${toCity}`;
    document.getElementById('journey-distance').textContent = `${route.distance} km`;
    document.getElementById('journey-duration').textContent = `${route.duration} hours`;
    document.getElementById('journey-departure').textContent = bus.departure;
    document.getElementById('journey-arrival').textContent = arrivalTime;

    document.getElementById('journey-info').classList.remove('hidden');
}

/* ================================
   MODAL HANDLING
================================ */

function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Load content if needed
    if (modalId === 'my-bookings-modal') {
        loadMyBookings();
    } else if (modalId === 'routes-modal') {
        loadRoutes();
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    document.body.style.overflow = '';
}

function switchModal(from, to) {
    closeModal(from);
    setTimeout(() => openModal(to), 100);
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
        document.body.style.overflow = '';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal:not(.hidden)').forEach(modal => {
            modal.classList.add('hidden');
        });
        document.body.style.overflow = '';
    }
});

/* ================================
   PAGE NAVIGATION
================================ */

function showPage(page) {
    // Update nav active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.textContent.toLowerCase().includes(page.replace('-', ' ').replace('booking', 'book'))) {
            link.classList.add('active');
        }
    });

    switch (page) {
        case 'booking':
            // Already on booking page, just reset if needed
            document.querySelector('.nav-link').classList.add('active');
            break;
        case 'my-bookings':
            openModal('my-bookings-modal');
            break;
        case 'routes':
            openModal('routes-modal');
            break;
        case 'help':
            openModal('help-modal');
            break;
    }
}

/* ================================
   AUTHENTICATION (localStorage)
================================ */

let currentUser = JSON.parse(localStorage.getItem('bdbus_user')) || null;

// Update header based on login state
function updateAuthUI() {
    const headerActions = document.querySelector('.header-actions');

    if (currentUser) {
        headerActions.innerHTML = `
            <div class="user-menu">
                <div class="user-avatar">${currentUser.name.charAt(0).toUpperCase()}</div>
                <span class="user-name">${currentUser.name.split(' ')[0]}</span>
                <button class="logout-btn" onclick="handleLogout()">Logout</button>
            </div>
        `;
    } else {
        headerActions.innerHTML = `
            <button class="btn-secondary" onclick="openModal('login-modal')">Login</button>
            <button class="btn-primary" onclick="openModal('signup-modal')">Sign Up</button>
        `;
    }
}

function handleLogin(e) {
    e.preventDefault();

    const phone = document.getElementById('login-phone').value;
    const password = document.getElementById('login-password').value;

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('bdbus_users')) || [];
    const user = users.find(u => u.phone === phone && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('bdbus_user', JSON.stringify(user));
        updateAuthUI();
        closeModal('login-modal');
        showToast('✓ Welcome back, ' + user.name.split(' ')[0] + '!');
    } else {
        alert('Invalid phone number or password');
    }
}

function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('signup-name').value;
    const phone = document.getElementById('signup-phone').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    // Get existing users
    const users = JSON.parse(localStorage.getItem('bdbus_users')) || [];

    // Check if phone already exists
    if (users.find(u => u.phone === phone)) {
        alert('An account with this phone number already exists');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        phone,
        email,
        password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('bdbus_users', JSON.stringify(users));

    // Auto login
    currentUser = newUser;
    localStorage.setItem('bdbus_user', JSON.stringify(newUser));
    updateAuthUI();
    closeModal('signup-modal');
    showToast('✓ Account created! Welcome, ' + name.split(' ')[0] + '!');
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('bdbus_user');
    updateAuthUI();
    showToast('Logged out successfully');
}

// Toast notification
function showToast(message, duration = 3000) {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-card);
        color: var(--text-primary);
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Add toast animation
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(20px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(20px); opacity: 0; }
    }
`;
document.head.appendChild(toastStyles);

/* ================================
   BOOKING HISTORY
================================ */

function saveBooking(booking) {
    const bookings = JSON.parse(localStorage.getItem('bdbus_bookings')) || [];
    bookings.unshift(booking); // Add to beginning
    localStorage.setItem('bdbus_bookings', JSON.stringify(bookings));
}

function loadMyBookings() {
    const bookingsList = document.getElementById('bookings-list');
    const bookings = JSON.parse(localStorage.getItem('bdbus_bookings')) || [];

    if (bookings.length === 0) {
        bookingsList.innerHTML = `
            <div class="no-bookings">
                <div class="no-bookings-icon">🎫</div>
                <p>No bookings yet</p>
                <p style="font-size: 0.9rem; margin-top: 8px;">Book your first ticket to see it here!</p>
            </div>
        `;
        return;
    }

    bookingsList.innerHTML = bookings.map(booking => `
        <div class="booking-card">
            <div class="booking-card-header">
                <div class="booking-route">${booking.from} → ${booking.to}</div>
                <span class="booking-status ${booking.status}">${booking.status}</span>
            </div>
            <div class="booking-details">
                <div class="booking-detail">
                    <span class="label">Date</span>
                    <span class="value">${booking.date}</span>
                </div>
                <div class="booking-detail">
                    <span class="label">Bus</span>
                    <span class="value">${booking.operator}</span>
                </div>
                <div class="booking-detail">
                    <span class="label">Departure</span>
                    <span class="value">${booking.departure}</span>
                </div>
                <div class="booking-detail">
                    <span class="label">Seats</span>
                    <span class="value">${booking.seats.join(', ')}</span>
                </div>
                <div class="booking-detail">
                    <span class="label">Booking ID</span>
                    <span class="value">${booking.id}</span>
                </div>
                <div class="booking-detail">
                    <span class="label">Amount</span>
                    <span class="value" style="color: var(--primary);">৳${booking.amount.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Modify the confirmBooking function to save booking
const originalConfirmBooking = confirmBooking;
confirmBooking = function () {
    const name = document.getElementById('passenger-name').value.trim();
    const phone = document.getElementById('passenger-phone').value.trim();

    if (!name || !phone) {
        alert('Please enter your name and phone number');
        return;
    }

    currentBooking.passenger = {
        name: name,
        phone: phone,
        email: document.getElementById('passenger-email').value.trim(),
        nid: document.getElementById('passenger-nid').value.trim()
    };

    // Mark selected seats as booked
    currentBooking.seats.forEach(seatId => {
        seatData[currentBooking.busId][seatId] = 'booked';
    });

    // Save booking to history
    const operator = BUS_OPERATORS[currentBooking.bus.operator];
    const fromCity = CITY_COORDS[currentBooking.route.fromCity]?.name || currentBooking.route.fromCity;
    const toCity = CITY_COORDS[currentBooking.route.toCity]?.name || currentBooking.route.toCity;

    const bookingRecord = {
        id: 'BD' + Date.now().toString().slice(-8),
        from: fromCity,
        to: toCity,
        date: new Date(currentBooking.route.date).toLocaleDateString('en-BD'),
        operator: operator.name,
        departure: currentBooking.bus.departure,
        seats: currentBooking.seats,
        amount: currentBooking.bus.fare * currentBooking.seats.length,
        passenger: currentBooking.passenger,
        status: 'confirmed',
        bookedAt: new Date().toISOString()
    };

    saveBooking(bookingRecord);

    // Generate ticket
    generateTicket();

    // Show confirmation modal
    document.getElementById('confirmation-modal').classList.remove('hidden');
};

/* ================================
   ROUTES DISPLAY
================================ */

function loadRoutes() {
    const routesGrid = document.getElementById('routes-grid');

    const routeCards = Object.entries(BUS_ROUTES).map(([key, route]) => {
        const fromCity = CITY_COORDS[route.from]?.name || route.from;
        const toCity = CITY_COORDS[route.to]?.name || route.to;
        const minFare = Math.min(...route.buses.map(b => b.fare));
        const busCount = route.buses.length;

        return `
            <div class="route-card" onclick="selectRoute('${route.from}', '${route.to}')">
                <div class="route-card-cities">
                    <span class="city">${fromCity}</span>
                    <span class="arrow">→</span>
                    <span class="city">${toCity}</span>
                </div>
                <div class="route-card-info">
                    <span>${route.distance} km • ${route.duration}h</span>
                    <span class="fare">From ৳${minFare}</span>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 8px;">
                    ${busCount} buses daily
                </div>
            </div>
        `;
    }).join('');

    routesGrid.innerHTML = routeCards;
}

function selectRoute(from, to) {
    closeModal('routes-modal');

    // Set the route in the form
    document.getElementById('from-city').value = from;
    document.getElementById('to-city').value = to;

    // Focus on date field
    document.getElementById('travel-date').focus();

    showToast('Route selected! Choose your travel date.');
}

// Initialize auth UI
document.addEventListener('DOMContentLoaded', updateAuthUI);

console.log('🚌 BD Bus - Bus Management System Loaded');
