import type { Universe, Work, Character, BattleRecord, Skill } from '../types'

const BASE = `${import.meta.env.BASE_URL}data`

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
  const universes = await fetchUniverses()
  const universeIds = universes.map(u => u.id)
  const results = await Promise.all(
    universeIds.map(id =>
      fetchJson<Character[]>(`characters/${id}.json`).catch(() => [] as Character[])
    )
  )
  return results.flat()
}

export async function fetchHotBattles(): Promise<BattleRecord[]> {
  return fetchJson('hotBattles.json')
}

export async function fetchSkillsMap(): Promise<Record<string, Skill[]>> {
  const universes = await fetchUniverses()
  const universeIds = universes.map(u => u.id)
  const results = await Promise.all(
    universeIds.map(id =>
      fetchJson<Record<string, Skill[]>>(`skills/${id}.json`).catch(() => ({} as Record<string, Skill[]>))
    )
  )
  return Object.assign({}, ...results)
}

// ---- 便捷查找函数（基于已加载数据）----

export function findById<T extends { id: string }>(list: T[], id: string): T | undefined {
  return list.find(item => item.id === id)
}
