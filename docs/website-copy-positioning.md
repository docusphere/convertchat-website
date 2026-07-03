# ConvertChat — Website Copy & Positioning Guide

## Core Positioning

**One-liner:** Convert your leads into WhatsApp sales — without ads.

**The wedge:** You have contacts (email lists, CRMs, trade show cards). They're not on WhatsApp. We bridge that gap — then give you an AI-powered WhatsApp sales channel that works 24/7.

**Who it's for:** B2B businesses sitting on contact lists they can't monetize through WhatsApp. Wholesale distributors, real estate agencies, clinics, auto parts suppliers.

**What makes us different:**

1. **The bridge** — email → WhatsApp conversion flow (no ad spend needed)
2. **AI sales agent** — learns your products, answers buyer questions, qualifies leads
3. **Broadcast remarketing** — send offers to opted-in WhatsApp contacts in minutes

**Competitive landscape:**

- ManyChat = chatbot builder, assumes you already have WhatsApp contacts
- Wati/AiSensy = WhatsApp broadcast tools, no email→WA conversion
- Rasayel = WhatsApp CRM for sales teams, manual
- ConvertChat = the bridge + AI agent + broadcasts, purpose-built for B2B lead reactivation

---

## Product Capabilities (from codebase)

### Built & Working:

- **Contact management** — CSV/XLSX import, auto-cleaning, channel detection (email/WhatsApp/landline), batch splitting, dedup, country/city fields
- **Email campaigns** — Create campaigns with product image + text + WhatsApp CTA button, send via Resend in batches
- **WA click tracking** — Redirect URL logs clicks, attributes to campaign, captures consent
- **Two-stage consent flow** — Click WA button = pending, send WA message = opted-in (GDPR compliant)
- **WhatsApp inbox** — Real-time chat with contacts, message history, media support
- **Campaign analytics** — Sent, delivered, opened, clicked WA, bounced, per-contact status
- **AI Agent (config)** — Create AI agent, add knowledge sources (text/URL), set qualification questions, booking link
- **Pipeline/Kanban** — Drag-and-drop contact status management (new_lead → contacted → qualified → won/lost)
- **WhatsApp templates** — Create, submit, and sync templates with Meta approval

### In Progress / Planned:

- **WhatsApp broadcast campaigns** — Send offers directly to opted-in WhatsApp contacts (Phase 2)
- **AI Agent runtime** — Agent responds to WhatsApp messages 24/7, qualifies leads, routes hot leads
- **CTWA ads integration** — Click-to-WhatsApp ads (Phase 3)

---

## Homepage Sections

### Section Flow:

1. Hero
2. Problem (The untapped channel)
3. How it works (4 steps)
4. Features (The platform)
5. AI Agent (Beta)
6. Industries (Who this is for)
7. Results (Real results from WhatsApp remarketing)
8. CTA
9. Footer

---

### 1. HERO

**Goal:** Instant clarity on what ConvertChat does + who it's for.

**Overline (EN):** Early Access
**Overline (ES):** Acceso Anticipado

**H1 (EN):** Convert your leads into sales on WhatsApp
**H1 (ES):** Convierte tus leads en ventas por WhatsApp

**Subtitle (EN):** You have emails and phone numbers collecting dust. We turn them into an opted-in WhatsApp audience you can sell to — without running ads or getting your number banned.
**Subtitle (ES):** Tienes emails y teléfonos acumulando polvo. Los convertimos en una audiencia de WhatsApp con opt-in a la que puedes vender — sin anuncios y sin que te baneen el número.

**Primary CTA:** Message us on WhatsApp / Escríbenos por WhatsApp
**Secondary CTA:** See how it works / Ver cómo funciona

**Note line (EN):** No ads needed. No cold calling. Just your existing contacts.
**Note line (ES):** Sin anuncios. Sin llamadas en frío. Solo tus contactos existentes.

**Visual:** Bright gradient background (purple/blue/cyan) with animated WebGL orb.

---

### 2. PROBLEM / THE UNTAPPED CHANNEL

**Goal:** Frame WhatsApp as the massive opportunity they're missing. Data-driven.

**Overline (EN):** The untapped channel
**Overline (ES):** El canal sin explotar

**Headline (EN):** Build a WhatsApp audience you own. The new era of newsletters.
**Headline (ES):** Construye una audiencia en WhatsApp que te pertenece. La nueva era de los newsletters.

**Lead (EN):** Your leads are in spreadsheets, email lists, and old CRMs. Meanwhile, they check WhatsApp 23 times a day. Convert your existing contacts into an opted-in WhatsApp list — then send them product offers, restocks, and promotions whenever you want. No algorithms. No ad spend. Just direct access to buyers who actually read your messages.
**Lead (ES):** Tus leads están en hojas de cálculo, listas de email y CRMs olvidados. Mientras tanto, revisan WhatsApp 23 veces al día. Convierte tus contactos existentes en una lista de WhatsApp con opt-in — y envíales ofertas de producto, reposiciones y promociones cuando quieras. Sin algoritmos. Sin gasto en anuncios. Acceso directo a compradores que realmente leen tus mensajes.

**Card layout:** Two-column (1fr text / 1.3fr card). Gradient-bordered rectangle card.

**Card content:**

| Element               | EN                                                                                             | ES                                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Featured stat (green) | 98% — WhatsApp open rate                                                                       | 98% — Tasa de apertura en WhatsApp                                                                          |
| Featured stat (red)   | ~20% — Email open rate                                                                         | ~20% — Tasa de apertura en email                                                                            |
| Secondary stat 1      | 45% — Click-through rate on WhatsApp offers                                                    | 45% — Tasa de clic en ofertas por WhatsApp                                                                  |
| Secondary stat 2      | €0 — Ad spend to reactivate your list                                                          | 0 € — Gasto en anuncios para reactivar tu lista                                                             |
| Callout               | 3 billion people use WhatsApp daily. Your buyers are already there — you just need the bridge. | 3 mil millones de personas usan WhatsApp a diario. Tus compradores ya están ahí — solo necesitas el puente. |

---

### 3. HOW IT WORKS

**Goal:** Show the 4-step funnel. Simple, concrete, actionable.

**Overline (EN):** How it works
**Overline (ES):** Cómo funciona

**Headline (EN):** Upload. Send. Convert. Sell.
**Headline (ES):** Sube. Envía. Convierte. Vende.

**Lead (EN):** From your spreadsheet to WhatsApp sales in four steps.
**Lead (ES):** De tu hoja de cálculo a ventas por WhatsApp en cuatro pasos.

| #   | Title (EN)                      | Description (EN)                                                                                                                                                               |
| --- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 01  | Upload & clean your list        | Drop your CSV or Excel. We auto-detect who has email, who has a mobile, and filter out invalid contacts. Split by country, product, or buyer type.                             |
| 02  | Send email with WhatsApp button | Your product offer goes out via email. Every email has a green "Message us on WhatsApp" button. When they click, they land in your WhatsApp — with full opt-in consent.        |
| 03  | They click. Now they're yours.  | Every click is tracked. Every contact who messages you is automatically tagged as opted-in. You now own their WhatsApp number and can sell to them whenever you want. Forever. |
| 04  | Broadcast offers on WhatsApp    | New stock? New price? Send a WhatsApp broadcast to your entire opted-in list in 5 minutes. Product image, price, done. 98% will read it.                                       |

| #   | Title (ES)                        | Description (ES)                                                                                                                                                                |
| --- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 01  | Sube y limpia tu lista            | Sube tu CSV o Excel. Detectamos automáticamente quién tiene email, quién tiene móvil, y filtramos contactos inválidos. Separa por país, producto o tipo de comprador.           |
| 02  | Envía email con botón de WhatsApp | Tu oferta de producto sale por email. Cada email tiene un botón verde "Escríbenos por WhatsApp". Cuando hacen clic, llegan a tu WhatsApp — con consentimiento opt-in completo.  |
| 03  | Hacen clic. Ya son tuyos.         | Cada clic se rastrea. Cada contacto que te escribe se etiqueta automáticamente como opt-in. Ahora tienes su número de WhatsApp y puedes venderles cuando quieras. Para siempre. |
| 04  | Envía ofertas por WhatsApp        | ¿Nuevo stock? ¿Nuevo precio? Envía un broadcast de WhatsApp a toda tu lista con opt-in en 5 minutos. Imagen del producto, precio, listo. El 98% lo leerá.                       |

---

### 4. FEATURES / THE PLATFORM

**Goal:** Honest feature overview. What the platform actually does.

**Overline (EN):** The platform
**Overline (ES):** La plataforma

**Headline (EN):** Everything you need to sell on WhatsApp.
**Headline (ES):** Todo lo que necesitas para vender por WhatsApp.

**Lead (EN):** Import your contacts, launch campaigns, track results — all in one place.
**Lead (ES):** Importa tus contactos, lanza campañas, rastrea resultados — todo en un solo lugar.

| Feature         | EN Title                   | EN Description                                                                                                        | ES Title                  | ES Description                                                                                                                        |
| --------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Contact import  | Smart contact import       | Upload CSV or Excel files. Auto-detect channels, filter invalid contacts, remove duplicates, split into send batches. | Importación inteligente   | Sube archivos CSV o Excel. Detecta canales automáticamente, filtra contactos inválidos, elimina duplicados, divide en lotes de envío. |
| Email campaigns | Email → WhatsApp campaigns | Send product emails with a WhatsApp CTA button. Track opens, clicks, and consent — automatically.                     | Campañas Email → WhatsApp | Envía emails de producto con botón WhatsApp. Rastrea aperturas, clics y consentimiento — automáticamente.                             |
| Broadcasts      | WhatsApp broadcasts        | Send offers to your opted-in list in minutes. Product image, price, done. 98% open rate.                              | Broadcasts de WhatsApp    | Envía ofertas a tu lista con opt-in en minutos. Imagen del producto, precio, listo. 98% de apertura.                                  |
| Inbox           | WhatsApp inbox             | Real-time conversations with your buyers. Media, read receipts, session tracking. All in one place.                   | Buzón de WhatsApp         | Conversaciones en tiempo real con tus compradores. Multimedia, confirmaciones de lectura, seguimiento de sesión. Todo en un lugar.    |
| Tracking        | Campaign tracking          | See exactly who opened, who clicked, who messaged. Per-contact status. Full attribution.                              | Seguimiento de campañas   | Ve exactamente quién abrió, quién hizo clic, quién escribió. Estado por contacto. Atribución completa.                                |
| Consent         | GDPR-compliant consent     | Two-stage opt-in flow. Click = pending. Message = confirmed. Legally compliant. No bans.                              | Consentimiento GDPR       | Flujo de opt-in en dos etapas. Clic = pendiente. Mensaje = confirmado. Legalmente compliant. Sin baneos.                              |

---

### 5. AI AGENT

**Goal:** Show the AI agent as a real differentiator. Badge as Beta.

**Badge:** Beta

**Overline (EN):** AI-powered
**Overline (ES):** Potenciado por IA

**Headline (EN):** An AI that knows your products and sells them on WhatsApp.
**Headline (ES):** Una IA que conoce tus productos y los vende por WhatsApp.

**Lead (EN):** When buyers reply to your broadcasts, the AI agent handles the conversation. It answers questions, sends product links, qualifies leads, and routes hot buyers to you. Available 24/7 — so you never miss a sale.
**Lead (ES):** Cuando los compradores responden a tus broadcasts, el agente IA maneja la conversación. Responde preguntas, envía enlaces de productos, cualifica leads y te redirige los compradores calientes. Disponible 24/7 — para que nunca pierdas una venta.

**Bullets (EN):**

- Learns your product catalog, pricing, and stock
- Answers buyer questions in real-time
- Qualifies leads with custom questions
- Routes hot leads to you when they're ready to buy

**Bullets (ES):**

- Aprende tu catálogo de productos, precios y stock
- Responde preguntas de compradores en tiempo real
- Cualifica leads con preguntas personalizadas
- Te redirige los compradores calientes cuando están listos para comprar

---

### 6. INDUSTRIES / WHO THIS IS FOR

**Goal:** Show it's not a toy — real industries, real outcomes.

**Overline (EN):** Who this is for
**Overline (ES):** Para quién es

**Headline (EN):** Any B2B business sitting on a contact list
**Headline (ES):** Cualquier negocio B2B sentado sobre una lista de contactos

**Lead (EN):** The tool is the same. The outcome changes by industry.
**Lead (ES):** La herramienta es la misma. El resultado cambia según tu industria.

| Industry    | EN Title              | EN Description                                                                                               | EN Outcome                             |
| ----------- | --------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| Electronics | Wholesale electronics | New iPhone shipment? WhatsApp broadcast to 500 opted-in retailers in 5 minutes. First to know, first to buy. | Faster stock clearance, better margins |
| Real Estate | Real estate           | Old leads from portals sitting cold. Reactivate them when a new listing matches their profile.               | Viewings and offers from warm leads    |
| Health      | Clinics & health      | Patients who came once and never returned. "We have a new treatment" or "time for your check-up."            | Filled appointment slots               |
| Auto        | Auto & parts          | Trade show contacts, old workshop clients. Seasonal tyre deals, new part arrivals, fleet offers.             | Repeat orders from dormant buyers      |

| Industry    | ES Title              | ES Description                                                                                                                    | ES Outcome                                        |
| ----------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Electronics | Electrónica mayorista | ¿Nuevo envío de iPhones? Broadcast de WhatsApp a 500 tiendas con opt-in en 5 minutos. El primero en saber, el primero en comprar. | Liquidación de stock más rápida, mejores márgenes |
| Real Estate | Inmobiliaria          | Leads antiguos de portales enfriándose. Reactívalos cuando un nuevo piso coincide con su perfil.                                  | Visitas y ofertas de leads calientes              |
| Health      | Clínicas y salud      | Pacientes que vinieron una vez y no volvieron. "Tenemos un nuevo tratamiento" o "hora de tu revisión."                            | Citas ocupadas                                    |
| Auto        | Auto y recambios      | Contactos de ferias, clientes antiguos de taller. Ofertas de neumáticos, llegadas de piezas, ofertas para flotas.                 | Pedidos recurrentes de compradores inactivos      |

---

### 7. RESULTS

**Goal:** Show real results from companies using WhatsApp remarketing. Third-party case studies with numbers.

**Overline (EN):** Real results
**Overline (ES):** Resultados reales

**Headline (EN):** Businesses using WhatsApp remarketing are seeing this.
**Headline (ES):** Negocios que usan remarketing por WhatsApp están viendo esto.

**Case studies:**

| Company                            | Result                                                                            | Source    |
| ---------------------------------- | --------------------------------------------------------------------------------- | --------- |
| Smilodox (German athleisure brand) | €261,000 revenue from a single WhatsApp broadcast campaign — 9.6x return on spend | Chatarmin |
| Tata CLiQ (Indian retail)          | $500K+ revenue, 57% click-through rate on WhatsApp discount broadcasts            | Zixflow   |
| BGC Wholesale (UK gift cards)      | 14% redemption rate targeting lapsed customers with WhatsApp remarketing          | b2b.store |
| Unilever Brazil                    | 14x increase in sales via personalized WhatsApp broadcasts                        | Sanoflow  |

**Copy (EN):** These companies used WhatsApp to reactivate dormant contacts and send targeted offers. The results speak for themselves. ConvertChat gives you the same tools — plus the bridge to get your contacts on WhatsApp in the first place.

**Copy (ES):** Estas empresas usaron WhatsApp para reactivar contactos inactivos y enviar ofertas segmentadas. Los resultados hablan por sí solos. ConvertChat te da las mismas herramientas — más el puente para llevar tus contactos a WhatsApp en primer lugar.

---

### 8. CTA

**Goal:** One clear action. Low commitment. Start a conversation.

**Overline (EN):** Start a conversation
**Overline (ES):** Empieza una conversación

**Headline (EN):** How much is your contact list worth?
**Headline (ES):** ¿Cuánto vale tu lista de contactos?

**Subtitle (EN):** 15 minutes. Tell us how many dormant contacts sit in a spreadsheet, and we'll show you how WhatsApp reactivation could turn them into buyers.
**Subtitle (ES):** 15 minutos. Cuéntanos cuántos contactos inactivos tienes en una hoja de cálculo, y te mostramos cómo la reactivación por WhatsApp puede convertirlos en compradores.

**CTA (EN):** Message us on WhatsApp
**CTA (ES):** Escríbenos por WhatsApp

---

### 9. FOOTER

**Tagline (EN):** Convert your leads into WhatsApp sales
**Tagline (ES):** Convierte tus leads en ventas por WhatsApp

**Links:** Product, Pricing, Blog, Privacy, Terms
**Company:** Nillard Ltd · Costa del Sol, Spain

---

## SEO Keywords to Weave Naturally

- WhatsApp remarketing / remarketing por WhatsApp
- WhatsApp retargeting
- Lead reactivation / reactivación de leads
- WhatsApp Business API
- WhatsApp broadcast / broadcast de WhatsApp
- Opt-in WhatsApp
- Campaign attribution / atribución de campañas
- Email to WhatsApp / email a WhatsApp
- WhatsApp CRM
- B2B WhatsApp marketing / marketing B2B por WhatsApp

---

## Tone & Voice

- **Direct.** No fluff. Short sentences. Every word earns its place.
- **Confident but not arrogant.** We solve a real problem. We don't oversell.
- **Concrete.** Numbers, steps, outcomes. Not vague promises.
- **B2B pragmatic.** This audience cares about revenue, not features. Lead with outcomes.

---

## Open Questions

- [ ] Do we need a demo/product screenshot section?
- [ ] Pricing page — placeholder or real plans?
- [ ] Hero visual — bright gradient bg with WebGL orb (discussed, next to implement)
