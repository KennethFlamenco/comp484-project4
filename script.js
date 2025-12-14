// map.js

async function initMap() {
    // Import required libraries
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // Create the map
    const map = new Map(document.getElementById("map"), {
        zoom: 4,
        center: { lat: 34.23920845128471, lng: -118.52966190089657 }, //34.23920845128471 -118.52966190089657
        mapId: "DEMO_MAP_ID"
    });

    // zoom updates
    map.addListener("zoom_changed", () => {
        console.log("Zoom:", map.getZoom());
    });

    // center updates
    map.addListener("center_changed", () => {
        const c = map.getCenter();
        console.log("Center:", c.lat(), c.lng());
    });

    // Click to add marker
    map.addListener("click", (e) => {
        new AdvancedMarkerElement({
            position: e.latLng,
            map
        });

        map.panTo(e.latLng);
    });

    // Initial values
    console.log("Initial zoom:", map.getZoom());
    console.log(
        "Initial center:",
        map.getCenter().lat(),
        map.getCenter().lng()
    );
}

// Call AFTER page load
window.addEventListener("load", () => {
    initMap().catch(console.error);
});

