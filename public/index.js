document.getElementById('startTest').addEventListener('click', startTest);

let progressbar = document.getElementById('progressbar');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


function create() {
    let arr = [];
    for (let i = 0; i < 10000; i++) {
        arr.push(getRandomInt(2147483647));
    }
    return arr;
}

//https://mbebenita.github.io/WasmExplorer/
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
            const {sortIntArray, memory, areaCalc} = instance.exports

            let begin = performance.now();
            const array = new Int32Array(memory.buffer, 0, 10000);
            array.set(arr)
            let result = sortIntArray(array.byteOffset, array.length);
            let end = performance.now();

            return (end - begin);
        });
}

async function measureAreaCalcWAMS() {
    return fetch('test.wasm')
        .then(response =>
            response.arrayBuffer()
        ).then(bytes =>
            WebAssembly.compile(bytes)).then(mod => {
            let instance = new WebAssembly.Instance(mod);
            const {areaCalc} = instance.exports

            let begin = performance.now();
            areaCalc(1, 2, 1000000);
            let end = performance.now();

            return (end - begin);
        });
}


/**-----------------------------------------
 * Functions for webassembly
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


function myFunc(x) {
    return x * x + 3 * x + 4;
}

function myFunc2(x) {
    return x * x * x + 4 * x + 4;
}

function measureAreaCalcJS(funcNum) {

    let begin = performance.now();

    let a = 1;
    let b = 2;
    let n = 1000000;
    let delta = (b - a) / n;
    let result;

    for (let i = 0; i < n; i++) {
        if (funcNum == 1) {
            result += delta * myFunc(a + i * delta);
        } else {
            result += delta * myFunc2(a + i * delta);
        }

    }
    let end = performance.now();

    return (end - begin);
}

function infoUser() {
    let info = {
        mobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
        platform: navigator.platform,
        browser: navigator.appVersion,
    }
    return info;
}


async function startTest() {
    console.log("----------------------");
    let load = 0;
    let numTests = 30;
    let userInfo = infoUser();
    let results = {areaJS: [], sortJS: [], areaWAMS: [], sortWAMS: []}
    for (let i = 0; i < numTests; i++) {
        arr = create();
        results.sortJS.push(measureSortingJS(arr));
        results.areaJS.push(measureAreaCalcJS(1));
        results.sortWAMS.push(await measureSortingJS(arr))
        results.areaWAMS.push(await measureAreaCalcWAMS());
        load++;
        progressbar.style.width = ((load / numTests) * 100).toString() + "%";
    }

    result = {info: userInfo, measurements: results};
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

    document.querySelector('.wrapper').innerHTML = "<h1>Vielen Dank für die Teilnahme</h1><a href=\"https://www.google.at/\"><button type=\"button\" class=\"btn btn-outline-secondary\" >Zu Googel</button>";
}

