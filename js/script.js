// Configuración inicial
const imagenPrincipal = document.getElementById('imagen-principal');

// Configuración de imágenes y secciones
const imagenes = {
    inicio: './img/imagen-ejemplo.jpeg',
    documentos: './img/imagen-ejemplo.jpeg',
    tramites: './img/Tramites en linea.jpeg',
    estadisticas: './img/Estadisticas.jpeg',
    transmisiones: './img/Mas Tramites en linea.jpeg',
    aplicaciones: './img/Aplicaciones con ID-e.jpeg'
};

// Secciones del portal
const secciones = {
    inicio: {
        titulo: "Página Principal",
        contenido: "Bienvenido al Portal Paraguay. Aquí encontrarás acceso a diversos servicios gubernamentales como documentos en línea, trámites, estadísticas y más a tu alcance"
    },
    documentos: {
        titulo: "Documentos en Línea",
        contenido: "En la sección de documentos puedes encontrar: Cédula de Identidad, Certificado de Nacimiento, Antecedentes Penales y Certificado de Vida y Residencia."
    },
    tramites: {
        titulo: "Trámites en Línea",
        contenido: "En esta sección se muestran las estadísticas de los trámites en línea por institución. Las instituciones con más trámites son: Agencia Nacional de Tránsito y Seguridad Vial con 11 trámites, Banco Central del Paraguay con 9 trámites, y otros servicios importantes."
    },
    estadisticas: {
        titulo: "Estadísticas",
        contenido: "Las estadísticas muestran el total de trámites realizados, tiempo promedio de espera, satisfacción de usuarios y los documentos más solicitados."
    },
    transmisiones: {
        titulo: "Más Trámites",
        contenido: "Accede a servicios adicionales como: Consultas en línea, Pagos electrónicos, Seguimiento de trámites y Soporte virtual."
    },
    aplicaciones: {
        titulo: "Aplicaciones con ID-e",
        contenido: "Accede a las aplicaciones disponibles con tu Identificación Digital. Aquí encontrarás servicios y trámites que requieren autenticación segura."
    }
};

// Mensajes del sistema
const mensajes = {
    inicial: "Bienvenido al Portal Paraguay Accesible. Di 'hola' para comenzar.",
    bienvenida: "Por favor, dime si eres una persona daltónica o una persona ciega, para adaptar la interfaz a tus necesidades.",
    comandosGenerales: "Los comandos disponibles son: 'contenido' para escuchar la descripción actual, 'documentos', 'trámites', 'estadísticas', 'transmisiones', 'aplicaciones', 'inicio', 'repetir' para repetir la información, y 'ayuda' para escuchar nuevamente los comandos.",
    modosDaltonismo: "Puedes usar los siguientes modos de visualización: 'normal' para vista normal, 'rojo' si tienes dificultad con el rojo, 'verde' si tienes dificultad con el verde, 'azul' si tienes dificultad con el azul, o 'contraste' para alto contraste. Di 'modos' para escuchar nuevamente las opciones."
};

// Estado del asistente
let seccionActual = 'inicio';
let esperandoAsistente = true;
let esperandoTipoUsuario = false;

// Función para hablar
function hablar(texto) {
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-ES';
    utterance.rate = 1.1; 
    utterance.pitch = 1;
    utterance.volume = 1;
    speechSynthesis.cancel(); 
    speechSynthesis.speak(utterance);
}

// Función para cambiar el modo de visualización
function cambiarModoVisualizacion(modo) {
    const imagen = document.getElementById('imagen-principal');
    imagen.classList.remove('protanopia', 'deuteranopia', 'tritanopia', 'alto-contraste');
    
    if (modo) {
        imagen.classList.add(modo);
        let descripcion = '';
        switch (modo) {
            case 'protanopia':
                descripcion = 'Modo adaptado para protanopia (dificultad para ver el color rojo)';
                break;
            case 'deuteranopia':
                descripcion = 'Modo adaptado para deuteranopia (dificultad para ver el color verde)';
                break;
            case 'tritanopia':
                descripcion = 'Modo adaptado para tritanopia (dificultad para ver el color azul)';
                break;
            case 'alto-contraste':
                descripcion = 'Modo de alto contraste para mejor visibilidad';
                break;
        }
        hablar(descripcion);
    }
}

// Función para cambiar de sección
function cambiarSeccion(nuevaSeccion) {
    if (secciones[nuevaSeccion]) {
        seccionActual = nuevaSeccion;
        if (imagenes[nuevaSeccion]) {
            imagenPrincipal.src = imagenes[nuevaSeccion];
            imagenPrincipal.alt = secciones[nuevaSeccion].titulo;
        }
        const seccion = secciones[nuevaSeccion];
        hablar(`${seccion.titulo}. ${seccion.contenido}`);
    }
}

// Función para procesar comandos
function procesarComando(comando) {
    console.log('Comando recibido:', comando);

    // Esperar el comando "asistente"
    if (esperandoAsistente) {
        if (comando.includes('hola')) {
            esperandoAsistente = false;
            esperandoTipoUsuario = true;
            hablar(mensajes.bienvenida);
        }
        return;
    }

    // Si estamos esperando saber si el usuario es daltónico o ciego
    if (esperandoTipoUsuario) {
        if (comando.includes('daltónico') || comando.includes('daltonico')) {
            esperandoTipoUsuario = false;
            hablar(mensajes.modosDaltonismo);
        } else if (comando.includes('ciego')) {
            esperandoTipoUsuario = false;
            hablar(mensajes.comandosGenerales);
        }
        return;
    }

    // Procesar otros comandos solo si ya pasamos la identificación inicial
    if (!esperandoAsistente && !esperandoTipoUsuario) {
        switch (true) {
            case comando.includes('ayuda'):
                hablar(mensajes.comandosGenerales);
                break;

            case comando.includes('modos'):
                hablar(mensajes.modosDaltonismo);
                break;

            case comando.includes('normal'):
                cambiarModoVisualizacion(null);
                hablar("Modo de visualización normal activado");
                break;

            case comando.includes('rojo'):
                cambiarModoVisualizacion('protanopia');
                break;

            case comando.includes('verde'):
                cambiarModoVisualizacion('deuteranopia');
                break;

            case comando.includes('azul'):
                cambiarModoVisualizacion('tritanopia');
                break;

            case comando.includes('contraste'):
                cambiarModoVisualizacion('alto-contraste');
                break;

            case comando.includes('contenido'):
                hablar(secciones[seccionActual].contenido);
                break;

            case comando.includes('documentos'):
                cambiarSeccion('documentos');
                break;

            case comando.includes('trámites'):
                cambiarSeccion('tramites');
                break;

            case comando.includes('estadísticas'):
                cambiarSeccion('estadisticas');
                break;

            case comando.includes('transmisiones'):
                cambiarSeccion('transmisiones');
                break;

            case comando.includes('aplicaciones'):
                cambiarSeccion('aplicaciones');
                break;

            case comando.includes('inicio'):
                cambiarSeccion('inicio');
                break;

            case comando.includes('repetir'):
                hablar(secciones[seccionActual].contenido);
                break;

            default:
                if (esperandoTipoUsuario) {
                    hablar("Por favor, dime si eres una persona daltónica o una persona ciega para adaptar la interfaz.");
                } else {
                    hablar("No he entendido el comando. Di 'ayuda' para escuchar los comandos disponibles, o 'modos' para escuchar los modos de visualización.");
                }
        }
    }
}

// Configurar reconocimiento de voz
function iniciarReconocimientoVoz() {
    if (!('webkitSpeechRecognition' in window)) {
        hablar("Tu navegador no es compatible con el reconocimiento de voz. Por favor, usa Chrome.");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true; 
    recognition.maxAlternatives = 1; 
    recognition.lang = 'es-ES';

    let mensajeInicial = true;
    let ultimoComando = '';
    let ultimoTiempo = Date.now();

    recognition.onstart = () => {
        console.log('Reconocimiento de voz iniciado');
        if (mensajeInicial) {
            hablar(mensajes.inicial);
            mensajeInicial = false;
        }
    };

    recognition.onend = () => {
        recognition.start();
    };

    recognition.onerror = (event) => {
        if (event.error === 'not-allowed') {
            hablar("Por favor, permite el acceso al micrófono para poder escuchar tus comandos.");
        }
        setTimeout(() => recognition.start(), 50); 
    };

    recognition.onresult = (event) => {
        const resultado = event.results[event.results.length - 1];
        if (resultado.isFinal) {
            const comando = resultado[0].transcript.toLowerCase().trim();
            
            // Evitar procesamiento duplicado de comandos
            const tiempoActual = Date.now();
            if (comando !== ultimoComando || tiempoActual - ultimoTiempo > 1000) {
                ultimoComando = comando;
                ultimoTiempo = tiempoActual;
                procesarComando(comando);
            }
        }
    };

    // Función para reiniciar el reconocimiento
    function reiniciarReconocimiento() {
        try {
            recognition.stop();
            setTimeout(() => recognition.start(), 50);
        } catch (error) {
            console.error('Error al reiniciar el reconocimiento:', error);
            setTimeout(reiniciarReconocimiento, 50);
        }
    }

    // Manejar pérdida de conexión
    window.addEventListener('offline', () => {
        reiniciarReconocimiento();
    });

    // Manejar recuperación de conexión
    window.addEventListener('online', () => {
        reiniciarReconocimiento();
    });

    try {
        recognition.start();
    } catch (error) {
        console.error('Error al iniciar el reconocimiento:', error);
        setTimeout(() => recognition.start(), 50);
    }
}

// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', iniciarReconocimientoVoz);
