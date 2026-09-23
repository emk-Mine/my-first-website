const contactButton = document.getElementById("contactButton");

contactButton.addEventListener("click", () => {

    const email = prompt("Enter your email address:");

    if (!email) {
        return;
    }

    LencoPay.getPaid({
        key: "pub-4387d952b76bff4bba2d7561e2a161229c5c73e6ad72ffd3",
        reference: "getstarted-" + Date.now(),
        email: email,
        amount: 10,
        currency: "ZMW",
        channels: ["card", "mobile-money"],

        onSuccess: function(response) {
            alert(
                "Payment successful!\n\n" +
                "Reference: " + response.reference
            );
        },

        onClose: function() {
            alert("Payment window closed.");
        },

        onConfirmationPending: function() {
            alert("Your payment is being confirmed. Please wait.");
        }
    });

});