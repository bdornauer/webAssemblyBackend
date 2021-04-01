var express = require('express');
var app = express();
var fs = require('fs')
var fetch = require('node-fetch')

app.get('/', function (req, res) {


    res.send('Hello World');
})

var server = app.listen(8081, async function () {
    var host = server.address().address
    var port = server.address().port
    //
    const data = await fetch('https://api.jsonstorage.net/v1/json/10194609-5224-4f11-ba86-e8240a2cd147?apiKey=e0123682-272c-4cf9-9f66-b00b76117b76')
        .then(response => response.json());

    let dataArea = {
        isMobile: [],
        browserInfo: [],
        date: [],
        areaJS10000: [],
        areaWAMS10000: [],
        areaJS100000: [],
        areaWAMS100000: [],
        areaJS1000000: [],
        areaWAMS1000000: []
    };

    let dataSort = {
        isMobile: [],
        browserInfo: [],
        date: [],
        sortJS2500: [],
        sortWAMS2500: [],
        sortJS5000: [],
        sortWAMS5000: [],
        sortJS10000: [],
        sortWAMS10000: []
    };

    let dataCells = {
        isMobile: [],
        browserInfo: [],
        date: [],
        cellsJS250: [],
        cellsWAMS250: [],
        cellsJS500: [],
        cellsWAMS500: [],
        cellsJS1000: [],
        cellsWAMS1000: []
    }

    for (let i = 0; i < data.length; i++) {

        if (data[i].testsArea !== undefined) {
            dataArea.isMobile.push(data[i].info.mobile);
            dataArea.browserInfo.push(data[i].info.browser);
            dataArea.date.push(data[i].info.time);

            dataArea.areaJS10000.push(data[i].testsArea.areaJS10000)
            dataArea.areaWAMS10000.push(data[i].testsArea.areaWAMS10000)

            dataArea.areaJS100000.push(data[i].testsArea.areaJS100000)
            dataArea.areaWAMS100000.push(data[i].testsArea.areaWAMS100000)

            dataArea.areaJS1000000.push(data[i].testsArea.areaJS1000000)
            dataArea.areaWAMS1000000.push(data[i].testsArea.areaWAMS1000000)

        } else if (data[i].testsSort !== undefined) {
            dataSort.isMobile.push(data[i].info.mobile);
            dataSort.browserInfo.push(data[i].info.browser);
            dataSort.date.push(data[i].info.time);

            dataSort.sortJS2500.push(data[i].testsSort.sortJS2500)
            dataSort.sortWAMS2500.push(data[i].testsSort.sortWAMS2500)

            dataSort.sortJS5000.push(data[i].testsSort.sortJS5000)
            dataSort.sortWAMS5000.push(data[i].testsSort.sortWAMS5000)

            dataSort.sortJS10000.push(data[i].testsSort.sortJS10000)
            dataSort.sortWAMS10000.push(data[i].testsSort.sortWAMS10000)

        } else if (data[i].testsCells !== undefined) {
            dataCells.isMobile.push(data[i].info.mobile);
            dataCells.browserInfo.push(data[i].info.browser);
            dataCells.date.push(data[i].info.time);

            dataCells.cellsJS250.push(data[i].testsCells.cellsJS250);
            dataCells.cellsWAMS250.push(data[i].testsCells.cellsWAMS250);

            dataCells.cellsJS500.push(data[i].testsCells.cellsJS500);
            dataCells.cellsWAMS500.push(data[i].testsCells.cellsWAMS500);

            dataCells.cellsJS1000.push(data[i].testsCells.cellsJS1000);
            dataCells.cellsWAMS1000.push(data[i].testsCells.cellsWAMS1000);
        }
    }
    console.log(dataArea);
    console.log(dataSort);
    console.log(dataCells);

    fs.writeFileSync('dataArea.json', JSON.stringify(dataArea));
    fs.writeFileSync('dataSort.json', JSON.stringify(dataSort));
    fs.writeFileSync('dataCells.json', JSON.stringify(dataCells));


    console.log("Example app listening at http://%s:%s", host, port)
})



async function convertJSON() {



}


convertJSON();