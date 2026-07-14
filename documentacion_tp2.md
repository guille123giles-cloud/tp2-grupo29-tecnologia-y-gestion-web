# Documentación del Proyecto - TP2 (Grupo 29)

**Asignatura:** Tecnología y Gestión Web
**Integrantes:**
- Olivan Jeremias
- Puertas Bautista
- Gilles Guillermo

---

## 1. Definición del Problema
**Tema asignado:** Obtener las películas por un rango de fechas de estreno y su popularidad.
**Objetivo:** Desarrollar una aplicación web donde el usuario pueda ingresar una fecha de inicio y una fecha de fin. El sistema debe consumir la API de The Movie Database (TMDB) para obtener las películas estrenadas en ese rango, persistir los datos en un Headless CMS (Strapi), y finalmente visualizar las películas ordenadas por popularidad mediante gráficos estadísticos.

---

## 2. Descripción de Tareas Realizadas

A continuación, se detallan las tareas obligatorias realizadas para el cumplimiento de los lineamientos del Trabajo Práctico, junto con los alumnos que participaron en cada una.

### 2.1 Investigación del sitio The Movie Database (TMDB)
- **Participantes:** Todo el grupo (Olivan, Puertas, Gilles).
- **Descripción:** Se investigó la documentación oficial en `https://developer.themoviedb.org` para comprender la arquitectura RESTful de la plataforma. Se identificaron los límites de peticiones (rate limiting) y la estructura de los JSON de respuesta.

### 2.2 Creación de cuenta y autenticación
- **Participantes:** Puertas Bautista (Gestión de API Key TMDB) y Olivan/Gilles (Configuración Strapi).
- **Descripción:** Se creó una cuenta de desarrollador en TMDB, generando exitosamente la `API Key` necesaria para autorizar las peticiones HTTP. Paralelamente, el grupo se registró en la instancia compartida de Strapi de la cátedra (`https://gestionweb.frlp.utn.edu.ar/admin/`), utilizando el token de invitación provisto y definiendo el rol de acceso.

### 2.3 Relevamiento de las APIs necesarias
- **Participantes:** Todo el grupo.
- **Descripción:** Para resolver el problema asignado, se determinó el uso de los siguientes endpoints:
  - **TMDB API:** Se utilizó el endpoint `GET /3/discover/movie`. Se enviaron los parámetros de consulta `primary_release_date.gte` (fecha inicial), `primary_release_date.lte` (fecha final) y `sort_by=popularity.desc` para obtener las películas ya filtradas y ordenadas por su nivel de popularidad.
  - **Strapi API:** Se interactuó con las APIs automáticas generadas por el Headless CMS. Se utilizó el método `POST /api/grupo29-peliculas` para almacenar los registros, y el método `GET /api/grupo29-peliculas` para recuperar la información almacenada al momento de la visualización.

### 2.4 Arquitectura y Base de Datos (Strapi)
- **Participantes:** Olivan Jeremias, Gilles Guillermo.
- **Descripción:** Dentro del "Content-Type Builder" de Strapi, se creó el tipo de colección `Grupo29_Pelicula`. Se definieron los siguientes atributos para persistir la información requerida:
  - `Titulo` (Tipo Text).
  - `Fecha_Estreno` (Tipo Date).
  - `Popularidad` (Tipo Decimal Number).
  Se ajustaron los permisos del rol "Public" habilitando los métodos `create` y `find`.

### 2.5 Bosquejo y Desarrollo del Frontend
- **Participantes:** Puertas Bautista, Olivan Jeremias.
- **Descripción:** Se diseñó el layout respetando la estructura exigida por la cátedra (Header superior, Sidebar lateral izquierdo con opciones de Carga y Visualización, Contenedor dinámico central y Footer). Se implementó un diseño moderno utilizando HTML semántico, CSS puro (con variables y flexbox) y JavaScript Vanilla para el manejo del DOM y las peticiones asincrónicas (`fetch`). Para la visualización de métricas, se integró la librería `Chart.js`, renderizando un gráfico de barras interactivo.

---

## 3. Conclusión de la Arquitectura
El trabajo se resolvió utilizando un enfoque donde el **Frontend (JS)** actúa como orquestador: es el encargado de consultar a la API externa (TMDB), procesar los datos, y luego comunicarse de manera asincrónica con el **Backend (Strapi)** para la persistencia. Esto demuestra la separación de capas y el correcto uso de un CMS Headless como repositorio puro de datos.
