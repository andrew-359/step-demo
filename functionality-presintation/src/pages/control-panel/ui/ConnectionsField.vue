<script setup lang="ts">
import { ref } from 'vue'

import {
  CONNECTION_OPTIONS,
  createConnectionId,
  type ConnectionLink,
  type ConnectionOption,
  type GraphEntity,
} from '@/pages/control-panel/model/connections'
import ConnectionGraphModal from '@/pages/control-panel/ui/ConnectionGraphModal.vue'

const model = defineModel<ConnectionLink[]>({ required: true })

const isTypePickerOpen = ref(false)
const isGraphOpen = ref(false)
const pendingRelationType = ref<ConnectionOption | null>(null)

const relationTypeHints: Record<ConnectionOption, string> = {
  Компания: 'Юридическое лицо или контрагент',
  Человек: 'Физлицо, ЛПР или контакт',
  Проект: 'Объект, лот или инициатива',
  Контрагент: 'Внешний участник сделки',
  Партнёр: 'Партнёрский или совместный контур',
  'Дочерняя организация': 'Элемент структуры холдинга',
}

function openTypePicker() {
  isTypePickerOpen.value = true
}

function closeTypePicker() {
  isTypePickerOpen.value = false
}

function startGraph(relationType: ConnectionOption) {
  pendingRelationType.value = relationType
  isTypePickerOpen.value = false
  isGraphOpen.value = true
}

function closeGraph() {
  isGraphOpen.value = false
  pendingRelationType.value = null
}

function onEntitySelected(entity: GraphEntity) {
  if (!pendingRelationType.value) {
    return
  }

  const exists = model.value.some((link) => link.target.id === entity.id)

  if (!exists) {
    model.value = [
      ...model.value,
      {
        id: createConnectionId(),
        relationType: pendingRelationType.value,
        target: entity,
      },
    ]
  }

  closeGraph()
}

function removeConnection(index: number) {
  model.value = model.value.filter((_, itemIndex) => itemIndex !== index)
}
</script>

<template>
  <div class="connections-field">
    <div class="connections-field__label-row">
      <span class="control-form__label">Связи</span>
    </div>

    <div
      v-if="model.length === 0"
      class="connections-field__empty"
    >
      Нет выбранных связей
    </div>

    <div
      v-for="(link, index) in model"
      :key="link.id"
      class="connections-field__chip"
    >
      <div class="connections-field__chip-body">
        <span class="connections-field__chip-type">{{ link.relationType }}</span>
        <span class="connections-field__chip-target">{{ link.target.title }}</span>
        <span class="connections-field__chip-meta">{{ link.target.subtitle }}</span>
      </div>
      <button
        class="connections-field__remove"
        type="button"
        aria-label="Удалить"
        @click="removeConnection(index)"
      >
        ×
      </button>
    </div>

    <button
      class="connections-field__add-row"
      type="button"
      @click="openTypePicker"
    >
      Добавить связь
    </button>

    <Teleport to="body">
      <div
        v-if="isTypePickerOpen"
        class="relation-picker-backdrop"
        @click.self="closeTypePicker"
      >
        <section
          class="relation-picker"
          role="dialog"
          aria-labelledby="relation-picker-title"
          aria-describedby="relation-picker-desc"
        >
          <header class="relation-picker__header">
            <div class="relation-picker__intro">
              <p class="relation-picker__eyebrow">Шаг 1 · связь</p>
              <h3 id="relation-picker-title">Тип связи</h3>
            </div>
            <button
              class="relation-picker__close"
              type="button"
              aria-label="Закрыть"
              @click="closeTypePicker"
            >
              ×
            </button>
          </header>

          <p id="relation-picker-desc" class="relation-picker__lead">
            Укажите характер связи. На следующем шаге выберите сущность в графе
            людей, компаний или проектов.
          </p>

          <div class="relation-picker__options">
            <button
              v-for="option in CONNECTION_OPTIONS"
              :key="option"
              class="relation-picker__option"
              type="button"
              @click="startGraph(option)"
            >
              <span class="relation-picker__option-main">
                <span class="relation-picker__option-label">{{ option }}</span>
                <span class="relation-picker__option-hint">
                  {{ relationTypeHints[option] }}
                </span>
              </span>
              <span class="relation-picker__option-arrow" aria-hidden="true">→</span>
            </button>
          </div>

          <footer class="relation-picker__footer">
            <button
              class="relation-picker__cancel"
              type="button"
              @click="closeTypePicker"
            >
              Отмена
            </button>
          </footer>
        </section>
      </div>
    </Teleport>

    <ConnectionGraphModal
      v-if="isGraphOpen && pendingRelationType"
      mode="pick"
      :relation-type="pendingRelationType"
      @close="closeGraph"
      @select="onEntitySelected"
    />
  </div>
</template>
