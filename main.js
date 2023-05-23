document.addEventListener('DOMContentLoaded', function() {
    const createMatrixBtn = document.getElementById('create-matrix-btn');
    const calculateBtn = document.getElementById('calculate-btn');
  
    createMatrixBtn.addEventListener('click', function() {
        const numRows = parseInt(document.getElementById('num-rows').value);
        const numColumns = parseInt(document.getElementById('num-columns').value);
      
        if (numRows > 0 && numColumns > 0) {
          createMatrixInput(numRows, numColumns);
        } else {
          alert('Informe um número válido de linhas e colunas.');
        }
      });
      
  
    calculateBtn.addEventListener('click', function() {
      const matrix = getMatrixInput();
      const solution = solveGaussianElimination(matrix);
      displaySolution(solution);
    });
  });
  
  function createMatrixInput(numRows, numColumns) {
    const matrixTable = document.getElementById('matrix');
    matrixTable.innerHTML = '';
  
    for (let i = 0; i < numRows; i++) {
      const row = document.createElement('tr');
  
      for (let j = 0; j <= numColumns; j++) {
        const cell = document.createElement('td');
        const input = document.createElement('input');
  
        if (j < numColumns) {
          input.type = 'number';
          input.step = 'any';
          input.required = true;
        } else {
          input.type = 'number';
          input.step = 'any';
          input.disabled = true;
        }
  
        cell.appendChild(input);
        row.appendChild(cell);
      }
  
      matrixTable.appendChild(row);
    }
  
    document.getElementById('matrix-input').style.display = 'block';
  }
  
  
  function getMatrixInput() {
    const matrixTable = document.getElementById('matrix');
    const rows = matrixTable.getElementsByTagName('tr');
    const matrix = [];
  
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName('td');
      const row = [];
  
      for (let j = 0; j < cells.length; j++) {
        const input = cells[j].getElementsByTagName('input')[0];
        const value = parseFloat(input.value);
  
        row.push(value);
      }
  
      matrix.push(row);
    }
  
    return matrix;
  }
  
  function solveGaussianElimination(matrix) {
    // Lógica para resolver a matriz usando eliminação de Gauss
    // Retorne a solução da matriz
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
  