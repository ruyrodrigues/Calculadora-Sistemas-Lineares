document.addEventListener('DOMContentLoaded', function () {
  const createMatrixBtn = document.getElementById('create-matrix-btn');
  const calculateBtn = document.getElementById('calculate-btn');
  const refreshBtn = document.getElementById('refresh-btn');

  refreshBtn.addEventListener('click', function () {
    clearPage();
  });

  createMatrixBtn.addEventListener('click', function () {
    resetResults();

    const matrixOrder = parseInt(document.getElementById('matrix-order').value);

    createMatrixInput(matrixOrder, matrixOrder, 'matrix-a');
    createMatrixInput(matrixOrder, 1, 'matrix-b');
  });

  calculateBtn.addEventListener('click', function () {
    const inputsMatrixA = document.querySelectorAll(`#matrix-a input`);
    const inputsMatrixB = document.querySelectorAll(`#matrix-b input`);
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

    if (!allFieldsFilled) {
      alert('Preencha todos os campos da matriz antes de calcular.');
    } else {
      resetResults();
      const matrixA = getMatrixInput('matrix-a');
      const matrixB = getMatrixInput('matrix-b');

      if (matrixA.length === 0 || matrixB.length === 0) {
        console.error('As matrizes não estão preenchidas corretamente.');
        return;
      }

      solveGaussianElimination(matrixA, matrixB);
    }
  });

  function resetResults() {
    document.getElementById('result').style.display = 'none';
    document.getElementById('matrix-steps').innerHTML = '';
    document.getElementById('matrix-l').innerHTML = '';
    document.getElementById('matrix-u').innerHTML = '';
    document.getElementById('matrix-p').innerHTML = '';
    document.getElementById('solution').innerHTML = '';
  }

  function clearPage() {
    resetResults();
    document.getElementById('matrix-input').style.display = 'none';
  }

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

  function solveGaussianElimination(matrixA, matrixB) {
    const n = matrixA.length;
    const steps = [];
    const matrixL = [];
    const matrixP = [];

    // Criar matriz de permutação
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < n; j++) {
        row.push(i === j ? 1 : 0);
      }
      matrixP.push(row);
    }

    // Inicializar a matriz L com zeros
    for (let i = 0; i < n; i++) {
      matrixL[i] = new Array(n).fill(0);
    }

    // Concatenar a matriz B à matriz A
    for (let i = 0; i < n; i++) {
      matrixA[i].push(matrixB[i][0]);
    }

    for (let i = 0; i < n; i++) {
      // Armazenar a matriz atual em cada etapa
      steps.push(JSON.parse(JSON.stringify(matrixA)));

      // Verificar se o elemento da diagonal principal é nulo
      if (matrixA[i][i] === 0) {
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
          [matrixL[i], matrixL[swapRow]] = [matrixL[swapRow], matrixL[i]];
          [matrixP[i], matrixP[swapRow]] = [matrixP[swapRow], matrixP[i]];
        }
      }

      // Calcular os elementos da matriz L
      for (let j = i + 1; j < n; j++) {
        matrixL[j][i] = matrixA[j][i] / matrixA[i][i];
      }
      matrixL[i][i] = 1;

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

    // Criar matriz U
    const matrixU = [];
    for (let i = 0; i < matrixA.length; i++) {
      matrixU[i] = matrixA[i].slice(0, -1);
    }

    // Armazenar a matriz final
    steps.push(JSON.parse(JSON.stringify(matrixA)));

    if (!hasNullOnDiagonal(matrixA)) {
      // Exibir cada etapa da matriz
      for (let i = 1; i < steps.length - 1; i++) {
        const stepTitle = document.createElement('h3');
        stepTitle.textContent = `Etapa ${i}:`;
        document.getElementById('matrix-steps').appendChild(stepTitle);

        const matrixId = `step-matrix-${i}`;
        const matrixContainer = document.createElement('div');
        matrixContainer.classList.add('matrix-table');
        matrixContainer.innerHTML = `<table id="${matrixId}"></table>`;
        document.getElementById('matrix-steps').appendChild(matrixContainer);

        displayMatrix(steps[i], matrixId);
      }

      // Exibir a matriz L
      const matrixLContainer = document.getElementById('matrix-l');
      matrixLContainer.innerHTML = '<h3>Matriz L:</h3>';
      const matrixLId = 'matrix-l-content';
      matrixLContainer.innerHTML += `<table id="${matrixLId}"></table>`;
      displayMatrix(matrixL, matrixLId);

      // Exibir a matriz U
      const matrixUContainer = document.getElementById('matrix-u');
      matrixUContainer.innerHTML = '<h3>Matriz U:</h3>';
      const matrixUId = 'matrix-u-content';
      matrixUContainer.innerHTML += `<table id="${matrixUId}"></table>`;
      displayMatrix(matrixU, matrixUId);

      // Exibir a matriz P
      const matrixPContainer = document.getElementById('matrix-p');
      matrixPContainer.innerHTML = '<h3>Matriz de Permutação:</h3>';
      const matrixPId = 'matrix-p-content';
      matrixPContainer.innerHTML += `<table id="${matrixPId}"></table>`;
      displayMatrix(matrixP, matrixPId);

      displaySolution(solution)
    } else {
      alert('Não é possivel chegar a uma conclusão utilizando a Eliminação de Gauss.');
    }
  }

  function displayMatrix(matrix, matrixId) {
    const matrixTable = document.getElementById(matrixId);
    matrixTable.innerHTML = '';
    matrixTable.classList.add('matrix-table');

    for (let i = 0; i < matrix.length; i++) {
      const row = document.createElement('tr');

      for (let j = 0; j < matrix[i].length; j++) {
        const cell = document.createElement('td');
        const value = matrix[i][j];
        const formattedValue = Number.isInteger(value) ? value : value.toFixed(2);
        const textNode = document.createTextNode(formattedValue);
        cell.appendChild(textNode);
        row.appendChild(cell);
      }

      matrixTable.appendChild(row);
    }
  }

  function displaySolution(solution) {
    const solutionDiv = document.getElementById('solution');
    solutionDiv.textContent = '';

    const solutionTitle = document.createElement('h2');
    solutionTitle.textContent = 'Resultado';
    solutionDiv.appendChild(solutionTitle);

    for (let i = 0; i < solution.length; i++) {
      const variable = i + 1;
      const value = solution[i].toFixed(2);
      const equation = document.createElement('p');
      equation.textContent = `x${variable} = ${value}`;

      solutionDiv.appendChild(equation);
    }

    document.getElementById('result').style.display = 'block';
  }

  function hasNullOnDiagonal(matrix) {
    const n = matrix.length;
    for (let i = 0; i < n; i++) {
      if (matrix[i][i] === 0) {
        return true;
      }
    }
    return false;
  }
  
});