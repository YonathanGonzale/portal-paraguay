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
    inicial: "Hola, di hola para comenzar",
    bienvenida: "Bienvenido al portal. Puedes decir: contenido, documentos, trámites, estadísticas, transmisiones, aplicaciones, inicio o repetir",
    noReconocido: "No entendí el comando. Por favor, intenta de nuevo."
};

// Cache de utterances para mejorar velocidad
const utteranceCache = {};

// Función para hablar optimizada
function hablar(texto) {
    if (!utteranceCache[texto]) {
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'es-ES';
        utterance.rate = 1.2; 
        utterance.pitch = 1;
        utterance.volume = 1;
        utteranceCache[texto] = utterance;
    }
    
    speechSynthesis.cancel(); 
    speechSynthesis.speak(utteranceCache[texto]);
}

// Estado del asistente
let seccionActual = 'inicio';
let esperandoAsistente = true;
let esperandoTipoUsuario = false;

// Configurar reconocimiento de voz
function iniciarReconocimientoVoz() {
    if (!('webkitSpeechRecognition' in window)) {
        hablar("Tu navegador no es compatible con el reconocimiento de voz. Por favor, usa Chrome.");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false; 
    recognition.interimResults = true; 
    recognition.maxAlternatives = 1; 
    recognition.lang = 'es-ES';

    let mensajeInicial = true;
    let procesandoComando = false;

    recognition.onstart = () => {
        if (mensajeInicial) {
            setTimeout(() => hablar(mensajes.inicial), 100);
            mensajeInicial = false;
        }
    };

    recognition.onend = () => {
        if (!procesandoComando) {
            setTimeout(() => recognition.start(), 10);
        }
    };

    recognition.onerror = (event) => {
        if (event.error === 'not-allowed') {
            hablar("Por favor, permite el acceso al micrófono para poder escuchar tus comandos.");
        }
        setTimeout(() => recognition.start(), 10);
    };

    recognition.onresult = (event) => {
        const resultado = event.results[event.results.length - 1];
        if (resultado.isFinal) {
            const comando = resultado[0].transcript.toLowerCase().trim();
            procesandoComando = true;
            
            // Procesar comando inmediatamente
            procesarComando(comando);
            
            // Reiniciar reconocimiento después de procesar
            recognition.stop();
            procesandoComando = false;
            setTimeout(() => recognition.start(), 10);
        }
    };

    try {
        recognition.start();
    } catch (error) {
        console.error('Error al iniciar el reconocimiento:', error);
        setTimeout(() => recognition.start(), 10);
    }
}

// Optimizar cambio de sección
function cambiarSeccion(nuevaSeccion) {
    if (secciones[nuevaSeccion]) {
        seccionActual = nuevaSeccion;
        imagenPrincipal.src = imagenes[nuevaSeccion];
        
        // Preparar el mensaje antes de hablarlo
        const mensaje = `${secciones[nuevaSeccion].titulo}. ${secciones[nuevaSeccion].contenido}`;
        setTimeout(() => hablar(mensaje), 10);
    }
}

// Optimizar procesamiento de comandos
function procesarComando(comando) {
    console.log('Comando recibido:', comando);
    
    if (comando.includes('hola')) {
        hablar(mensajes.bienvenida);
        return;
    }

    // Procesamiento inmediato de comandos
    switch(true) {
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
                hablar(mensajes.noReconocido);
            }
    }
}

// Iniciar inmediatamente cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Precarga de imágenes para mejorar rendimiento
    Object.values(imagenes).forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    iniciarReconocimientoVoz();
});
