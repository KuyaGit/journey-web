# Journey App — Feature & Technical Reference

## Overview

**Journey** is a discipleship quiz and reading app for iOS, Android, and Web. It is built around "The Journey" — a Filipino/English (Taglish) church discipleship program. The core framework is the **Seed Cycle**: **GO → GROW → GLOW → GENERATE**, teaching users how to build friendships, connect others to church, share the Gospel, and raise up leaders.

---

## Screens & Navigation

File-based routing via Expo Router. Bottom tab bar with four tabs: **Home** (dashboard), **Quiz** (volume picker), **Book** (reading), and **Give** (donation). The tab bar is hidden when inside a quiz or book reader session.

| Route | Screen | Description |
|---|---|---|
| `/` | Dashboard | Seeds bar, volume grid, stats summary |
| `/quiz` | Quiz Index | Volume picker list with lock/completion state |
| `/quiz/[volume]` | Quiz Session | Active quiz with hearts, Seeds, and question cards |
| `/quiz/results` | Results | Score, Seeds earned, badge unlock animation |
| `/book` | Book List | All volumes with per-volume reading progress |
| `/book/[volume]` | Book Reader | Rich content reader for a specific volume |
| `/give` | Give | "Blessed & Touched" giving/donation screen |

---

## Onboarding

A first-launch overlay (`src/components/onboarding-overlay.tsx`) is shown once on app install. It fades in after the splash animation completes and guides new users through the core flow.

- **3 swipeable slides**: Welcome to Journey / Test Your Knowledge / Read & Grow
- **Navigation**: Skip + Next buttons on slides 1–2; single full-width Get Started on slide 3
- **Persistence**: dismissed state is stored in AsyncStorage under key `journey_onboarding_seen`; never shown again after dismissal
- **Layering**: `zIndex: 999` — below the splash overlay (1000), above the app tabs

---

## Gamification System

### Seeds & Chapters

Seeds are earned by completing quizzes. Chapters gate access to volumes.

| Chapter | Seeds Required |
|---|---|
| 1 | 0 |
| 2 | 100 |
| 3 | 250 |
| 4 | 500 |
| 5 | 1,000 |
| 6+ | 1,000 + (chapter − 5) × 500 |

> **Internal note**: The codebase uses `progress.xp` and `progress.level` internally. "Seeds" and "Chapter" are UI-only labels.

Seeds earned per quiz session:
- **+10 Seeds** per correct answer
- **+5 Seeds** perfect bonus (no hearts lost)

### Streaks

- **Quiz streak** (`streak`): increments each consecutive calendar day a quiz is played; resets to 1 after a gap.
- **Reading streak** (`readingStreak`): same logic, tracked separately when the user reads in the Book tab.
- Both streaks are shown on the Dashboard when > 0.

### Badges

- One badge per volume, represented by an emoji (`badgeEmoji`).
- Awarded when the quiz score is **≥ 60%**.
- Badge unlock triggers a full-screen animated overlay (`BadgeUnlock` component) with a 1.2 s delay.
- `completedVolumes` is also flagged at the same time.

---

## Volume System

Six volumes total. Each is locked until the user reaches the required chapter.

| Volume ID | Title | Subtitle | Unlock Chapter | Badge |
|---|---|---|---|---|
| `main` | The Journey | Overview & The Seed Cycle | 1 | 🗺️ |
| `volume-1` | Building Friendships | GO, GROW, GLOW, GENERATE | 2 | (volume emoji) |
| `volume-2` | Connecting to Church | Life Group & the 3 I's | 3 | (volume emoji) |
| `volume-3` | Sharing the Gospel | BUCAS & How to Share | 4 | (volume emoji) |
| `volume-4` | Making Them Leaders | SSS & The Leadership Process | 5 | (volume emoji) |
| `volume-5` | Discipleship Activities | Connect, Cultivate, Contribute | 6 | (volume emoji) |

Locked volumes display 🔒 with the Seeds required to unlock. Completed volumes show ✓.

---

## Quiz Feature

### Quiz Index

`/quiz` is the entry point for the quiz flow. It renders a scrollable list of all volumes with color accents, lock state, question count, and completion status. Tapping a locked volume shows an Alert; tapping an unlocked one navigates to `/quiz/[volume]`.

### Question Card Design

Each question is displayed inside a white rounded card with a soft shadow, placed on a `backgroundElement` background. The card contains:

- **Volume label** at the top in accent color (e.g. `VOLUME 1 · Q3`)
- **Question text** — left-aligned, bold, 18 px
- **Answer options** — outlined border buttons (no A/B/C/D letter labels)
  - Normal: transparent background, light gray border
  - Selected (pending reveal): accent-colored border + tint background + accent text
  - Correct revealed: green border + light green tint
  - Wrong selected revealed: red border + light red tint
- **Explanation** — shown after reveal inside the same card with a colored left border

### Progress Header

Shown above the question card during a quiz session:

- **Hearts**: filled ❤️ / empty 🤍 (3 per session)
- **Counter**: `Q N / N` format
- **Progress bar**: gradient from amber → volume accent color

### Question Types

| Type | Interaction |
|---|---|
| `multiple-choice` | Tap one of 4 outlined options |
| `true-false` | Tap True or False (outlined buttons) |
| `swipe` | Swipe card right (agree) or left (disagree) |

### Session Mechanics

- **3 hearts** per session. Losing all hearts ends the session early (`no-hearts` phase).
- Wrong answer → lose 1 heart → `reveal` phase shows the explanation.
- Correct answer → `reveal` phase shows explanation, no heart lost.
- After the last question → `complete` phase → navigate to Results screen.
- Results screen shows: correct count, Seeds earned (animated counter), hearts remaining, reading streak, and badge if earned.
- **Try Again** restarts the same volume quiz; **Back to Home** returns to Dashboard.

### Session Phases

```
question → reveal → question (repeat) → complete
                  → no-hearts (early end)
```

---

## Book Feature

### Content Block Types

Each section of a volume is made up of ordered content blocks:

| Block type | Description |
|---|---|
| `text` | Paragraph of Taglish discipleship content |
| `image` | Static image with optional caption |
| `checkpoint` | Inline quiz question (references a question by index) |

### Reading Progress

- Sections are marked as read when the user scrolls through them.
- Quizzes within sections are tracked separately (`quizzesDone`).
- The Book List shows a colored progress bar per volume: `sectionsRead / totalSections`.
- Volumes are locked in the Book tab by the same chapter system as the quiz tab.

### Section Quiz Modal

`SectionQuizModal` surfaces checkpoint questions inline while reading — the user can answer without leaving the reading flow. Correct answers award **+5 Seeds**.

---

## Give Screen

`/give` is a static donation screen ("Blessed & Touched"). It displays a cross icon, a gratitude message from the author, and a "Give a Love Gift" CTA button (accent color `#B85468`). No navigation guard — always accessible regardless of chapter, on all platforms including web.

---

## Dashboard

- **Header**: App title "Journey" + subtitle "Your discipleship quiz"
- **Streak badge**: 🔥 + day count (visible when streak > 0)
- **Seeds Bar** (`XPBar` component): current chapter (`Ch. N`), Seeds count, progress to next chapter
- **Volume grid**: 2-column grid, each card shows color accent, emoji, title, lock state or completion check
- **Stats row**: Badges earned | Seeds | Streak

---

## Data Persistence

All data is stored locally with `AsyncStorage` (no remote backend).

| Key | Contents |
|---|---|
| `journey_quiz_progress` | `xp`, `level`, `streak`, `lastPlayed`, `badges[]`, `completedVolumes[]`, `readingStreak`, `lastRead` |
| `journey_book_progress` | Per-volume: `sectionsRead[]`, `quizzesDone[]` |
| `journey_onboarding_seen` | `"true"` once the onboarding overlay has been dismissed |

Progress is non-critical — storage failures are silently swallowed.

---

## Architecture & Tech Stack

| Concern | Solution |
|---|---|
| Framework | Expo SDK ~54, Expo Router ~6 |
| React | React 19, React Native 0.81 |
| Animations | `react-native-reanimated` ~4 |
| Gesture / Swipe | `react-native-gesture-handler` ~2.28 |
| Worklets (pinned) | `react-native-worklets` 0.5.1 — do not upgrade without a custom dev build |
| Gradients | `expo-linear-gradient` ~15 (progress bar, splash screen) |
| Local storage | `@react-native-async-storage/async-storage` 2.2.0 |
| Icons | `@expo/vector-icons`, `expo-symbols` |
| Images | `expo-image` |
| Theming | `src/constants/theme.ts` → `Colors`, `Spacing`, `Fonts`; consumed via `useTheme()` hook |
| Color scheme | `src/hooks/use-color-scheme.ts` (`.web.ts` variant handles SSR) |
| Base components | `ThemedView`, `ThemedText` — all UI must use these; no hardcoded colors or magic numbers |
| Platform variants | `.web.ts` files for tab bar and color scheme |

### File Structure

```
src/
  app/                    # Expo Router pages
    index.tsx             # Dashboard
    give/
      index.tsx           # Give / donation screen
    book/
      index.tsx           # Book list
      [volume].tsx        # Book reader
    quiz/
      index.tsx           # Quiz volume picker
      [volume].tsx        # Quiz session
      results.tsx         # Quiz results
  components/
    book/                 # BlockPage, CheckpointCard, SectionCard, SectionQuizModal
    quiz/                 # BadgeUnlock, HeartBar, MultipleChoice, ProgressHeader,
                          #   QuestionCard, SwipeCard, TrueFalseCard, XPBar
    animated-icon.tsx     # Splash screen overlay (zIndex 1000)
    onboarding-overlay.tsx# First-launch onboarding (zIndex 999)
    themed-text.tsx
    themed-view.tsx
    bottom-tab-bar.tsx
    app-tabs.tsx (.web.tsx)
  constants/
    theme.ts              # Colors, Spacing, Fonts, MaxContentWidth, BottomTabInset
  data/
    book/                 # BookVolume data + types (main, volume-1 … volume-5)
    questions/            # VolumeData + Question types (main, volume-1 … volume-5)
  hooks/
    use-book-progress.ts
    use-quiz-progress.ts
    use-quiz-session.ts
    use-theme.ts
    use-color-scheme.ts (.web.ts)
  store/
    progress.ts           # Seeds/chapter/streak logic + AsyncStorage for quiz progress
    book-progress.ts      # AsyncStorage for book reading progress
```

---

## Privacy Policy

> This is the ready-to-host text for the Google Play **App content → Privacy policy URL**.
> Publish it at a public URL (e.g. GitHub Pages or a gist) and paste that link into Play Console.
> Keep it in sync with the **Data Persistence** section above if data handling ever changes.

---

### Grow Together — Privacy Policy

**Effective date:** 27 June 2026

**Summary:** Grow Together does not collect, store, or share any personal data. Everything you do in the app stays on your device.

**Information we collect.** None of your information is transmitted to us or any third party. The app saves the following **only on your device**, to track your progress:
- reading progress and reading streak
- quiz scores, hearts, and completed volumes
- Seeds, Chapters, and earned badges
- whether you have seen the first-launch onboarding

This data is stored locally using your device's standard app storage (AsyncStorage). It never leaves your device and is not accessible to us.

**How your data is stored.** All progress is kept locally on your device. If you uninstall the app, this locally stored data is removed.

**No accounts, ads, or analytics.** Grow Together has no sign-in or user accounts, shows no ads, and includes no analytics or crash-reporting services. The app has no backend server and does not make network requests to transmit your data.

**The "Give" feature.** The Give screen displays giving information (such as bank-transfer details) so you can give externally if you choose. It only *displays* this information — no payment is collected or processed inside the app.

**Children's privacy.** The app is intended for users aged 13 and older and is not directed at children. We do not knowingly collect any data from anyone.

**Third-party services.** The app does not use third-party services that collect your data.

**Changes to this policy.** We may update this policy from time to time. The effective date above reflects the latest version.

**Contact.** Questions about this policy: montealtomarklowel@gmail.com.
