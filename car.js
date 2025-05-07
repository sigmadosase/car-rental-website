document.addEventListener('DOMContentLoaded', () => {
    const cars = [
        { type: "SPORTS MINI", fuel: "PETROL", payment: "CASH, UPI, NET BANKING, DEBIT CARD", seats: "4", image: "img/car1.jpg", price: 2000, info: "Compact car perfect for city driving." },
        { type: "MINI CAR", fuel: "DIESEL", payment: "UPI, CASH, NET BANKING, DEBIT CARD", seats: "4", image: "img/car2.jpg", price: 3500, info: "Compact car for city driving." },
        { type: "Luxury CAR", fuel: "PETROL", payment: "UPI, DEBIT CARD", seats: "6", image: "img/car3.jpg", price: 5000, info: "Luxurious travel experience." },
        { type: "CAR.", fuel: "CNG", payment: "CASH, UPI, DEBIT CARD, NET BANKING", seats: "4+space", image: "img/car4.jpg", price: 300, info: "Affordable and efficient cab." },
        { type: "SPORTS", fuel: "PETROL", payment: "CASH, UPI, DEBIT CARD", seats: "4", image: "img/car5.jpg", price: 5000, info: "Spacious van for family trips." },
        { type: "LUXURY SPORT CAR", fuel: "PETROL", payment: "UPI, DEBIT CARD", seats: "2", image: "img/car6.jpg", price: 12000, info: "Luxury sport car for long drive." },
        { type: "LUXURY JEEP", fuel: "PETROL", payment: "UPI, DEBIT CARD", seats: "6", image: "img/about.png", price: 1500, info: "Luxury jeep for tour." }
    ];

    const currencyRates = {
        INR: 1, USD: 0.012, CAD: 0.016, NBP: 0.014, EVR: 0.011, AUD: 0.018, NZD: 0.019, BRL: 0.062, MXN: 0.24
    };

    const carTypeFilter = document.getElementById('carType');
    const fuelTypeFilter = document.getElementById('fuelType');
    const paymentTypeFilter = document.getElementById('paymentType');
    const seatTypeFilter = document.getElementById('seatType');
    const currencySelector = document.querySelector('.rupees');
    const carsContainer = document.getElementById('cars-container');
    const compareModal = document.getElementById('compare-modal');
    const compareContainer = document.getElementById('compare-container');
    const closeCompare = document.getElementById('close-compare');
    const modalClose = document.querySelector('.modal .close');

    let selectedCars = [];

    [carTypeFilter, fuelTypeFilter, paymentTypeFilter, seatTypeFilter, currencySelector].forEach(filter => {
        filter.addEventListener('change', filterCars);
    });

    filterCars();

    function filterCars() {
        const selectedCarType = carTypeFilter.value;
        const selectedFuelType = fuelTypeFilter.value;
        const selectedPaymentType = paymentTypeFilter.value;
        const selectedSeatType = seatTypeFilter.value;
        const selectedCurrency = currencySelector.value;

        const filteredCars = cars.filter(car => {
            return (selectedCarType === "All" || car.type === selectedCarType) &&
                   (selectedFuelType === "All" || car.fuel === selectedFuelType) &&
                   (selectedSeatType === "All" || car.seats === selectedSeatType) &&
                   (selectedPaymentType === "All" || car.payment.includes(selectedPaymentType));
        });

        displayCars(filteredCars, selectedCurrency);
    }

    function displayCars(carsToDisplay, currency) {
        carsContainer.innerHTML = '';
        if (carsToDisplay.length === 0) {
            carsContainer.innerHTML = '<p class="no-cars">No cars found.</p>';
            return;
        }

        carsToDisplay.forEach(car => {
            const convertedPrice = convertCurrency(car.price, currency);
            const carCard = document.createElement('div');
            carCard.className = `car-card ${car.type.toLowerCase().replace(/ /g, '-')}`;
            carCard.innerHTML = `
                <img src="${car.image}" alt="${car.type}" onerror="this.src='img/default.jpg'">
                <div class="car-info">
                    <h3>${car.type}</h3>
                    <p>${car.info}</p>
                    <p>Fuel: ${car.fuel}</p>
                    <p>Seats: ${car.seats}</p>
                    <p>Payment: ${car.payment}</p>
                    <p>Price: ${formatPrice(convertedPrice, currency)}</p>
                    <button class="rent-btn" data-type="${car.type}">Rent Now</button>
                    <button class="compare-btn" data-type="${car.type}">Compare</button>
                </div>
            `;
            carsContainer.appendChild(carCard);
        });

        document.querySelectorAll('.rent-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const carType = e.target.dataset.type;
                const selectedCar = cars.find(c => c.type === carType);
                localStorage.setItem('selectedCar', JSON.stringify(selectedCar));
                window.location.href = 'booking.html';
            });
        });

        document.querySelectorAll('.compare-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const carType = e.target.dataset.type;
                const car = cars.find(c => c.type === carType);
                if (selectedCars.length < 2 && !selectedCars.includes(car)) {
                    selectedCars.push(car);
                }
                if (selectedCars.length === 2) {
                    showComparison(currency);
                }
            });
        });
    }

    function showComparison(currency) {
        compareContainer.innerHTML = selectedCars.map(car => `
            <div class="compare-card">
                <h3>${car.type}</h3>
                <p>${car.info}</p>
                <p>Fuel: ${car.fuel}</p>
                <p>Seats: ${car.seats}</p>
                <p>Price: ${formatPrice(convertCurrency(car.price, currency), currency)}</p>
            </div>
        `).join('');
        compareModal.style.display = 'block';
    }

    closeCompare.addEventListener('click', () => {
        compareModal.style.display = 'none';
        selectedCars = [];
    });

    modalClose.addEventListener('click', () => {
        compareModal.style.display = 'none';
        selectedCars = [];
    });

    function convertCurrency(price, currency) {
        return price * currencyRates[currency];
    }

    function formatPrice(price, currency) {
        const symbols = { INR: '₹', USD: '$', CAD: 'CA$', NBP: '₦', EVR: '€', AUD: 'A$', NZD: 'NZ$', BRL: 'R$', MXN: 'MX$' };
        return `${symbols[currency]}${price.toFixed(2)}/day`;
    }

    // Dark Mode
    const darkModeToggle = document.querySelector('.button-dark-light');
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
    });

    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
    }
});