const container = document.getElementById('container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(200, 200, 200);

let renderer, controls;
let sheets = 10;
let val = 5;
initRenderer();
function initRenderer() {
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
}
const light = new THREE.DirectionalLight(0xffffff, 0.75);
let color = new THREE.Color();
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
scene.add(new THREE.AxesHelper(100));
var geometry = new THREE.BufferGeometry();
var positions = [];
var colors = [];
let ni = 50; // radiusSteps
let nj = 10000; //angleSteps
for (let i = 0; i <= ni; i++) {
    let u = i / ni;
    for (let j = 0; j <= nj; j++) {
        let v = j / nj;
        let phi = 2 * Math.PI * sheets * v;
        let r = u / Math.cos(octant(phi)); // creates square corners
        let x = r * Math.cos(phi);
        let y = Math.pow(r, val) * Math.cos(val * phi);
        let z = r * Math.sin(phi);
        positions.push(x * 100, y * 100, z * 100);
        color.setHSL(phase(u, v), 1, 0.5);
        function phase(u, v) {
            return (v * sheets * Math.abs(val)) % 1;
        }
        colors.push(color.r, color.g, color.b);
    }
}
geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

geometry.computeBoundingSphere();
var material = new THREE.PointsMaterial({
    size: 3,
    vertexColors: THREE.VertexColors
});
let p = new THREE.Points(geometry, material);
scene.add(p);

render();
function render() {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}
function octant(angle) {
    while (angle > Math.PI / 2) angle = angle - Math.PI / 2;
    if (angle > Math.PI / 4 && angle <= Math.PI / 2) angle = Math.PI / 2 - angle;
    return angle;
}
