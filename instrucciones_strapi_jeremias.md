# Asignación de Tarea: Configuración de Permisos en Strapi (Backend)

**Para:** Jeremías Olivan
**De:** Guillermo Gilles / Equipo Frontend
**Prioridad:** Alta (Bloqueante para la entrega final)
**Fecha:** 14 de Julio de 2026

---

## 1. Contexto y Estado Actual
Se ha finalizado con éxito la implementación de la capa Frontend del proyecto (Trabajo Práctico 2).
*   **Interfaz de Usuario:** El diseño UX/UI y el dashboard están 100% operativos.
*   **Consumo TMDB:** La lógica JavaScript para conectarse a The Movie Database (TMDB) funciona correctamente, recuperando los arreglos de películas según el rango de fechas ingresado.
*   **Gráficos:** El motor de `Chart.js` está preparado para renderizar dinámicamente.

## 2. Descripción del Problema (Incidencia)
Actualmente, el sistema está experimentando un fallo de autorización al intentar persistir los datos en el Headless CMS.

Al ejecutar la función `fetch` con el método `POST` apuntando al endpoint de la cátedra (`https://gestionweb.frlp.utn.edu.ar/api/grupo29-peliculas`), el servidor responde con el siguiente código de estado:

> **HTTP 403 Forbidden**
> `{"data":null,"error":{"status":403,"name":"ForbiddenError","message":"Forbidden","details":{}}}`

**Diagnóstico:** El rol *Public* de nuestra instancia de Strapi no tiene los permisos habilitados para interactuar con la colección mediante la API REST. El servidor deniega la conexión por medidas de seguridad predeterminadas de Strapi v4.

---

## 3. Resolución Solicitada (Action Items)

Para solucionar este incidente y habilitar el flujo de datos completo, requerimos que ingreses al panel de administración de Strapi y apliques la siguiente configuración de permisos:

### Paso a paso:
1. Inicia sesión en el panel de Strapi de la UTN FRLP: `https://gestionweb.frlp.utn.edu.ar/admin/`
2. Dirígete a la barra lateral izquierda y haz clic en **Settings** (Configuraciones, ícono de engranaje).
3. En la sección **Users & Permissions Plugin**, selecciona la opción **Roles**.
4. Haz clic en el rol denominado **Public** (Este es el rol que utiliza nuestra aplicación web al hacer fetch sin un token de autenticación).
5. En el panel principal, desplázate hasta encontrar la sección **Permissions** (Permisos).
6. Localiza el Content-Type que creaste (debería llamarse `Grupo29_Pelicula` o similar).
7. Despliega sus opciones y **marca obligatoriamente las siguientes dos casillas**:
   *   [x] **`create`**: Permite que nuestra aplicación haga un `POST` para guardar las películas obtenidas de TMDB.
   *   [x] **`find`**: Permite que nuestra aplicación haga un `GET` para recuperar las películas guardadas y alimentar el gráfico de Chart.js.
8. Dirígete a la esquina superior derecha y haz clic en el botón verde **Save** (Guardar).

---

## 4. Validación

Una vez confirmes que estos cambios han sido aplicados y guardados, el equipo de Frontend realizará una prueba End-to-End desde la interfaz (`index.html`) para corroborar que el ciclo de vida de los datos (TMDB -> Frontend -> Strapi -> Gráfico) funcione sin errores.

¡Por favor notifica al grupo una vez completado este paso para proceder con las pruebas finales de la entrega!
