document.addEventListener('DOMContentLoaded', function() {
  const createMatrixBtn = document.getElementById('create-matrix-btn');
  const calculateBtn = document.getElementById('calculate-btn');

  createMatrixBtn.addEventListener('click', function() {
    const numRows = parseInt(document.getElementById('num-rows').value);
    const numColumns = parseInt(document.getElementById('num-columns').value);

    createMatrixInput(numRows, numColumns, 'matrix-a');
    createMatrixInput(numRows, 1, 'matrix-b');
  });

  calculateBtn.addEventListener('click', function() {
    const matrixA = getMatrixInput('matrix-a');
    const matrixB = getMatrixInput('matrix-b');

    if (matrixA.length === 0 || matrixB.length === 0) {
      console.error('As matrizes não estão preenchidas corretamente.');
      return;
    }

    const solution = solveGaussianElimination(matrixA, matrixB);
    displaySolution(solution);
  });
  
  
  function createMatrixInput(numRows, numColumns, matrixId) {
    const matrixTable = document.getElementById(matrixId);
    matrixTable.innerHTML = '';

    for (let i = 0; i < numRows; i++) {
      const row = document.createElement('tr');

      for (let j = 0; j < numColumns + 1; j++) {
        const cell = document.createElement('td');
        const input = document.createElement('input');

        if (j < numColumns) {
          input.type = 'number';
          input.step = 'any';
          input.required = true;
        } else {
          input.type = 'number';
          input.step = 'any';
        }

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
  
  function solveGaussianElimination(matrixA, matrixB) {
    const n = matrixA.length;
  
    // Concatenar a matriz B à matriz A
    for (let i = 0; i < n; i++) {
      matrixA[i].push(matrixB[i][0]);
    }
  
    for (let i = 0; i < n; i++) {
      // Encontrar o pivô máximo
      let maxRow = i;
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(matrixA[j][i]) > Math.abs(matrixA[maxRow][i])) {
          maxRow = j;
        }
      }
  
      // Trocar as linhas se necessário
      if (maxRow !== i) {
        [matrixA[i], matrixA[maxRow]] = [matrixA[maxRow], matrixA[i]];
      }
  
      // Zerar os elementos abaixo do pivô
      for (let j = i + 1; j < n; j++) {
        const factor = matrixA[j][i] / matrixA[i][i];
        for (let k = i; k <= n; k++) {
          matrixA[j][k] -= factor * matrixA[i][k];
        }
      }
    }
  
    // Resolver o sistema triangular superior
    const solution = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
      solution[i] = matrixA[i][n] / matrixA[i][i];
      for (let j = i - 1; j >= 0; j--) {
        matrixA[j][n] -= matrixA[j][i] * solution[i];
      }
    }
  
    return solution;
  }
  
  function displaySolution(solution) {
    const solutionDiv = document.getElementById('solution');
    solutionDiv.textContent = '';
  
    for (let i = 0; i < solution.length; i++) {
      const variable = i + 1;
      const value = solution[i].toFixed(2);
      const equation = document.createTextNode(`x${variable} = ${value}`);
  
      solutionDiv.appendChild(equation);
      solutionDiv.appendChild(document.createElement('br'));
    }
  
    document.getElementById('result').style.display = 'block';
  }
});