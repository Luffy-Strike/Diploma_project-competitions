// Пример данных о зарегистрированных соревнованиях пользователя
const myCompetitions = [
    {
        id: 1,
        title: 'Городской марафон',
        date: '2024-05-15',
        location: 'Центральный парк',
        status: 'Подтверждено'
    },
    {
        id: 2,
        title: 'Турнир по плаванию',
        date: '2024-06-01',
        location: 'Спортивный комплекс "Волна"',
        status: 'В обработке'
    }
];

// Функция для отображения списка соревнований пользователя
function displayMyCompetitions() {
    const container = document.getElementById('myCompetitionsList');
    if (!container) return;

    // Получаем сохраненные соревнования из localStorage
    const myCompetitions = JSON.parse(localStorage.getItem('myCompetitions') || '[]');

    if (myCompetitions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <h2>У вас пока нет зарегистрированных соревнований</h2>
                <p>Перейдите на <a href="index.html">главную страницу</a> чтобы зарегистрироваться на соревнование</p>
            </div>
        `;
        return;
    }

    // Сортируем соревнования по дате регистрации (новые сверху)
    myCompetitions.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));

    // Отображаем каждое соревнование
    myCompetitions.forEach(competition => {
        const registrationDate = new Date(competition.registrationDate);
        const card = document.createElement('div');
        card.className = 'competition-card';
        card.innerHTML = `
            <h3>${getEventEmoji(competition.eventId)} ${competition.eventName}</h3>
            <div class="event-details">
                <p><i class="fas fa-user"></i> ${competition.firstName} ${competition.lastName}</p>
                <p><i class="fas fa-envelope"></i> ${competition.email}</p>
                <p><i class="fas fa-calendar-check"></i> Дата регистрации: ${registrationDate.toLocaleDateString()}</p>
                <p><i class="fas fa-info-circle"></i> Возраст: ${competition.age} лет</p>
                <p><i class="fas fa-weight"></i> Вес: ${competition.weight} кг</p>
            </div>
            <button class="btn-danger" onclick="cancelRegistration('${competition.registrationDate}')">
                <i class="fas fa-times"></i>
                Отменить регистрацию
            </button>
        `;
        container.appendChild(card);
    });
}

// Форматирование даты
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

// Функция отмены регистрации
function cancelRegistration(registrationDate) {
    if (confirm('Вы уверены, что хотите отменить регистрацию на это соревнование?')) {
        let myCompetitions = JSON.parse(localStorage.getItem('myCompetitions') || '[]');
        myCompetitions = myCompetitions.filter(comp => comp.registrationDate !== registrationDate);
        localStorage.setItem('myCompetitions', JSON.stringify(myCompetitions));
        location.reload();
    }
}

// Функция показа уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.body.appendChild(notification);

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background-color: var(--primary-color);
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
    `;

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Добавляем стили анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .competition-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .competition-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .registration-details {
        background-color: #f8fafc;
        padding: 1rem;
        border-radius: 4px;
        margin: 1rem 0;
    }

    .cancel-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .cancel-btn i {
        font-size: 1.1rem;
    }
`;
document.head.appendChild(style);

// Функция для получения эмодзи события
function getEventEmoji(eventId) {
    const emojis = {
        'marathon': '🏃‍♂️',
        'swimming': '🏊‍♂️',
        'cycling': '🚴‍♂️',
        'triathlon': '🏃‍♂️🏊‍♂️🚴‍♂️',
        'running': '🏃‍♂️',
        'trail': '🏃‍♂️🌲'
    };
    return emojis[eventId] || '🏅';
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    displayMyCompetitions();
}); 