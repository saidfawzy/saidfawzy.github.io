/* ==========================================================================
   Said Fawzy Learning - Main Interaction Script (main.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    
    /* 1. تفعيل فتح وإغلاق بطاقات الأكورديون في صفحة التراكات */
    window.toggleTrack = function(trackId) {
        const card = document.getElementById(trackId);
        if (!card) return;
        card.classList.toggle("open");
    };

    /* 2. تفعيل فتح وإغلاق مجموعات التراك (Track Groups Accordion) */
    window.toggleGroup = function(groupId) {
        const targetGroup = document.getElementById(groupId);
        if (!targetGroup) return;

        const isOpen = targetGroup.classList.contains('open');

        const allGroups = document.querySelectorAll('.track-group-accordion');
        allGroups.forEach(group => {
            group.classList.remove('open');
        });

        if (!isOpen) {
            targetGroup.classList.add('open');

            setTimeout(() => {
                const navbarOffset = 90;
                const elementPosition = targetGroup.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 150);
        }
    };

    /* 3. تفعيل فتح وإغلاق الدروس في صفحات الكورسات */
    window.toggleLesson = function(lessonId) {
        const item = document.getElementById(lessonId);
        if (!item) return;
        
        const isOpen = item.classList.contains("open");
        
        // إغلاق باقي الدروس لو تحب أو تركها مفتوحة (هنا سنغلق البقية لترتيب العرض)
        const allLessons = document.querySelectorAll(".lesson-accordion-item");
        allLessons.forEach(l => l.classList.remove("open"));

        if (!isOpen) {
            item.classList.add("open");
        }
    };

    /* 4. نظام التشغيل التلقائي للسلايدر الرئيسي في الصفحة الرئيسية (كل 6 ثوانٍ) */
    const slides = document.querySelectorAll(".carousel-slide");
    const dots = document.querySelectorAll(".carousel-dots-nav .dot");
    
    if (slides.length > 0) {
        let currentIndex = 0;
        const intervalTime = 6000; // 6 ثوانٍ
        let slideTimer;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove("active"));
            dots.forEach(dot => dot.classList.remove("active"));

            if (index >= slides.length) currentIndex = 0;
            if (index < 0) currentIndex = slides.length - 1;

            slides[currentIndex].classList.add("active");
            if (dots[currentIndex]) {
                dots[currentIndex].classList.add("active");
            }
        }

        function nextSlide() {
            currentIndex++;
            if (currentIndex >= slides.length) {
                currentIndex = 0;
            }
            showSlide(currentIndex);
        }

        // بدء الحركة التلقائية
        slideTimer = setInterval(nextSlide, intervalTime);

        // ربط النقاط اليدوية (Dots)
        window.currentSlide = function(index) {
            clearInterval(slideTimer);
            currentIndex = index;
            showSlide(currentIndex);
            slideTimer = setInterval(nextSlide, intervalTime);
        };
    }

});