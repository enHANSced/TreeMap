// Importar Firebase Storage
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

// Referencia a la base de datos de Firebase
import { collection, addDoc, Timestamp, GeoPoint } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
const db = window.db;
const storage = getStorage();


// Obtener la fecha y hora actual en formato compatible con input datetime-local
function obtenerFechaActual() {
    const ahora = new Date();
    ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset()); // Ajustar la fecha a la zona horaria local
    const fecha = ahora.toISOString().slice(0, 16); // Formato 'YYYY-MM-DDTHH:MM'
    document.getElementById('fecha').value = fecha; // Establecer la fecha actual por defecto
}

// Inicializar el mapa centrado en una ubicación genérica (en caso de fallo en la geolocalización)
const map = L.map('map').setView([15.7681, -86.7897], 13);

// Añadir capa de mapa (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);



// Crear un icono personalizado para el marcador de árbol
const treeIcon = L.icon({
    iconUrl: '../recursos/plant.svg', // Reemplaza con la URL de tu imagen de árbol
    iconSize: [48, 53], // Tamaño del icono
    iconAnchor: [24, 52], // Punto del icono que se corresponde con la ubicación
    popupAnchor: [0, -53] // Punto desde el cual se muestra el popup respecto al icono
});

// Variable para almacenar el marcador
let marker;

// Función para agregar un marcador en la ubicación actual
function agregarMarcador(coords) {
    // Si ya existe un marcador, se elimina para actualizarlo
    if (marker) {
        map.removeLayer(marker);
    }

    // Crear un nuevo marcador en la ubicación seleccionada con el icono personalizado
    marker = L.marker([coords.lat, coords.lng], { icon: treeIcon }).addTo(map)
        .bindTooltip(`Ubicación seleccionada: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`, { permanent: false, direction: 'top' });

    // Guardar las coordenadas en el marcador para usar al registrar
    marker.coords = [coords.lat, coords.lng];
}

// Centrar el mapa y agregar un marcador en la ubicación actual del usuario
function centrarEnUbicacionActual() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const currentCoords = { lat: latitude, lng: longitude };
                map.setView(currentCoords, 14); // Centrar y ajustar el zoom
                agregarMarcador(currentCoords); // Agregar el marcador en la ubicación actual
            },
            () => {
                console.warn("No se pudo obtener la ubicación actual.");
            }
        );
    } else {
        console.warn("La geolocalización no es soportada por este navegador.");
    }
}

// Llamar a la función para centrar en la ubicación actual al cargar la página
centrarEnUbicacionActual();

// Manejo del click en el mapa para actualizar el marcador
map.on('click', function (e) {
    const coords = e.latlng; // Obtener coordenadas de la ubicación seleccionada
    agregarMarcador(coords); // Agregar o actualizar el marcador en la nueva ubicación
});

// Agregar el botón para centrar en la ubicación actual
L.easyButton('bi bi-crosshair', function (btn, map) {
    centrarEnUbicacionActual();
}, 'Centrar en mi ubicación actual').addTo(map);









// Función para mostrar el modal con la animación Lottie y el mensaje
function mostrarModalExito(nombre, especie) {
    // Inicializar la animación Lottie
    lottie.loadAnimation({
        container: document.getElementById('lottie-animation'), // ID del contenedor
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: '../recursos/tree-succes.json' // Ruta a tu archivo de animación Lottie
    });

    // Actualizar el mensaje del modal
    const successMessage = document.getElementById('successMessage');
    if (especie === 'Desconocido') {
        successMessage.textContent = `${nombre}, tu árbol ha sido registrado exitosamente. ¡Gracias por sembrar vida!`;
    } else {
        successMessage.textContent = `${nombre}, tu ${especie} ha sido registrado(a) exitosamente. ¡Gracias por sembrar vida!`;
    }

    // Ocultar el modal de carga
    $('#loadingModal').modal('hide');

    // Mostrar el modal de éxito
    $('#successModal').modal('show');

    // Agregar evento click al botón "Ver en el Mapa"
    document.getElementById('verMapaBtn').addEventListener('click', function () {
        window.location.href = '../inicio/mapa-arboles.html'; 
    });
}




// Manejo del formulario de registro
document.getElementById('registro-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Verificar si hay un marcador con coordenadas seleccionadas
    if (!marker || !marker.coords) {
        alert('Por favor, selecciona la ubicación de tu árbol en el mapa.');
        return;
    }

    // Mostrar el modal de carga
    $('#loadingModal').modal('show');

    // Capturar datos del formulario
    const nombre = document.getElementById('nombre').value;
    const cuenta = document.getElementById('cuenta').value;

    const carreraSelect = document.getElementById('carrera');
    const especieSelect = document.getElementById('especie');

    const carrera = carreraSelect.options[carreraSelect.selectedIndex].text;
    const especie = especieSelect.options[especieSelect.selectedIndex].text;

    const fecha = document.getElementById('fecha').value;


    // Obtener las coordenadas del marcador
    const coords = marker.coords;

    // Obtener el archivo de imagen
    const imagenInput = document.getElementById('imagen');
    const imagenArchivo = imagenInput.files[0];

    try {
        let imagenURL = null;

        // Verificar si se seleccionó una imagen
        if (imagenArchivo) {
            // Subir la imagen a Firebase Storage y obtener la URL
            const imagenRef = ref(storage, `imagenes/${imagenArchivo.name}`);
            await uploadBytes(imagenRef, imagenArchivo);
            imagenURL = await getDownloadURL(imagenRef);
        }

        // Registrar en Firestore
        const docData = {
            nombre,
            cuenta,
            carrera,
            especie,
            fecha: Timestamp.fromDate(new Date(fecha)),
            ubicacion: new GeoPoint(coords[0], coords[1])
        };

        // Agregar la URL de la imagen si existe
        if (imagenURL) {
            docData.imagenURL = imagenURL;
        }

        const docRef = await addDoc(collection(db, "tree"), docData);
        console.log("Document written with ID: ", docRef.id);


        // Mensaje de exito
        mostrarModalExito(nombre, especie);
 

        // Limpiar formulario
        document.getElementById('registro-form').reset();
        obtenerFechaActual(); // Restablecer la fecha actual por defecto
    } catch (error) {
        console.error("Error al registrar el árbol: ", error);
        alert("Hubo un error al registrar el árbol. Por favor, intenta nuevamente.");
        // Ocultar el modal de carga en caso de error
        $('#loadingModal').modal('hide');
    }
});

// Inicializar la fecha actual al cargar la página
obtenerFechaActual();

// Crear un control de búsqueda de geocodificación y añadirlo al mapa
const geocoder = L.Control.Geocoder.nominatim({
    geocodingQueryParams: {
        //viewbox: '-90.5069,14.6349,-90.5069,14.6349', // Coordenadas de la zona de búsqueda (latitud mínima, longitud mínima, latitud máxima, longitud máxima)
        bounded: 1, // Limitar los resultados a la zona de búsqueda
        limit: 8 // Limitar el número de resultados devueltos
    }
});
L.Control.geocoder({
    geocoder: geocoder,
    placeholder: 'Buscar ubicación...'
}).addTo(map);

