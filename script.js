// Fetch JSON Data
fetch('movies.json')
    .then(response => response.json())
    .then(data => {
        const upcomingContainer = document.getElementById('upcoming-movies');

        data.upcoming_movies.forEach(movie => {
            let movieItem = document.createElement("div");
            movieItem.classList.add("movie");

            movieItem.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}">
                <p>${movie.title}</p>
            `;

            upcomingContainer.appendChild(movieItem);
        });
    })
    .catch(error => console.error('Error loading JSON:', error));



// Fetch JSON Data
fetch('nowshowing.json')
    .then(response => response.json())
    .then(data => {
        const moviesContainer = document.getElementById('now-showing');

        data.now_showing.forEach(movie => {
            let movieItem = document.createElement("div");
            movieItem.classList.add("movie-card");

            movieItem.innerHTML = `
                <h2 class="movie-title">${movie.title}</h2>
                <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            `;

            movie.locations.forEach(location => {
                let locationDiv = document.createElement("div");
                locationDiv.classList.add("location-card");

                locationDiv.innerHTML = `<h3 class="location-name">${location.cinema}</h3>`;

                location.screenings.forEach(screening => {
                    let screeningPrices = {
                        "Standard": 900,
                        "IMAX": 1200,
                        "3D": 1000,
                        "VIP": 1500
                    };

                    let screeningPrice = screeningPrices[screening.type] || 900; // Default Rs. 900 if type not listed

                    let screeningDiv = document.createElement("div");
                    screeningDiv.classList.add("schedule-container");

                    screeningDiv.innerHTML = `
                        <div class="screening-type">
                            <img src="${screening.icon}" alt="${screening.type}">
                        </div>
                        <button class="showtime">${screening.time}</button>
                        <button class="add-ticket" data-movie="${movie.title}" data-cinema="${location.cinema}" data-screening="${screening.type}" data-time="${screening.time}" data-price="${screeningPrice}">Add</button>
                    `;

                    locationDiv.appendChild(screeningDiv);
                });

                movieItem.appendChild(locationDiv);
            });

            moviesContainer.appendChild(movieItem);
        });

        // Event Listener for Add Ticket Buttons
        document.querySelectorAll('.add-ticket').forEach(button => {
            button.addEventListener('click', (event) => {
                const movie = event.target.getAttribute('data-movie');
                const cinema = event.target.getAttribute('data-cinema');
                const screening = event.target.getAttribute('data-screening');
                const time = event.target.getAttribute('data-time');
                const price = parseFloat(event.target.getAttribute('data-price'));
                addTicketToTable(movie, cinema, screening, time, price);
                updateTotalPrice(); // Update total price after adding ticket
            });
        });
    })
    .catch(error => console.error('Error loading JSON:', error));

// Function to Add Ticket to Table
function addTicketToTable(movie, cinema, screening, time, price) {
    const tableBody = document.querySelector("#ticket-table tbody");

    let row = document.createElement("tr");
    row.innerHTML = `
        <td>${movie}</td>
        <td>${cinema}</td>
        <td>${screening}</td>
        <td>${time}</td>
        <td><input type="number" value="1" min="1" class="ticket-quantity"></td>
        <td>Rs.${price.toFixed(2)}</td>
        <td class="total-price">Rs.${price.toFixed(2)}</td>
        <td><button class="remove-ticket">Remove</button></td>
    `;

    tableBody.appendChild(row);

    // Update total price when quantity changes
    row.querySelector(".ticket-quantity").addEventListener("input", (event) => {
        let quantity = parseInt(event.target.value);
        let totalPriceCell = row.querySelector(".total-price");
        totalPriceCell.innerText = `Rs.${(price * quantity).toFixed(2)}`;
        updateTotalPrice(); // Update total price when quantity changes
    });

    // Remove ticket button
    row.querySelector(".remove-ticket").addEventListener("click", () => {
        row.remove();
        updateTotalPrice(); // Update total price after removing ticket
    });
}

// Function to Update Total Price
function updateTotalPrice() {
    let total = 0;
    document.querySelectorAll(".total-price").forEach(cell => {
        total += parseFloat(cell.innerText.replace("Rs.", ""));
    });
    document.getElementById("total-price-display").innerText = `Total: Rs.${total.toFixed(2)}`;
}

// Save Favourite Booking
document.getElementById("save-favourite").addEventListener("click", () => {
    const rows = document.querySelectorAll("#ticket-table tbody tr");
    let favouriteBooking = [];

    rows.forEach(row => {
        favouriteBooking.push({
            movie: row.cells[0].innerText,
            cinema: row.cells[1].innerText,
            screening: row.cells[2].innerText,
            time: row.cells[3].innerText,
            quantity: row.querySelector(".ticket-quantity").value,
            price: parseFloat(row.cells[5].innerText.replace("Rs.", ""))
        });
    });

    localStorage.setItem("favouriteBooking", JSON.stringify(favouriteBooking));
    alert("Booking saved as favourite!");
});

// Apply Favourite Booking
document.getElementById("apply-favourite").addEventListener("click", () => {
    const tableBody = document.querySelector("#ticket-table tbody");
    tableBody.innerHTML = ""; // Clear existing table rows

    let favouriteBooking = JSON.parse(localStorage.getItem("favouriteBooking"));
    if (favouriteBooking) {
        favouriteBooking.forEach(item => {
            addTicketToTable(item.movie, item.cinema, item.screening, item.time, item.price);
        });
        updateTotalPrice();
    } else {
        alert("No favourite booking found.");
    }
});

// Function to transfer table data to localStorage before checkout
document.getElementById("checkout").addEventListener("click", () => {
    const rows = document.querySelectorAll("#ticket-table tbody tr");
    let checkoutData = [];

    rows.forEach(row => {
        checkoutData.push({
            movie: row.cells[0].innerText,
            cinema: row.cells[1].innerText,
            screening: row.cells[2].innerText,
            time: row.cells[3].innerText,
            quantity: row.querySelector(".ticket-quantity").value,
            price: parseFloat(row.cells[5].innerText.replace("Rs.", "")),
            total: parseFloat(row.cells[6].innerText.replace("Rs.", ""))
        });
    });

    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));

    window.location.href = "checkout.html"; // Navigate to checkout page
});
