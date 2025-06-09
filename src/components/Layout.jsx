import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="min-h-screen bg-background text-white max-w-full overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout