/**
 * Said Fawzy Learning - Interaction Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. انتقال سلس بين الصفحات (Page Exit Transition)
    const links = document.querySelectorAll('.nav-item, .logo-link');
    if (links.length > 0) {
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
    }
});

/**
 * 2. أكورديون صفحة الكورسات الرئيسية (courses.html)
 */
function toggleTrack(cardId) {
    const targetCard = document.getElementById(cardId);
    if (!targetCard) return;

    const targetBody = targetCard.querySelector('.accordion-body');
    if (!targetBody) return;

    const allCards = document.querySelectorAll('.accordion-track-card');
    const isCurrentlyOpen = targetCard.classList.contains('open');

    allCards.forEach(card => {
        if (card !== targetCard && card.classList.contains('open')) {
            const body = card.querySelector('.accordion-body');
            if (body) {
                body.style.height = body.scrollHeight + 'px';
                requestAnimationFrame(() => {
                    body.style.height = '0px';
                    card.classList.remove('open');
                });
            }
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
 * 3. فتح وإغلاق مجموعات التراك (power-bi/index.html) - كارت واحد مفتوح فقط
 */
function toggleGroup(groupId) {
    const targetGroup = document.getElementById(groupId);
    if (!targetGroup) return;

    // استهداف كافة كروت المجموعات
    const parentContainer = targetGroup.parentElement;
    const baseClass = targetGroup.className.replace('open', '').trim().split(' ')[0];
    const allGroups = parentContainer ? parentContainer.children : document.querySelectorAll(`.${baseClass}`);

    const isCurrentlyOpen = targetGroup.classList.contains('open');

    // إغلاق أي كارت مفتوح آخر
    Array.from(allGroups).forEach(group => {
        if (group !== targetGroup && group.classList && group.classList.contains('open')) {
            group.classList.remove('open');
        }
    });

    // فتح الكارت المختار أو غلقه
    if (!isCurrentlyOpen) {
        targetGroup.classList.add('open');
    } else {
        targetGroup.classList.remove('open');
    }
}

/**
 * 4. نظام فتح كارت درس واحد وغلق الباقي وإيقاف الفيديو (pl300-part1.html)
 */
function toggleLesson(lessonId) {
    const targetLesson = document.getElementById(lessonId);
    if (!targetLesson) return;

    const allLessons = document.querySelectorAll('.lesson-accordion-item');
    const isCurrentlyOpen = targetLesson.classList.contains('open');

    // إغلاق أي درس مفتوح آخر وإيقاف تشغيل الفيديو الخاص به
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


/**
 * 5. نظام أكورديون تصنيفات الكتب (books.html)
 */
function toggleBookCategory(catId) {
    const targetCat = document.getElementById(catId);
    if (!targetCat) return;

    const allCats = document.querySelectorAll('.book-category-card');
    const isCurrentlyOpen = targetCat.classList.contains('open');

    // إغلاق أي فئة أخرى مفتوحة
    allCats.forEach(cat => {
        if (cat !== targetCat && cat.classList.contains('open')) {
            cat.classList.remove('open');
        }
    });

    // تبديل حالة الفئة الحالية
    if (!isCurrentlyOpen) {
        targetCat.classList.add('open');
    } else {
        targetCat.classList.remove('open');
    }
}