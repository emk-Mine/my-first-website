/* =========================
   MAIN PRODUCTS
========================= */

const products = [

    {
        productNumber: "001",
        name: "Product One",
        price: 10,
        description: "This is the description of product one.",
        image: "images/product1.jpg",
        location: "Lusaka"
    },

    {
        productNumber: "002",
        name: "Product Two",
        price: 25,
        description: "This is the description of product two.",
        image: "images/product2.jpg",
        location: "Lusaka"
    },

    {
        productNumber: "003",
        name: "Product Three",
        price: 50,
        description: "This is the description of product three.",
        image: "images/product3.jpg",
        location: "Ndola"
    }

];


/* =========================
   FEATURED PRODUCTS
========================= */

const featuredProducts = [

    {
        productNumber: "101",
        name: "Featured One",
        price: 15,
        image: "images/product4.jpg",
        location: "Lusaka"
    },

    {
        productNumber: "102",
        name: "Featured Two",
        price: 20,
        image: "images/product5.jpg",
        location: "Lusaka"
    },

    {
        productNumber: "103",
        name: "Featured Three",
        price: 30,
        image: "images/product6.jpg",
        location: "Ndola"
    },

    {
        productNumber: "104",
        name: "Featured Four",
        price: 40,
        image: "images/product7.jpg",
        location: "Kitwe"
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
    document.getElementById(
        "productContainer"
    );

const featuredProductContainer =
    document.getElementById(
        "featuredProductContainer"
    );

const paymentModal =
    document.getElementById(
        "paymentModal"
    );

const customerEmail =
    document.getElementById(
        "customerEmail"
    );

const checkoutProductName =
    document.getElementById(
        "checkoutProductName"
    );

const checkoutProductPrice =
    document.getElementById(
        "checkoutProductPrice"
    );

const continuePaymentButton =
    document.getElementById(
        "continuePaymentButton"
    );


/* =========================
   MAIN PRODUCT CARDS
========================= */

products.forEach(
    (product, index) => {

        const card =
            document.createElement("div");

        card.className =
            "product-card";


        card.innerHTML = `

            <div
                class="product-image-container"
                onclick="previewImage(
                    '${product.image}',
                    '${product.name}'
                )"
            >

                <img
                    class="product-image"
                    src="${product.image}"
                    alt="${product.name}"
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
                    class="purchase-button"
                    onclick="openPaymentModal(
                        products[${index}]
                    )"
                >

                    Purchase

                </button>

            </div>

        `;


        productContainer.appendChild(card);

    }
);


/* =========================
   FEATURED PRODUCT CARDS
========================= */

featuredProducts.forEach(
    (product, index) => {

        const card =
            document.createElement("div");

        card.className =
            "featured-product-card";


        card.innerHTML = `

            <div
                class="featured-image-container"
                onclick="previewImage(
                    '${product.image}',
                    '${product.name}'
                )"
            >

                <img
                    class="featured-image"
                    src="${product.image}"
                    alt="${product.name}"
                >

            </div>


            <div class="featured-product-info">

                <h3 class="featured-product-name">

                    ${product.name}

                </h3>


                <div class="featured-product-price">

                    K${product.price}

                </div>


                <button
                    class="featured-purchase-button"
                    onclick="openPaymentModal(
                        featuredProducts[${index}]
                    )"
                >

                    Purchase

                </button>

            </div>

        `;


        featuredProductContainer
            .appendChild(card);

    }
);


/* =========================
   IMAGE PREVIEW
========================= */

function previewImage(
    image,
    name
) {

    const preview =
        document.getElementById(
            "imagePreview"
        );

    const previewImageElement =
        document.getElementById(
            "previewImage"
        );


    previewImageElement.src =
        image;

    previewImageElement.alt =
        name;


    preview.classList.remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================
   CLOSE IMAGE PREVIEW
========================= */

function closeImagePreview() {

    const preview =
        document.getElementById(
            "imagePreview"
        );


    preview.classList.add(
        "hidden"
    );


    document.body.style.overflow =
        "";

}


document
    .getElementById("closePreview")
    .addEventListener(
        "click",
        closeImagePreview
    );


document
    .getElementById("imagePreview")
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target === this
            ) {

                closeImagePreview();

            }

        }
    );


/* =========================
   OPEN PAYMENT MODAL
========================= */

function openPaymentModal(product) {

    selectedProduct =
        product;


    checkoutProductName.textContent =
        product.name;


    checkoutProductPrice.textContent =
        "K" + product.price;


    customerEmail.value =
        "";


    paymentModal.classList.remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";


    setTimeout(
        function() {

            customerEmail.focus();

        },
        100
    );

}


/* =========================
   CLOSE PAYMENT MODAL
========================= */

function closePaymentModal() {

    paymentModal.classList.add(
        "hidden"
    );


    document.body.style.overflow =
        "";


    selectedProduct =
        null;


    customerEmail.value =
        "";

}


document
    .getElementById(
        "closePaymentModal"
    )
    .addEventListener(
        "click",
        closePaymentModal
    );


document
    .getElementById(
        "cancelPaymentButton"
    )
    .addEventListener(
        "click",
        closePaymentModal
    );


/* Close when clicking outside */

paymentModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            paymentModal
        ) {

            closePaymentModal();

        }

    }
);


/* =========================
   CONTINUE TO LENCO
========================= */

continuePaymentButton.addEventListener(
    "click",
    function() {

        if (!selectedProduct) {

            return;

        }


        const email =
            customerEmail.value.trim();


        /* Validate email */

        if (!email) {

            customerEmail.focus();

            alert(
                "Please enter your email address."
            );

            return;

        }


        if (
            !isValidEmail(email)
        ) {

            customerEmail.focus();

            alert(
                "Please enter a valid email address."
            );

            return;

        }


        /* Prevent double clicks */

        continuePaymentButton.disabled =
            true;

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

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

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


    /*
        Close our custom modal before
        opening the Lenco payment window.
    */

    paymentModal.classList.add(
        "hidden"
    );


    document.body.style.overflow =
        "";


    LencoPay.getPaid({

        key:
            "pub-4387d952b76bff4bba2d7561e2a161229c5c73e6ad72ffd3",


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


        onSuccess:
            function(response) {

                resetPaymentButton();


                /*
                    IMPORTANT:
                    For production, this success
                    callback should be followed by
                    server-side payment verification.
                */

                showPurchaseSummary(

                    product,

                    response.reference

                );

            },


        onClose:
            function() {

                resetPaymentButton();

                alert(
                    "Payment was not completed."
                );

            },


        onConfirmationPending:
            function() {

                resetPaymentButton();

                alert(
                    "Your payment is being confirmed. Please wait."
                );

            }

    });

}


/* =========================
   RESET PAYMENT BUTTON
========================= */

function resetPaymentButton() {

    continuePaymentButton.disabled =
        false;


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
        document.getElementById(
            "summarySection"
        );


    const purchaseSummary =
        document.getElementById(
            "purchaseSummary"
        );


    purchaseSummary.innerHTML = `

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

    `;


    summarySection.classList.remove(
        "hidden"
    );


    summarySection.scrollIntoView({

        behavior: "smooth"

    });

}


/* =========================
   ESC KEY
========================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            const imagePreview =
                document.getElementById(
                    "imagePreview"
                );


            if (
                !imagePreview.classList
                    .contains("hidden")
            ) {

                closeImagePreview();

                return;

            }


            if (
                !paymentModal.classList
                    .contains("hidden")
            ) {

                closePaymentModal();

            }

        }

    }
);