import { ref } from 'vue'

export type ActiveControlForm = 'person' | 'company' | 'project'

export const activeControlForm = ref<ActiveControlForm>('person')

export function setActiveControlForm(form: ActiveControlForm) {
  activeControlForm.value = form
}
