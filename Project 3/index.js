// standard imports
import * as THREE from 'three'
import { OrbitControls } from 'jsm/controls/OrbitControls.js'

// points for tube
import spline from './spline.js'

// for bloom effect
import { EffectComposer } from 'jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'jsm/postprocessing/UnrealBloomPass.js'

// template
const w = window.innerWidth
const h = window.innerHeight
const scene = new THREE.Scene()
// for adding a fog effect
scene.fog = new THREE.FogExp2(0x000000, 0.4)
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000)
camera.position.z = 5
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(w, h)
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.outputColorSpace = THREE.SRGBColorSpace
document.body.appendChild(renderer.domElement)

// setting the camera
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.03

// post-processing for bloom effect
const renderScene = new RenderPass(scene, camera)
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100)
bloomPass.threshold = 0.002
bloomPass.strength = 3.5
bloomPass.radius = 0
const composer = new EffectComposer(renderer)
composer.addPass(renderScene)
composer.addPass(bloomPass)

// getting data for tube
const points = spline.getPoints(100)
const geometry = new THREE.BufferGeometry().setFromPoints(points)
const material = new THREE.LineBasicMaterial({ color: 0xff0000 })
const line = new THREE.Line(geometry, material)
// scene.add(line)

// creating tube geometry
const tubeGeo = new THREE.TubeGeometry(spline, 222, 0.65, 16, true)
// const tubeMat = new THREE.MeshBasicMaterial({
//   color: 0xffffff,
//   wireframe: true,
//   side: THREE.DoubleSide,
// })
// const tube = new THREE.Mesh(tubeGeo, tubeMat)
// scene.add(tube)

// superimposing on tube lines
const edges = new THREE.EdgesGeometry(tubeGeo, 0.3)
const lineMat = new THREE.LineBasicMaterial({ color: 0x0627cb })
const tubeLines = new THREE.LineSegments(edges, lineMat)
scene.add(tubeLines)

// const hemilight = new THREE.HemisphereLight(0xffffff, 0x444444)
// scene.add(hemilight)

// creating boxes
const numBoxes = 55
const size = 0.075
const boxGeo = new THREE.BoxGeometry(size, size, size)
for (let i = 0; i < numBoxes; i += 1) {
  // const boxMat = new THREE.MeshBasicMaterial({
  //   color: 0xffffff,
  //   wireframe: true,
  // })
  // const box = new THREE.Mesh(boxGeo, boxMat)
  const p = (i / numBoxes + Math.random() * 0.1) % 1
  const pos = tubeGeo.parameters.path.getPointAt(p)
  pos.x += Math.random() - 0.4
  pos.z += Math.random() - 0.4
  // box.position.copy(pos)
  const rote = new THREE.Vector3(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  )
  // box.rotation.set(rote.x, rote.y, rote.z)
  // scene.add(box)

  // superimposing lines on the boxes
  const edges = new THREE.EdgesGeometry(boxGeo, 0.3)
  const lineMat = new THREE.LineBasicMaterial({ color: 0xaa2ed8 })
  const boxLines = new THREE.LineSegments(edges, lineMat)
  boxLines.position.copy(pos)
  boxLines.rotation.set(rote.x, rote.y, rote.z)
  scene.add(boxLines)
}

// updating camera position after time interval
function updateCamera(t) {
  const time = t * 0.2
  const looptime = 20 * 1000
  const p = (time % looptime) / looptime
  const pos = tubeGeo.parameters.path.getPointAt(p)
  const lookAt = tubeGeo.parameters.path.getPointAt((p + 0.01) % 1)
  camera.position.copy(pos)
  camera.lookAt(lookAt)
}

// animate function
function animate(t = 0) {
  requestAnimationFrame(animate)
  updateCamera(t)
  composer.render(scene, camera)
  controls.update()
}

animate()
