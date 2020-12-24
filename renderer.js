// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const THREE = require("three");
const OrbitControls =  require("three-orbitcontrols");

let controls;
let container;
let camera, scene, renderer;
let mesh;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050505);
  scene.fog = new THREE.Fog(0x050505, 2000, 3000);
  scene.add(new THREE.AmbientLight(0x8fbcd4, 0.4));

  container = document.getElementById("container");
  camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 5, 3500);
  camera.position.z = 2750;
  scene.add(camera);

  let particles = 500000;

  let geometry = new THREE.BufferGeometry();

  let positions = [];
  let colors = [];

  let color = new THREE.Color();

  let n = 1000,
    n2 = n / 2;

  for (let i = 0; i < particles; i += 100) {
    let x = Math.random() * n - n2;
    let y = Math.random() * n - n2;
    let z = Math.random() * n - n2;

    positions.push(x, y, z);

    let vx = x / n + 0.5;
    let vy = y / n + 0.5;
    let vz = z / n + 0.5;
    color.setRGB(vx, vy, vz);
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  geometry.computeBoundingSphere();

  let material = new THREE.PointsMaterial({ size: 15, vertexColors: true });

  points = new THREE.Points(geometry, material);
  scene.add(points);

  // let pointLight = new THREE.PointLight(0xffffff, 1);
  // // 灯跟着相机走, 效果不错
  // camera.add(pointLight);

  scene.add(new THREE.AxesHelper(5));

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  let controls = new OrbitControls(camera, renderer.domElement);
  controls.enabledZoom = false;

  window.addEventListener("resize", onWindowResize, false);
}

function animation() {
  render();

  requestAnimationFrame(animation);
}

function render() {
  let time = Date.now() * 0.001;

  points.rotation.x = time * 0.25;
  points.rotation.y = time * 0.5;

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}


init();
animation();