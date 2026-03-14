import { useState, useEffect } from 'react'
import type { Universe, Work, Character, BattleRecord, Skill } from '../types'
import {
  fetchUniverses,
  fetchWorks,
  fetchCharacters,
  fetchHotBattles,
  fetchSkillsMap,
} from './dataService'

// ---- 通用加载 hook ----

interface UseDataResult<T> {
  data: T | null
  loading: boolean
  error: string | null
}

function useRemoteData<T>(fetcher: () => Promise<T>): UseDataResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetcher()
      .then(result => { if (!cancelled) { setData(result); setLoading(false) } })
      .catch(err => { if (!cancelled) { setError(String(err)); setLoading(false) } })
    return () => { cancelled = true }
  }, [])

  return { data, loading, error }
}

// ---- 聚合加载 hook（一次性拉取全部） ----

export interface AppData {
  universes: Universe[]
  works: Work[]
  characters: Character[]
  hotBattles: BattleRecord[]
  skillsMap: Record<string, Skill[]>
}

interface UseAppDataResult {
  data: AppData | null
  loading: boolean
  error: string | null
}

export function useAppData(): UseAppDataResult {
  const [data, setData] = useState<AppData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([
      fetchUniverses(),
      fetchWorks(),
      fetchCharacters(),
      fetchHotBattles(),
      fetchSkillsMap(),
    ])
      .then(([universes, works, characters, hotBattles, skillsMap]) => {
        if (!cancelled) {
          setData({ universes, works, characters, hotBattles, skillsMap })
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) { setError(String(err)); setLoading(false) }
      })
    return () => { cancelled = true }
  }, [])

  return { data, loading, error }
}

// ---- 单项 hooks ----

export function useUniverses() { return useRemoteData(fetchUniverses) }
export function useCharacters() { return useRemoteData(fetchCharacters) }
export function useWorks() { return useRemoteData(fetchWorks) }
export function useHotBattles() { return useRemoteData(fetchHotBattles) }
export function useSkillsMap() { return useRemoteData(fetchSkillsMap) }
