const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(helmet());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.post('/addTestData', (req, res) => {

    let data = require('./tests.json');
    data.push(req.body);
    const jsonString = JSON.stringify(data)

    fs.writeFile('./tests.json', jsonString, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })

    res.send('Test was added. Thank you');
});


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));