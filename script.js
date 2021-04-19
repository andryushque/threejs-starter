import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

// === Loading
const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load("/textures/normalMap2.jfif");

// === Debug
const gui = new dat.GUI();

// === Canvas
const canvas = document.querySelector("canvas.webgl");

// === Scene
const scene = new THREE.Scene();

// === Objects
// const geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);
const geometry = new THREE.SphereBufferGeometry(0.33, 64, 64);

// === Materials
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.6;
material.roughness = 0.3;
material.normalMap = normalTexture;
material.color = new THREE.Color(0x000000);

// === Mesh
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

/**
 * Lights
 */
// === Light #1
const pointLight1 = new THREE.PointLight(0xff0000, 2);
pointLight1.position.set(0, 3, -3.5);
pointLight1.intensity = 10;
scene.add(pointLight1);

const light1 = gui.addFolder("Light 1");
light1.add(pointLight1.position, "x").min(-5).max(5).step(0.01);
light1.add(pointLight1.position, "y").min(-6).max(6).step(0.01);
light1.add(pointLight1.position, "z").min(-5).max(5).step(0.01);
light1.add(pointLight1, "intensity").min(0).max(10).step(0.01);

const light1Color = {
  color: 0xff0000,
};

light1.addColor(light1Color, "color").onChange(() => {
  pointLight1.color.set(light1Color.color);
});

// const pointLightHelper1 = new THREE.PointLightHelper(pointLight1, 1);
// scene.add(pointLightHelper1);

// === Light #2
const pointLight2 = new THREE.PointLight(0xff0000, 2);
pointLight2.position.set(0, -3, -2);
pointLight2.intensity = 10;
scene.add(pointLight2);

const light2 = gui.addFolder("Light 2");
light2.add(pointLight2.position, "x").min(-5).max(5).step(0.01);
light2.add(pointLight2.position, "y").min(-6).max(6).step(0.01);
light2.add(pointLight2.position, "z").min(-5).max(5).step(0.01);
light2.add(pointLight2, "intensity").min(0).max(10).step(0.01);

const light2Color = {
  color: 0xff0000,
};

light2.addColor(light2Color, "color").onChange(() => {
  pointLight2.color.set(light2Color.color);
});

// const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 1);
// scene.add(pointLightHelper2);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // == Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // == Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // == Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// === Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 1;
scene.add(camera);

// === Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

const onDocumentMouseMove = (event) => {
  mouseX = event.clientX - windowX;
  mouseY = event.clientY - windowY;
};

document.addEventListener("mousemove", onDocumentMouseMove);

const updateSphere = (event) => {
  sphere.position.y = window.scrollY * 0.001;
};

document.addEventListener("scroll", updateSphere);

const clock = new THREE.Clock();

const tick = () => {
  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;

  const elapsedTime = clock.getElapsedTime();

  // == Update objects
  sphere.rotation.y = 0.42 * elapsedTime;

  sphere.rotation.y += 0.5 * (targetX - sphere.rotation.y);
  sphere.rotation.x += 0.025 * (targetY - sphere.rotation.x);
  sphere.position.z += -0.01 * (targetY - sphere.rotation.x);

  // == Update Orbital Controls
  // == controls.update()

  // == Render
  renderer.render(scene, camera);

  // == Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
