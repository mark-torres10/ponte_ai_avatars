import { type TalentProfile } from '@/types/talent'

// Mock data for development - replace with actual API calls
export const mockTalentData: TalentProfile[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0123',
    location: 'New York, NY',
    status: 'submitted',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    submittedAt: '2024-01-20T14:45:00Z',
    toneCategories: ['Professional', 'Friendly'],
    personalityTraits: {
      extroversion: 75,
      formality: 60,
      energy: 80,
      professionalism: 85
    },
    customTone: 'Warm and approachable professional'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1-555-0456',
    location: 'San Francisco, CA',
    status: 'approved',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-18T16:20:00Z',
    submittedAt: '2024-01-15T11:30:00Z',
    approvedAt: '2024-01-18T16:20:00Z',
    toneCategories: ['Corporate', 'Technical'],
    personalityTraits: {
      extroversion: 45,
      formality: 85,
      energy: 60,
      professionalism: 90
    },
    customTone: 'Clear and precise technical communicator'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1-555-0789',
    location: 'Miami, FL',
    status: 'active',
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-25T10:15:00Z',
    submittedAt: '2024-01-08T13:45:00Z',
    approvedAt: '2024-01-12T09:30:00Z',
    activatedAt: '2024-01-25T10:15:00Z',
    toneCategories: ['Casual', 'Energetic'],
    personalityTraits: {
      extroversion: 90,
      formality: 30,
      energy: 95,
      professionalism: 70
    },
    customTone: 'High-energy and engaging presenter'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@email.com',
    phone: '+1-555-0321',
    location: 'Seattle, WA',
    status: 'draft',
    createdAt: '2024-01-22T15:20:00Z',
    updatedAt: '2024-01-22T15:20:00Z',
    toneCategories: ['Academic', 'Thoughtful'],
    personalityTraits: {
      extroversion: 35,
      formality: 75,
      energy: 50,
      professionalism: 80
    },
    customTone: 'Thoughtful and analytical speaker'
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    phone: '+1-555-0654',
    location: 'Chicago, IL',
    status: 'rejected',
    createdAt: '2024-01-12T12:00:00Z',
    updatedAt: '2024-01-19T17:30:00Z',
    submittedAt: '2024-01-16T14:20:00Z',
    rejectionReason: 'Incomplete media uploads and poor audio quality',
    toneCategories: ['Conversational', 'Relatable'],
    personalityTraits: {
      extroversion: 65,
      formality: 40,
      energy: 70,
      professionalism: 60
    },
    customTone: 'Relatable and conversational tone'
  }
] 