import React from 'react'
import Svg, { Circle, SvgText } from 'react-native-svg'

interface DonutChartProps {
  done: number
  total: number
  dark: boolean
}

export function DonutChart({ done, total, dark }: DonutChartProps) {
  const r = 58
  const circ = 2 * Math.PI * r
  const pct = total > 0 ? done / total : 0

  return (
    <Svg width={156} height={156} viewBox="0 0 156 156">
      <Circle cx={78} cy={78} r={r} fill="none" stroke={dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'} strokeWidth={18} />
      <Circle
        cx={78}
        cy={78}
        r={r}
        fill="none"
        stroke="#10AC84"
        strokeWidth={18}
        strokeDasharray={`${pct * circ} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 78 78)"
      />
      <SvgText x="78" y="72" textAnchor="middle" fill={dark ? '#EAEAEA' : '#1A1A2E'} fontSize="26" fontWeight="800">
        {Math.round(pct * 100)}%
      </SvgText>
      <SvgText x="78" y="94" textAnchor="middle" fill={dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'} fontSize="12">
        تکمیل شده
      </SvgText>
    </Svg>
  )
}
