console.log('AI Study Buddy Chatbot');

function openChatbotWithPrompt(prompt) {
  if (window.botpress && typeof window.botpress.open === 'function') {
    window.botpress.open();
  }

  setTimeout(function () {
    const botpressApi = window.botpress;
    const webchatApi = window.botpressWebChat || botpressApi?.webchat;

    const senders = [
      function () {
        if (botpressApi && typeof botpressApi.sendMessage === 'function') {
          botpressApi.sendMessage(prompt);
          return true;
        }
        return false;
      },
      function () {
        if (botpressApi && typeof botpressApi.sendPayload === 'function') {
          botpressApi.sendPayload({ type: 'text', text: prompt });
          return true;
        }
        return false;
      },
      function () {
        if (webchatApi && typeof webchatApi.sendMessage === 'function') {
          webchatApi.sendMessage(prompt);
          return true;
        }
        return false;
      },
      function () {
        if (webchatApi && typeof webchatApi.sendPayload === 'function') {
          webchatApi.sendPayload({ type: 'text', text: prompt });
          return true;
        }
        return false;
      },
      function () {
        if (webchatApi && typeof webchatApi.sendEvent === 'function') {
          webchatApi.sendEvent({ type: 'message', text: prompt });
          return true;
        }
        return false;
      }
    ];

    for (const sendMessage of senders) {
      try {
        if (sendMessage()) {
          return;
        }
      } catch (error) {
        console.warn('Unable to send prompt to chatbot:', error);
      }
    }

    const selectors = [
      'textarea[placeholder*="Type"]',
      '.bpw-composer textarea',
      '[data-testid="composer-input"]',
      '.bpw-input'
    ];

    for (const selector of selectors) {
      const input = document.querySelector(selector);
      if (input) {
        input.focus();
        input.value = prompt;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        return;
      }
    }
  }, 800);
}

document.addEventListener('DOMContentLoaded', function () {
  const tryNowButton = document.getElementById('tryNowBtn');
  const quizCard = document.getElementById('quizCard');
  const tutorCard = document.getElementById('tutorCard');
  const revisionCard = document.getElementById('revisionCard');
  const voiceChatMessages = document.getElementById('voiceChatMessages');
  const voiceStatus = document.getElementById('voiceStatus');
  const voiceRecordBtn = document.getElementById('voiceRecordBtn');
  const voiceStopBtn = document.getElementById('voiceStopBtn');

  let recognition = null;
  let isListening = false;

  function setVoiceStatus(message, isError) {
    if (!voiceStatus) {
      return;
    }

    voiceStatus.textContent = message;
    voiceStatus.classList.toggle('error', Boolean(isError));
  }

  function updateVoiceButtons() {
    if (!voiceRecordBtn || !voiceStopBtn) {
      return;
    }

    voiceRecordBtn.disabled = isListening;
    voiceStopBtn.hidden = !isListening;
    voiceRecordBtn.textContent = isListening ? '🎤 Listening...' : '🎤 Start Recording';
  }

  function addMessage(text, role) {
    if (!voiceChatMessages) {
      return;
    }

    const bubble = document.createElement('div');
    bubble.className = `message ${role}`;
    bubble.textContent = text;
    voiceChatMessages.appendChild(bubble);
    voiceChatMessages.scrollTop = voiceChatMessages.scrollHeight;
  }

  function generateReply(text) {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('quiz')) {
      return 'Absolutely. Here is a quick quiz prompt: what does AI stand for?';
    }

    if (lowerText.includes('revision') || lowerText.includes('revise')) {
      return 'Let us revise together. Focus on key ideas, definitions, and one practice question.';
    }

    if (lowerText.includes('project management')) {
      return 'Project management is about planning, organising tasks, and guiding a team to deliver goals on time.';
    }

    if (lowerText.includes('ai')) {
      return 'AI stands for Artificial Intelligence, which means teaching computers to make decisions or solve problems.';
    }

    if (lowerText.includes('hello') || lowerText.includes('hi')) {
      return 'Hello! I am your study buddy. Ask me about lessons, quizzes, or revision.';
    }

    return `I heard you say: ${text}. I can explain topics, quiz you, or help you revise.`;
  }

  function speakReply(text) {
    if (!('speechSynthesis' in window)) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function handleVoiceInput(text) {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    addMessage(trimmedText, 'user');
    const reply = generateReply(trimmedText);
    addMessage(reply, 'bot');
    speakReply(reply);
    openChatbotWithPrompt(trimmedText);
  }

  function startVoiceRecognition() {
    if (!recognition) {
      setVoiceStatus('Speech recognition is not supported in this browser.', true);
      return;
    }

    if (isListening) {
      return;
    }

    try {
      recognition.start();
      isListening = true;
      updateVoiceButtons();
      setVoiceStatus('Listening... Speak now.');
    } catch (error) {
      setVoiceStatus('Microphone access is already in use.', true);
    }
  }

  function stopVoiceRecognition() {
    if (!recognition || !isListening) {
      return;
    }

    recognition.stop();
    isListening = false;
    updateVoiceButtons();
    setVoiceStatus('Recording stopped.');
  }

  if (tryNowButton) {
    tryNowButton.addEventListener('click', function (event) {
      event.preventDefault();
      openChatbotWithPrompt('quiz me');
    });
  }

  if (quizCard) {
    const handleQuizClick = function (event) {
      event.preventDefault();
      openChatbotWithPrompt('quiz me');
    };

    quizCard.addEventListener('click', handleQuizClick);
    quizCard.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleQuizClick(event);
      }
    });
  }

  if (tutorCard) {
    const handleTutorClick = function (event) {
      event.preventDefault();
      openChatbotWithPrompt('');
    };

    tutorCard.addEventListener('click', handleTutorClick);
    tutorCard.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleTutorClick(event);
      }
    });
  }

  if (revisionCard) {
    const handleRevisionClick = function (event) {
      event.preventDefault();
      openChatbotWithPrompt('help me revise');
    };

    revisionCard.addEventListener('click', handleRevisionClick);
    revisionCard.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleRevisionClick(event);
      }
    });
  }

  if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = function (event) {
      const transcript = event.results[event.resultIndex][0].transcript;
      handleVoiceInput(transcript);
      isListening = false;
      updateVoiceButtons();
      setVoiceStatus('Voice message processed.');
    };

    recognition.onerror = function (event) {
      isListening = false;
      updateVoiceButtons();
      setVoiceStatus(`Voice capture error: ${event.error}`, true);
    };

    recognition.onend = function () {
      if (isListening) {
        isListening = false;
        updateVoiceButtons();
      }
    };

    if (voiceRecordBtn) {
      voiceRecordBtn.addEventListener('click', startVoiceRecognition);
    }

    if (voiceStopBtn) {
      voiceStopBtn.addEventListener('click', stopVoiceRecognition);
    }

    updateVoiceButtons();
  } else {
    setVoiceStatus('Your browser does not support voice recording. Try Chrome or Edge.', true);
  }
});