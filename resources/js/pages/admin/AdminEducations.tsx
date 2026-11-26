import { adminApi } from '../../api/client'
import type { Education, EducationInput } from '../../api/types'
import CrudManager, { type Field } from './CrudManager'

const fields: Field<EducationInput>[] = [
  { name: 'type', label: 'Type', type: 'select', options: ['degree', 'training'] },
  { name: 'title', label: 'Title (degree / course)', type: 'text', required: true },
  { name: 'institution', label: 'Institution', type: 'text', required: true },
  { name: 'period', label: 'Period (e.g. 2023 or Jun – Sep 2023)', type: 'text' },
  { name: 'result', label: 'Result (e.g. CGPA 3.90)', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'order', label: 'Sort order', type: 'number' },
]

export default function AdminEducations() {
  return (
    <CrudManager<Education, EducationInput>
      title="Education & training"
      api={adminApi.educations}
      fields={fields}
      empty={{ type: 'degree', title: '', institution: '', period: '', result: '', description: '', order: 0 }}
      toForm={({ id: _id, ...rest }) => rest}
      summary={(e) => ({ primary: e.title, secondary: [e.institution, e.period].filter(Boolean).join(' · ') })}
    />
  )
}
