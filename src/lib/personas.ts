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
      '/voice_actor_a/pic1.jpeg',
      '/voice_actor_a/pic2.jpeg',
      '/voice_actor_a/pic3.jpeg',
      '/voice_actor_a/pic4.jpeg',
      '/voice_actor_a/pic5.jpeg',
    ],
    selected: false,
  },
  {
    id: 'will-howard',
    name: 'Will Howard',
    description: 'NFL Quarterback Will Howard',
    images: [
      '/voice_actor_b/pic1.jpeg',
      '/voice_actor_b/pic2.jpeg',
      '/voice_actor_b/pic3.jpeg',
      '/voice_actor_b/pic4.jpeg',
      '/voice_actor_b/pic5.jpeg',
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