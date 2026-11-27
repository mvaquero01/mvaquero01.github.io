---
titulo: "Zitalia: asistente de citas por WhatsApp con IA"
resumen: "Bot de WhatsApp para clínicas dentales y estéticas que confirma, anula, cambia y reserva citas en lenguaje natural, conectado al calendario de la clínica. Proyecto de empresa con un socio."
fecha: "2026 · en desarrollo"
portada: /img/proyectos/zitalia/portada.jpg
tecnologias: [n8n, API de Claude, WhatsApp Cloud API, Google Calendar, Docker, Hetzner]
rol: "Cofundador y desarrollo"
enlaces:
  web: "https://zitalia.es"
destacado: true
orden: 1
---

## El problema

En las clínicas pequeñas, los pacientes llaman cuando ya está cerrado o cancelan a última hora, y ese hueco en la agenda es dinero perdido. Recepción pierde mucho tiempo confirmando y moviendo citas a mano.

## Cómo lo hice

- Junto a mi socio, montamos Zitalia como agencia de automatización para clínicas.
- El bot funciona con **n8n**: recibe los mensajes de WhatsApp (API oficial de Meta), usa la **API de Claude** para entender qué quiere el paciente y responde en lenguaje natural.
- Está conectado a **Google Calendar**: ofrece horas libres, las bloquea unos minutos mientras el paciente elige y comprueba la agenda antes de confirmar.
- Lo que no sabe resolver, las urgencias o los mensajes ambiguos los pasa a recepción, y nunca da consejo médico.
- Funciona en un servidor propio (Hetzner, Docker y Caddy con HTTPS), con vigilancia externa y avisos si algo falla.

## Qué hace ya

- Confirma, anula, cambia y reserva citas por WhatsApp.
- Manda a la clínica un resumen diario por correo y avisa al momento cuando queda un hueco libre.
- Lleva una lista de espera por servicio para ocupar los huecos que se anulan.
- No contesta dos veces al mismo mensaje, se puede pausar con un interruptor, registra todo y gestiona las peticiones de los pacientes sobre sus datos (RGPD).
