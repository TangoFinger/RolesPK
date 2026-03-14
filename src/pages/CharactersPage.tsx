import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import CharacterCard from '../components/CharacterCard'
import Footer from '../components/Footer'
import { useAppDataContext } from '../App'

const SORT_OPTIONS = [
  { value: 'score-desc', label: '战力从高到低' },
  { value: 'score-asc', label: '战力从低到高' },
  { value: 'name', label: '姓名排序' },
]

export default function CharactersPage() {
  const { characters, universes } = useAppDataContext()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [universeFilter, setUniverseFilter] = useState(searchParams.get('universe') || 'all')
  const [sort, setSort] = useState('score-desc')

  const filtered = useMemo(() => {
    let list = [...characters]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.alias.some(a => a.toLowerCase().includes(q)) || c.tags.some(t => t.toLowerCase().includes(q)))
    }
    if (universeFilter !== 'all') list = list.filter(c => c.universeId === universeFilter)
    switch (sort) {
      case 'score-desc': list.sort((a, b) => b.overallScore - a.overallScore); break
      case 'score-asc': list.sort((a, b) => a.overallScore - b.overallScore); break
      case 'name': list.sort((a, b) => a.name.localeCompare(b.name, 'zh')); break
    }
    return list
  }, [characters, search, universeFilter, sort])

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">⚔️ 角色库</h1>
        </div>

        <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-2xl p-4 mb-8 space-y-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input type="text" placeholder="搜索角色名、别称、能力标签…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-[#2d2d4e] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors text-base" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 min-w-0">
              <label className="text-xs text-gray-500 mb-1 block">宇宙/世界观</label>
              <select value={universeFilter} onChange={e => setUniverseFilter(e.target.value)}
                className="w-full bg-[#0f0f0f] border border-[#2d2d4e] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-orange-500/50 text-sm">
                <option value="all">全部宇宙</option>
                {universes.map(u => <option key={u.id} value={u.id}>{u.name} ({u.tier}级)</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-0">
              <label className="text-xs text-gray-500 mb-1 block">排序方式</label>
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="w-full bg-[#0f0f0f] border border-[#2d2d4e] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-orange-500/50 text-sm">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">找到 <span className="text-orange-400 font-semibold">{filtered.length}</span> 位角色</p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map(char => <CharacterCard key={char.id} character={char} showRank />)}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-600">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-medium text-gray-400">没有找到匹配的角色</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
