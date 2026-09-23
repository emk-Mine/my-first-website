/* =========================================================
   BAKULU
   MOBILE MONEY PAYMENTS
   LENCO + CLOUDFLARE
========================================================= */


/* =========================================================
   PRODUCTS
========================================================= */

const products = [

    {
        productNumber: "001",
        name: "Product One",
        price: 2,
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

const INITIATE_ENDPOINT =
    "/api/initiate-payment";

const VERIFY_ENDPOINT =
    "/api/verify-payment";

const PAYMENT_CURRENCY =
    "ZMW";

const VERIFICATION_INTERVAL =
    3000;

const MAX_VERIFICATION_ATTEMPTS =
    40;


/* =========================================================
   STATE
========================================================= */

let selectedProduct = null;

let currentPayment = null;

let verificationTimer = null;

let verificationAttempts = 0;

let paymentFinalized = false;

let paymentVerificationRunning = false;


/* =========================================================
   DOM
========================================================= */

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

const customerPhone =
    document.getElementById(
        "customerPhone"
    );

const mobileMoneyOperator =
    document.getElementById(
        "mobileMoneyOperator"
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
   RENDER PRODUCTS
========================================================= */

products.forEach(
    function (product, index) {

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "product-card";

        card.innerHTML = `

            <div
                class="product-image-container"
                onclick="previewImage(
                    '${product.image}',
                    '${escapeHtml(product.name)}'
                )"
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
                    onclick="openPaymentModal(
                        products[${index}]
                    )"
                >
                    Purchase
                </button>

            </div>

        `;

        productContainer.appendChild(
            card
        );

    }
);


/* =========================================================
   RENDER FEATURED PRODUCTS
========================================================= */

featuredProducts.forEach(
    function (product, index) {

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "product-card";

        card.innerHTML = `

            <div
                class="product-image-container"
                onclick="previewImage(
                    '${product.image}',
                    '${escapeHtml(product.name)}'
                )"
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
                    onclick="openPaymentModal(
                        featuredProducts[${index}]
                    )"
                >
                    Purchase
                </button>

            </div>

        `;

        featuredProductContainer.appendChild(
            card
        );

    }
);


/* =========================================================
   IMAGE PREVIEW
========================================================= */

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
    .getElementById(
        "closePreview"
    )
    .addEventListener(
        "click",
        closeImagePreview
    );


document
    .getElementById(
        "imagePreview"
    )
    .addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                this
            ) {

                closeImagePreview();

            }

        }
    );


/* =========================================================
   OPEN PAYMENT MODAL
========================================================= */

function openPaymentModal(
    product
) {

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
        "K" +
        formatAmount(
            product.price
        );


    customerEmail.value =
        "";

    customerPhone.value =
        "";

    mobileMoneyOperator.value =
        "";


    continuePaymentButton.disabled =
        false;


    continuePaymentButton.textContent =
        "Pay Now";


    paymentModal.classList.remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";


    setTimeout(
        function () {

            customerEmail.focus();

        },
        100
    );

}


/* =========================================================
   CLOSE PAYMENT MODAL
========================================================= */

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

    customerPhone.value =
        "";

    mobileMoneyOperator.value =
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
   NOTIFICATION
========================================================= */

function showNotification(
    title,
    message,
    icon
) {

    notificationTitle.textContent =
        title;

    notificationMessage.textContent =
        message;

    notificationIcon.textContent =
        icon || "!";


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
   PAY BUTTON
========================================================= */

continuePaymentButton.addEventListener(
    "click",
    async function () {

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


        const phone =
            customerPhone.value.trim();


        const operator =
            mobileMoneyOperator.value;


        /* EMAIL */

        if (!email) {

            showNotification(
                "Email Required",
                "Please enter your email address.",
                "!"
            );

            customerEmail.focus();

            return;
        }


        if (
            !isValidEmail(
                email
            )
        ) {

            showNotification(
                "Invalid Email",
                "Please enter a valid email address.",
                "!"
            );

            customerEmail.focus();

            return;
        }


        /* PHONE */

        if (!phone) {

            showNotification(
                "Phone Number Required",
                "Please enter the mobile-money phone number.",
                "!"
            );

            customerPhone.focus();

            return;
        }


        if (
            !isValidZambianPhone(
                phone
            )
        ) {

            showNotification(
                "Invalid Phone Number",
                "Please enter a valid Zambian mobile-money number.",
                "!"
            );

            customerPhone.focus();

            return;
        }


        /* NETWORK */

        if (!operator) {

            showNotification(
                "Network Required",
                "Please select MTN, Airtel, or Zamtel.",
                "!"
            );

            mobileMoneyOperator.focus();

            return;
        }


        await startMobileMoneyPayment(
            selectedProduct,
            email,
            phone,
            operator
        );

    }
);


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function isValidEmail(
    email
) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================================================
   ZAMBIAN PHONE VALIDATION
========================================================= */

function normalizeZambianPhone(
    phone
) {

    let cleaned =
        String(phone)
            .replace(
                /\s+/g,
                ""
            )
            .replace(
                /-/g,
                ""
            );


    if (
        cleaned.startsWith(
            "+260"
        )
    ) {

        return "0" +
            cleaned.substring(
                4
            );

    }


    if (
        cleaned.startsWith(
            "260"
        )
    ) {

        return "0" +
            cleaned.substring(
                3
            );

    }


    return cleaned;

}


function isValidZambianPhone(
    phone
) {

    const normalized =
        normalizeZambianPhone(
            phone
        );


    return /^0\d{9}$/.test(
        normalized
    );

}


/* =========================================================
   START MOBILE MONEY PAYMENT
========================================================= */

async function startMobileMoneyPayment(
    product,
    email,
    phone,
    operator
) {

    const normalizedPhone =
        normalizeZambianPhone(
            phone
        );


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

        phone:
            normalizedPhone,

        operator:
            operator,

        amount:
            Number(
                product.price
            ),

        currency:
            PAYMENT_CURRENCY

    };


    paymentFinalized =
        false;


    paymentVerificationRunning =
        false;


    continuePaymentButton.disabled =
        true;


    continuePaymentButton.textContent =
        "Sending Payment Prompt...";


    paymentModal.classList.add(
        "hidden"
    );


    document.body.style.overflow =
        "";


    showNotification(
        "Sending Payment Prompt",
        "We are sending a payment request to your mobile phone. Please wait.",
        "..."
    );


    try {

        const response =
            await fetch(
                INITIATE_ENDPOINT,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            reference:
                                reference,

                            amount:
                                Number(
                                    product.price
                                ),

                            currency:
                                PAYMENT_CURRENCY,

                            email:
                                email,

                            phone:
                                normalizedPhone,

                            operator:
                                operator,

                            country:
                                "zm"

                        }),

                    cache:
                        "no-store"
                }
            );


        const result =
            await response.json();


        console.log(
            "Payment initiation response:",
            result
        );


        if (
            !response.ok ||
            !result.success
        ) {

            resetPaymentButton();


            currentPayment =
                null;


            showNotification(
                "Payment Could Not Start",
                result.message ||
                    "Lenco could not start the mobile-money payment.",
                "!"
            );


            return;

        }


        const payment =
            result.payment;


        currentPayment.reference =
            payment.reference ||
            reference;


        closeNotification();


        showNotification(
            "Approve Payment",
            "A payment prompt has been sent to your phone. Approve the payment on your mobile phone to continue.",
            "!"
        );


        beginPaymentVerification(
            currentPayment.reference
        );


    } catch (error) {

        console.error(
            "Payment initiation error:",
            error
        );


        resetPaymentButton();


        currentPayment =
            null;


        showNotification(
            "Connection Error",
            "We could not connect to the payment service. Please check your internet connection and try again.",
            "!"
        );

    }

}


/* =========================================================
   CREATE REFERENCE
========================================================= */

function createPaymentReference(
    product
) {

    const timestamp =
        Date.now();


    const randomPart =
        Math.random()
            .toString(36)
            .substring(
                2,
                9
            );


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
   VERIFY PAYMENT
========================================================= */

function beginPaymentVerification(
    reference
) {

    if (
        paymentFinalized ||
        !currentPayment ||
        paymentVerificationRunning
    ) {

        return;

    }


    paymentVerificationRunning =
        true;


    clearVerificationTimer();


    verificationAttempts =
        0;


    checkPaymentStatus(
        reference
    );

}


async function checkPaymentStatus(
    reference
) {

    if (
        paymentFinalized ||
        !currentPayment
    ) {

        return;

    }


    verificationAttempts++;


    console.log(
        "Checking payment:",
        reference
    );


    console.log(
        "Verification attempt:",
        verificationAttempts
    );


    try {

        const url =
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
            );


        const response =
            await fetch(
                url,
                {
                    method:
                        "GET",

                    headers: {
                        "Accept":
                            "application/json"
                    },

                    cache:
                        "no-store"
                }
            );


        const responseText =
            await response.text();


        console.log(
            "Verification HTTP status:",
            response.status
        );


        console.log(
            "Verification response:",
            responseText
        );


        let result =
            null;


        try {

            result =
                JSON.parse(
                    responseText
                );

        } catch {

            console.error(
                "Invalid verification JSON."
            );

        }


        /* SUCCESS */

        if (
            response.ok &&
            result &&
            result.success === true &&
            result.payment &&
            String(
                result.payment.status
            ).toLowerCase() ===
                "successful"
        ) {

            finalizeSuccessfulPayment(
                result.payment
            );

            return;

        }


        /* FAILED */

        if (
            result &&
            (
                result.status ===
                    "failed" ||

                result.status ===
                    "cancelled"
            )
        ) {

            handleFailedPayment(
                result.message
            );

            return;

        }


        /* KEEP CHECKING */

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
            "Verification error:",
            error
        );


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
   NEXT VERIFICATION
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
   SUCCESS
========================================================= */

function finalizeSuccessfulPayment(
    payment
) {

    if (
        paymentFinalized ||
        !currentPayment
    ) {

        return;

    }


    paymentFinalized =
        true;


    paymentVerificationRunning =
        false;


    clearVerificationTimer();


    resetPaymentButton();


    const product =
        currentPayment.product;


    const reference =
        payment.reference ||
        currentPayment.reference;


    console.log(
        "PAYMENT SUCCESSFULLY VERIFIED:",
        payment
    );


    closeNotification();


    showPurchaseSummary(
        product,
        reference
    );


    currentPayment =
        null;

}


/* =========================================================
   FAILED
========================================================= */

function handleFailedPayment(
    message
) {

    if (
        paymentFinalized
    ) {

        return;

    }


    paymentVerificationRunning =
        false;


    clearVerificationTimer();


    resetPaymentButton();


    currentPayment =
        null;


    showNotification(
        "Payment Not Completed",
        message ||
            "The mobile-money payment was not completed.",
        "!"
    );

}


/* =========================================================
   STILL CHECKING
========================================================= */

function showPaymentStillChecking() {

    paymentVerificationRunning =
        false;


    resetPaymentButton();


    showNotification(
        "Payment Still Processing",
        "We have not received final confirmation yet. Please check your phone and do not submit another payment.",
        "..."
    );

}


/* =========================================================
   RESET BUTTON
========================================================= */

function resetPaymentButton() {

    continuePaymentButton.disabled =
        false;


    continuePaymentButton.textContent =
        "Pay Now";

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
                    Your payment has been successfully verified by Lenco.
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
        behavior:
            "smooth",

        block:
            "start"
    });

}


/* =========================================================
   CALL
========================================================= */

function callProduct(
    phone
) {

    window.location.href =
        "tel:" + phone;

}


/* =========================================================
   FEATURE LINK
========================================================= */

function openProductLink(
    link
) {

    try {

        const url =
            new URL(
                link
            );


        if (
            url.protocol !==
                "https:" &&
            url.protocol !==
                "http:"
        ) {

            throw new Error(
                "Invalid URL"
            );

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
        Number(
            amount
        );


    if (
        Number.isNaN(
            number
        )
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
   ESCAPE HTML
========================================================= */

function escapeHtml(
    value
) {

    return String(
        value
    )

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