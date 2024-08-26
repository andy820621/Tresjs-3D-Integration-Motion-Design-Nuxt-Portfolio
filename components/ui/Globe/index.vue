<script setup lang="ts">
import { Color, Fog, Vector3 } from 'three'
import ThreeGlobe from 'three-globe'
import { TresCanvas, extend } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'

import type { WorldProps } from './types'
import countries from '~/assets/data/globe.json'

const props = withDefaults(defineProps<WorldProps>(), {

})

extend({ ThreeGlobe })

const RING_PROPAGATION_SPEED = 3
const pixelRatio = shallowRef(window.devicePixelRatio)

const globeRef = ref<ThreeGlobe | null>(null)
const canvasRef = ref<InstanceType<typeof TresCanvas> | null>(null)
const cameraRef = ref(null)
const globeData = shallowRef<{
  size: number
  order: number
  color: (t: number) => string
  lat: number
  lng: number
}[]>([])

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
onBeforeMount(() => {
  if (props.globeConfig)
    Object.assign(defaultProps, props.globeConfig)
})

watch(globeRef, () => {
  if (globeRef.value) {
    buildData()
    buildMaterial()

    // console.log({ globeRef: globeRef.value })
  }
})

watch(canvasRef, () => {
  if (canvasRef.value) {
    if (canvasRef.value.context) {
      if (canvasRef.value.context.scene.value) {
        // TODO: Seems to have no effect, need to refactor
        // const fog = new Fog(0xFFFFFF, 200, 1000) // 調整近平面和遠平面

        // 使用亮黃色，稍微降低亮度以模擬透明度
        const fogColor = new Color('#FFFF00').multiplyScalar(0.5)
        const fog = new Fog(fogColor, 400, 2000)

        canvasRef.value.context.scene.value.fog = fog
      }
      // console.log({ scene: canvasRef.value?.context?.scene.value })
    }
  }
})
// watch(cameraRef, () => {
//   if (cameraRef.value) {
//     console.log({ cameraRef: cameraRef.value })
//   }
// })

watch(globeData, async () => {
  if (globeRef.value && globeData.value) {
    globeRef.value
      .hexPolygonsData(countries.features)
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
})

// 控制圓環動畫
const { pause, resume } = useIntervalFn(() => {
  if (!globeRef.value || !globeData.value)
    return
  const numbersOfRings = genRandomNumbers(
    0,
    props.arcsData.length,
    Math.floor((props.arcsData.length * 4) / 5),
  )

  globeRef.value.ringsData(
    globeData.value.filter((d, i) => numbersOfRings.includes(i)),
  )
}, 2000)
onMounted(resume)
onUnmounted(pause)

function buildMaterial() {
  if (!globeRef.value) {
    console.error('Globe reference is not available')
    return
  }

  try {
    const globeMaterial = globeRef.value.globeMaterial()

    if ('color' in globeMaterial) // 檢查並設置顏色
      globeMaterial.color = new Color(props.globeConfig.globeColor)
    if ('emissive' in globeMaterial) // 檢查並設置發光顏色
      globeMaterial.emissive = new Color(props.globeConfig.emissive)
    if ('emissiveIntensity' in globeMaterial) // 檢查並設置發光強度
      globeMaterial.emissiveIntensity = props.globeConfig.emissiveIntensity || 0.1
    if ('shininess' in globeMaterial) // 檢查並設置光澤度
      globeMaterial.shininess = props.globeConfig.shininess || 0.9

    globeMaterial.setValues({
      blendColor: new Color(props.globeConfig.globeColor),
    })

    // 確保材質更新
    globeMaterial.needsUpdate = true
  }
  catch (error) {
    console.error('Error building globe material:', error)
  }
}

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

function startAnimation() {
  if (!globeRef.value || !globeData.value || !props.arcsData) {
    console.error('Globe, data, or arcsData is not available')
    return
  }

  try {
    globeRef.value
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

    globeRef.value
      .pointsData(props.arcsData)
      .pointColor(e => (e as { color: string }).color)
      // .pointsMerge(true) // TODO: figure out why this line will occur Error
      .pointAltitude(0.0)
      .pointRadius(2)

    globeRef.value
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

function genRandomNumbers(min: number, max: number, count: number) {
  const arr: number[] = []
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min
    if (!arr.includes(r))
      arr.push(r)
  }

  return arr
}
</script>

<template>
  <!-- :clear-color="new Color('#0xFFAAFF').getHexString()" -->
  <!-- clear-color="#82DBC5" -->
  <TresCanvas
    ref="canvasRef"
    :pixel-ratio="pixelRatio"
    alpha
  >
    <!-- Set up the camera -->
    <TresPerspectiveCamera
      v-if="globeRef"
      ref="cameraRef"
      :fov="50"
      :aspect="1.2"
      :near="180"
      :far="1800"
      :position="[0, 0, 300]"
      :look-at="[0, 0, 0]"
    />

    <!-- Add the globe -->
    <TresThreeGlobe ref="globeRef" />

    <!-- Lighting -->
    <TresAmbientLight v-if="globeRef && globeConfig" :color="globeConfig.ambientLight" :intensity="0.6" />
    <!-- Left and top lights -->
    <TresDirectionalLight v-if="globeRef && globeConfig" :color="globeConfig.directionalLeftLight" :position="new Vector3(-400, 100, 400)" />
    <TresDirectionalLight v-if="globeRef && globeConfig" :color="globeConfig.directionalTopLight" :position="new Vector3(-200, 500, 200)" />
    <TresPointLight v-if="globeRef && globeConfig" :color="globeConfig.pointLight" :position="new Vector3(-200, 500, 200)" intensity="0.8" />

    <!-- Controls -->
    <OrbitControls
      v-if="globeRef"
      :enable-pan="false"
      :enable-zoom="false"
      :min-distance="300"
      :max-distance="300"
      :auto-rotate="true"
      :auto-rotate-speed="1"
      :min-polar-angle="Math.PI / 3.5"
      :max-polar-angle="Math.PI - Math.PI / 3"
    />
  </TresCanvas>
</template>
