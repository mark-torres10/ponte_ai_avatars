'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Persona, PERSONAS, resetPersonaSelection } from '@/lib/personas';

interface PersonaSelectionProps {
  onPersonaSelect?: (persona: Persona | null) => void;
}

export default function PersonaSelection({ onPersonaSelect }: PersonaSelectionProps) {
  const [personas, setPersonas] = useState<Persona[]>(PERSONAS);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  const handlePersonaSelect = (personaId: string) => {
    const updatedPersonas = personas.map(persona => ({
      ...persona,
      selected: persona.id === personaId
    }));
    
    const selected = updatedPersonas.find(p => p.id === personaId) || null;
    
    setPersonas(updatedPersonas);
    setSelectedPersona(selected);
    
    if (onPersonaSelect) {
      onPersonaSelect(selected);
    }
  };

  const handleReset = () => {
    const resetPersonas = resetPersonaSelection();
    setPersonas(resetPersonas);
    setSelectedPersona(null);
    
    if (onPersonaSelect) {
      onPersonaSelect(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          Choose Your <span className="text-gradient">Avatar</span>
        </h2>
        <p className="text-foreground/70 mb-6">
          Select a persona to generate your personalized AI avatar content
        </p>
      </div>

      {/* Persona Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {personas.map((persona) => (
          <div
            key={persona.id}
            className={`avatar-card cursor-pointer transition-all duration-300 ${
              persona.selected 
                ? 'ring-2 ring-primary shadow-lg scale-105' 
                : 'hover:scale-105 hover:shadow-lg'
            }`}
            onClick={() => handlePersonaSelect(persona.id)}
          >
            {/* Persona Header */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold mb-2">{persona.name}</h3>
              <p className="text-foreground/70 text-sm">{persona.description}</p>
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {persona.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden bg-muted relative"
                >
                  <Image
                    src={image}
                    alt={`${persona.name} - Image ${index + 1}`}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Selection Indicator */}
            {persona.selected && (
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reset Button */}
      {selectedPersona && (
        <div className="text-center">
          <button
            onClick={handleReset}
            className="btn-secondary-ponte px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
          >
            Reset Selection
          </button>
        </div>
      )}

      {/* Selection Summary */}
      {selectedPersona && (
        <div className="card-ponte p-6 rounded-lg">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              Selected: <span className="text-primary">{selectedPersona.name}</span>
            </h3>
            <p className="text-foreground/70">{selectedPersona.description}</p>
          </div>
        </div>
      )}
    </div>
  );
} 