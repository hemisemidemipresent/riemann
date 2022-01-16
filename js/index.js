const container = document.getElementById('container');

let sheets = 10;
let radiusSteps = 50;
let angleSteps = 20 * 8 * sheets;
let val = 1 / 2;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.up.set(0, 0, 1);
camera.position.set(1, 1.8, 1.5);

let renderer, controls;
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
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const axesColor = 0x5ca4a9;
const size = 1;
const divisions = 10;
const gridHelper = new THREE.GridHelper(size, divisions);
gridHelper.rotateX(Math.PI / 2);
scene.add(gridHelper);
drawScene();
function drawScene() {
    scene.remove(scene?.children[3]);

    let geometry = new THREE.ParametricGeometry(
        function (u, v) {
            // both u and v run from zero to one
            let phi = 2 * Math.PI * sheets * v;
            let r = u / Math.cos(octant(phi)); // creates square corners
            let x = r * Math.cos(phi);
            let y = r * Math.sin(phi);
            let z = Math.pow(r, val) * Math.cos(val * phi);

            return new THREE.Vector3(x, y, z);
        },
        radiusSteps,
        angleSteps
    );

    // assign phase colors in same order as vertices
    for (let i = 0; i <= angleSteps; i++) {
        let v = i / angleSteps;
        for (let j = 0; j <= radiusSteps; j++) {
            let u = j / radiusSteps;
            geometry.colors[i * (radiusSteps + 1) + j] = new THREE.Color().setHSL(
                phase(u, v),
                1,
                0.5
            );
        }
    }
    function phase(u, v) {
        return (v * sheets * Math.abs(val)) % 1;
    }
    // meshes pass colors via faces
    for (let i = 0; i < geometry.faces.length; i++) {
        let face = geometry.faces[i];
        face.vertexColors = [
            geometry.colors[face.a],
            geometry.colors[face.b],
            geometry.colors[face.c]
        ];
    }
    let material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
        side: THREE.DoubleSide
    });
    scene.add(new THREE.Mesh(geometry, material));
}

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
function update() {
    let m = document.getElementById('m').value;
    let n = document.getElementById('n').value;
    val = parseInt(m) / parseInt(n);
    drawScene();
}
