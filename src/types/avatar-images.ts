export interface AvatarImage {
  url: string;
  alt: string;
  index: number;
}

export interface PersonaImages {
  [personaId: string]: AvatarImage[];
} 