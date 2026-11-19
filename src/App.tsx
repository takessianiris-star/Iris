/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useState } from 'react';
import { CvModal } from './components/CvModal';
import { ExperiencesSection } from './components/ExperiencesSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { MarqueeRibbon } from './components/MarqueeRibbon';
import { Navbar } from './components/Navbar';
import { SkillsAndEducation } from './components/SkillsAndEducation';
import { VoiceAssistantStudio } from './components/VoiceAssistantStudio';
import type { ExperienceItem } from './data/irisProfile';
import { useLiveAssistant } from './hooks/useLiveAssistant';

export default function App() {
  const [cvModalOpen, setCvModalOpen] = useState(false);

  const {
    status: voiceStatus,
    isMuted,
    isAssistantSpeaking,
    error: voiceError,
    transcripts,
    audioLevel,
    connect,
    disconnect,
    toggleMute,
    sendTextToLive,
    clearTranscripts,
  } = useLiveAssistant();

  const scrollToStudio = useCallback(() => {
    const el = document.getElementById('assistante');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleOpenAssistant = useCallback(() => {
    scrollToStudio();
    if (voiceStatus === 'idle' || voiceStatus === 'error') {
      void connect();
    }
  }, [connect, scrollToStudio, voiceStatus]);

  const handleAskVoiceAboutExperience = useCallback(
    (exp: ExperienceItem) => {
      scrollToStudio();
      sendTextToLive(
        `Peux-tu me présenter en détail le poste d'Iris en tant que ${exp.role} chez ${exp.company} (${exp.period}) ?`,
      );
    },
    [scrollToStudio, sendTextToLive],
  );

  return (
    <div id="top" className="min-h-screen bg-canvas text-ink flex flex-col">
      <Navbar onOpenAssistant={handleOpenAssistant} />

      <main className="flex-1">
        <HeroSection
          voiceStatus={voiceStatus}
          isAssistantSpeaking={isAssistantSpeaking}
          isMuted={isMuted}
          audioLevel={audioLevel}
          onStartVoice={() => {
            void connect();
          }}
          onStopVoice={disconnect}
          onToggleMute={toggleMute}
          onOpenCv={() => setCvModalOpen(true)}
          onJumpToStudio={scrollToStudio}
        />

        <MarqueeRibbon />

        <VoiceAssistantStudio
          voiceStatus={voiceStatus}
          isMuted={isMuted}
          isAssistantSpeaking={isAssistantSpeaking}
          voiceError={voiceError}
          transcripts={transcripts}
          audioLevel={audioLevel}
          onStartVoice={(prompt) => {
            void connect(prompt);
          }}
          onStopVoice={disconnect}
          onToggleMute={toggleMute}
          onSendTextToLive={sendTextToLive}
          onClearTranscripts={clearTranscripts}
        />

        <ExperiencesSection
          onAskVoiceAboutExperience={handleAskVoiceAboutExperience}
        />

        <SkillsAndEducation />
      </main>

      <Footer onOpenCv={() => setCvModalOpen(true)} />

      <CvModal isOpen={cvModalOpen} onClose={() => setCvModalOpen(false)} />
    </div>
  );
}
