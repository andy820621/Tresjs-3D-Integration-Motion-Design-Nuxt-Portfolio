<script setup lang="ts">
import ThreeGlobe from 'three-globe'
import { AmbientLight, Color, DirectionalLight, Fog, PerspectiveCamera, PointLight, Scene, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { WorldProps } from './types'
import countries from '~/assets/data/globe.json'

const props = defineProps<WorldProps>()
const RING_PROPAGATION_SPEED = 3

const defaultProps = ({
  pointSize: 1,
  atmosphereColor: '#ffffff',
  showAtmosphere: true,
  atmosphereAltitude: 0.1,
  polygonColor: 'rgba(255,255,255,0.7)',
  globeColor: '#062056',
  emissive: '#000000',
  emissiveIntensity: 0.1,
  shininess: 0.9,
  arcTime: 2000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
})
if (props.globeConfig)
  Object.assign(defaultProps, props.globeConfig)

const container = ref<HTMLDivElement | null>(null)
let renderer: WebGLRenderer
let camera: PerspectiveCamera
let scene: Scene
let controls: OrbitControls
let Globe: ThreeGlobe

const globeData = shallowRef<{
  size: number
  order: number
  color: (t: number) => string
  lat: number
  lng: number
}[]>([])

function init() {
  renderer = new WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(0xFFAAFF, 0)
  container.value?.appendChild(renderer.domElement)

  scene = new Scene()
  scene.add(new AmbientLight(props.globeConfig.ambientLight, 0.6))

  const aspect = 1.2
  camera = new PerspectiveCamera(50, aspect, 180, 1800)
  camera.updateProjectionMatrix()

  const dLight = new DirectionalLight(props.globeConfig.directionalLeftLight, 0.8)
  dLight.position.set(-400, 100, 400)
  camera.add(dLight)

  const dLight1 = new DirectionalLight(props.globeConfig.directionalTopLight)
  dLight1.position.set(-200, 500, 200)
  camera.add(dLight1)

  const pointLight = new PointLight(props.globeConfig.pointLight, 0.8)
  pointLight.position.set(-200, 500, 200)
  camera.add(pointLight)

  scene.add(camera)
  scene.fog = new Fog(0xFFFFFF, 400, 2000)

  const cameraZ = 300
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enablePan = false
  controls.enableZoom = false
  controls.minDistance = cameraZ
  controls.maxDistance = cameraZ
  controls.autoRotateSpeed = 1
  controls.autoRotate = true
  controls.minPolarAngle = Math.PI / 3.5
  controls.maxPolarAngle = Math.PI - Math.PI / 3
}

function initGlobe() {
  Globe = new ThreeGlobe({
    waitForGlobeReady: true,
    animateIn: true,
  })
    .hexPolygonsData(countries.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.7)
    .showAtmosphere(defaultProps.showAtmosphere)
    .atmosphereColor(defaultProps.atmosphereColor)
    .atmosphereAltitude(defaultProps.atmosphereAltitude)
    .hexPolygonColor(() => {
      return defaultProps.polygonColor
    })

  const globeMaterial = Globe.globeMaterial()
  if ('color' in globeMaterial) // 檢查並設置顏色
    globeMaterial.color = new Color(props.globeConfig.globeColor || defaultProps.globeColor || '#1d072e')
  if ('emissive' in globeMaterial) // 檢查並設置發光顏色
    globeMaterial.emissive = new Color(props.globeConfig.emissive)
  if ('emissiveIntensity' in globeMaterial) // 檢查並設置發光強度
    globeMaterial.emissiveIntensity = props.globeConfig.emissiveIntensity || 0.1
  if ('shininess' in globeMaterial) // 檢查並設置光澤度
    globeMaterial.shininess = props.globeConfig.shininess || 0.9

  scene.add(Globe)
}

let animationFrameId: number

function animate() {
  if (!camera)
    return
  camera.lookAt(scene.position) // 相機對準場景中心
  controls.update() // 更新控制器
  renderer.render(scene, camera) // 渲染場景
  animationFrameId = requestAnimationFrame(animate) // 設置下一幀的動畫
}

function initRender() {
  init()
  initGlobe()
  buildData()
  animate()

  if (Globe && globeData.value) {
    const features = countries?.features || []
    if (features.length === 0) {
      console.error('No features found in countries data')
      return
    }

    try {
      Globe
        .hexPolygonsData(features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(defaultProps.showAtmosphere)
        .atmosphereColor(defaultProps.atmosphereColor)
        .atmosphereAltitude(defaultProps.atmosphereAltitude)
        .hexPolygonColor(() => {
          return defaultProps.polygonColor
        })

      startAnimation()
    }
    catch (error) {
      console.error('Error setting hexPolygonsData:', error)
    }
  }
}
function destroyCanvas() {
  cancelAnimationFrame(animationFrameId)
  scene.traverse((child: any) => {
    if (child.material) {
      child.material.dispose()
    }
    if (child.geometry) {
      child.geometry.dispose()
    }
  })
  scene.clear()
  renderer.forceContextLoss() // 強制上下文丟失
  renderer.dispose() // 釋放渲染器資源
  container.value?.removeChild(renderer.domElement)
}

onMounted(initRender)
onBeforeUnmount(destroyCanvas)

// 控制圓環動畫
const { pause, resume } = useIntervalFn(() => {
  if (!Globe || !globeData.value)
    return
  const numbersOfRings = genRandomNumbers(
    0,
    props.arcsData.length,
    Math.floor((props.arcsData.length * 4) / 5),
  )

  Globe.ringsData(
    globeData.value.filter((d, i) => numbersOfRings.includes(i)),
  )
}, 2000)
onMounted(resume)
onUnmounted(pause)

function buildData() {
  try {
    const arcs = props.arcsData
    const points = []

    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i]
      const rgb = hexToRgb(arc.color)
      if (rgb === null) {
        console.warn(`Invalid color for arc ${i}:`, arc.color)
        continue
      }
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.startLat,
        lng: arc.startLng,
      })
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.endLat,
        lng: arc.endLng,
      })
    }

    const filteredPoints = points.filter(
      (v, i, a) =>
        a.findIndex(v2 =>
          ['lat', 'lng'].every(k => v2[k as 'lat' | 'lng'] === v[k as 'lat' | 'lng']),
        ) === i,
    )

    globeData.value = filteredPoints
  }
  catch (error) {
    console.error('Error building globe data:', error)
  }
}

function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}
function genRandomNumbers(min: number, max: number, count: number) {
  const arr: number[] = []
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min
    if (!arr.includes(r))
      arr.push(r)
  }

  return arr
}

function startAnimation() {
  try {
    Globe!
      .arcsData(props.arcsData)
      .arcStartLat(d => (d as { startLat: number }).startLat * 1)
      .arcStartLng(d => (d as { startLng: number }).startLng * 1)
      .arcEndLat(d => (d as { endLat: number }).endLat * 1)
      .arcEndLng(d => (d as { endLng: number }).endLng * 1)
      .arcColor((e: any) => (e as { color: string }).color)
      .arcAltitude((e) => {
        return (e as { arcAlt: number }).arcAlt * 1
      })
      .arcStroke(() => {
        return [0.32, 0.28, 0.3][Math.round(Math.random() * 2)]
      })
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap(e => (e as { order: number }).order * 1)
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime)

    Globe!
      .pointsData(props.arcsData)
      .pointColor(e => (e as { color: string }).color)
      // .pointsMerge(true) // TODO: figure out why this line will occur Error
      .pointAltitude(0.0)
      .pointRadius(2)

    Globe!
      .ringsData([])
      .ringColor((e: any) => (t: any) => e.color(t))
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod(
        (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings,
      )
  }
  catch (error) {
    console.error('Error starting animation:', error)
  }
};

useResizeObserver(container, ([entry]) => {
  const { width, height } = entry.contentRect
  if (camera && renderer) {
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }
})

useEventListener(container, 'mousedown', onMouseDown)
useEventListener(container, 'mouseup', onMouseUp)

function onMouseDown() {
  if (container.value) {
    container.value.style.cursor = 'grabbing'
  }
}

function onMouseUp() {
  if (container.value) {
    container.value.style.cursor = 'grab'
  }
}
</script>

<template>
  <div ref="container" class="w-full h-full" />
</template>
