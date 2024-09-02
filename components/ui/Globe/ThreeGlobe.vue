<script setup lang="ts">
import { Color, Fog, Material, Vector3 } from 'three'
import { extend, useRenderLoop, useTresContext } from '@tresjs/core'
import ThreeGlobe from 'three-globe'
import type { WorldProps } from './types'
import countries from '~/assets/data/globe.json'

const props = withDefaults(defineProps<WorldProps>(), {

})

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
onBeforeMount(() => {
  if (props.globeConfig)
    Object.assign(defaultProps, props.globeConfig)
})

const globeGroup = ref()
const globeRef = ref<ThreeGlobe | null>(null)
const globeData = shallowRef<{
  size: number
  order: number
  color: (t: number) => string
  lat: number
  lng: number
}[]>([])

onMounted(() => {
  const globe = new ThreeGlobe()
  globeRef.value = globe
  if (!globeGroup.value)
    return
  globeGroup.value.add(globe)

  // 設定地球儀的材質
  const globeMaterial = globe.globeMaterial()
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

  // 設定地球儀的大小
  globe.scale.set(5, 5, 5)

  // 添加點或弧線等
  buildData()
  buildMaterial()
})

watch(globeRef, () => {
  if (globeRef.value) {
    buildData()
    buildMaterial()
    // globeRef.value.lookAt(new Vector3(0, 0, 0))
  }
})

watch(globeData, async () => {
  if (globeRef.value && globeData.value) {
    const features = countries?.features || [];
    if (features.length === 0) {
      console.error('No features found in countries data');
      return;
    }

    try {
      globeRef.value
        .hexPolygonsData(features) // 確保 features 不為空
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(defaultProps.showAtmosphere)
        .atmosphereColor(defaultProps.atmosphereColor)
        .atmosphereAltitude(defaultProps.atmosphereAltitude)
        .hexPolygonColor(() => {
          return defaultProps.polygonColor;
        });

      startAnimation();
    } catch (error) {
      console.error('Error setting hexPolygonsData:', error);
    }
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
  try {
    const globeMaterial = globeRef.value!.globeMaterial()

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
  try {
    globeRef.value!
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

    globeRef.value!
      .pointsData(props.arcsData)
      .pointColor(e => (e as { color: string }).color)
      // .pointsMerge(true) // TODO: figure out why this line will occur Error
      .pointAltitude(0.0)
      .pointRadius(2)

    globeRef.value!
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
  <TresGroup ref="globeGroup">
    <TresMesh>
      <TresSphereGeometry :args="[5, 32, 32]" />
      <TresMeshStandardMaterial color="#0000ff" />
    </TresMesh>
  </TresGroup>
</template>

<style scoped>

</style>
