'use client';

import { useState } from 'react';
import Navigation from "@/components/navigation"
import Link from "next/link"
import PersonaSelection from "@/components/PersonaSelection"
import TextInput from "@/components/TextInput"
import VoiceGeneration from "@/components/VoiceGeneration"
import VideoGeneration from "@/components/VideoGeneration"
import CollapsibleBackendStatus from "@/components/CollapsibleBackendStatus"
import { Persona } from "@/lib/personas"

export default function GenerateAvatarPage() {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [currentText, setCurrentText] = useState('');
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState('');
  const [personalizedText, setPersonalizedText] = useState('');
  const [isUsingPersonalized, setIsUsingPersonalized] = useState(false);

  const handlePersonaSelect = (persona: Persona | null) => {
    setSelectedPersona(persona);
    console.log('Selected persona:', persona);
  };

  const handleTextChange = (text: string, isPersonalized: boolean = false, original?: string, personalized?: string) => {
    setCurrentText(text);
    setIsUsingPersonalized(isPersonalized);
    if (original) setOriginalText(original);
    if (personalized) setPersonalizedText(personalized);
    console.log('Current text:', text, 'Using personalized:', isPersonalized);
  };

  const handleVoiceGenerated = (audioUrl: string) => {
    setCurrentAudioUrl(audioUrl);
    console.log('Voice generated:', audioUrl);
  };

  const handleScriptChange = (text: string, isPersonalized: boolean) => {
    setCurrentText(text);
    setIsUsingPersonalized(isPersonalized);
    console.log('Script changed to:', isPersonalized ? 'AI Personalized' : 'Original');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <div className="w-20 h-20 bg-gradient-ponte rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">🎬</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                Generate{" "}
                <span className="text-gradient">Avatar</span>
              </h1>
              <p className="text-lg text-foreground/70 mb-8">
                Watch our AI avatar technology in action and see how we create compelling content.
              </p>
            </div>

            {/* Persona Selection */}
            <div className="card-ponte p-8 rounded-lg mb-8">
              <PersonaSelection onPersonaSelect={handlePersonaSelect} />
            </div>

            {/* Text Input and AI Personalization */}
            {selectedPersona && (
              <div className="card-ponte p-8 rounded-lg mb-8">
                <TextInput 
                  selectedPersona={selectedPersona} 
                  onTextChange={handleTextChange} 
                />
              </div>
            )}

            {/* Voice Generation */}
            {selectedPersona && currentText.trim() && (
              <div className="card-ponte p-8 rounded-lg mb-8">
                <VoiceGeneration 
                  selectedPersona={selectedPersona} 
                  currentText={currentText} 
                  onVoiceGenerated={handleVoiceGenerated}
                  originalText={originalText}
                  personalizedText={personalizedText}
                  isUsingPersonalized={isUsingPersonalized}
                  onScriptChange={handleScriptChange}
                />
              </div>
            )}

            {/* Video Generation */}
            {selectedPersona && currentText.trim() && currentAudioUrl && (
              <div className="card-ponte p-8 rounded-lg mb-8">
                <VideoGeneration 
                  selectedPersona={selectedPersona} 
                  audioUrl={currentAudioUrl}
                  currentText={currentText} 
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/request-talent"
                className="btn-primary-ponte text-base px-6 py-3 rounded-md font-medium"
              >
                Book an Avatar
              </Link>
              <Link
                href="/"
                className="btn-secondary-ponte text-base px-6 py-3 rounded-md font-medium"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Backend Status */}
      <CollapsibleBackendStatus />
    </div>
  )
} 