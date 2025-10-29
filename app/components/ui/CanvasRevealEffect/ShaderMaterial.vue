<script setup lang="ts">
import { useLoop } from '@tresjs/core'
import { CustomBlending, GLSL3, OneFactor, SrcAlphaFactor, Vector2, Vector3 } from 'three'

const props = defineProps<{
  source: string
  uniforms: {
    [key: string]: {
      value: number[] | number[][] | number
      type: string
    }
  }
  maxFps?: number
}>()

const meshRef = ref()
const { sizes } = useTresContext()

let lastFrameTime = 0
const { onBeforeRender } = useLoop()

onBeforeRender(({ elapsed }) => {
  if (!meshRef.value)
    return
  const timestamp = elapsed
  if (timestamp - lastFrameTime < 1 / (props.maxFps || 60))
    return
  lastFrameTime = timestamp

  const material: any = meshRef.value.material
  if (material && material.uniforms && material.uniforms.u_time) {
    material.uniforms.u_time.value = timestamp
  }
})

const vertexShader = `
  precision mediump float;
  in vec2 coordinates;
  uniform vec2 u_resolution;
  out vec2 fragCoord;
  void main(){
    float x = position.x;
    float y = position.y;
    gl_Position = vec4(x, y, 0.0, 1.0);
    fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
    fragCoord.y = u_resolution.y - fragCoord.y;
  }
`

const preparedUniforms = ref<any>({})

function prepareUniforms() {
  const prepared: any = {}

  for (const uniformName in props.uniforms) {
    const uniform: any = props.uniforms[uniformName]

    switch (uniform.type) {
      case 'uniform1f':
        prepared[uniformName] = { value: uniform.value, type: '1f' }
        break
      case 'uniform3f':
        prepared[uniformName] = {
          value: new Vector3().fromArray(uniform.value),
          type: '3f',
        }
        break
      case 'uniform1fv':
        prepared[uniformName] = { value: uniform.value, type: '1fv' }
        break
      case 'uniform3fv':
        prepared[uniformName] = {
          value: uniform.value.map((v: number[]) =>
            new Vector3().fromArray(v),
          ),
          type: '3fv',
        }
        break
      case 'uniform2f':
        prepared[uniformName] = {
          value: new Vector2().fromArray(uniform.value),
          type: '2f',
        }
        break
      default:
        console.error(`Invalid uniform type for '${uniformName}'.`)
        break
    }
  }

  prepared.u_time = { value: 0, type: '1f' }
  prepared.u_resolution = { value: new Vector2(sizes.width.value * 2, sizes.height.value * 2) }

  preparedUniforms.value = prepared
}

function updateResolution() {
  if (preparedUniforms.value.u_resolution) {
    preparedUniforms.value.u_resolution.value.set(sizes.width.value * 2, sizes.height.value * 2)
  }
}

watch(() => [sizes.width.value, sizes.height.value], updateResolution)

onMounted(() => {
  prepareUniforms()
  updateResolution()
})

// watch(() => props.uniforms, prepareUniforms, { deep: true })
</script>

<template>
  <TresMesh ref="meshRef">
    <TresPlaneGeometry :args="[2, 2]" />
    <TresShaderMaterial
      :vertex-shader="vertexShader"
      :fragment-shader="source"
      :uniforms="preparedUniforms"
      :glsl-version="GLSL3"
      :blending="CustomBlending"
      :blend-src="SrcAlphaFactor"
      :blend-dst="OneFactor"
    />
  </TresMesh>
</template>
