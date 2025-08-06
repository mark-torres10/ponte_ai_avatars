import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import HomePage from '@/app/page'
import TalentPage from '@/app/talent/page'
import ClientPage from '@/app/client/page'
import AdminPage from '@/app/admin/page'
import GenerateAvatarPage from '@/app/generate-avatar/page'
import LoginPage from '@/app/login/[[...rest]]/page'

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
  SignOutButton: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
  SignIn: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
  auth: jest.fn()
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn()
}))

// Mock API calls
global.fetch = jest.fn()

describe('Layout Restructure Tests', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: { role: 'admin' } })
    })
  })

  describe('Home Page Restructure', () => {
    it('should show only landing content without role-specific features', async () => {
      ;(useUser as jest.Mock).mockReturnValue({
        user: null,
        isLoaded: true
      })

      render(<HomePage />)

      // Should show landing content
      expect(screen.getByText('License Iconic Personalities as AI Avatars')).toBeInTheDocument()
      expect(screen.getByText('Get Started')).toBeInTheDocument()
      expect(screen.getByText('Watch Demo')).toBeInTheDocument()

      // Should NOT show role-specific dashboard content
      expect(screen.queryByText('Talent Dashboard')).not.toBeInTheDocument()
      expect(screen.queryByText('Client Dashboard')).not.toBeInTheDocument()
      expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument()
    })

    it('should show "Go to Dashboard" for authenticated users', async () => {
      ;(useUser as jest.Mock).mockReturnValue({
        user: { id: '123', emailAddresses: [{ emailAddress: 'test@example.com' }] },
        isLoaded: true
      })

      render(<HomePage />)

      expect(screen.getByText('Go to Dashboard')).toBeInTheDocument()
      expect(screen.queryByText('Get Started')).not.toBeInTheDocument()
    })
  })

  describe('Login Page', () => {
    it('should show dedicated login page with authentication components', () => {
      render(<LoginPage />)

      expect(screen.getByText('Welcome to Ponte AI')).toBeInTheDocument()
      expect(screen.getByText('Sign in to access your AI avatar marketplace')).toBeInTheDocument()

      // Should NOT show dashboard content
      expect(screen.queryByText('Talent Dashboard')).not.toBeInTheDocument()
      expect(screen.queryByText('Client Dashboard')).not.toBeInTheDocument()
    })
  })

  describe('Talent Page Onboarding', () => {
    it('should show talent onboarding wizard components', async () => {
      ;(useUser as jest.Mock).mockReturnValue({
        user: { id: '123', emailAddresses: [{ emailAddress: 'talent@example.com' }] },
        isLoaded: true
      })

      render(<TalentPage />)

      await waitFor(() => {
        expect(screen.getByText('Complete Your Talent Profile')).toBeInTheDocument()
        expect(screen.getByText('Set up your AI avatar profile to start receiving booking requests from brands.')).toBeInTheDocument()
      })

      // Should NOT show admin navigation
      expect(screen.queryByText('Client Dashboard')).not.toBeInTheDocument()
      expect(screen.queryByText('Generate Avatar')).not.toBeInTheDocument()
    })
  })

  describe('Client Page Onboarding', () => {
    it('should show client onboarding form components', async () => {
      ;(useUser as jest.Mock).mockReturnValue({
        user: { id: '123', emailAddresses: [{ emailAddress: 'client@example.com' }] },
        isLoaded: true
      })

      render(<ClientPage />)

      await waitFor(() => {
        expect(screen.getByText('Complete Your Client Profile')).toBeInTheDocument()
        expect(screen.getByText('Tell us about your company and project requirements to get started with AI avatar campaigns.')).toBeInTheDocument()
      })

      // Should show form fields
      expect(screen.getByLabelText('Company Name *')).toBeInTheDocument()
      expect(screen.getByLabelText('Industry *')).toBeInTheDocument()
      expect(screen.getByLabelText('Budget Range *')).toBeInTheDocument()
      expect(screen.getByLabelText('Project Type *')).toBeInTheDocument()

      // Should NOT show admin navigation
      expect(screen.queryByText('Client Dashboard')).not.toBeInTheDocument()
      expect(screen.queryByText('Generate Avatar')).not.toBeInTheDocument()
    })
  })

  describe('Admin Navbar', () => {
    it('should show admin navbar with navigation between client dashboard and avatar generation', async () => {
      ;(useUser as jest.Mock).mockReturnValue({
        user: { id: '123', emailAddresses: [{ emailAddress: 'admin@example.com' }] },
        isLoaded: true
      })

      render(<AdminPage />)

      await waitFor(() => {
        expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
        expect(screen.getByText('Client Dashboard')).toBeInTheDocument()
        expect(screen.getByText('Generate Avatar')).toBeInTheDocument()
      })
    })

    it('should allow switching between admin navbar tabs', async () => {
      ;(useUser as jest.Mock).mockReturnValue({
        user: { id: '123', emailAddresses: [{ emailAddress: 'admin@example.com' }] },
        isLoaded: true
      })

      render(<AdminPage />)

      await waitFor(() => {
        const clientDashboardTab = screen.getByText('Client Dashboard')
        const generateAvatarTab = screen.getByText('Generate Avatar')

        expect(clientDashboardTab).toBeInTheDocument()
        expect(generateAvatarTab).toBeInTheDocument()

        // Test tab switching
        fireEvent.click(generateAvatarTab)
        expect(generateAvatarTab).toHaveClass('border-primary')
      })
    })
  })

  describe('Generate Avatar Page', () => {
    it('should show avatar generation interface for admin users', async () => {
      ;(useUser as jest.Mock).mockReturnValue({
        user: { id: '123', emailAddresses: [{ emailAddress: 'admin@example.com' }] },
        isLoaded: true
      })

      render(<GenerateAvatarPage />)

      await waitFor(() => {
        expect(screen.getByText('Generate Avatar')).toBeInTheDocument()
        expect(screen.getByText('Watch our AI avatar technology in action and see how we create compelling content.')).toBeInTheDocument()
      })
    })

    it('should show admin navbar for admin users on generate avatar page', async () => {
      ;(useUser as jest.Mock).mockReturnValue({
        user: { id: '123', emailAddresses: [{ emailAddress: 'admin@example.com' }] },
        isLoaded: true
      })

      render(<GenerateAvatarPage />)

      await waitFor(() => {
        expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
        expect(screen.getByText('Client Dashboard')).toBeInTheDocument()
        expect(screen.getByText('Generate Avatar')).toBeInTheDocument()
      })
    })
  })

  describe('Route Protection', () => {
    it('should maintain route protection for unauthorized access', async () => {
      ;(useUser as jest.Mock).mockReturnValue({
        user: { id: '123', emailAddresses: [{ emailAddress: 'talent@example.com' }] },
        isLoaded: true
      })

      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { role: 'talent' } })
      })

      render(<TalentPage />)

      await waitFor(() => {
        expect(screen.getByText('Complete Your Talent Profile')).toBeInTheDocument()
      })

      // Should NOT show admin navigation
      expect(screen.queryByText('Client Dashboard')).not.toBeInTheDocument()
      expect(screen.queryByText('Generate Avatar')).not.toBeInTheDocument()
    })
  })

  describe('Navigation State Management', () => {
    it('should maintain navigation state for admin navbar', async () => {
      ;(useUser as jest.Mock).mockReturnValue({
        user: { id: '123', emailAddresses: [{ emailAddress: 'admin@example.com' }] },
        isLoaded: true
      })

      render(<AdminPage />)

      await waitFor(() => {
        const clientDashboardTab = screen.getByText('Client Dashboard')
        const generateAvatarTab = screen.getByText('Generate Avatar')

        // Initial state should be client dashboard
        expect(clientDashboardTab).toHaveClass('border-primary')

        // Switch to generate avatar
        fireEvent.click(generateAvatarTab)
        expect(generateAvatarTab).toHaveClass('border-primary')
        expect(clientDashboardTab).not.toHaveClass('border-primary')

        // Switch back to client dashboard
        fireEvent.click(clientDashboardTab)
        expect(clientDashboardTab).toHaveClass('border-primary')
        expect(generateAvatarTab).not.toHaveClass('border-primary')
      })
    })
  })

  describe('Page Transitions', () => {
    it('should handle smooth page transitions', async () => {
      ;(useUser as jest.Mock).mockReturnValue({
        user: { id: '123', emailAddresses: [{ emailAddress: 'test@example.com' }] },
        isLoaded: true
      })

      render(<HomePage />)

      // Should show loading states appropriately
      expect(screen.getByText('License Iconic Personalities as AI Avatars')).toBeInTheDocument()

      // Test navigation links work
      const getStartedLink = screen.getByText('Get Started')
      expect(getStartedLink).toBeInTheDocument()
      expect(getStartedLink.closest('a')).toHaveAttribute('href', '/login')
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      ;(useUser as jest.Mock).mockReturnValue({
        user: { id: '123', emailAddresses: [{ emailAddress: 'test@example.com' }] },
        isLoaded: true
      })

      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'))

      render(<TalentPage />)

      await waitFor(() => {
        expect(screen.getByText('Failed to load user data')).toBeInTheDocument()
      })
    })

    it('should show loading states during data fetching', async () => {
      ;(useUser as jest.Mock).mockReturnValue({
        user: { id: '123', emailAddresses: [{ emailAddress: 'test@example.com' }] },
        isLoaded: true
      })

      // Mock a slow API response
      ;(global.fetch as jest.Mock).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, data: { role: 'talent' } })
        }), 100))
      )

      render(<TalentPage />)

      // Should show loading state initially
      expect(screen.getByText('Loading your talent onboarding...')).toBeInTheDocument()
    })
  })
}) 