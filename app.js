var express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cors());
app.options('*', cors());

app.get('/', (req, res) => res.status(200).send('Arkesel Rocks!!'));

app.post('/payments/initiate', ((req, res) => {
    const uniqueRef = `${Date.now() + (Math.random() * 100)}`;
    const paymentRequest = {
        account_number: "0553995074",
        merchant_reference: uniqueRef,
        channel: "mobile-money",
        provider: "mtn",
        transaction_type: "debit",
        amount: "1.00",
        purpose: "credit top up",
        service_name: "arkesel",
        currency: "GHS",
    };
    const apiKey = 'XXXXXXXXXXXXXXXXXXXX=';
    const url = 'https://payment.arkesel.com/api/v1/payment/charge/initiate';

    axios({
        method: 'post',
        url,
        data: { ...paymentRequest },
        headers: {
            'api-key': apiKey,
        }
    }).then(res => res.data).then(data => {
        console.log({ data }, 'Initiate payment');
        // Save into DB
    });

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
        status: 'success',
        message: 'payment initiated'
    });
}));

// Callback URL for payment
app.get('/payments/arkesel/callback', ((req, res) => {
    console.log({ query: res.query }, 'Callback for Arkesel payment');
    // Verify the payment...

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
        status: 'success',
        message: 'arkesel payment callback called'
    });
}));

// Verify payment
app.get('/payments/verify', ((req, res) => {
    const apiKey = 'XXXXXXXXXXXXXXXXXXXXXXX=';
    const transRef = 'T634E3e8cac8175';
    const url = `https://payment.arkesel.com/api/v1/verify/transaction/${transRef}`;

    axios({
        method: 'get',
        url,
        headers: {
            'api-key': apiKey,
        }
    }).then(res => res.data).then(data => {
        console.log({ data }, 'Verify payment');
        // Update payment status in DB
    });
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
        status: 'success',
        message: 'payment verification called'
    });
}));

app.listen(8000, function () {
    console.log('Arkesel Payment app listening on 8000!');
});