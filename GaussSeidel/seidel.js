document.addEventListener('DOMContentLoaded', function () {
    const createMatrixBtn = document.getElementById('create-matrix-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    const refreshBtn = document.getElementById('refresh-btn');

    refreshBtn.addEventListener('click', function (){
        clearPage();
    });

    createMatrixBtn.addEventListener('click', function () {
        resetResults();

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
            const matrixA = getMatrixInput('matrix-a');
            const matrixB = getMatrixInput('matrix-b');
            const chuteInicial = getMatrixInput('chute-inicial');

            if (!isSassenfeldConvergent(matrixA)) {
                alert('A matriz fornecida não atende ao critério de Sassenfeld. Não é possível utilizar o método de Gauss-Seidel para resolver o sistema.');
            } else if (!isDiagonallyDominant(matrixA)) {
                alert('A matriz fornecida não atende ao critério das linhas dominantes. Não é possível utilizar o método de Gauss-Seidel para resolver o sistema.');
            } else {
                const solution = gaussSeidel(matrixA, matrixB, chuteInicial, inputEpsilon);
                displayIterations(solution);
                displaySolution(solution);
            }
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

    function getMatrixInput(matrixId) {
        const matrixTable = document.getElementById(matrixId);

        if (!matrixTable) {
            console.error(`Tabela de matriz "${matrixId}" não encontrada.`);
            return [];
        }

        const rows = matrixTable.getElementsByTagName('tr');
        const matrix = [];

        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('td');
            const row = [];

            for (let j = 0; j < cells.length; j++) {
                const input = cells[j].querySelector('input');

                if (input) {
                    const value = parseFloat(input.value);

                    if (isNaN(value)) {
                        console.error('Os valores da matriz devem ser números válidos.');
                        return [];
                    }

                    row.push(value);
                }
            }

            if (row.length > 0) {
                matrix.push(row);
            }
        }

        return matrix;
    }

    function gaussSeidel(matrixA, matrixB, chuteInicial, epsilon) {
        const numRows = chuteInicial.length;
        const numColumns = matrixA[0].length;
        let currentSolution = chuteInicial.slice();
        let error = epsilon + 1;
        let iterations = [];

        while (error > epsilon) {
            let nextSolution = currentSolution.slice(); // Copia a solução atual para a próxima iteração

            for (let i = 0; i < numRows; i++) {
                let sum = 0;

                for (let j = 0; j < numColumns; j++) {
                    if (j !== i) {
                        sum += matrixA[i][j] * nextSolution[j]; // Utiliza a próxima solução atualizada
                    }
                }

                nextSolution[i] = (matrixB[i] - sum) / matrixA[i][i];
            }

            error = calculateError(currentSolution, nextSolution);
            currentSolution = nextSolution;
            iterations.push(currentSolution.slice()); // Armazena a solução atual em cada iteração
        }

        return iterations;
    }

    function calculateError(solution1, solution2) {
        const numVariables = solution1.length;
        let maxDiff = 0;

        for (let i = 0; i < numVariables; i++) {
            const diff = Math.abs(solution2[i] - solution1[i]);

            if (diff > maxDiff) {
                maxDiff = diff;
            }
        }

        return maxDiff;
    }

    function isSassenfeldConvergent(matrixA) {
        const numRows = matrixA.length;
        const rowCoefficients = [];

        for (let i = 0; i < numRows; i++) {
            const row = matrixA[i];
            const rowSum = row.reduce((sum, coefficient) => sum + Math.abs(coefficient), 0);
            const otherCoefficientsSum = row.slice(0, i).reduce((sum, coefficient) => sum + Math.abs(coefficient), 0);
            rowCoefficients[i] = otherCoefficientsSum / rowSum;
        }

        const maxCoefficient = Math.max(...rowCoefficients);
        return maxCoefficient < 1;
    }

    function isDiagonallyDominant(matrixA) {
        const numRows = matrixA.length;

        for (let i = 0; i < numRows; i++) {
            const row = matrixA[i];
            const diagonalElement = Math.abs(row[i]);
            const otherElementsSum = row.reduce((sum, coefficient, index) => {
                if (index !== i) {
                    return sum + Math.abs(coefficient);
                }
                return sum;
            }, 0);

            if (diagonalElement <= otherElementsSum) {
                return false;
            }
        }

        return true;
    }

    function displayIterations(iterations) {
        const iterationsContainer = document.getElementById('iterations-container');
        iterationsContainer.innerHTML = '';

        const iterationsTitle = document.createElement('h2');
        iterationsTitle.textContent = 'Iterações';
        iterationsContainer.appendChild(iterationsTitle);

        iterations.forEach((iteration, index) => {
            const iterationNumber = index + 1;
            const iterationDiv = document.createElement('div');
            iterationDiv.classList.add('iteration');
            iterationDiv.innerHTML = `
            <h3>k(${iterationNumber})</h3>
            <ul>
              ${iteration.map((value, index) => `<li>x${index + 1} = ${value.toFixed(4)}</li>`).join('')}
            </ul>
          `;
            iterationsContainer.appendChild(iterationDiv);
        });

        document.getElementById('result').style.display = 'block';
    }

    function displaySolution(solution) {
        const solutionContainer = document.getElementById('solution-container');
        solutionContainer.innerHTML = '';

        const solutionTitle = document.createElement('h2');
        solutionTitle.textContent = 'Solução do Sistema';
        solutionContainer.appendChild(solutionTitle);

        const finalSolution = solution[solution.length - 1];
        const solutionList = document.createElement('ul');
        finalSolution.forEach((value, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `x${index + 1} = ${value.toFixed(4)}`;
            solutionList.appendChild(listItem);
        });

        solutionContainer.appendChild(solutionList);

        document.getElementById('result').style.display = 'block';
    }

    function resetResults() {
        document.getElementById('result').style.display = 'none';
        document.getElementById('iterations-container').innerHTML = '';
        document.getElementById('solution-container').innerHTML = '';
      }

      function clearPage() {
        resetResults()
        document.getElementById('matrix-order').value = 2;
        document.getElementById('epsilon-value').value = undefined;
        document.getElementById('matrix-input').style.display = 'none';
      }
});