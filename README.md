# Eliminacao-de-Gauss

resetResults();
            const matrixA = getMatrixInput('matrix-a');
            const matrixB = getMatrixInput('matrix-b');

            if (matrixA.length === 0 || matrixB.length === 0) {
                console.error('As matrizes não estão preenchidas corretamente.');
                return;
            }

            solveGaussianElimination(matrixA, matrixB);