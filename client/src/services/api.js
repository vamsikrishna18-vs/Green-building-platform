import { getAuthHeaders } from './auth';
import { getApiUrl } from './apiConfig';

const API_BASE = getApiUrl('/api/assessments');

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE}/analytics`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch analytics.');
  const json = await res.json();
  return json.data;
}

export async function fetchBenchmarks(assessmentId) {
  const url = assessmentId ? `${API_BASE}/benchmarks?id=${assessmentId}` : `${API_BASE}/benchmarks`;
  const res = await fetch(url, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch benchmarks.');
  const json = await res.json();
  return json.data;
}

export async function fetchAssessments({ search = '', buildingType = 'All', limit = 50 } = {}) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (buildingType && buildingType !== 'All') params.append('buildingType', buildingType);
  if (limit) params.append('limit', limit);

  const res = await fetch(`${API_BASE}?${params.toString()}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch assessments.');
  const json = await res.json();
  return json.data;
}

export async function fetchAssessmentById(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch assessment details.');
  const json = await res.json();
  return json.data;
}

export async function createAssessment(data) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || 'Failed to save assessment.');
  }
  const json = await res.json();
  return json.data;
}

export async function simulateAssessment(data) {
  const res = await fetch(`${API_BASE}/simulate`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to simulate assessment.');
  const json = await res.json();
  return json.data;
}

export async function deleteAssessment(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete assessment.');
  const json = await res.json();
  return json;
}
