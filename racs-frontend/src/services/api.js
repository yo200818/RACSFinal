// HTTP REST client for communicating with the Spring Boot backend (/api)

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type') || '';
    let data = null;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        (data && typeof data === 'object' && (data.error || data.message)) ||
        (typeof data === 'string' && data) ||
        `HTTP ${response.status}: ${response.statusText}`;
      return { ok: false, status: response.status, error: errorMessage, data };
    }

    return { ok: true, status: response.status, data };
  } catch (err) {
    console.warn(`[API] Network error calling ${url}:`, err);
    return { ok: false, error: err.message || 'Network connection failed' };
  }
}

export const api = {
  // 1. Workspaces
  async signupWorkspace(payload) {
    return request('/workspaces/signup', {
      method: 'POST',
      body: JSON.stringify({
        companyName: payload.companyName,
        companyAddress: payload.companyAddress,
        gstin: payload.gstin,
        companyPhone: payload.companyPhone,
        adminFullName: payload.adminFullName,
        adminEmail: payload.adminEmail,
        adminPassword: payload.adminPassword,
      }),
    });
  },

  async getAllWorkspaces() {
    return request('/workspaces', { method: 'GET' });
  },

  async getWorkspaceById(workspaceId) {
    return request(`/workspaces/${workspaceId}`, { method: 'GET' });
  },

  async updateWorkspace(workspaceId, payload) {
    return request(`/workspaces/${workspaceId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  // 2. Auth (Login & Logout)
  async login(email, password, rememberMe = true) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, rememberMe }),
    });
  },

  async logout(sessionToken) {
    return request(`/auth/logout?sessionToken=${encodeURIComponent(sessionToken || '')}`, {
      method: 'POST',
    });
  },

  // 3. Invitations
  async generateInvitation({ workspaceId, createdByUserId, invitedRole }) {
    return request('/invitations/generate', {
      method: 'POST',
      body: JSON.stringify({ workspaceId, createdByUserId, invitedRole }),
    });
  },

  async validateInviteToken(token) {
    return request(`/invitations/validate/${encodeURIComponent(token)}`, {
      method: 'GET',
    });
  },

  async getAllInvitations(workspaceId) {
    const query = workspaceId ? `?workspaceId=${encodeURIComponent(workspaceId)}` : '';
    return request(`/invitations${query}`, { method: 'GET' });
  },

  // 4. Users & Team Directory
  async registerWithInvite(token, { fullName, email, password }) {
    return request(`/users/signup/${encodeURIComponent(token)}`, {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password }),
    });
  },

  async getTeamDirectory(workspaceId) {
    return request(`/users/directory/${encodeURIComponent(workspaceId)}`, {
      method: 'GET',
    });
  },

  async revokeUserAccess(workspaceId, userId) {
    return request(`/users/${encodeURIComponent(userId)}/revoke?workspaceId=${encodeURIComponent(workspaceId)}`, {
      method: 'PUT',
    });
  },

  // 5. Job Postings
  async getJobsByWorkspace(workspaceId) {
    return request(`/jobs/workspace/${encodeURIComponent(workspaceId)}`, {
      method: 'GET',
    });
  },

  async createJobPosting(workspaceId, createdByUserId, jobData) {
    return request(`/jobs?workspaceId=${encodeURIComponent(workspaceId)}&createdByUserId=${encodeURIComponent(createdByUserId)}`, {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  },

  // 6. Candidates
  async uploadCandidate(workspaceId, jobId, uploadedByUserId, candidateData) {
    return request(
      `/candidates?workspaceId=${encodeURIComponent(workspaceId)}&jobId=${encodeURIComponent(jobId)}&uploadedByUserId=${encodeURIComponent(uploadedByUserId)}`,
      {
        method: 'POST',
        body: JSON.stringify(candidateData),
      }
    );
  },

  async getCandidatesByJob(workspaceId, jobId) {
    return request(
      `/candidates/job/${encodeURIComponent(jobId)}?workspaceId=${encodeURIComponent(workspaceId)}`,
      { method: 'GET' }
    );
  },

  // 7. BYOK Keys
  async configureByokKey(workspaceId, userId, providerName, rawApiKey) {
    return request(`/byok/configure?workspaceId=${encodeURIComponent(workspaceId)}&userId=${encodeURIComponent(userId)}`, {
      method: 'POST',
      body: JSON.stringify({ providerName, rawApiKey }),
    });
  },

  async verifyByokKey(workspaceId) {
    return request(`/byok/verify-key?workspaceId=${encodeURIComponent(workspaceId)}`, {
      method: 'GET',
    });
  },
};
