import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ROLES } from '../../data/mockData';
import { AntigravityCanvas } from '../common/AntigravityCanvas';
import { parseResumeText, evaluateResumeAgainstJob } from '../../utils/resumeParser';
import {
  Cpu,
  Shield,
  Lock,
  Users,
  Layers,
  Compass,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Zap,
  X,
  UploadCloud,
  BadgeCheck,
  Sun,
  Moon,
  FileText,
  Sliders,
} from 'lucide-react';

export function LandingPage({ onOpenInvite }) {
  const { login, loginAsDemoPersona, signupWorkspaceAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [authMode, setAuthMode] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sign In Form States
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Manual Invite Token Form
  const [manualToken, setManualToken] = useState('');

  // Admin Workspace Signup Form
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [adminFullName, setAdminFullName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Target Job Requisition Selector for Simulator
  const [simTargetJobId, setSimTargetJobId] = useState('REQ-FRONTEND-01');

  // Interactive Live Hero Playground State
  const [aiMode, setAiMode] = useState('pro');
  const [shortlistThreshold, setShortlistThreshold] = useState(80);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(4);
  const [uploadedCandidateData, setUploadedCandidateData] = useState(null);
  const [activeCandidateKey, setActiveCandidateKey] = useState('gina'); // 'gina', 'priya', 'marcus', 'elena', 'custom'

  // Interactive Rubric Weighting Calibrator State
  const [rubricCriteria, setRubricCriteria] = useState({
    architecture: true,
    stateManagement: true,
    testingQuality: true,
    distributedSystems: false,
  });

  // Active Persona Explorer State
  const [activePersonaRole, setActivePersonaRole] = useState(ROLES.HIRING_MANAGER);

  // Candidate Pool including real Gina Jones resume data
  const CANDIDATES_DICT = {
    gina: {
      key: 'gina',
      name: 'Gina Jones',
      role: 'React Developer / Frontend Specialist',
      exp: '9+ Years Experience (Airbnb, Netflix, Adobe)',
      location: 'San Francisco, CA',
      fileType: 'Plain Text Resume (.TXT)',
      skills: ['React', 'React Router', 'Redux', 'Apollo Client', 'GraphQL', 'NestJS', 'Chakra UI', 'Enzyme', 'ESLint', 'JavaScript'],
      getEvaluation: (jobId) => {
        if (jobId === 'REQ-FRONTEND-01') {
          return {
            score: 98,
            targetTitle: 'Senior Frontend & Product Engineer',
            matched: ['React & React Router', 'Redux State Management', 'Apollo Client & GraphQL', 'NestJS Server APIs', 'Chakra UI', 'Enzyme Unit Testing', 'ESLint Quality'],
            missing: [],
            reasoning: '9+ years high-impact experience at Airbnb and Netflix. Achieved 53% API latency reduction with Apollo Client and 52% test coverage increase. Exceptional hire recommendation.',
          };
        } else {
          return {
            score: 48,
            targetTitle: 'Lead Distributed Systems Architect',
            matched: ['NestJS Backend', 'Database Optimization', 'Code Quality & Testing'],
            missing: ['Distributed Systems Core', 'Golang Architecture', 'Kubernetes Core', 'eBPF Kernel Telemetry', 'Kafka Streams'],
            reasoning: 'Exemplary frontend & fullstack background. Deficits in low-level distributed systems and kernel tracing present high ramp-up curve for this infrastructure role.',
          };
        }
      },
    },
    priya: {
      key: 'priya',
      name: 'Priya Sharma',
      role: 'Lead Distributed Systems Architect',
      exp: '12 Years Experience (Google, AWS)',
      location: 'San Francisco, CA',
      fileType: 'PDF Document',
      skills: ['Distributed Systems', 'Golang Architecture', 'eBPF Kernel', 'Kubernetes Core', 'High Concurrency', 'Kafka'],
      getEvaluation: (jobId) => {
        if (jobId === 'REQ-DISTRIBUTED-01') {
          return {
            score: 98,
            targetTitle: 'Lead Distributed Systems Architect',
            matched: ['Distributed Systems', 'Golang Architecture', 'eBPF Kernel', 'Kubernetes Core', 'High Concurrency', 'Kafka'],
            missing: [],
            reasoning: 'Authored multi-region event streaming framework handling 5M req/sec. Exceptional match for core infrastructure requisition.',
          };
        } else {
          return {
            score: 72,
            targetTitle: 'Senior Frontend & Product Engineer',
            matched: ['High Concurrency', 'Full-stack Systems', 'Architecture'],
            missing: ['React Component Design', 'Redux / State', 'Chakra UI / CSS', 'GraphQL / Apollo'],
            reasoning: 'Deep distributed backend experience. Has not actively shipped user-facing React applications recently.',
          };
        }
      },
    },
    marcus: {
      key: 'marcus',
      name: 'Marcus Chen',
      role: 'Senior Full-Stack Product Engineer',
      exp: '8 Years Experience (Stripe, Uber)',
      location: 'Seattle, WA',
      fileType: 'Word DOCX',
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL APIs'],
      getEvaluation: (jobId) => ({
        score: jobId === 'REQ-FRONTEND-01' ? 88 : 62,
        targetTitle: jobId === 'REQ-FRONTEND-01' ? 'Senior Frontend & Product Engineer' : 'Lead Distributed Systems Architect',
        matched: jobId === 'REQ-FRONTEND-01' ? ['React & TypeScript', 'GraphQL APIs', 'Node.js Microservices', 'PostgreSQL'] : ['Node.js Backend', 'PostgreSQL'],
        missing: jobId === 'REQ-FRONTEND-01' ? ['Enzyme / Testing Depth'] : ['Distributed Systems Core', 'Golang Architecture', 'eBPF Kernel'],
        reasoning: 'Strong full-stack velocity. Solid React foundation with microservices experience.',
      }),
    },
    elena: {
      key: 'elena',
      name: 'Elena Rostova',
      role: 'Platform Operations Engineer',
      exp: '3 Years Experience',
      location: 'Austin, TX',
      fileType: 'Plain Text Resume',
      skills: ['Docker', 'Linux Administration', 'GitOps & CI/CD'],
      getEvaluation: (jobId) => ({
        score: 62,
        targetTitle: jobId === 'REQ-FRONTEND-01' ? 'Senior Frontend & Product Engineer' : 'Lead Distributed Systems Architect',
        matched: ['Linux Administration', 'Docker Containerization', 'GitOps'],
        missing: jobId === 'REQ-FRONTEND-01' ? ['React', 'GraphQL', 'Redux', 'Frontend Architecture'] : ['Golang Architecture', 'eBPF Kernel', 'Distributed Systems'],
        reasoning: 'Solid foundational junior engineer. Lacks specialized depth required for senior requisition.',
      }),
    },
  };

  // Resolve current active candidate
  let activeCandidate = null;
  if (activeCandidateKey === 'custom' && uploadedCandidateData) {
    const customEval = evaluateResumeAgainstJob(uploadedCandidateData, simTargetJobId);
    activeCandidate = {
      key: 'custom',
      name: uploadedCandidateData.name,
      role: uploadedCandidateData.title || 'Applicant',
      exp: uploadedCandidateData.experienceLabel,
      location: uploadedCandidateData.location,
      fileType: uploadedCandidateData.fileName,
      skills: uploadedCandidateData.skills,
      evaluation: {
        score: customEval.score,
        targetTitle: customEval.targetJobTitle,
        matched: customEval.matchedSkills,
        missing: customEval.missingSkills,
        reasoning: customEval.reasoning,
      },
    };
  } else {
    const cand = CANDIDATES_DICT[activeCandidateKey] || CANDIDATES_DICT.gina;
    activeCandidate = {
      ...cand,
      evaluation: cand.getEvaluation(simTargetJobId),
    };
  }

  // Calculate dynamic candidate match score based on active rubric criteria weighting
  let dynamicDelta = 0;
  if (!rubricCriteria.architecture) dynamicDelta -= 22;
  if (!rubricCriteria.stateManagement) dynamicDelta -= 16;
  if (!rubricCriteria.testingQuality) dynamicDelta -= 14;
  if (rubricCriteria.distributedSystems) {
    if (activeCandidateKey === 'gina' || activeCandidateKey === 'priya') {
      dynamicDelta -= 26; // Missing distributed systems requirement
    } else {
      dynamicDelta += 10;
    }
  }

  const baseScore = activeCandidate.evaluation.score;
  const computedScore = Math.max(30, Math.min(99, baseScore + dynamicDelta));
  const isShortlisted = computedScore >= shortlistThreshold;

  // Simulate scanning trigger when candidate or mode changes
  const triggerScanAnimation = (candKey, mode = aiMode, newJobId = simTargetJobId) => {
    setActiveCandidateKey(candKey);
    setSimTargetJobId(newJobId);
    setIsScanning(true);
    setScanStep(1);

    const stepInterval = mode === 'flash' ? 160 : 300;
    setTimeout(() => setScanStep(2), stepInterval);
    setTimeout(() => setScanStep(3), stepInterval * 2);
    setTimeout(() => {
      setScanStep(4);
      setIsScanning(false);
    }, stepInterval * 3);
  };

  // Real File Upload Handler (reads actual text!)
  const handleRealFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = parseResumeText(text, file.name);

      if (parsed) {
        setUploadedCandidateData(parsed);
        // If file contains "React" or "Frontend", default target to Frontend
        const isFrontendResume = /react|frontend|javascript|css/i.test(text);
        const autoJobId = isFrontendResume ? 'REQ-FRONTEND-01' : 'REQ-DISTRIBUTED-01';
        triggerScanAnimation('custom', aiMode, autoJobId);
      }
    } catch (err) {
      console.error('Failed to parse uploaded resume file:', err);
    }
  };

  // Sign In Submission
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!signInEmail) {
      setFormError('Please enter your work email.');
      return;
    }
    setIsSubmitting(true);
    const result = await login({ email: signInEmail, password: signInPassword });
    setIsSubmitting(false);
    if (!result || !result.success) {
      setFormError(result?.error || 'Login failed. Check your email or use one of the 1-click test credentials.');
    }
  };

  // Admin Workspace Signup
  const handleAdminSignUpSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!companyName.trim()) { setFormError('Company Legal Name is required.'); return; }
    if (!companyAddress.trim()) { setFormError('Company Headquarters Address is required.'); return; }
    if (!gstin.trim()) { setFormError('GSTIN / Tax ID is required.'); return; }
    if (!companyPhone.trim()) { setFormError('Company Phone Number is required.'); return; }
    if (!adminFullName.trim()) { setFormError('Admin Full Legal Name is required.'); return; }
    if (!adminEmail.trim() || !adminEmail.includes('@')) { setFormError('A valid corporate work email is required.'); return; }
    if (!adminPassword || adminPassword.length < 8) { setFormError('Master password must be at least 8 characters.'); return; }
    if (adminPassword !== adminConfirmPassword) { setFormError('Passwords do not match.'); return; }

    setIsSubmitting(true);
    const result = await signupWorkspaceAdmin({
      companyName: companyName.trim(),
      companyAddress: companyAddress.trim(),
      gstin: gstin.trim(),
      companyPhone: companyPhone.trim(),
      adminFullName: adminFullName.trim(),
      adminEmail: adminEmail.trim(),
      adminPassword,
    });
    setIsSubmitting(false);

    if (!result || !result.success) {
      setFormError(result?.error || 'Failed to create workspace in database.');
    }
  };

  const handleRedeemManualToken = (e) => {
    e.preventDefault();
    if (!manualToken.trim()) {
      setFormError('Please enter an invitation token.');
      return;
    }
    if (onOpenInvite) {
      onOpenInvite(manualToken.trim());
    } else {
      window.location.href = `/?token=${encodeURIComponent(manualToken.trim())}`;
    }
  };

  const openAuthModal = (mode = 'signin') => {
    setAuthMode(mode);
    setFormError('');
    setIsModalOpen(true);
  };

  // Persona Details
  const PERSONAS = [
    {
      role: ROLES.HIRING_MANAGER,
      title: 'Hiring Manager',
      shortTitle: 'HM Review',
      badge: 'Technical Lead',
      icon: Layers,
      headline: 'Explainable AI Scorecards with Zero Guesswork',
      summary: 'Review candidate dossiers, inspect transparent green matched vs red missing skill breakdowns, and submit debrief notes directly into the hiring ledger.',
      mockHighlights: [
        { label: 'Green/Red Skill Breakdown', desc: 'Instant visual audit of candidate requirements vs job requisition' },
        { label: 'Interactive Interview Rubric', desc: 'Structured pass/fail checkpoints for domain competency' },
        { label: 'Verbatim Debrief Log', desc: 'Decisions synced immutably to HR offer generation' },
      ],
    },
    {
      role: ROLES.TALENT_ACQUISITION,
      title: 'Talent Acquisition',
      shortTitle: 'Pipeline Lead',
      badge: 'Sourcing Lead',
      icon: Users,
      headline: 'Bulk Resume Ingestion & Pipeline Velocity',
      summary: 'Drag and drop 100+ resumes in PDF, Word, or plain text. Real-time OCR extracts candidate skills in milliseconds without bias.',
      mockHighlights: [
        { label: 'Omni-Format Parsing', desc: 'Seamlessly processes PDF, DOCX, TXT, and structured JSON' },
        { label: 'Velocity Kanban Funnel', desc: 'Real-time candidate tracking across Sourcing, Screening, and Offer' },
        { label: 'EEOC Bias Scrubbing', desc: 'Removes demographic markers before technical evaluation' },
      ],
    },
    {
      role: ROLES.SYSTEM_ADMIN,
      title: 'System Administrator',
      shortTitle: 'Root Admin',
      badge: 'Governance',
      icon: Shield,
      headline: 'Hardware AES-256 BYOK & Role Access Isolation',
      summary: 'Manage corporate workspaces, issue 48-hour cryptographic invite links, and secure enterprise OpenAI/Gemini inference keys.',
      mockHighlights: [
        { label: 'BYOK Hardware Enclave', desc: 'Tenant keys encrypted with AES-256 in MySQL; zero model retraining' },
        { label: 'Cryptographic Invitations', desc: '48-hour role-locked tokens for team onboarding' },
        { label: 'Immutable Audit Trail', desc: 'Every query, key rotation, and role assignment logged' },
      ],
    },
    {
      role: ROLES.HR_REPRESENTATIVE,
      title: 'HR Representative',
      shortTitle: 'Compliance',
      badge: 'Statutory Lead',
      icon: Compass,
      headline: 'Executive Compensation & CA SB 1162 Pay Parity',
      summary: 'Authorize finalized offer packages, audit equity dilution pools, and verify statutory pay-parity compliance sliders before letter dispatch.',
      mockHighlights: [
        { label: 'Compensation Breakdown', desc: 'Itemized base salary, equity RSUs, and sign-on incentives' },
        { label: 'Pay Parity Verification', desc: 'Automatic compliance check against department wage bands' },
        { label: 'Legal Handoff Sealing', desc: 'Cryptographically sealed handoff package for payroll' },
      ],
    },
    {
      role: ROLES.ENGAGEMENT_SPECIALIST,
      title: 'Engagement Specialist',
      shortTitle: 'Onboarding',
      badge: 'People Ops',
      icon: Mail,
      headline: 'Candidate Engagement & Automated Sequences',
      summary: 'Nurture accepted hires with personalized 3-day onboarding touchpoints, hardware requisition checklists, and welcoming messaging cadences.',
      mockHighlights: [
        { label: 'Automated Email Cadences', desc: 'Day 1 welcome, team introductions, and paperwork reminders' },
        { label: 'Pre-boarding Checkpoints', desc: 'Track I-9 verification, hardware shipping, and portal setup' },
        { label: 'Candidate Sentiment Pulse', desc: 'Ensure zero offer reneges before start date' },
      ],
    },
  ];

  const activePersona = PERSONAS.find((p) => p.role === activePersonaRole) || PERSONAS[0];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors relative overflow-hidden ${
      isDark
        ? 'bg-[#0A0D14] text-slate-100 selection:bg-blue-600 selection:text-white'
        : 'bg-[#F8FAFC] text-slate-900 selection:bg-sky-400 selection:text-white'
    }`}>
      {/* 1. Antigravity Physics Interactive Background Canvas */}
      <div className={`fixed inset-0 pointer-events-none z-0 ${isDark ? 'opacity-40' : 'opacity-60'}`}>
        <AntigravityCanvas particleCount={48} interactive={true} />
      </div>

      {/* 2. Atmospheric Luminous Ambient Lighting */}
      <div className={`fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] blur-3xl pointer-events-none -z-10 animate-pulseGlow ${
        isDark
          ? 'bg-gradient-to-b from-blue-600/15 via-blue-600/08 to-transparent'
          : 'bg-gradient-to-b from-sky-200/35 via-blue-100/20 to-transparent'
      }`} />

      {/* 3. Header with Theme Switcher & Actions */}
      <header className={`sticky top-0 z-40 h-20 backdrop-blur-2xl border-b px-6 lg:px-12 flex items-center justify-between transition-colors ${
        isDark
          ? 'bg-[#0A0D14]/80 border-white/[0.07] text-white'
          : 'bg-white/85 border-sky-100 text-slate-900 shadow-sm'
      }`}>
        {/* Brand */}
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 via-sky-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 ring-1 ring-white/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-extrabold text-base tracking-tight">RACS AI</span>
            <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-full hidden sm:inline-block ${
              isDark
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : 'bg-sky-50 text-sky-600 border border-sky-200/80'
            }`}>
              Enterprise v2.4
            </span>
          </div>
        </div>

        {/* Navigation Anchors */}
        <nav className={`hidden md:flex items-center space-x-8 text-xs font-medium ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          <a href="#playground" className="hover:text-sky-500 dark:hover:text-white transition-colors">Interactive Scanner</a>
          <a href="#personas" className="hover:text-sky-500 dark:hover:text-white transition-colors">5 Role Personas</a>
          <a href="#security" className="hover:text-sky-500 dark:hover:text-white transition-colors">AES-256 BYOK</a>
          <a href="#workflow" className="hover:text-sky-500 dark:hover:text-white transition-colors">How It Works</a>
        </nav>

        {/* Right Action Buttons + Theme Switcher */}
        <div className="flex items-center space-x-3">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`p-2 rounded-xl transition-all cursor-pointer border ${
              isDark
                ? 'bg-white/[0.04] border-white/[0.08] text-amber-400 hover:bg-white/[0.08]'
                : 'bg-sky-50/70 border-sky-200/70 text-sky-600 hover:bg-sky-100 hover:text-sky-700'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => openAuthModal('signin')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              isDark
                ? 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Sign In
          </button>

          <button
            onClick={() => openAuthModal('signup')}
            className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 shadow-md shadow-sky-500/25 transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <span>Create Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 4. Main Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 lg:px-8 pt-14 pb-24 flex flex-col items-center text-center relative z-10">
        {/* Status Badge */}
        <div className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs mb-8 backdrop-blur-md shadow-sm border ${
          isDark
            ? 'bg-white/[0.04] border-white/[0.08] text-blue-300'
            : 'bg-white border-sky-200/70 text-sky-700 shadow-sky-400/5'
        }`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium">Autonomous Recruitment Engine</span>
          <span className="text-slate-400">&bull;</span>
          <span className="font-mono text-[11px] text-sky-600 dark:text-cyan-300">Live Explainable AI</span>
        </div>

        {/* Grand Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight max-w-4xl leading-[1.12]">
          Transform 100 Resumes into the <br />
          <span className="font-semibold bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Top 3 Hires in Seconds.
          </span>
        </h1>

        {/* Subtitle */}
        <p className={`mt-6 text-base sm:text-lg max-w-2xl leading-relaxed font-normal ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          Drop candidate resumes in <span className="font-semibold text-sky-600 dark:text-sky-400">PDF, Word, or Plain Text</span>. Watch AI uncover verified technical skills, calculate transparent match scores, and guide your team from first review to signed offer.
        </p>

        {/* Welcoming CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#playground"
            className="px-6 py-3 rounded-2xl text-xs font-semibold text-white bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 shadow-xl shadow-sky-500/25 transition-all flex items-center space-x-2 cursor-pointer hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test Live AI Resume Scanner</span>
          </a>
          <button
            onClick={() => {
              const el = document.getElementById('personas');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`px-6 py-3 rounded-2xl text-xs font-medium transition-all cursor-pointer flex items-center space-x-2 border ${
              isDark
                ? 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border-white/[0.09]'
                : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 shadow-sm'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span>Explore 5 Role Personas</span>
          </button>
        </div>

        {/* 5. INTERACTIVE LIVE RESUME SCANNER PLAYGROUND */}
        <section id="playground" className="mt-16 w-full text-left scroll-mt-24">
          <div className={`p-6 sm:p-10 rounded-3xl border shadow-xl space-y-6 relative overflow-hidden backdrop-blur-2xl ${
            isDark
              ? 'bg-[#0E1320]/80 border-white/[0.09]'
              : 'bg-white/95 border-slate-200'
          }`}>
            {/* Top Control Bar with Mode Toggle & Target Job Dropdown */}
            <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b ${
              isDark ? 'border-white/[0.07]' : 'border-slate-100'
            }`}>
              <div>
                <div className="inline-flex items-center space-x-1.5 text-[11px] font-mono text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Live Playground &bull; Test Real Resumes</span>
                </div>
                <h2 className="text-2xl font-light tracking-tight">
                  Live AI Resume Scanner & Scorecard
                </h2>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Select a candidate resume below or upload <span className="font-mono text-sky-600 dark:text-sky-400 font-semibold">gina_jones_resume.txt</span> to watch real skills extracted and scored against requirements.
                </p>
              </div>

              {/* Target Job Requisition Selector + Mode Toggle */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Target Job Selector */}
                <div className="flex items-center space-x-1.5 text-xs">
                  <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Evaluate For:</span>
                  <select
                    value={simTargetJobId}
                    onChange={(e) => triggerScanAnimation(activeCandidateKey, aiMode, e.target.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border cursor-pointer ${
                      isDark
                        ? 'bg-black/50 border-white/[0.1] text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="REQ-FRONTEND-01">Frontend / Product Engineer</option>
                    <option value="REQ-DISTRIBUTED-01">Distributed Systems Architect</option>
                  </select>
                </div>

                {/* Mode Selector */}
                <div className={`flex items-center p-1 rounded-xl border ${
                  isDark ? 'bg-black/40 border-white/[0.08]' : 'bg-slate-100 border-slate-200'
                }`}>
                  <button
                    type="button"
                    onClick={() => triggerScanAnimation(activeCandidateKey, 'flash')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
                      aiMode === 'flash'
                        ? 'bg-cyan-500 text-white shadow-sm'
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Flash (1.6s)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerScanAnimation(activeCandidateKey, 'pro')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
                      aiMode === 'pro'
                        ? 'bg-sky-500 text-white shadow-sm'
                        : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Pro Thinking (3.0s)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Selectable Candidate Pills (Including Gina Jones!) + Real File Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {/* Card 1: GINA JONES (The exact uploaded resume!) */}
              <button
                onClick={() => triggerScanAnimation('gina')}
                className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                  activeCandidateKey === 'gina'
                    ? isDark
                      ? 'bg-blue-600/15 border-blue-500 shadow-md ring-1 ring-blue-500/30'
                      : 'bg-sky-50 border-sky-400 shadow-sm ring-1 ring-sky-300'
                    : isDark
                      ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-semibold">.TXT Resume</span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {simTargetJobId === 'REQ-FRONTEND-01' ? '98% Match' : '48% Match'}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Gina Jones</div>
                  <div className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>React Developer (Airbnb)</div>
                </div>
              </button>

              {/* Card 2: Priya Sharma */}
              <button
                onClick={() => triggerScanAnimation('priya')}
                className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                  activeCandidateKey === 'priya'
                    ? isDark
                      ? 'bg-blue-600/15 border-blue-500 shadow-md ring-1 ring-blue-500/30'
                      : 'bg-sky-50 border-sky-400 shadow-sm ring-1 ring-sky-300'
                    : isDark
                      ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>PDF Document</span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {simTargetJobId === 'REQ-DISTRIBUTED-01' ? '98% Match' : '72% Match'}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Priya Sharma</div>
                  <div className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Distributed Systems (Go)</div>
                </div>
              </button>

              {/* Card 3: Marcus Chen */}
              <button
                onClick={() => triggerScanAnimation('marcus')}
                className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                  activeCandidateKey === 'marcus'
                    ? isDark
                      ? 'bg-blue-600/15 border-blue-500 shadow-md ring-1 ring-blue-500/30'
                      : 'bg-sky-50 border-sky-400 shadow-sm ring-1 ring-sky-300'
                    : isDark
                      ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Word DOCX</span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                    {simTargetJobId === 'REQ-FRONTEND-01' ? '88% Match' : '62% Match'}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Marcus Chen</div>
                  <div className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Full-Stack Eng (Stripe)</div>
                </div>
              </button>

              {/* Card 4: Elena Rostova */}
              <button
                onClick={() => triggerScanAnimation('elena')}
                className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                  activeCandidateKey === 'elena'
                    ? isDark
                      ? 'bg-blue-600/15 border-blue-500 shadow-md ring-1 ring-blue-500/30'
                      : 'bg-sky-50 border-sky-400 shadow-sm ring-1 ring-sky-300'
                    : isDark
                      ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Plain Text</span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    62% Match
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Elena Rostova</div>
                  <div className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>DevOps & CI/CD</div>
                </div>
              </button>

              {/* Card 5: REAL FILE UPLOAD DROPZONE */}
              <label className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border border-dashed flex flex-col justify-center items-center text-center group ${
                activeCandidateKey === 'custom'
                  ? 'border-sky-400 bg-sky-50/40 dark:bg-blue-600/10'
                  : isDark
                    ? 'border-white/[0.15] hover:border-blue-400/60 bg-white/[0.01]'
                    : 'border-slate-300 hover:border-sky-400 bg-slate-50/50'
              }`}>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.json"
                  onChange={handleRealFileUpload}
                  className="hidden"
                />
                <UploadCloud className="w-5 h-5 text-sky-500 dark:text-sky-400 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-xs font-medium truncate max-w-[120px]">
                  {uploadedCandidateData ? uploadedCandidateData.fileName : 'Upload .TXT / PDF'}
                </span>
                <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {uploadedCandidateData ? 'Analyzed' : 'Reads Real Text'}
                </span>
              </label>
            </div>

            {/* Scanning Progress Stream (Live during scan) */}
            {isScanning && (
              <div className={`p-4 rounded-2xl border space-y-2 animate-fadeIn ${
                isDark ? 'bg-blue-500/[0.06] border-blue-500/20 text-slate-300' : 'bg-sky-50 border-sky-200 text-sky-950'
              }`}>
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2 text-sky-600 dark:text-sky-400">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Parsing Document & Executing Skill Extraction Stream...</span>
                  </div>
                  <span className="font-semibold">{scanStep * 25}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/10 dark:bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-300 rounded-full"
                    style={{ width: `${scanStep * 25}%` }}
                  />
                </div>
                <div className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {scanStep === 1 && '↳ Extracting raw text from document & scrubbing demographic EEOC bias markers...'}
                  {scanStep === 2 && `↳ Cross-referencing against criteria for ${simTargetJobId === 'REQ-FRONTEND-01' ? 'Senior Frontend Engineer' : 'Distributed Systems Architect'}...`}
                  {scanStep === 3 && '↳ Synthesizing competency vectors & checking skill ontology database...'}
                  {scanStep === 4 && '↳ Finalizing transparent green/red match scorecards and shortlisting verdict...'}
                </div>
              </div>
            )}

            {/* Live Explainable AI Scorecard Output */}
            {!isScanning && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
                {/* Left: Candidate Summary & Radial Score Gauge */}
                <div className={`lg:col-span-5 p-5 rounded-2xl border space-y-4 ${
                  isDark ? 'bg-white/[0.02] border-white/[0.07]' : 'bg-slate-50 border-slate-200 shadow-sm'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-mono text-sky-600 dark:text-sky-400 mb-0.5">
                        Target: {activeCandidate.evaluation.targetTitle}
                      </div>
                      <h3 className="text-base font-bold tracking-tight">{activeCandidate.name}</h3>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{activeCandidate.role}</p>
                      <div className={`text-[11px] font-mono mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        {activeCandidate.exp} &bull; {activeCandidate.location}
                      </div>
                    </div>

                    {/* Radial Score Gauge */}
                    <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 54 54">
                        <circle
                          cx="27"
                          cy="27"
                          r="22"
                          stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
                          strokeWidth="3.5"
                          fill="none"
                        />
                        <circle
                          cx="27"
                          cy="27"
                          r="22"
                          stroke={isShortlisted ? '#10B981' : '#F59E0B'}
                          strokeWidth="3.8"
                          fill="none"
                          strokeDasharray={2 * Math.PI * 22}
                          strokeDashoffset={2 * Math.PI * 22 * (1 - computedScore / 100)}
                          strokeLinecap="round"
                          className="transition-all duration-500"
                        />
                      </svg>
                      <span className="absolute font-mono text-sm font-bold">{computedScore}%</span>
                    </div>
                  </div>

                  {/* Plain-English AI Rationale */}
                  <div className={`p-3.5 rounded-xl border space-y-1 ${
                    isDark ? 'bg-black/40 border-white/[0.05]' : 'bg-white border-slate-200'
                  }`}>
                    <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">AI Executive Rationale</div>
                    <p className={`text-xs leading-relaxed italic ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      "{activeCandidate.evaluation.reasoning}"
                    </p>
                  </div>

                  {/* Pipeline Shortlist Verdict */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Autonomous Verdict:</span>
                    <span
                      className={`font-mono text-[11px] px-3 py-1 rounded-full border font-semibold ${
                        isShortlisted
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25'
                      }`}
                    >
                      {isShortlisted ? '✓ Auto-Shortlisted for HM Review' : '⏳ Secondary Screening Queue'}
                    </span>
                  </div>
                </div>

                {/* Right: Matched vs Missing Skills + Shortlist Calibration Slider */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Green Matched Competencies */}
                  <div className="p-4 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/25 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified Matched Competencies ({activeCandidate.evaluation.matched.length})</span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400/80">Requisition Aligned</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activeCandidate.evaluation.matched.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 text-xs font-mono font-medium"
                        >
                          +{s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Red Missing Competencies */}
                  <div className="p-4 rounded-2xl bg-rose-500/[0.06] border border-rose-500/25 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1.5 font-semibold text-rose-700 dark:text-rose-400">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Missing Requisition Requirements ({activeCandidate.evaluation.missing.length})</span>
                      </div>
                      <span className="text-[11px] font-mono text-rose-600 dark:text-rose-400/80">Skill Gap</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activeCandidate.evaluation.missing.length > 0 ? (
                        activeCandidate.evaluation.missing.map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/25 text-xs font-mono font-medium"
                          >
                            -{s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500 italic">No missing requirements. Candidate meets or exceeds all criteria.</span>
                      )}
                    </div>
                  </div>

                  {/* Interactive Requisition Criteria & Weighting Matrix */}
                  <div className={`p-4 rounded-2xl border space-y-3 ${
                    isDark ? 'bg-white/[0.02] border-white/[0.07]' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold flex items-center space-x-1.5">
                        <Sliders className="w-3.5 h-3.5 text-sky-500" />
                        <span>Job Criteria Calibrator (Dynamic Match Weighting)</span>
                      </span>
                      <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-medium">
                        Live Score Recalculation
                      </span>
                    </div>

                    <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Toggle required competencies below to calibrate the job rubric and watch candidate score recalculate live:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                      <label className={`flex items-center space-x-2 cursor-pointer p-2 rounded-xl border transition-all ${
                        rubricCriteria.architecture
                          ? isDark ? 'bg-blue-600/10 border-blue-500/40 text-white' : 'bg-sky-50 border-sky-300 text-sky-950'
                          : isDark ? 'bg-white/[0.01] border-white/[0.05] text-slate-400' : 'bg-white border-slate-200 text-slate-500'
                      }`}>
                        <input
                          type="checkbox"
                          checked={rubricCriteria.architecture}
                          onChange={(e) => setRubricCriteria({ ...rubricCriteria, architecture: e.target.checked })}
                          className="w-4 h-4 rounded text-sky-500 accent-sky-500 cursor-pointer"
                        />
                        <span>React Architecture (+22%)</span>
                      </label>

                      <label className={`flex items-center space-x-2 cursor-pointer p-2 rounded-xl border transition-all ${
                        rubricCriteria.stateManagement
                          ? isDark ? 'bg-blue-600/10 border-blue-500/40 text-white' : 'bg-sky-50 border-sky-300 text-sky-950'
                          : isDark ? 'bg-white/[0.01] border-white/[0.05] text-slate-400' : 'bg-white border-slate-200 text-slate-500'
                      }`}>
                        <input
                          type="checkbox"
                          checked={rubricCriteria.stateManagement}
                          onChange={(e) => setRubricCriteria({ ...rubricCriteria, stateManagement: e.target.checked })}
                          className="w-4 h-4 rounded text-sky-500 accent-sky-500 cursor-pointer"
                        />
                        <span>Redux & Apollo GraphQL (+16%)</span>
                      </label>

                      <label className={`flex items-center space-x-2 cursor-pointer p-2 rounded-xl border transition-all ${
                        rubricCriteria.testingQuality
                          ? isDark ? 'bg-blue-600/10 border-blue-500/40 text-white' : 'bg-sky-50 border-sky-300 text-sky-950'
                          : isDark ? 'bg-white/[0.01] border-white/[0.05] text-slate-400' : 'bg-white border-slate-200 text-slate-500'
                      }`}>
                        <input
                          type="checkbox"
                          checked={rubricCriteria.testingQuality}
                          onChange={(e) => setRubricCriteria({ ...rubricCriteria, testingQuality: e.target.checked })}
                          className="w-4 h-4 rounded text-sky-500 accent-sky-500 cursor-pointer"
                        />
                        <span>Enzyme & ESLint Testing (+14%)</span>
                      </label>

                      <label className={`flex items-center space-x-2 cursor-pointer p-2 rounded-xl border transition-all ${
                        rubricCriteria.distributedSystems
                          ? isDark ? 'bg-rose-600/10 border-rose-500/40 text-white' : 'bg-rose-50 border-rose-300 text-rose-900'
                          : isDark ? 'bg-white/[0.01] border-white/[0.05] text-slate-400' : 'bg-white border-slate-200 text-slate-500'
                      }`}>
                        <input
                          type="checkbox"
                          checked={rubricCriteria.distributedSystems}
                          onChange={(e) => setRubricCriteria({ ...rubricCriteria, distributedSystems: e.target.checked })}
                          className="w-4 h-4 rounded text-sky-500 accent-sky-500 cursor-pointer"
                        />
                        <span>Require Go/eBPF Kernel (Strict Gap)</span>
                      </label>
                    </div>
                  </div>

                  {/* Shortlist Qualification Cutoff (Pass Bar) */}
                  <div className={`p-4 rounded-2xl border space-y-3 ${
                    isDark ? 'bg-white/[0.02] border-white/[0.07]' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold">
                        Hiring Bar Cutoff (Pass Mark for HM Review)
                      </span>
                      <span className="font-mono text-sky-600 dark:text-sky-400 font-semibold px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                        Cutoff Bar: {shortlistThreshold}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min="50"
                      max="99"
                      step="1"
                      value={shortlistThreshold}
                      onChange={(e) => setShortlistThreshold(Number(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />

                    {/* Comparative Gauge Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-500">
                          Candidate Score: <strong className={isShortlisted ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>{computedScore}%</strong>
                        </span>
                        <span className="text-slate-500">
                          Pass Cutoff: <strong>{shortlistThreshold}%</strong>
                        </span>
                      </div>

                      <div className="relative w-full h-2.5 rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isShortlisted ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${computedScore}%` }}
                        />
                      </div>

                      {/* Visual verdict box */}
                      <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                        isShortlisted
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
                      }`}>
                        <div className="flex items-center space-x-2">
                          {isShortlisted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                          )}
                          <span className="font-medium text-[11px]">
                            {isShortlisted
                              ? `QUALIFIED: Candidate match (${computedScore}%) >= pass cutoff (${shortlistThreshold}%). Automatically promoted to HM Review.`
                              : `BELOW CUTOFF: Candidate match (${computedScore}%) < pass cutoff (${shortlistThreshold}%). Placed in secondary screening queue.`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 6. 5-PERSONA EXPLORER WITH 1-CLICK LAUNCH */}
        <section id="personas" className="mt-24 w-full text-left space-y-8 scroll-mt-24">
          <div className={`border-b pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4 ${
            isDark ? 'border-white/[0.07]' : 'border-slate-200'
          }`}>
            <div>
              <div className="text-xs font-mono text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
                Strict Role Isolation (RBAC)
              </div>
              <h2 className="text-2xl font-light tracking-tight">
                5 Dedicated Personas with Tailored Interfaces
              </h2>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Every team member sees exactly what they need. Click a persona below to inspect their real screen:
              </p>
            </div>
          </div>

          {/* Persona Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {PERSONAS.map((p) => {
              const Icon = p.icon;
              const isActive = activePersonaRole === p.role;
              return (
                <button
                  key={p.role}
                  onClick={() => setActivePersonaRole(p.role)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-medium transition-all cursor-pointer flex items-center space-x-2 flex-shrink-0 border ${
                    isActive
                      ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/25'
                      : isDark
                        ? 'bg-white/[0.03] text-slate-400 border-white/[0.07] hover:text-white hover:bg-white/[0.06]'
                        : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{p.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Persona High-Fidelity Showcase Card */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn ${
            isDark ? 'bg-[#0E1320]/80 border-white/[0.08]' : 'bg-white border-slate-200'
          }`}>
            <div className="lg:col-span-6 space-y-4">
              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[11px] font-mono border ${
                isDark ? 'bg-white/[0.04] border-white/[0.08] text-blue-300' : 'bg-sky-50 border-sky-200 text-sky-700'
              }`}>
                <span>{activePersona.badge}</span>
                <span>&bull;</span>
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{activePersona.shortTitle}</span>
              </div>

              <h3 className="text-xl font-light tracking-tight">
                {activePersona.headline}
              </h3>

              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {activePersona.summary}
              </p>

              <div className="space-y-2.5 pt-2">
                {activePersona.mockHighlights.map((h) => (
                  <div key={h.label} className="flex items-start space-x-2.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">{h.label}: </span>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{h.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={() => loginAsDemoPersona(activePersona.role)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-semibold shadow-lg shadow-sky-500/25 transition-all flex items-center space-x-2 cursor-pointer hover:scale-[1.02]"
                >
                  <span>Launch Live Dashboard as {activePersona.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Mini-Preview Card */}
            <div className={`lg:col-span-6 p-5 rounded-2xl border space-y-4 shadow-inner ${
              isDark ? 'bg-black/50 border-white/[0.08]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`flex items-center justify-between pb-3 border-b text-xs ${
                isDark ? 'border-white/[0.06]' : 'border-slate-200'
              }`}>
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className={`text-[11px] font-mono ml-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    racs-console &bull; {activePersona.shortTitle}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Role Isolated
                </span>
              </div>

              {activePersonaRole === ROLES.HIRING_MANAGER && (
                <div className="space-y-3 text-xs">
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-slate-200'
                  }`}>
                    <div>
                      <div className="font-semibold">Requisition #FE-102</div>
                      <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Senior Frontend & Product Engineer</div>
                    </div>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-sm">98% Match (Gina Jones)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono">+React Router</span>
                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono">+Redux</span>
                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono">+Apollo GraphQL</span>
                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono">+Enzyme</span>
                  </div>
                  <div className={`text-[11px] p-2.5 rounded-lg border italic ${
                    isDark ? 'bg-black/30 border-white/[0.04] text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    "Debrief note: Exceptional candidate from Airbnb/Netflix. 53% API reduction with Apollo Client verified."
                  </div>
                </div>
              )}

              {activePersonaRole === ROLES.TALENT_ACQUISITION && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-slate-200'}`}>
                      <div className="text-base font-bold font-mono">142</div>
                      <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Resumes Ingested</div>
                    </div>
                    <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-slate-200'}`}>
                      <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">92%</div>
                      <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Shortlist Precision</div>
                    </div>
                    <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-slate-200'}`}>
                      <div className="text-base font-bold text-sky-600 dark:text-sky-400 font-mono">2.4d</div>
                      <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Shortlist Speed</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-center text-[11px] text-sky-700 dark:text-sky-300 font-mono">
                    ⚡ Batch OCR Ingestion Stream Active &bull; EEOC Masking Enabled
                  </div>
                </div>
              )}

              {activePersonaRole === ROLES.SYSTEM_ADMIN && (
                <div className="space-y-3 text-xs font-mono">
                  <div className={`p-3 rounded-xl border space-y-1.5 ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>BYOK Provider:</span>
                      <span className="font-semibold">OpenAI / Gemini</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Encryption:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Hardware AES-256</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Audit Integrity:</span>
                      <span className="text-sky-600 dark:text-sky-400 font-semibold">SHA-256 Chained</span>
                    </div>
                  </div>
                  <div className={`p-2.5 rounded-lg border text-[10px] truncate ${
                    isDark ? 'bg-black/40 border-white/[0.05] text-slate-400' : 'bg-white border-slate-200 text-slate-600'
                  }`}>
                    AES_ENCRYPT(raw_key, SHA2(master_seed, 512)) &bull; Verified
                  </div>
                </div>
              )}

              {activePersonaRole === ROLES.HR_REPRESENTATIVE && (
                <div className="space-y-3 text-xs">
                  <div className={`p-3 rounded-xl border space-y-2 ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Candidate:</span>
                      <span className="font-semibold">Gina Jones</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Base Salary:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">$195,000 / yr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Equity RSUs:</span>
                      <span className="text-sky-600 dark:text-sky-400 font-mono">12,000 Units (4y)</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center justify-between font-mono">
                    <span>CA SB 1162 Pay Parity:</span>
                    <span className="font-bold">✓ 100% In-Band</span>
                  </div>
                </div>
              )}

              {activePersonaRole === ROLES.ENGAGEMENT_SPECIALIST && (
                <div className="space-y-3 text-xs">
                  <div className={`p-3 rounded-xl border space-y-1.5 ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white border-slate-200'}`}>
                    <div className="text-[11px] text-sky-600 dark:text-sky-400 font-mono">Cadence Sequence: Engineering Onboarding</div>
                    <div className="font-medium">Day 1: Hardware Selection & Team Welcome</div>
                    <div className={isDark ? 'text-slate-400' : 'text-slate-500'}>Dispatched automatically upon signed offer acceptance.</div>
                  </div>
                  <div className={`flex items-center justify-between text-[11px] font-mono pt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <span>Engagement Health:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">96% Response Rate</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`border-t py-8 px-6 lg:px-12 text-center text-xs flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto w-full relative z-10 ${
        isDark ? 'border-white/[0.07] text-slate-500' : 'border-slate-200 text-slate-600'
      }`}>
        <p>&copy; 2026 RACS AI Enterprise Technologies. Connected to Spring Boot & MySQL.</p>
        <div className="flex items-center space-x-4 mt-3 sm:mt-0 font-mono text-[11px]">
          <span>Spring Boot REST Active</span>
          <span>&bull;</span>
          <span className="text-sky-600 dark:text-sky-400">Aiven Cloud MySQL</span>
        </div>
      </footer>

      {/* Welcoming Auth Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className={`relative max-w-md w-full rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-5 ${
            isDark ? 'bg-[#0D121D] border-white/[0.1] text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h2 className="text-lg font-light tracking-tight">
                {authMode === 'signin' && 'Sign In to Enterprise Workspace'}
                {authMode === 'signup' && 'Provision Admin Workspace'}
                {authMode === 'redeem_token' && 'Redeem 48h Invitation Token'}
              </h2>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {authMode === 'signin' && 'Enter your credentials to enter your role-specific dashboard.'}
                {authMode === 'signup' && 'System Administrator corporate workspace registration.'}
                {authMode === 'redeem_token' && 'Join a corporate workspace via an authorized invite link.'}
              </p>
            </div>

            <div className={`flex p-1 rounded-xl border text-xs ${
              isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setFormError(''); }}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  authMode === 'signin' ? 'bg-sky-500 text-white shadow-sm' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setFormError(''); }}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  authMode === 'signup' ? 'bg-sky-500 text-white shadow-sm' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                New Workspace
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('redeem_token'); setFormError(''); }}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  authMode === 'redeem_token' ? 'bg-sky-500 text-white shadow-sm' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Token
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs">
                {formError}
              </div>
            )}

            {/* SIGN IN */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Corporate Work Email</label>
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="sarah@apex.io"
                    className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none focus:border-sky-400 ${
                      isDark ? 'bg-black/40 border-white/[0.08] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className={`w-full pl-3.5 pr-10 py-2 text-xs rounded-xl border focus:outline-none focus:border-sky-400 ${
                        isDark ? 'bg-black/40 border-white/[0.08] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-semibold shadow-md shadow-sky-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Authenticating with MySQL...' : 'Sign In to Workspace'}
                </button>

                {/* 1-Click Fast Credentials */}
                <div className={`pt-3 border-t space-y-2 ${isDark ? 'border-white/[0.06]' : 'border-slate-100'}`}>
                  <div className="text-[11px] font-mono text-slate-400">1-Click Saved Database Workspaces:</div>
                  <div className="grid grid-cols-2 gap-2 text-left">
                    <button
                      type="button"
                      onClick={() => {
                        setSignInEmail('sarah@apex.io');
                        setSignInPassword('Password123!');
                      }}
                      className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                        isDark ? 'bg-white/[0.03] hover:bg-white/[0.07] border-white/[0.06]' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <div className="font-semibold truncate">Apex Global</div>
                      <div className="text-[10px] text-slate-400 truncate">sarah@apex.io</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSignInEmail('arthur.vance@stitch.internal');
                        setSignInPassword('Password@999');
                      }}
                      className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                        isDark ? 'bg-white/[0.03] hover:bg-white/[0.07] border-white/[0.06]' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <div className="font-semibold truncate">Stitch Cyber</div>
                      <div className="text-[10px] text-slate-400 truncate">arthur.vance</div>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* SIGN UP ADMIN */}
            {authMode === 'signup' && (
              <form onSubmit={handleAdminSignUpSubmit} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Company Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Horizon Labs Inc."
                    className={`w-full px-3 py-1.5 text-xs rounded-xl border ${
                      isDark ? 'bg-black/40 border-white/[0.08] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Headquarters Address *</label>
                  <input
                    type="text"
                    required
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    placeholder="e.g. 100 Market St, San Francisco, CA"
                    className={`w-full px-3 py-1.5 text-xs rounded-xl border ${
                      isDark ? 'bg-black/40 border-white/[0.08] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">GSTIN / Tax ID *</label>
                    <input
                      type="text"
                      required
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      placeholder="29ABCDE1234F1Z5"
                      className={`w-full px-3 py-1.5 text-xs font-mono rounded-xl border ${
                        isDark ? 'bg-black/40 border-white/[0.08] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Company Phone *</label>
                    <input
                      type="tel"
                      required
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      placeholder="+1 (555) 019-2831"
                      className={`w-full px-3 py-1.5 text-xs rounded-xl border ${
                        isDark ? 'bg-black/40 border-white/[0.08] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div className={`pt-2 border-t ${isDark ? 'border-white/[0.06]' : 'border-slate-100'}`}>
                  <label className="block text-[11px] text-slate-400 mb-1">Admin Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={adminFullName}
                    onChange={(e) => setAdminFullName(e.target.value)}
                    placeholder="Dr. Arthur Vance"
                    className={`w-full px-3 py-1.5 text-xs rounded-xl border ${
                      isDark ? 'bg-black/40 border-white/[0.08] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Corporate Work Email *</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="arthur@horizon.io"
                    className={`w-full px-3 py-1.5 text-xs rounded-xl border ${
                      isDark ? 'bg-black/40 border-white/[0.08] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Master Password *</label>
                    <input
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Min 8 chars"
                      className={`w-full px-3 py-1.5 text-xs rounded-xl border ${
                        isDark ? 'bg-black/40 border-white/[0.08] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      value={adminConfirmPassword}
                      onChange={(e) => setAdminConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className={`w-full px-3 py-1.5 text-xs rounded-xl border ${
                        isDark ? 'bg-black/40 border-white/[0.08] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-semibold shadow-md shadow-sky-500/25 transition-all cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? 'Provisioning Workspace in Database...' : 'Provision Enterprise Workspace'}
                </button>
              </form>
            )}

            {/* TOKEN */}
            {authMode === 'redeem_token' && (
              <form onSubmit={handleRedeemManualToken} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1">48-Hour Invitation Token</label>
                  <input
                    type="text"
                    required
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    placeholder="e.g. 7320c40dcdde4e3a9a4a8b582c7b7b56"
                    className={`w-full px-3.5 py-2 text-xs font-mono rounded-xl border ${
                      isDark ? 'bg-black/40 border-white/[0.08] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Paste the cryptographic token sent by your workspace System Administrator.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-semibold shadow-md shadow-sky-500/25 transition-all cursor-pointer"
                >
                  Verify & Register via Token
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
