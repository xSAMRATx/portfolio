import { adminApi } from '../../api/client'
import type { Experience, ExperienceInput } from '../../api/types'
import CrudManager, { type Field } from './CrudManager'

const fields: Field<ExperienceInput>[] = [
  { name: 'company', label: 'Company', type: 'text', required: true },
  { name: 'role', label: 'Role', type: 'text', required: true },
  { name: 'start_date', label: 'Start date', type: 'date', required: true },
  { name: 'end_date', label: 'End date (leave empty if current)', type: 'date' },
  { name: 'description', label: 'Description', type: 'textarea' },
]

export default function AdminExperiences() {
  return (
    <CrudManager<Experience, ExperienceInput>
      title="Experience"
      api={adminApi.experiences}
      fields={fields}
      empty={{ company: '', role: '', start_date: '', end_date: null, description: '' }}
      toForm={({ id: _id, is_current: _c, ...rest }) => rest}
      summary={(e) => ({ primary: `${e.role} @ ${e.company}`, secondary: `${e.start_date} → ${e.end_date ?? 'Present'}` })}
    />
  )
}
