<script setup lang="ts">
import { projectCardForm } from '@/pages/control-panel/model/controlPanelForms'
import { syncProjectCardToGraph } from '@/pages/control-panel/model/syncGraphCardFromForm'
import ControlFormShell from '@/pages/control-panel/ui/ControlFormShell.vue'
</script>

<template>
  <ControlFormShell
    title="Создание и редактирование карточки проекта"
    title-id="project-card-title"
    @edit="syncProjectCardToGraph"
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
    </div>
  </ControlFormShell>
</template>
