import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart3,
  Users,
  FileText,
  Settings,
  Eye,
  X
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Teams', href: '/teams', icon: Users },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({isOpen, onClose}: SidebarProps) {
  const location = useLocation()

  return (
    <>
    {/* Mobile voerlay*/}
    {isOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
  )}

    {/*sidebar*/}
    <aside className={`w-64 bg-sidebar text-white flex flex-col h-screen fixed left-0 top-0 z-50
      transform transition-transform duration-300 ease-out lg:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/*mobile close button*/}
        <button onClick={onClose}
        
         className='lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white'
        >
          <X className="w-6 h-6" />
        </button>
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
        
           <Eye className="w-6 h-6 text-sidebar"  />
         
          
          
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map(item => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${
                  isActive
                    ? 'bg-sidebar-hover text-white'
                    : 'text-gray-400 hover:bg-sidebar-hover hover:text-white'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom branding */}
      <div className="p-6 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-700 rounded-full" />
          <div className="text-sm">
            <p className="font-medium">TaskPilot v0.1.0</p>
          </div>
        </div>
      </div>
    </aside>
    </>
  )
}
