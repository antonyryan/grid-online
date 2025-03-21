// three.js

import { setupCamera, updateCameraPositionUI, setupCameraControls } from './cameraManager.js';
import { initializeLogBox } from './uiManager.js';
import { GridDimensions, generateHeights, heights, createIsometricGrid } from './gridManager.js';
import { createEnemy } from './enemy.js';
import { createCharacter } from './player.js';

// Configuração básica da cena Three.js
export const scene = new THREE.Scene();
const camera = setupCamera(); // Configura a câmera usando o cameraManager.js
setupCameraControls(camera); // Configura os controles de câmera (Q e E)
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Adicionando luz ambiente
const light = new THREE.AmbientLight(0xaaaaaa);
scene.add(light);
// Cria o grid isométrico
const tiles = createIsometricGrid(
    scene, // Certifique-se de que "scene" é uma instância válida de THREE.Scene
    GridDimensions.rows,
    GridDimensions.cols,
    GridDimensions.tileSize,
    GridDimensions.gap
);// Adicionando OrbitControls para mover a câmera com o mouse
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Suaviza o movimento da câmera
controls.dampingFactor = 0.25;
controls.screenSpacePanning = true; // Permite mover a câmera no espaço da tela
controls.minDistance = 50; // Distância mínima de zoom
controls.maxDistance = 500; // Distância máxima de zoom
controls.maxPolarAngle = Math.PI / 2; // Limita o ângulo polar máximo

// Variáveis para controle de interação
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedTile = null;
let deselectTimeout = null;
let player = null;
let enemy = null;
let entities = {
    player: { x: 0, y: 0 }, // Posição inicial do jogador
    enemy: { x: 5, y: 5 }   // Posição inicial do inimigo
};
const moveRange = 5;
let moveTiles = [];
let pathTiles = []; // Tiles do caminho

// Adicionando FBXLoader para carregar o modelo 3D
const fbxLoader = new THREE.FBXLoader();
let mixer; // Variável para o mixer de animações

// Função para desmarcar o tile selecionado
function deselectTile() {
    if (selectedTile && selectedTile.material) {
        selectedTile.material.color.set(selectedTile.originalColor); // Restaura a cor original
        selectedTile = null;
    }
    if (deselectTimeout) {
        clearTimeout(deselectTimeout);
        deselectTimeout = null;
    }
}


createEnemy(scene, tiles); // Cria o inimigo
// Função para destacar os tiles ao alcance do boneco e o caminho
function highlightMoveRange() {
    moveTiles.forEach(tile => {
        if (tile.material) {
            tile.material.color.set(tile.originalColor); // Restaura a cor original
        }
    });
    moveTiles = [];
    for (let x = -moveRange; x <= moveRange; x++) {
        for (let y = -moveRange; y <= moveRange; y++) {
            if (Math.abs(x) + Math.abs(y) <= moveRange) {
                const targetX = characterPosition.x + x;
                const targetY = characterPosition.y + y;
                if (targetX >= 0 && targetX < cols && targetY >= 0 && targetY < rows) {
                    const tileIndex = targetY * cols + targetX;
                    const tile = tiles[tileIndex];
                    if (tile && tile.material) {
                        tile.originalColor = tile.material.color.getHex();
                        tile.material.color.set(0xff0000); // Destaca o tile em vermelho
                        moveTiles.push(tile);
                    }
                }
            }
        }
    }
}

// Função para mover o boneco com animação
function moveCharacter(targetTile, restoreColors = true) {
    const targetIndex = tiles.indexOf(targetTile);
    const targetX = targetIndex % cols;
    const targetY = Math.floor(targetIndex / cols);
    const path = [];
    let currentX = characterPosition.x;
    let currentY = characterPosition.y;

    while (currentX !== targetX || currentY !== targetY) {
        if (currentX < targetX) currentX++;
        else if (currentX > targetX) currentX--;
        if (currentY < targetY) currentY++;
        else if (currentY > targetY) currentY--;
        const tileIndex = currentY * cols + currentX;
        const tile = tiles[tileIndex];
        if (tile) {
            path.push(tile);
        }
    }

    const duration = 1; // Duração da animação em segundos
    const stepDuration = duration / path.length;

    function animateStep(index) {
        if (index >= path.length) {
            // Antes de atualizar a posição oficial, registre o log
            console.log(`Personagem moveu-se de (${characterPosition.x}, ${characterPosition.y}) para o bloco (${targetX}, ${targetY})`);

            // Atualiza a posição oficial
            characterPosition = { x: targetX, y: targetY };

            if (restoreColors) {
                highlightMoveRange(); // Destaca os tiles ao alcance na nova posição
            } else {
                // Restaura as cores originais dos tiles destacados
                moveTiles.forEach(tile => {
                    if (tile.material) {
                        tile.material.color.set(tile.originalColor); // Restaura a cor original
                    }
                });
                pathTiles.forEach(tile => {
                    if (tile.material) {
                        tile.material.color.set(tile.originalColor); // Restaura a cor original
                    }
                });
                moveTiles = [];
                pathTiles = [];
            }
            return;
        }

        const startPosition = player.position.clone();
        const endPosition = new THREE.Vector3(
            path[index].position.x,
            path[index].position.y + tileSize / 2,
            path[index].position.z
        );

        const tween = new TWEEN.Tween(startPosition)
            .to(endPosition, stepDuration * 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                player.position.copy(startPosition);
            })
            .onComplete(() => {
                animateStep(index + 1);
            })
            .start();
    }

    animateStep(0);
}

// Função para lidar com cliques do mouse
function onMouseClick(event) {
    // Calcula a posição do mouse em coordenadas normalizadas
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // Atualiza o raycaster com a posição do mouse
    raycaster.setFromCamera(mouse, camera);
    // Calcula os objetos que intersectam o raio
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        const tileIndex = tiles.indexOf(clickedObject);
        if (tileIndex !== -1) {
            if (clickedObject === selectedTile) {
                deselectTile();
            } else if (moveTiles.includes(clickedObject)) {
                moveCharacter(clickedObject, false); // Restaura as cores ao final do movimento
                deselectTile();
            } else {
                deselectTile();
                if (clickedObject.material) {
                    selectedTile = clickedObject;
                    selectedTile.originalColor = selectedTile.material.color.getHex();
                    selectedTile.material.color.set(0xff0000); // Muda a cor do tile selecionado para vermelho
                    deselectTimeout = setTimeout(deselectTile, 4000);
                }
            }
        } else if (clickedObject.parent === player) {
            highlightMoveRange();
        }
        // Iniciar combate ao clicar em um inimigo
    }
}

// Função para lidar com movimento do mouse
function onMouseMove(event) {
    // Calcula a posição do mouse em coordenadas normalizadas
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // Atualiza o raycaster com a posição do mouse
    raycaster.setFromCamera(mouse, camera);
    // Calcula os objetos que intersectam o raio
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        const hoveredObject = intersects[0].object;
        const tileIndex = tiles.indexOf(hoveredObject);
        if (tileIndex !== -1 && moveTiles.includes(hoveredObject)) {
        } else {
            pathTiles.forEach(tile => {
                if (tile.material) {
                    tile.material.color.set(tile.originalColor); // Restaura a cor original
                }
            });
            pathTiles = [];
        }
    }
}

// Adiciona os event listeners para cliques e movimento do mouse
window.addEventListener('click', onMouseClick, false);
window.addEventListener('mousemove', onMouseMove, false);

// Cria o boneco no primeiro tile
createCharacter();

// Função de renderização
function animate() {
    requestAnimationFrame(animate);

    // Atualiza os controles da câmera
    controls.update();

    // Atualiza a posição da câmera na tela
    updateCameraPositionUI(camera);

    // Atualiza o mixer de animações
    if (mixer) mixer.update(0.01);

    // Atualiza as animações do TWEEN
    TWEEN.update();

    // Renderiza a cena
    renderer.render(scene, camera);
}
console.log("Testando caixa de logs...");
console.log("Turno do jogador iniciado.");
console.log({ x: 10, y: 20 });

animate();
