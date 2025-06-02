const newsData = [
    {
        id: 1,
        title: 'Итоги летнего марафона в Санкт-Петербурге',
        category: 'running',
        date: '2025-08-15',
        content: 'В Санкт-Петербурге прошел традиционный летний марафон, собравший более 3000 участников. Победителем среди мужчин стал Александр Петров с результатом 2:15:34, среди женщин лучшей стала Мария Иванова (2:28:45).',
        url: 'https://spbrunning.ru/news/summer-marathon-2025'
    },
    {
        id: 2,
        title: 'Рекорд России по плаванию на открытой воде',
        category: 'swimming',
        date: '2025-07-30',
        content: 'На соревнованиях по плаванию на открытой воде в Сочи установлен новый рекорд России на дистанции 10 км. Дмитрий Волков преодолел дистанцию за 1 час 52 минуты, улучшив предыдущий результат на 2 минуты.',
        url: 'https://russwimming.ru/news/record-open-water-2025'
    },
    {
        id: 3,
        title: 'Тур де Франс 2025: представлен маршрут',
        category: 'cycling',
        date: '2025-07-13',
        content: 'Организаторы Тур де Франс представили маршрут велогонки на 2025 год. Гонка стартует в Копенгагене и завершится традиционным этапом на Елисейских полях в Париже. Общая протяженность маршрута составит 3,470 километров.',
        url: 'https://www.letour.fr/en/'
    },
    {
        id: 4,
        title: 'Триатлон: новый формат городских соревнований',
        category: 'running',
        date: '2025-07-05',
        content: 'Федерация триатлона России анонсировала новый формат городских соревнований. Теперь дистанции будут адаптированы под городскую среду, а маршруты будут проходить через знаковые места городов.',
        url: 'https://www.tristars.ru/news/city-triathlon-2025'
    },
    {
        id: 5,
        title: 'Чемпионат мира по плаванию: успех российских спортсменов',
        category: 'swimming',
        date: '2025-06-20',
        content: 'На чемпионате мира по плаванию в Дохе российские спортсмены завоевали 12 медалей, из них 4 золотые. Особенно успешным стало выступление в комбинированной эстафете 4×100 метров.',
        url: 'https://swimming.org/news/world-championship-2025'
    },
    {
        id: 6,
        title: 'Велоспорт: инновационные технологии тренировок',
        category: 'cycling',
        date: '2025-06-01',
        content: 'Российская команда по велоспорту начала использовать инновационную систему тренировок с применением VR-технологий. Спортсмены могут тренироваться на виртуальных копиях реальных трасс в любое время года.',
        url: 'https://fvsr.ru/news/vr-training-2025'
    }
];

let currentCategory = 'all';
let currentPage = 1;
const newsPerPage = 6;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
        currentCategory = e.target.value;
        currentPage = 1;
        displayNews();
    });

    document.getElementById('loadMoreBtn').addEventListener('click', () => {
        currentPage++;
        displayNews(true);
    });

    displayNews();
});

function displayNews(append = false) {
    const container = document.getElementById('newsContainer');
    if (!append) {
        container.innerHTML = '';
    }

    let filteredNews = newsData;
    if (currentCategory !== 'all') {
        filteredNews = newsData.filter(news => news.category === currentCategory);
    }

    const start = (currentPage - 1) * newsPerPage;
    const end = start + newsPerPage;
    const paginatedNews = filteredNews.slice(start, end);

    paginatedNews.forEach(news => {
        const newsCard = document.createElement('article');
        newsCard.className = 'news-card';
        newsCard.innerHTML = `
            <div class="news-content">
                <h3>${news.title}</h3>
                <div class="news-meta">
                    <span class="news-date">${formatDate(news.date)}</span>
                    <span class="news-category">${getCategoryName(news.category)}</span>
                </div>
                <p class="news-text">${news.content}</p>
                <a href="${news.url}" target="_blank" class="read-more-btn">Читать на сайте</a>
            </div>
        `;

        newsCard.style.opacity = '0';
        newsCard.style.transform = 'translateY(20px)';
        container.appendChild(newsCard);

        setTimeout(() => {
            newsCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            newsCard.style.opacity = '1';
            newsCard.style.transform = 'translateY(0)';
        }, 100 * paginatedNews.indexOf(news));
    });

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (end >= filteredNews.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

function getCategoryName(category) {
    const categories = {
        running: 'Бег',
        swimming: 'Плавание',
        cycling: 'Велоспорт'
    };
    return categories[category] || category;
}

const style = document.createElement('style');
style.textContent = `
    .news-card {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin-bottom: 1.5rem;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .news-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .news-meta {
        display: flex;
        gap: 1rem;
        color: #666;
        margin: 0.5rem 0;
        font-size: 0.9rem;
    }

    .news-text {
        margin: 1rem 0;
        line-height: 1.6;
    }

    .read-more-btn {
        display: inline-block;
        background-color: var(--primary-color);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        text-decoration: none;
        transition: background-color 0.3s ease;
    }

    .read-more-btn:hover {
        background-color: var(--secondary-color);
    }
`;
document.head.appendChild(style); 