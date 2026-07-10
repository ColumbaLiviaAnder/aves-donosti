// Variable global para guardar las aves que carguemos del JSON
let listaAves = [];

// Función para cargar los datos
async function cargarAves() {
    try {
        const respuesta = await fetch('aves.json');
        listaAves = await respuesta.json();
        mostrarAves(listaAves); // Mostramos todas al empezar
    } catch (error) {
        console.error("Error cargando el archivo JSON de aves:", error);
    }
}

// Función para pintar las tarjetas en el HTML
function mostrarAves(aves) {
    const contenedor = document.getElementById('contenedor-aves');
    contenedor.innerHTML = ''; // Limpiar contenedor

    if(aves.length === 0) {
        contenedor.innerHTML = `<p class="text-center col-span-full text-stone-500">No se encontraron aves en esta categoría.</p>`;
        return;
    }

    aves.forEach(ave => {
        const tarjeta = document.createElement('div');
        tarjeta.className = "bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-stone-200";
        
        tarjeta.innerHTML = `
            <img src="${ave.imagen}" alt="${ave.nombreEs}" class="w-full h-48 object-cover">
            <div class="p-5">
                <span class="inline-block text-xs font-bold uppercase tracking-wide px-2 py-1 rounded bg-stone-100 text-stone-600 mb-2">${ave.habitat.toUpperCase()}</span>
                <h3 class="text-2xl font-bold text-stone-900">${ave.nombreEs}</h3>
                <h4 class="text-md text-teal-600 font-medium italic mb-1">${ave.nombreEu}</h4>
                <p class="text-xs text-stone-400 italic mb-4">${ave.cientifico}</p>
                <div class="bg-amber-50 p-3 rounded-xl border border-amber-100 text-sm text-amber-900">
                    <strong>💡 Sabías que...</strong> ${ave.curiosidad}
                </div>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}

// Función para filtrar según el hábitat
function filtrarAves(habitat) {
    if (habitat === 'todas') {
        mostrarAves(listaAves);
    } else {
        const avesFiltradas = listaAves.filter(ave => ave.habitat === habitat);
        mostrarAves(avesFiltradas);
    }
}

// Arrancar la app al cargar la página
document.addEventListener('DOMContentLoaded', cargarAves);