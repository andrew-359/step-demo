import { reactive } from 'vue'

import { createEmptyConnections } from '@/pages/control-panel/model/connections'

export const personCardForm = reactive({
  fullName: '',
  inn: '' as number | '',
  phone: '',
  email: '',
  description: '',
  connections: createEmptyConnections(),
  editingEntityId: null as string | null,
})

export const companyCardForm = reactive({
  name: '',
  inn: '' as number | '',
  address: '',
  description: '',
  connections: createEmptyConnections(),
  editingEntityId: null as string | null,
})

export const projectCardForm = reactive({
  name: '',
  curator: '',
  description: '',
  editingEntityId: null as string | null,
})

export function resetPersonCardForm() {
  personCardForm.fullName = ''
  personCardForm.inn = ''
  personCardForm.phone = ''
  personCardForm.email = ''
  personCardForm.description = ''
  personCardForm.connections = createEmptyConnections()
  personCardForm.editingEntityId = null
}

export function resetCompanyCardForm() {
  companyCardForm.name = ''
  companyCardForm.inn = ''
  companyCardForm.address = ''
  companyCardForm.description = ''
  companyCardForm.connections = createEmptyConnections()
  companyCardForm.editingEntityId = null
}

export function resetProjectCardForm() {
  projectCardForm.name = ''
  projectCardForm.curator = ''
  projectCardForm.description = ''
  projectCardForm.editingEntityId = null
}
