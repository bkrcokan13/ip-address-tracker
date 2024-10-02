document.addEventListener('DOMContentLoaded', () => {
    var map = L.map('map', { zoomControl: false }).setView([51.505, -0.09], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    var customIcon = L.icon({
        iconUrl: '/images/icon-location.svg',
        iconSize: [35, 45],
        iconAnchor: [19, 50],
        popupAnchor: [0, -50]
    });

    let domainRegexPattern = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;
    let ipAddressRegexPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    var submitButton = document.getElementById('search-submit-btn');

    submitButton.addEventListener('click', () => {
        var ipAddressLabel = document.getElementById('ip-address-label');
        var locationLabel = document.getElementById('location-label');
        var timezoneLabel = document.getElementById('timezone-label');
        var ispLabel = document.getElementById('isp-label');
        var searchInput = document.getElementById('search-input-field').value;

        let apiUrl;
        if (domainRegexPattern.test(searchInput)) {
            apiUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=at_4vUxgnGDauF1cM1wq6dyZhhtJkxq8&domain=${searchInput}`;
        } else if (ipAddressRegexPattern.test(searchInput)) {
            apiUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=at_4vUxgnGDauF1cM1wq6dyZhhtJkxq8&ipAddress=${searchInput}`;
        } else {
            alert("Invaild IP Address or domain !");
            return;
        }

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    ipAddressLabel.innerText = data.ip;
                    locationLabel.innerText = `${data.location.city}, ${(data.location.region) ? data.location.region : data.location.country}\n${(data.location.postalCode) ? data.location.postalCode : ""}`;
                    timezoneLabel.innerText = `UTC ${data.location.timezone}`;
                    ispLabel.innerText = data.isp;
                }

                if (data.location) {
                    const { lat, lng } = data.location;
                    L.marker([lat, lng], { icon: customIcon }).addTo(map);
                    map.setView([lat, lng], 13);
                }


            })
            .catch(error => console.error("Fetch error:", error));
    });
});