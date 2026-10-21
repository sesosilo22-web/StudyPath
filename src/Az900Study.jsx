import { useState } from 'react'
import {
  az900Flashcards,
  az900Questions,
  az900SkillsOutlineUrl,
  az900Topics,
} from './data/az900Content.js'
import './Az900Study.css'

const STORAGE_KEY = 'studypath-az900-study-v1'

function getInitialStudyData() {
  const emptyData = {
    scores: {},
    plan: null,
    message: 'Scores and your plan are saved in this browser only.',
  }

  try {
    const savedData = window.localStorage.getItem(STORAGE_KEY)
    if (!savedData) return emptyData

    const parsedData = JSON.parse(savedData)
    const scores = {}
    az900Topics.forEach((topic) => {
      const score = parsedData?.scores?.[topic.id]
      if (
        Number.isFinite(score?.correct)
        && Number.isFinite(score?.total)
        && score.correct >= 0
        && score.total >= score.correct
      ) {
        scores[topic.id] = { correct: score.correct, total: score.total }
      }
    })

    const candidatePlan = parsedData?.plan
    const weakTopicIds = Array.isArray(candidatePlan?.weakTopicIds)
      ? candidatePlan.weakTopicIds.filter((id) => az900Topics.some((topic) => topic.id === id))
      : []
    const hoursPerDay = Number(candidatePlan?.hoursPerDay)
    const hasValidPlan = typeof candidatePlan?.examDate === 'string'
      && !Number.isNaN(new Date(`${candidatePlan.examDate}T12:00:00`).getTime())
      && hoursPerDay >= 0.5
      && hoursPerDay <= 8
      && weakTopicIds.length > 0
    let plan = null
    if (hasValidPlan) {
      const planDetails = { examDate: candidatePlan.examDate, hoursPerDay, weakTopicIds }
      const savedSessions = Array.isArray(candidatePlan.sessions)
        ? candidatePlan.sessions.filter((session) => (
          typeof session?.id === 'string'
          && typeof session.date === 'string'
          && typeof session.title === 'string'
          && Number.isFinite(session.durationMinutes)
          && session.durationMinutes > 0
          && typeof session.completed === 'boolean'
        ))
        : createStudySessions(planDetails)
      plan = { ...planDetails, sessions: savedSessions }
    }

    return { scores, plan, message: emptyData.message }
  } catch {
    return {
      ...emptyData,
      message: 'Saved study data could not be read. New quiz scores and plans can still be saved in this browser.',
    }
  }
}

function getLocalDateValue(date = new Date()) {
  const localDate = new Date(date)
  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset())
  return localDate.toISOString().slice(0, 10)
}

function getDailyPlan(plan) {
  if (!plan?.examDate || !plan?.weakTopicIds?.length) return []

  const firstDay = new Date()
  firstDay.setHours(12, 0, 0, 0)
  const examDay = new Date(`${plan.examDate}T12:00:00`)
  const schedule = []
  const dayCount = Math.min(
    7,
    Math.floor((examDay.getTime() - firstDay.getTime()) / 86_400_000) + 1,
  )
  const minutes = Math.round(Number(plan.hoursPerDay) * 60)

  for (let index = 0; index < dayCount; index += 1) {
    const date = new Date(firstDay)
    date.setDate(firstDay.getDate() + index)
    const topicId = plan.weakTopicIds[index % plan.weakTopicIds.length]
    const topic = az900Topics.find((item) => item.id === topicId)
    const reviewMinutes = Math.round(minutes * 0.6)

    schedule.push({
      date,
      focus: topic?.label ?? 'Review your selected topics',
      reviewMinutes,
      practiceMinutes: minutes - reviewMinutes,
    })
  }

  return schedule
}

function createStudySessions(plan) {
  return getDailyPlan(plan).flatMap((day) => {
    const date = getLocalDateValue(day.date)
    return [
      {
        id: `${date}-review`,
        date,
        title: `Review: ${day.focus}`,
        durationMinutes: day.reviewMinutes,
        completed: false,
      },
      {
        id: `${date}-practice`,
        date,
        title: 'Practice questions and flashcards',
        durationMinutes: day.practiceMinutes,
        completed: false,
      },
    ]
  })
}

function StudyTools({ activeTab }) {
  const [initialData] = useState(getInitialStudyData)
  const [scores, setScores] = useState(initialData.scores)
  const [plannerDraft, setPlannerDraft] = useState({
    examDate: initialData.plan?.examDate ?? '',
    hoursPerDay: initialData.plan?.hoursPerDay ?? '1',
    weakTopicIds: initialData.plan?.weakTopicIds ?? [],
  })
  const [savedPlan, setSavedPlan] = useState(initialData.plan)
  const [storageMessage, setStorageMessage] = useState(initialData.message)

  const [quizTopic, setQuizTopic] = useState('all')
  const [quizStage, setQuizStage] = useState('ready')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState([])
  const [quizResult, setQuizResult] = useState(null)

  const [cardIndex, setCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [difficultCardIds, setDifficultCardIds] = useState([])
  const [showDifficultOnly, setShowDifficultOnly] = useState(false)

  function saveStudyData(nextScores, nextPlan) {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ scores: nextScores, plan: nextPlan }),
      )
      setStorageMessage('Scores and your plan are saved in this browser only.')
    } catch {
      setStorageMessage('This browser could not save study data. Your current practice can continue, but may not persist.')
    }
  }

  const questions = az900Questions.filter(
    (question) => quizTopic === 'all' || question.topicId === quizTopic,
  )
  const question = questions[questionIndex]
  const filteredCards = showDifficultOnly
    ? az900Flashcards.filter((card) => difficultCardIds.includes(card.id))
    : az900Flashcards
  const flashcard = filteredCards[cardIndex]
  const today = getLocalDateValue()
  const plannedSessions = savedPlan?.sessions ?? []
  const completedSessionCount = plannedSessions.filter((session) => session.completed).length
  const sessionProgress = plannedSessions.length
    ? Math.round((completedSessionCount / plannedSessions.length) * 100)
    : 0

  function updateSavedPlan(nextPlan) {
    setSavedPlan(nextPlan)
    saveStudyData(scores, nextPlan)
  }

  function beginQuiz() {
    setQuestionIndex(0)
    setSelectedAnswer(null)
    setSubmitted(false)
    setAnswers([])
    setQuizResult(null)
    setQuizStage('in-progress')
  }

  function finishQuiz() {
    if (selectedAnswer === null) return

    const completedAnswers = [...answers, selectedAnswer]
    const correctCount = completedAnswers.reduce(
      (count, answer, index) => count + (answer === questions[index].answerIndex ? 1 : 0),
      0,
    )
    const topicResults = {}

    questions.forEach((item, index) => {
      if (!topicResults[item.topicId]) {
        topicResults[item.topicId] = { correct: 0, total: 0 }
      }
      topicResults[item.topicId].total += 1
      if (completedAnswers[index] === item.answerIndex) {
        topicResults[item.topicId].correct += 1
      }
    })

    const nextScores = { ...scores }
    Object.entries(topicResults).forEach(([topicId, result]) => {
      const previous = nextScores[topicId] ?? { correct: 0, total: 0 }
      nextScores[topicId] = {
        correct: previous.correct + result.correct,
        total: previous.total + result.total,
      }
    })
    setScores(nextScores)
    saveStudyData(nextScores, savedPlan)
    setQuizResult({ correct: correctCount, total: questions.length })
    setQuizStage('results')
  }

  function goToNextQuestion() {
    if (questionIndex === questions.length - 1) {
      finishQuiz()
      return
    }

    setAnswers((previousAnswers) => [...previousAnswers, selectedAnswer])
    setQuestionIndex((index) => index + 1)
    setSelectedAnswer(null)
    setSubmitted(false)
  }

  function savePlanner(event) {
    event.preventDefault()
    if (!plannerDraft.weakTopicIds.length) return

    const planDetails = {
      ...plannerDraft,
      hoursPerDay: Number(plannerDraft.hoursPerDay),
    }
    const plan = { ...planDetails, sessions: createStudySessions(planDetails) }
    setSavedPlan(plan)
    setPlannerDraft(plan)
    saveStudyData(scores, plan)
  }

  function toggleSessionComplete(sessionId) {
    if (!savedPlan) return
    const sessions = plannedSessions.map((session) => (
      session.id === sessionId
        ? { ...session, completed: !session.completed }
        : session
    ))
    updateSavedPlan({ ...savedPlan, sessions })
  }

  function toggleWeakTopic(topicId) {
    setPlannerDraft((currentPlan) => {
      const isSelected = currentPlan.weakTopicIds.includes(topicId)
      return {
        ...currentPlan,
        weakTopicIds: isSelected
          ? currentPlan.weakTopicIds.filter((id) => id !== topicId)
          : [...currentPlan.weakTopicIds, topicId],
      }
    })
  }

  function goToCard(direction) {
    if (!filteredCards.length) return
    setCardIndex((currentIndex) => (
      (currentIndex + direction + filteredCards.length) % filteredCards.length
    ))
    setShowAnswer(false)
  }

  function toggleDifficultCard() {
    if (!flashcard) return
    setDifficultCardIds((currentIds) => (
      currentIds.includes(flashcard.id)
        ? currentIds.filter((id) => id !== flashcard.id)
        : [...currentIds, flashcard.id]
    ))
  }

  if (activeTab === 'quiz') {
    return (
      <section className="study-tool-panel study-tool-quiz" aria-labelledby="quiz-title">
        <div className="tool-heading">
          <div>
            <p className="eyebrow">PRACTISE & LEARN</p>
            <h2 id="quiz-title">AZ-900 practice quiz</h2>
            <p>Original practice questions with feedback after every answer.</p>
          </div>
          {quizStage === 'in-progress' && (
            <span className="quiz-counter">Question {questionIndex + 1} of {questions.length}</span>
          )}
        </div>

        {quizStage === 'ready' && (
          <div className="tool-card quiz-start-card">
            <label className="form-label" htmlFor="quiz-topic">Choose a skill area</label>
            <select id="quiz-topic" value={quizTopic} onChange={(event) => setQuizTopic(event.target.value)}>
              <option value="all">All three skill areas · 6 questions</option>
              {az900Topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.label} · {az900Questions.filter((item) => item.topicId === topic.id).length} questions
                </option>
              ))}
            </select>
            <p className="helper-copy">Take your time. Each answer includes a simple explanation and a relatable example.</p>
            <button className="study-primary-button" type="button" onClick={beginQuiz}>Start practice</button>
          </div>
        )}

        {quizStage === 'in-progress' && question && (
          <div className="tool-card quiz-question-card">
            <p className="question-topic">{az900Topics.find((topic) => topic.id === question.topicId)?.label}</p>
            <fieldset className="answer-fieldset">
              <legend>{question.question}</legend>
              <div className="answer-options">
                {question.options.map((option, index) => {
                  let stateClass = ''
                  if (submitted && index === question.answerIndex) stateClass = 'answer-correct'
                  else if (submitted && index === selectedAnswer) stateClass = 'answer-incorrect'

                  return (
                    <label className={`answer-option ${stateClass}`} key={option}>
                      <input
                        type="radio"
                        name={`answer-${question.id}`}
                        value={index}
                        checked={selectedAnswer === index}
                        disabled={submitted}
                        onChange={() => setSelectedAnswer(index)}
                      />
                      <span className="answer-option-text">{option}</span>
                      {submitted && index === question.answerIndex && <span className="answer-mark">Correct</span>}
                      {submitted && index === selectedAnswer && index !== question.answerIndex && <span className="answer-mark">Your answer</span>}
                    </label>
                  )
                })}
              </div>
            </fieldset>

            {submitted && (
              <div className={`answer-feedback ${selectedAnswer === question.answerIndex ? 'feedback-correct' : 'feedback-incorrect'}`} role="status" aria-live="polite">
                <strong>{selectedAnswer === question.answerIndex ? 'That’s right.' : 'Not quite — here’s why.'}</strong>
                <p>{selectedAnswer === question.answerIndex ? question.correctExplanation : question.incorrectExplanation}</p>
                <p className="example-copy"><strong>Everyday example:</strong> {question.example}</p>
              </div>
            )}

            <div className="quiz-actions">
              {!submitted ? (
                <button className="study-primary-button" type="button" disabled={selectedAnswer === null} onClick={() => setSubmitted(true)}>
                  Check answer
                </button>
              ) : (
                <button className="study-primary-button" type="button" onClick={goToNextQuestion}>
                  {questionIndex === questions.length - 1 ? 'Finish quiz' : 'Next question'}
                </button>
              )}
            </div>
          </div>
        )}

        {quizStage === 'results' && quizResult && (
          <div className="tool-card quiz-results-card" aria-live="polite">
            <div className="result-score">{Math.round((quizResult.correct / quizResult.total) * 100)}<span>%</span></div>
            <p className="eyebrow">PRACTICE COMPLETE</p>
            <h3>You answered {quizResult.correct} of {quizResult.total} correctly.</h3>
            <p>Your results have been added to the topic tracker. Review any explanation, then try another practice round when you’re ready.</p>
            <button className="study-primary-button" type="button" onClick={() => setQuizStage('ready')}>Try another quiz</button>
          </div>
        )}

        <p className="content-source">
          The skill-area labels follow the
          {' '}<a href={az900SkillsOutlineUrl} target="_blank" rel="noreferrer">Microsoft AZ-900 skills outline</a>.
          {' '}These are original study questions, not exam questions.
        </p>
        <p className="storage-message" role="status">{storageMessage}</p>
      </section>
    )
  }

  if (activeTab === 'readiness') {
    const totals = az900Topics.reduce((result, topic) => {
      const topicScore = scores[topic.id]
      if (topicScore && Number(topicScore.total) > 0) {
        result.correct += Number(topicScore.correct) || 0
        result.total += Number(topicScore.total) || 0
      }
      return result
    }, { correct: 0, total: 0 })
    const overallPercent = totals.total
      ? Math.round((totals.correct / totals.total) * 100)
      : null
    const weakAreas = az900Topics.filter((topic) => {
      const topicScore = scores[topic.id]
      return topicScore && topicScore.total >= 3
        && (topicScore.correct / topicScore.total) < 0.7
    })

    return (
      <section className="study-tool-panel study-tool-readiness" aria-labelledby="readiness-title">
        <div className="tool-heading">
          <div>
            <p className="eyebrow">YOUR PRACTICE HISTORY</p>
            <h2 id="readiness-title">Readiness tracker</h2>
            <p>Use practice results to see which areas may need another review.</p>
          </div>
        </div>
        <div className="tool-card readiness-summary">
          <div>
            <span className="summary-label">Practice accuracy</span>
            <strong>{overallPercent === null ? 'Not enough data yet' : `${overallPercent}%`}</strong>
            <span className="helper-copy">{totals.total} question{totals.total === 1 ? '' : 's'} answered across completed quizzes</span>
          </div>
          <div className="readiness-note">
            <strong>Readiness is only an estimate.</strong>
            <p>This small practice set cannot predict an exam result. Use it as a study guide, not a pass guarantee.</p>
          </div>
        </div>
        <div className="readiness-topic-list">
          {az900Topics.map((topic) => {
            const topicScore = scores[topic.id]
            const total = Number(topicScore?.total) || 0
            const correct = Number(topicScore?.correct) || 0
            const percent = total ? Math.round((correct / total) * 100) : 0
            const hasEnoughPractice = total >= 3
            const status = !total
              ? 'Not practised yet'
              : !hasEnoughPractice
                ? 'Practice more to estimate'
                : percent < 70
                  ? 'Needs another review'
                  : percent >= 85
                    ? 'On track'
                    : 'Building confidence'

            return (
              <article className="tool-card readiness-topic" key={topic.id}>
                <div className="readiness-topic-heading">
                  <div><h3>{topic.label}</h3><p>{total ? `${correct} correct out of ${total}` : 'Complete a quiz in this area to record a score.'}</p></div>
                  <span className={`readiness-status ${hasEnoughPractice && percent < 70 ? 'status-review' : ''}`}>{status}</span>
                </div>
                <div
                  className="study-progress-track"
                  role="progressbar"
                  aria-label={`${topic.label} practice accuracy`}
                  aria-valuenow={percent}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <span style={{ width: `${percent}%` }} />
                </div>
                <span className="topic-percent">{total ? `${percent}% practice accuracy` : 'No score yet'}</span>
              </article>
            )
          })}
        </div>
        <div className="weak-area-note">
          <strong>Areas to revisit:</strong>
          <span>{weakAreas.length ? weakAreas.map((topic) => topic.label).join(', ') : 'No confirmed weak area yet. Complete at least 3 questions in a topic before it is flagged.'}</span>
        </div>
        <p className="storage-message" role="status">{storageMessage}</p>
      </section>
    )
  }

  if (activeTab === 'planner') {
    return (
      <section className="study-tool-panel study-tool-planner" aria-labelledby="planner-title">
        <div className="tool-heading">
          <div>
            <p className="eyebrow">MAKE A REALISTIC ROUTINE</p>
            <h2 id="planner-title">Personal study planner</h2>
            <p>Set an exam date and daily study time to create a simple plan for the week ahead.</p>
          </div>
        </div>
        <form className="tool-card planner-form" onSubmit={savePlanner}>
          <div className="planner-input-grid">
            <label className="form-label" htmlFor="exam-date">
              Exam date
              <input
                id="exam-date"
                type="date"
                min={today}
                required
                value={plannerDraft.examDate}
                onChange={(event) => setPlannerDraft({ ...plannerDraft, examDate: event.target.value })}
              />
            </label>
            <label className="form-label" htmlFor="study-hours">
              Available study hours per day
              <input
                id="study-hours"
                type="number"
                min="0.5"
                max="8"
                step="0.5"
                required
                value={plannerDraft.hoursPerDay}
                onChange={(event) => setPlannerDraft({ ...plannerDraft, hoursPerDay: event.target.value })}
              />
            </label>
          </div>

          <fieldset className="topic-picker">
            <legend>Choose topics you want to strengthen</legend>
            <div className="topic-checkboxes">
              {az900Topics.map((topic) => (
                <label className="topic-checkbox" key={topic.id}>
                  <input
                    type="checkbox"
                    checked={plannerDraft.weakTopicIds.includes(topic.id)}
                    onChange={() => toggleWeakTopic(topic.id)}
                  />
                  <span>{topic.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {plannerDraft.weakTopicIds.length === 0 && (
            <p className="form-hint">Select at least one topic so the schedule knows what to focus on.</p>
          )}
          <button className="study-primary-button" type="submit" disabled={!plannerDraft.weakTopicIds.length}>Generate my schedule</button>
        </form>

        {savedPlan && (
          <div className="planner-results">
            <div className="planner-results-heading">
              <div><p className="eyebrow">YOUR NEXT 7 DAYS</p><h3>Daily study schedule</h3></div>
              <span>{completedSessionCount} of {plannedSessions.length} sessions complete</span>
            </div>
            <p className="helper-copy">Your plan runs through {new Date(`${savedPlan.examDate}T12:00:00`).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}. This preview shows up to the next seven days.</p>
            <div
              className="session-progress-track"
              role="progressbar"
              aria-label="Study sessions completed"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={sessionProgress}
            >
              <span style={{ width: `${sessionProgress}%` }} />
            </div>
            {plannedSessions.length ? (
              <div className="daily-schedule">
                {[...plannedSessions]
                  .sort((first, second) => first.date.localeCompare(second.date))
                  .map((session) => (
                    <article className={`tool-card study-session${session.completed ? ' session-completed' : ''}`} key={session.id}>
                      <label className="session-complete">
                        <input
                          type="checkbox"
                          checked={session.completed}
                          onChange={() => toggleSessionComplete(session.id)}
                          aria-label={`Mark ${session.title} as ${session.completed ? 'incomplete' : 'complete'}`}
                        />
                      </label>
                      <div className="session-details">
                        <strong>{session.title}</strong>
                        <span>{new Date(`${session.date}T12:00:00`).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })} · {session.durationMinutes} min</span>
                      </div>
                    </article>
                  ))}
              </div>
            ) : (
              <p className="session-empty-state">There are no study sessions in this schedule. Generate a new schedule to create sessions.</p>
            )}
          </div>
        )}
        <p className="storage-message" role="status">{storageMessage}</p>
      </section>
    )
  }

  if (activeTab === 'flashcards') {
    return (
      <section className="study-tool-panel study-tool-flashcards" aria-labelledby="flashcards-title">
        <div className="tool-heading">
          <div>
            <p className="eyebrow">RECALL & REVIEW</p>
            <h2 id="flashcards-title">Azure revision flashcards</h2>
            <p>Tap a card or press Enter or Space to turn it over and reveal the answer.</p>
          </div>
        </div>
        <div className="flashcard-controls">
          <div className="flashcard-progress">
            <span>{filteredCards.length ? `Card ${cardIndex + 1} of ${filteredCards.length}` : 'No difficult cards marked yet'}</span>
            {filteredCards.length > 0 && (
              <div
                className="flashcard-progress-track"
                role="progressbar"
                aria-label="Flashcard position"
                aria-valuenow={cardIndex + 1}
                aria-valuemin="1"
                aria-valuemax={filteredCards.length}
              >
                <span style={{ width: `${((cardIndex + 1) / filteredCards.length) * 100}%` }} />
              </div>
            )}
          </div>
          <label className="difficult-filter">
            <input
              type="checkbox"
              checked={showDifficultOnly}
              onChange={(event) => {
                setShowDifficultOnly(event.target.checked)
                setCardIndex(0)
                setShowAnswer(false)
              }}
            />
            Practise difficult cards only ({difficultCardIds.length})
          </label>
        </div>

        {flashcard ? (
          <article className={`tool-card flashcard flashcard-accent-${cardIndex % 6} ${showAnswer ? 'flashcard-revealed' : ''}`}>
            <button
              className="flashcard-flip-button"
              type="button"
              aria-label={`${showAnswer ? 'Show question' : 'Reveal answer'} for ${flashcard.term}`}
              aria-pressed={showAnswer}
              onClick={() => setShowAnswer((isShowingAnswer) => !isShowingAnswer)}
            >
              <span className="flashcard-inner">
                <span className="flashcard-face flashcard-front" aria-hidden={showAnswer}>
                  <span className="flashcard-label">TRY TO REMEMBER</span>
                  <span className="flashcard-term" role="heading" aria-level="3">What does “{flashcard.term}” mean?</span>
                  <span className="flashcard-tap-hint">Tap to reveal answer <span aria-hidden="true">↻</span></span>
                </span>
                <span className="flashcard-face flashcard-back" aria-hidden={!showAnswer}>
                  <span className="flashcard-label">CONCEPT</span>
                  <span className="flashcard-term" role="heading" aria-level="3">{flashcard.term}</span>
                  <span className="flashcard-definition">{flashcard.definition}</span>
                  <span className="flashcard-example"><strong>Everyday example:</strong> {flashcard.example}</span>
                  <span className="flashcard-tap-hint">Tap to see the question <span aria-hidden="true">↻</span></span>
                </span>
              </span>
            </button>
            <div className="flashcard-actions">
              <button className="study-secondary-button" type="button" onClick={toggleDifficultCard}>
                {difficultCardIds.includes(flashcard.id) ? 'Marked for more practice' : 'Mark as difficult'}
              </button>
              <div>
                <button className="study-secondary-button" type="button" onClick={() => goToCard(-1)} aria-label="Previous flashcard">Previous</button>
                <button className="study-primary-button" type="button" onClick={() => goToCard(1)}>Next card</button>
              </div>
            </div>
          </article>
        ) : (
          <div className="tool-card no-cards-message">
            <h3>No difficult cards yet</h3>
            <p>Turn off the difficult-only filter or mark a card while reviewing.</p>
          </div>
        )}
        <p className="storage-message" role="status">{storageMessage}</p>
      </section>
    )
  }

  return null
}

export default StudyTools
