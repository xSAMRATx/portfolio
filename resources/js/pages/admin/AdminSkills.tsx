import { adminApi } from '../../api/client'
import type { Skill, SkillInput } from '../../api/types'
import CrudManager, { type Field } from './CrudManager'

const fields: Field<SkillInput>[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'category', label: 'Category', type: 'select', options: ['languages', 'frameworks', 'backend', 'tools', 'other'] },
  { name: 'level', label: 'Level (0–100)', type: 'number', min: 0, max: 100, hint: 'Leave empty to show the skill as a tag.' },
]

export default function AdminSkills() {
  return (
    <CrudManager<Skill, SkillInput>
      title="Skills"
      singular="Skill"
      description="Grouped by category on the site."
      api={adminApi.skills}
      fields={fields}
      empty={{ name: '', category: 'frameworks', level: null }}
      toForm={({ id: _id, ...rest }) => rest}
      summary={(s) => ({ primary: s.name, secondary: s.level === null ? s.category : `${s.category} · ${s.level}%` })}
    />
  )
}
