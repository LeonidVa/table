function addRowToTable(idOfTable) {
    let table = document.getElementById(idOfTable)
    let tr = document.createElement("tr");
    tr.innerHTML = `
     <td>
        <input type="text" class=${idOfTable === 'firstTable' ? 'firstTableX' : 'secondTableX'}></td>
        <td>
            <input type="text" class=${idOfTable === 'firstTable' ? 'firstTableY' : 'secondTableY'}></td>
        <td>
        <button onclick="deleteRow(this)" class="deleteRow" nameOftable=${idOfTable}>Delete</button>
     </td>
    `;

    table.appendChild(tr);
}

function deleteRow(el) {
    let nameTable = el.getAttribute('nameOftable')
    let tr = el.parentNode.parentNode
    let table = document.getElementById(nameTable)
    table.deleteRow(tr.rowIndex)
}

function calculate() {
    let tableFirst = document.getElementById('firstTable')
    let tableSecond = document.getElementById('secondTable')
    let calculateTable = document.getElementById('calculateTable')
    let firstTableX = document.getElementsByClassName('firstTableX')
    let firstTableY = document.getElementsByClassName('firstTableY')
    let secondTableX = document.getElementsByClassName('secondTableX')
    let secondTableY = document.getElementsByClassName('secondTableY')


    let calculateTableGraph = document.getElementById('calculateTableGraph');

    deleteAllRowsOfTable('calculateTable')

    let firstTableXValues = mapElements(firstTableX)
    let firstTableYValues = mapElements(firstTableY)
    let secondTableXValues = mapElements(secondTableX)
    let secondTableYValues = mapElements(secondTableY)


    let dataFirstTable = mapElementsWithValue(firstTableX, firstTableY)
    let dataSecondTable = mapElementsWithValue(secondTableX, secondTableY)

    buildGraph('firstTableGraph', dataFirstTable);
    buildGraph('secondTableGraph', dataSecondTable);
    let averageX = []
    let averageY = []
    let countRows = tableFirst.rows.length > tableSecond.rows.length ? tableSecond.rows.length : tableFirst.rows.length


    for (let i = 0; i < countRows - 1; i++) {
        averageX.push((Number(firstTableXValues[i]) + Number(secondTableXValues[i])) / 2)
        averageY.push((Number(firstTableYValues[i]) + Number(secondTableYValues[i])) / 2)
    }

    for (let i = 0; i < countRows - 1; i++) {
        let tr = document.createElement("tr");

        tr.innerHTML =
            `
        <td>
            <input type="text" value=${averageX[i]}></td>

        <td>
            <input type="text" value=${averageY[i]}></td>

            `
        calculateTable.appendChild(tr)
    }
    let dadaCalculateTable = mapElementsCalculate(averageX, averageY)
    buildGraph('calculateTableGraph', dadaCalculateTable);
}

function mapElementsCalculate(x, y) {

    let values = []
    for (let i = 0; i < x.length; i++) {

        values.push({
            x: x[i],
            y: y[i]
        })
    }
    return values
}

function mapElements(el) {
    let values = []
    for (let i = 0; i < el.length; i++) {
        values.push(el[i].value)
    }
    return values
}

function mapElementsWithValue(x, y) {
    let values = []
    for (let i = 0; i < x.length; i++) {

        values.push({
            x: x[i].value,
            y: y[i].value
        })
    }
    return values
}


function deleteAllRowsOfTable(idOfTable) {
    let table = document.getElementById(idOfTable)
    let rowCount = table.rows.length;
    for (let i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}

function buildGraph(el, data) {


    const canvas = document.getElementById(el);
    const c = canvas.getContext('2d');

    let width = 500;
    let height = 500;
    let margin = 40;

    canvas.width = width;
    canvas.height = height;


    let xMinValue = getMin(data, function (d) {
        return d.x;
    });
    let xMaxValue = getMax(data, function (d) {
        return d.x;
    });
    let yMinValue = getMin(data, function (d) {
        return d.y
    });
    let yMaxValue = getMax(data, function (d) {
        return d.y
    });
    console.log(xMinValue)
    let xAxisLength = width - 2 * margin;
    let yAxisLength = height - 2 * margin;

    let xAxisStart = xMinValue;
    let xAxisEnd = xMaxValue;
    let yAxisStart = yMinValue;
    let yAxisEnd = yMaxValue;


    let rangeValuesX = xAxisEnd - xAxisStart;
    let rangeValuesY = yAxisEnd - yAxisStart;
    let factorPositionX = xAxisLength / rangeValuesX;
    let factorPositionY = yAxisLength / rangeValuesY;

    createAxisLine(width, height, margin);
    outputValuesAxis();
    createLineGraph();


    function createAxisLine(width, height, margin) {
        let indentAxis = 10;

        let xAxisX_1 = margin - indentAxis;
        let xAxisY_1 = margin;
        let xAxisX_2 = xAxisX_1;
        let xAxisY_2 = height - margin;

        let yAxisX_1 = margin;
        let yAxisY_1 = (height - margin) + indentAxis;
        let yAxisX_2 = width - margin;
        let yAxisY_2 = yAxisY_1;

        c.beginPath();
        c.moveTo(xAxisX_1, xAxisY_1);
        c.lineTo(xAxisX_2, xAxisY_2);
        c.stroke();

        c.beginPath();
        c.moveTo(yAxisX_1, yAxisY_1);
        c.lineTo(yAxisX_2, yAxisY_2);
        c.stroke();
    }

    function outputValuesAxis() {

        let stepWidth = 50;
        let indent = 20;

        //Определяем количество шагов на каждой из оси
        let amountStepsX = Math.round(xAxisLength / stepWidth);
        let amountStepsY = Math.round(yAxisLength / stepWidth);
        //Определяем коэффициенты для нахождения значений по осям
        let factorValueX = rangeValuesX / amountStepsX;
        let factorValueY = rangeValuesY / amountStepsY;


        c.beginPath();
        c.font = "10px Arial";
        c.textAlign = "center";
        c.textBaseline = "top";

        for (let i = 0; i < amountStepsX; i++) {
            let valueAxisX = Math.round(xAxisStart + i * factorValueX);
            let positionX = scaleX(valueAxisX);
            let positionY = (height - margin + indent);
            c.fillText(valueAxisX, positionX, positionY);
        }


        c.beginPath();
        c.font = "10px Arial";
        c.textAlign = "end";
        c.textBaseline = "middle";

        for (let i = 0; i < amountStepsY; i++) {
            let valueAxisY = Math.round(yAxisStart + i * factorValueY);
            let positionX = margin - indent;
            let positionY = scaleY(valueAxisY);
            c.fillText(valueAxisY, positionX, positionY);
        }


    }

    function createLineGraph() {
        for (let i = 0; i < data.length; i++) {
            if (i !== data.length - 1) { // Если элемент не последний
                let currentX = data[i].x;
                let currentY = data[i].y;
                let nextX = data[i + 1].x;
                let nextY = data[i + 1].y;

                c.beginPath();
                c.moveTo(scaleX(currentX), scaleY(currentY));
                c.lineTo(scaleX(nextX), scaleY(nextY));
                c.strokeStyle = 'black';
                c.stroke();
            }
        }
    }

    function scaleX(value) {
        return ((factorPositionX * value) + margin) - (xAxisStart * factorPositionX);
    }

    function scaleY(value) {
        return (height - (factorPositionY * value) - margin) + (yAxisStart * factorPositionY);
    }

    function getMin(data, callback) {
        let arr = [];
        for (let i in data) {
            arr.push(callback(data[i]));
        }
        return Math.min.apply(null, arr);
    }

    function getMax(data, callback) {
        let arr = [];
        for (let i in data) {
            arr.push(callback(data[i]));
        }
        return Math.max.apply(null, arr);
    }
}