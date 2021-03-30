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
    let numTests = 5;
    let numSquares = 1000000;
    let a = 0;
    let b = 10;
    let userInfo = infoUser();
    let results = {
        areaJS: [],
        areaWAMS: [],
        sortJS: [],
        sortWAMS: [],
        cellsJS: [],
        cellsWAMS: [],
    }
    let numCycleCells = 1000;

    for (let i = 0; i < numTests; i++) {
        let arr = createIntegerArray(10000);
        let arr0and1 = createInteger0and1(10000);

        results.sortJS.push(measureSortingJS(arr));
        results.areaJS.push(measureAreaCalcJS(numSquares, a, b));
        results.cellsJS.push(measureCellularJS(arr0and1, numCycleCells))

        results.sortWAMS.push(await measureSortingWAMS(arr))
        results.areaWAMS.push(await measureAreaCalcWAMS(numSquares, a, b));
        results.cellsWAMS.push(await measureCellularWAMS(arr0and1, numCycleCells));

        progressbar.style.width = ((load / (numTests + 4)) * 100).toString() + "%";
        load++;
    }


    let result = {info: userInfo, measurements: results};
    console.log(result);

    await fetch('https://webassemblytest.herokuapp.com/addTestData', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
    })
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });


    load += 4;
    progressbar.style.width = (load / (numTests + 1)).toString() + "%";
    document.querySelector('.wrapper').innerHTML = "<h1>Vielen Dank für die Teilnahme!</h1><a href=\"https://www.google.at/\"><button type=\"button\" class=\"btn btn-outline-secondary\" >Zu Google</button>";
}


