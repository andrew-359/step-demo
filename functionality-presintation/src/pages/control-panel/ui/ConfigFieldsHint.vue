<script setup lang="ts">
import {
  generateFieldsFromDescription,
  getConfigFields,
  getFullCardNote,
  hasGeneratedTags,
  type ControlFormKind,
} from '@/pages/control-panel/model/formConfigFields'

const props = defineProps<{
  kind: ControlFormKind
  description: string
}>()
</script>

<template>
  <section class="config-fields" aria-label="Теги из описания">
    <div class="config-fields__top">
      <div>
        <p class="config-fields__eyebrow">
          {{ hasGeneratedTags(kind) ? 'AI нашел' : 'AI разберет описание' }}
        </p>
        <p class="config-fields__hint">
          {{
            hasGeneratedTags(kind)
              ? 'Факты можно хранить отдельно от свободного текста.'
              : 'Пока это свободный текст. Помощник выделит факты.'
          }}
        </p>
      </div>
      <button
        class="config-fields__action"
        type="button"
        @click="generateFieldsFromDescription(props.kind, props.description)"
      >
        Создать теги из описания
      </button>
    </div>

    <div class="config-fields__chips">
      <span
        v-for="field in getConfigFields(kind)"
        :key="`${field.label}-${field.generated ? 'generated' : 'base'}`"
        class="config-fields__chip"
        :class="{
          'config-fields__chip--locked': field.locked,
          'config-fields__chip--generated': field.generated,
        }"
      >
        <span v-if="field.locked" aria-hidden="true">🔒</span>
        {{ field.label }}
      </span>
    </div>

    <p class="config-fields__note">{{ getFullCardNote(kind) }}</p>
  </section>
</template>
