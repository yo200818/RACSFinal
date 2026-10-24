// RACS AI Enterprise Data Store & Constants
// Mapped directly to Spring Boot backend database schemas and Industrial Assignment 7 & 8 Requirements

export const ROLES = {
  SYSTEM_ADMIN: 'ROLE_SYSTEM_ADMIN',
  TALENT_ACQUISITION: 'ROLE_TALENT_ACQUISITION',
  HIRING_MANAGER: 'ROLE_HIRING_MANAGER',
  HR_REPRESENTATIVE: 'ROLE_HR_REPRESENTATIVE',
  ENGAGEMENT_SPECIALIST: 'ROLE_ENGAGEMENT_SPECIALIST',
};

// Also export alias without prefix for backwards compatibility
export const ROLE_ALIASES = {
  SYSTEM_ADMIN: 'ROLE_SYSTEM_ADMIN',
  TALENT_ACQUISITION: 'ROLE_TALENT_ACQUISITION',
  HIRING_MANAGER: 'ROLE_HIRING_MANAGER',
  HR_REPRESENTATIVE: 'ROLE_HR_REPRESENTATIVE',
  ENGAGEMENT_SPECIALIST: 'ROLE_ENGAGEMENT_SPECIALIST',
  ROLE_SYSTEM_ADMIN: 'ROLE_SYSTEM_ADMIN',
  ROLE_TALENT_ACQUISITION: 'ROLE_TALENT_ACQUISITION',
  ROLE_HIRING_MANAGER: 'ROLE_HIRING_MANAGER',
  ROLE_HR_REPRESENTATIVE: 'ROLE_HR_REPRESENTATIVE',
  ROLE_ENGAGEMENT_SPECIALIST: 'ROLE_ENGAGEMENT_SPECIALIST',
  'System Administrator': 'ROLE_SYSTEM_ADMIN',
  'System Admin': 'ROLE_SYSTEM_ADMIN',
  'Talent Acquisition (TA)': 'ROLE_TALENT_ACQUISITION',
  'Talent Acquisition': 'ROLE_TALENT_ACQUISITION',
  'Hiring Manager (HM)': 'ROLE_HIRING_MANAGER',
  'Hiring Manager': 'ROLE_HIRING_MANAGER',
  'HR Representative': 'ROLE_HR_REPRESENTATIVE',
  'Engagement Specialist': 'ROLE_ENGAGEMENT_SPECIALIST',
};

export const ROLE_DEFINITIONS = {
  [ROLES.SYSTEM_ADMIN]: {
    id: ROLES.SYSTEM_ADMIN,
    name: 'System Administrator',
    shortName: 'System Admin',
    badge: 'Enterprise Root',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'admin.vance@racsai.enterprise.internal',
    description: 'Workspace security, tenant isolation, cryptographic audit trails, user directory, and enterprise BYOK enclaves.',
    color: 'from-purple-600 to-indigo-600',
    primaryColor: '#8B5CF6',
    defaultRoute: '/admin',
  },
  [ROLES.TALENT_ACQUISITION]: {
    id: ROLES.TALENT_ACQUISITION,
    name: 'Talent Acquisition (TA)',
    shortName: 'Talent Acquisition',
    badge: 'Recruiter Lead',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'mateo.morales@racsai.enterprise.internal',
    description: 'High-volume resume ingestion, OCR parsing streams, candidate pipeline velocity, and sourcing SLA tracking.',
    color: 'from-blue-600 to-cyan-600',
    primaryColor: '#06B6D4',
    defaultRoute: '/ta',
  },
  [ROLES.HIRING_MANAGER]: {
    id: ROLES.HIRING_MANAGER,
    name: 'Hiring Manager (HM)',
    shortName: 'Hiring Manager',
    badge: 'VP Engineering',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'david.vance@racsai.enterprise.internal',
    description: 'Department open requisitions, explainable AI scorecards, interview checklists, and immutable technical recommendations.',
    color: 'from-indigo-600 to-violet-600',
    primaryColor: '#6366F1',
    defaultRoute: '/hm',
  },
  [ROLES.HR_REPRESENTATIVE]: {
    id: ROLES.HR_REPRESENTATIVE,
    name: 'HR Representative',
    shortName: 'HR Representative',
    badge: 'HR Governance',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    email: 'eleanor.vance@racsai.enterprise.internal',
    description: 'Executive offer approval queues, CA SB 1162 pay-parity compliance sliders, and cryptographically sealed handoff reports.',
    color: 'from-emerald-600 to-teal-600',
    primaryColor: '#10B981',
    defaultRoute: '/hr',
  },
  [ROLES.ENGAGEMENT_SPECIALIST]: {
    id: ROLES.ENGAGEMENT_SPECIALIST,
    name: 'Engagement Specialist',
    shortName: 'Engagement Team',
    badge: 'Onboarding Lead',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    email: 'kendra.washington@racsai.enterprise.internal',
    description: 'Pre-boarding candidate enrollment pipelines, automated cadence intervals, and onboarding email sequences.',
    color: 'from-amber-600 to-orange-600',
    primaryColor: '#F59E0B',
    defaultRoute: '/engagement',
  },
};

// Workspaces Table schema mapping:
// workspace_id, company_name, company_address, gstin, company_phone, created_at, updated_at
export const INITIAL_WORKSPACE = {
  workspace_id: 'ws-racs-core-8841',
  company_name: 'RACS AI Autonomous Technologies Inc.',
  company_address: '100 Montgomery St, Suite 2200, San Francisco, CA 94104',
  gstin: '06AAACR4421F1Z8',
  company_phone: '+1 (415) 555-0192',
  domain: 'racsai.enterprise.internal',
  tier: 'FedRAMP & SOC-2 Tier 1 Enclave',
  encryption: 'AES-256 GCM Hardware-Protected',
  zeroDataRetention: true,
  eeocMasking: true,
  fido2Enforced: true,
  atsWebhookUrl: 'https://api.greenhouse.io/v1/partner/racsai-webhook',
  linkedAtss: ['Greenhouse ATS v2.4', 'LinkedIn Recruiter API', 'Workday HCM Direct'],
  created_at: '2026-01-10T08:00:00Z',
  updated_at: '2026-10-22T08:00:00Z',
};

// Users Table schema mapping:
// user_id, workspace_id, full_legal_name, email, password_hash, role, access_status ('Active'/'Revoked'), created_at
export const INITIAL_USERS = [
  {
    user_id: 'usr-admin-01',
    workspace_id: 'ws-racs-core-8841',
    full_legal_name: 'Dr. Arthur Vance',
    email: 'admin.vance@racsai.enterprise.internal',
    role: ROLES.SYSTEM_ADMIN,
    department: 'Enterprise Security & IT Operations',
    access_status: 'Active',
    mfaEnforced: true,
    joinedDate: 'Jan 2024',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    created_at: '2024-01-15T09:00:00Z',
  },
  {
    user_id: 'usr-ta-02',
    workspace_id: 'ws-racs-core-8841',
    full_legal_name: 'Mateo Morales',
    email: 'mateo.morales@racsai.enterprise.internal',
    role: ROLES.TALENT_ACQUISITION,
    department: 'People Operations / Recruitment',
    access_status: 'Active',
    mfaEnforced: true,
    joinedDate: 'Mar 2024',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    created_at: '2024-03-01T10:15:00Z',
  },
  {
    user_id: 'usr-hm-03',
    workspace_id: 'ws-racs-core-8841',
    full_legal_name: 'Dr. David Vance',
    email: 'david.vance@racsai.enterprise.internal',
    role: ROLES.HIRING_MANAGER,
    department: 'Engineering Platforms',
    access_status: 'Active',
    mfaEnforced: true,
    joinedDate: 'Jan 2024',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    created_at: '2024-01-20T11:30:00Z',
  },
  {
    user_id: 'usr-hr-04',
    workspace_id: 'ws-racs-core-8841',
    full_legal_name: 'Eleanor Vance',
    email: 'eleanor.vance@racsai.enterprise.internal',
    role: ROLES.HR_REPRESENTATIVE,
    department: 'People Operations & Total Rewards',
    access_status: 'Active',
    mfaEnforced: true,
    joinedDate: 'Feb 2024',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    created_at: '2024-02-10T14:20:00Z',
  },
  {
    user_id: 'usr-eng-05',
    workspace_id: 'ws-racs-core-8841',
    full_legal_name: 'Kendra Washington',
    email: 'kendra.washington@racsai.enterprise.internal',
    role: ROLES.ENGAGEMENT_SPECIALIST,
    department: 'Candidate Experience & Onboarding',
    access_status: 'Active',
    mfaEnforced: true,
    joinedDate: 'Jun 2024',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    created_at: '2024-06-15T09:45:00Z',
  },
];

// Invitations Table schema mapping:
// invite_id, workspace_id, invite_token, invited_email, target_role, department, is_used, expires_at, created_by_user_id, created_at
export const INITIAL_INVITATIONS = [
  {
    invite_id: 'inv-tok-901a',
    workspace_id: 'ws-racs-core-8841',
    invite_token: 'tok_sec_77a91bf3402e88102948cda90',
    invited_email: 'sarah.lin@racsai.enterprise.internal',
    target_role: ROLES.HIRING_MANAGER,
    department: 'Design / UX Platforms',
    is_used: false,
    expires_at: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    created_by_user_id: 'usr-admin-01',
    created_at: new Date().toISOString(),
  },
  {
    invite_id: 'inv-tok-902b',
    workspace_id: 'ws-racs-core-8841',
    invite_token: 'tok_sec_33c829ef11a0029b991823ab4',
    invited_email: 'alex.recruiter@racsai.enterprise.internal',
    target_role: ROLES.TALENT_ACQUISITION,
    department: 'People Operations / Sourcing',
    is_used: false,
    expires_at: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    created_by_user_id: 'usr-admin-01',
    created_at: new Date().toISOString(),
  },
];

// Job Postings Table schema mapping:
// job_id, workspace_id, job_title, department, compensation_min, compensation_max, target_headcount, status ('Active'/'Deleted'), rubric_weights, created_at
export const INITIAL_JOB_POSTINGS = [
  {
    job_id: 'REQ-2024-089',
    workspace_id: 'ws-racs-core-8841',
    job_title: 'Senior React Engineer',
    department: 'Engineering - Frontend Platform',
    compensation_min: 185000,
    compensation_max: 210000,
    target_headcount: 2,
    status: 'Active',
    requestingHiringManager: 'Dr. David Vance (VP Eng)',
    equityBand: 'Tier 2 Equity Pool (10k - 15k RSUs)',
    activeAiProfile: 'React Enterprise Matrix v2.1 (TypeScript, Concurrent SSR, Web Vitals, Tailwind)',
    rubricWeights: {
      technicalProficiency: 35,
      systemArchitecture: 30,
      frameworkRecency: 20,
      cultureCollaboration: 15,
    },
    slaTargetDays: 3.0,
    currentSlaDays: 2.1,
    location: 'San Francisco, CA (Hybrid)',
    created_by_user_id: 'usr-hm-03',
    created_at: '2026-10-14T09:00:00Z',
  },
  {
    job_id: 'REQ-2024-072',
    workspace_id: 'ws-racs-core-8841',
    job_title: 'Lead AI Infrastructure Architect',
    department: 'AI Research - Core ML',
    compensation_min: 230000,
    compensation_max: 270000,
    target_headcount: 1,
    status: 'Active',
    requestingHiringManager: 'Dr. Elena Rostova (Head of Core ML)',
    equityBand: 'Principal L6 Equity (20k - 30k RSUs)',
    activeAiProfile: 'Distributed Training & CUDA Optimization v4.0 (PyTorch, Triton, DeepSpeed, NCCL)',
    rubricWeights: {
      technicalProficiency: 40,
      systemArchitecture: 35,
      frameworkRecency: 15,
      cultureCollaboration: 10,
    },
    slaTargetDays: 4.0,
    currentSlaDays: 3.2,
    location: 'Palo Alto, CA / Remote',
    created_by_user_id: 'usr-hm-03',
    created_at: '2026-10-10T14:20:00Z',
  },
  {
    job_id: 'REQ-2024-088',
    workspace_id: 'ws-racs-core-8841',
    job_title: 'Staff Product Designer',
    department: 'Design / UX Platforms',
    compensation_min: 170000,
    compensation_max: 195000,
    target_headcount: 1,
    status: 'Active',
    requestingHiringManager: 'Sarah Lin (Head of Design Systems)',
    equityBand: 'Senior Staff Pool (8k - 12k RSUs)',
    activeAiProfile: 'Design Systems & Enterprise UX (Figma Tokens, Design Engineering, Micro-Interactions)',
    rubricWeights: {
      technicalProficiency: 30,
      systemArchitecture: 25,
      frameworkRecency: 25,
      cultureCollaboration: 20,
    },
    slaTargetDays: 3.5,
    currentSlaDays: 2.8,
    location: 'San Francisco, CA / New York, NY',
    created_by_user_id: 'usr-hm-03',
    created_at: '2026-10-18T10:00:00Z',
  },
  {
    job_id: 'REQ-2024-091',
    workspace_id: 'ws-racs-core-8841',
    job_title: 'Principal Cloud Security Engineer',
    department: 'Global Admin & SecOps',
    compensation_min: 240000,
    compensation_max: 285000,
    target_headcount: 1,
    status: 'Active',
    requestingHiringManager: 'Dr. Arthur Vance (Root Admin)',
    equityBand: 'Principal L6 Equity',
    activeAiProfile: 'FedRAMP High & Zero-Trust Cloud SecOps (AWS IAM, Kubernetes Security, KMS)',
    rubricWeights: {
      technicalProficiency: 45,
      systemArchitecture: 30,
      frameworkRecency: 15,
      cultureCollaboration: 10,
    },
    slaTargetDays: 4.5,
    currentSlaDays: 3.6,
    location: 'Washington, DC / Hybrid',
    created_by_user_id: 'usr-admin-01',
    created_at: '2026-10-08T16:45:00Z',
  },
];

// Candidates Table schema mapping:
// candidate_id, job_id, workspace_id, candidate_name, candidate_email, resume_file_path, parsed_resume_text, pipeline_status
// pipeline_status values: 'Screening', 'HM Review', 'Interview Completed', 'Ready for Offer Authorization', 'Offer Dispatched & Awaiting Signature', 'Hired'
export const INITIAL_CANDIDATES = [
  {
    candidate_id: 'CAND-9041',
    id: 'CAND-9041',
    job_id: 'REQ-2024-089',
    targetRequisitionId: 'REQ-2024-089',
    workspace_id: 'ws-racs-core-8841',
    candidate_name: 'Marcus Sterling',
    name: 'Marcus Sterling',
    candidate_email: 'marcus.sterling@candidate.example.com',
    currentTitle: 'Staff Frontend Architect at FinTech Corp',
    location: 'San Francisco, CA (Remote/Hybrid)',
    experienceYears: 9,
    compensationExpectation: '$190k - $215k',
    resume_file_path: '/enclave/resumes/Marcus_Sterling_Resume_2026.pdf',
    resumeFileName: 'Marcus_Sterling_Resume_2026.pdf',
    resumeSize: '2.4 MB',
    parsed_resume_text: 'Marcus Sterling. 9+ years experience specializing in React concurrent features, Module Federation microfrontends, high-performance UI state hydration, and design token architectures. Led frontend migrations across 30+ services.',
    pipeline_status: 'Ready for Offer Authorization',
    status: 'Ready for Offer Authorization',
    overallMatch: 88,
    summary: `### Executive Match Assessment
Marcus Sterling presents 9+ years of distinguished frontend engineering tenure, currently serving as Staff Frontend Architect at FinTech Corp. Evaluated against the Lead Systems Architect requisition, candidate achieves an 88% composite role-fit score with exceptional depth in concurrent UI systems, module federation microfrontends, and performance optimization.

### Demonstrated Technical Capabilities
* **React 19 & Concurrent Patterns**: Deep expertise in automatic memoization, custom asynchronous hydration hooks, and fine-grained state boundaries.
* **Module Federation & Microfrontends**: Spearheaded zero-downtime decoupling across 30+ enterprise microservices with independent versioning.
* **Data Layer & Apollo GraphQL**: Replaced monolithic REST payloads with normalized Apollo Client GraphQL schemas, achieving a 53% reduction in payload serialization latencies.
* **Performance Engineering**: Bypassed standard reconciliation trees for high-frequency trading dashboards by piping real-time WebSockets directly into GPU-accelerated canvas buffers.

### Skill Gap Analysis & Ramp-Up Requirements
Demonstrates complete coverage across core required competencies (React, Redux, Apollo Client, GraphQL). Candidate lacks direct production eBPF kernel tracing experience; however, for a Frontend & Product Systems Architecture role, this is non-critical and can be ramped up smoothly.

### Targeted Interview Probe Recommendations
1. Discuss architectural trade-offs between SSR streaming, server actions, and edge static generation.
2. Probe experience troubleshooting cyclic dependencies and version mismatch collisions in Module Federation.
3. Review technical mentorship approach when driving company-wide framework migrations.

### Hiring Recommendation
STRONG HIRE. Candidate is an exceptional Staff-caliber architect with deep engineering rigor. Immediate offer routing strongly recommended.`,
    uploaded_by_user_id: 'usr-ta-02',
    sourcedBy: 'Mateo Morales (TA Lead)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-10-15T11:20:00Z',
    interviewChecklist: [
      { id: 'chk-1', category: 'Live Coding (10/10)', question: 'Write custom concurrent cache hydration hook with memoized fallback', passed: true, score: 9.8, note: 'Flawless execution, handled edge cases cleanly.' },
      { id: 'chk-2', category: 'System Architecture (10/10)', question: 'Design zero-downtime microfrontend deployment matrix with canary rollback', passed: true, score: 9.2, note: 'Excellent understanding of module boundaries.' },
      { id: 'chk-3', category: 'Framework Recency & Internals', question: 'Explain React Compiler automatic memoization vs manual useMemo optimization', passed: true, score: 9.5, note: 'Deep knowledge of React 19 AST transforms.' },
      { id: 'chk-4', category: 'Technical Mentorship', question: 'Conflict resolution during architectural migrations', passed: true, score: 8.8, note: 'Demonstrates seasoned servant leadership.' },
    ],
    interviewDebriefNotes: {
      interviewer: 'Dr. David Vance (VP Eng / Enterprise UI)',
      date: '2026-10-20T14:30:00Z',
      verdict: 'Strong Hire',
      verdictPill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      text: 'Candidate demonstrated deep mastery of React server components, client cache hydration, and concurrent mode. Handled system scale questions gracefully, particularly when troubleshooting memory leaks across long-lived dashboard micro-apps. Confidently articulated trade-offs between SSR streaming and edge static generation. Recommended for immediate offer routing.',
      scores: { liveCoding: 9.8, systemArchitecture: 9.2 },
      verbatimExcerpts: [
        { time: '14:12', quote: 'In our current high-frequency dashboard, we bypassed React state entirely for telemetry graphs by piping WebSockets directly into canvas buffers, shaving 40ms per frame.' },
        { time: '14:38', quote: 'When junior devs struggle with stale closures in custom hooks, I find visual timeline diagrams of the render cycle help demystify effect dependencies.' },
      ],
    },
    cryptographicSeal: {
      sha256: 'e8f7a90b4d5c1e2f3a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
      timestamp: '2026-10-20 18:45:12 UTC',
      auditLedgerSignature: 'SIG_ED25519_88a91cf02b919a930d',
      verifiedCheckpoints: {
        eeoTitleViiTokenMasking: true,
        salaryBandCompliance: true,
        referenceChecksPassed: true,
        backgroundCheckStatus: 'Clear - Verified by SterlingCheck',
      },
      immutableNotes: 'Hiring Manager formal recommendation submitted by Dr. David Vance on 2026-10-20. Read-only record locked against subsequent mutations.',
    },
    offerPackage: {
      baseSalary: 195000,
      equityRsus: 12500,
      signOnBonus: 20000,
      yearOneTarget: 255000,
      bandPositionPercentile: 65,
      bandMin: 185000,
      bandMax: 210000,
      caSb1162Compliance: '100% In-Band Compliant (CA SB 1162 / NY Equal Pay Verified)',
      anticipatedStartDate: '2026-11-18',
      approvalMatrix: [
        { role: 'Engineering Lead', approver: 'Dr. David Vance', status: 'Approved', timestamp: 'Oct 20, 2026' },
        { role: 'Finance / Compensation', approver: 'Sandra Washington', status: 'Approved', timestamp: 'Oct 21, 2026' },
        { role: 'HR Governance', approver: 'Eleanor Vance', status: 'Pending Final Dispatch', timestamp: 'Awaiting Authorization' },
      ],
      docusignEnvelopeId: 'DOCUSIGN-ENV-9941-SEC-2026-89',
    },
  },
  {
    candidate_id: 'CAND-9042',
    id: 'CAND-9042',
    job_id: 'REQ-2024-072',
    targetRequisitionId: 'REQ-2024-072',
    workspace_id: 'ws-racs-core-8841',
    candidate_name: 'Sophia Alvarez',
    name: 'Sophia Alvarez',
    candidate_email: 'sophia.alvarez@candidate.example.com',
    currentTitle: 'Lead AI Infrastructure Engineer at Scale AI Labs',
    location: 'San Francisco, CA / Palo Alto, CA',
    experienceYears: 11,
    compensationExpectation: '$240k - $275k',
    resume_file_path: '/enclave/resumes/Sophia_Alvarez_AI_Infra.pdf',
    resumeFileName: 'Sophia_Alvarez_AI_Infra.pdf',
    resumeSize: '3.1 MB',
    parsed_resume_text: 'Sophia Alvarez. 11+ years in High-Performance Computing (HPC) and distributed machine learning training clusters. Deep expertise in CUDA C++, Triton kernel optimization, NCCL ring all-reduce communication, and Slurm job scheduler operations.',
    pipeline_status: 'Ready for Offer Authorization',
    status: 'Ready for Offer Authorization',
    overallMatch: 95,
    summary: `### Executive Match Assessment
Sophia Alvarez brings 11+ years of world-class experience in High-Performance Computing (HPC) and distributed AI clusters, currently serving as Lead AI Infrastructure Engineer at Scale AI Labs. Her composite match score is an exceptional 95%, placing her in the top 1% of distributed infrastructure candidates evaluated this cycle.

### Demonstrated Technical Capabilities
* **CUDA & Low-Level Kernels**: Authored custom Triton kernels for FlashAttention-2, achieving 76% theoretical maximum TFLOPS on NVIDIA H100 clusters.
* **Collective Communication (NCCL)**: Re-architected all-reduce ring topology and gradient bucket sizing, eliminating pipeline bubbles and cutting distributed training checkpointing overhead by 42%.
* **Cluster Orchestration**: Built automated Slurm job recovery mechanisms with zero-downtime spot instance migration across 4,096 GPUs.

### Skill Gap Analysis & Ramp-Up Requirements
Zero critical blockers. Candidate exhibits full mastery across high-concurrency systems, low-level interconnects, and cluster diagnostics. Minor familiarization needed with proprietary internal telemetry enclaves.

### Targeted Interview Probe Recommendations
1. Discuss NCCL gradient quantization and communication overlap strategies during multi-node ZeRO-3 training.
2. Probe experience troubleshooting InfiniBand PFC deadlocks and RoCEv2 Congestion Notification packets.
3. Walk through incident response during large-scale GPU silent data corruption (SDC) detection.

### Hiring Recommendation
EXCEPTIONAL HIRE. Candidate is an industry leader in distributed GPU infrastructure. Immediate offer dispatch strongly advised.`,
    uploaded_by_user_id: 'usr-ta-02',
    sourcedBy: 'Mateo Morales (TA Lead)',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-10-16T14:10:00Z',
    interviewChecklist: [
      { id: 'chk-1', category: 'Distributed Training Systems', question: 'Design fault-tolerant checkpointing with DeepSpeed ZeRO-3', passed: true, score: 9.9, note: 'State-of-the-art knowledge.' },
      { id: 'chk-2', category: 'CUDA / Hardware Kernel Optimization', question: 'Implement custom fused FlashAttention kernel using OpenAI Triton', passed: true, score: 9.7, note: 'Near theoretical maximum memory bandwidth achieved.' },
      { id: 'chk-3', category: 'Network Interconnects', question: 'Analyze InfiniBand RoCEv2 packet loss and PFC deadlock avoidance', passed: true, score: 9.4, note: 'Exceptional networking acumen.' },
    ],
    interviewDebriefNotes: {
      interviewer: 'Dr. Elena Rostova',
      date: '2026-10-21T16:00:00Z',
      verdict: 'Strong Hire',
      verdictPill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      text: 'One of the best AI infrastructure candidates seen in the last 24 months. Exceptional depth in both software runtimes and hardware topologies.',
      scores: { liveCoding: 9.9, systemArchitecture: 9.8 },
      verbatimExcerpts: [
        { time: '16:22', quote: 'By replacing standard PyTorch all-reduce calls with custom overlap kernels, we recovered 18% idle GPU time on 1,024 H100 clusters.' },
      ],
    },
    cryptographicSeal: {
      sha256: '992a01928471b029384710293847102938471029384710293847102938471029',
      timestamp: '2026-10-21 17:30:00 UTC',
      auditLedgerSignature: 'SIG_ED25519_992a01bce',
      verifiedCheckpoints: {
        eeoTitleViiTokenMasking: true,
        salaryBandCompliance: true,
        referenceChecksPassed: true,
        backgroundCheckStatus: 'Clear - Verified by HireRight',
      },
      immutableNotes: 'Dr. Elena Rostova formal recommendation locked. Ready for offer routing.',
    },
    offerPackage: {
      baseSalary: 255000,
      equityRsus: 25000,
      signOnBonus: 35000,
      yearOneTarget: 345000,
      bandPositionPercentile: 72,
      bandMin: 230000,
      bandMax: 270000,
      caSb1162Compliance: '100% In-Band Compliant (CA SB 1162 / NY Equal Pay Verified)',
      anticipatedStartDate: '2026-12-01',
      approvalMatrix: [
        { role: 'Engineering Lead', approver: 'Dr. Elena Rostova', status: 'Approved', timestamp: 'Oct 21, 2026' },
        { role: 'Finance / Compensation', approver: 'Sandra Washington', status: 'Approved', timestamp: 'Oct 21, 2026' },
        { role: 'HR Governance', approver: 'Eleanor Vance', status: 'Pending Final Dispatch', timestamp: 'Awaiting Authorization' },
      ],
      docusignEnvelopeId: 'DOCUSIGN-ENV-7712-AI-2026-72',
    },
  },
  {
    candidate_id: 'CAND-9043',
    id: 'CAND-9043',
    job_id: 'REQ-2024-088',
    targetRequisitionId: 'REQ-2024-088',
    workspace_id: 'ws-racs-core-8841',
    candidate_name: 'Taro Takahashi',
    name: 'Taro Takahashi',
    candidate_email: 'taro.takahashi@candidate.example.com',
    currentTitle: 'Staff Design Technologist at Linear Labs',
    location: 'San Francisco, CA / Tokyo (Remote)',
    experienceYears: 8,
    compensationExpectation: '$175k - $195k',
    resume_file_path: '/enclave/resumes/Taro_Takahashi_Portfolio_Staff.pdf',
    resumeFileName: 'Taro_Takahashi_Portfolio_Staff.pdf',
    resumeSize: '4.8 MB',
    parsed_resume_text: 'Taro Takahashi. 8+ years leading design systems engineering, cross-platform token synchronizers, and high-frequency ergonomic micro-interactions in React and Tailwind.',
    pipeline_status: 'Offer Dispatched & Awaiting Signature',
    status: 'Offer Dispatched & Awaiting Signature',
    overallMatch: 92,
    summary: `### Executive Match Assessment
Taro Takahashi presents 8+ years leading design systems engineering and frontend architecture, currently operating as Staff Design Technologist at Linear Labs. Evaluated at 92% match score, demonstrating exceptional craftsmanship and technical rigor.

### Demonstrated Technical Capabilities
* **Design Token Architecture**: Pioneered multi-brand, cross-platform token pipeline synchronizing Figma variables directly to CSS custom properties and React Native styles in CI/CD.
* **Ergonomic Micro-Interactions**: Built ultra-low latency gesture controllers and keyboard navigation handlers in React 19 running at steady 120 FPS.
* **Component Modularity**: Authored headless accessible component primitives compliant with WCAG 2.1 AAA accessibility guidelines.

### Skill Gap Analysis & Ramp-Up Requirements
Full coverage of design system principles, token synchronization, and high-performance UI rendering. No material gaps identified.

### Targeted Interview Probe Recommendations
1. Discuss token transformation pipelines and automated contrast ratio testing during pull request gates.
2. Probe experience managing breaking component API changes across 50+ consuming product repositories.

### Hiring Recommendation
STRONG HIRE. Best-in-class design systems technologist. Offer package already finalized and awaiting signature.`,
    uploaded_by_user_id: 'usr-ta-02',
    sourcedBy: 'Mateo Morales (TA Lead)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-10-18T10:15:00Z',
    interviewChecklist: [],
    interviewDebriefNotes: {
      interviewer: 'Sarah Lin',
      date: '2026-10-21T11:00:00Z',
      verdict: 'Strong Hire',
      verdictPill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      text: 'Stunning portfolio presentation. Exact match for our M3 design system.',
      scores: { liveCoding: 9.4, systemArchitecture: 9.3 },
      verbatimExcerpts: [],
    },
    cryptographicSeal: {
      sha256: '4410a8b9c2014e8f9901bc244a0e9821f00b9a87d654c321e0fba9841fbc0214',
      timestamp: '2026-10-21 16:30:00 UTC',
      auditLedgerSignature: 'SIG_ED25519_4488bb11cce',
      verifiedCheckpoints: {
        eeoTitleViiTokenMasking: true,
        salaryBandCompliance: true,
        referenceChecksPassed: true,
        backgroundCheckStatus: 'Clear',
      },
      immutableNotes: 'Sarah Lin formal debrief completed. Routed for compensation synthesis.',
    },
    offerPackage: {
      baseSalary: 185000,
      equityRsus: 10000,
      signOnBonus: 15000,
      yearOneTarget: 220000,
      bandPositionPercentile: 60,
      bandMin: 170000,
      bandMax: 195000,
      caSb1162Compliance: '100% In-Band Compliant',
      anticipatedStartDate: '2026-11-25',
      approvalMatrix: [
        { role: 'Engineering Lead', approver: 'Sarah Lin', status: 'Approved', timestamp: 'Oct 21, 2026' },
        { role: 'Finance / Compensation', approver: 'Sandra Washington', status: 'Approved', timestamp: 'Oct 21, 2026' },
        { role: 'HR Governance', approver: 'Eleanor Vance', status: 'Authorized & Dispatched', timestamp: 'Oct 21, 2026' },
      ],
      docusignEnvelopeId: 'DOCUSIGN-ENV-8821-UX-2026-88',
    },
  },
  {
    candidate_id: 'CAND-9044',
    id: 'CAND-9044',
    job_id: 'REQ-2024-091',
    targetRequisitionId: 'REQ-2024-091',
    workspace_id: 'ws-racs-core-8841',
    candidate_name: 'Elena Wu',
    name: 'Elena Wu',
    candidate_email: 'elena.wu@candidate.example.com',
    currentTitle: 'Principal Security Architect at CloudFlare',
    location: 'Washington, DC (Hybrid)',
    experienceYears: 12,
    compensationExpectation: '$260k - $290k',
    resume_file_path: '/enclave/resumes/Elena_Wu_Security_Principal.pdf',
    resumeFileName: 'Elena_Wu_Security_Principal.pdf',
    resumeSize: '1.9 MB',
    parsed_resume_text: 'Elena Wu. 12+ years in zero-trust enterprise security, FedRAMP High authorizations, AWS KMS envelope encryption, and HSM hardware infrastructure operations.',
    pipeline_status: 'HM Review',
    status: 'HM Review',
    overallMatch: 79,
    summary: `### Executive Match Assessment
Elena Wu brings 12+ years of enterprise cybersecurity leadership, serving as Principal Security Architect at CloudFlare. Evaluated at a 79% match for specialized zero-trust security infrastructure.

### Demonstrated Technical Capabilities
* **Zero-Trust Enclaves**: Architected FIPS 140-3 Level 4 hardware security module (HSM) key hierarchies and confidential VM compute enclaves.
* **FedRAMP High & Compliance**: Directed authorization package approvals for federal cloud environments and DoD IL5 impact level baselines.
* **KMS Envelope Encryption**: Implemented real-time AES-256-GCM envelope key rotation and cryptographically audited signing services.

### Skill Gap Analysis & Ramp-Up Requirements
Primary focus has been at the infrastructure and protocol layer rather than product application engineering. Needs lightweight ramp-up on internal application workflow frameworks.

### Targeted Interview Probe Recommendations
1. Discuss side-channel timing attack mitigations in memory-safe Rust/Go crypto implementations.
2. Probe experience responding to zero-day hardware hypervisor vulnerabilities in multi-tenant clouds.

### Hiring Recommendation
RECOMMENDED FOR TECHNICAL INTERVIEW. Deep enterprise security acumen with unmatched pedigree for sensitive data enclaves.`,
    uploaded_by_user_id: 'usr-ta-02',
    sourcedBy: 'Mateo Morales (TA Lead)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-10-19T08:30:00Z',
    interviewChecklist: [],
    interviewDebriefNotes: null,
    cryptographicSeal: null,
    offerPackage: null,
  },
  {
    candidate_id: 'CAND-9045',
    id: 'CAND-9045',
    job_id: 'REQ-2024-089',
    targetRequisitionId: 'REQ-2024-089',
    workspace_id: 'ws-racs-core-8841',
    candidate_name: 'Alex Kowalski',
    name: 'Alex Kowalski',
    candidate_email: 'alex.kowalski@candidate.example.com',
    currentTitle: 'Senior FullStack Engineer at NextGen Cloud',
    location: 'Austin, TX (Remote)',
    experienceYears: 6,
    compensationExpectation: '$170k - $190k',
    resume_file_path: '/enclave/resumes/Alex_Kowalski_FullStack.pdf',
    resumeFileName: 'Alex_Kowalski_FullStack.pdf',
    resumeSize: '2.8 MB',
    parsed_resume_text: 'Alex Kowalski. 6 years experience building modern web applications with React, Next.js, Node.js, and TypeScript. Experience with GraphQL APIs and state management.',
    pipeline_status: 'Screening',
    status: 'Screening',
    overallMatch: 76,
    summary: `### Executive Match Assessment
Alex Kowalski presents 6 years of full-stack web engineering experience across mid-market SaaS startups, currently at NextGen Cloud. Evaluated at a 76% composite match against Senior Frontend Engineering criteria.

### Demonstrated Technical Capabilities
* **Modern Frontend Tooling**: Solid foundation in React, Next.js App Router, Tailwind CSS, and TypeScript.
* **API Integration**: Experience consuming and stitching GraphQL queries with Relay and Apollo Client.
* **Full-Stack Fluency**: Versatile in building backend REST endpoints using Node.js and PostgreSQL.

### Skill Gap Analysis & Ramp-Up Requirements
Candidate has primarily operated on standard greenfield apps; lacks demonstrated experience with microfrontends, high-throughput canvas rendering, or complex state hydration architectures required for Staff-level scale.

### Targeted Interview Probe Recommendations
1. Test practical depth in React 19 concurrent features and automatic batching.
2. Examine testing methodology and test pyramid execution with Vitest and Cypress.

### Hiring Recommendation
ADVANCE TO INITIAL SCREENING. Candidate is a strong senior contributor who can handle core feature delivery with moderate mentorship on large-scale architecture.`,
    uploaded_by_user_id: 'usr-ta-02',
    sourcedBy: 'Mateo Morales (TA Lead)',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-10-21T11:00:00Z',
    interviewChecklist: [],
    interviewDebriefNotes: null,
    cryptographicSeal: null,
    offerPackage: null,
  },
];

// AI Evaluations Table schema mapping:
// evaluation_id, candidate_id, job_id, workspace_id, match_score_percent, matched_skills_json, missing_skills_json, is_immutable = TRUE
export const INITIAL_AI_EVALUATIONS = {
  'CAND-9041': {
    evaluation_id: 'eval-9041-sec',
    candidate_id: 'CAND-9041',
    job_id: 'REQ-2024-089',
    workspace_id: 'ws-racs-core-8841',
    match_score_percent: 88,
    is_immutable: true,
    aiSummary:
      'Marcus represents a tier-one profile for REQ-2024-089. Demonstrates advanced expertise architecting high-throughput microfrontends with Module Federation, combined with rigorous enterprise React performance tuning (profiling renders, memoization pipelines, SSR concurrent watermarks). Proven team leadership track record across a 14-person distributed UI organization. Minor ramp-up identified in native AWS infrastructure orchestration, which is deemed non-blocking.',
    matched_skills_json: [
      { name: 'TypeScript & React 19 Core', confidence: 99, verified: true },
      { name: 'Concurrent Rendering & SSR Hydration', confidence: 96, verified: true },
      { name: 'Microfrontends (Module Federation)', confidence: 94, verified: true },
      { name: 'State Management (Zustand / Redux Toolkit)', confidence: 95, verified: true },
      { name: 'Web Vitals & Performance Profiling', confidence: 92, verified: true },
      { name: 'Large-scale Design System Architecture', confidence: 90, verified: true },
    ],
    missing_skills_json: [
      { name: 'Terraform Infrastructure Provisioning', severity: 'Low', impact: 'Team has dedicated DevOps' },
      { name: 'Direct Rust / WASM Module Tooling', severity: 'Informational', impact: 'Not required for initial deliverables' },
    ],
    dimensional_scores: {
      technicalProficiency: 94,
      systemArchitecture: 89,
      frameworkRecency: 92,
      cultureMentorship: 85,
    },
    evaluated_at: '2026-10-15T11:22:00Z',
  },
  'CAND-9042': {
    evaluation_id: 'eval-9042-sec',
    candidate_id: 'CAND-9042',
    job_id: 'REQ-2024-072',
    workspace_id: 'ws-racs-core-8841',
    match_score_percent: 95,
    is_immutable: true,
    aiSummary:
      'Exceptional high-performance candidate with direct deep-learning infrastructure background. Demonstrates world-class mastery of Triton GPU kernel compilation, NCCL ring communication, and distributed checkpointing for 100B+ parameter LLMs.',
    matched_skills_json: [
      { name: 'PyTorch & Distributed Training', confidence: 99, verified: true },
      { name: 'CUDA C++ & Triton Kernel Writing', confidence: 97, verified: true },
      { name: 'InfiniBand & NCCL Interconnects', confidence: 96, verified: true },
      { name: 'DeepSpeed ZeRO & Megatron-LM', confidence: 98, verified: true },
    ],
    missing_skills_json: [],
    dimensional_scores: {
      technicalProficiency: 98,
      systemArchitecture: 96,
      frameworkRecency: 95,
      cultureMentorship: 90,
    },
    evaluated_at: '2026-10-16T14:12:00Z',
  },
  'CAND-9043': {
    evaluation_id: 'eval-9043-sec',
    candidate_id: 'CAND-9043',
    job_id: 'REQ-2024-088',
    workspace_id: 'ws-racs-core-8841',
    match_score_percent: 92,
    is_immutable: true,
    aiSummary:
      'Taro is a world-class design systems engineering specialist with exceptional aesthetic polish matching modern software like Linear and Avea. Built multi-brand token sync tools in React and Figma Plugins.',
    matched_skills_json: [
      { name: 'Figma Variables & Token Architecture', confidence: 99, verified: true },
      { name: 'React & Tailwind Implementation', confidence: 95, verified: true },
      { name: 'Enterprise Ergonomics & Information Density', confidence: 96, verified: true },
    ],
    missing_skills_json: [],
    dimensional_scores: {
      technicalProficiency: 92,
      systemArchitecture: 90,
      frameworkRecency: 95,
      cultureMentorship: 94,
    },
    evaluated_at: '2026-10-18T10:18:00Z',
  },
  'CAND-9044': {
    evaluation_id: 'eval-9044-sec',
    candidate_id: 'CAND-9044',
    job_id: 'REQ-2024-091',
    workspace_id: 'ws-racs-core-8841',
    match_score_percent: 79,
    is_immutable: true,
    aiSummary:
      'Elena brings robust FedRAMP High and DoD compliance background. Has deep knowledge of Hardware Security Modules (HSM) and AWS KMS envelope encryption.',
    matched_skills_json: [
      { name: 'Hardware Security Module (HSM) & KMS', confidence: 96, verified: true },
      { name: 'FedRAMP High & NIST 800-53', confidence: 94, verified: true },
      { name: 'Zero-Trust Network Architecture', confidence: 92, verified: true },
    ],
    missing_skills_json: [
      { name: 'eBPF Kernel Monitoring Tools', severity: 'Medium', impact: 'Training can be provided during onboarding' },
    ],
    dimensional_scores: {
      technicalProficiency: 88,
      systemArchitecture: 85,
      frameworkRecency: 78,
      cultureMentorship: 82,
    },
    evaluated_at: '2026-10-19T08:35:00Z',
  },
  'CAND-9045': {
    evaluation_id: 'eval-9045-sec',
    candidate_id: 'CAND-9045',
    job_id: 'REQ-2024-089',
    workspace_id: 'ws-racs-core-8841',
    match_score_percent: 76,
    is_immutable: true,
    aiSummary:
      'Solid generalist fullstack engineer with good React and Node.js fundamentals. Would require mentoring on enterprise concurrent mode optimization and microfrontend boundaries.',
    matched_skills_json: [
      { name: 'React 18 & Next.js Basics', confidence: 88, verified: true },
      { name: 'Node.js & REST APIs', confidence: 85, verified: true },
      { name: 'TypeScript Fundamentals', confidence: 82, verified: true },
    ],
    missing_skills_json: [
      { name: 'Module Federation Microfrontends', severity: 'High', impact: 'Core requirement for REQ-2024-089' },
      { name: 'SSR Hydration Diagnostics', severity: 'Medium', impact: 'Ramp-up needed' },
    ],
    dimensional_scores: {
      technicalProficiency: 78,
      systemArchitecture: 72,
      frameworkRecency: 80,
      cultureMentorship: 75,
    },
    evaluated_at: '2026-10-21T11:05:00Z',
  },
};

// Candidate Status History Table schema mapping:
// history_id, candidate_id, workspace_id, old_status, new_status, changed_by, changed_at, reason
export const INITIAL_STATUS_HISTORY = [
  {
    history_id: 'hist-001',
    candidate_id: 'CAND-9041',
    workspace_id: 'ws-racs-core-8841',
    old_status: 'Screening',
    new_status: 'HM Review',
    changed_by: 'Mateo Morales (TA Lead)',
    changed_at: '2026-10-16T10:00:00Z',
    reason: 'Candidate surpassed 85% AI match threshold for Frontend Platform.',
  },
  {
    history_id: 'hist-002',
    candidate_id: 'CAND-9041',
    workspace_id: 'ws-racs-core-8841',
    old_status: 'HM Review',
    new_status: 'Ready for Offer Authorization',
    changed_by: 'Dr. David Vance (VP Eng)',
    changed_at: '2026-10-20T18:45:12Z',
    reason: 'Strong Hire verdict with SHA-256 sealed debrief.',
  },
];

// HR Handoff Reports Table schema mapping:
// report_id, candidate_id, job_id, workspace_id, hiring_manager_id, final_hm_notes, verdict, sha256_digest, is_immutable = TRUE, created_at
export const INITIAL_HR_HANDOFF_REPORTS = [
  {
    report_id: 'rep-9041-sec',
    candidate_id: 'CAND-9041',
    job_id: 'REQ-2024-089',
    workspace_id: 'ws-racs-core-8841',
    hiring_manager_id: 'usr-hm-03',
    final_hm_notes: 'Formal technical debrief locked by Dr. David Vance. Handled microfrontend module boundary latency questions cleanly. Field rendered legally immutable (read-only) for HR governance.',
    verdict: 'Strong Hire',
    sha256_digest: 'e8f7a90b4d5c1e2f3a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
    is_immutable: true,
    created_at: '2026-10-20T18:45:12Z',
  },
  {
    report_id: 'rep-9042-sec',
    candidate_id: 'CAND-9042',
    job_id: 'REQ-2024-072',
    workspace_id: 'ws-racs-core-8841',
    hiring_manager_id: 'usr-hm-03',
    final_hm_notes: 'Exceptional deep-learning distributed systems engineer. Unanimous recommendation for immediate offer generation.',
    verdict: 'Strong Hire',
    sha256_digest: '992a01928471b029384710293847102938471029384710293847102938471029',
    is_immutable: true,
    created_at: '2026-10-21T17:30:00Z',
  },
];

// Tenant API Keys Table schema mapping (BYOK):
// key_id, workspace_id, provider_name ('OpenAI'/'Gemini'), model_name, encrypted_api_key (VARBINARY), last_rotated
export const INITIAL_TENANT_API_KEYS = {
  key_id: 'key-byok-live-891',
  workspace_id: 'ws-racs-core-8841',
  provider_name: 'OpenAI',
  model_name: 'OpenAI GPT-4o Enterprise',
  encrypted_api_key: 'sk-ant-prod-88xFAk2Kp4001a2zRRN-enterprise-live',
  masked_key: '••••••••••••••••••••••••••••••••••••-live',
  token_limit: '142M tokens / month',
  tokens_used: '43.2M (30.4%)',
  last_rotated: '6 days ago',
  hsm_status: 'Hardware Security Module (HSM) Verified AES-256',
  endpoint: 'https://api.openai.com/v1',
};

// Security Audit Logs
export const INITIAL_AUDIT_LOGS = [
  {
    id: 'AUD-89104',
    event: 'BYOK Reference Key Re-Encrypted',
    principal: 'Dr. Arthur Vance (Root Admin)',
    target: 'KMS::AES-256-GCM / OpenAI-GPT4o-Live',
    timestamp: '2026-10-22 01:45:00 UTC',
    ipAddress: '10.240.12.8 (Internal VPC)',
    status: 'VERIFIED',
    sha256Digest: 'a891f9b0213ec84a7e8019b8c24f33198e0a12cfb419820c7e5a0192f8103c81',
    tamperSeal: 'HMAC_SHA256_0x77ae98',
  },
  {
    id: 'AUD-89103',
    event: 'Candidate Hand-off Record Sealed',
    principal: 'Dr. David Vance (VP Eng)',
    target: 'Candidate #CAND-9041 (Marcus Sterling)',
    timestamp: '2026-10-20 18:45:12 UTC',
    ipAddress: '10.240.15.42 (Internal VPC)',
    status: 'VERIFIED',
    sha256Digest: 'e8f7a90b4d5c1e2f3a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
    tamperSeal: 'IMMUTABLE_LOCKED',
  },
  {
    id: 'AUD-89102',
    event: 'EEOC Title VII Token Masking Enforced',
    principal: 'RACS AI Autonomous OCR Engine v4.2',
    target: 'Batch Resume Ingestion #BATCH-412 (5 Profiles)',
    timestamp: '2026-10-20 14:15:22 UTC',
    ipAddress: '10.128.0.4 (Worker Enclave)',
    status: 'VERIFIED',
    sha256Digest: 'c441b8021948aec841109bc244a0e9821f00b9a87d654c321e0fba9841fbc021',
    tamperSeal: 'ZERO_DATA_RETENTION',
  },
  {
    id: 'AUD-89101',
    event: 'Executive Offer Approval Dispatched',
    principal: 'Eleanor Vance (HR Governance)',
    target: 'Candidate #CAND-9043 (Taro Takahashi)',
    timestamp: '2026-10-21 16:40:00 UTC',
    ipAddress: '10.240.12.19 (Internal VPC)',
    status: 'VERIFIED',
    sha256Digest: '9012bb44a1082ce77411082cba0192e84102938471b029384710293847102938',
    tamperSeal: 'DOCUSIGN_HASH_CHAINED',
  },
  {
    id: 'AUD-89100',
    event: 'Cryptographic Workspace Enclave Initialized',
    principal: 'Dr. Arthur Vance (Root Admin)',
    target: 'Workspace ws-racs-core-8841 (RACS AI Autonomous Technologies Inc.)',
    timestamp: '2026-01-10 08:00:00 UTC',
    ipAddress: '10.240.12.8 (Internal VPC)',
    status: 'VERIFIED',
    sha256Digest: '33910aa810293847102938471029384710293847102938471029384710293847',
    tamperSeal: 'ROOT_INITIALIZATION',
  },
];

// Engagement Sequences
export const INITIAL_SEQUENCES = [
  {
    id: 'SEQ-101',
    name: 'Executive Technical Pre-Boarding Cadence',
    targetRole: 'Senior React Engineer & Principal Leads',
    totalEnrolled: 3,
    completionRate: 92,
    active: true,
    steps: [
      {
        day: 0,
        trigger: 'Offer Accepted by Candidate',
        subject: 'Welcome to RACS AI — Your Leadership Journey Begins',
        snippet: 'Congratulations! We are thrilled to welcome you to the Enterprise Core Frontend Platform team...',
        sentCount: 3,
        openRate: 100,
      },
      {
        day: 3,
        trigger: '3 Days Post-Acceptance',
        subject: 'Hardware Provisioning & Cloud Enclave Access Credentials',
        snippet: 'Choose your Apple M3 Max or ThinkPad P1 workstation along with your YubiKey FIDO2 token selection...',
        sentCount: 3,
        openRate: 100,
      },
      {
        day: 7,
        trigger: '7 Days Post-Acceptance (Standard Cadence)',
        subject: 'Meet Your Engineering Buddy & Architecture Stack Briefing',
        snippet: 'Ahead of your start date, Dr. David Vance would like to introduce you to your designated onboarding buddy...',
        sentCount: 2,
        openRate: 100,
      },
      {
        day: 14,
        trigger: '48 Hours Prior to Day 1',
        subject: 'First Day Itinerary, Day-1 Schedule, and Orientation Agenda',
        snippet: 'Here is your personalized Day 1 agenda starting at 9:30 AM PST with our Executive Welcome...',
        sentCount: 1,
        openRate: 100,
      },
    ],
  },
  {
    id: 'SEQ-102',
    name: 'General Technical Onboarding & Culture Nurture',
    targetRole: 'All Technical Hires',
    totalEnrolled: 4,
    completionRate: 86,
    active: true,
    steps: [
      {
        day: 0,
        trigger: 'Offer Signed',
        subject: 'Welcome to the Team — RACS AI Culture & Values Handbook',
        snippet: 'Our engineering principles prioritize zero-trust security, explainable AI, and developer velocity...',
        sentCount: 4,
        openRate: 100,
      },
      {
        day: 5,
        trigger: '5 Days Post-Acceptance',
        subject: 'Open Source Perks & Continuous Learning Stipend ($5,000/yr)',
        snippet: 'Every engineer at RACS AI receives an annual budget for conferences, research papers, and compute credits...',
        sentCount: 3,
        openRate: 90,
      },
    ],
  },
];

// Helper: initial requisitions alias
export const INITIAL_REQUISITIONS = INITIAL_JOB_POSTINGS;
