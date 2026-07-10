// Variable global para guardar las aves que carguemos del JSON
let listaAves = [];
// Variable global para controlar el audio que está sonando y evitar que se solapen
let audioActual = null;

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

// NUEVA FUNCIÓN: Para buscar y reproducir el canto desde Xeno-canto
async function escucharCanto(nombreCientifico) {
    // Si ya hay un canto sonando, lo pausamos antes de iniciar el siguiente
    if (audioActual) {
        audioActual.pause();
    }

    try {
        // Usamos corsproxy.io para evitar bloqueos de CORS en desarrollo local
        const url = `https://corsproxy.io/?https://xeno-canto.org/api/2/recordings?query=${encodeURIComponent(nombreCientifico)}`;
        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        if (datos.recordings && datos.recordings.length > 0) {
            const urlAudio = datos.recordings[0].file;
            audioActual = new Audio(urlAudio);
            audioActual.play();
            console.log(`Reproduciendo el canto de: ${nombreCientifico}`);
        } else {
            alert("Lo sentimos, no se encontró el canto de esta ave en la base de datos.");
        }
    } catch (error) {
        console.error("Error al conectar con Xeno-canto:", error);
        alert("Hubo un problema al cargar el audio.");
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
        tarjeta.className = "bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-stone-200 flex flex-col justify-between";
        
        tarjeta.innerHTML = `
            <div>
                <img src="${ave.imagen}" alt="${ave.nombreEs}" class="w-full h-48 object-cover">
                <div class="p-5pb-0 p-5">
                    <span class="inline-block text-xs font-bold uppercase tracking-wide px-2 py-1 rounded bg-stone-100 text-stone-600 mb-2">${ave.habitat.toUpperCase()}</span>
                    <h3 class="text-2xl font-bold text-stone-900">${ave.nombreEs}</h3>
                    <h4 class="text-md text-teal-600 font-medium italic mb-1">${ave.nombreEu}</h4>
                    <p class="text-xs text-stone-400 italic mb-4">${ave.cientifico}</p>
                    <div class="bg-amber-50 p-3 rounded-xl border border-amber-100 text-sm text-amber-900 mb-4">
                        <strong>💡 Sabías que...</strong> ${ave.curiosidad}
                    </div>
                </div>
            </div>
            <div class="px-5 pb-5">
                <button 
                    onclick="escucharCanto('${ave.cientifico}')" 
                    class="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-sm transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                >
                    🔊 Escuchar Canto
                </button>
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
