const filterButtons = document.querySelectorAll('.filter-button');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const vibe = button.getAttribute('data-vibe')
        
        const cafeCards = document.querySelectorAll('.cafe-card')
        cafeCards.forEach(card => {
            const cardVibe = card.getAttribute('data-vibe')
            if(cardVibe && cardVibe.includes(vibe)) {
                card.style.display = 'block'
            } else {
                card.style.display = 'none'
            }
        })
    })
})

navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude
    const lng = position.coords.longitude
    console.log(`User's location: ${lat}, ${lng}`)
    fetchCafes(lat, lng)
})

function fetchCafes(lat, lng) {
    const query = `
        [out:json];
        node["amenity"~"cafe|restaurant"](around:10000,${lat},${lng});
        out 10;
    `
    
    fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
    })
    .then(response => response.json())
    .then(data => {
        if(data.elements.length > 0) {
            displayCafes(data.elements)
        }
    })
}

function displayCafes(cafes) {
    const cafeList = document.querySelector('.cafe-list')
    cafeList.innerHTML = ''
    const cafeSeeds = ['coffee', 'cafe', 'latte', 'bakery', 'espresso']

    cafes.forEach((cafe, index) => {
        const name = cafe.tags.name || 'Cozy Cafe'
        const type = cafe.tags.amenity === 'cafe' ? '☕ Cafe' : '🍽️ Restaurant'
        const vibe = type.includes('Cafe') ? 'chill' : 'family'
        const seed = cafeSeeds[index % cafeSeeds.length]

        const card = document.createElement('div')
        card.classList.add('cafe-card')
        card.setAttribute('data-vibe', vibe)
        card.innerHTML = `
            <img src="https://placehold.co/400x200/f9c6d0/white?text=Cafe" alt="${name}">
            <div class="cafe-vibe">
                <h3>${name}</h3>
                <p class="cafe-type">${type}</p>
                <p class="address">📍 ${cafe.tags['addr:street'] || 'Nearby'}</p>
            </div>
        `
        cafeList.appendChild(card)
    })
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchText = document.getElementById('searchInput').value.toLowerCase()

    const cafeCards = document.querySelectorAll('.cafe-card')
    cafeCards.forEach(card => {
        const cafeName = card.querySelector('h3').textContent.toLowerCase()
        const cafeType = card.querySelector('.cafe-type').textContent.toLowerCase()

        if(cafeName.includes(searchText) || cafeType.includes(searchText)) {
            card.style.display = 'block'
        } else {
            card.style.display = 'none'
        }
    })
})