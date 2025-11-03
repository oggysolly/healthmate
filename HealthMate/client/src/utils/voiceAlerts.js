// Voice alerts using Web Speech API
let speechSynthesis = null;

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  speechSynthesis = window.speechSynthesis;
}

export function speakAlert(message, lang = 'en-US') {
  if (!speechSynthesis) {
    console.warn('Speech synthesis not supported');
    return;
  }

  // Cancel any ongoing speech
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = lang;
  utterance.volume = 1;
  utterance.rate = 1;
  utterance.pitch = 1;

  speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (speechSynthesis) {
    speechSynthesis.cancel();
  }
}
