# Repositiorio-Vibe-Coding
Repositorio Dinámico de Aplicaciones Educativas
Este proyecto es una página web moderna y responsiva que muestra una colección de aplicaciones educativas. Los datos se obtienen dinámicamente desde una hoja de cálculo de Google Sheets, la cual es alimentada por un Google Form.
![alt text](URL_A_TU_IMAGEN_AQUI)
> Nota: Para añadir una captura de pantalla, sube una imagen a tu repositorio de GitHub y reemplaza URL_A_TU_IMAGEN_AQUI con el enlace a esa imagen.
🚀 Descripción del Proyecto
El objetivo de este repositorio es proporcionar una interfaz pública, atractiva y fácil de usar para visualizar las contribuciones de una comunidad. En lugar de compartir un enlace a una hoja de cálculo difícil de leer, esta página web presenta cada aplicación en una "tarjeta" individual, con búsqueda y filtros, haciendo que el contenido sea accesible y agradable de explorar.
✨ Características Principales
Carga Dinámica de Datos: La página web se conecta a una API creada con Google Apps Script, obteniendo los datos en tiempo real desde una Google Sheet. ¡No es necesario editar el código HTML para añadir nuevas aplicaciones!
Búsqueda en Tiempo Real: Incluye una barra de búsqueda que filtra las aplicaciones instantáneamente por título, autor, descripción o palabras clave.
Diseño Responsivo: La interfaz se adapta perfectamente a cualquier tamaño de pantalla, desde móviles hasta ordenadores de escritorio, gracias a Tailwind CSS.
Fácil de Mantener: Para añadir, modificar o eliminar una aplicación, solo tienes que editar la fila correspondiente en la hoja de Google Sheets. Los cambios se reflejarán automáticamente.
Código Abierto y Personalizable: Fácil de clonar y adaptar para cualquier otro proyecto que necesite mostrar datos de una hoja de cálculo.
⚙️ Arquitectura del Sistema
El proyecto utiliza una arquitectura simple pero potente que conecta herramientas gratuitas de Google con un frontend moderno:
Google Form ➡️ Google Sheet ➡️ Google Apps Script (API) ➡️ Página Web (HTML, CSS, JS)
Entrada de Datos: Los usuarios envían nuevas aplicaciones a través de un Google Form.
Almacenamiento: Las respuestas se guardan automáticamente en una hoja de Google Sheets.
Servidor de Datos (API): Un script de Google Apps Script se ejecuta sobre la hoja, la lee y expone los datos como una API JSON pública.
Presentación (Frontend): La página web (alojada en GitHub Pages) realiza una petición fetch a la API, recibe los datos JSON y los utiliza para generar dinámicamente las tarjetas de las aplicaciones.
🛠️ Guía de Instalación y Configuración
Puedes replicar este proyecto para tus propias necesidades siguiendo estos pasos:
Fase 1: Backend (Google Sheets y Apps Script)
Crea tu Google Form y configúralo para que las respuestas se guarden en una nueva Google Sheet.
Abre la Google Sheet, ve a Extensiones > Apps Script.
Pega el código del script proporcionado en la guía para crear la función doGet().
Implementa el script:
Haz clic en Implementar > Nueva implementación.
Selecciona el tipo "Aplicación web".
En "Quién tiene acceso", selecciona "Cualquier usuario".
Autoriza los permisos necesarios.
Copia la URL de la aplicación web (API). ¡La necesitarás en el siguiente paso!
Fase 2: Frontend (La Página Web)
Clona o descarga este repositorio.
Abre el archivo script.js en un editor de código.
Configura la API: Busca la siguiente línea y pega la URL que copiaste en el paso anterior:
const API_URL = 'AQUÍ_VA_LA_URL_DE_TU_API';

Personaliza los campos de datos (MUY IMPORTANTE): Dentro de la función displayApps, asegúrate de que los nombres de las propiedades (app.Titulo, app.Autor, etc.) coincidan exactamente con los nombres de las columnas (encabezados) de tu Google Sheet.

// Ejemplo: si tu columna se llama 'NombreDeLaApp' en la hoja
// Aquí deberás usar app.NombreDeLaApp
card.innerHTML = `
    <h3 class="text-xl ...">${app.Titulo || 'Sin Título'}</h3> 
    ...
`;

Fase 3: Despliegue (GitHub Pages)
Sube los archivos (index.html, style.css, script.js) a tu propio repositorio de GitHub.
En la configuración de tu repositorio, ve a la sección "Pages".
Selecciona la rama main como fuente y haz clic en "Save".
Espera unos minutos y tu repositorio estará publicado y funcionando.
💻 Pila Tecnológica (Tech Stack)
Frontend:
HTML5
CSS3
Tailwind CSS
JavaScript (con Fetch API para peticiones asíncronas)
Backend:
Google Forms
Google Sheets
Google Apps Script
📄 Licencia
Este proyecto está distribuido bajo la Licencia GPL v3. Consulta el archivo LICENSE para más detalles.

Este proyecto fue inspirado y desarrollado en el marco de la comunidad Vibe Coding Educativo.
