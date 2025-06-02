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

    avatarUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileAvatar.src = e.target.result;
                // Сохраняем в localStorage
                localStorage.setItem('userAvatar', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Восстанавливаем аватар из localStorage
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        profileAvatar.src = savedAvatar;
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

    // Обработка формы настроек
    const settingsForm = document.getElementById('profileSettings');
    settingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            birthDate: document.getElementById('birthDate').value,
            notifications: Array.from(document.querySelectorAll('input[type="checkbox"]'))
                .map(checkbox => ({
                    type: checkbox.parentElement.textContent.trim(),
                    enabled: checkbox.checked
                }))
        };

        // Сохраняем настройки в localStorage
        localStorage.setItem('userSettings', JSON.stringify(formData));

        // Показываем уведомление об успешном сохранении
        showNotification('Настройки успешно сохранены');
    });

    // Восстанавливаем настройки из localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        document.getElementById('fullName').value = settings.fullName;
        document.getElementById('email').value = settings.email;
        document.getElementById('phone').value = settings.phone;
        document.getElementById('birthDate').value = settings.birthDate;
        
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        settings.notifications.forEach((notification, index) => {
            checkboxes[index].checked = notification.enabled;
        });
    }

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
        notification.className = 'alert alert-success';
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '1000';
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
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
}); 