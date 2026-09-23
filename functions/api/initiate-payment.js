const LENCO_MOBILE_MONEY_URL =
    "https://api.lenco.co/access/v2/collections/mobile-money";


export async function onRequestPost(context) {

    try {

        const body =
            await context.request.json();


        const reference =
            String(
                body.reference || ""
            ).trim();


        const amount =
            Number(
                body.amount
            );


        const currency =
            String(
                body.currency || "ZMW"
            ).toUpperCase();


        const phone =
            normalizeZambianPhone(
                body.phone
            );


        const operator =
            String(
                body.operator || ""
            ).toLowerCase();


        const email =
            String(
                body.email || ""
            ).trim();


        /* =================================================
           VALIDATION
        ================================================= */

        if (!reference) {

            return json(
                {
                    success: false,
                    message:
                        "Payment reference is missing."
                },
                400
            );

        }


        if (
            !Number.isFinite(
                amount
            ) ||
            amount <= 0
        ) {

            return json(
                {
                    success: false,
                    message:
                        "Invalid payment amount."
                },
                400
            );

        }


        if (
            currency !==
            "ZMW"
        ) {

            return json(
                {
                    success: false,
                    message:
                        "Only ZMW payments are supported."
                },
                400
            );

        }


        if (
            !isValidZambianPhone(
                phone
            )
        ) {

            return json(
                {
                    success: false,
                    message:
                        "Invalid Zambian mobile-money number."
                },
                400
            );

        }


        if (
            ![
                "mtn",
                "airtel",
                "zamtel"
            ].includes(
                operator
            )
        ) {

            return json(
                {
                    success: false,
                    message:
                        "Invalid mobile-money operator."
                },
                400
            );

        }


        /* =================================================
           SECRET KEY
        ================================================= */

        const secret =
            context.env.LENCO_SECRET_KEY;


        if (!secret) {

            console.error(
                "LENCO_SECRET_KEY is missing."
            );


            return json(
                {
                    success: false,
                    message:
                        "Payment service is temporarily unavailable."
                },
                500
            );

        }


        /* =================================================
           SEND REQUEST TO LENCO
        ================================================= */

        const lencoResponse =
            await fetch(
                LENCO_MOBILE_MONEY_URL,
                {

                    method:
                        "POST",

                    headers: {

                        "Authorization":
                            "Bearer " +
                            secret,

                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            amount:
                                amount,

                            reference:
                                reference,

                            phone:
                                phone,

                            operator:
                                operator,

                            country:
                                "zm",

                            bearer:
                                "merchant"

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


        let data =
            null;


        try {

            data =
                JSON.parse(
                    responseText
                );

        } catch {

            return json(
                {
                    success: false,
                    message:
                        "Lenco returned an invalid response."
                },
                502
            );

        }


        /* =================================================
           LENCO ERROR
        ================================================= */

        if (
            !lencoResponse.ok ||
            data.status !== true
        ) {

            return json(
                {
                    success: false,
                    message:
                        data.message ||
                        "Lenco could not start the payment."
                },
                lencoResponse.status ||
                    400
            );

        }


        /* =================================================
           PAYMENT DATA
        ================================================= */

        const payment =
            data.data;


        if (!payment) {

            return json(
                {
                    success: false,
                    message:
                        "Lenco did not return payment details."
                },
                502
            );

        }


        console.log(
            "Lenco payment initiated:",
            payment
        );


        return json({

            success:
                true,

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
                    Number(
                        payment.amount
                    ),

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


        return json(
            {
                success: false,
                message:
                    "Unable to start the payment. Please try again."
            },
            500
        );

    }

}


/* =========================================================
   PHONE NORMALIZATION
========================================================= */

function normalizeZambianPhone(
    phone
) {

    let cleaned =
        String(
            phone || ""
        )
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

    return /^0\d{9}$/.test(
        phone
    );

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