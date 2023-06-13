document.addEventListener('DOMContentLoaded', function() {
  const createMatrixBtn = document.getElementById('create-matrix-btn');
  const calculateBtn = document.getElementById('calculate-btn');

  createMatrixBtn.addEventListener('click', function() {
    const matrixOrder = parseInt(document.getElementById('matrix-order').value);

    createMatrixInput(matrixOrder, matrixOrder, 'matrix-a');
    createMatrixInput(matrixOrder, 1, 'matrix-b');
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

      for (let j = 0; j < numColumns; j++) {
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
    const steps = [];
  
    // Concatenar a matriz B à matriz A
    for (let i = 0; i < n; i++) {
      matrixA[i].push(matrixB[i][0]);
    }
  
    for (let i = 0; i < n; i++) {
      // Armazenar a matriz atual em cada etapa
      steps.push(JSON.parse(JSON.stringify(matrixA)));
  
      // Verificar se o elemento da diagonal principal é nulo
      if (matrixA[i][i] === 0) {
        // Encontrar o índice da primeira linha não nula
        let swapRow = -1;
        for (let j = i + 1; j < n; j++) {
          if (matrixA[j][i] !== 0) {
            swapRow = j;
            break;
          }
        }
        // Trocar as linhas se necessário
        if (swapRow !== -1) {
          [matrixA[i], matrixA[swapRow]] = [matrixA[swapRow], matrixA[i]];
          [matrixB[i], matrixB[swapRow]] = [matrixB[swapRow], matrixB[i]];
        }
      }
  
      // Encontrar o pivô máximo
      let maxRow = i;
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(matrixA[j][i]) > Math.abs(matrixA[maxRow][i])) {
          maxRow = j;
        }
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
  
    // Armazenar a matriz final
    steps.push(JSON.parse(JSON.stringify(matrixA)));
  
    // Exibir cada etapa da matriz
    for (let i = 0; i < steps.length; i++) {
      const stepTitle = document.createElement('h3');
      stepTitle.textContent = `Etapa ${i + 1}:`;
      document.getElementById('matrix-steps').appendChild(stepTitle);
  
      const matrixId = `step-matrix-${i + 1}`;
      const matrixContainer = document.createElement('div');
      matrixContainer.classList.add('matrix-container');
      matrixContainer.innerHTML = `<table id="${matrixId}"></table>`;
      document.getElementById('matrix-steps').appendChild(matrixContainer);
  
      displayMatrix(steps[i], matrixId);
    }
  
    return solution;
  }
    

  function displayMatrix(matrix, matrixId) {
    const matrixTable = document.getElementById(matrixId);
    matrixTable.innerHTML = '';
  
    for (let i = 0; i < matrix.length; i++) {
      const row = document.createElement('tr');
  
      for (let j = 0; j < matrix[i].length; j++) {
        const cell = document.createElement('td');
        const value = document.createTextNode(matrix[i][j]);
        cell.appendChild(value);
        row.appendChild(cell);
      }
  
      matrixTable.appendChild(row);
    }
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