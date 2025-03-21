// cameraManager.js
import * as THREE from 'three'
// Função para criar e configurar a câmera
export function setupCamera() {
    const camera = new THREE.OrthographicCamera(
        window.innerWidth / -2, window.innerWidth / 2,
        window.innerHeight / 2, window.innerHeight / -2,
        0.1, 1000
    );

    // Posição inicial da câmera
    camera.position.set(0, 200, 200);
    camera.lookAt(0, 0, 0);

    return camera;
}

// Função para atualizar a posição da câmera na tela
// export function updateCameraPositionUI(camera) {
//     const cameraPosition = camera.position;
//     const cameraX = document.getElementById('camera-x');
//     const cameraY = document.getElementById('camera-y');
//     const cameraZ = document.getElementById('camera-z');
//
//     if (cameraX && cameraY && cameraZ) {
//         cameraX.textContent = cameraPosition.x.toFixed(2);
//         cameraY.textContent = cameraPosition.y.toFixed(2);
//         cameraZ.textContent = cameraPosition.z.toFixed(2);
//     }
// }

// Posições fixas da câmera
export const cameraPositions = [
    { x: 200, y: 125, z: 200 },   // Visão padrão
    { x: -180, y: 125, z: 180 },  // Visão pela esquerda
    { x: -180, y: 125, z: -180 }, // Visão pela direita
    { x: 180, y: 125, z: -180 }   // Visão de cima
];

let currentCameraIndex = 0;

// Função para alternar entre as posições fixas da câmera com animação
export function switchCameraPosition(camera, direction) {
    // Calcula o novo índice com base na direção
    if (direction === 'next') {
        currentCameraIndex = (currentCameraIndex + 1) % cameraPositions.length; // Avança
    } else if (direction === 'prev') {
        currentCameraIndex = (currentCameraIndex - 1 + cameraPositions.length) % cameraPositions.length; // Volta
    }

    // Obtém a nova posição da câmera
    const newPosition = cameraPositions[currentCameraIndex];

    // Adiciona um log informando para qual câmera foi movido
    console.log(`Movido para a câmera ${currentCameraIndex + 1}`);

    // Cria uma animação de transição usando TWEEN.js
    new TWEEN.Tween(camera.position)
        .to(newPosition, 1000) // Duração da animação em milissegundos (1 segundo)
        .easing(TWEEN.Easing.Quadratic.InOut) // Efeito de easing suave
        .onUpdate(() => {
            // Durante a animação, ajusta a câmera para olhar para o centro do mapa
            camera.lookAt(0, 0, 0);
        })
        .start();
}

// Adiciona listeners para as teclas Q e E
export function setupCameraControls(camera) {
    window.addEventListener('keydown', (event) => {
        if (event.key === 'q' || event.key === 'Q') {
            switchCameraPosition(camera, 'prev'); // Volta para a posição anterior
        } else if (event.key === 'e' || event.key === 'E') {
            switchCameraPosition(camera, 'next'); // Avança para a próxima posição
        }
    });
}