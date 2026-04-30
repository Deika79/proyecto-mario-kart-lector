# 🏁 Mario Kart Lector

> Gamificación de la lectura para primaria basada en progreso visual tipo Mario Kart 🏎️📚

🌐 **Demo en producción:**
👉 https://proyecto-mario-kart-lector.vercel.app/index.html

---

## 🎯 ¿Qué es esto?

**Mario Kart Lector** es una aplicación web diseñada para **motivar la lectura en niños** mediante gamificación.

Convierte los minutos leídos en progreso dentro de un circuito, generando:

* 🏎️ Competición sana
* 📈 Seguimiento visual
* 🧠 Refuerzo del hábito lector

Está pensada para uso real en aula:

* 👨‍🏫 Profesor gestiona clase
* 👨‍👩‍👧 Padres registran lectura
* 🧒 Alumnos avanzan en ranking

---

## 🚀 Funcionalidades principales

### 👨‍🏫 Panel profesor

* Crear alumnos con coche personalizado
* Asignar usuarios padre
* Añadir/restar minutos manualmente
* Eliminar alumnos (con limpieza completa de datos)
* Resetear clase completa
* Ver ranking global en tiempo real

---

### 👨‍👩‍👧 Panel familia

* Registrar minutos diarios de lectura
* Soporte para múltiples hijos
* Ver ranking (con anonimato del resto)
* Ver historial de lectura (últimos 7 días)

---

### 🏆 Sistema de gamificación

* Ranking dinámico por minutos
* Avance en circuito (visual)
* Sistema de “vueltas” 🏅 cada X minutos
* Identidad visual con coches

---

## 🧠 Decisiones técnicas clave

* 🔐 Control de roles (profesor / padre)
* 👨‍👩‍👧 Padres pueden tener varios hijos
* 🧹 Eliminación segura de datos:

  * alumno
  * registros
  * usuario padre (solo si no tiene más hijos)
* 📊 Historial filtrado por usuario autenticado
* 🚫 Límite diario de lectura configurable

---

## 🛠️ Stack tecnológico

### Frontend

* HTML + CSS + JavaScript (vanilla)
* Arquitectura modular por archivos
* Despliegue en **Vercel**

### Backend

* Node.js + Express
* MongoDB + Mongoose
* Autenticación con tokens

---

## 📂 Estructura del proyecto

```
/frontend
  /js
    padre.js
    profesor.js
    alumnos.js
    ranking.js

/backend
  /models
    Alumno.js
    Usuario.js
    RegistroMinutos.js

  /routes
    alumnos.routes.js
    registros.routes.js
```

---

## 🔥 Características diferenciales

✔ Pensado para uso real en aula
✔ UX adaptada a padres (no técnicos)
✔ Sistema flexible para múltiples hijos
✔ Backend consistente (sin datos huérfanos)
✔ Gamificación clara y entendible

---

## 💡 Roadmap (mejoras futuras)

* 📊 Gráfica semanal de lectura
* 📅 Calendario visual
* 🏁 Circuito interactivo mejorado
* 📱 Diseño mobile más avanzado
* 🧑‍🎓 Panel alumno individual

---

## 🧪 Estado del proyecto

✅ Funcional en producción
✅ Usado en entorno real educativo
🚀 En evolución activa

---

## 🤝 David García Rodríguez

Desarrollado como proyecto fullstack enfocado a:

* educación
* gamificación
* producto real

---

## ⭐ Si te gusta el proyecto

* Dale una estrella ⭐
* Compártelo 🚀
* O úsalo en tu clase 👀

---
