import { adminApi } from '../../api/client'
import type { Experience, ExperienceInput } from '../../api/types'
import CrudManager, { type Field } from './CrudManager'

const fields: Field<ExperienceInput>[] = [
  { name: 'company', label: 'Company', type: 'text', required: true },
  { name: 'role', label: 'Role', type: 'text', required: true },
  { name: 'start_date', label: 'Start date', type: 'date', required: true },
  { name: 'end_date', label: 'End date', type: 'date', hint: 'Leave empty if you still work here.' },
  { name: 'description', label: 'Description', type: 'textarea', hint: 'One achievement per line; each line becomes a bullet.' },
]

export default function AdminExperiences() {
  return (
    <CrudManager<Experience, ExperienceInput>
      title="Experience"
      singular="Job"
      description="Shown as a timeline, newest first."
      api={adminApi.experiences}
      fields={fields}
      empty={{ company: '', role: '', start_date: '', end_date: null, description: '' }}
      toForm={({ id: _id, is_current: _c, ...rest }) => rest}
      summary={(e) => ({ primary: `${e.role} @ ${e.company}`, secondary: `${e.start_date} → ${e.end_date ?? 'Present'}`, badge: e.is_current ? 'Current' : undefined })}
    />
  )
}
