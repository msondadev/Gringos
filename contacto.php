<?php

// --- 1. Definición de Destino ---
// CAMBIA "tu_correo@ejemplo.com" por tu dirección de correo real
$destinatario = "emcionna1980@gmail.com"; 
$asunto = "Nuevo Mensaje de Contacto - Gringo's Online";
$pagina_contacto = "pages/contacto.html"; // Ruta para redireccionar

// --- 2. Capturar y Limpiar los Datos del Formulario de CONTACTO ---
if (isset($_POST['nombre']) && isset($_POST['email']) && isset($_POST['mensaje'])) {
    
    // Filtramos los datos
    $nombre = htmlspecialchars($_POST['nombre']); 
    $apellido = htmlspecialchars($_POST['apellido']); 
    $email_remitente = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $mensaje = htmlspecialchars($_POST['mensaje']);

    
    // --- 3. Construcción del Cuerpo del Correo ---
    $cuerpo_correo = "¡Has recibido un nuevo mensaje de contacto!\n\n";
    $cuerpo_correo .= "Nombre: " . $nombre . " " . $apellido . "\n";
    $cuerpo_correo .= "Email: " . $email_remitente . "\n";
    $cuerpo_correo .= "Mensaje:\n" . $mensaje . "\n";

    
    // --- 4. Configuración de Cabeceras ---
    $cabeceras = 'From: ' . $email_remitente . "\r\n" .
                 'Reply-To: ' . $email_remitente . "\r\n" .
                 'X-Mailer: PHP/' . phpversion();

    
    // --- 5. Envío del Correo ---
    if ($email_remitente && mail($destinatario, $asunto, $cuerpo_correo, $cabeceras)) {
        // Éxito: Redirige de vuelta a la página de contacto 
        header("Location: " . $pagina_contacto . "?status=success");
        exit;
    } else {
        // Fallo: Redirige indicando un error 
        header("Location: " . $pagina_contacto . "?status=error");
        exit;
    }

} else {
    // Si no se enviaron datos, redirige a la página de contacto con un mensaje de error
    header("Location: " . $pagina_contacto . "?status=incomplete");
    exit;
}
?>