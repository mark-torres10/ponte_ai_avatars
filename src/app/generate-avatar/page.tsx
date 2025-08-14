'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from "next/link"
import { useClerkUser } from '@/lib/useClerkUser'
import PersonaSelection from "@/components/PersonaSelection"
import TextInput from "@/components/TextInput"
import VoiceGeneration from "@/components/VoiceGeneration"
import VideoGeneration from "@/components/VideoGeneration"
import CollapsibleBackendStatus from "@/components/CollapsibleBackendStatus"
import LocalTestingMode from "@/components/LocalTestingMode"
import AdminNavbar from "@/components/AdminNavbar"
import { Persona } from "@/lib/personas"

export default function GenerateAvatarPage() {
  const { user, isLoaded } = useClerkUser()
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [currentText, setCurrentText] = useState('');
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState('');
  const [personalizedText, setPersonalizedText] = useState('');
  const [isUsingPersonalized, setIsUsingPersonalized] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/users/${user.id}`);
        const data = await response.json();
        if (data.success) {
          setUserRole(data.data?.role);
        }
      } catch (error) {
        console.error('Failed to fetch user role:', error);
      }
    };

    if (isLoaded && user) {
      fetchUserRole();
    }
  }, [user, isLoaded]);

  const handlePersonaSelect = useCallback((persona: Persona | null) => {
    setSelectedPersona(persona);
    console.log('Selected persona:', persona);
  }, []);

  const handleTextChange = useCallback((text: string, isPersonalized: boolean = false, original?: string, personalized?: string) => {
    setCurrentText(text);
    setIsUsingPersonalized(isPersonalized);
    if (original) setOriginalText(original);
    if (personalized) setPersonalizedText(personalized);
    console.log('Current text:', text, 'Using personalized:', isPersonalized);
  }, []);

  const handleVoiceGenerated = useCallback((audioUrl: string) => {
    setCurrentAudioUrl(audioUrl);
    console.log('Voice generated:', audioUrl);
  }, []);

  const handleScriptChange = useCallback((text: string, isPersonalized: boolean) => {
    setCurrentText(text);
    setIsUsingPersonalized(isPersonalized);
    console.log('Script changed to:', isPersonalized ? 'AI Personalized' : 'Original');
  }, []);

  const handleManualSave = useCallback(() => {
    // Save the current text state to localStorage or other storage
    const saveData = {
      currentText,
      originalText,
      personalizedText,
      isUsingPersonalized,
      selectedPersona: selectedPersona?.id,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem('avatar-generation-draft', JSON.stringify(saveData));
      console.log('Avatar generation data saved');
    } catch (error) {
      console.error('Failed to save avatar generation data:', error);
    }
  }, [currentText, originalText, personalizedText, isUsingPersonalized, selectedPersona]);

  // Show loading state while checking user role
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Use AdminNavbar for admin users, regular navigation for others */}
      {userRole === 'admin' ? (
        <AdminNavbar userEmail={user?.emailAddresses[0]?.emailAddress} />
      ) : (
        <div className="border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-2xl font-bold text-primary">
                  Ponte AI
                </Link>
                <span className="text-sm text-foreground/60">Avatar Generation</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
                  onManualSave={handleManualSave}
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
                href="/client"
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
      
      {/* Local Testing Mode */}
      <LocalTestingMode />
    </div>
  )
} 