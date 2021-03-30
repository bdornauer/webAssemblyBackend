document.getElementById('startTest').addEventListener('click', startTest);

let progressbar = document.getElementById('progressbar');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


function createIntegerArray(size) {
    let arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(getRandomInt(2147483647));
    }
    return arr;
}

function createInteger0and1(size) {
    let arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(getRandomInt(2));
    }
    return arr;
}

//web assembly

/**-----------------------------------------
 * Functions for webassembly
 *------------------------------------------
 */
async function measureSortingWAMS(arr) {
    return fetch('test.wasm')
        .then(response =>
            response.arrayBuffer()
        ).then(bytes =>
            WebAssembly.compile(bytes)).then(mod => {
            let instance = new WebAssembly.Instance(mod);
            const {sortIntArray, memory} = instance.exports

            let begin = performance.now();
            const array = new Int32Array(memory.buffer, 0, 10000);
            array.set(arr)
            sortIntArray(array.byteOffset, array.length);
            let end = performance.now();

            return (end - begin);
        });
}

async function measureCellularWAMS(arr, cycles) {
    return fetch('test.wasm')
        .then(response =>
            response.arrayBuffer()
        ).then(bytes =>
            WebAssembly.compile(bytes)).then(mod => {
            let instance = new WebAssembly.Instance(mod);
            const {memory, celluarAutomate} = instance.exports

            let begin = performance.now();
            const array = new Int32Array(memory.buffer, 0, arr.length);
            array.set(arr);
            const array2 = new Int32Array(memory.buffer, 0, arr.length);
            array2.set(arr);
            celluarAutomate(array.byteOffset, array2.byteOffset, array.length, cycles);
            let end = performance.now();

            return (end - begin);
        });
}

async function measureAreaCalcWAMS(numSquares, a, b) {
    return fetch('test.wasm')
        .then(response =>
            response.arrayBuffer()
        ).then(bytes =>
            WebAssembly.compile(bytes)).then(mod => {
            let instance = new WebAssembly.Instance(mod);
            const {areaCalc} = instance.exports

            let begin = performance.now();
            let result = areaCalc(a, b, numSquares);
            let end = performance.now();
            return (end - begin);
        });
}


/**-----------------------------------------
 * Functions for JS
 *------------------------------------------
 */

function measureSortingJS(arr) {

    let begin = performance.now();
    let a = 0;
    for (let i = 0; i < arr.length; ++i) {
        for (let j = i + 1; j < arr.length; ++j) {
            if (arr[i] > arr[j]) {
                a = arr[i];
                arr[i] = arr[j];
                arr[j] = a;
            }
        }
    }
    let end = performance.now();

    return (end - begin);
}


function myFunc1(x) {
    return x * x + 3 * x + 4;
}

function measureAreaCalcJS(numSquares, a, b) {

    let begin = performance.now();
    let delta = (b - a) / numSquares;
    let result = 0;

    for (let i = 0; i < numSquares; i++) {
        result += delta * myFunc1(a + i * delta);
    }
    let end = performance.now();
    return (end - begin);
}

function measureCellularJS(cells, cycles) {

    let numCells = cells.length - 1;
    let cellsTemp = [...cells];
    let begin = performance.now();
    for (let j = 0; j < cycles; j++) {
        for (let i = 1; i < numCells; i++) {
            let left = cellsTemp[i - 1];
            let middle = cellsTemp[i];
            let right = cellsTemp[i + 1];
            cells[i] = test(left, middle, right);
        }
        cellsTemp = cells;
    }
    let end = performance.now();

    return (end - begin);
}

function test(left, center, right) {
    if (left === 1 && center === 1 && right === 1) return 0;
    else if (left === 1 && center === 1 && right === 0) return 1;
    else if (left === 1 && center === 0 && right === 1) return 0;
    else if (left === 1 && center === 0 && right === 0) return 1;
    else if (left === 0 && center === 1 && right === 1) return 1;
    else if (left === 0 && center === 1 && right === 0) return 0;
    else if (left === 0 && center === 0 && right === 1) return 1;
    else if (left === 0 && center === 0 && right === 0) return 0;
    return 0;
}

/**-----------------------------------------
 * Functions for Testskript
 *------------------------------------------
 */

function infoUser() {
    let mobile = "";
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // true for mobile device
        mobile = "mobile device";
    } else {
        // false for not mobile device
        mobile = "not mobile device";
    }
    return {
        mobile: mobile,
        width: window.innerWidth,
        height: window.innerHeight,
        platform: navigator.platform,
        browser: navigator.appVersion,
        time: new Date().toISOString()
    };
}


async function startTest() {
    console.log("----------------------");
    let load = 0;
    let numTests = 30;

    let a = 0;
    let b = 10;
    let userInfo = infoUser();


    let testArea = {
        areaJS10000: [],
        areaJS100000: [],
        areaJS1000000: [],
        areaWAMS10000: [],
        areaWAMS100000: [],
        areaWAMS1000000: [],
    }

    let testSort =
        {
            sortJS2500: [],
            sortJS5000: [],
            sortJS10000: [],
            sortWAMS2500: [],
            sortWAMS5000: [],
            sortWAMS10000: [],
        }

    let testCells =
        {
            cellsJS250: [],
            cellsJS500: [],
            cellsJS1000: [],
            cellsWAMS250: [],
            cellsWAMS500: [],
            cellsWAMS1000: [],
        }


    let numCycleCells = 1000;

    for (let i = 0; i < numTests; i++) {

        let arr0and1_250 = createInteger0and1(250);
        let arr0and1_500 = createInteger0and1(500);
        let arr0and1_1000 = createInteger0and1(10000);

        let arr2500 = createIntegerArray(2500);
        let arr5000 = createIntegerArray(5000);
        let arr10000 = createIntegerArray(10000);

        //Small
        testSort.sortJS2500.push(measureSortingJS(arr2500));
        testSort.sortWAMS2500.push(await measureSortingWAMS(arr2500));

        testArea.areaJS10000.push(measureAreaCalcJS(10000, a, b));
        testArea.areaWAMS10000.push(await measureAreaCalcWAMS(10000, a, b));

        testCells.cellsJS250.push(measureCellularJS(arr0and1_250, numCycleCells))
        testCells.cellsWAMS250.push(await measureCellularWAMS(arr0and1_250, numCycleCells))


        //Middle
        testSort.sortJS5000.push(measureSortingJS(arr5000));
        testSort.sortWAMS5000.push(await measureSortingWAMS(arr5000));

        testArea.areaJS100000.push(measureAreaCalcJS(100000, a, b));
        testArea.areaWAMS100000.push(await measureAreaCalcWAMS(100000, a, b));

        testCells.cellsJS500.push(measureCellularJS(arr0and1_500, numCycleCells))
        testCells.cellsWAMS500.push(await measureCellularWAMS(arr0and1_500, numCycleCells))

        //Large
        testSort.sortJS10000.push(measureSortingJS(arr10000));
        testSort.sortWAMS10000.push(await measureSortingWAMS(arr10000));

        testArea.areaJS1000000.push(measureAreaCalcJS(1000000, a, b));
        testArea.areaWAMS1000000.push(await measureAreaCalcWAMS(1000000, a, b));

        testCells.cellsJS1000.push(measureCellularJS(arr0and1_1000, numCycleCells))
        testCells.cellsWAMS1000.push(await measureCellularWAMS(arr0and1_1000, numCycleCells))

        progressbar.style.width = ((load / (numTests + 10)) * 100).toString() + "%";
        load++;
    }

    let resultArea = {info: userInfo, measurements: testArea};
    let resultSort = {info: userInfo, measurements: testSort};
    let resultCells = {info: userInfo, measurements: testCells};

    console.log(result);

    await fetch('https://webassemblytest.herokuapp.com/addTestData', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultSort),
    })
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    await fetch('https://webassemblytest.herokuapp.com/addTestData', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultArea),
    })
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    await fetch('https://webassemblytest.herokuapp.com/addTestData', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultCells),
    })
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });


    load += 3;


    progressbar.style.width = (load / (numTests + 4)).toString() + "%";
    document.querySelector('.wrapper').innerHTML = "<div style='margin-top: 30%'></div><h1>Vielen Dank für die Teilnahme!</h1><a href=\"https://www.google.at/\"><button type=\"button\" class=\"btn btn-outline-secondary\" >Zu Google</button></div>";
}


