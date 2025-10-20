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
    if (lon < -100) return 'western';
    if (lon > -80) return 'eastern';
    return 'western'; 
}

// load content
async function loadContent() {
    try {
        // get location from api
        const apiKey = typeof IPAPI !== 'undefined' ? IPAPI : '';
        const url = apiKey ? `https://ipapi.co/json/?key=${apiKey}` : 'https://ipapi.co/json/';
        const response = await fetch(url);
        const data = await response.json();
        
        const region = getRegion(data.latitude, data.longitude);
        const timePeriod = getTimePeriod();
        
        // update header
        document.getElementById('header').textContent = `${timePeriod} time ${region}`;
        
        // load images based on time
        const regionImages = images[region][timePeriod];
        document.getElementById('img1').src = regionImages[0];
        document.getElementById('img2').src = regionImages[1];
        
    } catch (error) {
        // fallback to western day if api fails
        console.log('using fallback');
        const timePeriod = getTimePeriod();
        document.getElementById('header').textContent = `${timePeriod} time western`;
        document.getElementById('img1').src = images.western[timePeriod][0];
        document.getElementById('img2').src = images.western[timePeriod][1];
    }
}

loadContent();
