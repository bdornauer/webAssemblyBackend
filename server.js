const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const helmet = require('helmet');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

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

app.post('/addTestData', (req, res) => {

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
        to: 'benedikt.dornauer@gmail.at',
        subject: 'Sending Email using Node.js',
        text: 'test'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.send('Test was added. Thank you');

});



app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));