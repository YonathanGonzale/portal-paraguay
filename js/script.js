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

// Mensajes del asistente
const mensajes = {
    inicial: "Bienvenido al Portal Paraguay Accesible. Di 'hola' para comenzar.",
    bienvenida: "Por favor, dime si eres una persona daltónica o una persona ciega, para adaptar la interfaz a tus necesidades.",
    comandosGenerales: "Los comandos disponibles son: 'contenido' para escuchar la descripción actual, 'documentos', 'trámites', 'estadísticas', 'transmisiones', 'aplicaciones', 'inicio', 'repetir' para repetir la información, y 'ayuda' para escuchar nuevamente los comandos.",
    modosDaltonismo: "Puedes usar los siguientes modos de visualización: 'normal' para vista normal, 'rojo' si tienes dificultad con el rojo, 'verde' si tienes dificultad con el verde, 'azul' si tienes dificultad con el azul, o 'contraste' para alto contraste. Di 'modos' para escuchar nuevamente las opciones.",
    noReconocido: "No entendí el comando. Di 'ayuda' para escuchar los comandos disponibles."
};

// Cache de utterances para mejorar velocidad
const utteranceCache = {};

// Estado del asistente
let seccionActual = 'inicio';
let esperandoAsistente = true;
let esperandoTipoUsuario = false;
let esDaltonico = false;
let esCiego = false;

// Función para hablar optimizada
function hablar(texto) {
    if (!utteranceCache[texto]) {
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'es-ES';
        utterance.rate = 1.2; // Velocidad optimizada
        utterance.pitch = 1;
        utterance.volume = 1;
        utteranceCache[texto] = utterance;
    }
    
    speechSynthesis.cancel();
    speechSynthesis.speak(utteranceCache[texto]);
}

// Función para cambiar el modo de visualización
function cambiarModoVisualizacion(modo) {
    const imagen = document.getElementById('imagen-principal');
    imagen.classList.remove('protanopia', 'deuteranopia', 'tritanopia', 'alto-contraste');
    
    if (modo) {
        imagen.classList.add(modo);
        const descripciones = {
            'protanopia': 'Modo adaptado para protanopia (dificultad para ver el color rojo)',
            'deuteranopia': 'Modo adaptado para deuteranopia (dificultad para ver el color verde)',
            'tritanopia': 'Modo adaptado para tritanopia (dificultad para ver el color azul)',
            'alto-contraste': 'Modo de alto contraste para mejor visibilidad'
        };
        setTimeout(() => hablar(descripciones[modo]), 10000);
    }
}

// Optimizar cambio de sección
function cambiarSeccion(nuevaSeccion) {
    if (secciones[nuevaSeccion]) {
        seccionActual = nuevaSeccion;
        imagenPrincipal.src = imagenes[nuevaSeccion];
        
        const mensaje = `${secciones[nuevaSeccion].titulo}. ${secciones[nuevaSeccion].contenido}`;
        setTimeout(() => hablar(mensaje), 10000);
    }
}

// Optimizar procesamiento de comandos
function procesarComando(comando) {
    console.log('Comando recibido:', comando);

    // Esperar el comando inicial
    if (esperandoAsistente) {
        if (comando.includes('hola')) {
            esperandoAsistente = false;
            esperandoTipoUsuario = true;
            setTimeout(() => hablar(mensajes.bienvenida), 10000);
        }
        return;
    }

    // Identificar tipo de usuario
    if (esperandoTipoUsuario) {
        if (comando.includes('daltónico') || comando.includes('daltonico')) {
            esDaltonico = true;
            esperandoTipoUsuario = false;
            setTimeout(() => hablar(mensajes.modosDaltonismo), 10000);
        } else if (comando.includes('ciego')) {
            esCiego = true;
            esperandoTipoUsuario = false;
            setTimeout(() => hablar(mensajes.comandosGenerales), 10000);
        }
        return;
    }

    // Procesar comandos específicos
    switch(true) {
        case comando.includes('ayuda'):
            setTimeout(() => hablar(mensajes.comandosGenerales), 10000);
            break;

        case comando.includes('modos'):
            setTimeout(() => hablar(mensajes.modosDaltonismo), 10000);
            break;

        case comando.includes('normal'):
            cambiarModoVisualizacion(null);
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
        case comando.includes('documentos'):
        case comando.includes('trámites'):
        case comando.includes('estadísticas'):
        case comando.includes('transmisiones'):
        case comando.includes('aplicaciones'):
        case comando.includes('inicio'):
            cambiarSeccion(comando);
            break;

        case comando.includes('repetir'):
            if (seccionActual) {
                cambiarSeccion(seccionActual);
            }
            break;

        default:
            if (comando.length > 0) {
                setTimeout(() => hablar(mensajes.noReconocido), 10000);
            }
    }
}

// Inicialización temprana del reconocimiento de voz
let recognition = null;

// Función para iniciar el reconocimiento de voz
function iniciarReconocimientoVoz() {
    console.log('Iniciando reconocimiento de voz...');
    
    if (!('webkitSpeechRecognition' in window)) {
        console.error('Navegador no compatible con reconocimiento de voz');
        hablar("Tu navegador no es compatible con el reconocimiento de voz. Por favor, usa Chrome.");
        return;
    }

    try {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.lang = 'es-ES';

        let mensajeInicial = true;
        let procesandoComando = false;

        recognition.onstart = () => {
            console.log('Reconocimiento de voz iniciado correctamente');
            if (mensajeInicial) {
                hablar(mensajes.inicial);
                mensajeInicial = false;
            }
        };

        recognition.onend = () => {
            console.log('Reconocimiento de voz terminado - reiniciando...');
            if (!procesandoComando) {
                setTimeout(() => {
                    try {
                        recognition.start();
                        console.log('Reconocimiento reiniciado');
                    } catch (error) {
                        console.error('Error al reiniciar:', error);
                    }
                }, 1000);
            }
        };

        recognition.onerror = (event) => {
            console.error('Error en reconocimiento:', event.error);
            if (event.error === 'not-allowed') {
                hablar("Por favor, permite el acceso al micrófono para poder escuchar tus comandos.");
            }
            setTimeout(() => {
                try {
                    recognition.start();
                    console.log('Reconocimiento reiniciado después de error');
                } catch (error) {
                    console.error('Error al reiniciar después de error:', error);
                }
            }, 1000);
        };

        recognition.onresult = (event) => {
            const resultado = event.results[event.results.length - 1];
            if (resultado.isFinal) {
                const comando = resultado[0].transcript.toLowerCase().trim();
                console.log('Comando detectado:', comando);
                procesandoComando = true;
                
                procesarComando(comando);
                
                recognition.stop();
                procesandoComando = false;
                setTimeout(() => {
                    try {
                        recognition.start();
                        console.log('Reconocimiento reiniciado después de comando');
                    } catch (error) {
                        console.error('Error al reiniciar después de comando:', error);
                    }
                }, 1000);
            }
        };

        console.log('Iniciando primera escucha...');
        recognition.start();
    } catch (error) {
        console.error('Error al configurar el reconocimiento:', error);
    }
}

// Iniciar tan pronto como sea posible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarReconocimientoVoz);
} else {
    iniciarReconocimientoVoz();
}

// Precarga de imágenes
Object.values(imagenes).forEach(src => {
    const img = new Image();
    img.src = src;
});
