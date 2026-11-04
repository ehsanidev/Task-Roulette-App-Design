import React from 'react'
import { Pressable, Text, TouchableOpacity, View } from 'react-native'
import { TaskWheel } from '../components/TaskWheel'
import { Task } from '../types/task'

interface DashboardScreenProps {
  dark: boolean
  userName: string
  tasks: Task[]
  active: Task[]
  done: Task[]
  rotation: number
  spinning: boolean
  locked: boolean
  selected: Task | null
  onToggleTheme: () => void
  onOpenStats: () => void
  onSpin: () => void
  onOpenReport: () => void
  onDeleteTask: (taskId: string) => void
  onAddTask: () => void
}

export function DashboardScreen({ dark, userName, tasks, active, done, rotation, spinning, locked, selected, onToggleTheme, onOpenStats, onSpin, onOpenReport, onDeleteTask, onAddTask }: DashboardScreenProps) {
  const bg = dark ? '#0D0D1A' : '#F0F2F8'
  const card = dark ? '#14203A' : '#FFFFFF'
  const tc = dark ? '#EAEAEA' : '#1A1A2E'
  const sub = dark ? '#8888AA' : '#636E72'
  const bdr = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const n = active.length

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12, backgroundColor: card, borderBottomWidth: 1, borderBottomColor: bdr }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
          <View style={{ width: 40, height: 40, borderRadius: 999, backgroundColor: '#5F27CD', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 17 }}>{userName ? userName[0].toUpperCase() : 'T'}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 11, color: sub }}>خوش اومدی</Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: tc }}>{userName || 'کاربر'}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={onToggleTheme} style={{ backgroundColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', borderRadius: 10, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
            <Text>{dark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onOpenStats} style={{ backgroundColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', borderRadius: 10, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
            <Text>📊</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ alignItems: 'center', paddingVertical: 18 }}>
        <Text style={{ fontSize: 27, fontWeight: '900', color: '#A855F7' }}>Task Roulette</Text>
        <Text style={{ color: sub, fontSize: 13, marginTop: 4 }}>{n > 0 ? `${n} کار در گردونه` : 'همه کارها انجام شد! 🎉'}</Text>
      </View>

      <View style={{ alignItems: 'center', paddingTop: 8 }}>
        <TaskWheel active={active} rotation={rotation} spinning={spinning} locked={locked} selected={selected} dark={dark} onSpin={onSpin} />
      </View>

      {!locked && n > 0 && (
        <View style={{ marginTop: 16, alignItems: 'center' }}>
          <TouchableOpacity onPress={onSpin} disabled={spinning} style={{ backgroundColor: spinning ? 'rgba(95,39,205,0.5)' : '#5F27CD', borderRadius: 50, paddingVertical: 11, paddingHorizontal: 36, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>{spinning ? '⏳ در حال چرخش...' : '🎰 بچرخان!'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {locked && selected && (
        <View style={{ marginHorizontal: 20, marginTop: 14, backgroundColor: `${selected.color}16`, borderWidth: 1.5, borderColor: `${selected.color}45`, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: selected.color }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '800', fontSize: 15, color: tc }}>{selected.title}</Text>
            <Text style={{ color: sub, fontSize: 12 }}>{selected.description}</Text>
          </View>
          <TouchableOpacity onPress={onOpenReport} style={{ backgroundColor: selected.color, borderRadius: 10, paddingVertical: 9, paddingHorizontal: 16 }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>ثبت گزارش</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 120 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: tc }}>کارهای امروز ({n})</Text>
          {done.length > 0 && <Text style={{ fontSize: 12, color: '#10AC84' }}>✓ {done.length} تکمیل</Text>}
        </View>

        {n === 0 && done.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ fontSize: 52, marginBottom: 12 }}>🎯</Text>
            <Text style={{ fontSize: 15, fontWeight: '600', marginBottom: 4, color: tc }}>هنوز کاری اضافه نشده</Text>
            <Text style={{ fontSize: 13, color: sub }}>با دکمه زیر اولین کارت رو اضافه کن!</Text>
          </View>
        )}

        {active.map((task) => (
          <View key={task.id} style={{ backgroundColor: card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, marginBottom: 10, borderWidth: 1, borderColor: bdr, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 13, height: 13, borderRadius: 4, backgroundColor: task.color }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', fontSize: 14, color: tc }}>{task.title}</Text>
              <Text style={{ color: sub, fontSize: 12, marginTop: 2 }}>{task.description}</Text>
            </View>
            <View style={{ backgroundColor: `${task.color}22`, borderRadius: 6, paddingHorizontal: 9, paddingVertical: 3 }}>
              <Text style={{ fontSize: 11, color: task.color }}>{task.priority === 'high' ? 'بالا' : task.priority === 'medium' ? 'متوسط' : 'پایین'}</Text>
            </View>
            <Pressable onPress={() => onDeleteTask(task.id)}>
              <Text style={{ color: sub, fontSize: 19, padding: 4 }}>×</Text>
            </Pressable>
          </View>
        ))}

        {done.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 13, color: sub, fontWeight: '600', marginBottom: 10 }}>✓ انجام‌شده‌ها</Text>
            {done.map((task) => (
              <View key={task.id} style={{ backgroundColor: card, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 8, borderWidth: 1, borderColor: bdr, flexDirection: 'row', alignItems: 'center', gap: 10, opacity: 0.5 }}>
                <Text style={{ color: '#10AC84', fontSize: 15 }}>✓</Text>
                <Text style={{ fontSize: 13, textDecorationLine: 'line-through', color: sub, flex: 1 }}>{task.title}</Text>
                {task.difficulty ? <Text style={{ fontSize: 11, color: sub }}>{'⭐'.repeat(task.difficulty)}</Text> : null}
              </View>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity onPress={onAddTask} style={{ position: 'absolute', bottom: 28, left: '50%', transform: [{ translateX: -90 }], backgroundColor: '#5F27CD', borderRadius: 30, paddingVertical: 14, paddingHorizontal: 32, alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 30px rgba(95,39,205,0.58)' }}>
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800' }}>+ افزودن کار جدید</Text>
      </TouchableOpacity>
    </View>
  )
}
