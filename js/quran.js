// ========================================================
// Quran Index Script - Royal Cards & Instant Search
// ========================================================

const API = "https://quran.yousefheiba.com/api/surahs";
const surahsBox = document.getElementById("surahs");
const surahSearchInput = document.getElementById("surahSearch");
const headerSearchInput = document.getElementById("headerSearchInput");

if (surahsBox) {
    let allSurahsData = [];

    // Helper: Convert to Arabic digits
    function toArabicDigits(num) {
        if (!num) return '';
        const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return String(num).replace(/[0-9]/g, digit => arabicDigits[+digit]);
    }

    function renderSurahCards(surahsList) {
        if (surahsList.length === 0) {
            surahsBox.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="fs-4" style="color: var(--gold-dark); font-family: 'Amiri', serif;">لا توجد سور مطابقة لبحثك</p>
                </div>
            `;
            return;
        }

        let html = '';
        surahsList.forEach(surah => {
            const isMakki = (surah.type === 'Meccan');
            const surahType = isMakki ? 'مكية' : 'مدنية';
            const typeIcon = isMakki ? '<i class="fa-solid fa-kaaba me-1"></i>' : '<i class="fa-solid fa-mosque me-1"></i>';

            html += `
                <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
                    <div class="surah-card" index="${surah.number}">
                        <div class="surah-number">${toArabicDigits(surah.number)}</div>
                        <div class="surah-body">
                            <h2 class="surah-name">${surah.name_ar}</h2>
                            <p class="surah-ayat">${toArabicDigits(surah.ayat_count)} آيات</p>
                        </div>
                        <div class="surah-type ${isMakki ? 'makki' : 'madani'}">${typeIcon} ${surahType}</div>
                    </div>
                </div>
            `;
        });

        surahsBox.innerHTML = html;

        // Click to navigate to surah.html
        document.querySelectorAll(".surah-card").forEach(card => {
            card.addEventListener("click", () => {
                const surahIndex = card.getAttribute("index");
                window.location.href = `../pages/surah.html?surah=${surahIndex}`;
            });
        });
    }

    async function getSurahsInfo() {
        try {
            surahsBox.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="spinner-border" style="color: var(--gold-primary);" role="status"></div>
                    <p class="mt-3 fs-5" style="color: var(--gold-dark); font-family: 'Amiri', serif;">جاري تحميل سور القرآن الكريم...</p>
                </div>
            `;
            const res = await fetch(API);
            const data = await res.json();
            allSurahsData = data;
            renderSurahCards(allSurahsData);
        } catch (err) {
            console.error('Error fetching surahs:', err);
            surahsBox.innerHTML = '<div class="col-12 text-center text-danger py-5">حدث خطأ في تحميل السور، يرجى إعادة المحاولة.</div>';
        }
    }

    // Filter surahs by query
    function filterSurahs(query) {
        const cleanQuery = query.trim().toLowerCase();
        if (!cleanQuery) {
            renderSurahCards(allSurahsData);
            return;
        }

        const filtered = allSurahsData.filter(s => {
            const nameAr = s.name_ar.toLowerCase();
            const nameEn = (s.name_en || '').toLowerCase();
            const num = String(s.number);
            return nameAr.includes(cleanQuery) || nameEn.includes(cleanQuery) || num === cleanQuery;
        });

        renderSurahCards(filtered);
    }

    // Connect search inputs
    if (surahSearchInput) {
        surahSearchInput.addEventListener('input', (e) => {
            filterSurahs(e.target.value);
            if (headerSearchInput) headerSearchInput.value = e.target.value;
        });
    }

    if (headerSearchInput) {
        headerSearchInput.addEventListener('input', (e) => {
            filterSurahs(e.target.value);
            if (surahSearchInput) surahSearchInput.value = e.target.value;
        });
    }

    getSurahsInfo();
}
