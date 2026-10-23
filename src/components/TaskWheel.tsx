import React from 'react'
import { Pressable, Text, View } from 'react-native'
import Svg, { Circle, Defs, G, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg'
import { PRIORITY_COLOR, PRIORITY_LABEL } from '../constants/colors'
import { Task } from '../types/task'
import { polar, wedge } from '../utils/geometry'

interface TaskWheelProps {
  active: Task[]
  rotation: number
  spinning: boolean
  locked: boolean
  selected: Task | null
  dark: boolean
  onSpin: () => void
}

export function TaskWheel({ active, rotation, spinning, locked, selected, dark, onSpin }: TaskWheelProps) {
  const SZ = 300
  const CX = 150
  const CY = 150
  const R = 136
  const n = active.length
  const seg = n > 0 ? 360 / n : 0

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ position: 'relative' }}>
        <View style={{ position: 'absolute', top: -8, left: '50%', transform: [{ translateX: -11 }], zIndex: 20 }}>
          <Svg width={22} height={32} viewBox="0 0 22 32">
            <Path d="M11,32 L1,2 L21,2 Z" fill="#FECA57" stroke={dark ? '#0D0D1A' : '#F0F2F8'} strokeWidth={1.5} />
            <Path d="M11,28 L4,6 L18,6 Z" fill="#FF9F43" opacity={0.4} />
          </Svg>
        </View>

        <View
          style={{
            width: SZ + 28,
            height: SZ + 28,
            borderRadius: 999,
            borderWidth: 3,
            borderColor: locked && selected ? `${selected.color}55` : 'rgba(255,255,255,0.06)',
            boxShadow: locked && selected ? `0 0 0 1px ${selected.color}20, 0 0 70px ${selected.color}35, 0 12px 60px rgba(0,0,0,0.5)` : `0 12px 60px rgba(0,0,0,${dark ? 0.55 : 0.18})`,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <View style={{ width: SZ, height: SZ, borderRadius: 999, overflow: 'hidden', transform: [{ rotate: `${rotation}deg` }] }}>
            {n === 0 ? (
              <View style={{ width: '100%', height: '100%', borderRadius: 999, borderWidth: 3, borderColor: 'rgba(255,255,255,0.11)', alignItems: 'center', justifyContent: 'center', backgroundColor: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                <Text style={{ color: 'rgba(255,255,255,0.18)', fontSize: 12, textAlign: 'center', paddingHorizontal: 40 }}>کاری اضافه کنید</Text>
              </View>
            ) : (
              <Svg width={SZ} height={SZ} viewBox={`0 0 ${SZ} ${SZ}`}>
                <Defs>
                  {active.map((t, i) => (
                    <LinearGradient key={i} id={`rg${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor={t.color} stopOpacity={1} />
                      <Stop offset="100%" stopColor={t.color} stopOpacity={0.68} />
                    </LinearGradient>
                  ))}
                </Defs>
                {active.map((task, i) => {
                  const s = i * seg
                  const e = (i + 1) * seg
                  const mid = s + seg / 2
                  const tr = n <= 3 ? R * 0.56 : n <= 5 ? R * 0.62 : R * 0.67
                  const [tx, ty] = polar(CX, CY, tr, mid)
                  const isSel = locked && selected?.id === task.id
                  const maxCh = n <= 3 ? 12 : n <= 5 ? 8 : 6
                  const fs = n <= 3 ? 14 : n <= 5 ? 11 : 9
                  const lbl = task.title.length > maxCh ? task.title.slice(0, maxCh) + '…' : task.title
                  return (
                    <G key={task.id}>
                      <Path d={wedge(CX, CY, R, s, e)} fill={`url(#rg${i})`} stroke="rgba(0,0,0,0.3)" strokeWidth={2.5} opacity={locked ? (isSel ? 1 : 0.42) : 1} />
                      {isSel && (
                        <>
                          <Path d={wedge(CX, CY, R, s, e)} fill="none" stroke="white" strokeWidth={3.5} opacity={0.55} />
                          <Path d={wedge(CX, CY, R - 4, s, e)} fill="white" opacity={0.06} />
                        </>
                      )}
                      <SvgText x={tx} y={ty} textAnchor="middle" alignmentBaseline="middle" fill="white" fontSize={fs} fontWeight="800" transform={`rotate(${mid + 90},${tx},${ty})`} opacity={locked ? (isSel ? 1 : 0.55) : 1}>
                        {lbl}
                      </SvgText>
                    </G>
                  )
                })}
                <Circle cx={CX} cy={CY} r={46} fill={dark ? '#0D0D1A' : '#F0F2F8'} />
                <Circle cx={CX} cy={CY} r={38} fill={locked ? '#2D3436' : '#5F27CD'} />
                <Circle cx={CX} cy={CY} r={30} fill={locked ? '#4A5568' : '#7C3AED'} opacity={0.85} />
              </Svg>
            )}
          </View>

          <Pressable onPress={onSpin} disabled={spinning || locked || n === 0} style={{ position: 'absolute', width: 60, height: 60, borderRadius: 999, alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="white" opacity={n === 0 ? 0.2 : 1}>
              {locked ? <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /> : <Path d="M9 6L20 12L9 18Z" />}
            </Svg>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export function TaskBadge({ task }: { task: Task }) {
  return (
    <View style={{ backgroundColor: `${PRIORITY_COLOR[task.priority]}18`, borderRadius: 6, paddingHorizontal: 9, paddingVertical: 3 }}>
      <Text style={{ fontSize: 11, color: PRIORITY_COLOR[task.priority] }}>{PRIORITY_LABEL[task.priority]}</Text>
    </View>
  )
}
