import { ref } from 'vue'

export type ActiveControlForm = 'person' | 'company' | 'project'

export const activeControlForm = ref<ActiveControlForm>('person')

export const isControlFormModalOpen = ref(false)

export function setActiveControlForm(form: ActiveControlForm) {
  activeControlForm.value = form
}

export function openControlFormModal() {
  isControlFormModalOpen.value = true
}

export function closeControlFormModal() {
  isControlFormModalOpen.value = false
}
