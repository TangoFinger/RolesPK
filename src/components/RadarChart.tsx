import React from 'react'
import ReactECharts from 'echarts-for-react'
import type { CharacterStats } from '../types'

interface Props {
  stats: CharacterStats
  color?: string
  size?: number
  compareStats?: CharacterStats
  compareColor?: string
  nameA?: string
  nameB?: string
}

const DIMENSIONS = ['攻击力', '防御力', '速度', '智力', '持久力', '特殊能力']
function statsToArray(s: CharacterStats) {
  return [s.attack, s.defense, s.speed, s.intelligence, s.stamina, s.special]
}

export default function RadarChart({ stats, color = '#f97316', size = 300, compareStats, compareColor = '#8b5cf6', nameA = '战力', nameB = '对手' }: Props) {
  const seriesData: any[] = [
    { value: statsToArray(stats), name: nameA, areaStyle: { color: color + '33' }, lineStyle: { color, width: 2 }, itemStyle: { color } }
  ]
  if (compareStats) {
    seriesData.push({ value: statsToArray(compareStats), name: nameB, areaStyle: { color: compareColor + '33' }, lineStyle: { color: compareColor, width: 2 }, itemStyle: { color: compareColor } })
  }

  // 根据尺寸动态调整字体大小
  const fontSize = Math.max(9, Math.floor(size / 28))
  const axisNameColor = '#9ca3af'

  const option = {
    backgroundColor: 'transparent',
    radar: {
      indicator: DIMENSIONS.map(name => ({ name, max: 100 })),
      shape: 'polygon',
      splitNumber: 4,
      axisName: { color: axisNameColor, fontSize, fontWeight: '500' },
      splitLine: { lineStyle: { color: '#2d2d4e' } },
      splitArea: { areaStyle: { color: ['rgba(255,255,255,0.01)', 'rgba(255,255,255,0.02)', 'rgba(255,255,255,0.03)', 'rgba(255,255,255,0.04)'] } },
      axisLine: { lineStyle: { color: '#2d2d4e' } },
      radius: size < 180 ? '65%' : '70%',
    },
    series: [{ type: 'radar', data: seriesData, symbolSize: size < 180 ? 4 : 6 }],
    tooltip: {
      trigger: 'item',
      backgroundColor: '#1a1a2e',
      borderColor: '#2d2d4e',
      textStyle: { color: '#e5e7eb', fontSize: fontSize },
    },
    legend: compareStats ? { data: [nameA, nameB], textStyle: { color: '#9ca3af', fontSize }, bottom: 0 } : undefined,
  }

  return <ReactECharts option={option} style={{ width: size, height: size }} opts={{ renderer: 'svg' }} />
}
