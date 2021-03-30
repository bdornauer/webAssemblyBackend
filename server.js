const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const helmet = require('helmet');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch')


const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(cors());
app.use(helmet());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join('./index.html'));
});

app.post('/addTestData', async (req, res) => {


    //local storage
    let data = require('./public/tests.json');
    data.push(req.body);
    const jsonString = JSON.stringify(data)

    fs.writeFile('./public/tests.json', jsonString, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })


    //extra storage
    let data2 = await fetch('https://api.jsonstorage.net/v1/json/10194609-5224-4f11-ba86-e8240a2cd147?apiKey=e0123682-272c-4cf9-9f66-b00b76117b76')
        .then(response => response.json());

    data2.push(req.body);

    await fetch('https://api.jsonstorage.net/v1/json/10194609-5224-4f11-ba86-e8240a2cd147?apiKey=e0123682-272c-4cf9-9f66-b00b76117b76', {
        method: 'PUT', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data2),
    })
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    //mailing result
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'webassembly999@gmail.com',
            pass: 'dasIstWebassembly1234'
        }
    });

    let mailOptions = {
        from: 'webassembly999@gmail.com',
        to: 'benedikt.dornauer@outlook.at',
        subject: 'Sending Email using Node.js',
        text: JSON.stringify(data2)
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    //webAssemblyUser
    //webAssembly_123
    res.send('Test was added. Thank you');

});


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));