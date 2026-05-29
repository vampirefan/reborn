<template>
  <div class="narrative-display" @click="skipTypewriter">
    <div class="narrative-text">
      <span class="text-content">{{ displayedText }}</span>
      <span v-if="isTyping" class="cursor">|</span>
    </div>
    <div v-if="isTyping" class="skip-hint">
      {{ $t('game.clickToContinue') }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  text: string
  speed: 'slow' | 'normal' | 'fast' | 'instant'
}>()

const emit = defineEmits<{
  complete: []
}>()

const displayedText = ref('')
const isTyping = ref(false)
let typeInterval: ReturnType<typeof setInterval> | null = null

const speedMap = {
  slow: 60,
  normal: 35,
  fast: 15,
  instant: 0,
}

function startTypewriter() {
  if (typeInterval) {
    clearInterval(typeInterval)
  }

  if (props.speed === 'instant') {
    displayedText.value = props.text
    isTyping.value = false
    emit('complete')
    return
  }

  displayedText.value = ''
  isTyping.value = true
  let index = 0

  typeInterval = setInterval(() => {
    if (index < props.text.length) {
      displayedText.value += props.text[index]
      index++
    }
    else {
      if (typeInterval) clearInterval(typeInterval)
      isTyping.value = false
      emit('complete')
    }
  }, speedMap[props.speed])
}

function skipTypewriter() {
  if (isTyping.value) {
    if (typeInterval) clearInterval(typeInterval)
    displayedText.value = props.text
    isTyping.value = false
    emit('complete')
  }
}

watch(() => props.text, () => {
  startTypewriter()
})

onMounted(() => {
  if (props.text) {
    startTypewriter()
  }
})

onUnmounted(() => {
  if (typeInterval) clearInterval(typeInterval)
})
</script>

<style scoped>
.narrative-display {
  position: relative;
  cursor: pointer;
}

.narrative-text {
  font-size: var(--font-size-narrative);
  line-height: 1.9;
  color: var(--color-text-primary);
  letter-spacing: 0.02em;
}

.cursor {
  animation: blink 1s step-end infinite;
  color: var(--color-accent);
  font-weight: 300;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.skip-hint {
  position: absolute;
  bottom: -1.5rem;
  right: 0;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  opacity: 0.6;
}
</style>
