<script setup lang="ts">
defineProps<{
  title: string
  titleId: string
}>()

const emit = defineEmits<{
  edit: []
}>()
</script>

<template>
  <section class="control-form" :aria-labelledby="titleId">
    <h2 :id="titleId" class="control-form__title">
      {{ title }}
    </h2>

    <div class="control-form__body">
      <slot />
    </div>

    <footer class="control-form__footer">
      <button
        class="control-form__edit"
        type="button"
        @click="emit('edit')"
      >
        Применить
      </button>
    </footer>
  </section>
</template>
