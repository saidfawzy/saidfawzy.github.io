/**
 * Said Fawzy Learning - Interaction Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. انتقال سلس بين الصفحات (Page Exit Transition)
    const links = document.querySelectorAll('.nav-item, .logo-link');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const destination = this.getAttribute('href');
            if (destination && !destination.startsWith('#') && !this.classList.contains('active')) {
                e.preventDefault();
                document.body.classList.add('page-leaving');
                setTimeout(() => {
                    window.location.href = destination;
                }, 220);
            }
        });
    });
});

/**
 * 2. أكورديون صفحة الكورسات الرئيسية (courses.html)
 */
function toggleTrack(cardId) {
    const targetCard = document.getElementById(cardId);
    if (!targetCard) return;

    const targetBody = targetCard.querySelector('.accordion-body');
    const allCards = document.querySelectorAll('.accordion-track-card');
    const isCurrentlyOpen = targetCard.classList.contains('open');

    allCards.forEach(card => {
        if (card !== targetCard && card.classList.contains('open')) {
            const body = card.querySelector('.accordion-body');
            body.style.height = body.scrollHeight + 'px';
            requestAnimationFrame(() => {
                body.style.height = '0px';
                card.classList.remove('open');
            });
        }
    });

    if (!isCurrentlyOpen) {
        targetCard.classList.add('open');
        targetBody.style.height = targetBody.scrollHeight + 'px';

        const onEnd = () => {
            if (targetCard.classList.contains('open')) {
                targetBody.style.height = 'auto';
            }
            targetBody.removeEventListener('transitionend', onEnd);
        };
        targetBody.addEventListener('transitionend', onEnd);
    } else {
        targetBody.style.height = targetBody.scrollHeight + 'px';
        requestAnimationFrame(() => {
            targetBody.style.height = '0px';
            targetCard.classList.remove('open');
        });
    }
}

/**
 * 3. فتح وإغلاق مجموعات التراك (power-bi/index.html)
 */
function toggleGroup(groupId) {
    const group = document.getElementById(groupId);
    if (group) {
        group.classList.toggle('open');
    }
}

/**
 * 4. نظام فتح كارت درس واحد وغلق الباقي (pl300-part1.html)
 */
function toggleLesson(lessonId) {
    const targetLesson = document.getElementById(lessonId);
    if (!targetLesson) return;

    const allLessons = document.querySelectorAll('.lesson-accordion-item');
    const isCurrentlyOpen = targetLesson.classList.contains('open');

    // إغلاق أي درس مفتوح آخر وإيقاف الفيديو بتاعه
    allLessons.forEach(lesson => {
        if (lesson !== targetLesson && lesson.classList.contains('open')) {
            const iframe = lesson.querySelector('iframe');
            if (iframe) {
                const currentSrc = iframe.src;
                iframe.src = currentSrc;
            }
            lesson.classList.remove('open');
        }
    });

    // تبديل حالة الكارت المختار
    if (!isCurrentlyOpen) {
        targetLesson.classList.add('open');
    } else {
        const iframe = targetLesson.querySelector('iframe');
        if (iframe) {
            const currentSrc = iframe.src;
            iframe.src = currentSrc;
        }
        targetLesson.classList.remove('open');
    }
}