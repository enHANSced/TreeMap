
// Referencia a la base de datos de Firebase
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
const db = window.db;

// Variables globales
let map, markers = [], routing;
const trees = []; // Aquí se cargarán los árboles desde la base de datos
let selectedTree = null;

// Obtener referencia al modal de carga
const loadingModalElement = document.getElementById('loadingModal');
const loadingModal = new bootstrap.Modal(loadingModalElement);

// Obtener las coordenadas de la ubicación actual
let latitude = 15.7681, longitude = -86.7897; // Coordenadas de la UNAH-VS
navigator.geolocation.getCurrentPosition(position => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log(`Ubicación actual: ${latitude}, ${longitude}`);
});


// Función para inicializar el mapa
function initMap() {
    map = L.map('map').setView([latitude, longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

}




// Función para cargar los árboles desde la base de datos
async function loadTrees() {
    try {
        // Mostrar el modal de carga
        loadingModal.show();
        const querySnapshot = await getDocs(
            query(collection(db, 'tree'), orderBy('fecha', 'desc'))
        );
        querySnapshot.forEach(doc => {
            const tree = doc.data();
            console.log(tree);
            tree.id = doc.id;
            trees.push(tree);
        });


        displayTrees(trees);
    } catch (error) {
        console.error("Error al cargar los árboles: ", error);
    } finally {
        // Ocultar el modal de carga
        console.log("Ocultando modal de carga");
        loadingModal.hide();

        // Asegurarse de que el modal esté completamente oculto
        loadingModalElement.addEventListener('hidden.bs.modal', () => {
            console.log("Modal de carga oculto");
        });

        // Forzar el ocultamiento del modal manipulando el DOM directamente
        // agregar un delay para que la animación de ocultamiento se complete
        setTimeout(() => {
            loadingModalElement.classList.add('fade');
            loadingModalElement.classList.remove('show');
            setTimeout(() => {
                loadingModalElement.style.display = 'none';
                document.body.classList.remove('modal-open');
                document.querySelector('.modal-backdrop').remove();
            }, 200);
        }, 400);
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

        const imageUrl = tree.imagenURL || '../recursos/default-tree.svg'; // Reemplaza con la URL de tu imagen por defecto

        // Agregar un popup al marcador
        marker.bindPopup(`
    <div class="popup-content">
        <div class="popup-image-container">
            <img src="${imageUrl}" alt="Imagen del árbol" class="tree-image" onclick="showImageModal('${imageUrl}')">
        </div>
        <div class="popup-text">
            <b>${tree.nombre}</b><br>${tree.especie}<br><b>Sembrado el</b> ${getFormattedDate(tree.fecha.toDate())} a las ${getFormattedTime(tree.fecha.toDate())}<br>
            <button class="btn btn-success btn-sm mt-1" onclick="showRoute()">Mostrar Ruta</button>
        </div>
    </div>
`);
        marker.on('click', () => { selectMarker(tree, marker); });


        // Función para seleccionar un árbol y centrar el mapa en su ubicación
        function selectMarker(tree, marker) {
            selectedTree = tree;
            map.flyTo(marker.getLatLng(), 15, { animate: true, duration: 1 }); // Utiliza flyTo en lugar de setView para un centrado suave
            marker.openPopup();
            //document.getElementById('showRouteBtn').style.display = 'block';
        }

        // Detectar cuando se cierra el popup
        marker.on('popupclose', () => {
            //document.getElementById('showRouteBtn').style.display = 'none';
            //haacer zoom al mapa en la ubicacion del ultimo marcador seleccionado
            map.flyTo(marker.getLatLng(), 14, { animate: true, duration: 0.6 });

            //map.setView([15.7681, -86.7897], 13, { animate: true, duration: 1 });

            //map.flyTo([latitude, longitude], 14, { animate: true, duration: 0.4 });
        });

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
            //cerrar el popup actual
            map.closePopup();
            selectTree(tree, marker);
        };
        treeList.appendChild(treeItem);
    });
}


// Función para mostrar la imagen en un modal
function showImageModal(imageUrl) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    modal.style.display = 'block';
    modalImg.src = imageUrl;
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
}





function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
}




// Función para buscar árboles
function searchTrees() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredTrees = trees.filter(tree =>
        tree.nombre.toLowerCase().includes(searchTerm)
    );
    displayTrees(filteredTrees);
}





// Función para cambiar el icono de filtro al expandir o contraer
document.addEventListener('DOMContentLoaded', function () {
    var filterContent = document.getElementById('filterContent');
    var filterIcon = document.getElementById('filterIcon');

    filterContent.addEventListener('show.bs.collapse', function () {
        filterIcon.classList.remove('bi-chevron-down');
        filterIcon.classList.add('bi-chevron-up');
    });

    filterContent.addEventListener('hide.bs.collapse', function () {
        filterIcon.classList.remove('bi-chevron-up');
        filterIcon.classList.add('bi-chevron-down');
    });
});





// Función para aplicar los filtros
function resetFilters() {
    document.getElementById('speciesFilter').value = '';
    document.getElementById('careerFilter').value = '';
    document.getElementById('dateFilter').value = '';
    document.getElementById('resetFiltersBtn').style.display = 'none';
    applyFilters(); // Reaplicar los filtros para mostrar todos los árboles
    document.getElementById('resetFiltersBtn').style.display = 'none'; // Oculta el botón de restablecer
    map.setView([15.7681, -86.7897], 13, { animate: true, duration: 2 }); // Centra el mapa en la posición inicial
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

    document.getElementById('resetFiltersBtn').style.display = 'block';

    displayTrees(filteredTrees);
}


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




// Función para buscar árboles en tiempo real
function liveSearchTrees() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredTrees = trees.filter(tree => {
        const cuentaStr = tree.cuenta.toString(); // Convertir `cuenta` a string
        return tree.nombre.toLowerCase().includes(searchTerm) || cuentaStr.includes(searchTerm);
    });
    displayTrees(filteredTrees);
}


// Función para limpiar el campo de búsqueda
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    liveSearchTrees(); // Actualiza la lista para mostrar todos los árboles
    map.setView([15.7681, -86.7897], 13, { animate: true, duration: 2 }); // Centra el mapa en la posición inicial
    document.getElementById('clearSearch').style.display = 'none'; // Oculta el botón de borrar
}

// Función para mostrar u ocultar el botón de limpiar
function toggleClearButton() {
    const clearButton = document.getElementById('clearSearch');
    clearButton.style.display = document.getElementById('searchInput').value ? 'inline-block' : 'none';
}






// Función para seleccionar un árbol y centrar el mapa en su ubicación
function selectTree(tree, marker) {
    selectedTree = tree;
    map.flyTo(marker.getLatLng(), 17, { animate: true, duration: 2.5 }); // Utiliza flyTo en lugar de setView para un centrado suave
    marker.openPopup();
    //document.getElementById('showRouteBtn').style.display = 'block';


    // Desplazar suavemente hacia el mapa en dispositivos móviles
    const mapContainer = document.getElementById('map');
    mapContainer.scrollIntoView({ behavior: 'smooth' });
}


// Mostrar/ocultar el botón al desplazarse
window.onscroll = function () {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

// Función para desplazarse al inicio de la página
function scrollToTop() {
    document.body.scrollTop = 0; // Para Safari
    document.documentElement.scrollTop = 0; // Para Chrome, Firefox, IE y Opera
}






// Función para mostrar la ruta al árbol seleccionado
function showRoute() {
    if (!selectedTree) {
        alert('Por favor, seleccione un árbol primero.');
        return;
    }

    // Eliminar todos los marcadores del mapa
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    if (routing) {
        map.removeControl(routing);
    }


    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;

        routing = L.Routing.control({
            waypoints: [
                L.latLng(latitude, longitude),
                L.latLng(selectedTree.ubicacion.latitude, selectedTree.ubicacion.longitude)
            ],
            routeWhileDragging: true,
            show: false, // Ocultar las indicaciones de la ruta
            lineOptions: { styles: [{ color: '#14A44D', weight: 6 }] },
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            language: 'es',
            collapsible: true, // Mostrar el panel de indicaciones colapsado
            showAlternatives: true,
            altLineOptions: { styles: [{ color: '#9FA6B2', weight: 6 }] },
            createMarker: function (i, wp) {
                if (i === 0) {
                    return L.marker(wp.latLng).bindPopup('Ubicación actual');
                } else {
                    const treeMarker = L.marker(wp.latLng, {
                        icon: treeIcon
                    }).bindPopup(`<b>${selectedTree.nombre}</b><br>${selectedTree.especie}<br><b>Sembrado el</b> ${selectedTree.fecha.toDate().toLocaleDateString()} a las ${selectedTree.fecha.toDate().toLocaleTimeString()}
            <br><button class="btn btn-danger btn-sm mt-1" onclick="hideRoute()">Ocultar Ruta</button>`);
                    treeMarker.openPopup(); // Abre el popup por defecto
                    return treeMarker;
                }
            },
        }).addTo(map);



        // Mostrar el botón de "Ocultar Ruta" y ocultar el de "Mostrar Ruta"
        document.getElementById('hideRouteBtn').style.display = 'block';
    });
}

// Función para ocultar la ruta y restaurar el mapa
function hideRoute() {
    // Eliminar todos los marcadores del mapa
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    if (routing) {
        map.removeControl(routing);
        routing = null;
    }

    // Ocultar el botón de "Ocultar Ruta" y mostrar el de "Mostrar Ruta"
    document.getElementById('hideRouteBtn').style.display = 'none';
    //document.getElementById('showRouteBtn').style.display = 'block';


    displayTrees(trees); // Volver a mostrar los árboles en el mapa
    map.flyTo([latitude, longitude], 13, { animate: true, duration: 1.5 }); // Centrar el mapa en la posición inicial
}









// Hacer las funciones disponibles globalmente
window.searchTrees = searchTrees;
window.applyFilters = applyFilters;
window.resetFilters = resetFilters;
window.hideRoute = hideRoute;
window.showRoute = showRoute;
window.showImageModal = showImageModal;
window.closeModal = closeModal;
window.scrollToTop = scrollToTop;




// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    loadTrees();
    document.getElementById('searchInput').addEventListener('input', () => {
        liveSearchTrees();
        toggleClearButton(); // Muestra u oculta el botón de borrar
    });
    document.getElementById('clearSearch').addEventListener('click', clearSearch);
    // Agregar un evento al botón de mostrar ruta
    //document.getElementById('showRouteBtn').addEventListener('click', showRoute);
});


