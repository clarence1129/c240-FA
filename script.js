console.log("AI Study Buddy Chatbot");

// Handle Try Now button click
document.addEventListener('DOMContentLoaded', function() {
  // Find the Try Now button and add click handler
  const tryNowButton = document.querySelector('a[href="#chatbot"] button');
  
  if (tryNowButton) {
    tryNowButton.addEventListener('click', function(e) {
      e.preventDefault();
      // Scroll to chatbot section
      const chatbotSection = document.getElementById('chatbot');
      if (chatbotSection) {
        chatbotSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});

document.getElementById("tryNowBtn").addEventListener("click", function () {
    if (window.botpress && window.botpress.open) {
        window.botpress.open();
    }
});