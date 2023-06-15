document.addEventListener('DOMContentLoaded', function () {
    const createMatrixBtn = document.getElementById('create-matrix-btn');
    const calculateBtn = document.getElementById('calculate-btn');

    createMatrixBtn.addEventListener('click', function () {
        //resetResults();

        const matrixOrder = parseInt(document.getElementById('matrix-order').value);

        createMatrixInput(matrixOrder, matrixOrder, 'matrix-a');
        createMatrixInput(matrixOrder, 1, 'matrix-b');
        createMatrixInput(matrixOrder, 1, 'chute-inicial')
    });

    calculateBtn.addEventListener('click', function () {
        const inputsMatrixA = document.querySelectorAll(`#matrix-a input`);
        const inputsMatrixB = document.querySelectorAll(`#matrix-b input`);
        const inputsChuteInicial = document.querySelectorAll(`#chute-inicial input`);
        const inputEpsilon = parseFloat(document.getElementById('epsilon-value').value);
        let allFieldsFilled = true;

        for (let i = 0; i < inputsMatrixA.length; i++) {
            if (inputsMatrixA[i].value === '') {
                allFieldsFilled = false;
                break;
            }
        }

        for (let i = 0; i < inputsMatrixB.length; i++) {
            if (inputsMatrixB[i].value === '') {
                allFieldsFilled = false;
                break;
            }
        }

        for (let i = 0; i < inputsChuteInicial.length; i++) {
            if (inputsChuteInicial[i].value === '') {
                allFieldsFilled = false;
                break;
            }
        }

        if (!allFieldsFilled || !inputEpsilon) {
            alert('Preencha todos os campos das matrizes e determine o Épsilon antes de calcular.');
        } else {
            
        }
    });

    function createMatrixInput(numRows, numColumns, matrixId) {
        const matrixTable = document.getElementById(matrixId);
        matrixTable.innerHTML = '';

        for (let i = 0; i < numRows; i++) {
            const row = document.createElement('tr');

            for (let j = 0; j < numColumns; j++) {
                const cell = document.createElement('td');
                const input = document.createElement('input');

                cell.appendChild(input);
                row.appendChild(cell);
            }

            matrixTable.appendChild(row);
        }

        document.getElementById('matrix-input').style.display = 'block';
    }
});