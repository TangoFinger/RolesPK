import type { Universe, Work, Character, BattleRecord, Skill } from '../types'

const BASE = '/data'

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/${path}`)
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`)
  return res.json()
}

export async function fetchUniverses(): Promise<Universe[]> {
  return fetchJson('universes.json')
}

export async function fetchWorks(): Promise<Work[]> {
  return fetchJson('works.json')
}

export async function fetchCharacters(): Promise<Character[]> {
  return fetchJson('characters.json')
}

export async function fetchHotBattles(): Promise<BattleRecord[]> {
  return fetchJson('hotBattles.json')
}

export async function fetchSkillsMap(): Promise<Record<string, Skill[]>> {
  return fetchJson('skills.json')
}

// ---- 便捷查找函数（基于已加载数据）----

export function findById<T extends { id: string }>(list: T[], id: string): T | undefined {
  return list.find(item => item.id === id)
}
