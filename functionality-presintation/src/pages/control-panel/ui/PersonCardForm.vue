<script setup lang="ts">
import { computed } from 'vue'

import { personCardForm } from '@/pages/control-panel/model/controlPanelForms'
import { syncPersonCardToGraph } from '@/pages/control-panel/model/syncGraphCardFromForm'
import ConfigFieldsHint from '@/pages/control-panel/ui/ConfigFieldsHint.vue'
import ConnectionsField from '@/pages/control-panel/ui/ConnectionsField.vue'
import ControlFormShell from '@/pages/control-panel/ui/ControlFormShell.vue'
import { formatRuPhone, parseRuPhoneDigits } from '@/shared/lib/phoneMask'

const emit = defineEmits<{
  saved: []
}>()

const phoneMasked = computed({
  get: () => formatRuPhone(personCardForm.phone),
  set: (value: string) => {
    const digits = parseRuPhoneDigits(value)
    personCardForm.phone = digits ? formatRuPhone(digits) : ''
  },
})

function savePersonCard() {
  syncPersonCardToGraph()
  emit('saved')
}
</script>

<template>
  <ControlFormShell
    title="Создание и редактирование карточки человека"
    title-id="person-card-title"
    @edit="savePersonCard"
  >
    <div class="control-form__grid">
      <label class="control-form__field">
        <span class="control-form__label">ФИО</span>
        <input
          v-model="personCardForm.fullName"
          class="control-form__input"
          type="text"
          autocomplete="name"
        />
      </label>

      <label class="control-form__field">
        <span class="control-form__label">ИНН</span>
        <input
          v-model.number="personCardForm.inn"
          class="control-form__input"
          type="number"
          inputmode="numeric"
        />
      </label>

      <label class="control-form__field">
        <span class="control-form__label">Телефон</span>
        <input
          v-model="phoneMasked"
          class="control-form__input"
          type="tel"
          inputmode="tel"
          autocomplete="tel"
          placeholder="+7 (___) ___-__-__"
        />
      </label>

      <label class="control-form__field">
        <span class="control-form__label">Почта</span>
        <input
          v-model="personCardForm.email"
          class="control-form__input"
          type="email"
          autocomplete="email"
        />
      </label>

      <ConnectionsField v-model="personCardForm.connections" />

      <label class="control-form__field">
        <span class="control-form__label">Описание</span>
        <textarea
          v-model="personCardForm.description"
          class="control-form__input control-form__input--textarea"
          rows="3"
          placeholder="Краткое описание человека"
        />
      </label>

      <ConfigFieldsHint
        kind="person"
        :description="personCardForm.description"
      />
    </div>
  </ControlFormShell>
</template>
