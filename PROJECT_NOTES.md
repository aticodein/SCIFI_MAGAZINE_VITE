CFE Sci-Fi Magazine — Project Notes
🛰️ Overview

CFE Sci-Fi Magazine is a hybrid:

AI-powered sci-fi story creation studio

Gamified interactive universe

Membership/subscription model

Users progress through levels, unlock tools, generate story elements, and are guided by an AI character (Astra-9).

🧠 Core Concept

Users can build one complete sci-fi story for free,
by unlocking and publishing 3 AI tools.

After that, they must upgrade using one of the discount tiers.

Everything is delivered through:

binary funnel choices (8 → 4 → 2 → 1)

an AI guide (Astra-9)

achievements

discount “missions”

A–E code unlocking system

a progression flow

This creates emotional attachment and encourages subscription.

🌌 AI Guide — Astra-9

Default companion before email verification.
After email verification, user may create their own guide later.

Character Requirements:

Flat 2D illustration style

Slight cyberpunk influence

Gender-neutral to slightly feminine

Bright colors, not too dark

Clear emotional expressions

Used across UI for:

onboarding,

funnel guidance,

progress updates,

discount messages,

warnings (timers),

achievement celebrations.

🧪 AI Tools (8 Tools Total)

Users will ultimately access these tools in paid mode.
But free users can unlock and publish 3 tools.

Tool List:

Character Creator

Weapon Generator

Planet / World Builder

Species / Alien Creator

Timeline Generator

Faction / Organization Builder

Story Intro Generator

Story Cover Generator

These tools cost the platform money, so free usage is strictly limited.

🔺 Binary Funnel (8 → 4 → 2 → 1)

The funnel determines which tool a free user unlocks first after email verification.

Tier 1 — Choose between two big categories

Life (living elements)

Worlds (non-living elements)

Tier 2 — Each category splits into 2

Life →

Characters & Species

Factions & Story Intro

Worlds →

Planet & Timeline

Weapon & Cover Art

Tier 3 — Final decision (2 choices → 1 tool)

User chooses between the final pair and gets ONE tool.

Astra-9 narrates each step.

🧩 A–E Code System

Users must collect 5 code pieces (A, B, C, D, E)
before entering the funnel.

No AI is used to collect code pieces.

Purely gamification.

After collecting these, user reaches Level 1.

Codes allow unlocking one AI tool after email verification.

Users may repeat this once or twice, but after 3 published tools, free play stops.

📧 Email Verification (Level 2)

After the funnel selects a tool:

User must enter a valid email.

Email verification must succeed.

THEN:

30-day timer starts

The chosen tool becomes usable

Scorpio begins sending “promise” messages for discounts:

“Publish 1 tool → 50% OFF”

“Publish 3 tools → 75% OFF”

⏳ Timers / Countdown Rules
30-Day Tool Window

Starts immediately after email verification

Ticks even when user is offline

If timer ends, tool expires

User must collect A–E again for another tool

No infinite free AI usage

🏆 Publishing Rules

Publishing = user presses “Publish” inside the unlocked tool.

Publish Tool #1 → 50% OFF unlocked

50% discount valid for 14 days

30% discount becomes permanently visible

Promise appears: “Publish 2 more tools for 75% OFF.”

Publish Tool #2

Progress indicator: “2/3 tools published.”

Publish Tool #3 → 75% OFF unlocked

75% discount valid for 7 days

After 7 days, user returns to:

permanent 30%

or remaining 50% if time still left

After 3 tools:

Free gameplay is locked

User must upgrade to continue

💳 Discount System (3-Tier)
1. Permanent 30% OFF

Always available after publishing Tool #1

Never expires

2. Temporary 50% OFF

Unlocked after Publishing Tool #1

Valid for 14 days

Shown prominently

3. Ultra 75% OFF

Unlocked after Publishing Tool #3

Valid for 7 days only

Best conversion moment

Used to close “power users”

🛠️ Technical Architecture
Frontend

Vite + React + TypeScript

Key components:

CreateUsername.tsx

SessionLogin.tsx

UserStatus.tsx

Pro.tsx (main Pro/unlock logic)

Layout.tsx

React Router pages for each tool

Astra-9 UI component

Backend

Django

Endpoints:

/api/create-username

/api/check-username

/api/token/redeem

/api/ping

/api/login-session

/api/progress/save

/api/get-user-progress

Backend models needed:

UserProfile (username, email_verified, level, tool_unlocked)

UserToolProgress (number_of_tools_published, current_tool, tool_expiry)

DiscountState (30%, 50%, 75% timers)

A–E CodeProgress

Token (if needed)

🎮 Gameplay Loop Summary

User enters username → Level 0

Collect A–E → Level 1

Funnel → Select tool

Email verification → Level 2

Tool usage begins → 30-day timer runs

Publish tool →

Tool #1 → unlock 50%

Tool #2 → progress

Tool #3 → unlock 75%

After Tool #3 → free play stops

Upgrade required

Paid users get unlimited tools

🔒 Do Not Change These Rules Without Approval

Discounts must follow the 30/50/75 progression

User must collect A–E before funnel

Email verification must happen before tool unlock

30-day timer always starts immediately

Publish #1 unlocking 50% is required

Publish #3 unlocking 75% is required

Astra-9 is default guide and must appear in all funnel dialogs

Free users cannot access more than 3 tools total

These are foundational system rules.

🧭 Next Steps for Developers

Build UI components for Astra-9

Implement funnel logic in front-end

Add discount timers to DB

Add publish logic to backend

Block tools after 3 published

Make Copilot Chat read this file before working on changes

✔ End of PROJECT_NOTES.md