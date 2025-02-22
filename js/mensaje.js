// Verificar si el navegador admite la API de voz
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'es-ES';

    // Iniciar la escucha automática
    recognition.start();

    recognition.onresult = function(event) {
        const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        console.log("Escuchado: ", transcript);

        // Si el usuario dice "dime contenido", reproduce el audio
        if (transcript.includes("informacion")) {
            const audio = document.getElementById("audioMensaje");
            audio.play();
        }
    };

    recognition.onerror = function(event) {
        console.error("Error de reconocimiento: ", event.error);
    };
} else {
    console.warn("Tu navegador no admite la API de reconocimiento de voz.");
}
