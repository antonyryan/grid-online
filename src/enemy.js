import * as THREE from 'three';
import {FBXLoader} from "three/addons";
import { GridDimensions } from "./gridManager.js";
 // Para carregar as texturas
let enemy = null;
let enemyMixer = null;

export function createEnemy(scene, tiles) {
    const enemyModelPath = '/assets/models/enemy/necromancer/necromancer.fbx';
    const texturePath = '/assets/models/enemy/necromancer/Texture/necromant_Body_Albedo.tga'; // Caminho da textura
    const fbxLoader = new FBXLoader();
    const textureLoader = new THREE.TextureLoader();
    // Verifica se os tiles foram passados corretamente
    if (!tiles || tiles.length === 0) {
        console.error('Erro: A matriz "tiles" está vazia ou não foi inicializada.');
        return;
    }

    // Carrega a textura
    const texture = textureLoader.load(texturePath, () => {
        console.log('Textura carregada com sucesso:', texturePath);
    }, undefined, (error) => {
        console.error('Erro ao carregar a textura:', error);
    });

    // Carrega o modelo do inimigo usando FBXLoader
    fbxLoader.load(
        enemyModelPath,
        function (object) {
            enemy = object;
            enemy.scale.set(0.8, 0.8, 0.8); // Ajusta a escala do modelo

            // Substitui os materiais do modelo pela textura carregada
            enemy.traverse(function (child) {
                if (child.isMesh) {
                    // Cria um novo material com a textura
                    const material = new THREE.MeshStandardMaterial({
                        map: texture, // Aplica a textura
                        side: THREE.DoubleSide // Renderiza ambos os lados da malha
                    });

                    // Substitui o material da malha
                    child.material = material;

                    // Configura sombreamento
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Calcula o índice do tile inicial (ex.: posição 5, 5)
            const initialTileIndex = 8 + 8 * GridDimensions.cols;
            const initialTile = tiles[initialTileIndex];

            // Verifica se o tile inicial existe
            if (!initialTile || !initialTile.position) {
                console.error('Erro: O tile inicial não foi encontrado ou não possui posição.');
                return;
            }

            // Posiciona o inimigo no tile inicial
            enemy.position.set(
                initialTile.position.x,
                initialTile.position.y + GridDimensions.tileSize / 2,
                initialTile.position.z
            );

            // Adiciona o inimigo à cena
            scene.add(enemy);

            // Verifica se o modelo possui animações
            if (object.animations && object.animations.length > 0) {
                console.log('O modelo do inimigo possui animações:', object.animations);
                enemyMixer = new THREE.AnimationMixer(enemy);
                const action = enemyMixer.clipAction(object.animations[0]);
                action.play();
            } else {
                console.log('O modelo do inimigo não possui animações.');
            }
        },
        undefined, // Progresso do carregamento (opcional)
        function (error) {
            console.error('Erro ao carregar o modelo do inimigo:', error);
        }
    );
}