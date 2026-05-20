<script setup lang="ts">
import { companyCardForm } from '@/pages/control-panel/model/controlPanelForms'
import { syncCompanyCardToGraph } from '@/pages/control-panel/model/syncGraphCardFromForm'
// import ConfigFieldsHint from '@/pages/control-panel/ui/ConfigFieldsHint.vue'
import ConnectionsField from '@/pages/control-panel/ui/ConnectionsField.vue'
import ControlFormShell from '@/pages/control-panel/ui/ControlFormShell.vue'

const emit = defineEmits<{
  saved: []
}>()

function saveCompanyCard() {
  syncCompanyCardToGraph()
  emit('saved')
}
</script>

<template>
  <ControlFormShell
    title="Создание и редактирование карточки компании"
    title-id="company-card-title"
    @edit="saveCompanyCard"
  >
    <div class="control-form__grid">
      <label class="control-form__field">
        <span class="control-form__label">Название</span>
        <input
          v-model="companyCardForm.name"
          class="control-form__input"
          type="text"
        />
      </label>

      <label class="control-form__field">
        <span class="control-form__label">ИНН</span>
        <input
          v-model.number="companyCardForm.inn"
          class="control-form__input"
          type="number"
          inputmode="numeric"
        />
      </label>

      <label class="control-form__field">
        <span class="control-form__label">Адрес</span>
        <input
          v-model="companyCardForm.address"
          class="control-form__input"
          type="text"
        />
      </label>

      <ConnectionsField v-model="companyCardForm.connections" />

      <label class="control-form__field">
        <span class="control-form__label">Описание</span>
        <textarea
          v-model="companyCardForm.description"
          class="control-form__input control-form__input--textarea"
          rows="3"
          placeholder="Краткое описание компании"
        />
      </label>

      <!-- <ConfigFieldsHint
        kind="company"
        :description="companyCardForm.description"
      /> -->
    </div>
  </ControlFormShell>
</template>
