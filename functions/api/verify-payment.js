/* =========================================================
   BAKULU - LENCO PAYMENT VERIFICATION
   CLOUDFLARE PAGES FUNCTION
========================================================= */


const LENCO_STATUS_URL =
    "https://api.lenco.co/access/v2/collections/status";


/* =========================================================
   GET PAYMENT STATUS
========================================================= */

export async function onRequestGet(
    context
) {

    const url =
        new URL(
            context.request.url
        );


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


    /* =====================================================
       CHECK REFERENCE
    ====================================================== */

    if (!reference) {

        return json(
            {
                success: false,

                status: "failed",

                message:
                    "Payment reference is missing."
            },

            400
        );
    }


    /* =====================================================
       GET SECRET FROM CLOUDFLARE
    ====================================================== */

    const secret =
        context.env.LENCO_SECRET_KEY;


    if (!secret) {

        console.error(
            "LENCO_SECRET_KEY is missing from Cloudflare."
        );


        return json(
            {
                success: false,

                status: "pending",

                message:
                    "Payment verification is temporarily unavailable."
            },

            500
        );
    }


    /* =====================================================
       Lenco transaction URL
    ====================================================== */

    const lencoUrl =
        LENCO_STATUS_URL +
        "/" +
        encodeURIComponent(
            reference
        );


    try {

        /* =================================================
           ASK LENCO
        ================================================== */

        const lencoResponse =
            await fetch(
                lencoUrl,
                {
                    method:
                        "GET",

                    headers: {

                        "Authorization":
                            "Bearer " +
                            secret,

                        "Accept":
                            "application/json"

                    },

                    cache:
                        "no-store"
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


        /* =================================================
           PARSE RESPONSE
        ================================================== */

        let data =
            null;


        try {

            data =
                JSON.parse(
                    responseText
                );

        } catch {

            console.error(
                "Lenco returned invalid JSON."
            );


            return json(
                {
                    success: false,

                    status: "pending",

                    message:
                        "Lenco returned an invalid response."
                },

                502
            );
        }


        /* =================================================
           GET PAYMENT OBJECT
        ================================================== */

        const payment =
            extractPayment(
                data
            );


        if (!payment) {

            console.error(
                "Payment object was not found:",
                data
            );


            return json(
                {
                    success: false,

                    status: "pending",

                    message:
                        "Payment is still being checked."
                }
            );
        }


        /* =================================================
           PAYMENT VALUES
        ================================================== */

        const paymentStatus =
            String(
                payment.status ||
                ""
            ).toLowerCase();


        const paymentAmount =
            Number(
                payment.amount
            );


        const paymentCurrency =
            String(
                payment.currency ||
                ""
            ).toUpperCase();


        /* =================================================
           VERIFY AMOUNT
        ================================================== */

        if (
            expectedAmount &&
            (
                !Number.isFinite(
                    paymentAmount
                ) ||

                paymentAmount !==
                    Number(
                        expectedAmount
                    )
            )
        ) {

            console.error(
                "Payment amount mismatch."
            );


            return json(
                {
                    success: false,

                    status: "failed",

                    message:
                        "Payment amount could not be verified."
                },

                400
            );
        }


        /* =================================================
           VERIFY CURRENCY
        ================================================== */

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


            return json(
                {
                    success: false,

                    status: "failed",

                    message:
                        "Payment currency could not be verified."
                },

                400
            );
        }


        /* =================================================
           SUCCESSFUL
        ================================================== */

        if (
            paymentStatus ===
            "successful"
        ) {

            console.log(
                "PAYMENT SUCCESSFUL:",
                reference
            );


            return json({

                success:
                    true,

                status:
                    "successful",

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


        /* =================================================
           FAILED
        ================================================== */

        if (
            paymentStatus ===
                "failed" ||

            paymentStatus ===
                "cancelled"
        ) {

            return json({

                success:
                    false,

                status:
                    "failed",

                message:
                    "Lenco reports that this payment was not completed."

            });
        }


        /* =================================================
           PENDING
        ================================================== */

        return json({

            success:
                false,

            status:
                "pending",

            message:
                "Payment is still being confirmed."

        });


    } catch (error) {

        console.error(
            "Lenco verification error:",
            error
        );


        /*
         * IMPORTANT:
         *
         * A temporary Lenco/API/network error
         * must NOT be treated as a failed payment.
         */

        return json(

            {
                success:
                    false,

                status:
                    "pending",

                message:
                    "Unable to contact Lenco. Retrying shortly."
            },

            502
        );
    }
}


/* =========================================================
   FIND PAYMENT IN LENCO RESPONSE
========================================================= */

function extractPayment(
    response
) {

    /*
     * Normal response:
     *
     * response.data
     */

    if (
        response &&
        response.data &&
        typeof response.data ===
            "object"
    ) {

        return response.data;
    }


    /*
     * Alternative:
     *
     * response.payment
     */

    if (
        response &&
        response.payment &&
        typeof response.payment ===
            "object"
    ) {

        return response.payment;
    }


    /*
     * Direct transaction object.
     */

    if (
        response &&
        typeof response ===
            "object" &&

        (
            response.amount !==
                undefined ||

            response.reference !==
                undefined
        )
    ) {

        return response;
    }


    return null;
}


/* =========================================================
   JSON RESPONSE
========================================================= */

function json(
    body,
    status = 200
) {

    return new Response(

        JSON.stringify(
            body
        ),

        {

            status:
                status,

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