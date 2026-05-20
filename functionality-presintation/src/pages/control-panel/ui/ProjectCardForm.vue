<script setup lang="ts">
import { projectCardForm } from '@/pages/control-panel/model/controlPanelForms'
import { syncProjectCardToGraph } from '@/pages/control-panel/model/syncGraphCardFromForm'
import ConfigFieldsHint from '@/pages/control-panel/ui/ConfigFieldsHint.vue'
import ControlFormShell from '@/pages/control-panel/ui/ControlFormShell.vue'

const emit = defineEmits<{
  saved: []
}>()

function saveProjectCard() {
  syncProjectCardToGraph()
  emit('saved')
}
</script>

<template>
  <ControlFormShell
    title="Создание и редактирование карточки проекта"
    title-id="project-card-title"
    @edit="saveProjectCard"
  >
    <div class="control-form__grid">
      <label class="control-form__field">
        <span class="control-form__label">Название</span>
        <input
          v-model="projectCardForm.name"
          class="control-form__input"
          type="text"
        />
      </label>

      <label class="control-form__field">
        <span class="control-form__label">Куратор проекта</span>
        <input
          v-model="projectCardForm.curator"
          class="control-form__input"
          type="text"
        />
      </label>

      <label class="control-form__field">
        <span class="control-form__label">Описание</span>
        <textarea
          v-model="projectCardForm.description"
          class="control-form__input control-form__input--textarea"
          rows="3"
          placeholder="Краткое описание проекта"
        />
      </label>

      <ConfigFieldsHint
        kind="project"
        :description="projectCardForm.description"
      />
    </div>
  </ControlFormShell>
</template>
