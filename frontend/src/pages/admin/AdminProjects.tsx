import { adminApi } from '../../api/client'
import type { Project, ProjectInput } from '../../api/types'
import CrudManager, { type Field } from './CrudManager'

const fields: Field<ProjectInput>[] = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
  { name: 'tech_stack', label: 'Tech stack', type: 'tags' },
  { name: 'image_url', label: 'Image URL', type: 'url' },
  { name: 'github_url', label: 'GitHub URL', type: 'url' },
  { name: 'live_url', label: 'Live URL', type: 'url' },
  { name: 'order', label: 'Sort order', type: 'number' },
  { name: 'featured', label: 'Featured', type: 'checkbox' },
]

const empty: ProjectInput = { title: '', description: '', tech_stack: [], image_url: null, github_url: null, live_url: null, featured: false, order: 0 }

export default function AdminProjects() {
  return (
    <CrudManager<Project, ProjectInput>
      title="Projects"
      api={adminApi.projects}
      fields={fields}
      empty={empty}
      toForm={({ id: _id, ...rest }) => rest}
      summary={(p) => ({ primary: p.title, secondary: p.tech_stack.join(' · ') })}
    />
  )
}
