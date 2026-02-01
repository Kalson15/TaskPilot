import { ReactNode, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface MainLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={()=> setIsSidebarOpen(false)} />
      <div className="lg:ml-64">
        <Header title={title} subtitle={subtitle} onMenuClick={()=> setIsSidebarOpen(true)} />
        <main className=" p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
