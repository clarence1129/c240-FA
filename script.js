console.log("AI Study Buddy Chatbot");

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

  if (tryNowButton) {
    tryNowButton.addEventListener('click', function (event) {
      event.preventDefault();
      openChatbotWithPrompt('quiz me');
    });
  }

  const quizCard = document.getElementById('quizCard');

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

  const tutorCard = document.getElementById('tutorCard');

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

  const revisionCard = document.getElementById('revisionCard');

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
});