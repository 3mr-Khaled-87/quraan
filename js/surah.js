// ========================================================
// Quran Surah Page - Logic, Interactions, Audio & Swipe
// ========================================================

const URLParams = new URLSearchParams(window.location.search);
const rawSurahNumber = URLParams.get('surah');
let SurahNumber = rawSurahNumber ? parseInt(rawSurahNumber) : 1;
if (isNaN(SurahNumber) || SurahNumber < 1 || SurahNumber > 114) SurahNumber = 1;

let allSurahsInfoCache = [];

const ayat = document.getElementById('ayat-text');
const SurahAyaytAPI = `https://quran.yousefheiba.com/api/ayah?number=${SurahNumber}`;
const SurahInfoAPI = `https://quran.yousefheiba.com/api/surahs`;

// ========================================================
// 114 SURAHS STARTING PAGES (مصحف المدينة المنورة ٦٠٤ صفحة)
// ========================================================
const SURAH_START_PAGES = [
    1,   // 1. الفاتحة
    2,   // 2. البقرة
    50,  // 3. آل عمران
    77,  // 4. النساء
    106, // 5. المائدة
    128, // 6. الأنعام
    151, // 7. الأعراف
    177, // 8. الأنفال
    187, // 9. التوبة
    208, // 10. يونس
    221, // 11. هود
    235, // 12. يوسف
    249, // 13. الرعد
    255, // 14. إبراهيم
    262, // 15. الحجر
    267, // 16. النحل
    282, // 17. الإسراء
    293, // 18. الكهف
    305, // 19. مريم
    312, // 20. طه
    322, // 21. الأنبياء
    332, // 22. الحج
    342, // 23. المؤمنون
    350, // 24. النور
    359, // 25. الفرقان
    367, // 26. الشعراء
    377, // 27. النمل
    385, // 28. القصص
    396, // 29. العنكبوت
    404, // 30. الروم
    411, // 31. لقمان
    415, // 32. السجدة
    418, // 33. الأحزاب
    428, // 34. سبأ
    434, // 35. فاطر
    440, // 36. يس
    446, // 37. الصافات
    453, // 38. ص
    458, // 39. الزمر
    467, // 40. غافر
    477, // 41. فصلت
    483, // 42. الشورى
    489, // 43. الزخرف
    496, // 44. الدخان
    499, // 45. الجاثية
    502, // 46. الأحقاف
    507, // 47. محمد
    511, // 48. الفتح
    515, // 49. الحجرات
    518, // 50. ق
    520, // 51. الذاريات
    523, // 52. الطور
    526, // 53. النجم
    528, // 54. القمر
    531, // 55. الرحمن
    534, // 56. الواقعة
    537, // 57. الحديد
    542, // 58. المجادلة
    545, // 59. الحشر
    549, // 60. الممتحنة
    551, // 61. الصف
    553, // 62. الجمعة
    554, // 63. المنافقون
    556, // 64. التغابن
    558, // 65. الطلاق
    560, // 66. التحريم
    562, // 67. الملك
    564, // 68. القلم
    566, // 69. الحاقة
    568, // 70. المعارج
    570, // 71. نوح
    572, // 72. الجن
    574, // 73. المزمل
    575, // 74. المدثر
    577, // 75. القيامة
    578, // 76. الإنسان
    580, // 77. المرسلات
    582, // 78. النبأ
    583, // 79. النازعات
    585, // 80. عبس
    586, // 81. التكوير
    587, // 82. الانفطار
    587, // 83. المطففين
    589, // 84. الانشقاق
    590, // 85. البروج
    591, // 86. الطارق
    591, // 87. الأعلى
    592, // 88. الغاشية
    593, // 89. الفجر
    594, // 90. البلد
    595, // 91. الشمس
    595, // 92. الليل
    596, // 93. الضحى
    596, // 94. الشرح
    597, // 95. التين
    597, // 96. العلق
    598, // 97. القدر
    598, // 98. البينة
    599, // 99. الزلزلة
    599, // 100. العاديات
    600, // 101. القارعة
    600, // 102. التكاثر
    601, // 103. العصر
    601, // 104. الهمزة
    601, // 105. الفيل
    602, // 106. قريش
    602, // 107. الماعون
    602, // 108. الكوثر
    603, // 109. الكافرون
    603, // 110. النصر
    603, // 111. المسد
    604, // 112. الإخلاص
    604, // 113. الفلق
    604  // 114. الناس
];

function getSurahStartPage(surahNum) {
    if (surahNum >= 1 && surahNum <= 114) {
        return SURAH_START_PAGES[surahNum - 1];
    }
    return 1;
}

function getSurahForPage(pageNum) {
    let surahNum = 1;
    for (let i = 0; i < SURAH_START_PAGES.length; i++) {
        if (SURAH_START_PAGES[i] <= pageNum) {
            surahNum = i + 1;
        } else {
            break;
        }
    }
    return surahNum;
}



function toArabicDigits(num) {
    if (num === undefined || num === null) return '';
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/[0-9]/g, digit => arabicDigits[+digit]);
}

// ========================================================
// 1. THEME MANAGEMENT (Dark / Light Mode)
// ========================================================
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');

function applyStoredTheme() {
    const isDark = localStorage.getItem('darkmode') === 'dark';
    if (isDark) {
        document.body.classList.add('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    } else {
        document.body.classList.remove('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkmode', isDark ? 'dark' : '');
        if (themeIcon) {
            if (isDark) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
    });
}
applyStoredTheme();
window.addEventListener('storage', applyStoredTheme);

// ========================================================
// 2. FONT SIZE CONTROLS
// ========================================================
const fontIncreaseBtn = document.getElementById('fontIncreaseBtn');
const fontDecreaseBtn = document.getElementById('fontDecreaseBtn');
let currentFontSize = parseInt(localStorage.getItem('quranFontSize')) || 24;

function setQuranFontSize(size) {
    currentFontSize = Math.min(Math.max(size, 18), 38);
    localStorage.setItem('quranFontSize', currentFontSize);
    if (ayat) {
        ayat.style.fontSize = `${currentFontSize}px`;
    }
}

if (fontIncreaseBtn) {
    fontIncreaseBtn.addEventListener('click', () => setQuranFontSize(currentFontSize + 2));
}

if (fontDecreaseBtn) {
    fontDecreaseBtn.addEventListener('click', () => setQuranFontSize(currentFontSize - 2));
}
setQuranFontSize(currentFontSize);

// ========================================================
// 3. FETCH SURAH INFO & METADATA
// ========================================================
async function getSurahInfo() {
    try {
        const res = await fetch(SurahInfoAPI);
        const data = await res.json();
        allSurahsInfoCache = data;
        const surah = data.find(s => parseInt(s.number) === SurahNumber);
        
        if (surah) {
            document.title = `${surah.name_ar} - القرآن الكريم`;

            const surahTitle = document.getElementById('surahTitle');
            if (surahTitle) surahTitle.textContent = `${surah.name_ar}`;

            const navSurahName = document.getElementById('navSurahName');
            if (navSurahName) navSurahName.textContent = `${surah.name_ar}`;

            localStorage.setItem("surahNAme" , surah.name_ar)

            const surahType = document.getElementById('surahType');
            if (surahType) {
                const isMakki = surah.type === 'Meccan';
                surahType.innerHTML = isMakki
                    ? `<i class="fa-solid fa-kaaba"></i> مكية`
                    : `<i class="fa-solid fa-mosque"></i> مدنية`;
            }

            const surahAyatCount = document.getElementById('surahAyatCount');
            if (surahAyatCount) {
                surahAyatCount.innerHTML = `<i class="fa-solid fa-feather-pointed"></i> ${toArabicDigits(surah.ayat_count)} آية`;
            }

            const surahOrder = document.getElementById('surahOrder');
            if (surahOrder) {
                surahOrder.textContent = `ترتيبها بالمصحف: ${toArabicDigits(surah.number)}`;
            }

            const bismillahContainer = document.getElementById('bismillahContainer');
            if (bismillahContainer && (SurahNumber === 1 || SurahNumber === 9)) {
                bismillahContainer.style.display = 'none';
            }

            let ayatCount = surah.ayat_count
            localStorage.setItem("ayat_count" , ayatCount)
        }
        updateStepperButtons();
    } catch (err) {
        console.error('Error fetching surah info:', err);
        // Fallback to offline names
        const fallbackName = getSurahName(SurahNumber);
        const navSurahName = document.getElementById('navSurahName');
        if (navSurahName && fallbackName) navSurahName.textContent = fallbackName;
        updateStepperButtons();
    }
}

function updateStepperButtons() {
    if (prevBtn) {
        if (SurahNumber <= 1) {
            prevBtn.style.opacity = '0.35';
            prevBtn.style.pointerEvents = 'none';
        } else {
            prevBtn.style.opacity = '1';
            prevBtn.style.pointerEvents = 'auto';
        }
    }
    if (nextBtn) {
        if (SurahNumber >= 114) {
            nextBtn.style.opacity = '0.35';
            nextBtn.style.pointerEvents = 'none';
        } else {
            nextBtn.style.opacity = '1';
            nextBtn.style.pointerEvents = 'auto';
        }
    }
}

// Automatically called when page number points to a different Surah
function onSurahAutoChanged(newSurahNum) {
    const surahFullName = getSurahName(newSurahNum);

    // 1. Update Navbar title chip
    const navSurahName = document.getElementById('navSurahName');
    if (navSurahName) {
        navSurahName.textContent = surahFullName;
    }

    // 2. Update document title
    document.title = `${surahFullName} - القرآن الكريم`;

    // 3. Update URL without reload
    try {
        const newUrl = `${window.location.pathname}?surah=${newSurahNum}`;
        window.history.replaceState({ surah: newSurahNum }, '', newUrl);
    } catch (e) {}

    // 4. Update stepper buttons state
    updateStepperButtons();

    // 5. Update surah banner metadata
    const surahTitle = document.getElementById('surahTitle');
    if (surahTitle) surahTitle.textContent = surahFullName;
    const surahOrder = document.getElementById('surahOrder');
    if (surahOrder) surahOrder.textContent = `ترتيبها بالمصحف: ${toArabicDigits(newSurahNum)}`;

    if (allSurahsInfoCache.length > 0) {
        const found = allSurahsInfoCache.find(s => parseInt(s.number) === newSurahNum);
        if (found) {
            const surahType = document.getElementById('surahType');
            if (surahType) {
                const isMakki = found.type === 'Meccan';
                surahType.innerHTML = isMakki
                    ? `<i class="fa-solid fa-kaaba"></i> مكية`
                    : `<i class="fa-solid fa-mosque"></i> مدنية`;
            }
            const surahAyatCount = document.getElementById('surahAyatCount');
            if (surahAyatCount) {
                surahAyatCount.innerHTML = `<i class="fa-solid fa-feather-pointed"></i> ${toArabicDigits(found.ayat_count)} آية`;
            }
        }
    }

    // 6. Update Audio player source if playing or opened
    if (quranAudio && quranAudio.src) {
        const wasPlaying = !quranAudio.paused;
        updateAudioSource(wasPlaying);
    }
}

// ========================================================
// 4. FETCH SURAH AYAHS
// ========================================================
let rawAyahsList = [];

async function getSurahAyahs() {
    try {
        const res = await fetch(SurahAyaytAPI);
        const data = await res.json();
        rawAyahsList = data;
        renderAyahs(rawAyahsList);

        if (data.length > 0 && data[0].page) {
            const apiFirstPage = parseInt(data[0].page);
            if (!isNaN(apiFirstPage) && apiFirstPage >= 1 && apiFirstPage <= 604) {
                if (isPageView && currentPage === getSurahStartPage(SurahNumber)) {
                    currentPage = apiFirstPage;
                    showPage(currentPage);
                }
            }
        }
    } catch (err) {
        console.error('Error fetching surah ayahs:', err);
        if (ayat) {
            ayat.innerHTML = '<div class="text-center p-4 text-danger">حدث خطأ في تحميل الآيات، يرجى المحاولة مرة أخرى.</div>';
        }
    }
}

function renderAyahs(ayahsData, highlightQuery = '') {
    if (!ayat) return;
    let html = '';

    ayahsData.forEach(aya => {
        let text = aya.text;
        if (highlightQuery) {
            const regex = new RegExp(`(${highlightQuery})`, 'gi');
            text = text.replace(regex, `<mark class="search-highlight">$1</mark>`);
        }
        html += `
            <span class="text" data-aya="${aya.number_in_surah}">${text}</span>
            <span class="number"> ﴿${toArabicDigits(aya.number_in_surah)}﴾ </span>
        `;
    });

    ayat.innerHTML = html;
    ayat.classList.add('fade-in');
}

getSurahInfo();
getSurahAyahs();

// ========================================================
// 5. SURAH NAVIGATION (Next / Prev)
// ========================================================
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (SurahNumber < 114) {
            const nextSurah = SurahNumber + 1;
            if (isPageView) {
                const targetPage = getSurahStartPage(nextSurah);
                showPage(targetPage, 'next');
            } else {
                window.location.href = `surah.html?surah=${nextSurah}`;
            }
        }
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (SurahNumber > 1) {
            const prevSurah = SurahNumber - 1;
            if (isPageView) {
                const targetPage = getSurahStartPage(prevSurah);
                showPage(targetPage, 'prev');
            } else {
                window.location.href = `surah.html?surah=${prevSurah}`;
            }
        }
    });
}
updateStepperButtons();

// ========================================================
// 6. INSTANT SEARCH IN AYAHS
// ========================================================
const ayahSearchInput = document.getElementById('ayahSearchInput');
const searchClearBtn = document.getElementById('searchClearBtn');
const searchStats = document.getElementById('searchStats');

if (ayahSearchInput) {
    ayahSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();

        if (searchClearBtn) {
            searchClearBtn.style.display = query ? 'block' : 'none';
        }

        if (!query) {
            renderAyahs(rawAyahsList);
            if (searchStats) searchStats.style.display = 'none';
            return;
        }

        const matches = rawAyahsList.filter(a => a.text.includes(query));
        renderAyahs(rawAyahsList, query);

        if (searchStats) {
            searchStats.style.display = 'block';
            searchStats.textContent = `تم العثور على ${toArabicDigits(matches.length)} نتيجة`;
        }

        const firstMatch = document.querySelector('.search-highlight');
        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
        if (ayahSearchInput) {
            ayahSearchInput.value = '';
            ayahSearchInput.dispatchEvent(new Event('input'));
            ayahSearchInput.focus();
        }
    });
}

// ========================================================
// 7. FULLSCREEN PAGE IMAGE VIEW (مع التخزين المحلي والسحب)
// ========================================================
const viewToggleBtn = document.getElementById('viewToggleBtn');
const textView = document.getElementById('textView');
const pageImageView = document.getElementById('pageImageView');
const pageStage = document.getElementById('pageStage');
const pageImageFrame = document.getElementById('pageImageFrame');
const pageImage = document.getElementById('pageImage');
const pageLoading = document.getElementById('pageLoading');
const pagePrevBtn = document.getElementById('pagePrevBtn');
const pageNextBtn = document.getElementById('pageNextBtn');
const sideNextBtn = document.getElementById('sideNextBtn');
const sidePrevBtn = document.getElementById('sidePrevBtn');
const pageJumpInput = document.getElementById('pageJumpInput');

const VIEW_MODE_KEY = 'quran_view_mode';
const TOTAL_PAGES = 604;
let isPageView = false;

// Initialize to chosen surah's starting page
let currentPage = getSurahStartPage(SurahNumber);

function setViewMode(mode) {
    isPageView = (mode === 'pages');
    localStorage.setItem(VIEW_MODE_KEY, mode);

    if (isPageView) {
        textView.classList.add('hidden');
        pageImageView.classList.add('active');
        document.body.classList.add('page-mode-active');

        viewToggleBtn.innerHTML = '<i class="fa-solid fa-book-open"></i><span class="toggle-text">قراءة النص</span>';
        viewToggleBtn.classList.add('active-page-mode');

        showPage(currentPage);
    } else {
        textView.classList.remove('hidden');
        pageImageView.classList.remove('active');
        document.body.classList.remove('page-mode-active');

        viewToggleBtn.innerHTML = '<i class="fa-solid fa-image"></i><span class="toggle-text">صفحات المصحف</span>';
        viewToggleBtn.classList.remove('active-page-mode');
    }
}

if (viewToggleBtn) {
    viewToggleBtn.addEventListener('click', () => {
        setViewMode(isPageView ? 'text' : 'pages');
    });
}

function showPage(pageNum, direction = 'none') {
    if (pageNum < 1 || pageNum > TOTAL_PAGES) return;

    currentPage = pageNum;

    // Automatically update Surah in header when navigating/scrolling to another Surah's pages
    const pageSurahNum = getSurahForPage(pageNum);
    if (pageSurahNum && pageSurahNum !== SurahNumber) {
        SurahNumber = pageSurahNum;
        onSurahAutoChanged(pageSurahNum);
    }

    pageLoading.style.display = 'flex';
    pageImage.style.display = 'none';

    pageImage.classList.remove('slide-from-right', 'slide-from-left');

    const paddedNum = String(pageNum).padStart(3, '0');
    const imageUrl = `https://quran.yousefheiba.com/api/quran-pages/${paddedNum}.png`;

    pageImage.onload = () => {
        pageLoading.style.display = 'none';
        pageImage.style.display = 'block';

        if (direction === 'next') {
            pageImage.classList.add('slide-from-right');
        } else if (direction === 'prev') {
            pageImage.classList.add('slide-from-left');
        } else {
            pageImage.classList.add('fade-in');
        }
    };

    pageImage.onerror = () => {
        pageLoading.style.display = 'none';
        pageImage.style.display = 'block';
        pageImage.alt = 'خطأ في تحميل الصفحة';
    };

    pageImage.src = imageUrl;

    if (pageJumpInput) pageJumpInput.value = pageNum;
    updateNavButtonsState();
}

function updateNavButtonsState() {
    const isFirst = (currentPage <= 1);
    const isLast = (currentPage >= TOTAL_PAGES);

    if (pagePrevBtn) pagePrevBtn.disabled = isFirst;
    if (sidePrevBtn) {
        sidePrevBtn.disabled = isFirst;
        sidePrevBtn.style.opacity = isFirst ? '0.3' : '1';
    }

    if (pageNextBtn) pageNextBtn.disabled = isLast;
    if (sideNextBtn) {
        sideNextBtn.disabled = isLast;
        sideNextBtn.style.opacity = isLast ? '0.3' : '1';
    }
}

function goToNextPage() {
    if (currentPage < TOTAL_PAGES) {
        showPage(currentPage + 1, 'next');
    }
}

function goToPrevPage() {
    if (currentPage > 1) {
        showPage(currentPage - 1, 'prev');
    }
}

if (pageNextBtn) pageNextBtn.addEventListener('click', goToNextPage);
if (sideNextBtn) sideNextBtn.addEventListener('click', goToNextPage);

if (pagePrevBtn) pagePrevBtn.addEventListener('click', goToPrevPage);
if (sidePrevBtn) sidePrevBtn.addEventListener('click', goToPrevPage);

window.addEventListener('keydown', (e) => {
    if (!isPageView) return;
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;

    if (e.key === 'ArrowRight') {
        goToNextPage();
    } else if (e.key === 'ArrowLeft') {
        goToPrevPage();
    }
});

if (pageJumpInput) {
    pageJumpInput.addEventListener('change', () => {
        let val = parseInt(pageJumpInput.value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > TOTAL_PAGES) val = TOTAL_PAGES;
        showPage(val);
    });

    pageJumpInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            pageJumpInput.blur();
            let val = parseInt(pageJumpInput.value);
            if (isNaN(val) || val < 1) val = 1;
            if (val > TOTAL_PAGES) val = TOTAL_PAGES;
            showPage(val);
        }
    });
}

// ========================================================
// 8. SWIPE GESTURES
// ========================================================
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let isTouching = false;
let isMouseDragging = false;
let mouseStartX = 0;

if (pageStage) {
    pageStage.addEventListener('touchstart', (e) => {
        if (!isPageView) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isTouching = true;
    }, { passive: true });

    pageStage.addEventListener('touchmove', (e) => {
        if (!isTouching || !isPageView) return;
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - touchStartX;
        if (pageImage && pageImage.style.display !== 'none' && Math.abs(deltaX) > 10) {
            pageImage.style.transform = `translateX(${deltaX * 0.2}px)`;
        }
    }, { passive: true });

    pageStage.addEventListener('touchend', (e) => {
        if (!isTouching || !isPageView) return;
        isTouching = false;
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        handleSwipeAction();
    }, { passive: true });

    pageStage.addEventListener('mousedown', (e) => {
        if (!isPageView || e.button !== 0) return;
        if (e.target.closest('.page-floating-nav') || e.target.closest('button')) return;

        isMouseDragging = true;
        mouseStartX = e.clientX;
        touchStartX = e.clientX;
        touchStartY = e.clientY;
        pageStage.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isMouseDragging || !isPageView) return;
        const deltaX = e.clientX - mouseStartX;
        if (pageImage && pageImage.style.display !== 'none' && Math.abs(deltaX) > 8) {
            pageImage.style.transform = `translateX(${deltaX * 0.2}px)`;
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (!isMouseDragging) return;
        isMouseDragging = false;
        if (pageStage) pageStage.style.cursor = 'grab';
        touchEndX = e.clientX;
        touchEndY = e.clientY;
        handleSwipeAction();
    });

    // Mouse wheel scrolling between Quran pages (بالاسكرول)
    let isWheelThrottled = false;
    pageStage.addEventListener('wheel', (e) => {
        if (!isPageView || isWheelThrottled) return;
        if (Math.abs(e.deltaY) > 20 || Math.abs(e.deltaX) > 20) {
            e.preventDefault();
            isWheelThrottled = true;
            setTimeout(() => { isWheelThrottled = false; }, 260);

            if (e.deltaY > 0 || e.deltaX > 0) {
                goToNextPage();
            } else {
                goToPrevPage();
            }
        }
    }, { passive: false });
}

function handleSwipeAction() {
    if (pageImage) {
        pageImage.style.transform = '';
    }

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 45;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
            goToNextPage();
        } else {
            goToPrevPage();
        }
    }
}

// ========================================================
// 9. RECITERS AUDIO PLAYER (مشغل الصوت وقائمة المشايخ - APIs الحديثة)
// ========================================================
const RECITERS_API = "https://quran.yousefheiba.com/api/reciters";
const RECITER_AUDIO_API = "https://quran.yousefheiba.com/api/reciterAudio";
const SURAH_AUDIO_API = "https://quran.yousefheiba.com/api/surahAudio";

// قائمة بأبرز وأشهر القراء لسهولة الوصول إليهم في رأس القائمة
const POPULAR_RECITERS_IDS = [
    "123", // مشاري العفاسي
    "92",  // ياسر الدوسري
    "51",  // عبدالباسط عبدالصمد
    "102", // ماهر المعيقلي
    "118", // محمود خليل الحصري
    "112", // محمد صديق المنشاوي
    "30",  // سعد الغامدي
    "5",   // أحمد بن علي العجمي
    "86",  // ناصر القطامي
    "231", // هزاع البلوشي
    "12",  // إدريس أبكر
    "121", // محمود علي البنا
    "31"   // سعود الشريم
];

// دعم التوافق مع المفاتيح السابقة المخزنة محلياً
const LEGACY_KEY_MAP = {
    'afs': '123',
    'basit': '51',
    'maher': '102',
    'husr': '118',
    's_gmd': '30',
    'ajm': '5',
    'yasser': '92',
    'shur': '31'
};

let allRecitersList = [];
let reciterAudioCache = {};
let currentReciter = null;
let recitersInitPromise = null;

const audioToggleBtn = document.getElementById('audioToggleBtn');
const surahAudioPlayer = document.getElementById('surahAudioPlayer');
const audioCloseBtn = document.getElementById('audioCloseBtn');
const quranAudio = document.getElementById('quranAudio');
const audioPlayBtn = document.getElementById('audioPlayBtn');
const audioPlayIcon = document.getElementById('audioPlayIcon');
const reciterSelect = document.getElementById('reciterSelect');
const reciterIcon = document.getElementById('reciterIcon');
const reciterSearchInput = document.getElementById('reciterSearchInput');
const reciterSearchToggleBtn = document.getElementById('reciterSearchToggleBtn');
const audioStatusNotice = document.getElementById('audioStatusNotice');
const audioStatusNoticeText = document.getElementById('audioStatusNoticeText');
const audioProgressBar = document.getElementById('audioProgressBar');
const audioProgressFill = document.getElementById('audioProgressFill');
const audioCurrentTime = document.getElementById('audioCurrentTime');
const audioDuration = document.getElementById('audioDuration');
const audioMuteBtn = document.getElementById('audioMuteBtn');
const audioMuteIcon = document.getElementById('audioMuteIcon');
const audioVolumeSlider = document.getElementById('audioVolumeSlider');

function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function showAudioNotice(message, isError = false) {
    if (!audioStatusNotice || !audioStatusNoticeText) return;
    audioStatusNoticeText.textContent = message;
    audioStatusNotice.style.display = 'flex';
}

function hideAudioNotice() {
    if (audioStatusNotice) {
        audioStatusNotice.style.display = 'none';
    }
}

function populateRecitersDropdown(filterQuery = '') {
    if (!reciterSelect || allRecitersList.length === 0) return;

    const query = filterQuery.trim().toLowerCase();
    let filteredList = allRecitersList;
    if (query) {
        filteredList = allRecitersList.filter(r => 
            (r.reciter_name && r.reciter_name.toLowerCase().includes(query)) || 
            (r.reciter_short_name && r.reciter_short_name.toLowerCase().includes(query))
        );
    }

    if (filteredList.length === 0) {
        reciterSelect.innerHTML = '<option value="" disabled selected>لا يوجد قارئ مطابق للبحث</option>';
        return;
    }

    let html = '';
    if (!query) {
        // قسم أشهر القراء
        const popularList = [];
        POPULAR_RECITERS_IDS.forEach(id => {
            const found = allRecitersList.find(r => String(r.reciter_id) === String(id));
            if (found) popularList.push(found);
        });

        if (popularList.length > 0) {
            html += '<optgroup label="⭐ أشهر القراء">';
            popularList.forEach(r => {
                html += `<option value="${r.reciter_id}">الشيخ ${r.reciter_name}</option>`;
            });
            html += '</optgroup>';
        }

        html += `<optgroup label="📖 جميع القراء (${allRecitersList.length} قارئ)">`;
        allRecitersList.forEach(r => {
            html += `<option value="${r.reciter_id}">الشيخ ${r.reciter_name}</option>`;
        });
        html += '</optgroup>';
    } else {
        html += `<optgroup label="نتائج البحث (${filteredList.length} قارئ)">`;
        filteredList.forEach(r => {
            html += `<option value="${r.reciter_id}">الشيخ ${r.reciter_name}</option>`;
        });
        html += '</optgroup>';
    }

    reciterSelect.innerHTML = html;

    if (currentReciter && filteredList.some(r => String(r.reciter_id) === String(currentReciter.reciter_id))) {
        reciterSelect.value = String(currentReciter.reciter_id);
    } else if (filteredList.length > 0) {
        reciterSelect.value = String(filteredList[0].reciter_id);
    }
}

async function fetchReciterAudio(reciterId) {
    const key = String(reciterId);
    if (reciterAudioCache[key]) {
        return reciterAudioCache[key];
    }

    try {
        const res = await fetch(`${RECITER_AUDIO_API}?reciter_id=${reciterId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        reciterAudioCache[key] = data;
        return data;
    } catch (err) {
        console.error(`Error loading recordings for reciter ${reciterId}:`, err);
        return null;
    }
}

async function loadReciters() {
    try {
        if (reciterSelect) {
            reciterSelect.innerHTML = '<option value="" disabled selected>جاري تحميل قائمة القراء...</option>';
        }

        const res = await fetch(RECITERS_API);
        const data = await res.json();
        allRecitersList = data.reciters || [];

        // استعادة القارئ المفضل المخزن
        let savedId = localStorage.getItem('quran_preferred_reciter_id') || localStorage.getItem('quran_preferred_reciter');
        if (savedId && LEGACY_KEY_MAP[savedId]) {
            savedId = LEGACY_KEY_MAP[savedId];
        }

        let selected = allRecitersList.find(r => String(r.reciter_id) === String(savedId));
        if (!selected) {
            // الافتراضي الشيخ مشاري العفاسي أو ياسر الدوسري أو أول قارئ
            selected = allRecitersList.find(r => String(r.reciter_id) === '123') ||
                       allRecitersList.find(r => String(r.reciter_id) === '92') ||
                       allRecitersList[0];
        }

        currentReciter = selected;
        populateRecitersDropdown();

        if (currentReciter && reciterSelect) {
            reciterSelect.value = String(currentReciter.reciter_id);
        }

        // تحميل تسجيلات القارئ المختار في الخلفية
        if (currentReciter) {
            fetchReciterAudio(currentReciter.reciter_id);
        }
    } catch (err) {
        console.error('Error fetching reciters:', err);
        if (reciterSelect) {
            reciterSelect.innerHTML = '<option value="" disabled selected>تعذر تحميل قائمة القراء</option>';
        }
    }
}
recitersInitPromise = loadReciters();

async function updateAudioSource(autoPlay = false) {
    if (!quranAudio || !reciterSelect) return;

    if (recitersInitPromise) {
        await recitersInitPromise;
    }

    const reciterId = reciterSelect.value;
    if (!reciterId) return;

    currentReciter = allRecitersList.find(r => String(r.reciter_id) === String(reciterId)) || currentReciter;
    const reciterName = currentReciter ? currentReciter.reciter_name : 'القارئ المحدد';
    const reciterShort = currentReciter ? currentReciter.reciter_short_name : '';

    if (reciterIcon) {
        reciterIcon.classList.remove('fa-microphone-lines');
        reciterIcon.classList.add('fa-spinner', 'fa-spin');
    }

    hideAudioNotice();

    let targetAudioUrl = '';
    const wasPlaying = !quranAudio.paused;

    try {
        const audioData = await fetchReciterAudio(reciterId);

        if (audioData && Array.isArray(audioData.audio_urls)) {
            const foundSurah = audioData.audio_urls.find(u => parseInt(u.surah_id) === SurahNumber);
            if (foundSurah && foundSurah.audio_url) {
                targetAudioUrl = foundSurah.audio_url;
            } else {
                // السورة غير مسجلة بصوت هذا القارئ
                const surahFullName = getSurahName(SurahNumber);
                showAudioNotice(`سورة ${surahFullName} غير متوفرة بصوت الشيخ ${reciterName}`, true);
                quranAudio.pause();
                quranAudio.removeAttribute('src');
                updatePlayIcon(false);
                if (audioCurrentTime) audioCurrentTime.textContent = '00:00';
                if (audioDuration) audioDuration.textContent = '00:00';
                if (audioProgressFill) audioProgressFill.style.width = '0%';
                return;
            }
        } else if (reciterShort) {
            targetAudioUrl = `${SURAH_AUDIO_API}?reciter=${encodeURIComponent(reciterShort)}&id=${SurahNumber}`;
        }
    } catch (e) {
        console.error('Error resolving audio URL:', e);
        if (reciterShort) {
            targetAudioUrl = `${SURAH_AUDIO_API}?reciter=${encodeURIComponent(reciterShort)}&id=${SurahNumber}`;
        }
    } finally {
        if (reciterIcon) {
            reciterIcon.classList.remove('fa-spinner', 'fa-spin');
            reciterIcon.classList.add('fa-microphone-lines');
        }
    }

    if (!targetAudioUrl) {
        showAudioNotice(`تعذر تحميل التلاوة بصوت الشيخ ${reciterName}`, true);
        return;
    }

    quranAudio.src = targetAudioUrl;
    quranAudio.load();

    // تحديث بطاقة الوسائط لنظام التشغيل والموبايل
    if ('mediaSession' in navigator) {
        try {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: getSurahName(SurahNumber),
                artist: `الشيخ ${reciterName}`,
                album: 'القرآن الكريم'
            });
        } catch (e) {}
    }

    if (autoPlay || wasPlaying) {
        quranAudio.play().then(() => {
            updatePlayIcon(true);
            hideAudioNotice();
        }).catch(err => {
            ('Audio autoplay prevented or error:', err);
            updatePlayIcon(false);
        });
    } else {
        updatePlayIcon(false);
    }
}

function updatePlayIcon(isPlaying) {
    if (!audioPlayIcon || !audioPlayBtn) return;
    if (isPlaying) {
        audioPlayIcon.classList.remove('fa-play');
        audioPlayIcon.classList.add('fa-pause');
        audioPlayBtn.classList.add('playing');
    } else {
        audioPlayIcon.classList.remove('fa-pause');
        audioPlayIcon.classList.add('fa-play');
        audioPlayBtn.classList.remove('playing');
    }
}

if (audioToggleBtn && surahAudioPlayer) {
    audioToggleBtn.addEventListener('click', () => {
        const isCurrentlyActive = surahAudioPlayer.classList.contains('active');
        if (isCurrentlyActive) {
            surahAudioPlayer.classList.remove('active');
            audioToggleBtn.classList.remove('active');
        } else {
            surahAudioPlayer.classList.add('active');
            audioToggleBtn.classList.add('active');
            if (!quranAudio.src) {
                updateAudioSource(false);
            }
        }
    });
}

if (audioCloseBtn && surahAudioPlayer) {
    audioCloseBtn.addEventListener('click', () => {
        surahAudioPlayer.classList.remove('active');
        if (audioToggleBtn) audioToggleBtn.classList.remove('active');
    });
}

if (reciterSelect) {
    reciterSelect.addEventListener('change', () => {
        const selectedId = reciterSelect.value;
        if (selectedId) {
            localStorage.setItem('quran_preferred_reciter_id', selectedId);
            localStorage.setItem('quran_preferred_reciter', selectedId);
            currentReciter = allRecitersList.find(r => String(r.reciter_id) === String(selectedId)) || currentReciter;
            updateAudioSource(true);
        }
    });
}

// التحكم بالبحث السريع في قائمة القراء
if (reciterSearchToggleBtn && reciterSearchInput && reciterSelect) {
    reciterSearchToggleBtn.addEventListener('click', () => {
        const isSearchVisible = (reciterSearchInput.style.display !== 'none');
        if (isSearchVisible) {
            reciterSearchInput.style.display = 'none';
            reciterSearchToggleBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
            reciterSearchToggleBtn.title = 'بحث سريع في قائمة القراء';
            populateRecitersDropdown();
        } else {
            reciterSearchInput.style.display = 'inline-block';
            reciterSearchInput.value = '';
            reciterSearchInput.focus();
            reciterSearchToggleBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            reciterSearchToggleBtn.title = 'إلغاء البحث';
        }
    });

    reciterSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        populateRecitersDropdown(query);
    });

    reciterSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            reciterSearchInput.blur();
            if (reciterSelect.value) {
                reciterSelect.dispatchEvent(new Event('change'));
            }
        }
    });
}

if (audioPlayBtn && quranAudio) {
    audioPlayBtn.addEventListener('click', async () => {
        if (!quranAudio.src) {
            await updateAudioSource(true);
            return;
        }

        if (quranAudio.paused) {
            quranAudio.play().then(() => updatePlayIcon(true)).catch(err => {
                console.error('Play failed:', err);
                updateAudioSource(true);
            });
        } else {
            quranAudio.pause();
            updatePlayIcon(false);
        }
    });
}

if (quranAudio) {
    quranAudio.addEventListener('error', () => {
        const reciterName = currentReciter ? currentReciter.reciter_name : 'القارئ';
        const surahFullName = getSurahName(SurahNumber);
        showAudioNotice(`عفواً، تلاوة ${surahFullName} غير متاحة حالياً بصوت الشيخ ${reciterName}`, true);
        updatePlayIcon(false);
    });

    quranAudio.addEventListener('timeupdate', () => {
        if (audioCurrentTime) audioCurrentTime.textContent = formatTime(quranAudio.currentTime);
        if (audioDuration && quranAudio.duration) audioDuration.textContent = formatTime(quranAudio.duration);

        if (audioProgressFill && quranAudio.duration) {
            const percent = (quranAudio.currentTime / quranAudio.duration) * 100;
            audioProgressFill.style.width = `${percent}%`;
        }
    });

    quranAudio.addEventListener('loadedmetadata', () => {
        if (audioDuration) audioDuration.textContent = formatTime(quranAudio.duration);
    });

    quranAudio.addEventListener('ended', () => {
        updatePlayIcon(false);
        if (audioProgressFill) audioProgressFill.style.width = '0%';
    });
}

if (audioProgressBar && quranAudio) {
    audioProgressBar.addEventListener('click', (e) => {
        const rect = audioProgressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        if (width > 0 && quranAudio.duration) {
            quranAudio.currentTime = (clickX / width) * quranAudio.duration;
        }
    });
}

if (audioMuteBtn && quranAudio) {
    audioMuteBtn.addEventListener('click', () => {
        quranAudio.muted = !quranAudio.muted;
        if (audioMuteIcon) {
            if (quranAudio.muted) {
                audioMuteIcon.classList.remove('fa-volume-high');
                audioMuteIcon.classList.add('fa-volume-xmark');
            } else {
                audioMuteIcon.classList.remove('fa-volume-xmark');
                audioMuteIcon.classList.add('fa-volume-high');
            }
        }
    });
}

if (audioVolumeSlider && quranAudio) {
    audioVolumeSlider.addEventListener('input', (e) => {
        quranAudio.volume = parseFloat(e.target.value);
        if (quranAudio.muted && quranAudio.volume > 0) {
            quranAudio.muted = false;
            if (audioMuteIcon) {
                audioMuteIcon.classList.remove('fa-volume-xmark');
                audioMuteIcon.classList.add('fa-volume-high');
            }
        }
    });
}

// ========================================================
// 10. INITIALIZE PERSISTED VIEW MODE
// ========================================================
const storedViewMode = localStorage.getItem(VIEW_MODE_KEY);
if (storedViewMode === 'pages') {
    setViewMode('pages');
} else {
    setViewMode('text');
}


//=============================================================
// 11. Tafseer Features
//=============================================================

const tafseerBtn = document.getElementById('openTafsirBtn');
const tafseerSection = document.getElementById('tafseerSection');
const closeTafsirBtn = document.getElementById('closeTafsirBtn');
const tafseerContainer = document.getElementById('tafseer-text');
const ayahsCount = Number(localStorage.getItem('ayat_count'));

let tafseerTitle = document.getElementById('tafseerTitle')

function setTafseerVisibility(isVisible) {
    if (!tafseerSection) return;

    tafseerSection.hidden = !isVisible;
    tafseerSection.setAttribute('aria-hidden', String(!isVisible));
    document.body.classList.toggle('tafseer-open', isVisible);

    if (isVisible && closeTafsirBtn) {
        closeTafsirBtn.focus();
    } else if (!isVisible && tafseerBtn) {
        tafseerBtn.focus();
    }
}

if (tafseerBtn) {
    tafseerBtn.addEventListener('click', () => setTafseerVisibility(true));
}

if (closeTafsirBtn) {
    closeTafsirBtn.addEventListener('click', () => setTafseerVisibility(false));
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && tafseerSection && !tafseerSection.hidden) {
        setTafseerVisibility(false);
    }
});

// async function getTafseer() {
//     if (!tafseerContainer) return;


//     try {
//         // const response = await fetch(`http://api.quran-tafseer.com/tafseer/1/${SurahNumber}/1/${ayahsCount}`);
//         // if (!response.ok) {
//         //     throw new Error(`Tafseer request failed with status ${response.status}`);
//         // }

//         // const data = await response.json();
//         // console.log(data)
//         await fetch(`http://api.quran-tafseer.com/tafseer/1/${SurahNumber}/1/${ayahsCount}`)
//         .then(res => res.json())
//         .then(data => {
//             console.log(data)
//             data.forEach(t => {
//                 tafseerContainer.innerHTML += `
//                     <span>${t.text}</span>
//                 `
//                 let surahName = localStorage.getItem("surahNAme")
//                 tafseerTitle.innerHTML = `تفسير  ${surahName}`
//             });
//         })

//         if (!Array.isArray(data) || data.length === 0) {
//             tafseerContainer.innerHTML = '<div class="tafseer-status">لا يوجد تفسير متاح لهذه السورة.</div>';
//             return;
//         }

        
//     } catch (error) {
//         console.error('Unable to load tafseer:', error);
//         tafseerContainer.innerHTML = '<div class="tafseer-status">تعذر تحميل التفسير حاليًا. حاول مرة أخرى.</div>';
//     }
// }

async function getTafseer() {
    let Num = SurahNumber;
    let Count = ayahsCount
    await fetch(`http://api.quran-tafseer.com/tafseer/1/${SurahNumber}/1/${ayahsCount}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            data.forEach(t => {
                tafseerContainer.innerHTML += `
                    <span>${t.text}</span>
                `
                let surahName = localStorage.getItem("surahNAme")
                tafseerTitle.innerHTML = `تفسير  ${surahName}`
            });
        })
    
}

getTafseer();
