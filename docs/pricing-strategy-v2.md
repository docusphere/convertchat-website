# ConvertChat Pricing Strategy v2

_Drafted 2026-07-24. Status: Under consideration._

## Current vs Proposed

| | Current (website) | Proposed v2 |
|---|---|---|
| Growth | $49/mo | $99/mo |
| Business | $99/mo | $249/mo |
| Scale | $199/mo | $499/mo |
| Annual discount | — | ~2 months free |

## Pricing Model

**Tier on contacts (MAC), differentiate on AI conversations.**

- Platform fee by contact tier (industry standard, scales with business size)
- AI agent included in all plans with conversation caps per tier
- Meta messaging costs pass-through at 0% markup (competitive advantage)
- Free white-glove setup on all plans (WABA, Meta verification, templates)

## Proposed Tiers

|  | Growth $99/mo | Business $249/mo | Scale $499/mo |
|--|--------------|-----------------|--------------|
| **Contacts** | 2,500 | 10,000 | 50,000 |
| **AI conversations/mo** | 500 | 2,500 | Unlimited |
| **WhatsApp numbers** | 1 | 3 | 6 |
| **Team seats** | 2 | 5 | 15 |
| CRM + inbox | Yes | Yes | Yes |
| Unlimited broadcasts | Yes | Yes | Yes |
| Email-to-WhatsApp funnel | Yes | Yes | Yes |
| AI agent (qualification) | Yes | Yes | Yes |
| Campaign analytics | Yes | Yes | Yes |
| Template management | Yes | Yes | Yes |
| Priority support | — | Yes | Yes |
| Dedicated account manager | — | — | Yes |
| **Meta messaging** | 0% markup | 0% markup | 0% markup |
| **Setup** | Free | Free | Free |

Annual pricing: $83/mo ($990/yr), $209/mo ($2,490/yr), $419/mo ($4,990/yr).

## AI Conversation Definition

One AI conversation = one contact interacting with the AI agent within a 24-hour window. Multiple messages back and forth within that window count as 1 conversation.

### Usage scenarios

- Growth (500/mo, ~17/day): 1-2 small campaigns/week to ~500 contacts
- Business (2,500/mo, ~83/day): weekly campaigns to 2,000+ contacts, multiple product lines
- Scale (unlimited): daily campaigns across markets, multiple WA numbers, high reply volume

### Upgrade trigger

A wholesaler on Growth sending 2 campaigns/month to 500 contacts gets ~60-100 AI conversations/month. When they scale to 2,000 contacts or weekly campaigns, they approach 400-500/month and naturally upgrade.

## Integration Tiers (future)

| | Growth | Business | Scale |
|---|---|---|---|
| Static catalog (CSV/manual) | Yes | Yes | Yes |
| Shopify / WooCommerce | — | Yes | Yes |
| Custom API / webhook | — | — | Yes |
| ERP connectors (SAP, Odoo) | — | — | Yes |

Alternative: sell integrations as add-ons at $49-99/month each, independent of tier.

## Pricing Justification

- AI agent replaces a junior sales qualifier (Spain: 1,500-2,500 EUR/month, US/UK: $3,000-5,000/month)
- $99: cheaper than one hour of a salesperson's day
- $249: replaces the qualification step entirely
- $499: replaces qualification + runs multiple campaigns across multiple numbers
- 0% markup on Meta rates differentiates from competitors who mark up

## Competitive Reference: FunnelChat

Source: funnelchat.com/empresas-tradicionales#pricing (captured 2026-07-24)

| | Growth Business | Advanced Business | Infinity |
|---|---|---|---|
| Monthly | $99 | $199 | $497 |
| Annual | $83 | $166 | $414 |
| MAC | 8,500 | 30,000 | 50,000 |
| WA numbers | 3 | 4 | 6 |
| Multi-agent seats | 3 | 5 | 10 |
| AI automations | Yes | Yes | Yes |
| AI agents | Unlimited | Unlimited | Unlimited |
| Support | Standard | Premium | Premium |

FunnelChat is WhatsApp-only (no email bridge), no email-to-WhatsApp funnel, no AI qualification depth. ConvertChat can justify matching or exceeding their pricing.

## What Changes If Approved

- Pricing page: `app/[locale]/pricing/` + i18n strings in `messages/{en,es}.json`
- Blog posts referencing "plans from 49 EUR/mo" (at least 4 posts)
- `docs/website-copy-positioning.md`
- CTA sections across the site
