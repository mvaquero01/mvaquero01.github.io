---
titulo: "Booking website for a barbershop"
resumen: "Website and management panel for a friend's barbershop: customers book online and he runs his calendar, customers, takings and stats from his phone. Live with real customers."
fecha: "2026"
portada: /img/proyectos/web-reservas-barberia/portada.jpg
tecnologias: [React, Vite, Firebase, Vercel, n8n]
rol: "Full development"
enlaces:
  web: "https://marc-ros.vercel.app"
orden: 2
---

## The problem

A friend opened his barbershop and handled bookings by phone and WhatsApp. He needed customers to book by themselves and a tidy calendar, without paying for a subscription app.

## How I did it

- **React** website with **Vite**, deployed on **Vercel**, designed mainly for mobile.
- Three-step booking: service, date and time, and confirmation. It only offers slots that are really free, based on working hours and blocked times.
- Data in **Firebase**, updated instantly on every device.
- Private panel for the barber with appointments, availability and blocked times, customer records (with search and a flag for those who haven't come in for weeks), takings, statistics and settings.
- Email alert for every new booking, through a small Vercel API and an **n8n** workflow.
- Promotions with start and end dates that appear and disappear on their own.

## Result

The website is live and the barbershop uses it every day to receive and manage its bookings.
