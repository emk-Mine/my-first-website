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
        image: "images/product4.jpg"
    },

    {
        productNumber: "102",
        name: "Featured Two",
        price: 20,
        image: "images/product5.jpg"
    },

    {
        productNumber: "103",
        name: "Featured Three",
        price: 30,
        image: "images/product6.jpg"
    },

    {
        productNumber: "104",
        name: "Featured Four",
        price: 40,
        image: "images/product7.jpg"
    }

];


/* =========================
   MAIN PRODUCT ROW
========================= */

const productContainer =
    document.getElementById("productContainer");


products.forEach((product, index) => {

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
                onclick="purchaseProduct(${index})"
            >

                Purchase

            </button>

        </div>

    `;


    productContainer.appendChild(card);

});


/* =========================
   FEATURED PRODUCT ROW
========================= */

const featuredProductContainer =
    document.getElementById(
        "featuredProductContainer"
    );


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
                    onclick="purchaseFeaturedProduct(${index})"
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


/* Close with X */

document
    .getElementById("closePreview")
    .addEventListener(
        "click",
        closeImagePreview
    );


/* Close when clicking outside image */

document
    .getElementById("imagePreview")
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                this
            ) {

                closeImagePreview();

            }

        }
    );


/* Close with ESC */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeImagePreview();

        }

    }
);


/* =========================
   MAIN PRODUCT PURCHASE
========================= */

function purchaseProduct(index) {

    const product =
        products[index];


    const confirmed =
        confirm(
            `Purchase ${product.name} for K${product.price}?`
        );


    if (!confirmed) {

        return;

    }


    const email =
        prompt(
            "Lenco requires an email address for payment.\n\nEnter your email:"
        );


    if (!email) {

        return;

    }


    const reference =
        "product-" +
        product.productNumber +
        "-" +
        Date.now();


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

                showPurchaseSummary(

                    product,

                    response.reference

                );

            },


        onClose:
            function() {

                alert(
                    "Payment was not completed."
                );

            },


        onConfirmationPending:
            function() {

                alert(
                    "Your payment is being confirmed. Please wait."
                );

            }

    });

}


/* =========================
   FEATURED PRODUCT PURCHASE
========================= */

function purchaseFeaturedProduct(index) {

    const product =
        featuredProducts[index];


    const confirmed =
        confirm(
            `Purchase ${product.name} for K${product.price}?`
        );


    if (!confirmed) {

        return;

    }


    const email =
        prompt(
            "Lenco requires an email address for payment.\n\nEnter your email:"
        );


    if (!email) {

        return;

    }


    const reference =
        "featured-" +
        product.productNumber +
        "-" +
        Date.now();


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

                alert(
                    "Payment successful for " +
                    product.name
                );

            },


        onClose:
            function() {

                alert(
                    "Payment was not completed."
                );

            },


        onConfirmationPending:
            function() {

                alert(
                    "Your payment is being confirmed. Please wait."
                );

            }

    });

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