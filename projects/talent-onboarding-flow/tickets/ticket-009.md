# PON-47: Backend Integration and Supabase Setup

## Linear Issue
[View in Linear](https://linear.app/metresearch/issue/PON-47/backend-integration-and-supabase-setup)

## Context & Motivation
Implement the complete backend integration with Supabase to enable data persistence, file storage, and email notifications for the talent onboarding system.

## Functional Requirements
- Design and implement Supabase database schema
- Create API endpoints for talent CRUD operations
- Integrate file storage with Supabase Storage
- Implement email notification system with multiple templates
- Connect frontend to backend APIs
- Add data persistence and state management
- Create admin email configuration system
- Implement status change notifications to talent
- Ensure headshots are stored as URLs only (no base64 in database)

## Non-functional Requirements
- Reliable database operations
- Fast API response times
- Secure file storage
- Reliable email delivery
- Scalable architecture
- No large base64 blobs in database

## Success Criteria
- Database schema supports all talent data
- API endpoints handle all CRUD operations
- File storage works reliably with Supabase
- Email notifications are delivered successfully
- Frontend-backend integration is seamless
- Data persistence works across sessions
- Admin email configuration is flexible
- Headshots stored as URLs, base64 handled transiently

## Test Plan
- Test all API endpoints with various data
- Verify database schema supports all requirements
- Test file upload and storage operations
- Validate email notification delivery
- Test frontend-backend integration
- Verify data persistence and state management
- Test admin email configuration
- Verify no base64 data in database

## Dependencies
- Supabase project setup
- Email service integration
- API development framework

## Suggested Implementation Plan
1. Design Supabase database schema (URLs only for media)
2. Create API endpoints for talent operations
3. Integrate Supabase Storage for files
4. Implement email notification system
5. Connect frontend to backend APIs
6. Add data persistence and state management
7. Create admin email configuration
8. Test complete integration
9. Verify no base64 persistence in database

## Effort Estimate
3-4 days

## Priority & Impact
High Priority - Enables production functionality

## Acceptance Checklist
- [ ] Database schema supports all requirements
- [ ] API endpoints handle all operations
- [ ] File storage integration works
- [ ] Email notifications are delivered
- [ ] Frontend-backend integration is complete
- [ ] Data persistence works reliably
- [ ] Admin email configuration is functional
- [ ] No base64 data stored in database

## Links & References
- [Project Spec](../spec.md)
- [Supabase Documentation](https://supabase.com/docs)

## Detailed Interface Analysis for Supabase Persistence

### Overview of Interfaces from Previous Tickets

Based on the analysis of tickets PON-39 through PON-46, the following interfaces need to be persisted to Supabase:

### 1. Core Talent Profile Interface (PON-39, PON-40, PON-41, PON-42)

**Source**: `src/types/talent.ts` - `TalentProfile` interface

**Data Structure**:
```typescript
interface TalentProfile {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  status: TalentStatus // 'draft' | 'submitted' | 'approved' | 'active' | 'inactive' | 'rejected'
  createdAt: string
  updatedAt: string
  submittedAt?: string
  approvedAt?: string
  activatedAt?: string
  
  // Media (URLs only, no base64)
  headshots?: string[] // Array of Supabase Storage URLs
  videoSample?: string // Single Supabase Storage URL
  
  // Personality & Tone
  toneCategories?: string[]
  personalityTraits?: {
    extroversion: number // 0-100
    formality: number // 0-100
    energy: number // 0-100
    professionalism: number // 0-100
  }
  customTone?: string
  
  // Interview
  predefinedAnswers?: Record<string, string>
  freeformText?: string
  freeformAudio?: string // Supabase Storage URL
  
  // Admin notes
  adminNotes?: string
  rejectionReason?: string
}
```

### 2. Onboarding Progress Interface (PON-43)

**Source**: `src/lib/storage.ts` - `OnboardingProgress` and `OnboardingDraft` interfaces

**Data Structure**:
```typescript
interface OnboardingProgress {
  currentStep: number
  completedSteps: number[]
  lastActivity: number
  sessionId: string
  isComplete: boolean
}

interface OnboardingDraft {
  formData: Record<string, unknown>
  progress: OnboardingProgress
  timestamp: number
  version: string
}
```

### 3. Admin Management Interfaces (PON-44, PON-45)

**Source**: `src/types/talent.ts` - Additional admin interfaces

**Data Structure**:
```typescript
interface TalentTableFilters {
  search: string
  status: TalentStatus | 'all'
  dateRange: {
    start: string
    end: string
  }
}

interface BulkOperation {
  type: 'approve' | 'reject' | 'delete' | 'activate' | 'deactivate'
  talentIds: string[]
  reason?: string
}
```

### 4. Form Data Schema (PON-39 through PON-42)

**Source**: `src/components/OnboardingWizard.tsx` - `onboardingSchema`

**Data Structure**:
```typescript
const onboardingSchema = z.object({
  basicInfo: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),
    location: z.string().optional(),
  }),
  media: z.object({
    headshots: z.array(z.any()).optional(), // File objects during upload
    videoSample: z.any().optional(), // File object during upload
  }).optional(),
  personality: z.object({
    toneCategories: z.array(z.string()).optional(),
    personalityTraits: z.object({
      extroversion: z.number().min(0).max(100),
      formality: z.number().min(0).max(100),
      energy: z.number().min(0).max(100),
      professionalism: z.number().min(0).max(100),
    }),
    customTone: z.string().optional(),
  }),
  interview: z.object({
    predefinedAnswers: z.record(z.string(), z.string()).optional(),
    freeformText: z.string().optional(),
    freeformAudio: z.string().optional(), // File object during upload
  }),
})
```

## Supabase Database Schema Design

### 1. Main Talent Profiles Table

```sql
-- Main talent profiles table
CREATE TABLE talent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  location VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'active', 'inactive', 'rejected')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  activated_at TIMESTAMP WITH TIME ZONE,
  
  -- Media URLs (no base64)
  headshot_urls TEXT[], -- Array of Supabase Storage URLs
  video_sample_url TEXT, -- Single Supabase Storage URL
  freeform_audio_url TEXT, -- Supabase Storage URL
  
  -- Personality & Tone
  tone_categories TEXT[],
  personality_traits JSONB, -- Store as JSON object
  custom_tone TEXT,
  
  -- Interview
  predefined_answers JSONB, -- Store as JSON object
  freeform_text TEXT,
  
  -- Admin
  admin_notes TEXT,
  rejection_reason TEXT,
  
  -- Metadata
  session_id VARCHAR(255),
  version VARCHAR(20) DEFAULT '1.0.0'
);

-- Indexes for performance
CREATE INDEX idx_talent_profiles_email ON talent_profiles(email);
CREATE INDEX idx_talent_profiles_status ON talent_profiles(status);
CREATE INDEX idx_talent_profiles_created_at ON talent_profiles(created_at);
CREATE INDEX idx_talent_profiles_submitted_at ON talent_profiles(submitted_at);
```

### 2. Onboarding Progress Table

```sql
-- Onboarding progress tracking
CREATE TABLE onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_profile_id UUID REFERENCES talent_profiles(id) ON DELETE CASCADE,
  current_step INTEGER NOT NULL DEFAULT 0,
  completed_steps INTEGER[] DEFAULT '{}',
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id VARCHAR(255) NOT NULL,
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_onboarding_progress_talent_id ON onboarding_progress(talent_profile_id);
CREATE INDEX idx_onboarding_progress_session_id ON onboarding_progress(session_id);
```

### 3. Admin Actions Log Table

```sql
-- Track admin actions for audit trail
CREATE TABLE admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_profile_id UUID REFERENCES talent_profiles(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL, -- 'approve', 'reject', 'activate', 'deactivate', 'delete'
  action_reason TEXT,
  admin_user_id VARCHAR(255), -- Future: link to admin users table
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_admin_actions_talent_id ON admin_actions(talent_profile_id);
CREATE INDEX idx_admin_actions_created_at ON admin_actions(created_at);
```

### 4. Email Notifications Table

```sql
-- Track email notifications sent
CREATE TABLE email_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_profile_id UUID REFERENCES talent_profiles(id) ON DELETE CASCADE,
  email_type VARCHAR(50) NOT NULL, -- 'welcome', 'approval', 'rejection', 'activation'
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed', 'bounced'))
);

-- Indexes
CREATE INDEX idx_email_notifications_talent_id ON email_notifications(talent_profile_id);
CREATE INDEX idx_email_notifications_sent_at ON email_notifications(sent_at);
```

## Data Flow Architecture

### Frontend → Backend → Database Flow

1. **Talent Onboarding Flow**:
   ```
   Frontend Form → React Hook Form → Backend API → Supabase Database
   ```

2. **File Upload Flow**:
   ```
   Frontend File → Supabase Storage → Get URL → Backend API → Database (URL only)
   ```

3. **Admin Review Flow**:
   ```
   Admin Dashboard → Backend API → Supabase Database → Email Service
   ```

### Detailed Flow Breakdown

#### 1. Talent Registration Flow
```
1. User fills BasicInfoStep → Form data stored in React Hook Form
2. User uploads media → Files uploaded to Supabase Storage
3. User completes personality/interview → All data in form state
4. User submits → POST /api/talent → Supabase talent_profiles table
5. Email notification sent → Email service → email_notifications table
```

#### 2. Draft Saving Flow
```
1. User makes changes → Auto-save triggered
2. Form data serialized → POST /api/talent/draft → Supabase onboarding_progress table
3. Progress tracked → Session ID and step completion stored
4. User returns → GET /api/talent/draft → Resume from saved state
```

#### 3. Admin Review Flow
```
1. Admin views dashboard → GET /api/admin/talent → Supabase talent_profiles table
2. Admin approves/rejects → PUT /api/admin/talent/:id → Update status
3. Action logged → POST /api/admin/actions → admin_actions table
4. Email sent → Email service → email_notifications table
```

#### 4. Media Management Flow
```
1. User uploads file → Frontend → Supabase Storage bucket
2. Storage returns URL → Frontend → Backend API
3. Backend stores URL → Database (no base64)
4. Admin views media → GET /api/media/:id → Supabase Storage URL
```

## API Endpoints Design

### Talent Endpoints
```
POST   /api/talent                    # Create new talent profile
GET    /api/talent/:id               # Get talent profile
PUT    /api/talent/:id               # Update talent profile
DELETE /api/talent/:id               # Delete talent profile
POST   /api/talent/draft             # Save draft
GET    /api/talent/draft             # Load draft
DELETE /api/talent/draft             # Clear draft
```

### Admin Endpoints
```
GET    /api/admin/talent             # List all talent with filters
GET    /api/admin/talent/:id         # Get talent details
PUT    /api/admin/talent/:id         # Update talent status
POST   /api/admin/talent/bulk        # Bulk operations
GET    /api/admin/analytics          # Get analytics data
POST   /api/admin/actions            # Log admin action
```

### Media Endpoints
```
POST   /api/media/upload             # Upload file to Supabase Storage
GET    /api/media/:id                # Get media URL
DELETE /api/media/:id                # Delete media file
```

### Email Endpoints
```
POST   /api/email/send               # Send email notification
GET    /api/email/history            # Get email history
```

## Security Considerations

1. **Row Level Security (RLS)**:
   - Talent can only access their own profile
   - Admins can access all profiles
   - Draft data protected by session ID

2. **File Storage Security**:
   - Signed URLs for secure file access
   - File type validation
   - Size limits enforced

3. **API Security**:
   - JWT authentication for admin endpoints
   - Rate limiting on public endpoints
   - Input validation and sanitization

## Row Level Security (RLS) Implementation

### 1. Enable RLS on All Tables

```sql
-- Enable RLS on all tables
ALTER TABLE talent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;
```

### 2. RLS Policies for Talent Profiles

```sql
-- Talent can only view their own profile (by email or session_id)
CREATE POLICY "Talent can view own profile" ON talent_profiles
    FOR SELECT USING (
        email = current_setting('request.jwt.claims', true)::json->>'email'
        OR session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
    );

-- Talent can update their own profile (draft status only)
CREATE POLICY "Talent can update own profile" ON talent_profiles
    FOR UPDATE USING (
        (email = current_setting('request.jwt.claims', true)::json->>'email'
         OR session_id = current_setting('request.jwt.claims', true)::json->>'session_id')
        AND status = 'draft'
    );

-- Talent can insert their own profile
CREATE POLICY "Talent can insert own profile" ON talent_profiles
    FOR INSERT WITH CHECK (
        email = current_setting('request.jwt.claims', true)::json->>'email'
        OR session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
    );

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON talent_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = current_setting('request.jwt.claims', true)::json->>'sub'
            AND admin_users.role IN ('admin', 'super_admin')
        )
    );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON talent_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = current_setting('request.jwt.claims', true)::json->>'sub'
            AND admin_users.role IN ('admin', 'super_admin')
        )
    );

-- Admins can delete profiles
CREATE POLICY "Admins can delete profiles" ON talent_profiles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = current_setting('request.jwt.claims', true)::json->>'sub'
            AND admin_users.role = 'super_admin'
        )
    );
```

### 3. RLS Policies for Onboarding Progress

```sql
-- Talent can only access their own progress
CREATE POLICY "Talent can view own progress" ON onboarding_progress
    FOR SELECT USING (
        talent_profile_id IN (
            SELECT id FROM talent_profiles 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            OR session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
        )
    );

-- Talent can update their own progress
CREATE POLICY "Talent can update own progress" ON onboarding_progress
    FOR UPDATE USING (
        talent_profile_id IN (
            SELECT id FROM talent_profiles 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
            OR session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
        )
    );

-- Admins can view all progress
CREATE POLICY "Admins can view all progress" ON onboarding_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = current_setting('request.jwt.claims', true)::json->>'sub'
            AND admin_users.role IN ('admin', 'super_admin')
        )
    );
```

### 4. RLS Policies for Admin Actions

```sql
-- Only admins can view admin actions
CREATE POLICY "Admins can view admin actions" ON admin_actions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = current_setting('request.jwt.claims', true)::json->>'sub'
            AND admin_users.role IN ('admin', 'super_admin')
        )
    );

-- Only admins can insert admin actions
CREATE POLICY "Admins can insert admin actions" ON admin_actions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = current_setting('request.jwt.claims', true)::json->>'sub'
            AND admin_users.role IN ('admin', 'super_admin')
        )
    );
```

### 5. RLS Policies for Email Notifications

```sql
-- Talent can only view their own email notifications
CREATE POLICY "Talent can view own emails" ON email_notifications
    FOR SELECT USING (
        talent_profile_id IN (
            SELECT id FROM talent_profiles 
            WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

-- Admins can view all email notifications
CREATE POLICY "Admins can view all emails" ON email_notifications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id = current_setting('request.jwt.claims', true)::json->>'sub'
            AND admin_users.role IN ('admin', 'super_admin')
        )
    );
```

## Real-Time Subscription Strategy

### 1. Enable Real-Time for Tables

```sql
-- Enable real-time for talent profiles and admin actions
ALTER PUBLICATION supabase_realtime ADD TABLE talent_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_actions;
ALTER PUBLICATION supabase_realtime ADD TABLE email_notifications;
```

### 2. Frontend Real-Time Implementation

```typescript
// lib/supabase-realtime.ts
import { createClient } from '@supabase/supabase-js'
import { TalentProfile, AdminAction } from '@/types/talent'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
)

// Real-time talent profiles hook for admin dashboard
export function useRealtimeTalentProfiles() {
  const [talentProfiles, setTalentProfiles] = useState<TalentProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial data fetch
    const fetchTalentProfiles = async () => {
      const { data, error } = await supabase
        .from('talent_profiles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching talent profiles:', error)
        return
      }
      
      setTalentProfiles(data || [])
      setLoading(false)
    }

    fetchTalentProfiles()

    // Real-time subscription for talent profile changes
    const talentSubscription = supabase
      .channel('talent_profiles_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'talent_profiles'
        },
        (payload) => {
          console.log('Talent profile change:', payload)
          
          if (payload.eventType === 'INSERT') {
            setTalentProfiles(prev => [payload.new as TalentProfile, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setTalentProfiles(prev => 
              prev.map(profile => 
                profile.id === payload.new.id ? payload.new as TalentProfile : profile
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setTalentProfiles(prev => 
              prev.filter(profile => profile.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    // Real-time subscription for admin actions
    const adminActionsSubscription = supabase
      .channel('admin_actions_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_actions'
        },
        (payload) => {
          console.log('Admin action:', payload)
          // Trigger admin dashboard updates or notifications
        }
      )
      .subscribe()

    return () => {
      talentSubscription.unsubscribe()
      adminActionsSubscription.unsubscribe()
    }
  }, [])

  return { talentProfiles, loading }
}

// Real-time subscription for individual talent profile
export function useRealtimeTalentProfile(talentId: string) {
  const [talentProfile, setTalentProfile] = useState<TalentProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial data fetch
    const fetchTalentProfile = async () => {
      const { data, error } = await supabase
        .from('talent_profiles')
        .select('*')
        .eq('id', talentId)
        .single()
      
      if (error) {
        console.error('Error fetching talent profile:', error)
        return
      }
      
      setTalentProfile(data)
      setLoading(false)
    }

    fetchTalentProfile()

    // Real-time subscription for specific talent profile
    const subscription = supabase
      .channel(`talent_profile_${talentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'talent_profiles',
          filter: `id=eq.${talentId}`
        },
        (payload) => {
          console.log('Talent profile update:', payload)
          
          if (payload.eventType === 'UPDATE') {
            setTalentProfile(payload.new as TalentProfile)
          } else if (payload.eventType === 'DELETE') {
            setTalentProfile(null)
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [talentId])

  return { talentProfile, loading }
}

// Real-time subscription for onboarding progress
export function useRealtimeOnboardingProgress(talentId: string) {
  const [progress, setProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial data fetch
    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('talent_profile_id', talentId)
        .single()
      
      if (error) {
        console.error('Error fetching progress:', error)
        return
      }
      
      setProgress(data)
      setLoading(false)
    }

    fetchProgress()

    // Real-time subscription for onboarding progress
    const subscription = supabase
      .channel(`onboarding_progress_${talentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'onboarding_progress',
          filter: `talent_profile_id=eq.${talentId}`
        },
        (payload) => {
          console.log('Progress update:', payload)
          
          if (payload.eventType === 'UPDATE') {
            setProgress(payload.new)
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [talentId])

  return { progress, loading }
}
```

### 3. Admin Dashboard Real-Time Integration

```typescript
// components/AdminTalentReview.tsx - Updated with real-time
import { useRealtimeTalentProfiles } from '@/lib/supabase-realtime'

export default function AdminTalentReview() {
  const { talentProfiles, loading } = useRealtimeTalentProfiles()
  
  // Component will automatically update when talent profiles change
  // No need for manual refresh or polling
  
  if (loading) {
    return <div>Loading talent profiles...</div>
  }

  return (
    <div>
      <h1>Admin Talent Review Dashboard</h1>
      <p>Real-time updates enabled - {talentProfiles.length} talent profiles</p>
      
      {/* Talent table will automatically reflect changes */}
      <TalentTable talentProfiles={talentProfiles} />
    </div>
  )
}

// components/TalentDetailView.tsx - Updated with real-time
import { useRealtimeTalentProfile } from '@/lib/supabase-realtime'

export default function TalentDetailView({ talentId }: { talentId: string }) {
  const { talentProfile, loading } = useRealtimeTalentProfile(talentId)
  const { progress } = useRealtimeOnboardingProgress(talentId)
  
  // Component will automatically update when talent profile or progress changes
  
  if (loading) {
    return <div>Loading talent details...</div>
  }

  return (
    <div>
      <h1>Talent Profile</h1>
      {/* Profile details will automatically update */}
      <TalentProfileDisplay profile={talentProfile} />
      <OnboardingProgressDisplay progress={progress} />
    </div>
  )
}
```

### 4. Real-Time Notifications for Admins

```typescript
// lib/admin-notifications.ts
import { supabase } from './supabase-realtime'

export function useAdminNotifications() {
  useEffect(() => {
    // Subscribe to admin action notifications
    const subscription = supabase
      .channel('admin_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_actions'
        },
        (payload) => {
          const action = payload.new
          
          // Show notification to admin
          showNotification({
            title: 'Admin Action',
            message: `${action.action_type} performed on talent profile`,
            type: 'info'
          })
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])
}

// Real-time status change notifications
export function useStatusChangeNotifications() {
  useEffect(() => {
    const subscription = supabase
      .channel('status_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'talent_profiles',
          filter: 'status=neq.draft'
        },
        (payload) => {
          const oldStatus = payload.old.status
          const newStatus = payload.new.status
          
          if (oldStatus !== newStatus) {
            showNotification({
              title: 'Status Change',
              message: `Talent profile status changed from ${oldStatus} to ${newStatus}`,
              type: 'success'
            })
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])
}
```

### 5. Real-Time Performance Optimization

```typescript
// lib/realtime-optimization.ts
export class RealtimeManager {
  private subscriptions = new Map<string, any>()
  private maxSubscriptions = 20

  subscribe(channelName: string, callback: (payload: any) => void) {
    // Prevent duplicate subscriptions
    if (this.subscriptions.has(channelName)) {
      return
    }

    // Limit number of active subscriptions
    if (this.subscriptions.size >= this.maxSubscriptions) {
      const oldestKey = this.subscriptions.keys().next().value
      this.unsubscribe(oldestKey)
    }

    const subscription = supabase
      .channel(channelName)
      .on('postgres_changes', callback)
      .subscribe()

    this.subscriptions.set(channelName, subscription)
  }

  unsubscribe(channelName: string) {
    const subscription = this.subscriptions.get(channelName)
    if (subscription) {
      subscription.unsubscribe()
      this.subscriptions.delete(channelName)
    }
  }

  cleanup() {
    this.subscriptions.forEach((subscription, key) => {
      subscription.unsubscribe()
    })
    this.subscriptions.clear()
  }
}
```

## Updated API Endpoints with RLS Support

### 1. Talent Endpoints with RLS

```typescript
// pages/api/talent/[id].ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  
  // RLS will automatically filter data based on user permissions
  const { data, error } = await supabase
    .from('talent_profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  return res.status(200).json(data)
}
```

### 2. Admin Endpoints with RLS

```typescript
// pages/api/admin/talent.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify admin authentication
  const adminUser = await verifyAdminAuth(req)
  if (!adminUser) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // RLS will allow admins to see all profiles
  const { data, error } = await supabase
    .from('talent_profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  return res.status(200).json(data)
}
```

## Security Considerations

1. **Row Level Security (RLS)**:
   - Talent can only access their own profile
   - Admins can access all profiles
   - Draft data protected by session ID

2. **File Storage Security**:
   - Signed URLs for secure file access
   - File type validation
   - Size limits enforced

3. **API Security**:
   - JWT authentication for admin endpoints
   - Rate limiting on public endpoints
   - Input validation and sanitization

4. **Real-Time Security**:
   - RLS policies apply to real-time subscriptions
   - Channel filtering prevents unauthorized access
   - Subscription limits prevent abuse 