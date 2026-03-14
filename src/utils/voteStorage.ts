// 投票存储工具 - 使用 localStorage 实现

const VOTES_KEY = 'battle_votes'
const USER_VOTES_KEY = 'user_votes'

// 初始化投票数据（从静态数据加载基础票数）
export function initVotes(battles: { id: string; votesA: number; votesB: number }[]) {
  const stored = localStorage.getItem(VOTES_KEY)
  if (!stored) {
    const initialVotes: Record<string, { votesA: number; votesB: number }> = {}
    battles.forEach(b => {
      initialVotes[b.id] = { votesA: b.votesA, votesB: b.votesB }
    })
    localStorage.setItem(VOTES_KEY, JSON.stringify(initialVotes))
  }
}

// 获取投票数据
export function getVotes(battleId: string): { votesA: number; votesB: number } {
  const stored = localStorage.getItem(VOTES_KEY)
  if (!stored) return { votesA: 0, votesB: 0 }
  const votes = JSON.parse(stored)
  return votes[battleId] || { votesA: 0, votesB: 0 }
}

// 获取所有投票数据
export function getAllVotes(): Record<string, { votesA: number; votesB: number }> {
  const stored = localStorage.getItem(VOTES_KEY)
  if (!stored) return {}
  return JSON.parse(stored)
}

// 投票
export function vote(battleId: string, choice: 'A' | 'B'): boolean {
  // 检查是否已投票
  const userVotes = getUserVotes()
  if (userVotes.includes(battleId)) {
    return false // 已投票
  }

  // 更新投票数据
  const stored = localStorage.getItem(VOTES_KEY)
  const votes = stored ? JSON.parse(stored) : {}

  if (!votes[battleId]) {
    votes[battleId] = { votesA: 0, votesB: 0 }
  }

  if (choice === 'A') {
    votes[battleId].votesA++
  } else {
    votes[battleId].votesB++
  }

  localStorage.setItem(VOTES_KEY, JSON.stringify(votes))

  // 记录用户已投票
  userVotes.push(battleId)
  localStorage.setItem(USER_VOTES_KEY, JSON.stringify(userVotes))

  return true
}

// 获取用户已投票的对战列表
export function getUserVotes(): string[] {
  const stored = localStorage.getItem(USER_VOTES_KEY)
  if (!stored) return []
  return JSON.parse(stored)
}

// 检查用户是否已投票
export function hasVoted(battleId: string): boolean {
  return getUserVotes().includes(battleId)
}

// 获取用户投票选择
export function getUserChoice(battleId: string): 'A' | 'B' | null {
  const stored = localStorage.getItem(USER_VOTES_KEY)
  if (!stored) return null

  // 这个函数需要额外存储用户的选择
  const choiceKey = `vote_choice_${battleId}`
  const choice = localStorage.getItem(choiceKey)
  return choice as 'A' | 'B' | null
}

// 保存用户投票选择
export function saveUserChoice(battleId: string, choice: 'A' | 'B') {
  localStorage.setItem(`vote_choice_${battleId}`, choice)
}
