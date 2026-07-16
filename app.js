// app.js - LÓGICA VISUAL Y CONEXIÓN DE APIs

const btnCargar = document.getElementById('btn-cargar');
const btnVisualizar = document.getElementById('btn-visualizar');
const contenido = document.getElementById('contenido-dinamico');

// ==========================================
// CONFIGURACIÓN DE APIs
// ==========================================
const TMDB_API_KEY = '671bd8f1936f7bb24d046995dedc5263';
const STRAPI_URL = 'https://gestionweb.frlp.utn.edu.ar/api/grupo29-peliculas';
const STRAPI_TOKEN = '8c457faa9e1976eda8492d0c470848626d5e7255008b189a8774819632c1e1c675acd69a6eaca57d7771e1c03e2b93b457f250d8007e6dcda81493b7199c7f76de93730cf2496417a057999bf78d10ddc89b11ecaa0e8787dc3abe97c79f69fde29cd958c93e7eb928419506215d60338d45ed8a9b71704b6c09a2050a64f86f';

// Variable global para almacenar la instancia del gráfico y destruirla al recargar
let chartInstance = null;

// Función para marcar el botón activo en la barra lateral
function setActiveBtn(activeBtn) {
    btnCargar.classList.remove('active');
    btnVisualizar.classList.remove('active');
    activeBtn.classList.add('active');
}

// ==========================================
// PANTALLA 1: Formulario de Carga (GUILLERMO)
// ==========================================
btnCargar.addEventListener('click', () => {
    setActiveBtn(btnCargar);
    
    // Dibujamos el formulario en la pantalla
    contenido.innerHTML = `
        <div class="card">
            <h3 class="card-title">Sincronización de Base de Datos</h3>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem; font-size: 0.95rem;">Seleccione el rango de fechas para extraer películas de TMDB e inyectarlas en el servidor Strapi.</p>
            
            <div class="form-grid">
                <div class="input-group">
                    <label>Fecha Inicial</label>
                    <input type="date" id="fecha-inicio">
                </div>
                <div class="input-group">
                    <label>Fecha Final</label>
                    <input type="date" id="fecha-fin">
                </div>
            </div>
            
            <button id="btn-ejecutar-carga" class="btn-primary">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                Ejecutar Sincronización
            </button>
        </div>
        
        <div id="resultado-carga"></div>
    `;

    // Lógica asincrónica al hacer click en sincronizar
    document.getElementById('btn-ejecutar-carga').addEventListener('click', async () => {
        const inicio = document.getElementById('fecha-inicio').value;
        const fin = document.getElementById('fecha-fin').value;
        const divResultado = document.getElementById('resultado-carga');
        
        if(!inicio || !fin) {
            alert("Los parámetros de fecha son obligatorios.");
            return;
        }

        // Muestro mensaje de carga visual
        divResultado.innerHTML = `
            <div class="card" style="text-align: center; color: var(--primary);">
                <p>Estableciendo conexión con servidores TMDB y Strapi...</p>
            </div>
        `;

        try {
            // 1. Fetch a The Movie Database (TMDB)
            const tmdbUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&primary_release_date.gte=${inicio}&primary_release_date.lte=${fin}&sort_by=popularity.desc`;
            const responseTMDB = await fetch(tmdbUrl);
            const dataTMDB = await responseTMDB.json();
            
            const peliculas = dataTMDB.results;
            
            if (!peliculas || peliculas.length === 0) {
                divResultado.innerHTML = `<div class="card"><p style="color: #ef4444; text-align: center;">No se encontraron películas en ese rango de fechas.</p></div>`;
                return;
            }

            // Tomamos las top 10 para no saturar Strapi con demasiadas peticiones seguidas
            const topPeliculas = peliculas.slice(0, 10);
            let guardadasConExito = 0;

            // 2. Guardar en Strapi (Iteramos y hacemos POST)
            for (const peli of topPeliculas) {
                // Formato exigido por Strapi v4 (todo dentro del objeto "data")
                const payload = {
                    data: {
                        Titulo: peli.title,
                        Fecha_Estreno: peli.release_date,
                        Popularidad: peli.popularity
                    }
                };

                const responseStrapi = await fetch(STRAPI_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${STRAPI_TOKEN}`
                    },
                    body: JSON.stringify(payload)
                });

                if (responseStrapi.ok) {
                    guardadasConExito++;
                }
            }

            // 3. Mostrar los resultados en el Frontend
            divResultado.innerHTML = `
                <div class="card">
                    <h4 style="margin-bottom: 1rem; color: #10b981;">¡Sincronización Exitosa!</h4>
                    <p style="color: var(--text-muted); margin-bottom: 1rem;">Se han obtenido ${peliculas.length} películas de TMDB, y se han guardado las ${guardadasConExito} más populares en Strapi.</p>
                    <ul style="color: var(--text-muted); list-style: none; padding-left: 0;">
                        ${topPeliculas.map(p => `<li style="margin-bottom: 0.5rem; border-bottom: 1px solid #27272a; padding-bottom: 0.5rem;">🎬 <strong>${p.title}</strong> (Score: ${p.popularity})</li>`).join('')}
                    </ul>
                </div>
            `;

        } catch (error) {
            console.error(error);
            divResultado.innerHTML = `
                <div class="card">
                    <p style="color: #ef4444; text-align: center;">Ocurrió un error en la sincronización. Revisa la consola de desarrollador para más detalles.</p>
                </div>
            `;
        }
    });
});

// ==========================================
// PANTALLA 2: Gráficos (JEREMÍAS)
// ==========================================
btnVisualizar.addEventListener('click', async () => {
    setActiveBtn(btnVisualizar);
    
    // Dibujamos la caja del gráfico y un loading
    contenido.innerHTML = `
        <div class="card">
            <h3 class="card-title">Métricas de Popularidad</h3>
            <div id="chart-loading" style="text-align: center; color: var(--primary); padding: 2rem;">
                Consultando base de datos Strapi...
            </div>
            <div class="chart-container" style="display: none;" id="chart-wrapper">
                <canvas id="miGrafico"></canvas>
            </div>
        </div>
    `;

    try {
        // 1. Obtener datos de Strapi (GET)
        const responseStrapi = await fetch(STRAPI_URL, {
            headers: {
                'Authorization': `Bearer ${STRAPI_TOKEN}`
            }
        });
        const dataStrapi = await responseStrapi.json();
        
        // Strapi v4 devuelve los registros dentro del array .data, y sus atributos en .attributes
        const peliculas = dataStrapi.data;

        if (!peliculas || peliculas.length === 0) {
            document.getElementById('chart-loading').innerHTML = '<span style="color: #ef4444;">No hay datos en Strapi. Por favor, realiza una sincronización de fechas primero.</span>';
            return;
        }

        // 2. Extraer Nombres y Popularidad para el Gráfico
        // Tomamos las últimas 10 guardadas para que el gráfico no sea ilegible
        const ultimasPeliculas = peliculas.slice(-10);
        
        const labels = ultimasPeliculas.map(p => p.Titulo);
        const popularidades = ultimasPeliculas.map(p => p.Popularidad);

        // Ocultamos el loading y mostramos el contenedor del canvas
        document.getElementById('chart-loading').style.display = 'none';
        document.getElementById('chart-wrapper').style.display = 'block';

        // 3. Dibujar Gráfico con Chart.js
        const ctx = document.getElementById('miGrafico').getContext('2d');
        Chart.defaults.color = '#a1a1aa';
        Chart.defaults.font.family = 'Inter';
        
        // Destruimos el gráfico anterior si el usuario entra y sale de la pestaña varias veces
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Popularidad',
                    data: popularidades,
                    backgroundColor: '#3b82f6',
                    borderRadius: 4,
                    barPercentage: 0.6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { 
                    y: { 
                        beginAtZero: true,
                        grid: { color: '#27272a' },
                        border: { display: false }
                    },
                    x: {
                        grid: { display: false },
                        border: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });

    } catch (error) {
        console.error(error);
        document.getElementById('chart-loading').innerHTML = '<span style="color: #ef4444;">Error al intentar conectar con Strapi. Revisa la consola o confirma que los permisos públicos estén activos.</span>';
    }
});
