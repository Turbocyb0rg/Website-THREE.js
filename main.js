import './style.css';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

// Setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#act3jscene') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 0, 50);

// Torus
const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x0095DD });
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
scene.add(torus);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // Soft white light
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(50, 50, 50);
scene.add(directionalLight);

// Helpers
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Stars
function addStar() {
    const starGeometry = new THREE.SphereGeometry(0.5, 24, 24);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(starGeometry, starMaterial);
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
}
Array(200).fill().forEach(addStar);

// Background
const spaceTexture = new THREE.TextureLoader().load('assets/g.jpg');
scene.background = spaceTexture;

// Moon
const moonTexture = new THREE.TextureLoader().load('assets/ab.webp');
const moonNormalTexture = new THREE.TextureLoader().load('assets/stra2.jpg');
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: moonNormalTexture, metalness: 0.2, roughness: 1, emissive: 0xaaaaaa });
const moon = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), moonMaterial);
moon.position.z = 30;
moon.position.x = -10;
scene.add(moon);

// Post-processing
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const bloomPass = new UnrealBloomPass();
bloomPass.strength = 1.5;
bloomPass.radius = 1;
bloomPass.threshold = 0.1;
composer.addPass(bloomPass);

// Additional object - photo on cube
const texture = new THREE.TextureLoader().load('assets/yeeee.jpg');
const material = new THREE.MeshStandardMaterial({ map: texture });
const cubeSize = 7; // Adjust size as needed
const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const cube = new THREE.Mesh(cubeGeometry, material);
cube.position.set(0, 0, 0); // Position the cube above the torus and back a bit
scene.add(cube);

// Falling leaves particle system
const leavesTexture = new THREE.TextureLoader().load('assets/flames.png');
const leavesGeometry = new THREE.BufferGeometry();
const leavesCount = 200;
const leavesPositions = [];
for (let i = 0; i < leavesCount; i++) {
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 200 - 100;
    const z = Math.random() * 200 - 100;
    leavesPositions.push(x, y, z);
}
leavesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(leavesPositions, 3));
const leavesMaterial = new THREE.PointsMaterial({ size: 1, map: leavesTexture, transparent: true });
const leaves = new THREE.Points(leavesGeometry, leavesMaterial);
scene.add(leaves);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;
    moon.rotation.x += 0.005;
    moon.rotation.y += 0.0075;
    moon.rotation.z += 0.005;
    controls.update();
    composer.render();
}

// Scroll event listener
window.addEventListener('scroll', () => {
    const scrollValue = window.scrollY;
    cube.position.x = scrollValue * 0.1;
    moon.position.y = scrollValue * 0.1;
});

// Start animation
animate();