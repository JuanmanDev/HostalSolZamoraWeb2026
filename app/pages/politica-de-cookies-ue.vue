<template>
  <div>
    <LayoutTheNavbar :solid-from-start="true" />

    <main class="legal-content">
      <div class="legal-container">
        <UiSectionTag>Legal</UiSectionTag>
        <h1 class="legal-heading">Política de Cookies</h1>
        <p class="legal-updated">Última actualización: mayo de 2026</p>

        <section class="legal-section">
          <h2>1. ¿Qué son las cookies?</h2>
          <p>Las cookies son pequeños archivos de texto que se almacenan en el dispositivo del usuario cuando visita un sitio web. Permiten al sitio recordar información sobre la visita, lo que facilita la navegación y mejora la experiencia del usuario. Las cookies no contienen información personal identificable por sí mismas.</p>
        </section>

        <section class="legal-section">
          <h2>2. ¿Para qué utilizamos cookies?</h2>
          <p>El sitio web <strong>hostalsol.es</strong> utiliza cookies con los siguientes fines:</p>
          <ul>
            <li><strong>Funcionamiento técnico:</strong> cookies estrictamente necesarias para que el sitio web funcione correctamente.</li>
            <li><strong>Preferencias del usuario:</strong> recordar el idioma seleccionado y otras configuraciones personalizadas.</li>
            <li><strong>Análisis y estadísticas:</strong> comprender cómo los usuarios interactúan con el sitio para mejorar su funcionamiento.</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>3. Tipos de cookies utilizadas</h2>
          <p><strong>Cookies propias:</strong> generadas por el propio sitio web para gestionar la sesión, el idioma y las preferencias del usuario.</p>
          <p style="margin-top:10px"><strong>Cookies de terceros:</strong> generadas por servicios externos integrados en el sitio, como Google Maps (visualización de mapas), YouTube (reproducción de vídeos) y el motor de reservas directo. Estos servicios pueden establecer sus propias cookies sujetas a sus respectivas políticas de privacidad.</p>
        </section>

        <section class="legal-section">
          <h2>4. Cookies estrictamente necesarias</h2>
          <p>Estas cookies son imprescindibles para que el sitio web funcione y no pueden desactivarse. Se activan en respuesta a acciones realizadas por el usuario, como establecer preferencias de privacidad, iniciar sesión o completar formularios. El usuario puede configurar su navegador para bloquearlas, pero esto puede afectar al funcionamiento del sitio.</p>
        </section>

        <section class="legal-section">
          <h2>5. Cookies de preferencias</h2>
          <p>Permiten al sitio web recordar las elecciones del usuario (como el idioma preferido) para ofrecer una experiencia más personalizada. Sin estas cookies, algunas funciones pueden no estar disponibles o el usuario podría tener que configurar sus preferencias en cada visita.</p>
        </section>

        <section class="legal-section">
          <h2>6. Cookies analíticas</h2>
          <p>Estas cookies recopilan información de forma anónima y agregada sobre cómo los usuarios utilizan el sitio web: páginas visitadas, tiempo de permanencia, errores encontrados, etc. Esta información se utiliza para mejorar el sitio web. El sitio puede utilizar herramientas de análisis que anonomizan las direcciones IP antes de su procesamiento.</p>
        </section>

        <section class="legal-section">
          <h2>7. Cookies de Google Maps y YouTube</h2>
          <p>Al cargar mapas embebidos de Google Maps o vídeos de YouTube, estos servicios de Google LLC pueden instalar cookies en el dispositivo del usuario. Estas cookies se rigen por la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Política de Privacidad de Google</a>. El usuario puede controlar estas cookies desde los ajustes de su cuenta de Google o desactivando el almacenamiento local en su navegador.</p>
        </section>

        <section class="legal-section">
          <h2>8. Motor de reservas externo</h2>
          <p>El motor de reservas integrado en el sitio web es proporcionado por <strong>Direct Booking</strong>. Al interactuar con este motor, dicho servicio puede instalar cookies necesarias para completar el proceso de reserva y garantizar la seguridad del pago. Estas cookies se rigen por la política de privacidad del proveedor.</p>
        </section>

        <section class="legal-section">
          <h2>9. Cómo gestionar las cookies</h2>
          <p>El usuario puede gestionar, bloquear o eliminar las cookies desde la configuración de su navegador web. A continuación se indican los enlaces a las instrucciones de los navegadores más comunes:</p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
            <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
          </ul>
          <p style="margin-top:10px">Tenga en cuenta que desactivar determinadas cookies puede afectar al correcto funcionamiento del sitio web o limitar el acceso a algunas funcionalidades.</p>
        </section>

        <section class="legal-section">
          <h2>10. Actualización de la política de cookies</h2>
          <p>El Hostal Sol Zamora podrá actualizar la presente Política de Cookies en cualquier momento para adaptarla a cambios legislativos, técnicos o de los servicios ofrecidos. Se recomienda al usuario revisar esta página periódicamente. Los cambios relevantes serán notificados mediante un aviso visible en el sitio web. Para cualquier consulta, puede contactar con nosotros en <a href="mailto:hostalsol@outlook.com">hostalsol@outlook.com</a>.</p>
        </section>

        <div class="legal-contact">
          <p>¿Tienes dudas sobre el uso de cookies en nuestro sitio? Contáctanos en <a href="mailto:hostalsol@outlook.com">hostalsol@outlook.com</a>.</p>
        </div>
      </div>
    </main>

    <LayoutTheFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Política de Cookies — Hostal Sol Zamora',
  meta: [{ name: 'description', content: 'Política de cookies del sitio web del Hostal Sol Zamora. Conoce qué cookies utilizamos y cómo gestionarlas.' }],
})
</script>

<style scoped>
.legal-content {
  background: #fff;
  min-height: 100vh;
}

.legal-container {
  max-width: 820px;
  margin: 0 auto;
  padding: 100px max(24px, 5vw) 80px;
}

.legal-heading {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 500;
  color: var(--dark);
  margin: 0 0 8px;
  line-height: 1.1;
}

.legal-updated {
  color: var(--dark-muted);
  font-size: 13.5px;
  margin-bottom: 48px;
}

.legal-section {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
}

.legal-section:last-of-type {
  border-bottom: none;
}

.legal-section h2 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--dark);
  margin: 0 0 10px;
}

.legal-section p,
.legal-section li {
  color: var(--dark-muted);
  font-size: 15px;
  line-height: 1.8;
}

.legal-section p { margin: 0; }

.legal-section ul {
  padding-left: 20px;
  margin: 10px 0 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.legal-section a {
  color: var(--green);
  font-weight: 600;
}

.legal-contact {
  margin-top: 40px;
  background: var(--green-light);
  border-radius: 12px;
  padding: 20px 24px;
  font-size: 15px;
  color: var(--dark);
}

.legal-contact a {
  color: var(--green);
  font-weight: 600;
}
</style>
