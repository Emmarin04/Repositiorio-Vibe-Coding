// --- CONFIGURACIÓN ---
// PEGA AQUÍ LA URL DE TU API DE GOOGLE APPS SCRIPT
const API_URL = 'const API_URL = 'https://script.google.com/macros/s/AKfycbwhwCzLxTb1e3fJeGbo3OBf9vsljJKbiklknXEFneDjJjc4hMwjlexqx-u96TGiSveT/exec'; 
'; 

// --- ELEMENTOS DEL DOM ---
const appContainer = document.getElementById('app-container');
const searchInput = document.getElementById('searchInput');
const loadingIndicator = document.getElementById('loading');
let allApps = []; // Array para guardar todas las aplicaciones y facilitar la búsqueda

// --- LÓGICA PRINCIPAL ---

// Evento que se dispara cuando el contenido de la página está listo
document.addEventListener('DOMContentLoaded', () => {
    fetchApps();
});

// Función para obtener las aplicaciones de nuestra API
async function fetchApps() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error al cargar los datos.');
        }
        const data = await response.json();
        allApps = data; // Guardamos los datos originales
        displayApps(allApps); // Mostramos todas las aplicaciones
    } catch (error) {
        loadingIndicator.textContent = 'Error al cargar las aplicaciones. Por favor, inténtalo de nuevo más tarde.';
        console.error(error);
    }
}

// Función para mostrar las aplicaciones en la página
function displayApps(apps) {
    appContainer.innerHTML = ''; // Limpiamos el contenedor
    loadingIndicator.style.display = 'none'; // Ocultamos el mensaje de "Cargando"

    if (apps.length === 0) {
        appContainer.innerHTML = '<p class="text-center col-span-full">No se encontraron aplicaciones.</p>';
        return;
    }

    apps.forEach(app => {
        // Asegúrate de que los nombres de las propiedades (ej. 'Titulo', 'Autor')
        // coincidan EXACTAMENTE con los encabezados de tu Google Sheet.
        const card = document.createElement('div');
        card.className = 'app-card bg-white rounded-lg shadow-md border p-6 flex flex-col';
        
        // El contenido de la tarjeta. ¡PERSONALIZA ESTO!
        card.innerHTML = `
            <h3 class="text-xl font-bold text-gray-800 mb-1">${app.Titulo || 'Sin Título'}</h3>
            <p class="text-sm text-gray-500 mb-4">por ${app.Autor || 'Anónimo'}</p>
            <p class="text-gray-700 flex-grow mb-4">${app.Descripcion || ''}</p>
            
            <div class="mb-4">
                <p class="font-semibold text-sm">Nivel: <span class="font-normal">${app.NivelEducativo || ''}</span></p>
                <p class="font-semibold text-sm">Área: <span class="font-normal">${app.AreaConocimiento || ''}</span></p>
            </div>

            <div class="flex flex-wrap mb-4">
                ${(app.PalabrasClave || '').split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
            </div>

            <a href="${app.URL}" target="_blank" rel="noopener noreferrer" class="mt-auto text-center w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition">
                Visitar Aplicación
            </a>
        `;
        appContainer.appendChild(card);
    });
}

// --- FUNCIONALIDAD DE BÚSQUEDA ---
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    const filteredApps = allApps.filter(app => {
        // Busca en varios campos. Añade más campos si lo necesitas.
        return (app.Titulo || '').toLowerCase().includes(searchTerm) ||
               (app.Descripcion || '').toLowerCase().includes(searchTerm) ||
               (app.Autor || '').toLowerCase().includes(searchTerm) ||
               (app.PalabrasClave || '').toLowerCase().includes(searchTerm);
    });

    displayApps(filteredApps);

});

