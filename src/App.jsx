import { useState } from 'react'
import StudyTools from './Az900Study.jsx'
import './App.css'

const dateLabel = new Date().toLocaleDateString('en', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

const navigation = [
  { label: 'Dashboard', icon: 'dashboard', target: 'dashboard' },
  { label: 'Learning Paths', icon: 'paths', target: 'learning-paths' },
  { label: 'Study Planner', icon: 'planner', target: 'study-planner' },
  { label: 'Assessments', icon: 'assessment', target: 'assessments' },
  { label: 'Progress', icon: 'progress', target: 'progress' },
]

const studyTabs = [
  { id: 'overview', label: 'Learning path' },
  { id: 'quiz', label: 'Practice quiz' },
  { id: 'readiness', label: 'Readiness' },
  { id: 'planner', label: 'Study planner' },
  { id: 'flashcards', label: 'Flashcards' },
]

const subjects = [
  { name: 'Mathematics', detail: 'Algebra · 4 topics', progress: 68, color: 'blue', icon: '∑' },
  { name: 'Physical Sciences', detail: 'Forces & motion · 3 topics', progress: 42, color: 'orange', icon: '⚛' },
  { name: 'History', detail: 'Modern history · 5 topics', progress: 81, color: 'purple', icon: '⌛' },
  { name: 'English', detail: 'Writing skills · 4 topics', progress: 56, color: 'green', icon: 'Aa' },
]

const sessions = [
  { time: '09:00', period: 'AM', subject: 'Mathematics', task: 'Quadratic equations', color: 'blue', duration: '45 min' },
  { time: '11:30', period: 'AM', subject: 'AZ-900', task: 'Cloud concepts', color: 'purple', duration: '30 min' },
  { time: '02:00', period: 'PM', subject: 'Physical Sciences', task: 'Newton’s laws', color: 'orange', duration: '40 min' },
]

function Icon({ name }) {
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    paths: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z" /><path d="M4 5.5v13A2.5 2.5 0 0 1 6.5 16H20M8 7h8M8 10h7" /></>,
    planner: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18M8 14h3M8 17h6" /></>,
    assessment: <><path d="M8 4h-3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3" /><rect x="8" y="2" width="8" height="4" rx="1" /><path d="m8 13 2 2 5-5" /></>,
    progress: <><path d="M3 3v18h18" /><path d="m7 14 4-4 4 3 6-7" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z" /><path d="M4 5.5v13A2.5 2.5 0 0 1 6.5 16H20" /></>,
  }

  return (
    <svg aria-hidden="true" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}

function ProgressBar({ value, color = 'blue' }) {
  return (
    <div
      className={`progress-track progress-${color}`}
      role="progressbar"
      aria-label="Study progress"
      aria-valuenow={value}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <span style={{ width: `${value}%` }} />
    </div>
  )
}

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <a className="brand" href="#dashboard" onClick={(event) => onNavigate(event, 'dashboard')}>
        <span className="brand-mark"><span /></span>
        <span>study<span className="brand-accent">path</span></span>
      </a>

      <p className="nav-label">MENU</p>
      <nav className="side-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <a
            key={item.label}
            href={`#${item.target}`}
            className={`nav-item ${activePage === item.label ? 'active' : ''}`}
            onClick={(event) => onNavigate(event, item.target)}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
            {item.label === 'Assessments' && <span className="nav-count">2</span>}
          </a>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="streak-card">
          <span className="streak-icon" aria-hidden="true">✦</span>
          <div><strong>7 day streak</strong><span>You’re on a roll!</span></div>
        </div>
        <div className="profile">
          <div className="avatar">JS</div>
          <div className="profile-copy"><strong>Jordan Smith</strong><span>Year 10 student</span></div>
          <span className="profile-menu" aria-hidden="true">···</span>
        </div>
      </div>
    </aside>
  )
}

function Dashboard({ onOpenPath, onNavigate }) {
  return (
    <main className="main-content" id="dashboard">
      <header className="topbar">
        <div className="breadcrumb">My workspace <span>/</span> <strong>Dashboard</strong></div>
        <button className="icon-button notification-button" type="button" aria-label="Notifications">
          <span className="notification-dot" />
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
        </button>
      </header>

      <div className="page-content">
        <section className="welcome-row">
          <div>
            <p className="eyebrow">{dateLabel}</p>
            <h1>Good morning, Jordan <span aria-hidden="true">☀️</span></h1>
            <p className="welcome-copy">A little progress each day adds up to big results.</p>
          </div>
          <div className="goal-card">
            <div className="goal-icon"><Icon name="check" /></div>
            <div className="goal-text"><span>Today’s study goal</span><strong>1h 15m <small>of 2 hours</small></strong></div>
            <div className="goal-ring" aria-label="62 percent of today's goal complete"><span>62%</span></div>
          </div>
        </section>

        <section className="featured-path" id="learning-paths">
          <div className="featured-copy">
            <span className="featured-tag"><span /> FEATURED LEARNING PATH</span>
            <h2>Build your future<br />in the cloud.</h2>
            <p>Start with the fundamentals and explore how Microsoft Azure can power ideas into reality.</p>
            <div className="path-meta"><span><Icon name="book" /> 6 modules</span><span><Icon name="clock" /> 4–6 hours</span><span className="level-tag">Beginner</span></div>
            <button type="button" className="primary-button" onClick={onOpenPath}>Explore AZ-900 <Icon name="arrow" /></button>
          </div>
          <div className="cloud-illustration" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="cloud-shape"><span className="cloud-core">A</span></div>
            <span className="spark spark-one">✦</span><span className="spark spark-two">✧</span><span className="spark spark-three">·</span>
            <span className="cloud-caption">MICROSOFT AZURE</span>
          </div>
          <span className="featured-code">AZ-900</span>
        </section>

        <section className="section-block" id="progress">
          <div className="section-heading">
            <div><p className="eyebrow">YOUR LEARNING</p><h2>Subject progress</h2></div>
            <a className="text-link" href="#progress" onClick={(event) => onNavigate(event, 'progress')}>View all <Icon name="arrow" /></a>
          </div>
          <div className="subject-grid">
            {subjects.map((subject) => (
              <article className="subject-card" key={subject.name}>
                <div className={`subject-icon ${subject.color}`}>{subject.icon}</div>
                <div className="subject-title-row"><h3>{subject.name}</h3><span>{subject.progress}%</span></div>
                <p>{subject.detail}</p>
                <ProgressBar value={subject.progress} color={subject.color} />
              </article>
            ))}
          </div>
        </section>

        <section className="lower-grid">
          <div className="panel sessions-panel" id="study-planner">
            <div className="section-heading compact-heading">
              <div><p className="eyebrow">YOUR PLAN</p><h2>Upcoming sessions</h2></div>
              <a className="text-link" href="#study-planner" onClick={(event) => onNavigate(event, 'study-planner')}>See planner <Icon name="arrow" /></a>
            </div>
            <div className="session-list">
              {sessions.map((session) => (
                <article className="session-row" key={session.subject}>
                  <div className="session-time"><strong>{session.time}</strong><span>{session.period}</span></div>
                  <span className={`session-marker ${session.color}`} />
                  <div className="session-details"><strong>{session.subject}</strong><span>{session.task}</span></div>
                  <span className="session-duration"><Icon name="clock" /> {session.duration}</span>
                </article>
              ))}
            </div>
            <button type="button" className="outline-button" onClick={(event) => onNavigate(event, 'study-planner')}>Open study planner <Icon name="arrow" /></button>
          </div>

          <div className="panel assessment-panel" id="assessments">
            <div className="section-heading compact-heading">
              <div><p className="eyebrow">COMING UP</p><h2>Assessments</h2></div>
              <span className="assessment-badge">2 soon</span>
            </div>
            <article className="assessment-item">
              <div className="assessment-date"><strong>24</strong><span>OCT</span></div>
              <div><span className="assessment-subject">MATHEMATICS</span><h3>Algebra checkpoint</h3><p>Friday · 10:00 AM</p></div>
            </article>
            <article className="assessment-item">
              <div className="assessment-date soft"><strong>28</strong><span>OCT</span></div>
              <div><span className="assessment-subject">PHYSICAL SCIENCES</span><h3>Forces & motion quiz</h3><p>Tuesday · 1:30 PM</p></div>
            </article>
            <a className="text-link assessment-link" href="#assessments" onClick={(event) => onNavigate(event, 'assessments')}>View assessments <Icon name="arrow" /></a>
          </div>
        </section>
        <footer className="dashboard-footer">
          <span>Unofficial AZ-900 study aid. Not affiliated with or endorsed by Microsoft.</span>
          <span>Sample data · Keep showing up ✦</span>
        </footer>
      </div>
    </main>
  )
}

function LearningPath({ onBack, activeTab, onTabChange }) {
  const modules = [
    { title: 'Describe cloud concepts', detail: 'Cloud computing, shared responsibility, and cloud models', duration: '45 min', complete: true },
    { title: 'Describe Azure architecture and services', detail: 'Core architecture, compute, networking, and storage', duration: '1 hr 30 min', complete: false },
    { title: 'Describe Azure management and governance', detail: 'Tools, monitoring, security, and governance', duration: '1 hr 15 min', complete: false },
  ]

  return (
    <main className="main-content path-page" id="learning-paths">
      <header className="topbar">
        <div className="breadcrumb">My workspace <span>/</span> <a href="#dashboard" onClick={onBack}>Dashboard</a> <span>/</span> <strong>AZ-900</strong></div>
      </header>
      <div className="path-content">
        <button className="back-link" type="button" onClick={onBack}>← Back to dashboard</button>
        <div className="path-hero">
          <span className="featured-tag"><span /> MICROSOFT AZURE FUNDAMENTALS</span>
          <h1>AZ-900: Azure Fundamentals</h1>
          <p>Build a foundational understanding of cloud concepts, Azure services, and the tools that help organizations work in the cloud.</p>
          <div className="path-meta"><span><Icon name="book" /> 6 modules</span><span><Icon name="clock" /> 4–6 hours</span><span className="level-tag">Beginner</span></div>
          <div className="path-completion"><div><span>YOUR PROGRESS</span><strong>1 of 6 modules complete</strong></div><span>17%</span><ProgressBar value={17} color="purple" /></div>
        </div>
        <nav className="study-tabs" aria-label="AZ-900 study tools">
          {studyTabs.map((tab) => (
            <button
              className={`study-tab ${activeTab === tab.id ? 'selected' : ''}`}
              type="button"
              key={tab.id}
              aria-current={activeTab === tab.id ? 'page' : undefined}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        {activeTab === 'overview' ? (
          <>
            <div className="module-heading"><div><p className="eyebrow">YOUR CURRICULUM</p><h2>Learning modules</h2></div><span>6 modules · Sample path</span></div>
            <div className="module-list">
              {modules.map((module, index) => (
                <article className="module-card" key={module.title}>
                  <div className={`module-number ${module.complete ? 'complete' : ''}`}>{module.complete ? <Icon name="check" /> : `0${index + 1}`}</div>
                  <div className="module-copy"><span>MODULE {index + 1}</span><h3>{module.title}</h3><p>{module.detail}</p></div>
                  <span className="module-duration"><Icon name="clock" /> {module.duration}</span>
                  <span className={`module-status ${module.complete ? 'done' : ''}`}>{module.complete ? 'Complete' : 'Not started'}</span>
                </article>
              ))}
            </div>
            <p className="sample-note">This is a sample learning path for your StudyPath dashboard.</p>
          </>
        ) : (
          <StudyTools activeTab={activeTab} />
        )}
        <p className="study-disclaimer">Unofficial AZ-900 study aid. Not affiliated with or endorsed by Microsoft.</p>
      </div>
    </main>
  )
}

function App() {
  const [showLearningPath, setShowLearningPath] = useState(false)
  const [activePage, setActivePage] = useState('Dashboard')
  const [studyTab, setStudyTab] = useState('overview')

  function navigateTo(event, target) {
    event.preventDefault()
    const item = navigation.find((link) => link.target === target)
    setActivePage(item ? item.label : 'Dashboard')
    if (target === 'dashboard') {
      setShowLearningPath(false)
    } else {
      const tabByTarget = {
        'learning-paths': 'overview',
        'study-planner': 'planner',
        assessments: 'quiz',
        progress: 'readiness',
      }
      setStudyTab(tabByTarget[target] ?? 'overview')
      setShowLearningPath(true)
    }
    window.setTimeout(() => {
      if (target === 'dashboard') {
        document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 0)
  }

  function openLearningPath() {
    setActivePage('Learning Paths')
    setStudyTab('overview')
    setShowLearningPath(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function backToDashboard(event) {
    if (event) event.preventDefault()
    setActivePage('Dashboard')
    setShowLearningPath(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={navigateTo} />
      {showLearningPath
        ? <LearningPath onBack={backToDashboard} activeTab={studyTab} onTabChange={setStudyTab} />
        : <Dashboard onOpenPath={openLearningPath} onNavigate={navigateTo} />}
    </div>
  )
}

export default App
