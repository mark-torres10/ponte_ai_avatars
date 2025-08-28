import { create } from 'zustand'

// Game state interface
export interface GameState {
  isActive: boolean
  teamNames: string[]
  gameId?: string
  scores?: {
    home: number
    away: number
  }
  venue?: string
  gameTime?: string
  gameStatus?: string
}

// Game store actions
interface GameActions {
  setGameState: (state: Partial<GameState>) => void
  resetGameState: () => void
  setTeamNames: (names: string[]) => void
  setScores: (home: number, away: number) => void
}

// Initial state
const initialState: GameState = {
  isActive: false,
  teamNames: [],
}

// Create the store
export const useGameStore = create<GameState & GameActions>((set) => ({
  ...initialState,
  
  setGameState: (newState) => set((state) => ({ ...state, ...newState })),
  
  resetGameState: () => set(initialState),
  
  setTeamNames: (names) => set({ teamNames: names }),
  
  setScores: (home, away) => set({ 
    scores: { home, away } 
  }),
}))
