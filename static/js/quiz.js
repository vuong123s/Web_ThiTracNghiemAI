/**
 * QuizFlow - Quiz Timer and Interactions
 */

class QuizTimer {
    constructor(durationSeconds, onTimeUp) {
        this.duration = durationSeconds;
        this.remaining = durationSeconds;
        this.onTimeUp = onTimeUp;
        this.timerInterval = null;
        this.timerElement = document.getElementById('quiz-timer');
        this.timerDisplay = document.getElementById('timer-display');
    }

    start() {
        this.timerInterval = setInterval(() => {
            this.remaining--;
            this.updateDisplay();

            if (this.remaining <= 300 && this.remaining > 60) {
                this.timerElement.classList.add('warning');
                this.timerElement.classList.remove('danger');
            } else if (this.remaining <= 60) {
                this.timerElement.classList.add('danger');
                this.timerElement.classList.remove('warning');
            }

            if (this.remaining <= 0) {
                this.stop();
                this.onTimeUp();
            }
        }, 1000);
    }

    stop() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.remaining / 60);
        const seconds = this.remaining % 60;
        this.timerDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    getTimeSpent() {
        return this.duration - this.remaining;
    }
}

class QuizManager {
    constructor(quizId, totalQuestions) {
        this.quizId = quizId;
        this.totalQuestions = totalQuestions;
        this.currentQuestion = 0;
        this.answers = {};
        this.questionCards = document.querySelectorAll('.question-card');
        this.navItems = document.querySelectorAll('.question-nav-item');
        this.progressBar = document.querySelector('.progress-bar');
        this.progressText = document.getElementById('progress-text');
        
        this.init();
    }

    init() {
        // Show first question
        this.showQuestion(0);
        
        // Set up option click handlers
        document.querySelectorAll('.option-item').forEach(option => {
            option.addEventListener('click', (e) => this.selectOption(e));
        });

        // Set up navigation
        this.navItems.forEach((item, index) => {
            item.addEventListener('click', () => this.showQuestion(index));
        });

        // Previous/Next buttons
        document.getElementById('btn-prev')?.addEventListener('click', () => this.prevQuestion());
        document.getElementById('btn-next')?.addEventListener('click', () => this.nextQuestion());
    }

    showQuestion(index) {
        if (index < 0 || index >= this.totalQuestions) return;

        // Hide all questions
        this.questionCards.forEach(card => {
            card.style.display = 'none';
        });

        // Show current question
        this.questionCards[index].style.display = 'block';

        // Update navigation
        this.navItems.forEach((item, i) => {
            item.classList.remove('current');
            if (i === index) {
                item.classList.add('current');
            }
        });

        this.currentQuestion = index;
        this.updateProgress();
        this.updateButtons();
    }

    selectOption(e) {
        const optionItem = e.currentTarget;
        const questionId = optionItem.dataset.questionId;
        const answer = optionItem.dataset.answer;
        const questionCard = optionItem.closest('.question-card');

        // Remove selection from other options in this question
        questionCard.querySelectorAll('.option-item').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Select this option
        optionItem.classList.add('selected');

        // Store answer
        this.answers[questionId] = answer;

        // Update the hidden input
        const hiddenInput = document.getElementById(`answer-${questionId}`);
        if (hiddenInput) {
            hiddenInput.value = answer;
        }

        // Mark question as answered in nav
        const navItem = this.navItems[this.currentQuestion];
        navItem.classList.add('answered');

        // Auto-save to server (optional)
        this.saveAnswer(questionId, answer);
    }

    async saveAnswer(questionId, answer) {
        try {
            await fetch('/quiz/api/save-answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quiz_id: this.quizId,
                    question_id: questionId,
                    answer: answer
                })
            });
        } catch (error) {
            console.log('Auto-save failed, answers will be submitted with form');
        }
    }

    prevQuestion() {
        if (this.currentQuestion > 0) {
            this.showQuestion(this.currentQuestion - 1);
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions - 1) {
            this.showQuestion(this.currentQuestion + 1);
        }
    }

    updateProgress() {
        const answered = Object.keys(this.answers).length;
        const percentage = (answered / this.totalQuestions) * 100;
        
        if (this.progressBar) {
            this.progressBar.style.width = `${percentage}%`;
        }
        
        if (this.progressText) {
            this.progressText.textContent = `${answered}/${this.totalQuestions} câu đã trả lời`;
        }
    }

    updateButtons() {
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        
        if (btnPrev) {
            btnPrev.disabled = this.currentQuestion === 0;
        }
        
        if (btnNext) {
            if (this.currentQuestion === this.totalQuestions - 1) {
                btnNext.textContent = 'Hoàn thành';
                btnNext.onclick = () => this.confirmSubmit();
            } else {
                btnNext.innerHTML = 'Tiếp theo <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
                btnNext.onclick = () => this.nextQuestion();
            }
        }
    }

    confirmSubmit() {
        const answered = Object.keys(this.answers).length;
        const unanswered = this.totalQuestions - answered;
        
        let message = 'Bạn có chắc chắn muốn nộp bài?';
        if (unanswered > 0) {
            message = `Bạn còn ${unanswered} câu chưa trả lời. Bạn có chắc chắn muốn nộp bài?`;
        }
        
        if (confirm(message)) {
            this.submitQuiz();
        }
    }

    submitQuiz() {
        document.getElementById('quiz-form').submit();
    }

    forceSubmit() {
        // Called when time is up
        showToast('Hết thời gian!', 'Bài thi của bạn đã được tự động nộp.', 'warning');
        setTimeout(() => {
            this.submitQuiz();
        }, 1500);
    }
}

// Toast notification function
function showToast(title, message, type = 'info') {
    const container = document.querySelector('.toast-container') || createToastContainer();
    
    const icons = {
        success: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
        danger: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
        warning: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
        info: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            ${message ? `<div class="toast-message">${message}</div>` : ''}
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
    `;

    container.appendChild(toast);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize quiz if on quiz page
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
        const quizId = quizContainer.dataset.quizId;
        const totalQuestions = parseInt(quizContainer.dataset.totalQuestions);
        const durationSeconds = parseInt(quizContainer.dataset.duration);

        const quizManager = new QuizManager(quizId, totalQuestions);
        const timer = new QuizTimer(durationSeconds, () => quizManager.forceSubmit());
        timer.start();

        // Store globally for access
        window.quizManager = quizManager;
        window.quizTimer = timer;
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        const closeMobileMenu = () => mobileMenu.classList.remove('show');

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('show');
        });

        document.addEventListener('click', (event) => {
            const clickedInsideMenu = mobileMenu.contains(event.target);
            const clickedMenuButton = mobileMenuBtn.contains(event.target);
            if (!clickedInsideMenu && !clickedMenuButton) {
                closeMobileMenu();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        });

        closeMobileMenu();
    }
});

// Confirm before leaving quiz page
window.addEventListener('beforeunload', function(e) {
    if (window.quizManager && Object.keys(window.quizManager.answers).length > 0) {
        e.preventDefault();
        e.returnValue = '';
    }
});
