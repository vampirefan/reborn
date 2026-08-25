<template>
  <div ref="mapContainer" class="leaflet-map" />
</template>

<script setup lang="ts">
import { BUILT_IN_SCENARIOS } from '~/data/scenarios'
import { useSettingsStore } from '~/stores/settingsStore'

const props = defineProps<{
  selectedId: string | null
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const settingsStore = useSettingsStore()
const mapContainer = ref<HTMLDivElement>()
let map: any = null
const markers = new Map<string, any>()

/**
 * Tile source follows the language setting:
 * - zh: AMap tiles with Chinese labels, darkened via CSS filter to keep the dark map aesthetic
 * - en (default): CartoDB dark_all with English labels
 */
function getTileConfig(): { url: string; subdomains: string | string[]; className?: string } {
  if (settingsStore.language === 'zh') {
    return {
      url: 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      subdomains: ['1', '2', '3', '4'],
      className: 'tile-zh',
    }
  }
  return {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    subdomains: 'abcd',
  }
}

function getEraColor(year: number): string {
  if (year < -500) return '#DAA520'
  if (year < 500) return '#CD853F'
  if (year < 1000) return '#20B2AA'
  if (year < 1500) return '#3CB371'
  if (year < 1700) return '#4682B4'
  if (year < 1900) return '#6495ED'
  return '#708090'
}

function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BC`
  if (year === 0) return '1 AD'
  return `${year} AD`
}

function selectScenario(id: string) {
  emit('select', id)
  const marker = markers.get(id)
  if (marker && map) {
    map.flyTo(marker.getLatLng(), 5, { duration: 1.2 })
    markers.forEach((m: any, mid: string) => {
      m.setStyle({
        radius: mid === id ? 10 : 7,
        weight: mid === id ? 3 : 2,
        opacity: mid === id ? 1 : 0.7,
      })
    })
  }
}

// Watch for external selection changes (from sidebar clicks)
watch(() => props.selectedId, (id) => {
  if (id) selectScenario(id)
})

onMounted(async () => {
  if (!mapContainer.value) return

  const [{ default: L }] = await Promise.all([
    import('leaflet'),
    import('leaflet/dist/leaflet.css'),
  ])

  map = L.map(mapContainer.value, {
    center: [25, 30],
    zoom: 3,
    minZoom: 2,
    maxZoom: 7,
    zoomControl: false,
    attributionControl: false,
    worldCopyJump: true,
  })

  const tileConfig = getTileConfig()
  L.tileLayer(tileConfig.url, {
    subdomains: tileConfig.subdomains,
    className: tileConfig.className,
    maxZoom: 19,
  }).addTo(map)

  for (const scenario of BUILT_IN_SCENARIOS) {
    const { lat, lng } = scenario.birthInfo.location.coordinates
    const color = getEraColor(scenario.birthInfo.birthYear)

    // Outer glow ring
    L.circleMarker([lat, lng], {
      radius: 16,
      fillColor: color,
      fillOpacity: 0.12,
      color: color,
      weight: 1,
      opacity: 0.3,
      className: 'marker-glow',
    }).addTo(map)

    // Main marker
    const marker = L.circleMarker([lat, lng], {
      radius: 7,
      fillColor: color,
      fillOpacity: 0.85,
      color: '#e8e6e3',
      weight: 2,
      opacity: 0.7,
    }).addTo(map)

    // Tooltip
    marker.bindTooltip(
      `<div class="map-tooltip">${scenario.birthInfo.name}<br/><span class="tooltip-year">${formatYear(scenario.birthInfo.birthYear)}</span></div>`,
      { direction: 'top', offset: [0, -12], className: 'custom-tooltip' }
    )

    marker.on('click', () => selectScenario(scenario.id))
    markers.set(scenario.id, marker)
  }
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})

defineExpose({ selectScenario })
</script>

<style scoped>
.leaflet-map {
  position: absolute;
  inset: 0;
  z-index: 1;
}
</style>

<style>
/* Darken light AMap tiles so the Chinese basemap keeps the dark map aesthetic */
.tile-zh img {
  filter: invert(0.92) hue-rotate(180deg) saturate(0.45) brightness(0.85) contrast(0.92);
}
</style>
