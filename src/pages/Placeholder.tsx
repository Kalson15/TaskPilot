import { MainLayout } from '@/components/layout/MainLayout'

export function Analytics() {
  return (
    <MainLayout title="Analytics" subtitle="Track your productivity">
      <div className="card text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
        <p className="text-text-secondary">
          Coming soon - Advanced analytics and insights
        </p>
      </div>
    </MainLayout>
  )
}

export function Teams() {
  return (
    <MainLayout title="Teams" subtitle="Collaborate with your team">
      <div className="card text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Team Management</h2>
        <p className="text-text-secondary">
          Coming soon - Team collaboration features
        </p>
      </div>
    </MainLayout>
  )
}

export function Documents() {
  return (
    <MainLayout title="Documents" subtitle="Manage your files">
      <div className="card text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Document Management</h2>
        <p className="text-text-secondary">
          Coming soon - File attachments and document storage
        </p>
      </div>
    </MainLayout>
  )
}

export function Settings() {
  return (
    <MainLayout title="Settings" subtitle="Manage your preferences">
      <div className="card text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <p className="text-text-secondary">
          Coming soon - Account settings and preferences
        </p>
      </div>
    </MainLayout>
  )
}
