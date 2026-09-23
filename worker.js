const LENCO_MOBILE_MONEY_URL =
    "https://api.lenco.co/access/v2/collections/mobile-money";

const LENCO_STATUS_URL =
    "https://api.lenco.co/access/v2/collections/status";


export default {
    async fetch(request, env) {

        const url = new URL(request.url);

        /*
         * API ROUTES
         */
        if (url.pathname === "/api/initiate-payment") {
            if (request.method !== "POST") {
                return json({
                    success: false,
                    message: "Method not allowed."
                }, 405);
            }

            return initiatePayment(request, env);
        }


        if (url.pathname === "/api/verify-payment") {
            if (request.method !== "GET") {
                return json({
                    success: false,
                    message: "Method not allowed."
                }, 405);
            }

            return verifyPayment(request, env);
        }


        /*
         * EVERYTHING ELSE:
         * Serve the normal website files.
         */
        return env.ASSETS.fetch(request);
    }
};


/* =========================================================
   INITIATE MOBILE MONEY PAYMENT
========================================================= */

async function initiatePayment(request, env) {

    try {

        const body = await request.json();

        const reference =
            String(body.reference || "").trim();

        const amount =
            Number(body.amount);

        const currency =
            String(body.currency || "ZMW")
                .toUpperCase();

        const phone =
            normalizeZambianPhone(body.phone);

        const operator =
            String(body.operator || "")
                .toLowerCase();


        /*
         * VALIDATION
         */

        if (!reference) {
            return json({
                success: false,
                message: "Payment reference is missing."
            }, 400);
        }


        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            return json({
                success: false,
                message: "Invalid payment amount."
            }, 400);
        }


        if (currency !== "ZMW") {
            return json({
                success: false,
                message: "Only ZMW payments are supported."
            }, 400);
        }


        if (!isValidZambianPhone(phone)) {
            return json({
                success: false,
                message:
                    "Invalid Zambian mobile-money number."
            }, 400);
        }


        if (
            ![
                "mtn",
                "airtel",
                "zamtel"
            ].includes(operator)
        ) {
            return json({
                success: false,
                message:
                    "Invalid mobile-money operator."
            }, 400);
        }


        /*
         * LENCO SECRET
         */

        const secret =
            env.LENCO_SECRET_KEY;


        if (!secret) {

            console.error(
                "LENCO_SECRET_KEY is missing."
            );

            return json({
                success: false,
                message:
                    "Payment service is temporarily unavailable."
            }, 500);
        }


        /*
         * SEND PAYMENT REQUEST TO LENCO
         */

        const lencoResponse =
            await fetch(
                LENCO_MOBILE_MONEY_URL,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            "Bearer " + secret,

                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    body: JSON.stringify({
                        amount: amount,

                        reference: reference,

                        phone: phone,

                        operator: operator,

                        country: "zm",

                        bearer: "merchant"
                    })
                }
            );


        const responseText =
            await lencoResponse.text();


        console.log(
            "Lenco initiation HTTP status:",
            lencoResponse.status
        );


        console.log(
            "Lenco initiation response:",
            responseText
        );


        let data = null;


        try {

            data =
                JSON.parse(responseText);

        } catch {

            return json({
                success: false,
                message:
                    "Lenco returned an invalid response."
            }, 502);
        }


        /*
         * LENCO ERROR
         */

        if (
            !lencoResponse.ok ||
            data.status !== true
        ) {

            return json({
                success: false,

                message:
                    data.message ||
                    "Lenco could not start the payment."
            },
            lencoResponse.status || 400);
        }


        /*
         * PAYMENT DATA
         */

        const payment =
            data.data;


        if (!payment) {

            return json({
                success: false,

                message:
                    "Lenco did not return payment details."
            }, 502);
        }


        console.log(
            "Lenco payment initiated:",
            payment
        );


        return json({

            success: true,

            status:
                payment.status ||
                "pay-offline",

            message:
                data.message ||
                "Payment request initiated.",

            payment: {

                reference:
                    payment.reference ||
                    reference,

                status:
                    payment.status ||
                    "pay-offline",

                amount:
                    Number(payment.amount),

                currency:
                    payment.currency ||
                    currency,

                type:
                    payment.type ||
                    "mobile-money",

                lencoReference:
                    payment.lencoReference ||
                    null,

                mobileMoneyDetails:
                    payment.mobileMoneyDetails ||
                    null
            }

        });

    } catch (error) {

        console.error(
            "Mobile-money initiation error:",
            error
        );

        return json({
            success: false,

            message:
                "Unable to start the payment. Please try again."
        }, 500);
    }
}


/* =========================================================
   VERIFY PAYMENT
========================================================= */

async function verifyPayment(request, env) {

    const url =
        new URL(request.url);


    const reference =
        url.searchParams.get(
            "reference"
        );


    const expectedAmount =
        url.searchParams.get(
            "amount"
        );


    const expectedCurrency =
        url.searchParams.get(
            "currency"
        );


    /*
     * CHECK REFERENCE
     */

    if (!reference) {

        return json({
            success: false,

            status: "failed",

            message:
                "Payment reference is missing."
        }, 400);
    }


    /*
     * GET LENCO SECRET
     */

    const secret =
        env.LENCO_SECRET_KEY;


    if (!secret) {

        console.error(
            "LENCO_SECRET_KEY is missing from Cloudflare."
        );

        return json({
            success: false,

            status: "pending",

            message:
                "Payment verification is temporarily unavailable."
        }, 500);
    }


    /*
     * LENCO STATUS URL
     */

    const lencoUrl =
        LENCO_STATUS_URL +
        "/" +
        encodeURIComponent(reference);


    try {

        const lencoResponse =
            await fetch(
                lencoUrl,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + secret,

                        "Accept":
                            "application/json"
                    }
                }
            );


        const responseText =
            await lencoResponse.text();


        console.log(
            "Lenco HTTP status:",
            lencoResponse.status
        );


        console.log(
            "Lenco response:",
            responseText
        );


        let data = null;


        try {

            data =
                JSON.parse(responseText);

        } catch {

            return json({
                success: false,

                status: "pending",

                message:
                    "Lenco returned an invalid response."
            }, 502);
        }


        /*
         * FIND PAYMENT OBJECT
         */

        const payment =
            extractPayment(data);


        if (!payment) {

            console.error(
                "Payment object was not found:",
                data
            );

            return json({
                success: false,

                status: "pending",

                message:
                    "Payment is still being checked."
            });
        }


        /*
         * PAYMENT VALUES
         */

        const paymentStatus =
            String(
                payment.status || ""
            ).toLowerCase();


        const paymentAmount =
            Number(
                payment.amount
            );


        const paymentCurrency =
            String(
                payment.currency || ""
            ).toUpperCase();


        /*
         * VERIFY AMOUNT
         */

        if (
            expectedAmount &&
            (
                !Number.isFinite(
                    paymentAmount
                ) ||

                paymentAmount !==
                    Number(expectedAmount)
            )
        ) {

            console.error(
                "Payment amount mismatch."
            );

            return json({
                success: false,

                status: "failed",

                message:
                    "Payment amount could not be verified."
            }, 400);
        }


        /*
         * VERIFY CURRENCY
         */

        if (
            expectedCurrency &&
            paymentCurrency !==
                String(
                    expectedCurrency
                ).toUpperCase()
        ) {

            console.error(
                "Payment currency mismatch."
            );

            return json({
                success: false,

                status: "failed",

                message:
                    "Payment currency could not be verified."
            }, 400);
        }


        /*
         * SUCCESS
         */

        if (
            paymentStatus ===
            "successful"
        ) {

            console.log(
                "PAYMENT SUCCESSFUL:",
                reference
            );

            return json({

                success: true,

                status: "successful",

                payment: {

                    status:
                        "successful",

                    amount:
                        paymentAmount,

                    currency:
                        paymentCurrency,

                    reference:
                        payment.reference ||
                        reference,

                    lencoReference:
                        payment.lencoReference ||
                        payment.lenco_reference ||
                        null
                }

            });
        }


        /*
         * FAILED
         */

        if (
            paymentStatus === "failed" ||
            paymentStatus === "cancelled"
        ) {

            return json({

                success: false,

                status: "failed",

                message:
                    "Lenco reports that this payment was not completed."

            });
        }


        /*
         * PENDING
         */

        return json({

            success: false,

            status: "pending",

            message:
                "Payment is still being confirmed."

        });

    } catch (error) {

        console.error(
            "Lenco verification error:",
            error
        );

        return json({

            success: false,

            status: "pending",

            message:
                "Unable to contact Lenco. Retrying shortly."

        }, 502);
    }
}


/* =========================================================
   FIND PAYMENT
========================================================= */

function extractPayment(response) {

    if (
        response &&
        response.data &&
        typeof response.data ===
            "object"
    ) {
        return response.data;
    }


    if (
        response &&
        response.payment &&
        typeof response.payment ===
            "object"
    ) {
        return response.payment;
    }


    if (
        response &&
        typeof response === "object" &&
        (
            response.amount !== undefined ||
            response.reference !== undefined
        )
    ) {
        return response;
    }


    return null;
}


/* =========================================================
   PHONE NORMALIZATION
========================================================= */

function normalizeZambianPhone(phone) {

    let cleaned =
        String(phone || "")
            .replace(/\s+/g, "")
            .replace(/-/g, "");


    if (
        cleaned.startsWith("+260")
    ) {
        return "0" +
            cleaned.substring(4);
    }


    if (
        cleaned.startsWith("260")
    ) {
        return "0" +
            cleaned.substring(3);
    }


    return cleaned;
}


function isValidZambianPhone(phone) {

    return /^0\d{9}$/.test(
        phone
    );
}


/* =========================================================
   JSON RESPONSE
========================================================= */

function json(body, status = 200) {

    return new Response(
        JSON.stringify(body),

        {
            status: status,

            headers: {
                "Content-Type":
                    "application/json",

                "Cache-Control":
                    "no-store, no-cache, must-revalidate, proxy-revalidate",

                "Pragma":
                    "no-cache",

                "Expires":
                    "0"
            }
        }
    );
}