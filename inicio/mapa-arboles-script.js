
// Referencia a la base de datos de Firebase
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
const db = window.db;

// Variables globales
let map, markers = [], routing;
const trees = []; // Aquí se cargarán los árboles desde la base de datos
let selectedTree = null;

// Función para inicializar el mapa
function initMap() {
    map = L.map('map').setView([15.7681, -86.7897], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}









// Función para cargar los árboles desde la base de datos
async function loadTrees() {
    try {
        const querySnapshot = await getDocs(collection(db, 'tree'));
        querySnapshot.forEach(doc => {
            const tree = doc.data();
            console.log(tree);
            tree.id = doc.id;
            trees.push(tree);
        });
        displayTrees(trees);
    } catch (error) {
        console.error("Error al cargar los árboles: ", error);
    }
}









//icono personalizado para el marcador de árbol
const treeIcon = L.icon({
    iconUrl: '../recursos/tree-pin.svg', // Reemplaza con la URL de tu imagen de árbol
    iconSize: [64, 60], // Tamaño del icono
    iconAnchor: [24, 60], // Punto del icono que se corresponde con la ubicación
    popupAnchor: [0, -60] // Punto desde el cual se muestra el popup respecto al icono
});


// Función para mostrar los árboles en el mapa y en la lista
function displayTrees(treesToShow) {
    clearMarkers();
    const treeList = document.getElementById('treeList');
    treeList.innerHTML = '';
    treesToShow.forEach(tree => {
        const marker = L.marker([tree.ubicacion.latitude, tree.ubicacion.longitude], { icon: treeIcon }).addTo(map);
        // Agregar un popup al marcador
        marker.bindPopup(`<b>${tree.nombre}</b><br>${tree.especie}<br><b>Sembrado el</b> ${getFormattedDate(tree.fecha.toDate())} a las ${getFormattedTime(tree.fecha.toDate())}`);

        // Función para obtener la fecha formateada
        function getFormattedDate(date) {
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            return date.toLocaleDateString('es', options);
        }

        // Función para obtener la hora formateada
        function getFormattedTime(date) {
            const options = { hour: 'numeric', minute: 'numeric', hour12: true };
            return date.toLocaleTimeString('en-US', options);
        } markers.push(marker);

        const treeItem = document.createElement('a');
        treeItem.className = 'list-group-item list-group-item-action';
        treeItem.innerHTML = `<strong>${tree.nombre}</strong> (${tree.cuenta})<br>${tree.especie} - ${tree.carrera}`;
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






// Función para buscar árboles
function searchTrees() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredTrees = trees.filter(tree =>
        tree.nombre.toLowerCase().includes(searchTerm) || tree.cuenta.includes(searchTerm)
    );
    displayTrees(filteredTrees);
}

// Función para aplicar los filtros
function applyFilters() {
    const speciesFilter = document.getElementById('speciesFilter').value;
    const careerFilter = document.getElementById('careerFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;

    const filteredTrees = trees.filter(tree => {
        const matchesSpecies = speciesFilter === '' || tree.especie === speciesFilter;
        const matchesCareer = careerFilter === '' || tree.carrera === careerFilter;
        const matchesDate = dateFilter === '' || filterByDate(tree.fecha.toDate(), dateFilter);
        return matchesSpecies && matchesCareer && matchesDate;
    });

    displayTrees(filteredTrees);
}

// Hacer las funciones disponibles globalmente
window.searchTrees = searchTrees;
window.applyFilters = applyFilters;


// Función para filtrar por fecha
function filterByDate(treeDate, filter) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
        case 'today':
            return treeDate >= today;
        case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            return treeDate >= yesterday && treeDate < today;
        case 'last_week':
            const lastWeek = new Date(today);
            lastWeek.setDate(today.getDate() - 7);
            return treeDate >= lastWeek;
        case 'last_month':
            const lastMonth = new Date(today);
            lastMonth.setMonth(today.getMonth() - 1);
            return treeDate >= lastMonth;
        default:
            return true;
    }
}








// Función para seleccionar un árbol y centrar el mapa en su ubicación
function selectTree(tree, marker) {
    selectedTree = tree;
    map.flyTo(marker.getLatLng(), 17, {animate: true, duration: 1.2}); // Utiliza flyTo en lugar de setView para un centrado suave
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
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    loadTrees();
    document.getElementById('showRouteBtn').addEventListener('click', showRoute);
});


