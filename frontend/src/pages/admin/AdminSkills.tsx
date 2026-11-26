import { adminApi } from '../../api/client'
import type { Skill, SkillInput } from '../../api/types'
import CrudManager, { type Field } from './CrudManager'

const fields: Field<SkillInput>[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'category', label: 'Category', type: 'select', options: ['backend', 'frontend', 'database', 'tools', 'other'] },
  { name: 'level', label: 'Level (0–100)', type: 'number' },
]

export default function AdminSkills() {
  return (
    <CrudManager<Skill, SkillInput>
      title="Skills"
      api={adminApi.skills}
      fields={fields}
      empty={{ name: '', category: 'backend', level: 80 }}
      toForm={({ id: _id, ...rest }) => rest}
      summary={(s) => ({ primary: s.name, secondary: `${s.category} · ${s.level}%` })}
    />
  )
}
