<template>
  <div>
    <LayoutTheNavbar :solid-from-start="true" />

    <main class="legal-content">
      <div class="legal-container">
        <UiSectionTag>Legal</UiSectionTag>
        <h1 class="legal-heading">Términos y Condiciones</h1>
        <p class="legal-updated">Última actualización: mayo de 2026</p>

        <section class="legal-section">
          <h2>1. Identificación del titular</h2>
          <p>El presente sitio web es titularidad de <strong>Hostal Sol Zamora</strong>, con domicilio en Calle Benavente, 2 – 3.ª planta, 49014 Zamora, España. Correo electrónico de contacto: <a href="mailto:hostalsol@outlook.com">hostalsol@outlook.com</a>. Teléfono: <a href="tel:+34980533152">+34 980 533 152</a>.</p>
        </section>

        <section class="legal-section">
          <h2>2. Objeto y ámbito de aplicación</h2>
          <p>Estos Términos y Condiciones regulan el acceso y uso del sitio web <strong>hostalsolzamora.com</strong>, así como la contratación de servicios de alojamiento ofrecidos a través del mismo. El acceso al sitio web implica la aceptación plena de las presentes condiciones.</p>
        </section>

        <section class="legal-section">
          <h2>3. Reservas y contratación</h2>
          <p>Las reservas realizadas a través del motor de reservas del sitio web están sujetas a disponibilidad. La confirmación de la reserva se producirá mediante el envío de un correo electrónico con el resumen de la misma. El contrato de alojamiento se perfecciona en el momento en que el huésped recibe dicha confirmación.</p>
        </section>

        <section class="legal-section">
          <h2>4. Precios y forma de pago</h2>
          <p>Los precios mostrados en la web incluyen el IVA y las tasas turísticas aplicables. El Hostal Sol Zamora se reserva el derecho de modificar sus tarifas en cualquier momento, sin que ello afecte a las reservas ya confirmadas. El pago podrá realizarse mediante tarjeta bancaria a través de la pasarela de pago segura del motor de reservas.</p>
        </section>

        <section class="legal-section">
          <h2>5. Política de cancelación</h2>
          <p>Las reservas podrán cancelarse sin cargo hasta <strong>48 horas antes</strong> de la fecha de llegada. Las cancelaciones efectuadas con menos de 48 horas de antelación o la no presentación del huésped conllevarán el cobro de la primera noche de estancia. Las reservas no reembolsables están exentas de este derecho de cancelación según lo establecido en el momento de la reserva.</p>
        </section>

        <section class="legal-section">
          <h2>6. Check-in y check-out</h2>
          <p>El horario de check-in es a partir de las <strong>14:00 h</strong>. El check-out debe realizarse antes de las <strong>12:00 h</strong>. Fuera de este horario, la recepción no está atendida de manera permanente; los huéspedes que lleguen fuera del horario de atención deberán completar el proceso de entrada en línea previamente disponible en <NuxtLink :to="localePath('checkin')">hostalsolzamora.com/checkin</NuxtLink>.</p>
        </section>

        <section class="legal-section">
          <h2>7. Normas de la casa</h2>
          <p>Los huéspedes se comprometen a respetar las normas del establecimiento, especialmente en lo relativo al descanso nocturno (silencio a partir de las 22:00 h), el mantenimiento del orden y la limpieza de las instalaciones. Queda prohibido fumar en el interior del hostal. El incumplimiento reiterado podrá dar lugar a la rescisión del contrato de alojamiento sin derecho a reembolso.</p>
        </section>

        <section class="legal-section">
          <h2>8. Responsabilidad del huésped</h2>
          <p>El huésped responde de los daños y deterioros causados en las instalaciones o en el mobiliario del hostal durante su estancia, con independencia de que hayan sido causados por él mismo o por acompañantes a su cargo. Los daños constatados serán facturados al huésped por su coste de reparación o reposición.</p>
        </section>

        <section class="legal-section">
          <h2>9. Mascotas</h2>
          <p>El Hostal Sol Zamora acepta mascotas de pequeño tamaño (hasta 10 kg) previa comunicación en el momento de la reserva y pago del suplemento correspondiente. Las mascotas no podrán permanecer solas en la habitación ni acceder a las zonas comunes sin supervisión.</p>
        </section>

        <section class="legal-section">
          <h2>10. Menores de edad</h2>
          <p>Los menores de 18 años deberán estar acompañados en todo momento por un adulto responsable. El Hostal Sol Zamora se reserva el derecho de solicitar documentación acreditativa de la relación de parentesco o tutela en caso de duda.</p>
        </section>

        <section class="legal-section">
          <h2>11. Objetos olvidados</h2>
          <p>El hostal no se responsabiliza de los objetos olvidados por los huéspedes. Los objetos hallados serán custodiados durante un plazo máximo de 30 días; transcurrido dicho plazo, podrán ser donados o eliminados conforme a la normativa vigente. Para reclamar un objeto, el huésped deberá ponerse en contacto con la recepción.</p>
        </section>

        <section class="legal-section">
          <h2>12. Protección de datos personales</h2>
          <p>El Hostal Sol Zamora trata los datos personales de sus huéspedes conforme al Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales. Para más información, consulte nuestra Política de Privacidad disponible en el sitio web.</p>
        </section>

        <section class="legal-section">
          <h2>13. Cookies</h2>
          <p>Este sitio web utiliza cookies propias y de terceros con fines técnicos y analíticos. Puede obtener más información y gestionar sus preferencias en nuestra <NuxtLink :to="localePath('politica-de-cookies-ue')">Política de Cookies</NuxtLink>.</p>
        </section>

        <section class="legal-section">
          <h2>14. Propiedad intelectual</h2>
          <p>Todos los contenidos del sitio web (textos, fotografías, logotipos, diseño gráfico, código fuente) son propiedad del Hostal Sol Zamora o de sus licenciantes y están protegidos por la legislación española e internacional sobre propiedad intelectual e industrial. Queda prohibida su reproducción total o parcial sin autorización expresa.</p>
        </section>

        <section class="legal-section">
          <h2>15. Uso del sitio web</h2>
          <p>El usuario se compromete a hacer un uso lícito del sitio web y a no realizar acciones que puedan dañar, inutilizar o deteriorar el mismo, ni interferir en su normal funcionamiento. Queda prohibido el uso de técnicas automatizadas de extracción de datos (scraping) sin autorización previa.</p>
        </section>

        <section class="legal-section">
          <h2>16. Enlaces a terceros</h2>
          <p>El sitio web puede contener enlaces a páginas de terceros (plataformas de reserva, mapas, redes sociales). El Hostal Sol Zamora no controla ni es responsable de los contenidos, políticas de privacidad ni prácticas de dichos sitios externos.</p>
        </section>

        <section class="legal-section">
          <h2>17. Limitación de responsabilidad</h2>
          <p>El Hostal Sol Zamora no garantiza la disponibilidad ininterrumpida del sitio web ni la ausencia de errores en sus contenidos. En ningún caso será responsable de los daños indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de uso del sitio web o de los servicios contratados, salvo en los casos en que la ley así lo exija.</p>
        </section>

        <section class="legal-section">
          <h2>18. Fuerza mayor</h2>
          <p>El Hostal Sol Zamora quedará exonerado de responsabilidad en caso de incumplimiento total o parcial de sus obligaciones cuando dicho incumplimiento se deba a causas ajenas a su voluntad y control, tales como catástrofes naturales, huelgas, decisiones gubernamentales, pandemias u otras circunstancias de fuerza mayor.</p>
        </section>

        <section class="legal-section">
          <h2>19. Modificación de las condiciones</h2>
          <p>El Hostal Sol Zamora se reserva el derecho de modificar los presentes Términos y Condiciones en cualquier momento. Las modificaciones serán efectivas desde el momento de su publicación en el sitio web. Se recomienda al usuario revisar periódicamente estas condiciones.</p>
        </section>

        <section class="legal-section">
          <h2>20. Legislación aplicable y jurisdicción</h2>
          <p>Los presentes Términos y Condiciones se rigen por la legislación española. Para la resolución de cualquier controversia derivada de la interpretación o aplicación de estas condiciones, las partes se someten a los juzgados y tribunales de la ciudad de Zamora, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.</p>
        </section>

        <div class="legal-contact">
          <p>¿Tienes dudas? Contáctanos en <a href="mailto:hostalsol@outlook.com">hostalsol@outlook.com</a> o llámanos al <a href="tel:+34980533152">+34 980 533 152</a>.</p>
        </div>
      </div>
    </main>

    <LayoutTheFooter />
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
useHead({
  title: 'Términos y Condiciones — Hostal Sol Zamora',
  meta: [{ name: 'description', content: 'Términos y Condiciones de uso del sitio web y de los servicios de alojamiento del Hostal Sol Zamora, Zamora.' }],
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

.legal-section p {
  color: var(--dark-muted);
  font-size: 15px;
  line-height: 1.8;
  margin: 0;
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
