// ============ 类型定义 ============
export interface CharacterStats {
  attack: number
  defense: number
  speed: number
  intelligence: number
  stamina: number
  special: number
}

export interface CharacterForm {
  name: string
  description: string
  overallScore: number
  stats: CharacterStats
}

export type UniverseTier = 'S' | 'A' | 'B' | 'C'

export interface Universe {
  id: string
  name: string
  tier: UniverseTier
  tierCoeff: number
  color: string
}

export interface Work {
  id: string
  title: string
  type: 'film' | 'series' | 'anime' | 'manga' | 'game'
  universeId: string
  year: number
  cover: string
}

export interface Character {
  id: string
  name: string
  alias: string[]
  workId: string
  universeId: string
  tags: string[]
  race: string
  faction: string
  description: string
  coverImage: string
  accentColor: string
  stats: CharacterStats
  overallScore: number
  baseScore: number
  forms: CharacterForm[]
  evidence: { desc: string; source: string }[]
  rank?: number
}

export interface BattleRecord {
  id: string
  charA: string
  charB: string
  votesA: number
  votesB: number
  hot: boolean
}

// ============ 模拟对战系统 ============
export type SkillType = 'physical' | 'energy' | 'special' | 'defense' | 'ultimate'

export interface Skill {
  id: string
  name: string
  type: SkillType
  description: string
  // 伤害倍率（基于attack）
  damageMult: number
  // 消耗体力
  staminaCost: number
  // 冷却回合
  cooldown: number
  // 命中率 0-1
  hitRate: number
  // 特殊效果描述（用于叙事）
  effectDesc: string
  // 对战叙事模板（{attacker} {target}）
  narrativeTemplates: string[]
}

export interface BattleCharacter {
  character: Character
  hp: number
  maxHp: number
  stamina: number
  maxStamina: number
  skills: Skill[]
  skillCooldowns: Record<string, number>
}

export type BattleEventType = 'attack' | 'miss' | 'critical' | 'ultimate' | 'defense' | 'taunt' | 'round_start' | 'battle_end'

export interface BattleEvent {
  type: BattleEventType
  attacker: string
  target: string
  skill?: Skill
  damage?: number
  isCritical?: boolean
  narrative: string
}

export interface BattleRound {
  roundNumber: number
  events: BattleEvent[]
  hpA: number
  hpB: number
  staminaA: number
  staminaB: number
}

export interface BattleResult {
  winner: string
  loser: string
  rounds: BattleRound[]
  totalRounds: number
  summary: string
}
