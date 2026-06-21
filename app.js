// Developer Portfolio Application Script
document.addEventListener('DOMContentLoaded', () => {
    
    const BASE_URL = window.location.origin;

    // =========================================================================
    // 1. Mobile Menu Navigation & Active Scroll Tracking
    // =========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('open')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });
    }

    // Close menu when clicking link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('open');
            const icon = mobileToggle?.querySelector('i');
            if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
        });
    });

    // Scroll active link highlight
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // =========================================================================
    // 2. Typing Text Effect in Hero
    // =========================================================================
    const typedTextSpan = document.getElementById('typed-text');
    const roles = ["Intelligent Web Apps", "Scalable APIs", "Native Code Automation", "Modern UI/UX"];
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const newWordDelay = 2000;
    let roleIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < roles[roleIndex].length) {
            if (typedTextSpan) {
                typedTextSpan.textContent += roles[roleIndex].charAt(charIndex);
            }
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newWordDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if (typedTextSpan) {
                typedTextSpan.textContent = roles[roleIndex].substring(0, charIndex - 1);
            }
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(type, typingSpeed + 300);
        }
    }

    if (typedTextSpan) {
        setTimeout(type, 1000);
    }

    // =========================================================================
    // 3. Recruiter Matching Engine
    // =========================================================================
    const quizButtons = document.querySelectorAll('.quiz-btn');
    const quizResult = document.getElementById('quiz-result');
    const projectCards = document.querySelectorAll('.project-card');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const skillTags = document.querySelectorAll('.skill-tag');

    // Role recommendations database
    const recruiterData = {
        fullstack: {
            title: "Full-Stack Software Generalist",
            text: "You are looking for someone who can translate designs into flawless code and hook it up to performant database systems. I fit this perfectly! I design modern, responsive React/HTML5 frontends, construct Express API middleware, and manage data endpoints.",
            highlightSkills: ["skill-js", "skill-react", "skill-next", "skill-node", "skill-css", "skill-sql"],
            projectFilter: "fullstack",
            timelineFilter: "fullstack"
        },
        backend: {
            title: "Backend & Systems Specialist",
            text: "Your team needs strong API designs, database query speedups, server configurations, and task automation. I build robust microservice utilities, optimize database indices, and design light scripts (like this PowerShell backend server running on your system!).",
            highlightSkills: ["skill-node", "skill-python", "skill-powershell", "skill-sql", "skill-git"],
            projectFilter: "backend",
            timelineFilter: "backend"
        },
        frontend: {
            title: "Frontend & Interactive Visual Developer",
            text: "You want a developer who obsesses over visual performance, smooth keyframe animations, accessibility, and clean component structures. I specialize in HTML5 Canvas graphics, custom CSS variables, and modern client-side application state management.",
            highlightSkills: ["skill-js", "skill-react", "skill-next", "skill-css", "skill-canvas"],
            projectFilter: "frontend",
            timelineFilter: "frontend"
        }
    };

    quizButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active button
            quizButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const role = btn.getAttribute('data-role');
            const data = recruiterData[role];

            // Render customized response
            if (quizResult && data) {
                quizResult.classList.add('active');
                quizResult.innerHTML = `
                    <div class="result-content">
                        <h4><i class="fa-solid fa-circle-check"></i> Matching Profile: ${data.title}</h4>
                        <p>${data.text}</p>
                    </div>
                `;
                
                // Track interaction on backend
                postInteraction();
            }

            // Highlight and dim projects based on relevance
            projectCards.forEach(card => {
                const tags = card.getAttribute('data-tags').split(' ');
                if (tags.includes(data.projectFilter)) {
                    card.classList.remove('dimmed');
                    card.classList.add('highlight');
                } else {
                    card.classList.add('dimmed');
                    card.classList.remove('highlight');
                }
            });

            // Highlight relevant Timeline points
            timelineItems.forEach(item => {
                const rolesAttr = item.getAttribute('data-roles').split(' ');
                if (rolesAttr.includes(data.timelineFilter)) {
                    item.classList.remove('dimmed');
                    item.classList.add('highlight');
                } else {
                    item.classList.add('dimmed');
                    item.classList.remove('highlight');
                }
            });

            // Highlight matching skill tags
            skillTags.forEach(tag => {
                const tagId = tag.getAttribute('id');
                if (data.highlightSkills.includes(tagId)) {
                    tag.style.borderColor = 'var(--color-cyan)';
                    tag.style.background = 'rgba(0, 242, 254, 0.12)';
                    tag.style.boxShadow = '0 0 10px rgba(0, 242, 254, 0.2)';
                } else {
                    tag.style.borderColor = 'var(--border-card)';
                    tag.style.background = 'rgba(255, 255, 255, 0.03)';
                    tag.style.boxShadow = 'none';
                }
            });
        });
    });

    // =========================================================================
    // 4. Server Analytics Dashboard Integration
    // =========================================================================
    const viewsCount = document.getElementById('stat-views');
    const interactionsCount = document.getElementById('stat-interactions');
    const messagesCount = document.getElementById('stat-messages');

    const viewsBar = document.getElementById('views-bar');
    const interactionsBar = document.getElementById('interactions-bar');
    const messagesBar = document.getElementById('messages-bar');

    // Fetch site analytics from server API
    async function fetchStats() {
        try {
            const res = await fetch(`${BASE_URL}/api/analytics`);
            if (res.ok) {
                const data = await res.json();
                
                // Update numbers in DOM
                if (viewsCount) viewsCount.textContent = data.views;
                if (interactionsCount) interactionsCount.textContent = data.interactions;
                if (messagesCount) messagesCount.textContent = data.messages_count;

                // Adjust progress bars (relative to visual thresholds)
                if (viewsBar) viewsBar.style.width = `${Math.min((data.views / 200) * 100, 100)}%`;
                if (interactionsBar) interactionsBar.style.width = `${Math.min((data.interactions / 100) * 100, 100)}%`;
                if (messagesBar) messagesBar.style.width = `${Math.min((data.messages_count / 20) * 100, 100)}%`;
            }
        } catch (err) {
            console.error("Could not fetch database stats:", err);
        }
    }

    // Register a visitor view
    async function registerPageView() {
        try {
            await fetch(`${BASE_URL}/api/analytics/view`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            // Fetch stats once registered
            fetchStats();
        } catch (err) {
            console.error("Could not register page view:", err);
            // Fallback: Fetch stats anyway
            fetchStats();
        }
    }

    // Track a user interaction (like clicking recruiter quiz or opening chat)
    async function postInteraction() {
        try {
            // We use the chatbot API trigger with a dummy trigger, or send contacts to count as interactions
            // The server increments interactions on `/api/contact` and `/api/chat` calls automatically.
            // For simple quiz clicks, we can hit the chat API with a dummy message to increment metrics.
            await fetch(`${BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: "## quiz_click_interaction ##" })
            });
            fetchStats();
        } catch (err) {
            console.error("Could not post interaction count:", err);
        }
    }

    // Initialize stats
    registerPageView();

    // =========================================================================
    // 5. Contact Form Submissions
    // =========================================================================
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('btn-submit');
    const submitText = document.getElementById('submit-text');
    const submitSpinner = document.getElementById('submit-spinner');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const message = document.getElementById('form-message').value;

            // Loading state
            if (submitSpinner) submitSpinner.classList.remove('hidden');
            if (submitText) submitText.textContent = "Sending...";
            if (submitBtn) submitBtn.disabled = true;
            if (formFeedback) {
                formFeedback.classList.add('hidden');
                formFeedback.className = 'form-feedback';
            }

            try {
                const res = await fetch(`${BASE_URL}/api/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, message })
                });

                const data = await res.json();

                if (res.ok && data.success) {
                    // Success state
                    if (formFeedback) {
                        formFeedback.classList.remove('hidden');
                        formFeedback.classList.add('success');
                        formFeedback.textContent = data.message;
                    }
                    contactForm.reset();
                    fetchStats(); // Update counters on dashboard
                } else {
                    throw new Error(data.error || "Failed to deliver message.");
                }
            } catch (err) {
                // Error state
                if (formFeedback) {
                    formFeedback.classList.remove('hidden');
                    formFeedback.classList.add('error');
                    formFeedback.textContent = err.message || "Server connection error. Please try again later.";
                }
            } finally {
                if (submitSpinner) submitSpinner.classList.add('hidden');
                if (submitText) submitText.textContent = "Send Message";
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

    // =========================================================================
    // 6. Interactive AI Clone Chatbot Widget
    // =========================================================================
    const chatWidget = document.getElementById('chat-widget');
    const chatTrigger = document.getElementById('chat-trigger');
    const chatContainer = document.getElementById('chat-container');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');
    const chatBadge = chatTrigger?.querySelector('.chat-notification');

    // Toggle Chat Widget Open/Close
    if (chatTrigger && chatContainer) {
        chatTrigger.addEventListener('click', () => {
            chatContainer.classList.add('open');
            // Hide badge when opened
            if (chatBadge) chatBadge.classList.add('hidden');
        });
    }

    if (chatClose && chatContainer) {
        chatClose.addEventListener('click', () => {
            chatContainer.classList.remove('open');
        });
    }

    // Handle Sending Chat Messages
    async function handleChatSubmit() {
        if (!chatInput) return;
        const messageText = chatInput.value.trim();
        if (!messageText) return;

        // Clear input
        chatInput.value = '';

        // Append user message to window
        appendMessage(messageText, 'user');

        // Show typing indicator
        const typingIndicator = showTypingIndicator();

        try {
            const res = await fetch(`${BASE_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: messageText })
            });

            // Remove typing indicator
            typingIndicator.remove();

            if (res.ok) {
                const data = await res.json();
                appendMessage(data.reply, 'bot');
                fetchStats(); // Update dashboard click interactions
            } else {
                appendMessage("My server modules had an issue processing this message. Please ask again!", 'bot');
            }
        } catch (err) {
            typingIndicator.remove();
            appendMessage("I couldn't reach my API. Is the server running? Feel free to contact me directly via email!", 'bot');
        }
    }

    if (chatSend) {
        chatSend.addEventListener('click', handleChatSubmit);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleChatSubmit();
            }
        });
    }

    // Helper: Append chat bubble to DOM
    function appendMessage(text, sender) {
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.innerHTML = text; // Safe parsing as server replies return structured HTML
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        // Scroll messages to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Helper: Render typing dots
    function showTypingIndicator() {
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'bot-message');
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        
        const indicator = document.createElement('div');
        indicator.classList.add('typing-indicator');
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        contentDiv.appendChild(indicator);
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return messageDiv;
    }
});
