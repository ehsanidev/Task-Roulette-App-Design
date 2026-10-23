import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { DonutChart } from '../components/DonutChart'
import { Task } from '../types/task'

interface StatsScreenProps {
  tasks: Task[]
  active: Task[]
  done: Task[]
  dark: boolean
  spinCount: number
  onBack: () => void
}

export function StatsScreen({ tasks, active, done, dark, spinCount, onBack }: StatsScreenProps) {
  const bg = dark ? '#0D0D1A' : '#F0F2F8'
  const card = dark ? '#14203A' : '#FFFFFF'
  const tc = dark ? '#EAEAEA' : '#1A1A2E'
  const sub = dark ? '#8888AA' : '#636E72'
  const bdr = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'

  const doneCount = done.length
  const total = tasks.length
  const skipCount = tasks.filter((t) => t.skipped).length
  const fires = Math.max(1, Math.floor(doneCount / 5))

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20 }}>
        <Pressable onPress={onBack}>
          <Text style={{ color: sub, fontSize: 22 }}>←</Text>
        </Pressable>
        <Text style={{ marginLeft: 8, fontSize: 20, fontWeight: '800', color: tc }}>آمار و پیشرفت</Text>
      </View>

      <View style={{ maxWidth: 520, width: '100%', alignSelf: 'center', padding: 20, paddingBottom: 40 }}>
        <View style={{ backgroundColor: card, borderRadius: 20, paddingVertical: 24, paddingHorizontal: 24, borderWidth: 1, borderColor: bdr, alignItems: 'center' }}>
          <DonutChart done={doneCount} total={total} dark={dark} />
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 32, marginTop: 16 }}>
            {[
              { l: 'انجام‌شده', n: doneCount, c: '#10AC84' },
              { l: 'در انتظار', n: active.length, c: '#FF9F43' },
              { l: 'رد شده', n: skipCount, c: '#636E72' },
            ].map((item) => (
              <View key={item.l} style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 26, fontWeight: '900', color: item.c }}>{item.n}</Text>
                <Text style={{ fontSize: 12, color: sub }}>{item.l}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
          <View style={{ flex: 1, backgroundColor: card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: bdr }}>
            <Text style={{ fontSize: 34, fontWeight: '900', color: '#5F27CD' }}>{spinCount}</Text>
            <Text style={{ fontSize: 13, color: sub, marginTop: 4 }}>چرخش امروز</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: bdr }}>
            <Text style={{ fontSize: 26, letterSpacing: 2 }}>{'🔥'.repeat(fires)}</Text>
            <Text style={{ fontSize: 13, color: sub, marginTop: 4 }}>استریک ({doneCount} کار)</Text>
          </View>
        </View>

        <View style={{ backgroundColor: card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: bdr, marginTop: 14 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', marginBottom: 16 }}>جزئیات وظایف</Text>
          {tasks.length === 0 && <Text style={{ color: sub, textAlign: 'center', paddingBottom: 16 }}>هیچ کاری ثبت نشده</Text>}
          {tasks.map((t, i) => (
            <View key={t.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: i < tasks.length - 1 ? 1 : 0, borderBottomColor: bdr }}>
              <View style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: t.color }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', textDecorationLine: t.completed ? 'line-through' : 'none', color: t.completed ? sub : tc }}>{t.title}</Text>
                {t.difficulty ? <Text style={{ fontSize: 11, color: sub }}>{'⭐'.repeat(t.difficulty)}</Text> : null}
              </View>
              <View style={{ backgroundColor: t.completed ? '#10AC8418' : t.skipped ? '#63636918' : '#FF9F4318', borderRadius: 6, paddingHorizontal: 9, paddingVertical: 3 }}>
                <Text style={{ fontSize: 11, color: t.completed ? '#10AC84' : t.skipped ? '#636E72' : '#FF9F43' }}>{t.completed ? 'انجام شد' : t.skipped ? 'رد شد' : 'در انتظار'}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}
