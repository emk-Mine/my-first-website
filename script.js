/* =========================
   MAIN PRODUCTS
========================= */

const products = [
    {
        productNumber: "001",
        name: "Product One",
        price: 5,
        description: "This is the description of product one.",
        image: "images/product1.jpg",
        location: "Lusaka",
        phone: "+260774907636"
    },

    {
        productNumber: "002",
        name: "Product Two",
        price: 25,
        description: "This is the description of product two.",
        image: "images/product2.jpg",
        location: "Lusaka",
        phone: "+260XXXXXXXXX"
    },

    {
        productNumber: "003",
        name: "Product Three",
        price: 50,
        description: "This is the description of product three.",
        image: "images/product3.jpg",
        location: "Ndola",
        phone: "+260XXXXXXXXX"
    }
];


/* =========================
   FEATURED PRODUCTS
========================= */

const featuredProducts = [
    {
        productNumber: "101",
        name: "Featured One",
        price: 5,
        image: "images/product4.jpg",
        location: "Lusaka",
        link: "https://gigzm.org"
    },

    {
        productNumber: "102",
        name: "Featured Two",
        price: 20,
        image: "images/product5.jpg",
        location: "Lusaka",
        link: "https://example.com/featured-two"
    },

    {
        productNumber: "103",
        name: "Featured Three",
        price: 30,
        image: "images/product6.jpg",
        location: "Ndola",
        link: "https://example.com/featured-three"
    },

    {
        productNumber: "104",
        name: "Featured Four",
        price: 40,
        image: "images/product7.jpg",
        location: "Kitwe",
        link: "https://example.com/featured-four"
    }
];


/* =========================
   PAYMENT STATE
========================= */

let selectedProduct = null;


/* =========================
   ELEMENTS
========================= */

const productContainer =
    document.getElementById("productContainer");

const featuredProductContainer =
    document.getElementById("featuredProductContainer");

const paymentModal =
    document.getElementById("paymentModal");

const customerEmail =
    document.getElementById("customerEmail");

const checkoutProductName =
    document.getElementById("checkoutProductName");

const checkoutProductPrice =
    document.getElementById("checkoutProductPrice");

const continuePaymentButton =
    document.getElementById("continuePaymentButton");


/* =========================
   NOTIFICATION ELEMENTS
========================= */

const notificationModal =
    document.getElementById("notificationModal");

const notificationIcon =
    document.getElementById("notificationIcon");

const notificationTitle =
    document.getElementById("notificationTitle");

const notificationMessage =
    document.getElementById("notificationMessage");

const notificationButton =
    document.getElementById("notificationButton");


/* =========================
   MAIN PRODUCT CARDS
========================= */

products.forEach((product, index) => {

    const card = document.createElement("div");

    card.className = "product-card";

    card.innerHTML = `
        <div
            class="product-image-container"
            onclick="previewImage('${product.image}', '${product.name}')"
        >
            <img
                class="product-image"
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >
        </div>

        <div class="product-info">

            <div class="product-number">
                PRODUCT ${product.productNumber}
            </div>

            <h3 class="product-name">
                ${product.name}
            </h3>

            <p class="product-description">
                ${product.description}
            </p>

            <div class="product-price">
                K${product.price}
            </div>

            <button
                class="product-button"
                type="button"
                onclick="openPaymentModal(products[${index}])"
            >
                Purchase
            </button>

        </div>
    `;

    productContainer.appendChild(card);
});


/* =========================
   FEATURED PRODUCT CARDS
========================= */

featuredProducts.forEach((product, index) => {

    const card = document.createElement("div");

    card.className = "product-card";

    card.innerHTML = `
        <div
            class="product-image-container"
            onclick="previewImage('${product.image}', '${product.name}')"
        >
            <img
                class="product-image"
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >
        </div>

        <div class="product-info">

            <div class="product-number">
                FEATURED ${product.productNumber}
            </div>

            <h3 class="product-name">
                ${product.name}
            </h3>

            <div class="product-price">
                K${product.price}
            </div>

            <button
                class="product-button"
                type="button"
                onclick="openPaymentModal(featuredProducts[${index}])"
            >
                Purchase
            </button>

        </div>
    `;

    featuredProductContainer.appendChild(card);
});


/* =========================
   IMAGE PREVIEW
========================= */

function previewImage(image, name) {

    const preview =
        document.getElementById("imagePreview");

    const previewImageElement =
        document.getElementById("previewImage");

    previewImageElement.src = image;
    previewImageElement.alt = name;

    preview.classList.remove("hidden");

    document.body.style.overflow = "hidden";
}


/* =========================
   CLOSE IMAGE PREVIEW
========================= */

function closeImagePreview() {

    const preview =
        document.getElementById("imagePreview");

    preview.classList.add("hidden");

    document.body.style.overflow = "";
}


document
    .getElementById("closePreview")
    .addEventListener("click", closeImagePreview);


document
    .getElementById("imagePreview")
    .addEventListener("click", function (event) {

        if (event.target === this) {
            closeImagePreview();
        }

    });


/* =========================
   OPEN PAYMENT MODAL
========================= */

function openPaymentModal(product) {

    selectedProduct = product;

    checkoutProductName.textContent =
        product.name;

    checkoutProductPrice.textContent =
        "K" + product.price;

    customerEmail.value = "";

    paymentModal.classList.remove("hidden");

    document.body.style.overflow = "hidden";

    setTimeout(() => {
        customerEmail.focus();
    }, 100);
}


/* =========================
   CLOSE PAYMENT MODAL
========================= */

function closePaymentModal() {

    paymentModal.classList.add("hidden");

    document.body.style.overflow = "";

    selectedProduct = null;

    customerEmail.value = "";
}


document
    .getElementById("closePaymentModal")
    .addEventListener(
        "click",
        closePaymentModal
    );


document
    .getElementById("cancelPaymentButton")
    .addEventListener(
        "click",
        closePaymentModal
    );


paymentModal.addEventListener(
    "click",
    function (event) {

        if (event.target === paymentModal) {
            closePaymentModal();
        }

    }
);


/* =========================
   CUSTOM NOTIFICATION
========================= */

function showNotification(
    title,
    message,
    icon = "!"
) {

    notificationTitle.textContent = title;

    notificationMessage.textContent = message;

    notificationIcon.textContent = icon;

    notificationModal.classList.remove("hidden");

    document.body.style.overflow = "hidden";
}


function closeNotification() {

    notificationModal.classList.add("hidden");

    document.body.style.overflow = "";
}


notificationButton.addEventListener(
    "click",
    closeNotification
);


notificationModal.addEventListener(
    "click",
    function (event) {

        if (event.target === notificationModal) {
            closeNotification();
        }

    }
);


/* =========================
   CONTINUE TO LENCO
========================= */

continuePaymentButton.addEventListener(
    "click",
    function () {

        if (!selectedProduct) {
            return;
        }

        const email =
            customerEmail.value.trim();


        /* EMPTY EMAIL */

        if (!email) {

            showNotification(
                "Email Required",
                "Please enter your email address before continuing.",
                "!"
            );

            customerEmail.focus();

            return;
        }


        /* INVALID EMAIL */

        if (!isValidEmail(email)) {

            showNotification(
                "Invalid Email",
                "Please enter a valid email address and try again.",
                "!"
            );

            customerEmail.focus();

            return;
        }


        /* PREVENT DOUBLE CLICK */

        continuePaymentButton.disabled = true;

        continuePaymentButton.textContent =
            "Opening Payment...";


        startLencoPayment(
            selectedProduct,
            email
        );

    }
);


/* =========================
   EMAIL VALIDATION
========================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* =========================
   START LENCO PAYMENT
========================= */

function startLencoPayment(
    product,
    email
) {

    const reference =
        "product-" +
        product.productNumber +
        "-" +
        Date.now();


    paymentModal.classList.add("hidden");

    document.body.style.overflow = "";


    LencoPay.getPaid({

        key:
            "pub-0208070bff2479b634c9f91f8ef7e1f306758ee44ee5b278",

        reference:
            reference,

        email:
            email,

        amount:
            product.price,

        currency:
            "ZMW",

        channels: [
            "card",
            "mobile-money"
        ],

        label:
            product.name,

        customer: {
            phone: ""
        },


        /* =====================
           PAYMENT SUCCESS
        ===================== */

        onSuccess:
            function (response) {

                resetPaymentButton();

                showPurchaseSummary(
                    product,
                    response.reference || reference
                );

            },


        /* =====================
           PAYMENT CLOSED
        ===================== */

        onClose:
            function () {

                resetPaymentButton();

                showNotification(
                    "Payment Not Completed",
                    "Your payment was not completed. You can try again when you're ready.",
                    "!"
                );

            },


        /* =====================
           CONFIRMATION PENDING
        ===================== */

        onConfirmationPending:
            function () {

                resetPaymentButton();

                showNotification(
                    "Payment Being Confirmed",
                    "Your payment is being confirmed. Please wait for the confirmation.",
                    "..."
                );

            }

    });
}


/* =========================
   RESET PAYMENT BUTTON
========================= */

function resetPaymentButton() {

    continuePaymentButton.disabled = false;

    continuePaymentButton.textContent =
        "Continue to Payment";
}


/* =========================
   PURCHASE SUMMARY
========================= */

function showPurchaseSummary(
    product,
    reference
) {

    const summarySection =
        document.getElementById("summarySection");

    const purchaseSummary =
        document.getElementById("purchaseSummary");


    let actionButton = "";


    /* MAIN PRODUCT
       SHOW CALL BUTTON */

    if (product.phone) {

        actionButton = `
            <div class="purchase-action">

                <button
                    type="button"
                    class="call-product-button"
                    onclick="callProduct('${product.phone}')"
                >
                    Call Now
                </button>

            </div>
        `;
    }


    /* FEATURED PRODUCT
       SHOW FEATURE BUTTON */

    else if (product.link) {

        actionButton = `
            <div class="purchase-action">

                <button
                    type="button"
                    class="open-feature-button"
                    onclick="openProductLink('${product.link}')"
                >
                    Open Feature
                </button>

            </div>
        `;
    }


    purchaseSummary.innerHTML = `

        <div class="payment-success-message">

            <div class="success-icon">
                ✓
            </div>

            <div>

                <strong>
                    Payment Confirmed
                </strong>

                <p>
                    Your purchase has been successfully processed.
                </p>

            </div>

        </div>


        <div class="summary-row">

            <span class="summary-label">
                Product Number
            </span>

            <span class="summary-value">
                ${product.productNumber}
            </span>

        </div>


        <div class="summary-row">

            <span class="summary-label">
                Product
            </span>

            <span class="summary-value">
                ${product.name}
            </span>

        </div>


        <div class="summary-row">

            <span class="summary-label">
                Quantity
            </span>

            <span class="summary-value">
                1
            </span>

        </div>


        <div class="summary-row">

            <span class="summary-label">
                Amount
            </span>

            <span class="summary-value">
                K${product.price}
            </span>

        </div>


        <div class="summary-row">

            <span class="summary-label">
                Location
            </span>

            <span class="summary-value">
                ${product.location}
            </span>

        </div>


        <div class="summary-row">

            <span class="summary-label">
                Payment Reference
            </span>

            <span class="summary-value">
                ${reference}
            </span>

        </div>


        ${actionButton}

    `;


    summarySection.classList.remove("hidden");


    summarySection.scrollIntoView({
        behavior: "smooth"
    });
}


/* =========================
   CALL MAIN PRODUCT
========================= */

function callProduct(phone) {

    window.location.href =
        "tel:" + phone;
}


/* =========================
   OPEN FEATURE
========================= */

function openProductLink(link) {

    window.location.href =
        link;
}


/* =========================
   ESC KEY
========================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") {
            return;
        }


        const imagePreview =
            document.getElementById("imagePreview");


        if (
            !imagePreview.classList.contains("hidden")
        ) {

            closeImagePreview();

            return;
        }


        if (
            !paymentModal.classList.contains("hidden")
        ) {

            closePaymentModal();

            return;
        }


        if (
            !notificationModal.classList.contains("hidden")
        ) {

            closeNotification();

        }

    }
);