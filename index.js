// index.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// Geometry

//Cube
const cuGeometry = new THREE.BoxGeometry();
const cuMaterial = new THREE.MeshNormalMaterial();

const cube = new THREE.Mesh(cuGeometry, cuMaterial);
//scene.add(cube);

//Sphere
const spGeometry = new THREE.SphereGeometry();
const spMaterial = new THREE.MeshNormalMaterial(); 

const sphere = new THREE.Mesh(spGeometry, spMaterial);
//scene.add(sphere);

//Torus
const toGeometry = new THREE.TorusGeometry();
const toMaterial = new THREE.MeshNormalMaterial();

const torus = new THREE.Mesh(toGeometry, toMaterial);
//scene.add(torus);

//Torus Knot
const knGeometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 ); 
const knMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 

const torusKnot = new THREE.Mesh(knGeometry, knMaterial);
//scene.add(torusKnot);

//Heart
const x = 0, y = 0;

const heartShape = new THREE.Shape();

heartShape.moveTo( x + 5, y + 5 );
heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

const hsGeometry = new THREE.ShapeGeometry( heartShape );
const hsMaterial = new THREE.MeshBasicMaterial( { color: "red" } );
const heart = new THREE.Mesh( hsGeometry, hsMaterial ) ;
//scene.add(heart);

//Sprite
const map = new THREE.TextureLoader().load( 'cat.png' );
const material = new THREE.SpriteMaterial( { map: map } );

const sprite = new THREE.Sprite( material );
scene.add( sprite );

sprite.position.z = -20;

// Animate
function animate() {
    requestAnimationFrame(animate);
    sprite.position.z += 0.01;
    sprite.rotation.z += 0.1;
    sprite.rotation.y += 0.01;

    renderer.render(scene, camera);
}
animate();
