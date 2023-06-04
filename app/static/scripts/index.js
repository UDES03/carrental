// Check session storage and set the number of
// cart items to the cart button.
let cartItemsNoElement = document.querySelector('#cart-items-no');
let cart = JSON.parse(sessionStorage.getItem('cart'));
if (cart === null) {
    cartItemsNoElement.textContent = 0;
} else {
    cartItemsNoElement.textContent = cart.length;
}
/**
 *
 * Add item to local storage.
*/
function addToCart(event, car) {
    // check if the availability is `true` or `false`
    if(!car.availability) {
        alert('Sorry, the car is not available now. Please try other cars.');
        event.target.textContent = 'Out of Stock';
        event.target.disabled = true;
    } else {
        // retreive the cart first so that items
        // can be stacked if user wants more than one
        // car to be reserved.
        let cart = JSON.parse(sessionStorage.getItem('cart'));
        if (cart === null) {
            sessionStorage.setItem('cart', JSON.stringify([car]));
            event.target.textContent = 'In Cart';
            event.target.disabled = true;
        } else {
            let isInCart = false;
            for (let item of cart) {
                if(item.carName === car.carName) {
                    isInCart = true;
                }
            }
            if(isInCart) {
                alert('Car already added to cart!');
                event.target.textContent = 'In Cart';
                event.target.disabled = true;
            } else {
                cart.push(car);
                sessionStorage.setItem('cart', JSON.stringify(cart));
            }
        }
        if(cart !== null) {
            cartItemsNoElement.textContent = cart.length;
        }
    }
}

function createCarsElements(data) {
    // Get the element that will display the
    // list of cars
    const carsList = document.querySelector('.cars-list');
    for (let item of data) {
        // Create car object to store the car info
        let car = {
            brand: item.brand,
            model: item.model,
            category: item.category,
            availability: item.availability,
            carName: `${item.brand} ${item.model}`,
            imagePath: `static/images/cars/${item.brand}${item.model.replace(' ', '').replace(' ', '')}.jpg`,
            year: item.model_year,
            mileage: item.mileage,
            title: `${item.model_year} ${item.brand} ${item.model} (${item.mileage} km)`,
            fuel: item.fuel_type,
            seats: item.seats,
            pricePerDay: item.price_per_day,
            daysRented: 1,
            description: item.description,
        };

        // Build elements to display this info on the homepage
        let card = document.createElement('div');
        card.className = 'card';
        let carImage = document.createElement('img');
        carImage.src = car.imagePath;
        carImage.alt = car.carName;
        carImage.className = 'card-image';
        let cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        let titleRow = document.createElement('div');
        titleRow.className = 'row';
        let titleElement = document.createElement('h4');
        titleElement.textContent = car.title;
        let priceElement = document.createElement('p');
        priceElement.className = 'price';
        priceElement.textContent = `A$${car.pricePerDay}`;
        titleRow.append(titleElement);
        titleRow.append(priceElement);
        let cardText = document.createElement('p');
        cardText.className = 'card-text';
        cardText.textContent = car.description;
        let carSeats = document.createElement('p');
        carSeats.className = 'card-text';
        carSeats.textContent = `Seats: ${car.seats}`;
        let carFuel = document.createElement('p');
        carFuel.className = 'card-text';
        carFuel.textContent = `Fuel: ${car.fuel}`;
        let addToCartButton = document.createElement('button');
        addToCartButton.className = 'btn';
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.onclick = (event) => addToCart(event, car);

        cardContent.append(titleRow);
        cardContent.append(cardText);
        cardContent.append(carFuel);
        cardContent.append(carSeats);
        cardContent.append(addToCartButton);
        card.append(carImage);
        card.append(cardContent);

        // Push car card ui to page
        if(carsList) {
            carsList.append(card);
        }
    }
}

fetch(`${window.location.origin}/cars`)
  .then((response) => response.json())
  .then((data) => createCarsElements(data.cars));


// Code for the cart page
function getCart() {
    return JSON.parse(sessionStorage.getItem('cart'));
}
let reservation = document.querySelector(".reservation");
// This element will be displayed if there are no cart items.
let emptyCartElement = document.createElement('p');
emptyCartElement.textContent = 'Your cart is empty! Please go to the homepage and add a car to cart.';

function removeFromCart(car) {
    // Check the cart in sessionStorage for the specified
    // car then remove it.
    let id = `${car.carName.toLowerCase().replace(' ', '_')}_item`;
    let selectedCard = document.querySelector(`#${id}`);
    let cart = getCart();
    newCart = [];
    for (let cartItem of cart) {
        if(car.carName !== cartItem.carName) {
            newCart.push(cartItem);
        }
    }
    sessionStorage.setItem('cart', JSON.stringify(newCart));
    selectedCard.remove();
    if(newCart.length === 0) {
        reservation.append(emptyCartElement);
    }
    cartItemsNoElement.textContent = newCart.length;
}

let daysIsGreaterThanZero = true;

function addDays(event, data, priceId) {
    // Allow user to set how long they want to rent
    // the car for.
    let cart = JSON.parse(sessionStorage.getItem('cart'));
    let priceElement = document.querySelector(priceId);
    let days = parseInt(event.target.value);
    if (days === 0) {
        daysIsGreaterThanZero = false;
        event.target.classList.add('input-validation-error');
    } else {
        daysIsGreaterThanZero = true;
        event.target.classList.remove('input-validation-error');
    }
    priceElement.textContent = `A$ ${(data.pricePerDay * days).toFixed(2)}`;
    for(let cartItem of cart) {
        if (cartItem.carName === data.carName) {
            cartItem.daysRented = days;
        }
    }

    sessionStorage.setItem('cart', JSON.stringify(cart));
}

function cartItem(data) {
    // UI element for the cart item shown in the
    // reservation page
    let card = document.createElement('div');
    card.className = 'card-item';
    card.id = `${data.carName.toLowerCase().replace(' ', '_')}_item`;
    let carImage = document.createElement('img');
    carImage.src = data.imagePath;
    carImage.alt = data.carName;
    carImage.className = 'card-image';
    let cardContent = document.createElement('div');
    cardContent.className = 'card-content';
    let titleRow = document.createElement('div');
    titleRow.className = 'row';
    let cardTitle = document.createElement('h2');
    cardTitle.className = 'card-title';
    cardTitle.textContent = data.carName;
    let priceElement = document.createElement('p');
    priceElement.className = 'price';
    priceElement.id = `${data.carName.toLowerCase().replace(' ', '_')}_price_total`;
    priceElement.textContent = `A$ ${data.pricePerDay * data.daysRented}`;
    let bottomRow = document.createElement('div');
    bottomRow.className = 'row';
    let inputRow = document.createElement('div');
    inputRow.className = 'row';
    let id = `${data.carName.toLowerCase().replace(' ', '_')}_input`;
    let daysRentedLabel = document.createElement('label');
    daysRentedLabel.htmlFor = id;
    daysRentedLabel.textContent = 'Days:';
    let daysRentedInput = document.createElement('input');
    daysRentedInput.className = 'days-rented';
    daysRentedInput.type = 'number';
    daysRentedInput.name = id;
    daysRentedInput.id = id;
    daysRentedInput.value = data.daysRented;
    daysRentedInput.onchange = (event) => addDays(event, data, `#${priceElement.id}`);
    let deleteButton = document.createElement('button');
    deleteButton.classList.add('btn');
    deleteButton.classList.add('btn-danger');
    deleteButton.textContent = 'Remove';
    deleteButton.onclick = () => removeFromCart(data);

    card.append(carImage);
    cardContent.append(titleRow);
    titleRow.append(cardTitle);
    titleRow.append(priceElement);
    cardContent.append(bottomRow);
    inputRow.append(daysRentedLabel);
    inputRow.append(daysRentedInput);
    bottomRow.append(inputRow);
    bottomRow.append(deleteButton);
    card.append(cardContent);
    return card;
}
// Add the items in cart as UI elements
if (reservation) {
    let cart = getCart();
    if (cart === null || cart.length === 0) {
        reservation.append(emptyCartElement);
    } else {
        emptyCartElement.remove();
        for(let item of cart) {
            reservation.append(cartItem(item));
        }
    }
}

// Cart / Reservation page
function checkOut() {
    let cart = JSON.parse(sessionStorage.getItem('cart'));
    if(cart === null || cart.length === 0) {
        alert('No car has been reserved.');
        window.location.href = window.location.origin;
    } else {
        if (daysIsGreaterThanZero) {
            let checkOutUrl = window.location.origin + '/checkout';
            window.location.href = checkOutUrl;
        } else {
            alert('You need to rent for a day or more!');
        }
    }
}
let checkOutButton = document.querySelector('#checkout-cart');
if (checkOutButton) {
    checkOutButton.onclick = () => checkOut();
}

// Checkout and save data to db

function validateEmail(email) {
    // Use regex to verify whether the input is in a
    // valid email format
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
}
function getTotal() {
    // Compute total amount to be paid based
    // on how many days the user specifies.
    let total = 0;
    let cart = JSON.parse(sessionStorage.getItem('cart'));
    for (let cartItem of cart) {
        total = total + (cartItem.pricePerDay * cartItem.daysRented);
    }
    return total.toFixed(2);
}

function validateFields() {
    // Check that the inputs are not left empty
    let firstName = document.querySelector('#fName');
    let lastName = document.querySelector('#lName');
    let email = document.querySelector('#email');
    let address = document.querySelector('#address1');

    if(firstName.value === '' || lastName.value === '' || !validateEmail(email.value) || address === '') {
        return false;
    }

    return true;
}

async function bookCars() {
    // If inputs are valid, post to server
    let cart = JSON.parse(sessionStorage.getItem('cart'));
    let car = [cart[0].brand, cart[0].model];
    let emailElement = document.querySelector('#email');
    let isValid =  validateFields();
    if(!isValid) {
        alert('Please fill in the fields properly!');
    } else {
        let email = emailElement.value;
        let isPresent = await hasHistory(email);
        let bond = isPresent ? 0 : 200;
        let data = {
            "email": email,
            "bond": bond,
            "car": car
        };
        let raw = JSON.stringify(data);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = { method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' };
        fetch(`${window.location.origin}/addnew`, requestOptions)
            .then(response => response.text())
            .then(result => {
                let isSuccessful = JSON.parse(result).isSuccessful;
                isSuccessful ? alert('Successfully placed reservation!') : alert('Something went wrong.');
                if(isSuccessful) {
                    // Clear cart on success
                    sessionStorage.removeItem('cart');
                    window.location.href = window.location.origin;
                }
            })
            .catch(error => console.log('error', error));
    }
}

async function hasHistory(email) {
    // Check if the user has reservation records
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ "email": email });

    var requestOptions = { method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' };
    let response = await fetch(`${window.location.origin}/dbrecords`, requestOptions);
    let result = await response.json();

    return result.isPresent;
}

function checkRentingHistory(event) {
    // Display bond amount if user doesn't
    // have a recent reservation.
    let email = event.target.value;
    let bondElement = document.querySelector('#bond');

    if (validateEmail(email)) {
        hasHistory(email).then((result) => result ? bondElement.textContent = '' : bondElement.textContent = '+ A$200 bond');
    }
}


let bookButton = document.querySelector('#book-button');
let totalPriceElement = document.querySelector('#totalPrice');
let emailElement = document.querySelector('#email');
if(bookButton) {
    bookButton.onclick = () => bookCars();
    // Calculate the total price from cart
    totalPriceElement.textContent = `Total: A$${getTotal()}`;
    emailElement.onchange = (event) => checkRentingHistory(event);
}