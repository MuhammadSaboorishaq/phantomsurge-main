import { lazy, Suspense, type ReactNode } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext'
import { SiteProvider } from '@/context/SiteContext'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import { ErrorBoundary } from '@/components/ui/ErrorState'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { ScrollToTop } from '@/components/layout/ScrollToTop'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PageLoader } from '@/components/layout/PageLoader'
import { ADMIN_ROUTES, SITE_ROUTES } from '@/lib/constants'

const Home = lazy(() => import('@/pages/Home'))
const Work = lazy(() => import('@/pages/Work'))
const WorkDetail = lazy(() => import('@/pages/WorkDetail'))
const Services = lazy(() => import('@/pages/Services'))
const About = lazy(() => import('@/pages/About'))
const Contact = lazy(() => import('@/pages/Contact'))
const Blog = lazy(() => import('@/pages/Blog'))
const BlogDetail = lazy(() => import('@/pages/BlogDetail'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const AdminLogin = lazy(() => import('@/pages/admin/Login'))
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'))
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage'))
const ThemeEditor = lazy(() => import('@/pages/admin/ThemeEditor'))
const PortfolioList = lazy(() => import('@/pages/admin/PortfolioList'))
const PortfolioForm = lazy(() => import('@/pages/admin/PortfolioForm'))
const ServicesAdmin = lazy(() => import('@/pages/admin/ServicesAdmin'))
const TeamAdmin = lazy(() => import('@/pages/admin/TeamAdmin'))
const TestimonialsAdmin = lazy(() => import('@/pages/admin/TestimonialsAdmin'))
const BlogAdmin = lazy(() => import('@/pages/admin/BlogAdmin'))
const BlogForm = lazy(() => import('@/pages/admin/BlogForm'))
const Messages = lazy(() => import('@/pages/admin/Messages'))

function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <SiteProvider>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </SiteProvider>
    </ErrorBoundary>
  )
}

export default function App() {
  return (
    <AppProviders>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path={SITE_ROUTES.home} element={<Home />} />
            <Route path={SITE_ROUTES.work} element={<Work />} />
            <Route path="/work/:slug" element={<WorkDetail />} />
            <Route path={SITE_ROUTES.services} element={<Services />} />
            <Route path={SITE_ROUTES.about} element={<About />} />
            <Route path={SITE_ROUTES.contact} element={<Contact />} />
            <Route path={SITE_ROUTES.blog} element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path={ADMIN_ROUTES.root} element={<AdminLogin />} />
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ADMIN_ROUTES.dashboard} element={<Dashboard />} />
            <Route path={ADMIN_ROUTES.settings} element={<SettingsPage />} />
            <Route path={ADMIN_ROUTES.theme} element={<ThemeEditor />} />
            <Route path={ADMIN_ROUTES.portfolio} element={<PortfolioList />} />
            <Route path={ADMIN_ROUTES.portfolioNew} element={<PortfolioForm />} />
            <Route path="/admin/portfolio/:id" element={<PortfolioForm />} />
            <Route path={ADMIN_ROUTES.services} element={<ServicesAdmin />} />
            <Route path={ADMIN_ROUTES.team} element={<TeamAdmin />} />
            <Route path={ADMIN_ROUTES.testimonials} element={<TestimonialsAdmin />} />
            <Route path={ADMIN_ROUTES.blog} element={<BlogAdmin />} />
            <Route path={ADMIN_ROUTES.blogNew} element={<BlogForm />} />
            <Route path="/admin/blog/:id" element={<BlogForm />} />
            <Route path={ADMIN_ROUTES.messages} element={<Messages />} />
          </Route>
        </Routes>
      </Suspense>
    </AppProviders>
  )
}
