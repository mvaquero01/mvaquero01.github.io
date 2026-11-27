---
titulo: "Zitalia: AI appointment assistant on WhatsApp"
resumen: "WhatsApp bot for dental and aesthetic clinics that confirms, cancels, reschedules and books appointments in natural language, connected to the clinic's calendar. A start-up project with a partner."
fecha: "2026 · in progress"
portada: /img/proyectos/zitalia/portada.jpg
tecnologias: [n8n, Claude API, WhatsApp Cloud API, Google Calendar, Docker, Hetzner]
rol: "Co-founder and development"
destacado: true
orden: 1
---

## The problem

In small clinics, patients call after closing time or cancel at the last minute, and that empty slot is lost money. Reception spends a lot of time confirming and moving appointments by hand.

## How I did it

- Together with my partner, we set up Zitalia as an automation agency for clinics.
- The bot runs on **n8n**: it receives WhatsApp messages (Meta's official API), uses the **Claude API** to understand what the patient wants and replies in natural language.
- It is connected to **Google Calendar**: it offers free slots, holds them for a few minutes while the patient chooses and checks the calendar again before confirming.
- Anything it cannot handle, urgent cases or unclear messages go to reception, and it never gives medical advice.
- It runs on our own server (Hetzner, Docker and Caddy with HTTPS), with external monitoring and alerts if anything fails.

## What it already does

- Confirms, cancels, reschedules and books appointments on WhatsApp.
- Sends the clinic a daily email summary and an instant alert when a slot becomes free.
- Keeps a waiting list per service to fill cancelled slots.
- Never replies twice to the same message, can be paused with a switch, logs everything and handles patients' data requests (GDPR).
