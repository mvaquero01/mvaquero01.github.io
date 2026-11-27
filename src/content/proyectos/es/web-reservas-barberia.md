---
titulo: "Web de reservas para una barbería"
resumen: "Web y panel de gestión para la barbería de un amigo: los clientes reservan cita online y él lleva agenda, clientes, caja y estadísticas desde el móvil. Funcionando con clientes reales."
fecha: "2026"
portada: /img/proyectos/web-reservas-barberia/portada.jpg
tecnologias: [React, Vite, Firebase, Vercel, n8n]
rol: "Desarrollo completo"
enlaces:
  web: "https://marc-ros.vercel.app"
orden: 2
---

## El problema

Un amigo abrió su barbería y gestionaba las citas por teléfono y WhatsApp. Necesitaba que los clientes pudieran reservar solos y tener su agenda ordenada sin pagar una aplicación de suscripción.

## Cómo lo hice

- Web en **React** con **Vite**, publicada en **Vercel**, pensada sobre todo para el móvil.
- Reserva en tres pasos: servicio, día y hora, y confirmación. Solo ofrece las horas que de verdad están libres según el horario y los bloqueos.
- Datos en **Firebase**, que se actualizan al momento en todos los dispositivos.
- Panel privado para el barbero con citas, disponibilidad y bloqueos, ficha de clientes (con búsqueda y aviso de quien lleva semanas sin venir), caja, estadísticas y configuración.
- Aviso por correo de cada cita nueva, con una pequeña API en Vercel y un flujo de **n8n**.
- Promociones con fecha de inicio y fin que aparecen y desaparecen solas.

## Resultado

La web está en marcha y la barbería la usa a diario para recibir y gestionar sus citas.
