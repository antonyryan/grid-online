// Função para criar o boneco
const fbxLoader = new THREE.FBXLoader();
export function createCharacter() {
    fbxLoader.load('/assets/models/player/hikerman.fbx', function (object) {
        player = object;
        player.scale.set(0.8, 0.8, 0.8); // Ajusta a escala do modelo
        const initialTile = tiles[0]; // Primeiro tile
        player.position.set(initialTile.position.x, initialTile.position.y + GridDimensions.tileSize / 2, initialTile.position.z); // Posiciona o boneco no primeiro tile
        player.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        scene.add(player);
        // Verifica se o modelo possui animações
        if (object.animations && object.animations.length > 0) {
            console.log('O modelo possui animações:', object.animations);
            mixer = new THREE.AnimationMixer(player);
            const action = mixer.clipAction(object.animations[0]);
            action.play();
        } else {
            console.log('O modelo não possui animações.');
        }
    }, undefined, function (error) {
        console.error(error);
    });
}