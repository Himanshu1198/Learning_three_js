// imports
import * as THREE from 'three'
import { OrbitControls } from 'jsm/controls/OrbitControls.js'
// functions for stars and cloud
import getStarfield from './getStartField.js'
import { getFresnelMat } from './getFresnelMat.js'

// basic template
const w = window.innerWidth
const h = window.innerHeight
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000)
camera.position.z = 5
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(w, h)
document.body.appendChild(renderer.domElement)

// creating a group
const earthGroup = new THREE.Group()
earthGroup.rotation.z = (-23.4 * Math.PI) / 100
scene.add(earthGroup)
new OrbitControls(camera, renderer.domElement)

// loader for getting images
const loader = new THREE.TextureLoader()
const geometry = new THREE.IcosahedronGeometry(1, 18)
const material = new THREE.MeshStandardMaterial({
  map: loader.load('./textures/8k_earth_daymap.jpg'),
})
const earthMesh = new THREE.Mesh(geometry, material)
earthGroup.add(earthMesh)

// adding sunlight
const sunLight = new THREE.DirectionalLight(0xa5a5a5, 1.5)
sunLight.position.set(-2, 0.5, 1.5)
earthGroup.add(sunLight)

// adding stars
const stars = getStarfield({ numStars: 2000 })
scene.add(stars)

// adding lights fot dark side
const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load('./textures/lights_image.jpg'),
  blending: THREE.AdditiveBlending,
  opacity: 0.4,
})
const lightMesh = new THREE.Mesh(geometry, lightsMat)
earthGroup.add(lightMesh)

// adding clouds
const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load('./textures/fair_clouds_8k.jpg'),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  // alphaTest: 0.3,
})
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat)
cloudsMesh.scale.setScalar(1.003)
earthGroup.add(cloudsMesh)

// for glowing horizon
const freselMat = new getFresnelMat()
const glowMesh = new THREE.Mesh(geometry, freselMat)
glowMesh.scale.setScalar(1.004)
earthGroup.add(glowMesh)

// animate function
function animate() {
  requestAnimationFrame(animate)

  earthMesh.rotation.y += 0.002
  lightMesh.rotation.y += 0.002
  cloudsMesh.rotation.y += 0.0025
  glowMesh.rotation.y += 0.002
  stars.rotation.y -= 0.0004
  renderer.render(scene, camera)
}

animate()
