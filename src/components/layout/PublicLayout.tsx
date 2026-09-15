import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { PageTransition } from './PageTransition'
import { CustomCursor } from './CustomCursor'
import { ScrollProgress } from './ScrollProgress'
import { useSite } from '@/context/SiteContext'
import { MaintenanceScreen } from './MaintenanceScreen'

export function PublicLayout() {
  const { settings } = useSite()
  const previewMode = new URLSearchParams(window.location.search).get('preview') === 'true'

  if (settings.maintenanceMode && !previewMode) {
    return <MaintenanceScreen />
  }

  return (
    <div className="relative min-h-screen">
      <ScrollProgress />
      <CustomCursor />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-[var(--r-control)] focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:text-[#04110f]"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  )
}
