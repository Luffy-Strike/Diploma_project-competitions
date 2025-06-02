const cityCompetitions = {
    moscow: [
        {
            title: 'Московский марафон',
            date: '2024-05-20',
            location: 'Парк Горького',
            coordinates: [55.731749, 37.603486]
        },
        {
            title: 'Турнир по воркауту',
            date: '2024-06-05',
            location: 'ВДНХ',
            coordinates: [55.826479, 37.637276]
        }
    ],
    spb: [
        {
            title: 'Полумарафон "Белые ночи"',
            date: '2024-06-15',
            location: 'Дворцовая площадь',
            coordinates: [59.939095, 30.315868]
        }
    ],
    kazan: [
        {
            title: 'Казанский марафон',
            date: '2024-07-01',
            location: 'Центр семьи "Казан"',
            coordinates: [55.798984, 49.106073]
        }
    ]
};

const cityCenters = {
    moscow: [55.755819, 37.617644],
    spb: [59.939095, 30.315868],
    kazan: [55.798984, 49.106073]
};

let map;
let currentCity = '';

function init() {
    var myMap = new ymaps.Map("map", {
        center: [55.76, 37.64], // Москва
        zoom: 11,
        controls: ['zoomControl']
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var coords = [position.coords.latitude, position.coords.longitude];
            myMap.setCenter(coords, 12);
            
            var locationPlacemark = new ymaps.Placemark(coords, {
                hintContent: 'Вы здесь'
            }, {
                preset: 'islands#blueCircleDotIcon'
            });
            myMap.geoObjects.add(locationPlacemark);

            showNearbyEvents(coords);
        }, function(error) {
            console.error('Ошибка геолокации:', error);
            showNearbyEvents([55.76, 37.64]);
        });
    } else {
        showNearbyEvents([55.76, 37.64]);
    }

    function showNearbyEvents(coords) {
        var events = [
            {
                title: 'Городской марафон',
                date: '25.05.2024',
                location: 'Парк Горького',
                coordinates: [coords[0] + 0.01, coords[1] + 0.01],
                type: 'Бег'
            },
            {
                title: 'Велогонка',
                date: '15.06.2024',
                location: 'ВДНХ',
                coordinates: [coords[0] - 0.01, coords[1] - 0.01],
                type: 'Велоспорт'
            },
            {
                title: 'Турнир по воркауту',
                date: '01.07.2024',
                location: 'Спортивный парк',
                coordinates: [coords[0] + 0.02, coords[1] - 0.02],
                type: 'Воркаут'
            }
        ];

        events.forEach(function(event) {
            var placemark = new ymaps.Placemark(event.coordinates, {
                hintContent: event.title,
                balloonContent: `
                    <h3>${event.title}</h3>
                    <p><i class="fas fa-calendar"></i> ${event.date}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                    <p><i class="fas fa-running"></i> ${event.type}</p>
                `
            }, {
                preset: 'islands#redSportIcon'
            });
            myMap.geoObjects.add(placemark);
        });

        updateEventsList(events);
    }

    function updateEventsList(events) {
        var container = document.getElementById('eventsList');
        container.innerHTML = '<h2>Ближайшие события</h2>';

        events.forEach(function(event) {
            var eventElement = document.createElement('div');
            eventElement.className = 'event-item card';
            eventElement.innerHTML = `
                <h3>${event.title}</h3>
                <p><i class="fas fa-calendar"></i> ${event.date}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                <p><i class="fas fa-running"></i> ${event.type}</p>
                <button class="btn-select">Участвовать</button>
            `;
            container.appendChild(eventElement);
        });
    }
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userCoords = [position.coords.latitude, position.coords.longitude];
                showUserLocation(userCoords);
                findNearestCity(userCoords);
            },
            (error) => {
                console.error('Ошибка получения геолокации:', error);
                showCompetitions('moscow');
            }
        );
    }
}

function showUserLocation(coords) {
    const placemark = new ymaps.Placemark(coords, {
        hintContent: 'Вы здесь'
    }, {
        preset: 'islands#blueCircleDotIcon'
    });
    map.geoObjects.add(placemark);
}

function findNearestCity(userCoords) {
    let minDistance = Infinity;
    let nearestCity = 'moscow';

    for (const [city, coords] of Object.entries(cityCenters)) {
        const distance = getDistance(userCoords, coords);
        if (distance < minDistance) {
            minDistance = distance;
            nearestCity = city;
        }
    }

    document.getElementById('citySelect').value = nearestCity;
    showCompetitions(nearestCity);
}

function getDistance(coords1, coords2) {
    const [lat1, lon1] = coords1;
    const [lat2, lon2] = coords2;
    return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2));
}

function showCompetitions(city) {
    map.geoObjects.removeAll();
    
    const competitions = cityCompetitions[city];
    const container = document.getElementById('nearbyCompetitions');
    container.innerHTML = '<h2>Ближайшие соревнования</h2>';

    competitions.forEach(comp => {
        const placemark = new ymaps.Placemark(comp.coordinates, {
            hintContent: comp.title,
            balloonContent: `
                <h3>${comp.title}</h3>
                <p>Дата: ${formatDate(comp.date)}</p>
                <p>Место: ${comp.location}</p>
            `
        }, {
            preset: 'islands#blueSpotIcon'
        });
        map.geoObjects.add(placemark);
        const competitionElement = document.createElement('div');
        competitionElement.className = 'competition-item';
        competitionElement.innerHTML = `
            <h3>${comp.title}</h3>
            <p>Дата: ${formatDate(comp.date)}</p>
            <p>Место: ${comp.location}</p>
        `;
        container.appendChild(competitionElement);
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

ymaps.ready(init); 