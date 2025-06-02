document.addEventListener('DOMContentLoaded', function() {
    // Инициализация табов
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Удаляем активный класс у всех табов и контента
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.add('hidden'));
            
            // Добавляем активный класс выбранному табу и показываем его контент
            tab.classList.add('active');
            document.getElementById(tabId).classList.remove('hidden');
        });
    });

    // Загрузка аватара
    const avatarUpload = document.getElementById('avatarUpload');
    const profileAvatar = document.getElementById('profileAvatar');

    if (avatarUpload && profileAvatar) {
        // Проверяем, есть ли сохраненное изображение
        const savedAvatar = localStorage.getItem('profileAvatar');
        if (savedAvatar) {
            profileAvatar.src = savedAvatar;
        }

        // Обработчик загрузки нового изображения
        avatarUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profileAvatar.src = e.target.result;
                    // Сохраняем изображение в localStorage
                    localStorage.setItem('profileAvatar', e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Инициализация графиков
    const runningCtx = document.getElementById('runningProgress').getContext('2d');
    const strengthCtx = document.getElementById('strengthProgress').getContext('2d');

    new Chart(runningCtx, {
        type: 'line',
        data: {
            labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
            datasets: [{
                label: 'Время на 5км (мин)',
                data: [28, 27, 26, 25, 24, 22],
                borderColor: '#3b82f6',
                tension: 0.3,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Прогресс в беге'
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    new Chart(strengthCtx, {
        type: 'bar',
        data: {
            labels: ['Жим лежа', 'Присед', 'Становая тяга'],
            datasets: [{
                label: 'Максимальный вес (кг)',
                data: [100, 120, 140],
                backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Силовые показатели'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Обработка формы настроек профиля
    const profileSettingsForm = document.getElementById('profileSettingsForm');
    const profileName = document.getElementById('profileName');

    if (profileSettingsForm) {
        // Загрузка сохраненных данных
        const savedSettings = JSON.parse(localStorage.getItem('profileSettings') || '{}');
        if (savedSettings.name) {
            document.getElementById('settingsName').value = savedSettings.name;
            profileName.textContent = savedSettings.name;
        }
        if (savedSettings.email) {
            document.getElementById('settingsEmail').value = savedSettings.email;
        }
        if (savedSettings.age) {
            document.getElementById('settingsAge').value = savedSettings.age;
        }

        profileSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем значения полей
            const name = document.getElementById('settingsName').value;
            const email = document.getElementById('settingsEmail').value;
            const age = document.getElementById('settingsAge').value;

            // Обновляем отображаемое имя
            profileName.textContent = name;

            // Сохраняем данные в localStorage
            const settings = { name, email, age };
            localStorage.setItem('profileSettings', JSON.stringify(settings));

            // Анимация кнопки при сохранении
            const submitButton = this.querySelector('button[type="submit"]');
            const originalContent = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-check"></i> Сохранено';
            submitButton.style.backgroundColor = 'var(--success-color)';
            
            setTimeout(() => {
                submitButton.innerHTML = originalContent;
                submitButton.style.backgroundColor = '';
            }, 2000);

            // Показываем уведомление
            showNotification('Настройки профиля успешно сохранены');
        });
    }

    // Обработка переключателей
    const switches = document.querySelectorAll('.switch input');
    switches.forEach(switchInput => {
        switchInput.addEventListener('change', function() {
            const label = this.closest('.setting-item').querySelector('span');
            if (this.checked) {
                label.style.opacity = '1';
            } else {
                label.style.opacity = '0.5';
            }
        });
    });

    // Обработка загрузки документов
    const documentUpload = document.getElementById('medicalCertificate');
    const insuranceUpload = document.getElementById('insurancePolicy');

    [documentUpload, insuranceUpload].forEach(upload => {
        upload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Здесь будет логика загрузки файла на сервер
                showNotification(`Файл ${file.name} успешно загружен`);
            }
        });
    });

    // Функция для показа уведомлений
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Анимация появления
        setTimeout(() => notification.classList.add('show'), 100);

        // Удаление уведомления
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Обработка действий с документами
    const documentActions = document.querySelectorAll('.document-actions button');
    documentActions.forEach(button => {
        button.addEventListener('click', function() {
            const action = button.querySelector('i').classList.contains('fa-download') ? 'download' : 'delete';
            const documentName = button.closest('li').querySelector('span').textContent;

            if (action === 'download') {
                // Здесь будет логика скачивания документа
                showNotification(`Скачивание ${documentName}`);
            } else {
                // Здесь будет логика удаления документа
                if (confirm(`Вы уверены, что хотите удалить ${documentName}?`)) {
                    button.closest('li').remove();
                    showNotification(`${documentName} удален`);
                }
            }
        });
    });

    // Анимация для статистики
    const stats = document.querySelectorAll('.stat');
    stats.forEach((stat, index) => {
        stat.style.animationDelay = `${index * 0.2}s`;
    });
}); 