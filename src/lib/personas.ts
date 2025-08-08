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
    id: 'parker-munns',
    name: 'Parker Munns',
    description: 'Tech & Marketing Entrepreneur Parker Munns',
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