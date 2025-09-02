export async function updateUserDarkMode(isDark: boolean) {
  const response = await fetch('/api/user/preferences', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ dark_mode: isDark }),
  })

  if (!response.ok) {
    throw new Error('Failed to update dark mode preference')
  }

  return response.json()
}

export async function getValuationSummary() {
  const response = await fetch('/api/valuation/summary')
  
  if (!response.ok) {
    throw new Error('Failed to fetch valuation summary')
  }

  return response.json()
}

export async function getProjectValuation(projectId: string) {
  const response = await fetch(`/api/valuation/project/${projectId}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch project valuation')
  }

  return response.json()
}
