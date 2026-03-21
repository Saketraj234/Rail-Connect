document.addEventListener('DOMContentLoaded', () => {
    // Theme Management
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    const html = document.documentElement;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeUI(newTheme);
    });

    function updateThemeUI(theme) {
        if (theme === 'dark') {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Light Mode';
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Dark Mode';
        }
    }

    // State Management
    let bookingData = {
        from: '',
        to: '',
        date: '',
        train: null,
        selectedClass: null,
        passengers: [],
        wifiAdded: false,
        fares: {
            base: 0,
            wifi: 0,
            total: 0
        }
    };

    // Mock Train Data
    const mockTrains = [
        { id: 1, no: "12952", name: "MUMBAI RAJDHANI", dep: "16:55", arr: "08:35", dist: 1384, 
          classes: [{code: "SL", price: 650}, {code: "3A", price: 1750}, {code: "2A", price: 2500}, {code: "1A", price: 4300}] },
        { id: 2, no: "12002", name: "NDLS SHATABDI", dep: "06:00", arr: "14:15", dist: 750,
          classes: [{code: "CC", price: 1200}, {code: "EC", price: 2800}] },
        { id: 3, no: "12432", name: "TVC RAJDHANI", dep: "10:55", arr: "04:10", dist: 1384,
          classes: [{code: "3A", price: 1680}, {code: "2A", price: 2420}, {code: "1A", price: 4100}] }
    ];

    // Navigation Helper
    window.showStep = (stepId) => {
        document.querySelectorAll('.step-section').forEach(s => s.classList.add('hidden'));
        document.getElementById(`step-${stepId}`).classList.remove('hidden');
        window.scrollTo(0, 0);
    };

    // Step 1: Search Logic
    document.getElementById('btn-search').addEventListener('click', () => {
        bookingData.from = document.getElementById('from-station').value;
        bookingData.to = document.getElementById('to-station').value;
        bookingData.date = document.getElementById('journey-date').value;

        if (!bookingData.from || !bookingData.to) {
            alert('Please enter Source and Destination');
            return;
        }

        renderTrains();
        showStep('trains');
    });

    function renderTrains() {
        const list = document.getElementById('train-list');
        document.getElementById('route-title').textContent = `${bookingData.from} → ${bookingData.to}`;
        
        list.innerHTML = mockTrains.map(train => `
            <div class="train-card">
                <div class="train-main">
                    <div class="t-info">
                        <h3>${train.no} - ${train.name}</h3>
                        <small>Runs Daily</small>
                    </div>
                    <div class="t-schedule">
                        <div class="time-box"><b>${train.dep}</b><span>${bookingData.from.split('-')[1] || bookingData.from}</span></div>
                        <div class="arrow">── ${Math.floor(train.dist/100)}h ──</div>
                        <div class="time-box"><b>${train.arr}</b><span>${bookingData.to.split('-')[1] || bookingData.to}</span></div>
                    </div>
                </div>
                <div class="class-options">
                    ${train.classes.map(c => `
                        <div class="class-box" onclick="selectClass(${train.id}, '${c.code}', ${c.price})">
                            <b>${c.code}</b>
                            <span class="price">₹${c.price}</span>
                            <span class="status">AVAILABLE-0042</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    // Step 2: Select Class
    window.selectClass = (trainId, classCode, price) => {
        bookingData.train = mockTrains.find(t => t.id === trainId);
        bookingData.selectedClass = classCode;
        bookingData.fares.base = price;

        document.getElementById('selected-train-info').textContent = `${bookingData.train.no} - ${bookingData.train.name}`;
        document.getElementById('selected-class-info').textContent = `${classCode} Class | ${bookingData.from} to ${bookingData.to}`;
        
        showStep('booking');
    };

    // Passenger Logic
    const passengerContainer = document.getElementById('passenger-rows-container');
    const btnAddPassenger = document.getElementById('btn-add-passenger');

    btnAddPassenger.addEventListener('click', () => {
        const rowCount = passengerContainer.querySelectorAll('.input-row').length;
        if (rowCount >= 6) {
            alert('Maximum 6 passengers allowed');
            return;
        }

        const newRow = document.createElement('div');
        newRow.className = 'input-row';
        newRow.innerHTML = `
            <span class="pass-count">Passenger ${rowCount + 1}</span>
            <input type="text" class="pass-name" placeholder="Passenger Name" required>
            <input type="number" class="pass-age" placeholder="Age" required>
            <select class="pass-gender">
                <option>Male</option>
                <option>Female</option>
            </select>
            <div class="wifi-choice-row">
                <label><input type="checkbox" class="pass-wifi"> Add WiFi</label>
            </div>
            <button type="button" class="btn-remove-row" onclick="removePassengerRow(this)">✕</button>
        `;
        passengerContainer.appendChild(newRow);
        updateRemoveButtons();
    });

    window.removePassengerRow = (btn) => {
        btn.closest('.input-row').remove();
        updateRemoveButtons();
        relabelPassengers();
    };

    function relabelPassengers() {
        const rows = passengerContainer.querySelectorAll('.input-row');
        rows.forEach((row, index) => {
            row.querySelector('.pass-count').textContent = `Passenger ${index + 1}`;
        });
    }

    function updateRemoveButtons() {
        const rows = passengerContainer.querySelectorAll('.input-row');
        rows.forEach(row => {
            const removeBtn = row.querySelector('.btn-remove-row');
            if (rows.length === 1) {
                removeBtn.classList.add('hidden');
            } else {
                removeBtn.classList.remove('hidden');
            }
        });
    }

    // Step 3: Passenger Form
    document.getElementById('btn-proceed-payment').addEventListener('click', () => {
        const rows = passengerContainer.querySelectorAll('.input-row');
        bookingData.passengers = [];
        let isValid = true;

        rows.forEach(row => {
            const name = row.querySelector('.pass-name').value;
            const age = row.querySelector('.pass-age').value;
            const gender = row.querySelector('.pass-gender').value;
            const hasWifi = row.querySelector('.pass-wifi').checked;

            if (!name || !age) {
                isValid = false;
                return;
            }
            bookingData.passengers.push({ name, age, gender, hasWifi });
        });

        if (!isValid) {
            alert('Please fill all passenger details');
            return;
        }

        // Formula: Ticket Fare = Base * Num Passengers
        // WiFi Price = (Distance / 100) * 5 * Num Passengers who chose WiFi
        const wifiCount = bookingData.passengers.filter(p => p.hasWifi).length;
        const totalBaseFare = bookingData.fares.base * bookingData.passengers.length;
        bookingData.fares.wifi = (bookingData.train.dist / 100) * 5 * wifiCount;
        bookingData.fares.total = totalBaseFare + bookingData.fares.wifi;
        bookingData.wifiAdded = wifiCount > 0;

        // Update Payment UI
        document.getElementById('pay-base-fare').textContent = `₹${totalBaseFare}`;
        const wifiRow = document.getElementById('pay-wifi-row');
        if (bookingData.wifiAdded) {
            wifiRow.classList.remove('hidden');
            document.getElementById('pay-wifi-fare').textContent = `₹${bookingData.fares.wifi.toFixed(2)} (${wifiCount} Users)`;
        } else {
            wifiRow.classList.add('hidden');
        }
        document.getElementById('pay-total-fare').textContent = `₹${bookingData.fares.total.toFixed(2)}`;
        
        generateCaptcha();
        showStep('payment');
    });

    // Step 4: Payment & Captcha
    function generateCaptcha() {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let captcha = "";
        for (let i = 0; i < 4; i++) captcha += chars.charAt(Math.floor(Math.random() * chars.length)) + " ";
        document.getElementById('captcha-text').textContent = captcha.trim();
        document.getElementById('captcha-input').value = "";
    }

    document.getElementById('btn-pay-now').addEventListener('click', () => {
        const input = document.getElementById('captcha-input').value.replace(/\s/g, '').toUpperCase();
        const actual = document.getElementById('captcha-text').textContent.replace(/\s/g, '').toUpperCase();

        if (input !== actual) {
            alert('Invalid Captcha!');
            generateCaptcha();
            return;
        }

        // Simulate payment processing
        const btn = document.getElementById('btn-pay-now');
        btn.disabled = true;
        btn.textContent = "Processing...";

        setTimeout(() => {
            finalizeTicket();
            showStep('ticket');
        }, 1500);
    });

    // Step 5: Final Ticket
    function finalizeTicket() {
        const pnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        
        document.getElementById('final-pnr').textContent = pnr;
        document.getElementById('final-train').textContent = `${bookingData.train.no} - ${bookingData.train.name}`;
        document.getElementById('final-from').textContent = bookingData.from.split('-')[1] || bookingData.from;
        document.getElementById('final-to').textContent = bookingData.to.split('-')[1] || bookingData.to;
        
        const list = document.getElementById('final-passenger-list');
        list.innerHTML = bookingData.passengers.map(p => `
            <div class="table-row">
                <span>${p.name}</span>
                <span>${p.age}</span>
                <span>${p.gender}</span>
                <span class="cnf">CNF / B3 / ${Math.floor(Math.random() * 72) + 1}</span>
            </div>
        `).join('');

        const wifiContainer = document.getElementById('final-wifi-container');
        const passengersWithWifi = bookingData.passengers.filter(p => p.hasWifi);
        
        if (passengersWithWifi.length > 0) {
            wifiContainer.classList.remove('hidden');
            wifiContainer.innerHTML = `<h4>🌐 RailConnect WiFi Access</h4>` + 
                passengersWithWifi.map((p) => {
                    const wifiId = `RAIL_${p.name.substring(0,3).toUpperCase()}_${pnr.substring(6,10)}`;
                    const wifiPass = Math.random().toString(36).slice(-6).toUpperCase();
                    return `
                        <div class="wifi-credentials">
                            <div class="wifi-user-name">Passenger: <b>${p.name}</b></div>
                            <div class="wifi-info-grid">
                                <div class="item"><small>Username</small><span>${wifiId}</span></div>
                                <div class="item"><small>Password</small><span>${wifiPass}</span></div>
                            </div>
                        </div>
                    `;
                }).join('');
        } else {
            wifiContainer.classList.add('hidden');
            wifiContainer.innerHTML = '';
        }

        document.getElementById('final-total').textContent = `₹${bookingData.fares.total.toFixed(2)}`;

        // Save to localStorage
        const bookings = JSON.parse(localStorage.getItem('railConnectBookings') || '[]');
        bookings.unshift({ ...bookingData, pnr, date: new Date().toISOString() });
        localStorage.setItem('railConnectBookings', JSON.stringify(bookings.slice(0, 5)));
    }
});
