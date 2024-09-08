# TreeMap

TreeMap is a web application designed to manage and visualize trees planted in a specific area. The application allows users to register new trees, view them on a map, and apply various filters to search for specific trees.

## Features

- **Register Trees**: Users can register new trees with details such as species, location, and planting date.
- **View Trees on Map**: Trees are displayed on an interactive map using Leaflet.
- **Filter Trees**: Users can filter trees by species, career, and planting date.
- **Show Route**: Display the route from the user's current location to a selected tree.

## Getting Started

### Prerequisites

- A web browser
- Internet connection

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/treemap.git
    ```
2. Open [`index.html`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Findex.html%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "/home/kbarahona/DataStructs/Proyecto/index.html") in your web browser.

### Usage

1. **Register a Tree**:
    - Navigate to the registration page by clicking the "Registrar Árbol" button on the main page.
    - Fill in the tree details and submit the form.

2. **View Trees on Map**:
    - Navigate to the map page by clicking the "Mapa de árboles plantados" button on the main page.
    - The map will display all registered trees.

3. **Apply Filters**:
    - Use the filter options on the map page to filter trees by species, career, or planting date.

4. **Show Route**:
    - Select a tree from the list or map.
    - Click the "Mostrar Ruta" button to display the route from your current location to the selected tree.

## Code Overview

### [`inicio/mapa-arboles-script.js`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Finicio%2Fmapa-arboles-script.js%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "/home/kbarahona/DataStructs/Proyecto/inicio/mapa-arboles-script.js")

- **[`initMap()`](command:_github.copilot.openSymbolFromReferences?%5B%22initMap()%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Finicio%2Fmapa-arboles-script.js%22%2C%22external%22%3A%22file%3A%2F%2F%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Finicio%2Fmapa-arboles-script.js%22%2C%22path%22%3A%22%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Finicio%2Fmapa-arboles-script.js%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A11%2C%22character%22%3A9%7D%7D%5D%5D "Go to definition")**: Initializes the map.
- **[`loadTrees()`](command:_github.copilot.openSymbolFromReferences?%5B%22loadTrees()%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Finicio%2Fmapa-arboles-script.js%22%2C%22external%22%3A%22file%3A%2F%2F%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Finicio%2Fmapa-arboles-script.js%22%2C%22path%22%3A%22%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Finicio%2Fmapa-arboles-script.js%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A27%2C%22character%22%3A15%7D%7D%5D%5D "Go to definition")**: Loads trees from the Firebase database.
- **[`displayTrees(treesToShow)`](command:_github.copilot.openSymbolFromReferences?%5B%22displayTrees(treesToShow)%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Finicio%2Fmapa-arboles-script.js%22%2C%22external%22%3A%22file%3A%2F%2F%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Finicio%2Fmapa-arboles-script.js%22%2C%22path%22%3A%22%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Finicio%2Fmapa-arboles-script.js%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A36%2C%22character%22%3A8%7D%7D%5D%5D "Go to definition")**: Displays trees on the map and in the list.
- **[`applyFilters()`](command:_github.copilot.openSymbolFromReferences?%5B%22applyFilters()%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Finicio%2Fmapa-arboles-script.js%22%2C%22external%22%3A%22file%3A%2F%2F%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Finicio%2Fmapa-arboles-script.js%22%2C%22path%22%3A%22%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Finicio%2Fmapa-arboles-script.js%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A100%2C%22character%22%3A9%7D%7D%5D%5D "Go to definition")**: Applies filters to the list of trees.
- **[`showRoute()`](command:_github.copilot.openSymbolFromReferences?%5B%22showRoute()%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Finicio%2Fmapa-arboles-script.js%22%2C%22external%22%3A%22file%3A%2F%2F%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Finicio%2Fmapa-arboles-script.js%22%2C%22path%22%3A%22%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Finicio%2Fmapa-arboles-script.js%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A163%2C%22character%22%3A9%7D%7D%5D%5D "Go to definition")**: Displays the route to the selected tree.

### [`registro/script.js`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Fregistro%2Fscript.js%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "/home/kbarahona/DataStructs/Proyecto/registro/script.js")

- **[`obtenerFechaActual()`](command:_github.copilot.openSymbolFromReferences?%5B%22obtenerFechaActual()%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Fregistro%2Fscript.js%22%2C%22external%22%3A%22file%3A%2F%2F%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Fregistro%2Fscript.js%22%2C%22path%22%3A%22%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Fregistro%2Fscript.js%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A7%2C%22character%22%3A9%7D%7D%5D%5D "Go to definition")**: Gets the current date and time in a format compatible with the [`datetime-local`](command:_github.copilot.openSymbolFromReferences?%5B%22datetime-local%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Fregistro%2Fscript.js%22%2C%22external%22%3A%22file%3A%2F%2F%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Fregistro%2Fscript.js%22%2C%22path%22%3A%22%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Fregistro%2Fscript.js%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A6%2C%22character%22%3A66%7D%7D%5D%5D "Go to definition") input.
- **[`agregarMarcador(coords)`](command:_github.copilot.openSymbolFromReferences?%5B%22agregarMarcador(coords)%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Fregistro%2Fscript.js%22%2C%22external%22%3A%22file%3A%2F%2F%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Fregistro%2Fscript.js%22%2C%22path%22%3A%22%2Fhome%2Fkbarahona%2FDataStructs%2FProyecto%2Fregistro%2Fscript.js%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A36%2C%22character%22%3A9%7D%7D%5D%5D "Go to definition")**: Adds a marker to the map at the specified coordinates.


## Acknowledgements

- [Leaflet](https://leafletjs.com/) for the interactive map.
- [Firebase](https://firebase.google.com/) for the database.
- [OpenStreetMap](https://www.openstreetmap.org/) for the map tiles.
