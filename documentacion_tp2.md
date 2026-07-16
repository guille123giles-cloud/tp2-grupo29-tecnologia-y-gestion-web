# Documentación del Proyecto - TP2 (Grupo 29)

**Asignatura:** Tecnología y Gestión Web
**Integrantes:**
- Puertas Bautista
- Gilles Guillermo
- Olivan Jeremias

---

## 1. Definición del Problema
**Tema asignado:** Obtener las películas por un rango de fechas de estreno y su popularidad.
**Objetivo:** Desarrollar una aplicación web donde el usuario pueda ingresar una fecha de inicio y una fecha de fin. El sistema debe consumir la API de The Movie Database (TMDB) para obtener las películas estrenadas en ese rango, persistir los datos en un Headless CMS (Strapi), y finalmente visualizar las películas ordenadas por popularidad mediante gráficos estadísticos.

---

## 2. Descripción de Tareas Realizadas

A continuación, se detalla la división de tareas equitativa realizada para el cumplimiento de los lineamientos del Trabajo Práctico:

### 2.1 Diseño y Desarrollo del Frontend (Puertas Bautista)
- **Bosquejo inicial y Layout:** Diseño de la interfaz de usuario basándose en los requerimientos de la cátedra, implementando la estructura de Sidebar y contenedor principal.
- **Estilización (CSS):** Aplicación de estilos modernos, paleta de colores y responsividad para asegurar una correcta experiencia visual.
- **Gestión TMDB:** Investigación inicial de la API The Movie Database, creación de la cuenta de desarrollador y obtención de la API Key.

### 2.2 Desarrollo del Backend y Persistencia (Gilles Guillermo)
- **Arquitectura Strapi:** Diseño del Content-Type `Grupo29_Pelicula` en el CMS Headless de la facultad, definiendo los atributos exigidos (Titulo, Fecha_Estreno, Popularidad).
- **Lógica de Sincronización:** Desarrollo del código JavaScript (Fetch API) encargado de consultar TMDB mediante el rango de fechas dinámico ingresado por el usuario.
- **Persistencia Segura (POST):** Implementación del envío de datos a Strapi, integrando y enviando el Token de API en los headers de autorización (Bearer) para habilitar la escritura.

### 2.3 Visualización de Datos y Análisis (Olivan Jeremias)
- **Consumo de Datos Strapi (GET):** Desarrollo de la petición HTTP GET hacia Strapi utilizando el Token de seguridad para recuperar los registros almacenados.
- **Métricas y Reglas de Negocio:** Algoritmo de filtrado en JavaScript para omitir películas duplicadas, seguido del ordenamiento matemático descendente para calcular el "Top 10" exacto de popularidad.
- **Integración Chart.js:** Implementación y configuración del motor gráfico para renderizar los resultados en un formato de barras interactivo. 
- **Testing y Documentación:** Pruebas End-to-End del ciclo completo y redacción técnica de la presente documentación.

---

## 3. Conclusión de la Arquitectura
El trabajo se resolvió utilizando un enfoque donde el **Frontend (JS)** actúa como orquestador: es el encargado de consultar a la API externa (TMDB), procesar los datos, y luego comunicarse de manera asincrónica con el **Backend (Strapi)** para la persistencia. Esto demuestra la separación de capas y el correcto uso de un CMS Headless como repositorio puro de datos.
