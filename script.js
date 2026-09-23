/* =========================================================
   BAKULU PAYMENT + PRODUCTS
========================================================= */


/* =========================================================
   PRODUCTS
========================================================= */

const products = [
    {
        productNumber: "001",
        name: "Product One",
        price: 10,
        description: "This is the description of product one.",
        image: "images/product1.jpg",
        location: "Lusaka",
        phone: "+260XXXXXXXXX"
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


const featuredProducts = [
    {
        productNumber: "101",
        name: "Featured One",
        price: 15,
        image: "images/product4.jpg",
        location: "Lusaka",
        link: "https://example.com/featured-one"
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


/* =========================================================
   SETTINGS
========================================================= */

const LENCO_PUBLIC_KEY =
    "pub-0208070bff2479b634c9f91f8ef7e1f306758ee44ee5b278";

const VERIFY_ENDPOINT =
    "/api/verify-payment";

const PAYMENT_CURRENCY =
    "ZMW";

const MAX_VERIFICATION_ATTEMPTS =
    40;

const VERIFICATION_INTERVAL =
    3000;


/* =========================================================
   STATE
========================================================= */

let selectedProduct = null;

let currentPayment = null;

let verificationTimer = null;

let verificationAttempts = 0;

let paymentFinalized = false;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const productContainer =
    document.getElementById("productContainer");

const featuredProductContainer =
    document.getElementById(
        "featuredProductContainer"
    );

const paymentModal =
    document.getElementById("paymentModal");

const customerEmail =
    document.getElementById("customerEmail");

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

const notificationModal =
    document.getElementById(
        "notificationModal"
    );

const notificationIcon =
    document.getElementById(
        "notificationIcon"
    );

const notificationTitle =
    document.getElementById(
        "notificationTitle"
    );

const notificationMessage =
    document.getElementById(
        "notificationMessage"
    );

const notificationButton =
    document.getElementById(
        "notificationButton"
    );


/* =========================================================
   RENDER MAIN PRODUCTS
========================================================= */

products.forEach((product, index) => {

    const card =
        document.createElement("div");

    card.className =
        "product-card";

    card.innerHTML = `
        <div
            class="product-image-container"
            onclick="previewImage('${product.image}', '${escapeHtml(product.name)}')"
        >
            <img
                class="product-image"
                src="${product.image}"
                alt="${escapeHtml(product.name)}"
                loading="lazy"
            >
        </div>

        <div class="product-info">

            <div class="product-number">
                PRODUCT ${product.productNumber}
            </div>

            <h3 class="product-name">
                ${escapeHtml(product.name)}
            </h3>

            <p class="product-description">
                ${escapeHtml(product.description)}
            </p>

            <div class="product-price">
                K${formatAmount(product.price)}
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


/* =========================================================
   RENDER FEATURED PRODUCTS
========================================================= */

featuredProducts.forEach((product, index) => {

    const card =
        document.createElement("div");

    card.className =
        "product-card";

    card.innerHTML = `
        <div
            class="product-image-container"
            onclick="previewImage('${product.image}', '${escapeHtml(product.name)}')"
        >
            <img
                class="product-image"
                src="${product.image}"
                alt="${escapeHtml(product.name)}"
                loading="lazy"
            >
        </div>

        <div class="product-info">

            <div class="product-number">
                FEATURED ${product.productNumber}
            </div>

            <h3 class="product-name">
                ${escapeHtml(product.name)}
            </h3>

            <div class="product-price">
                K${formatAmount(product.price)}
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


/* =========================================================
   IMAGE PREVIEW
========================================================= */

function previewImage(image, name) {

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
        function (event) {

            if (
                event.target === this
            ) {
                closeImagePreview();
            }

        }
    );


/* =========================================================
   PAYMENT MODAL
========================================================= */

function openPaymentModal(product) {

    if (!product) {
        showNotification(
            "Payment Error",
            "We could not load this product. Please refresh the page and try again.",
            "!"
        );

        return;
    }

    selectedProduct =
        product;

    paymentFinalized =
        false;

    checkoutProductName.textContent =
        product.name;

    checkoutProductPrice.textContent =
        "K" + formatAmount(product.price);

    customerEmail.value =
        "";

    continuePaymentButton.disabled =
        false;

    continuePaymentButton.textContent =
        "Continue to Payment";

    paymentModal.classList.remove(
        "hidden"
    );

    document.body.style.overflow =
        "hidden";

    setTimeout(() => {

        customerEmail.focus();

    }, 100);
}


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


paymentModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            paymentModal
        ) {
            closePaymentModal();
        }

    }
);


/* =========================================================
   NOTIFICATIONS
========================================================= */

function showNotification(
    title,
    message,
    icon = "!"
) {

    notificationTitle.textContent =
        title;

    notificationMessage.textContent =
        message;

    notificationIcon.textContent =
        icon;

    notificationModal.classList.remove(
        "hidden"
    );

    document.body.style.overflow =
        "hidden";
}


function closeNotification() {

    notificationModal.classList.add(
        "hidden"
    );

    document.body.style.overflow =
        "";
}


notificationButton.addEventListener(
    "click",
    closeNotification
);


notificationModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            notificationModal
        ) {
            closeNotification();
        }

    }
);


/* =========================================================
   START PAYMENT
========================================================= */

continuePaymentButton.addEventListener(
    "click",
    function () {

        if (!selectedProduct) {
            showNotification(
                "Payment Error",
                "Please select a product again.",
                "!"
            );

            return;
        }

        const email =
            customerEmail.value.trim();

        if (!email) {

            showNotification(
                "Email Required",
                "Please enter your email address before continuing.",
                "!"
            );

            customerEmail.focus();

            return;
        }


        if (!isValidEmail(email)) {

            showNotification(
                "Invalid Email",
                "Please enter a valid email address and try again.",
                "!"
            );

            customerEmail.focus();

            return;
        }


        startLencoPayment(
            selectedProduct,
            email
        );

    }
);


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
}


/* =========================================================
   START LENCO PAYMENT
========================================================= */

function startLencoPayment(
    product,
    email
) {

    if (
        typeof LencoPay ===
        "undefined"
    ) {

        showNotification(
            "Payment Unavailable",
            "The payment service could not be loaded. Please check your internet connection and try again.",
            "!"
        );

        return;
    }


    const reference =
        createPaymentReference(
            product
        );


    currentPayment = {

        reference:
            reference,

        product:
            product,

        email:
            email,

        amount:
            Number(product.price),

        currency:
            PAYMENT_CURRENCY

    };


    paymentFinalized =
        false;


    continuePaymentButton.disabled =
        true;

    continuePaymentButton.textContent =
        "Opening Payment...";


    paymentModal.classList.add(
        "hidden"
    );

    document.body.style.overflow =
        "";


    try {

        LencoPay.getPaid({

            key:
                LENCO_PUBLIC_KEY,

            reference:
                reference,

            email:
                email,

            amount:
                Number(product.price),

            currency:
                PAYMENT_CURRENCY,

            channels: [
                "card",
                "mobile-money"
            ],

            label:
                product.name,

            customer: {
                phone: ""
            },


            /* =====================================
               SUCCESS CALLBACK
            ===================================== */

            onSuccess:
                function (response) {

                    const returnedReference =
                        response &&
                        response.reference
                            ? response.reference
                            : reference;


                    currentPayment.reference =
                        returnedReference;


                    verifyPaymentWithRetry(
                        returnedReference
                    );

                },


            /* =====================================
               PAYMENT WINDOW CLOSED
            ===================================== */

            onClose:
                function () {

                    if (
                        paymentFinalized
                    ) {
                        return;
                    }


                    if (
                        !currentPayment
                    ) {
                        resetPaymentButton();

                        return;
                    }


                    /*
                       Do not immediately say "failed".

                       The customer may have completed
                       payment immediately before closing
                       the Lenco window.
                    */

                    verifyPaymentWithRetry(
                        currentPayment.reference
                    );

                },


            /* =====================================
               CONFIRMATION PENDING
            ===================================== */

            onConfirmationPending:
                function () {

                    if (
                        paymentFinalized
                    ) {
                        return;
                    }


                    showNotification(
                        "Confirming Payment",
                        "Your payment has been submitted. We are checking with Lenco for confirmation. Please do not pay again.",
                        "..."
                    );


                    if (
                        currentPayment
                    ) {

                        verifyPaymentWithRetry(
                            currentPayment.reference
                        );

                    }

                }

        });

    } catch (error) {

        console.error(
            "Lenco payment error:",
            error
        );

        resetPaymentButton();

        showNotification(
            "Payment Error",
            "We could not open the payment window. Please try again.",
            "!"
        );

    }

}


/* =========================================================
   CREATE UNIQUE PAYMENT REFERENCE
========================================================= */

function createPaymentReference(
    product
) {

    const timestamp =
        Date.now();

    const randomPart =
        Math.random()
            .toString(36)
            .substring(2, 8);


    /*
       Only use characters supported
       by Lenco references.
    */

    return (
        "bakulu-" +
        product.productNumber +
        "-" +
        timestamp +
        "-" +
        randomPart
    );

}


/* =========================================================
   VERIFY PAYMENT THROUGH OUR SERVER
========================================================= */

async function verifyPaymentWithRetry(
    reference
) {

    if (
        paymentFinalized
    ) {
        return;
    }


    if (
        !currentPayment
    ) {
        return;
    }


    clearVerificationTimer();


    verificationAttempts =
        0;


    showPaymentCheckingMessage();


    await checkPaymentStatus(
        reference
    );

}


/* =========================================================
   CHECK PAYMENT STATUS
========================================================= */

async function checkPaymentStatus(
    reference
) {

    if (
        paymentFinalized
    ) {
        return;
    }


    verificationAttempts++;


    try {

        const response =
            await fetch(
                VERIFY_ENDPOINT +
                "?reference=" +
                encodeURIComponent(
                    reference
                ) +
                "&amount=" +
                encodeURIComponent(
                    currentPayment.amount
                ) +
                "&currency=" +
                encodeURIComponent(
                    currentPayment.currency
                ),
                {
                    method: "GET",

                    headers: {
                        "Accept":
                            "application/json"
                    },

                    cache: "no-store"
                }
            );


        let result = null;


        try {

            result =
                await response.json();

        } catch {

            result = null;

        }


        if (
            response.ok &&
            result &&
            result.success === true &&
            result.payment &&
            result.payment.status ===
                "successful"
        ) {

            finalizeSuccessfulPayment(
                result.payment
            );

            return;
        }


        /*
           Payment is still pending.
        */

        if (
            result &&
            result.status ===
                "pending"
        ) {

            scheduleNextVerification(
                reference
            );

            return;
        }


        /*
           Payment failed.
        */

        if (
            result &&
            result.status ===
                "failed"
        ) {

            handleFailedPayment(
                result.message
            );

            return;
        }


        /*
           Temporary server/API issue.
           Retry instead of immediately
           telling the customer they failed.
        */

        if (
            verificationAttempts <
            MAX_VERIFICATION_ATTEMPTS
        ) {

            scheduleNextVerification(
                reference
            );

            return;
        }


        showPaymentStillChecking();


    } catch (error) {

        console.error(
            "Payment verification error:",
            error
        );


        /*
           Network problem should not
           automatically mark payment failed.
        */

        if (
            verificationAttempts <
            MAX_VERIFICATION_ATTEMPTS
        ) {

            scheduleNextVerification(
                reference
            );

            return;
        }


        showPaymentStillChecking();

    }

}


/* =========================================================
   SCHEDULE ANOTHER CHECK
========================================================= */

function scheduleNextVerification(
    reference
) {

    clearVerificationTimer();


    verificationTimer =
        setTimeout(
            function () {

                checkPaymentStatus(
                    reference
                );

            },
            VERIFICATION_INTERVAL
        );

}


/* =========================================================
   SUCCESSFUL PAYMENT
========================================================= */

function finalizeSuccessfulPayment(
    payment
) {

    if (
        paymentFinalized
    ) {
        return;
    }


    if (
        !currentPayment ||
        !currentPayment.product
    ) {
        return;
    }


    paymentFinalized =
        true;


    clearVerificationTimer();


    resetPaymentButton();


    const product =
        currentPayment.product;


    const reference =
        payment.reference ||
        currentPayment.reference;


    /*
       Important:
       The server has already checked
       the actual Lenco transaction.
    */

    showPurchaseSummary(
        product,
        reference
    );


    currentPayment =
        null;

}


/* =========================================================
   PAYMENT FAILED
========================================================= */

function handleFailedPayment(
    message
) {

    if (
        paymentFinalized
    ) {
        return;
    }


    clearVerificationTimer();


    resetPaymentButton();


    showNotification(
        "Payment Not Completed",
        message ||
            "The payment was not completed. You can try again when you are ready.",
        "!"
    );


    currentPayment =
        null;

}


/* =========================================================
   PAYMENT CHECKING MESSAGE
========================================================= */

function showPaymentCheckingMessage() {

    /*
       Only show this if the notification
       isn't already open.
    */

    if (
        notificationModal.classList.contains(
            "hidden"
        )
    ) {

        showNotification(
            "Checking Payment",
            "Please wait while we confirm your payment.",
            "..."
        );

    }

}


/* =========================================================
   PAYMENT STILL CHECKING
========================================================= */

function showPaymentStillChecking() {

    resetPaymentButton();


    showNotification(
        "Payment Still Being Confirmed",
        "We could not confirm the payment yet. Please do not pay again. Your payment may still be processing. You can refresh this page later and check your Lenco transaction.",
        "..."
    );

}


/* =========================================================
   RESET PAYMENT BUTTON
========================================================= */

function resetPaymentButton() {

    continuePaymentButton.disabled =
        false;

    continuePaymentButton.textContent =
        "Continue to Payment";

}


/* =========================================================
   CLEAR TIMER
========================================================= */

function clearVerificationTimer() {

    if (
        verificationTimer
    ) {

        clearTimeout(
            verificationTimer
        );

        verificationTimer =
            null;

    }

}


/* =========================================================
   PURCHASE SUMMARY
========================================================= */

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


    let actionButton =
        "";


    /*
       MAIN PRODUCT
       -> Call Now
    */

    if (
        product.phone
    ) {

        actionButton = `
            <div class="purchase-action">

                <button
                    type="button"
                    class="call-product-button"
                    onclick="callProduct('${escapeHtml(product.phone)}')"
                >
                    Call Now
                </button>

            </div>
        `;

    }


    /*
       FEATURED PRODUCT
       -> Open Feature
    */

    else if (
        product.link
    ) {

        actionButton = `
            <div class="purchase-action">

                <button
                    type="button"
                    class="open-feature-button"
                    onclick="openProductLink('${escapeHtml(product.link)}')"
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
                    Your payment has been successfully verified.
                </p>

            </div>

        </div>


        <div class="summary-row">

            <span class="summary-label">
                Product Number
            </span>

            <span class="summary-value">
                ${escapeHtml(
                    product.productNumber
                )}
            </span>

        </div>


        <div class="summary-row">

            <span class="summary-label">
                Product
            </span>

            <span class="summary-value">
                ${escapeHtml(
                    product.name
                )}
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
                K${formatAmount(
                    product.price
                )}
            </span>

        </div>


        <div class="summary-row">

            <span class="summary-label">
                Location
            </span>

            <span class="summary-value">
                ${escapeHtml(
                    product.location
                )}
            </span>

        </div>


        <div class="summary-row">

            <span class="summary-label">
                Payment Reference
            </span>

            <span class="summary-value">
                ${escapeHtml(
                    reference
                )}
            </span>

        </div>


        ${actionButton}

    `;


    summarySection.classList.remove(
        "hidden"
    );


    summarySection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================================
   CALL PRODUCT
========================================================= */

function callProduct(
    phone
) {

    window.location.href =
        "tel:" + phone;

}


/* =========================================================
   OPEN FEATURE
========================================================= */

function openProductLink(
    link
) {

    /*
       Only allow http/https links.
    */

    try {

        const url =
            new URL(link);

        if (
            url.protocol !==
                "https:" &&
            url.protocol !==
                "http:"
        ) {

            return;

        }


        window.location.href =
            url.href;

    } catch {

        showNotification(
            "Link Error",
            "This feature link is not available.",
            "!"
        );

    }

}


/* =========================================================
   FORMAT AMOUNT
========================================================= */

function formatAmount(
    amount
) {

    const number =
        Number(amount);


    if (
        Number.isNaN(number)
    ) {

        return "0";

    }


    return number
        .toFixed(2)
        .replace(
            /\.00$/,
            ""
        );

}


/* =========================================================
   BASIC HTML ESCAPE
========================================================= */

function escapeHtml(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !==
            "Escape"
        ) {
            return;
        }


        const imagePreview =
            document.getElementById(
                "imagePreview"
            );


        if (
            !imagePreview.classList.contains(
                "hidden"
            )
        ) {

            closeImagePreview();

            return;

        }


        if (
            !paymentModal.classList.contains(
                "hidden"
            )
        ) {

            closePaymentModal();

            return;

        }


        if (
            !notificationModal.classList.contains(
                "hidden"
            )
        ) {

            closeNotification();

        }

    }
);