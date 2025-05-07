document.addEventListener('DOMContentLoaded', () => {
    const currencyRates = { INR: 1, USD: 0.012, CAD: 0.016, NBP: 0.014, EVR: 0.011, AUD: 0.018, NZD: 0.019, BRL: 0.062, MXN: 0.24 };
    const bookingDetails = document.getElementById('bookingDetails');
    const bookingConfirmation = document.getElementById('bookingConfirmation');
    const selectedCarDetails = document.getElementById('selectedCarDetails');
    const reservationDetails = document.getElementById('reservationDetails');
    const paymentForm = document.getElementById('paymentForm');
    const paymentMethod = document.getElementById('paymentMethod');
    const paymentDetails = document.getElementById('paymentDetails');
    const paymentInfo = document.getElementById('paymentInfo');
    const confirmationDetails = document.getElementById('confirmationDetails');
    const currencySelector = document.querySelector('.rupees');
    const backToHome = document.getElementById('backToHome');

    const selectedCar = JSON.parse(localStorage.getItem('selectedCar')) || {};
    const reservation = JSON.parse(localStorage.getItem('reservation')) || {};

    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'signup.html';
    }

    if (selectedCar.type) {
        const convertedPrice = convertCurrency(selectedCar.price, currencySelector.value);
        selectedCarDetails.innerHTML = `
            <h3>${selectedCar.type}</h3>
            <p>${selectedCar.info}</p>
            <p>Fuel: ${selectedCar.fuel}</p>
            <p>Seats: ${selectedCar.seats}</p>
            <p>Price: ${formatPrice(convertedPrice, currencySelector.value)}</p>
        `;
    } else {
        bookingDetails.innerHTML = '<p>No car selected. Please select a car first.</p>';
        paymentForm.style.display = 'none';
    }

    if (reservation.location) {
        reservationDetails.innerHTML = `
            <p>Location: ${reservation.location}</p>
            <p>Pickup Date: ${reservation.pickupDate}</p>
            <p>Return Date: ${reservation.returnDate}</p>
        `;
    }

    currencySelector.addEventListener('change', () => {
        if (selectedCar.type) {
            const convertedPrice = convertCurrency(selectedCar.price, currencySelector.value);
            selectedCarDetails.querySelector('p:last-child').textContent = `Price: ${formatPrice(convertedPrice, currencySelector.value)}`;
        }
    });

    paymentMethod.addEventListener('change', () => {
        paymentDetails.style.display = paymentMethod.value ? 'block' : 'none';
    });

    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const method = paymentMethod.value;
        const info = paymentInfo.value;

        if (!method || !info) {
            alert('Please complete all payment fields.');
            return;
        }

        const pickupDate = new Date(reservation.pickupDate);
        const returnDate = new Date(reservation.returnDate);
        const days = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24));
        const totalPrice = selectedCar.price * days;
        const convertedTotalPrice = convertCurrency(totalPrice, currencySelector.value);

        const booking = {
            car: selectedCar.type,
            location: reservation.location,
            pickupDate: reservation.pickupDate,
            returnDate: reservation.returnDate,
            paymentMethod: method,
            totalPrice: formatPrice(convertedTotalPrice, currencySelector.value)
        };

        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        confirmationDetails.innerHTML = `
            <p>Car: ${booking.car}</p>
            <p>Location: ${booking.location}</p>
            <p>Pickup Date: ${booking.pickupDate}</p>
            <p>Return Date: ${booking.returnDate}</p>
            <p>Payment Method: ${booking.paymentMethod}</p>
            <p>Total Price: ${booking.totalPrice}</p>
        `;
        bookingDetails.style.display = 'none';
        bookingConfirmation.style.display = 'block';
    });

    backToHome.addEventListener('click', () => {
        localStorage.removeItem('selectedCar');
        localStorage.removeItem('reservation');
        window.location.href = 'index.html';
    });

    const darkModeToggle = document.querySelector('.button-dark-light');
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
    });

    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    function convertCurrency(price, currency) {
        return price * currencyRates[currency];
    }

    function formatPrice(price, currency) {
        const symbols = { INR: '₹', USD: '$', CAD: 'CA$', NBP: '₦', EVR: '€', AUD: 'A$', NZD: 'NZ$', BRL: 'R$', MXN: 'MX$' };
        return `${symbols[currency]}${price.toFixed(2)}`;
    }
});