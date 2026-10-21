# StudyPath AZ-900 Study Planner

**StudyPath is an unofficial AZ-900 study aid. It is not affiliated with or endorsed by Microsoft.**

StudyPath is a browser-based learning companion for people preparing for Microsoft Azure Fundamentals (AZ-900). It combines a sample student dashboard with an AZ-900 learning path, a personalized study planner, original practice questions, revision flashcards, topic readiness estimates, and topic notes.

The practice material is original and organized around the public[AZ-900 skills outline on Microsoft Learn](https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/)
## Features

- **Dashboard:** Study overview, sample subject progress, and sample upcoming sessions. Dashboard statistics are illustrative sample data, not live learner records.
- **AZ-900 learning path:** Overview of the three AZ-900 skill areas.
- **Personal study planner:** Create a schedule from an exam date, available daily study hours, and selected focus topics. The generated schedule covers up to the next seven days and includes review and practice blocks. 
- **Flashcards:** An AZ-900 study-tool view with eight concept cards, answer reveal, previous/next navigation, and Easy, Medium, Hard, and All filters. Learners can also mark cards for extra practice during the current app session.
- **Practice quiz:** A separate AZ-900 study-tool view with six original multiple-choice questions across the three skill areas. Answers provide immediate feedback, explanations, and an everyday example. Quiz results contribute to topic scores.
- **Readiness tracker:** Shows practice accuracy by topic and highlights areas to revisit. Readiness is only an estimate; it is not a prediction or guarantee of an exam result.
- **Topic notes:** Open notes from a planner topic and add topic-specific notes. Notes are saved in the current browser.
- **Responsive interface:** React components and CSS adapt the study tools to desktop and mobile screens.

## Technology

- React and JavaScript
- Vite
- CSS
- Oxlint
- Browser `localStorage` for study plans, quiz scores, and notes

Study data is stored in the current browser only. There is no account, backend, cross-device sync, paid API, or AI service.

## Run locally

Requirements: Node.js and npm.

```sh
git clone https://github.com/sesosilo22-web/StudyPath.git
cd StudyPath
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

On Windows PowerShell, the equivalent npm commands can be run as:

```powershell
npm.cmd install
npm.cmd run dev
```

## Verify the project

```sh
npm run build
npm run lint
```

There is no dedicated automated test script in `package.json`. To manually check the main flows:

1. Open **Explore AZ-900**, then select **Study planner**.
2. Set an exam date, daily hours, and one or more topics; choose **Generate my schedule**.
3. Add a study session and confirm it appears in the daily schedule.
4. Use a topic's **View notes** control, add a note, refresh the page, and confirm the note remains in that browser.
5. In **Review & Practice**, switch between **Flashcards** and **Practice Quiz**. Try a difficulty filter, reveal a card, and complete a quiz answer to see its feedback.
6. Open **Readiness** and confirm the quiz score is reflected as topic practice accuracy.


## Current limitations

- The dashboard's subject progress and upcoming sessions are sample values.
- Study plans, scores, and notes are local to one browser and can be cleared with browser data.
- Readiness uses a small practice question set and is only an estimate.
- A Study Buddy feature is not present in the current source code.
- StudyPath is an educational aid, not an official Microsoft product or substitute for the published exam guide.
