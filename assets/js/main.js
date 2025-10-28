// image data for each region with labels
const images = {
    northern: {
        day: [
            { src: 'northern/day mt rainer.png', label: 'Mt. Rainier' },
            { src: 'northern/day yellowstone .png', label: 'Yellowstone' }
        ],
        night: [
            { src: 'northern/night mt rainer.jpg', label: 'Mt. Rainier' },
            { src: 'northern/night yellostone.png', label: 'Yellowstone' }
        ]
    },
    southern: {
        day: [
            { src: 'southern/day miami.jpg', label: 'Miami' },
            { src: 'southern/day western .png', label: 'Texas' }
        ],
        night: [
            { src: 'southern/night miami .png', label: 'Miami' },
            { src: 'southern/night western.jpeg', label: 'Texas' }
        ]
    },
    eastern: {
        day: [
            { src: 'eastern/day new york.jpg', label: 'New York' },
            { src: 'eastern/day white house .jpg', label: 'White House' }
        ],
        night: [
            { src: 'eastern/night nyc.png', label: 'NYC' },
            { src: 'eastern/night white house.png', label: 'White House' }
        ]
    },
    western: {
        day: [
            { src: 'western/day golden gate.jpg', label: 'Golden Gate' },
            { src: 'western/day santa monica.jpg', label: 'Santa Monica' }
        ],
        night: [
            { src: 'western/night golden gate.png', label: 'Golden Gate' },
            { src: 'western/night santa monica.png', label: 'Santa Monica' }
        ]
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
function displayImages(region, timePeriod, locationInfo = null) {
    const regionImages = images[region][timePeriod];
    
    // set images
    document.getElementById('img1').src = regionImages[0].src;
    document.getElementById('img2').src = regionImages[1].src;
    
    // set image labels
    document.getElementById('label1').textContent = regionImages[0].label;
    document.getElementById('label2').textContent = regionImages[1].label;
    
    // update region info
    document.getElementById('region-info').textContent = `${timePeriod} • ${region}`;
    
    // more info on subtitle
    const subtitle = document.getElementById('subtitle');
    if (locationInfo) {
        const { city, region_name, country_name } = locationInfo;
        const location = city || region_name || country_name || 'your location';
        subtitle.textContent = `showing ${region} region • ${timePeriod} time • based on ${location} & current hour`;
    } else {
        subtitle.textContent = `showing ${region} region • ${timePeriod} time`;
    }
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
        
        // pass location info for detailed subtitle
        displayImages(region, timePeriod, {
            city: data.city,
            region_name: data.region || data.region_name,
            country_name: data.country || data.country_name
        });
        
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
        const previewImage = images[region][time][0].src;
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
