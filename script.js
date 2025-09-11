// --- CONFIGURACIÓN ---
const API_URL = 'https://script.google.com/macros/s/AKfycbw9UdqbAeIgFWFn3B_7JHvvQhlxnRoiHFK3T3OCeEPUFARaNUs8kwD-6O6X3as-KiBz/exec'; 

// --- ELEMENTOS DEL DOM ---
const appContainer = document.getElementById('app-container');
const searchInput = document.getElementById('searchInput');
const loadingIndicator = document.getElementById('loading');
const resultsCount = document.getElementById('results-count');
const paginationControls = document.getElementById('pagination-controls');
const showCountSelect = document.getElementById('showCount');
// Botones de control
const favoritesBtn = document.getElementById('favoritesBtn');
const filtersBtn = document.getElementById('filtersBtn');
// Modal de filtros
const filterModal = document.getElementById('filterModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const applyFiltersBtn = document.getElementById('applyFiltersBtn');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const filterNivelContainer = document.getElementById('filter-nivel');
const filterAreaContainer = document.getElementById('filter-area');
// Modo oscuro
const themeToggleBtn = document.getElementById('theme-toggle');
const darkIcon = document.getElementById('theme-toggle-dark-icon');
const lightIcon = document.getElementById('theme-toggle-light-icon');

// --- ESTADO DE LA APLICACIÓN ---
let allApps = [];
let favorites = [];
let activeFilters = { nivel: [], area: [] };
let isFavoritesFilterActive = false;
let currentPage = 1;
let itemsPerPage = 12;

// --- LÓGICA PRINCIPAL ---

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initFavorites();
    fetchApps();
    setupEventListeners();
});

async function fetchApps() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar los datos.');
        allApps = await response.json();
        populateFilters();
        renderApps();
    } catch (error) {
        loadingIndicator.textContent = 'Error al cargar las aplicaciones.';
        console.error(error);
    }
}

function renderApps() {
    loadingIndicator.style.display = 'none';
    
    // 1. APLICAR FILTRO DE BÚSQUEDA
    const searchTerm = searchInput.value.toLowerCase();
    let filteredApps = searchTerm
        ? allApps.filter(app => Object.values(app).some(val => String(val).toLowerCase().includes(searchTerm)))
        : [...allApps];

    // 2. APLICAR FILTRO DE FAVORITOS
    if (isFavoritesFilterActive) {
        filteredApps = filteredApps.filter(app => favorites.includes(app.Titulo));
    }

    // 3. APLICAR FILTROS AVANZADOS
    if (activeFilters.nivel.length > 0) {
        filteredApps = filteredApps.filter(app => activeFilters.nivel.some(nivel => (app.NivelEducativo || '').includes(nivel)));
    }
    if (activeFilters.area.length > 0) {
        filteredApps = filteredApps.filter(app => activeFilters.area.some(area => (app.AreaConocimiento || '').includes(area)));
    }

    // 4. ACTUALIZAR CONTADOR
    resultsCount.textContent = `Mostrando ${filteredApps.length} de ${allApps.length} aplicaciones.`;

    // 5. CALCULAR PAGINACIÓN
    const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedApps = filteredApps.slice(startIndex, endIndex);
    
    // 6. RENDERIZAR TARJETAS
    appContainer.innerHTML = '';
    if (paginatedApps.length === 0) {
        appContainer.innerHTML = '<p class="text-center col-span-full">No se encontraron aplicaciones que coincidan con los filtros.</p>';
    } else {
        paginatedApps.forEach(app => appContainer.appendChild(createAppCard(app)));
    }

    // 7. RENDERIZAR CONTROLES DE PAGINACIÓN
    renderPaginationControls(totalPages);
}

// --- FUNCIONES DE CREACIÓN DE ELEMENTOS ---

function createAppCard(app) {
    const card = document.createElement('div');
    card.className = 'app-card relative rounded-lg p-6 flex flex-col';
    const isFavorited = favorites.includes(app.Titulo);

    card.innerHTML = `
        <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" data-title="${app.Titulo}">
            <svg class="h-6 w-6" fill="${isFavorited ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 19.5l-7.682-7.682a4.5 4.5 0 010-6.364z"></path></svg>
        </button>
        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-1">${app.Titulo || 'Sin Título'}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">por ${app.Autor || 'Anónimo'}</p>
        <p class="text-gray-700 dark:text-gray-300 flex-grow mb-4">${app.Descripcion || ''}</p>
        <div class="mb-4 text-sm"><p><span class="font-semibold">Nivel:</span> ${app.NivelEducativo || ''}</p><p><span class="font-semibold">Área:</span> ${app.AreaConocimiento || ''}</p></div>
        <div class="flex flex-wrap mb-4">${(app.PalabrasClave || '').split(',').map(tag => tag.trim() ? `<span class="tag">${tag.trim()}</span>` : '').join('')}</div>
        <a href="${app.URL}" target="_blank" rel="noopener noreferrer" class="mt-auto text-center w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition">Visitar Aplicación</a>
    `;
    card.querySelector('.favorite-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(app.Titulo);
    });
    return card;
}

function renderPaginationControls(totalPages) {
    paginationControls.innerHTML = '';
    if (totalPages <= 1) return;

    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Anterior';
    prevBtn.className = 'pagination-btn';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        currentPage--;
        renderApps();
    });

    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Siguiente';
    nextBtn.className = 'pagination-btn';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        currentPage++;
        renderApps();
    });

    paginationControls.append(prevBtn, pageInfo, nextBtn);
}


// --- LÓGICA DE FUNCIONALIDADES ---

function toggleFavorite(title) {
    const index = favorites.indexOf(title);
    if (index > -1) {
        favorites.splice(index, 1); // Quitar de favoritos
    } else {
        favorites.push(title); // Añadir a favoritos
    }
    localStorage.setItem('appFavorites', JSON.stringify(favorites));
    renderApps(); // Re-renderizar para actualizar el estado de los corazones
}

function populateFilters() {
    const niveles = new Set();
    const areas = new Set();
    allApps.forEach(app => {
        (app.NivelEducativo || '').split(',').forEach(n => n.trim() && niveles.add(n.trim()));
        (app.AreaConocimiento || '').split(',').forEach(a => a.trim() && areas.add(a.trim()));
    });

    [...niveles].sort().forEach(nivel => createFilterCheckbox(nivel, 'nivel', filterNivelContainer));
    [...areas].sort().forEach(area => createFilterCheckbox(area, 'area', filterAreaContainer));
}

function createFilterCheckbox(value, group, container) {
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" value="${value}" name="${group}"> ${value}`;
    container.appendChild(label);
}

// --- INICIALIZACIÓN Y EVENTOS ---

function setupEventListeners() {
    searchInput.addEventListener('input', () => { currentPage = 1; renderApps(); });
    showCountSelect.addEventListener('change', (e) => {
        itemsPerPage = parseInt(e.target.value, 10);
        currentPage = 1;
        renderApps();
    });
    favoritesBtn.addEventListener('click', () => {
        isFavoritesFilterActive = !isFavoritesFilterActive;
        favoritesBtn.classList.toggle('bg-blue-200', isFavoritesFilterActive);
        darkFavoritesBtn.classList.toggle('bg-blue-800', isFavoritesFilterActive);
        currentPage = 1;
        renderApps();
    });
    filtersBtn.addEventListener('click', () => filterModal.classList.remove('hidden'));
    closeModalBtn.addEventListener('click', () => filterModal.classList.add('hidden'));
    applyFiltersBtn.addEventListener('click', () => {
        activeFilters.nivel = [...filterNivelContainer.querySelectorAll('input:checked')].map(cb => cb.value);
        activeFilters.area = [...filterAreaContainer.querySelectorAll('input:checked')].map(cb => cb.value);
        currentPage = 1;
        filterModal.classList.add('hidden');
        renderApps();
    });
    clearFiltersBtn.addEventListener('click', () => {
        [...filterModal.querySelectorAll('input:checked')].forEach(cb => cb.checked = false);
        activeFilters = { nivel: [], area: [] };
        currentPage = 1;
        filterModal.classList.add('hidden');
        renderApps();
    });
    themeToggleBtn.addEventListener('click', toggleTheme);
}

function initFavorites() {
    favorites = JSON.parse(localStorage.getItem('appFavorites')) || [];
}

function initTheme() {
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        lightIcon.classList.remove('hidden');
        document.documentElement.classList.add('dark');
    } else {
        darkIcon.classList.remove('hidden');
    }
}

function toggleTheme() {
    darkIcon.classList.toggle('hidden');
    lightIcon.classList.toggle('hidden');
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('color-theme', isDark ? 'dark' : 'light');

}



