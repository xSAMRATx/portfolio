import { adminApi } from '../../api/client'
import type { Education, EducationInput } from '../../api/types'
import CrudManager, { type Field } from './CrudManager'

const fields: Field<EducationInput>[] = [
  { name: 'type', label: 'Type', type: 'select', options: ['degree', 'training'] },
  { name: 'title', label: 'Title', type: 'text', required: true, hint: 'Degree or course name' },
  { name: 'institution', label: 'Institution', type: 'text', required: true },
  { name: 'period', label: 'Period', type: 'text', hint: 'e.g. 2023 or Jun – Sep 2023' },
  { name: 'result', label: 'Result', type: 'text', hint: 'e.g. CGPA 3.90' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'order', label: 'Sort order', type: 'number', min: 0, hint: 'Lower numbers come first.' },
]

export default function AdminEducations() {
  return (
    <CrudManager<Education, EducationInput>
      title="Education & training"
      singular="Entry"
      description="Degrees and training courses."
      api={adminApi.educations}
      fields={fields}
      empty={{ type: 'degree', title: '', institution: '', period: '', result: '', description: '', order: 0 }}
      toForm={({ id: _id, ...rest }) => rest}
      summary={(e) => ({ primary: e.title, secondary: [e.institution, e.period].filter(Boolean).join(' · '), badge: e.type === 'training' ? 'Training' : 'Degree' })}
    />
  )
}
