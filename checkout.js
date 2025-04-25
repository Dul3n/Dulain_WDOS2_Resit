document.addEventListener("DOMContentLoaded", () => {
    const checkoutData = JSON.parse(localStorage.getItem("checkoutData"));
    const checkoutTableBody = document.querySelector("#checkout-table tbody");

    let totalSeats = 0;
    let grandTotal = 0;

    if (checkoutData && checkoutData.length > 0) {
        checkoutData.forEach(item => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.movie}</td>
                <td>${item.cinema}</td>
                <td>${item.screening}</td>
                <td>${item.time}</td>
                <td>${item.quantity}</td>
                <td>Rs.${item.price.toFixed(2)}</td>
                <td>Rs.${item.total.toFixed(2)}</td>
            `;
            checkoutTableBody.appendChild(row);

            totalSeats += parseInt(item.quantity); // Sum total seats
            grandTotal += item.total; // Sum total price
        });

        // Display grand total
        document.getElementById("grand-total").innerText = `Grand Total: Rs.${grandTotal.toFixed(2)}`;
        document.getElementById("total-seats").innerText = `Total Seats: ${totalSeats}`;
    } else {
        document.getElementById("checkout-section").innerHTML = "<p>No tickets selected. Please go back and add tickets.</p>";
    }
});

// Form Validation & Confirmation
document.getElementById("confirm-payment").addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const cardNumber = document.getElementById("card-number").value.trim();

    const checkoutData = JSON.parse(localStorage.getItem("checkoutData"));

    let totalSeats = 0;
    let grandTotal = 0;

    // Calculate total seats and grand total again for confirmation
    if (checkoutData && checkoutData.length > 0) {
        checkoutData.forEach(item => {
            totalSeats += parseInt(item.quantity);
            grandTotal += item.total;
        });
    }

    if (name && email && cardNumber.length === 15) {
        const bookingRef = `BK-${Math.floor(Math.random() * 1000000)}`;
        alert(`Thank you for your purchase!\nBooking Reference: ${bookingRef}\nYou have booked ${totalSeats} seats for a total of Rs.${grandTotal.toFixed(2)}.\nEnjoy your movie!`);
        localStorage.removeItem("checkoutData"); // Clear stored data after successful booking
        window.location.href = "Book.html"; // Redirect back to homepage
    } else {
        alert("Please fill all fields correctly.");
    }
});
