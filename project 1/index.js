// standard import
import * as THREE from 'three'
// For touch and size controls
import { OrbitControls } from 'jsm/controls/OrbitControls.js'

// setting height and widht for scene
const w = window.innerWidth
const h = window.innerHeight

// creating the renderer with given set of values
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(w, h)
// appending the child to body
document.body.appendChild(renderer.domElement)

// setting the fov aspect near and far
const fov = 75
const aspect = w / h
const near = 0.1
const far = 10
// creating a camera
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.z = 2
// creating a scene
const scene = new THREE.Scene()

// enabling touch and size controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.03

// making the basic mesh object
// geometry
const geo = new THREE.IcosahedronGeometry(1.0, 2)
// basic material for above geometry
const mat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  flatShading: true,
})
// create mesh
const mesh = new THREE.Mesh(geo, mat)
// add mesh to scene
scene.add(mesh)

// creating a wired mesh
const wireMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
})
const wireMesh = new THREE.Mesh(geo, wireMat)
wireMesh.scale.setScalar(1)
// adding the mesh to the previous mesh
mesh.add(wireMesh)

// adding hemilight
const hemiLight = new THREE.HemisphereLight(0x83f1f0, 0x001def)
scene.add(hemiLight)

// animate function
function animate(t = 0) {
  requestAnimationFrame(animate)
  // mesh.scale.setScalar(Math.cos(t * 0.001) + 1.0)
  mesh.rotation.y = t * 0.0001
  renderer.render(scene, camera)
  controls.update()
}

// functionc call
animate()
