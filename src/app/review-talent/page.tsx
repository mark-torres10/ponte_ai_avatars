import { Metadata } from 'next'
import AdminTalentReview from '@/components/AdminTalentReview'

export const metadata: Metadata = {
  title: 'Talent Review Dashboard - Admin',
  description: 'Admin dashboard for reviewing and managing talent applications',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ReviewTalentPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminTalentReview />
    </div>
  )
} 