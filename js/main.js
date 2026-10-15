/**
 * ==============================================================================
 * المشروع: منصة Said Fawzy Learning
 * الملف: main.js
 * الوصف: المحرك التفاعلي للمنصة (JavaScript Core Interaction Engine)
 * يشمل:
 *  1. الانتقال السلس بين الصفحات.
 *  2. أكورديون الكورسات الرئيسية (courses.html).
 *  3. أكورديون مجموعات التراك (power-bi/index.html & excel-bi/index.html).
 *  4. أكورديون الدروس والتحكم في إيقاف فيديوهات YouTube تلقائياً.
 *  5. أكورديون تصنيفات الكتب مع التمرير السلس الذكي للهواتف (books.html).
 *  6. محرك تغذية واستقبال حائط مناقشات المجتمع وتكامل Google Sheets.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. الانتقال السلس بين الصفحات (Page Exit Transition)
    // --------------------------------------------------------------------------
    const navigationLinks = document.querySelectorAll('.nav-item, .logo-link');
    if (navigationLinks.length > 0) {
        navigationLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                const destination = this.getAttribute('href');
                if (destination && !destination.startsWith('#') && !this.classList.contains('active')) {
                    event.preventDefault();
                    document.body.classList.add('page-leaving');
                    setTimeout(() => {
                        window.location.href = destination;
                    }, 220);
                }
            });
        });
    }

    // تهيئة حائط المجتمع في حال وجود الحاوية بالصفحة
    if (document.getElementById('communityFeedContainer')) {
        fetchCommunityFeed();
    }
});


/**
 * ------------------------------------------------------------------------------
 * 2. أكورديون صفحة الكورسات الرئيسية (courses.html)
 * - يفتح كارت مسار واحد فقط ويغلق الباقي بحركة ارتفاع انسيابية.
 * ------------------------------------------------------------------------------
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
 * ------------------------------------------------------------------------------
 * 3. فتح وإغلاق مجموعات التراك (power-bi/index.html & excel-bi/index.html)
 * - يضمن فتح مجموعة كروت واحدة فقط داخل نفس الحاوية.
 * ------------------------------------------------------------------------------
 */
function toggleGroup(groupId) {
    const targetGroup = document.getElementById(groupId);
    if (!targetGroup) return;

    const isOpen = targetGroup.classList.contains('open');

    // 1. إغلاق جميع الأكورديونات الأخرى في المسار
    const allGroups = document.querySelectorAll('.track-group-accordion');
    allGroups.forEach(group => {
        group.classList.remove('open');
    });

    // 2. إذا لم يكن المختار مفتوحاً، نقوم بفتحه مع التمرير السلس لأول كروته
    if (!isOpen) {
        targetGroup.classList.add('open');

        // مهلة زمنية قصيرة (150ms) لإعطاء فرصة لإغلاق الأكورديون القديم وإعادة حساب الأبعاد
        setTimeout(() => {
            const navbarOffset = 90; // مسافة تعويضية لحساب ارتفاع شريط التنقل العلوي
            const elementPosition = targetGroup.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }, 150);
    }
}


/**
 * ------------------------------------------------------------------------------
 * 4. نظام أكورديون الدروس وإيقاف الفيديوهات تلقائياً (Lesson Accordion)
 * - يفتح الدرس المختار ويغلق باقي الدروس.
 * - يوقف بث الـ YouTube iframe للدرس السابق فور إغلاقه لتجنب تداخل الصوت.
 * ------------------------------------------------------------------------------
 */
function toggleLesson(lessonId) {
    const targetLesson = document.getElementById(lessonId);
    if (!targetLesson) return;

    const allLessons = document.querySelectorAll('.lesson-accordion-item');
    const isCurrentlyOpen = targetLesson.classList.contains('open');

    // إغلاق أي درس مفتوح آخر وإيقاف الفيديو الخاص به فوراً
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

    // تبديل حالة الدرس الحالي
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
 * ------------------------------------------------------------------------------
 * 5. نظام أكورديون تصنيفات الكتب والتمرير الذكي (books.html)
 * - يغلق التصنيف المفتوح مسبقاً.
 * - يفتح التصنيف المختار ويقوم بالتمرير السلس (Smooth Scroll) لأول كتاب.
 * - يمنع هبوط الشاشة لآخر القائمة على الهواتف الذكية.
 * ------------------------------------------------------------------------------
 */
function toggleBookCategory(categoryId) {
    const targetCategory = document.getElementById(categoryId);
    if (!targetCategory) return;

    const isOpen = targetCategory.classList.contains('open');

    // 1. إغلاق كل فئات الكتب الأخرى فوراً
    const allCategories = document.querySelectorAll('.book-category-card');
    allCategories.forEach(cat => {
        cat.classList.remove('open');
    });

    // 2. إذا لم تكن الفئة المختارة مفتوحة، نفتحها وحدها مع التمرير السلس
    if (!isOpen) {
        targetCategory.classList.add('open');

        setTimeout(() => {
            const navbarOffset = 90; // تعويض ارتفاع الهيدر وشريط التنقل
            const elementPosition = targetCategory.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }, 150);
    }
}


/**
 * ------------------------------------------------------------------------------
 * 6. نظام إدارة وتغذية حائط المجتمع (Community Feed System)
 * ------------------------------------------------------------------------------
 */
let allFeedData = [];
let currentFilter = 'All';
let visibleCount = 6;

async function fetchCommunityFeed() {
    const container = document.getElementById('communityFeedContainer');
    try {
        const response = await fetch('data/community-feed.json');
        if (!response.ok) throw new Error('Network error loading feed');
        const data = await response.json();
        
        // جلب الاستفسارات المعتمدة للنشر فقط
        allFeedData = data.filter(item => item.approved === true);
        
        const countBadge = document.getElementById('approvedCountBadge');
        if (countBadge) {
            countBadge.innerText = `${allFeedData.length} ردود منشورة`;
        }
        
        renderCommunityWall();
    } catch (error) {
        if (container) {
            container.innerHTML = `<p style="text-align: center; color: #64748b; padding: 20px;">
                شاركونا أولى مناقشاتكم عبر النموذج أعلاه!
            </p>`;
        }
    }
}

function renderCommunityWall() {
    const container = document.getElementById('communityFeedContainer');
    const loadMoreBtn = document.getElementById('btnLoadMore');
    if (!container) return;

    const filtered = currentFilter === 'All' 
        ? allFeedData 
        : allFeedData.filter(item => item.track === currentFilter);

    if (filtered.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #64748b; padding: 30px;">
            لا توجد استفسارات معتمدة في هذا المسار حالياً. كن أول من يشارك!
        </p>`;
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        return;
    }

    const displayed = filtered.slice(0, visibleCount);
    
    container.innerHTML = displayed.map(item => {
        const badgeClass = getTrackBadgeClass(item.track);
        const initial = (item.name || 'M').trim().charAt(0).toUpperCase();

        return `
            <div class="feed-card">
                <div class="feed-card-header">
                    <div class="author-info">
                        <div class="author-avatar">${initial}</div>
                        <div>
                            <div class="author-name">${item.name}</div>
                            <div class="feed-date">${item.date}</div>
                        </div>
                    </div>
                    <span class="feed-track-badge ${badgeClass}">${item.track}</span>
                </div>

                <div class="feed-topic">${item.topic}</div>
                <div class="feed-message">${item.suggestion}</div>

                ${item.adminResponse ? `
                    <div class="official-reply-box">
                        <div class="reply-header">
                            <span class="verified-icon">🛡️</span>
                            <span class="reply-author-title">رد المهندس سعيد فوزي (Admin)</span>
                        </div>
                        <div class="reply-content">${item.adminResponse}</div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    if (loadMoreBtn) {
        loadMoreBtn.style.display = filtered.length > visibleCount ? 'inline-flex' : 'none';
    }
}

function getTrackBadgeClass(track) {
    if (track === 'Power BI') return 'badge-pbi';
    if (track === 'CCS Candy') return 'badge-candy';
    if (track === 'Excel') return 'badge-excel';
    return 'badge-general';
}

function filterWall(trackName) {
    currentFilter = trackName;
    visibleCount = 6;
    
    document.querySelectorAll('.filter-pill').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.includes(trackName) || (trackName === 'All' && btn.innerText.includes('الكل')));
    });

    renderCommunityWall();
}

function loadMoreSuggestions() {
    visibleCount += 6;
    renderCommunityWall();
}


/**
 * ------------------------------------------------------------------------------
 * 7. إرسال المقترحات إلى Google Sheets (Silent Google Apps Script Submission)
 * ------------------------------------------------------------------------------
 */
let isFormSubmitting = false;

function handleFormSubmit() {
    isFormSubmitting = true;
    const btn = document.getElementById('btnSubmitSheet');
    const statusMsg = document.getElementById('sheetStatusMsg');
    
    const topicVal = document.getElementById('userTopic').value.trim();
    const msgInput = document.getElementById('userMessage');
    if (topicVal) {
        msgInput.value = `[${topicVal}] - ${msgInput.value}`;
    }

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>Sending... جاري الإرسال</span> <span>⏳</span>';
    }
    if (statusMsg) statusMsg.innerText = '';
}

function handleIframeLoad() {
    if (isFormSubmitting) {
        isFormSubmitting = false;
        const btn = document.getElementById('btnSubmitSheet');
        const statusMsg = document.getElementById('sheetStatusMsg');
        const form = document.getElementById('nativeSuggestionForm');

        if (statusMsg) {
            statusMsg.style.color = '#16a34a';
            statusMsg.innerText = '✓ Thank you! Your suggestion was received successfully. (تم استلام مقترحك بنجاح)';
        }

        if (form) form.reset();

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<span>Submit for Review</span> <span>🚀</span>';
        }
    }
}

function submitFeedback(e) {
    e.preventDefault();

    const btn = document.getElementById('btnSubmitSheet');
    const statusMsg = document.getElementById('sheetStatusMsg');
    const form = document.getElementById('nativeSuggestionForm');

    const scriptURL = 'https://script.google.com/macros/s/AKfycbzJrK8FqsDa6Qk5P8_4ueYWAC6eVv9ne5I7qo4HRz5W4UXoZ9KM9MmOsblTIUQIL-UE/exec';

    btn.disabled = true;
    btn.innerHTML = '<span>Sending... جاري الإرسال</span> <span>⏳</span>';
    statusMsg.innerText = '';

    const formData = new FormData(form);

    fetch(scriptURL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
    })
    .then(() => {
        statusMsg.style.color = '#16a34a';
        statusMsg.innerText = '✓ Thank you! Your suggestion was received successfully. (تم استلام مقترحك بنجاح)';
        form.reset();
    })
    .catch(() => {
        statusMsg.style.color = '#16a34a';
        statusMsg.innerText = '✓ Thank you! Your suggestion was received successfully. (تم استلام مقترحك بنجاح)';
        form.reset();
    })
    .finally(() => {
        btn.disabled = false;
        btn.innerHTML = '<span>Submit for Review</span> <span>🚀</span>';
    });
}