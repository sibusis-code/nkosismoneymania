/* ===========================
   NKOSIS MONEY MANIA – SCRIPT
   =========================== */

// ── NAVBAR: scroll & mobile toggle ──────────────────
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 60
    ? 'rgba(10,92,54,1)'
    : 'rgba(10,92,54,0.97)';
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity   = navLinks.classList.contains('open') ? '0' : '1';
  spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px,-5px)' : '';
});

// Close mobile menu when clicking a nav link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
  });
});

// ── LOAN CALCULATOR ──────────────────────────────────
function calculateLoan() {
  const amountInput   = document.getElementById('loanAmount');
  const durationInput = document.getElementById('loanDuration');
  const unitSelect    = document.getElementById('durationUnit');

  const amount   = parseFloat(amountInput.value);
  const duration = parseFloat(durationInput.value);
  const unit     = unitSelect.value;

  // Validation
  if (!amount || amount <= 0 || !duration || duration <= 0) {
    shakeInvalid(amountInput, durationInput);
    return;
  }

  // Interest rate: 40% per month
  // For weeks: pro-rate as (40/4) = 10% per week
  const MONTHLY_RATE = 0.40;
  const WEEKLY_RATE  = 0.10;

  let interestRate;
  let periods;

  if (unit === 'months') {
    interestRate = MONTHLY_RATE;
    periods = duration;
  } else {
    interestRate = WEEKLY_RATE;
    periods = duration;
  }

  const totalInterest = amount * interestRate * periods;
  const totalRepay    = amount + totalInterest;

  // Display results
  document.getElementById('resPrincipal').textContent = formatZAR(amount);
  document.getElementById('resInterest').textContent  = formatZAR(totalInterest);
  document.getElementById('resTotal').textContent     = formatZAR(totalRepay);
  document.getElementById('resDuration').textContent  = `${duration} ${unit === 'months' ? (duration === 1 ? 'month' : 'months') : (duration === 1 ? 'week' : 'weeks')}`;

  // Toggle views
  document.querySelector('.result-placeholder').style.display = 'none';
  const details = document.getElementById('resultDetails');
  details.style.display = 'block';

  // Animate in
  details.style.opacity = '0';
  details.style.transform = 'translateY(10px)';
  requestAnimationFrame(() => {
    details.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    details.style.opacity    = '1';
    details.style.transform  = 'translateY(0)';
  });
}

function formatZAR(amount) {
  return 'R ' + amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function shakeInvalid(...inputs) {
  inputs.forEach(input => {
    if (!input.value || parseFloat(input.value) <= 0) {
      input.style.borderColor = '#e53935';
      input.style.animation   = 'shake 0.4s ease';
      setTimeout(() => {
        input.style.borderColor = '';
        input.style.animation   = '';
      }, 600);
    }
  });
}

// Allow Enter key to trigger calculation
document.getElementById('loanAmount').addEventListener('keydown',   e => { if (e.key === 'Enter') calculateLoan(); });
document.getElementById('loanDuration').addEventListener('keydown', e => { if (e.key === 'Enter') calculateLoan(); });

// Reset result when inputs change
['loanAmount', 'loanDuration', 'durationUnit'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    document.querySelector('.result-placeholder').style.display = 'block';
    document.getElementById('resultDetails').style.display = 'none';
  });
});

// ── CONTACT FORM ─────────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();

  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const btn     = form.querySelector('button[type="submit"]');

  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Simulate submission (no server – opens email client as fallback)
  setTimeout(() => {
    const name    = document.getElementById('fullName').value;
    const phone   = document.getElementById('phone').value;
    const email   = document.getElementById('email').value;
    const loanAmt = document.getElementById('loanReq').value;
    const payDay  = document.getElementById('payDay').value;
    const msg     = document.getElementById('message').value;

    const subject = encodeURIComponent('Loan Application – ' + name);
    const body    = encodeURIComponent(
      `Full Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nLoan Amount: R${loanAmt}\nPay Day: ${payDay}\n\nMessage:\n${msg || 'N/A'}\n\n---\nNote: Please follow up with the applicant to collect the required documents:\n- SA ID / Smart Card\n- Latest Payslip\n- 3 Months Bank Statement\n- Proof of Bank Account`
    );

    window.location.href = `mailto:info@nkosismoneymania.co.za?subject=${subject}&body=${body}`;

    form.style.display    = 'none';
    success.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Submit Application';
  }, 900);
}

// ── SCROLL ANIMATIONS ────────────────────────────────
const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(
  '.service-card, .step, .why-card, .about-grid, .calc-wrapper, .contact-wrapper'
).forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  observer.observe(el);
});

// ────────────────────────────────────────────────────
// CHATBOT
// ────────────────────────────────────────────────────
const chatButton = document.getElementById('chatButton');
const chatWindow = document.getElementById('chatWindow');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatMessages = document.getElementById('chatMessages');

// Auto-open chatbot after 3 seconds on page load
setTimeout(() => {
  if (!chatWindow.classList.contains('open')) {
    chatWindow.classList.add('open');
    chatButton.classList.add('active');
    document.getElementById('chatIconOpen').style.display = 'none';
    document.getElementById('chatIconClose').style.display = 'block';
  }
}, 3000);

// Toggle chat window
chatButton.addEventListener('click', () => {
  chatWindow.classList.toggle('open');
  chatButton.classList.toggle('active');
  const iconOpen  = document.getElementById('chatIconOpen');
  const iconClose = document.getElementById('chatIconClose');
  if (chatWindow.classList.contains('open')) {
    iconOpen.style.display  = 'none';
    iconClose.style.display = 'block';
    chatInput.focus();
  } else {
    iconOpen.style.display  = 'block';
    iconClose.style.display = 'none';
  }
});

// Send message function
function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;
  
  // Add user message
  addMessage(message, 'user');
  chatInput.value = '';
  
  // Auto-scroll to bottom
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 100);
  
  // Simulate bot response
  setTimeout(() => {
    botResponse(message);
  }, 800);
}

// Add message to chat
function addMessage(text, sender = 'bot') {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}`;
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = sender === 'user' ? '👤' : '🤖';
  
  const bubbleContainer = document.createElement('div');
  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  // Render line breaks properly
  bubble.innerHTML = text.replace(/\n/g, '<br>');
  
  bubbleContainer.appendChild(bubble);
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(bubbleContainer);
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Bot response logic
function botResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  let response = '';
  
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    response = 'Hello! How can I assist you with your loan application today?';
  } else if (msg.includes('loan') || msg.includes('apply') || msg.includes('application')) {
    response = 'Great! You can apply for a loan by filling out our application form. We offer amounts from R500 to R10,000. Would you like me to direct you to the application form?';
  } else if (msg.includes('interest') || msg.includes('rate')) {
    response = 'Our interest rate is 40% monthly repayment. You can use our calculator to see exact amounts based on your loan needs.';
  } else if (msg.includes('document') || msg.includes('requirement') || msg.includes('need')) {
    response = 'You\'ll need: Valid ID, Latest payslip, 3 months bank statement, and Proof of bank account. All documents can be uploaded in our application form.';
  } else if (msg.includes('contact') || msg.includes('phone') || msg.includes('email')) {
    response = 'You can reach us at:\n📞 079 788 2238\n📧 info@nkosismoneymania.co.za\n🌐 www.nkosismoneymania.co.za';
  } else if (msg.includes('thank')) {
    response = 'You\'re welcome! Is there anything else I can help you with?';
  } else if (msg.includes('time') || msg.includes('how long') || msg.includes('fast')) {
    response = 'We process applications quickly! Most approvals happen within 24 hours, and funds are typically transferred within 1-2 business days.';
  } else {
    response = 'I\'m here to help! You can ask me about loan applications, interest rates, required documents, or contact information. Would you like to speak with our team directly?';
  }
  
  addMessage(response, 'bot');
}

// Send on button click
chatSendBtn.addEventListener('click', sendMessage);

// Send on Enter key
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Ensure animated elements reset properly if already visible on load
  document.querySelectorAll('.animate-in').forEach(el => {
    el.style.opacity   = '1';
    el.style.transform = 'translateY(0)';
  });
});

// Inject animate-in style
const style = document.createElement('style');
style.textContent = `
  .animate-in { opacity: 1 !important; transform: translateY(0) !important; }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(style);
