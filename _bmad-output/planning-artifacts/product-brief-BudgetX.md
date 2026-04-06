---
title: "Product Brief: BudgetX"
status: "draft"
created: "2026-04-05"
updated: "2026-04-05"
inputs: ["User discovery notes", "Market context: Indian personal finance fintech", "Competitive landscape research"]
---

# Product Brief: BudgetX

## Executive Summary

BudgetX is a personal finance tracker built for salaried professionals in India who want clarity on where their money goes — without the friction of spreadsheets or the overwhelm of wealth-management platforms.

Unlike Notion grids or Excel sheets, BudgetX gives you one place to log salary, expenses, and investments (mutual funds, PPF, stocks), then shows you your financial health in real time: monthly spending patterns, savings rate, and smart alerts when you're overspending or doing well.

It's self-contained (no bank account linking), intuitive to use daily, and built specifically for the Indian professional's financial reality — rent, EMI, credit cards, PPF, and the impulse to understand "am I saving enough?"

## The Problem

Today's salaried professionals track their money in Notion pages, Excel sheets, or hunt across multiple apps—each solving one piece. You manually add expenses, lose context across the month, and never get the analysis that matters: *Where is my money actually going? Am I saving enough?*

**The costs are real:**
- Time wasted on manual data entry and organization
- No visibility into spending patterns (What categories drain my budget? How do I compare month-to-month?)
- Can't tie savings goals to reality (PPF, stocks, mutual funds scattered across mental notes)
- No alerts when you're off-track — you discover overspending *after* the month ends
- Zero motivation visibility — no signal on whether you're winning or losing financially

The existing apps swing to extremes: simple spending trackers skip investments and savings entirely, while wealth-management platforms (Walnut, Money View) are built for complex portfolio optimization, not folks who want to see "Income vs Spend" at a glance.

## The Solution

**BudgetX is a single, unified platform to log and understand your finances.**

**Core experience:**
- **Dashboard**: See your lifetime financial summary (total income, total spend, total invested) at a glance, plus this month's breakdown with a quick-entry button for expenses and investments
- **Flexible logging**: Add transactions daily (with quick FAB) or bulk during a weekly review ritual—your choice
- **Smart categorization**: Predefined categories (rent, EMI, credit card, groceries, utilities, misc.) + ability to create custom categories. Investment types include PPF, mutual funds, stocks
- **Gamification for engagement**: Daily spending streaks, badges for milestones, and access to view friends' savings rates and trends (controlled sharing—no sensitive data exposed)
- **Analysis that matters**: Monthly spend trends, savings rate tracking (total income - all expenses, excluding investments), category breakdowns, and smart alerts
- **Complete financial picture**: Income (salary + side gigs) + all expenses + all investments in one place

No aggregation drama, no privacy concerns, no overengineered wealth-planning features. Just clarity.

## What Makes This Different

**Self-contained & trusted**: You control your data. No bank linking, no cloud aggregation, no risk of financial data leaks. For professionals worried about privacy, BudgetX is the antidote to fintech data anxiety.

**Built for Indian professionals**: The categories, investment types, and income patterns are calibrated for Indian salaries, PPF culture, mutual funds, and credit card spending — not generic US financial planning.

**Simplicity with depth**: Not a calculator (too basic) and not a wealth manager (too complex). You get the analysis you need to see if you're winning, without the noise of portfolio optimization.

**Investment + expense tracking in one place**: Most personal finance apps separate "spending" from "investing." BudgetX treats them equally (both are where your money goes) so you can see the real picture: salary in → investment bucket, salary in → spending bucket.

## Who This Serves

**Primary user:** Salaried professionals in India (age 25-40, annual income ₹8L–₹1.5Cr) who:
- Want one unified view of income, spending, and savings
- Are disciplined enough to log monthly but don't need handholding
- Invest in mutual funds, stocks, or PPF and want to see it alongside spending
- Care about seeing patterns (How much did I spend last month? Am I saving enough?) but don't optimize portfolios
- Value privacy and control over data aggregation

**First users:** Itachi (creator, scratching own itch) + 2-3 trusted friends. Personal use case; no paid acquisition planned for MVP1. Friends can view each other's trends and savings rates (controlled sharing for accountability and motivation).

## Success Criteria

**User-level success:**
- User logs consistently (at least weekly, ideally daily) and doesn't churn
- User changes spending behavior based on alerts (e.g., "Oops, I'm overspending groceries this month")
- User can articulate "Here's where my money goes" + "Here's my savings rate" from BudgetX dashboard
- User feels less chaos and more control (vs. the Notion/Excel baseline)

**Product metrics (MVP1):**
- Log addition rate: Daily or weekly engagement (flexible UX means both patterns are valid)
- Streak maintenance: Users maintain consistent logging streaks (key retention signal)
- Dashboard visit frequency: 2–3 times per week
- Category coverage: User has logged across at least 4–5 expense categories + 2+ investment categories
- Alert engagement: Per-category and global alerts trigger appropriately; user responds to overspend warnings

## Scope

### In MVP1
- **Logging**: Daily micro-entries (via quick FAB) or weekly bulk entry—both UX patterns supported
- **Categories**: Predefined expense categories (rent, EMI, credit card, groceries, utilities, miscellaneous) + investment types (PPF, mutual funds, stocks). Users can create custom categories
- **Onboarding**: During setup, users define per-category alert thresholds (₹X or Y% of average) and global monthly spend cap
- **Dashboard**: Lifetime summary + current month breakdown + quick-add FAB
- **Analysis**: Monthly spend trends, category breakdowns, savings rate (income - all expenses), spend vs. income visualization, bank savings + investment summary
- **Alerts**: Per-category thresholds (user-defined during onboarding: ₹X or Y% of average) + global monthly spend cap alert
- **Gamification**: Daily spending streaks, badges for consistency, friend leaderboards showing savings rates (trends only, no amounts shared)
- **Web-only**: Single-user personal app; no mobile, no accounts/collaboration

### Out for Future Phases
- Budget forecasting (setting targets per category)
- Goal tracking (save ₹X by month Y)
- Tax reporting (ITR helpers, investment summaries)
- Data export / reporting
- Mobile apps
- Multi-user / family accounts
- Bank account aggregation / automation

## Vision

If BudgetX succeeds, it becomes the *financial clarity platform for the Indian professional* — the tool people reach for first when they want to understand their money, not when they want to optimize portfolios.

**Year 2-3 thinking:**
- Extend to goal tracking (save ₹10L for a house down payment)
- Add mobile companion for on-the-go logging
- Introduce forecasting: "If I keep saving like this, I'll hit ₹X by month Y"
- Tax helpers: "You invested ₹2.5L in PPF; here's what to report on ITR-1"
- Freemium expansion: Premium features (forecasting, tax reports, bulk export) for power users; remain free for core tracking
- Reach: From personal + friends → early adopter community → can consider broader distribution (but only if retention and unit economics work)

The north star: **One tool for clarity on where your money goes. Everything else is optional.**

---

## Appendix: Technical Direction (Non-Binding)

User indicated preference for **React (frontend) + Spring Boot (backend)** for MVP1. Data will be stored on cloud with encryption for sensitive information (transactions, amounts). Account security and data encryption are priorities. Full technical discovery (architecture, database choice, deployment, encryption strategy) happens in the solutioning phase.

**Mobile timeline:** Q3 2026 target for companion mobile app.
