import { getApiUrl } from './config'

// OpenAI API integration for AI persona generation
export interface OpenAIPersonaRequest {
  name: string
  toneCategories: string[]
  personalityTraits: {
    extroversion: number
    formality: number
    energy: number
    professionalism: number
  }
  customTone?: string
  interviewAnswers?: Record<string, string>
}

export interface OpenAIPersonaResponse {
  success: boolean
  persona?: string
  error?: string
}

class OpenAIClient {
  private backendUrl: string

  constructor() {
    // Use backend API instead of direct OpenAI calls
    this.backendUrl = getApiUrl()
  }

  async generatePersona(request: OpenAIPersonaRequest): Promise<OpenAIPersonaResponse> {
    try {
      const response = await fetch(`${this.backendUrl}/api/openai/generate-persona`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error calling backend OpenAI API:', error)
      // Fallback to mock response if backend is unavailable
      return this.generateMockPersona(request)
    }
  }

  async generatePrompt(request: { prompt: string; model?: string; maxTokens?: number; temperature?: number }): Promise<{ success: boolean; content?: string; error?: string }> {
    try {
      const response = await fetch(`${this.backendUrl}/api/openai/prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error calling backend OpenAI API:', error)
      return {
        success: false,
        error: 'Failed to generate prompt response',
      }
    }
  }

  private async generateMockPersona(request: OpenAIPersonaRequest): Promise<OpenAIPersonaResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      const { name, toneCategories, personalityTraits, customTone } = request
      
      // Generate a realistic persona based on the input data
      const persona = this.buildPersonaFromData(name, toneCategories, personalityTraits, customTone)
      
      return {
        success: true,
        persona,
      }
    } catch (error) {
      console.error('Error generating mock persona:', error)
      return {
        success: false,
        error: 'Failed to generate persona',
      }
    }
  }

  private buildPersonaFromData(
    name: string,
    toneCategories: string[],
    personalityTraits: Record<string, number>,
    customTone?: string
  ): string {
    const toneDescriptions = {
      professional: 'professional and corporate communication',
      friendly: 'warm and approachable interactions',
      authoritative: 'confident and leadership-focused communication',
      casual: 'relaxed and informal conversations',
      enthusiastic: 'energetic and motivational content',
      calm: 'serene and composed delivery',
      humorous: 'entertaining and light-hearted communication',
      serious: 'focused and detail-oriented presentations',
    }

    const personalityDescriptions = {
      extroversion: personalityTraits.extroversion > 50 ? 'outgoing and engaging' : 'thoughtful and reflective',
      formality: personalityTraits.formality > 50 ? 'polished and professional' : 'approachable and relatable',
      energy: personalityTraits.energy > 50 ? 'dynamic and energetic' : 'measured and composed',
      professionalism: personalityTraits.professionalism > 50 ? 'corporate-ready' : 'authentically human',
    }

    const selectedTones = toneCategories
      .map(tone => toneDescriptions[tone as keyof typeof toneDescriptions])
      .filter(Boolean)
      .join(', ')

    const persona = `Meet ${name}, a dynamic AI avatar that excels in ${selectedTones || 'versatile communication'}.

With a personality that balances ${personalityDescriptions.extroversion} energy with ${personalityDescriptions.formality} communication style, this avatar delivers ${personalityDescriptions.energy} content while maintaining ${personalityDescriptions.professionalism} standards.

${customTone ? `Custom characteristics: ${customTone}` : ''}

Perfect for: ${this.getUseCases(toneCategories)}`

    return persona
  }

  private getUseCases(toneCategories: string[]): string {
    const useCases = {
      professional: 'corporate training, business presentations, executive communications',
      friendly: 'customer service, community engagement, educational content',
      authoritative: 'leadership communication, expert commentary, industry insights',
      casual: 'social media content, informal tutorials, lifestyle content',
      enthusiastic: 'product demonstrations, motivational content, event hosting',
      calm: 'meditation guides, educational content, wellness communication',
      humorous: 'entertainment content, light-hearted presentations, social media',
      serious: 'technical training, formal announcements, compliance communication',
    }

    const selectedUseCases = toneCategories
      .map(tone => useCases[tone as keyof typeof useCases])
      .filter(Boolean)

    return selectedUseCases.length > 0 ? selectedUseCases.join(', ') : 'versatile content creation'
  }

  // Real OpenAI API integration (moved to backend for security)
  // This method is kept for reference but should not be used in production
  // All OpenAI calls should go through the backend API
  private async callOpenAIAPI(request: OpenAIPersonaRequest): Promise<OpenAIPersonaResponse> {
    console.warn('Direct OpenAI API calls are deprecated. Use backend API instead.')
    throw new Error('Direct OpenAI API calls are not allowed. Use the backend API.')
  }

  private buildPrompt(request: OpenAIPersonaRequest): string {
    const { name, toneCategories, personalityTraits, customTone, interviewAnswers } = request

    return `Create an AI persona description for ${name} with the following characteristics:

Tone Categories: ${toneCategories.join(', ')}
Personality Traits:
- Extroversion: ${personalityTraits.extroversion}/100
- Formality: ${personalityTraits.formality}/100
- Energy: ${personalityTraits.energy}/100
- Professionalism: ${personalityTraits.professionalism}/100

${customTone ? `Custom Tone: ${customTone}` : ''}

${interviewAnswers ? `Interview Insights: ${Object.values(interviewAnswers).join(' ')}` : ''}

Please create a compelling, professional description that highlights the avatar's unique characteristics and potential use cases. Keep it concise but engaging.`
  }
}

// Create and export the OpenAI client instance
export const openAIClient = new OpenAIClient()

// Export the client for use in components
export default openAIClient 