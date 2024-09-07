let map, markers = [], routing;
const trees = []; // Aquí se cargarán los árboles desde la base de datos
let selectedTree = null;

function initMap() {
    map = L.map('map').setView([15.7681, -86.7897], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}



// Función para cargar los árboles desde la base de datos

function loadTrees() {
    // Simulación de carga de árboles desde la base de datos
    trees.push({ id: 1, name: "Juan Pérez", account: "20201001", species: "Pino", career: "Informática", date: "16/07/2024" ,lat: 15.7681, lng: -86.7897 });
    trees.push({ id: 2, name: "María García", account: "20201002", species: "Caoba", career: "Derecho", date: "15/04/2023", lat: 15.7700, lng: -86.7920 });
    displayTrees(trees);
}



// Función para mostrar los árboles en el mapa y en la lista

function displayTrees(treesToShow) {
    clearMarkers();
    const treeList = document.getElementById('treeList');
    treeList.innerHTML = '';
    treesToShow.forEach(tree => {
        const marker = L.marker([tree.lat, tree.lng]).addTo(map);
        marker.bindPopup(`<b>${tree.name}</b><br>${tree.species}<br>Sembrado el ${tree.date}`);
        markers.push(marker);

        const treeItem = document.createElement('a');
        treeItem.className = 'list-group-item list-group-item-action';
        treeItem.innerHTML = `<strong>${tree.name}</strong> (${tree.account})<br>${tree.species} - ${tree.career}`;
        treeItem.onclick = () => {
            selectTree(tree, marker);
        };
        treeList.appendChild(treeItem);
    });
}




function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
}


// Funciones para filtrar y buscar árboles

function searchTrees() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredTrees = trees.filter(tree =>
        tree.name.toLowerCase().includes(searchTerm) || tree.account.includes(searchTerm)
    );
    displayTrees(filteredTrees);
}

function applyFilters() {
    const speciesFilter = document.getElementById('speciesFilter').value;
    const careerFilter = document.getElementById('careerFilter').value;

    const filteredTrees = trees.filter(tree =>
        (speciesFilter === '' || tree.species === speciesFilter) &&
        (careerFilter === '' || tree.career === careerFilter)
    );

    displayTrees(filteredTrees);
}

function selectTree(tree, marker) {
    selectedTree = tree;
    map.setView([tree.lat, tree.lng], 15);
    marker.openPopup();
    document.getElementById('showRouteBtn').style.display = 'block';
}



// Función para mostrar la ruta al árbol seleccionado

function showRoute() {
    if (!selectedTree) {
        alert('Por favor, seleccione un árbol primero.');
        return;
    }

    if (routing) {
        map.removeControl(routing);
    }

    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        routing = L.Routing.control({
            waypoints: [
                L.latLng(latitude, longitude),
                L.latLng(selectedTree.lat, selectedTree.lng)
            ],
            routeWhileDragging: true
        }).addTo(map);
    }, () => {
        alert('No se pudo obtener su ubicación. Asegúrese de permitir el acceso a la ubicación.');
    });
}

// Inicialización de la aplicación

window.onload = () => {
    initMap();
    loadTrees();
    document.getElementById('showRouteBtn').addEventListener('click', showRoute);
};