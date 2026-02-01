import { Search, Bell, Mail, Menu } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  title?: string
  subtitle?: string
  onMenuClick: () => void
}

export function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const { user } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        {/*Left: menu button (moble) + title search*/}
        <div className='flex items-center gap-4 flex-1'>
          {/*mobile menu button*/}
          <button
           onClick={onMenuClick}
           className='p-2 lg:hidden hover:bg-gray-100 rounded-lg transition-colors'
          >
            <Menu className='w-6 h-6 text-gray-600' />
          </button>
          {title ? (
            <div>
              <h1 className="text-xl  lg:text-2xl font-bold text-text-primary">{title}</h1>
              {subtitle && (
                <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
              )}
            </div>
          ) : (
            <div className="relative max-w-md flex-1 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          )}
        </div>
        
        
          
        

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Project time tracker button -icon only on  mobile*/}
          <button className=" md:flex  px-2 lg:px-4 py-1 bg-primary text-sidebar rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2 text-sm lg:text-base">
            <span className='md:inline hidden'>Project Tracker</span>
            
            <div className="w-5 h-4 lg:w-6 lg:h-6 bg-white rounded flex items-center justify-center">
              <span className="text-primary text-xs">▶</span>
            </div>
          </button>

          {/* Icons hidden on very small screens*/}
          <button className=" hidden sm:block p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button className=" hidden sm:block p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Mail className="w-5 h-5 text-gray-600" />
          </button>

          {/* Profile -always visible*/}
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="lg:w-10 lg:h-10 w-8 h-8 bg-gradient-to-br from-primary to-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xs  lg:text-sm">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-sm hidden md:block">
              <p className="font-medium text-text-primary">
                {user?.user_metadata?.full_name || 'User'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
