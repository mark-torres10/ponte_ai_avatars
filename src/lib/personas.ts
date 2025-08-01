import { AvatarImage } from '@/types/avatar-images';

export interface Persona {
  id: string;
  name: string;
  description: string;
  images: string[] | AvatarImage[];
  selected: boolean;
}

export const PERSONAS: Persona[] = [
  {
    id: 'terry-crews',
    name: 'Terry Crews',
    description: 'Actor & Ex-Athlete Terry Crews',
    images: [], // Start with empty images array - will be populated when loaded
    selected: false,
  },
  {
    id: 'will-howard',
    name: 'Will Howard',
    description: 'NFL Quarterback Will Howard',
    images: [], // Start with empty images array - will be populated when loaded
    selected: false,
  },
];

export const getPersonaById = (id: string): Persona | undefined => {
  return PERSONAS.find(persona => persona.id === id);
};

export const resetPersonaSelection = (): Persona[] => {
  return PERSONAS.map(persona => ({ ...persona, selected: false }));
}; 