import { AvatarImage } from './supabase-images';

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
    images: [
      'https://picsum.photos/300/300?random=1&blur=2',
      'https://picsum.photos/300/300?random=2&blur=2',
      'https://picsum.photos/300/300?random=3&blur=2',
      'https://picsum.photos/300/300?random=4&blur=2',
      'https://picsum.photos/300/300?random=5&blur=2',
    ],
    selected: false,
  },
  {
    id: 'will-howard',
    name: 'Will Howard',
    description: 'NFL Quarterback Will Howard',
    images: [
      'https://picsum.photos/300/300?random=6&blur=2',
      'https://picsum.photos/300/300?random=7&blur=2',
      'https://picsum.photos/300/300?random=8&blur=2',
      'https://picsum.photos/300/300?random=9&blur=2',
      'https://picsum.photos/300/300?random=10&blur=2',
    ],
    selected: false,
  },
];

export const getPersonaById = (id: string): Persona | undefined => {
  return PERSONAS.find(persona => persona.id === id);
};

export const resetPersonaSelection = (): Persona[] => {
  return PERSONAS.map(persona => ({ ...persona, selected: false }));
}; 