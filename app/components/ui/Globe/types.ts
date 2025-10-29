// 定義接口和類型
export interface GlobeConfig {
  pointSize: number
  atmosphereColor: string
  showAtmosphere: boolean
  atmosphereAltitude: number
  polygonColor: string
  globeColor: string
  emissive: string
  emissiveIntensity: number
  shininess: number
  arcTime: number
  arcLength: number
  rings: number
  maxRings: number
  ambientLight: string
  directionalLeftLight: string
  directionalTopLight: string
  pointLight: string
  autoRotate: boolean
  autoRotateSpeed: number
}

export interface Position {
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  color: string
  arcAlt: number
  order: number
}

export interface WorldProps {
  globeConfig: GlobeConfig
  arcsData: Position[]
}

export type Arcs = Position[]
