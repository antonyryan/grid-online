// gridManager.js

import * as THREE from 'three'

// Configuração do grid isométrico
export const GridDimensions = {
    rows: 9,
    cols: 9,
    tileSize: 25,
    gap: 6
};

// Função para gerar a matriz de alturas dinamicamente
export function generateHeights(rows, cols) {
    const heights = [];
    for (let x = 0; x < cols; x++) {
        const row = [];
        for (let y = 0; y < rows; y++) {
            row.push(0); // Define a altura padrão como 0
        }
        heights.push(row);
    }
    return heights;
}

// Inicializa a matriz de alturas
export let heights = generateHeights(GridDimensions.rows, GridDimensions.cols);

// Exemplo de alteração manual das alturas dos cubos
heights[1][2] = 2;
heights[2][2] = 3;
heights[3][3] = 1;
heights[4][4] = 2;
heights[5][5] = 1;
// Criando o grid de tiles quadrados em formato isométrico
// gridManager.js

export function createIsometricGrid(scene, rows, cols, tileSize, gap) {
    const tiles = [];
    const offsetX = (cols - 1) * (tileSize + gap) / 2;
    const offsetY = (rows - 1) * (tileSize + gap) / 2;

    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            const height = heights[x]?.[y] || 0;
            const geometry = new THREE.BoxGeometry(tileSize, height * tileSize, tileSize);
            const isEven = (x + y) % 2 === 0;
            const color = isEven ? 0xcccccc : 0x666666;
            const material = new THREE.MeshBasicMaterial({
                color: color,
                side: THREE.DoubleSide,
                wireframe: false
            });
            const tile = new THREE.Mesh(geometry, material);
            tile.userData = { x: x, y: y };
            const isoX = x * (tileSize + gap);
            const isoY = y * (tileSize + gap);
            tile.position.set(isoX - offsetX, height * tileSize / 2, isoY - offsetY);
            tiles.push(tile);
            scene.add(tile);
        }
    }
    return tiles;
}