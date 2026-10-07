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


/**
 * 6. نظام إدارة وتغذية حائط المجتمع (Community Feed System)
 */
let allFeedData = [];
let currentFilter = 'All';
let visibleCount = 6;

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('communityFeedContainer')) {
        fetchCommunityFeed();
    }
});

async function fetchCommunityFeed() {
    const container = document.getElementById('communityFeedContainer');
    try {
        const response = await fetch('data/community-feed.json');
        if (!response.ok) throw new Error('Network error loading feed');
        const data = await response.json();
        
        // تصفية الاقتراحات المعتمدة فقط التي تحمل approved: true
        allFeedData = data.filter(item => item.approved === true);
        
        // تحديث شارة العداد
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

    // تطبيق الفلتر
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

    // إظهار أو إخفاء زر تحميل المزيد
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
    
    // تحديث الأزرار النشطة
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
 * إرسال المقترح صامتاً إلى Google Sheet عبر واجهة الموقع الفخمة
 */


let isFormSubmitting = false;

function handleFormSubmit() {
    isFormSubmitting = true;
    const btn = document.getElementById('btnSubmitSheet');
    const statusMsg = document.getElementById('sheetStatusMsg');
    
    // دمج الموضوع مع الرسالة قبل الإرسال الفعلي
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
    // تتفعل هذه الدالة فور رد خادم جوجل باستلام السجل
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


/**
 * إرسال البيانات مباشرة لشيت الإكسيل عبر Google Apps Script
 */
function submitFeedback(e) {
    e.preventDefault();

    const btn = document.getElementById('btnSubmitSheet');
    const statusMsg = document.getElementById('sheetStatusMsg');
    const form = document.getElementById('nativeSuggestionForm');

    // 1. ضع رابطك المنسوخ هنا بين علامتي التنصيص
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzJrK8FqsDa6Qk5P8_4ueYWAC6eVv9ne5I7qo4HRz5W4UXoZ9KM9MmOsblTIUQIL-UE/exec';

    // تغيير حالة الزر أثناء الإرسال
    btn.disabled = true;
    btn.innerHTML = '<span>Sending... جاري الإرسال</span> <span>⏳</span>';
    statusMsg.innerText = '';

    const formData = new FormData(form);

    // الإرسال في صمت لخادم جوجل
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