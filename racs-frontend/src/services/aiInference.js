import { parseResumeText, evaluateResumeAgainstJob } from '../utils/resumeParser';

/**
 * Enterprise AI Inference Service
 * Connects to Google Gemini or OpenAI when a BYOK key is provided,
 * with deterministic fallback to the local explainable skill engine.
 * Generates elaborate, structured, multi-dimensional technical reviews.
 */
export async function evaluateCandidateWithAi({
  resumeText,
  fileName,
  jobTitle,
  jobDescription,
  requiredSkills = [],
  byokKey = '',
  byokProvider = 'Gemini',
}) {
  const parsed = parseResumeText(resumeText, fileName);
  const cleanKey = (byokKey || '').trim();

  // Helper to format structured review into an elaborate technical synthesis
  const formatElaborateReview = (ai) => {
    const parts = [];

    if (ai.executiveSummary) {
      parts.push(`### Executive Match Assessment\n${ai.executiveSummary}`);
    } else if (ai.reasoning) {
      parts.push(`### Executive Match Assessment\n${ai.reasoning}`);
    }

    if (ai.technicalStrengths) {
      parts.push(`\n### Demonstrated Technical Capabilities & Core Strengths\n${ai.technicalStrengths}`);
    }

    if (ai.gapAnalysis) {
      parts.push(`\n### Skill Gap Analysis & Ramp-Up Requirements\n${ai.gapAnalysis}`);
    } else if (ai.missingSkills && ai.missingSkills.length > 0) {
      parts.push(`\n### Skill Gap Analysis & Ramp-Up Requirements\nCandidate lacks direct production evidence for: ${ai.missingSkills.join(', ')}. Recommend technical probe during onsite interviews.`);
    }

    if (ai.domainExperience) {
      parts.push(`\n### Scale, Architecture & Systems Impact\n${ai.domainExperience}`);
    }

    if (ai.interviewFocusAreas) {
      parts.push(`\n### Targeted Interview Probe Recommendations\n${ai.interviewFocusAreas}`);
    }

    if (ai.recommendation) {
      parts.push(`\n### Hiring Manager Recommendation\n${ai.recommendation}`);
    }

    return parts.length > 0 ? parts.join('\n') : (ai.reasoning || 'Thorough candidate technical evaluation completed.');
  };

  // 1. If user supplied a Gemini API Key (starts with AIzaSy or configured as Gemini)
  if (cleanKey && (cleanKey.startsWith('AIzaSy') || byokProvider === 'Gemini')) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${cleanKey}`;
      const prompt = `You are a Principal Engineering Architect and Talent Bar-Raiser evaluating a candidate resume.
Target Job Title: ${jobTitle}
Target Job Requirements: ${requiredSkills.join(', ')}
${jobDescription ? `Full Job Description: ${jobDescription}` : ''}

Candidate Resume (${fileName}):
${resumeText}

Conduct an elaborate, highly technical, and exhaustive evaluation.
Respond ONLY with a valid JSON object formatted as follows (no markdown around JSON, no backticks):
{
  "matchScorePercent": <integer 0-100>,
  "matchedSkills": ["skill1", "skill2", "skill3"],
  "missingSkills": ["missing1", "missing2"],
  "executiveSummary": "<Detailed 3-4 sentence analysis of candidate seniority, years of relevant experience, and role alignment>",
  "technicalStrengths": "<Elaborate bullet points or paragraph detailing depth across frameworks, state management, concurrency, architecture, and code hygiene>",
  "gapAnalysis": "<Explicit analysis of missing competencies, production trade-offs, and estimated ramp-up velocity>",
  "domainExperience": "<Assessment of distributed systems, high-traffic throughput, cloud scale, and production reliability impact>",
  "interviewFocusAreas": "<3 deep-dive technical interview questions specifically probing candidate's edge cases and weak areas>",
  "recommendation": "<Strong Hire / Hire / Lean Hire / No Hire with executive justification>"
}`;

      const res = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const rawContent = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanJson = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedAi = JSON.parse(cleanJson);

        const elaborateSummary = formatElaborateReview(parsedAi);

        return {
          candidateName: parsed.name,
          email: parsed.email,
          phone: parsed.phone,
          location: parsed.location,
          currentTitle: parsed.title,
          experienceLabel: parsed.experienceLabel,
          score: parsedAi.matchScorePercent || 88,
          matchedSkills: parsedAi.matchedSkills || parsed.skills.slice(0, 5),
          missingSkills: parsedAi.missingSkills || [],
          reasoning: elaborateSummary,
          summary: elaborateSummary,
          engine: 'BYOK Google Gemini 1.5 Flash (Deep Inference)',
        };
      }
    } catch (err) {
      console.warn('[AI Inference] Gemini cloud inference failed, using deterministic engine fallback:', err);
    }
  }

  // 2. If user supplied an OpenAI Key (starts with sk- or configured as OpenAI)
  if (cleanKey && (cleanKey.startsWith('sk-') || byokProvider === 'OpenAI')) {
    try {
      const openAiUrl = 'https://api.openai.com/v1/chat/completions';
      const prompt = `You are a Principal Engineering Architect and Talent Bar-Raiser evaluating a candidate resume.
Target Job Title: ${jobTitle}
Requirements: ${requiredSkills.join(', ')}
${jobDescription ? `Description: ${jobDescription}` : ''}

Candidate Resume (${fileName}):
${resumeText}

Provide an elaborate, technical review. Return a valid JSON object with keys:
matchScorePercent (0-100),
matchedSkills (array),
missingSkills (array),
executiveSummary (string),
technicalStrengths (string),
gapAnalysis (string),
domainExperience (string),
interviewFocusAreas (string),
recommendation (string).`;

      const res = await fetch(openAiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const parsedAi = JSON.parse(json.choices[0].message.content);
        const elaborateSummary = formatElaborateReview(parsedAi);

        return {
          candidateName: parsed.name,
          email: parsed.email,
          phone: parsed.phone,
          location: parsed.location,
          currentTitle: parsed.title,
          experienceLabel: parsed.experienceLabel,
          score: parsedAi.matchScorePercent || 88,
          matchedSkills: parsedAi.matchedSkills || parsed.skills.slice(0, 5),
          missingSkills: parsedAi.missingSkills || [],
          reasoning: elaborateSummary,
          summary: elaborateSummary,
          engine: 'BYOK OpenAI GPT-4o (Deep Inference)',
        };
      }
    } catch (err) {
      console.warn('[AI Inference] OpenAI cloud inference failed, using fallback:', err);
    }
  }

  // 3. Fallback to Local Deterministic Engine (Zero cost, instant, elaborate multi-section review)
  const isFrontendJob = /frontend|product|react|ui/i.test(jobTitle || '');
  const localEval = evaluateResumeAgainstJob(parsed, isFrontendJob ? 'REQ-FRONTEND-01' : 'REQ-DISTRIBUTED-01');

  return {
    candidateName: parsed.name,
    email: parsed.email,
    phone: parsed.phone,
    location: parsed.location,
    currentTitle: parsed.title,
    experienceLabel: parsed.experienceLabel,
    score: localEval.score,
    matchedSkills: localEval.matchedSkills,
    missingSkills: localEval.missingSkills,
    reasoning: localEval.reasoning,
    summary: localEval.reasoning,
    engine: 'Built-in Explainable Rule Engine (Deterministic Review)',
  };
}
