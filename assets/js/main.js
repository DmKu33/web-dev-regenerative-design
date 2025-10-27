// image data for each region
const images = {
    northern: {
        day: ['northern/day mt rainer.png', 'northern/day yellowstone .png'],
        night: ['northern/night mt rainer.jpg', 'northern/night yellostone.png']
    },
    southern: {
        day: ['southern/day miami.jpg', 'southern/day western .png'],
        night: ['southern/night miami .png', 'southern/night western.jpeg']
    },
    eastern: {
        day: ['eastern/day new york.jpg', 'eastern/day white house .jpg'],
        night: ['eastern/night nyc.png', 'eastern/night white house.png']
    },
    western: {
        day: ['western/day golden gate.jpg', 'western/day santa monica.jpg'],
        night: ['western/night golden gate.png', 'western/night santa monica.png']
    }
};

// get time period (day/night)
function getTimePeriod() {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18 ? 'day' : 'night';
}

// get region from coordinates
function getRegion(lat, lon) {
    // us region mapping - latitude first for clear north/south
    if (lat > 42) return 'northern';
    if (lat < 35) return 'southern';
    // middle latitudes - check longitude
    // mississippi river is roughly -90, use -95 as divider
    if (lon < -100) return 'western';
    if (lon > -95) return 'eastern';
    return 'western'; 
}

// display images for a region/time
function displayImages(region, timePeriod) {
    const regionImages = images[region][timePeriod];
    document.getElementById('img1').src = regionImages[0];
    document.getElementById('img2').src = regionImages[1];
    document.getElementById('region-info').textContent = `${timePeriod} • ${region}`;
}

// load content
async function loadContent() {
    try {
        // get location from api
        const apiKey = typeof IPAPI !== 'undefined' ? IPAPI : '';
        const url = apiKey 
            ? `https://api.ipapi.com/api/check?access_key=${apiKey}` 
            : 'https://ipapi.co/json/';
        console.log('Fetching from:', url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log('API Response:', data);
        
        // check if API returned an error
        if (data.error) {
            throw new Error(`API Error: ${data.error.info || data.reason || 'Unknown error'}`);
        }
        
        const region = getRegion(data.latitude, data.longitude);
        const timePeriod = getTimePeriod();
        
        displayImages(region, timePeriod);
        
    } catch (error) {
        // fallback to western day if api fails
        console.log('Error occurred:', error.message || error);
        console.log('using fallback');
        const timePeriod = getTimePeriod();
        displayImages('western', timePeriod);
    }
}

// browse modal functionality
const modal = document.getElementById('browse-modal');
const browseBtn = document.getElementById('browse-btn');
const closeBtn = document.querySelector('.close-btn');

browseBtn.addEventListener('click', () => {
    modal.classList.add('active');
    loadBrowsePreviews();
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// load preview images for browse cards
function loadBrowsePreviews() {
    const cards = document.querySelectorAll('.region-card');
    cards.forEach(card => {
        const region = card.dataset.region;
        const time = card.dataset.time;
        const previewImage = images[region][time][0];
        card.style.backgroundImage = `url('${previewImage}')`;
    });
}

// handle region card clicks
document.querySelectorAll('.region-card').forEach(card => {
    card.addEventListener('click', () => {
        const region = card.dataset.region;
        const time = card.dataset.time;
        displayImages(region, time);
        modal.classList.remove('active');
    });
});

loadContent();
