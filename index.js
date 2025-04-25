import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let stopAnimation = false;
let bgTransitionProgress = 0;
let startBgFade = false;

const bgStart = new THREE.Color(0x1f1f1f);
const bgEnd = new THREE.Color(0xffffff);

let model;
const scene = new THREE.Scene();
scene.background = bgStart;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Criando uma nova mesh
const geometry = new THREE.PlaneGeometry(4, 4, 20, 20);
const material = new THREE.MeshStandardMaterial({
  color: 0xe5e5e5,
  side: THREE.DoubleSide // <- super importante
});
const aluminumSheet = new THREE.Mesh(geometry, material);
aluminumSheet.position.set(0, 1, 0);
aluminumSheet.rotation.x = -Math.PI / 2;
scene.add(aluminumSheet);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('assets/logo.png');

const revealMaterial = new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.DoubleSide
});

const revealSheet = new THREE.Mesh(geometry.clone(), revealMaterial);
revealSheet.position.set(0, 0.75, 0);
revealSheet.rotation.x = -Math.PI / 2;
revealSheet.scale.y = 0; // começa invisível
scene.add(revealSheet);

// Controles de órbita
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enableRotate = false;

const loader = new GLTFLoader();
loader.load('gltf/ctp.glb', (gltf) => {
    model = gltf.scene;
    model.position.set(-0.8, 0, 7);
    model.scale.set(80, 80, 80); // Ajuste esse valor se estiver muito pequeno ou muito grande
    scene.add(model);
  }, undefined, (error) => {
    console.error(error);
  });

const light = new THREE.PointLight(0xffffff, 75, 100);
light.position.set(0, 10, -10);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 1);
//scene.add(ambient);

camera.position.set(0, 5, 0);      // Posição da câmera
controls.target.set(0, 0, 0);       // Alvo da câmera (onde ela olha)

function animate() {
  if (stopAnimation) return;
  requestAnimationFrame(animate);

  if (model && model.position.z > -15) {
    model.position.z -= 0.02; // sobe devagar (negativo porque eixo Z "vem pra frente")
  }

  if (model && model.position.z < -3) {
    const shrinkSpeed = 0.005;
    aluminumSheet.scale.y = Math.max(0, aluminumSheet.scale.y - shrinkSpeed);
    aluminumSheet.position.z -= (shrinkSpeed * 2);

    revealSheet.scale.y = Math.min(1, revealSheet.scale.y + 0.01);
  }

  if (model && model.position.z < -12) {
    bgTransitionProgress += 0.01; // velocidade da transição
    scene.background = bgStart.clone().lerp(bgEnd, bgTransitionProgress);
  }

  if (model && model.position.z < -15) {
    const moveSpeed = 0.05;

    if (revealSheet.position.z >= -2.25) {
      revealSheet.position.z -= moveSpeed;
    }
  }

  controls.update(); // atualiza os controles de órbita
  renderer.render(scene, camera);

  if (revealSheet.position.z == -2.25) {
    document.getElementById('site-overlay').style.display = 'block';
  
    // Para a animação
    stopAnimation = true;
  
    // Limpa tudo depois de 1 segundo
    setTimeout(() => {
      disposeScene(scene, renderer);
    }, 1000);
  }
}

function disposeScene(scene, renderer) {
  if (!scene || !renderer) return;

  scene.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach((mat) => {
          if (mat.map) mat.map.dispose();
          mat.dispose();
        });
      } else {
        if (obj.material.map) obj.material.map.dispose();
        obj.material.dispose();
      }
    }
  });

  renderer.dispose();

  if (renderer.domElement && renderer.domElement.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement);
  }
  
}

animate();
