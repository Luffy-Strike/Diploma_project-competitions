const competitions = [
    {
        id: 1,
        title: 'Городской марафон',
        date: '2025-05-15',
        location: 'Центральный парк',
        description: 'Ежегодный городской марафон на дистанцию 42.2 км',
        emoji: '🏃',
        type: 'running'
    },
    {
        id: 2,
        title: 'Турнир по плаванию',
        date: '2025-06-01',
        location: 'Спортивный комплекс "Волна"',
        description: 'Соревнования по плаванию в различных категориях',
        emoji: '🏊',
        type: 'swimming'
    },
    {
        id: 3,
        title: 'Велогонка',
        date: '2025-06-15',
        location: 'Парк "Сосновый бор"',
        description: 'Городская велогонка на 50 км',
        emoji: '🚴',
        type: 'cycling'
    },
    {
        id: 4,
        title: 'Триатлон',
        date: '2025-07-10',
        location: 'Спортивный комплекс "Олимпиец"',
        description: 'Соревнования по триатлону: плавание, велогонка и бег',
        emoji: '🏃🏊🚴',
        type: 'triathlon'
    },
    {
        id: 5,
        title: 'Городская эстафета',
        date: '2025-07-25',
        location: 'Площадь Победы',
        description: 'Командные соревнования по бегу',
        emoji: '👥🏃',
        type: 'running'
    },
    {
        id: 6,
        title: 'Заплыв на открытой воде',
        date: '2025-08-05',
        location: 'Городское озеро',
        description: 'Соревнования по плаванию на открытой воде',
        emoji: '🏊🌊',
        type: 'swimming'
    },
    {
        id: 7,
        title: 'Велокросс',
        date: '2025-08-20',
        location: 'Лесопарк "Зеленый"',
        description: 'Соревнования по велокроссу по пересеченной местности',
        emoji: '🚴🌲',
        type: 'cycling'
    },
    {
        id: 8,
        title: 'Полумарафон',
        date: '2025-09-10',
        location: 'Набережная',
        description: 'Полумарафон на 21.1 км вдоль набережной',
        emoji: '🏃🌅',
        type: 'running'
    },
    {
        id: 9,
        title: 'Спортивное многоборье',
        date: '2025-09-25',
        location: 'Стадион "Динамо"',
        description: 'Комплексные соревнования по различным видам спорта',
        emoji: '🏃🏋️‍♂️🤸‍♂️',
        type: 'mixed'
    }
];

function displayCompetitions() {
    const container = document.getElementById('competitionsList');
    const select = document.getElementById('competitionSelect');
    if (!container || !select) return;

    container.innerHTML = '';
    select.innerHTML = '<option value="">-- Выберите соревнование --</option>';

    competitions.forEach(competition => {
        const competitionCard = document.createElement('div');
        competitionCard.className = 'competition-card';
        competitionCard.innerHTML = `
            <div class="competition-header">
                <span class="competition-emoji">${competition.emoji}</span>
                <h3>${competition.title}</h3>
            </div>
            <p><strong>Дата:</strong> ${formatDate(competition.date)}</p>
            <p><strong>Место:</strong> ${competition.location}</p>
            <p>${competition.description}</p>
            <button data-event="${competition.id}" class="submit-btn">Выбрать</button>
        `;
        container.appendChild(competitionCard);

        competitionCard.style.opacity = '0';
        competitionCard.style.transform = 'translateY(20px)';
        setTimeout(() => {
            competitionCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            competitionCard.style.opacity = '1';
            competitionCard.style.transform = 'translateY(0)';
        }, 100 * competitions.indexOf(competition));

        const option = document.createElement('option');
        option.value = competition.id;
        option.textContent = `${competition.emoji} ${competition.title} (${formatDate(competition.date)})`;
        select.appendChild(option);
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

function selectCompetition(competitionId) {
    const competition = competitions.find(c => c.id === competitionId);
    if (competition) {
        document.getElementById('competitionSelect').value = competitionId;
        document.querySelector('.registration-form').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const eventButtons = document.querySelectorAll('.btn-select[data-event]');
    eventButtons.forEach(button => {
        button.addEventListener('click', function() {
            const eventId = this.getAttribute('data-event');
            document.getElementById('competitionSelect').value = eventId;
            document.querySelector('.registration-form').scrollIntoView({ behavior: 'smooth' });
        });
    });

    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                eventId: document.getElementById('competitionSelect').value,
                eventName: document.getElementById('competitionSelect').options[document.getElementById('competitionSelect').selectedIndex].text,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                age: document.getElementById('age').value,
                weight: document.getElementById('weight').value,
                registrationDate: new Date().toISOString()
            };

            let myCompetitions = JSON.parse(localStorage.getItem('myCompetitions') || '[]');
            myCompetitions.push(formData);
            localStorage.setItem('myCompetitions', JSON.stringify(myCompetitions));

            const successMessage = document.querySelector('.registration-success');
            successMessage.classList.add('show');

            registrationForm.reset();

            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
        });
    }
});

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

    .competition-emoji {
        font-size: 2rem;
        margin-right: 1rem;
    }

    .competition-header {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    displayCompetitions();
}); 