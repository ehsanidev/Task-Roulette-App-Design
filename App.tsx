import React, { useMemo, useRef, useState } from 'react'
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Svg, { Circle, Defs, G, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg'
import './global.css'

const COLORS = ['#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB', '#0ABDE3', '#10AC84', '#5F27CD', '#01CBC6', '#E84393']

type Priority = 'high' | 'medium' | 'low'
type Screen = 'login' | 'dashboard' | 'report' | 'stats'

interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  completed: boolean
  skipped: boolean
  color: string
  reportNote?: string
  difficulty?: number
  completedAt?: string
}

const PRIORITY_LABEL: Record<Priority, string> = { high: 'بالا', medium: 'متوسط', low: 'پایین' }
const PRIORITY_COLOR: Record<Priority, string> = { high: '#FF6B6B', medium: '#FECA57', low: '#10AC84' }

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

function wedge(cx: number, cy: number, r: number, s: number, e: number) {
  const [sx, sy] = polar(cx, cy, r, s)
  const [ex, ey] = polar(cx, cy, r, e)
  return `M${cx},${cy}L${sx},${sy}A${r},${r},0,${e - s > 180 ? 1 : 0},1,${ex},${ey}Z`
}

function DonutChart({ done, total, dark }: { done: number; total: number; dark: boolean }) {
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

const SAMPLE: Task[] = [
  { id: '1', title: 'ایمیل‌ها', description: 'پاسخ به ایمیل‌های مهم امروز', priority: 'high', completed: false, skipped: false, color: COLORS[0] },
  { id: '2', title: 'گزارش', description: 'تهیه گزارش هفتگی تیم', priority: 'medium', completed: false, skipped: false, color: COLORS[1] },
  { id: '3', title: 'جلسه', description: 'آماده‌سازی اسلایدهای جلسه', priority: 'high', completed: false, skipped: false, color: COLORS[3] },
  { id: '4', title: 'ورزش', description: '۳۰ دقیقه پیاده‌روی', priority: 'low', completed: false, skipped: false, color: COLORS[5] },
  { id: '5', title: 'مطالعه', description: 'مطالعه ۲۰ صفحه کتاب', priority: 'medium', completed: false, skipped: false, color: COLORS[6] },
]

export default function App() {
  const [dark, setDark] = useState(true)
  const [screen, setScreen] = useState<Screen>('login')
  const [tasks, setTasks] = useState<Task[]>(SAMPLE)
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [locked, setLocked] = useState(false)
  const [selected, setSelected] = useState<Task | null>(null)
  const [spinCount, setSpinCount] = useState(0)
  const [showAdd, setShowAdd] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as Priority })
  const [reportForm, setReportForm] = useState({ note: '', difficulty: 3, at: new Date().toISOString().slice(0, 16) })
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const rotRef = useRef(0)

  const active = useMemo(() => tasks.filter((t) => !t.completed && !t.skipped), [tasks])
  const done = useMemo(() => tasks.filter((t) => t.completed), [tasks])

  const spin = () => {
    if (spinning || locked || active.length === 0) return
    const n = active.length
    const idx = Math.floor(Math.random() * n)
    const seg = 360 / n
    const mid = (idx + 0.5) * seg
    const cur = ((rotRef.current % 360) + 360) % 360
    const tgt = (360 - (mid % 360) + 360) % 360
    const delta = (tgt - cur + 360) % 360
    const nr = rotRef.current + 1800 + delta
    rotRef.current = nr
    setRotation(nr)
    setSpinning(true)
    setTimeout(() => {
      setSpinning(false)
      setLocked(true)
      setSelected(active[idx])
      setSpinCount((c) => c + 1)
    }, 4100)
  }

  const submitReport = () => {
    if (!selected) return
    setTasks((p) => p.map((t) => (t.id === selected.id ? { ...t, completed: true, reportNote: reportForm.note, difficulty: reportForm.difficulty, completedAt: reportForm.at } : t)))
    setLocked(false)
    setSelected(null)
    setReportForm({ note: '', difficulty: 3, at: new Date().toISOString().slice(0, 16) })
    setScreen('dashboard')
  }

  const skipTask = () => {
    if (!selected) return
    setTasks((p) => p.map((t) => (t.id === selected.id ? { ...t, skipped: true } : t)))
    setLocked(false)
    setSelected(null)
    setScreen('dashboard')
  }

  const addTask = () => {
    if (!newTask.title.trim()) return
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      completed: false,
      skipped: false,
      color: COLORS[active.length % COLORS.length],
    }
    setTasks((p) => [...p, task])
    setNewTask({ title: '', description: '', priority: 'medium' })
    setShowAdd(false)
  }

  const bg = dark ? '#0D0D1A' : '#F0F2F8'
  const card = dark ? '#14203A' : '#FFFFFF'
  const tc = dark ? '#EAEAEA' : '#1A1A2E'
  const sub = dark ? '#8888AA' : '#636E72'
  const bdr = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'

  const SZ = 300
  const CX = 150
  const CY = 150
  const R = 136
  const n = active.length
  const seg = n > 0 ? 360 / n : 0

  if (screen === 'login') {
    return (
      <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: '#0D0D1A' }}>
        <StatusBar barStyle="light-content" />
        <View style={{ width: '100%', maxWidth: 420 }}>
          <View className="items-center mb-11">
            <View className="relative mb-5" style={{ width: 104, height: 104 }}>
              <Svg width={104} height={104} viewBox="0 0 104 104">
                {COLORS.slice(0, 6).map((c, i) => (
                  <Defs key={i}>
                    <LinearGradient id={`lg${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor={c} />
                      <Stop offset="100%" stopColor={c} stopOpacity="0.7" />
                    </LinearGradient>
                  </Defs>
                ))}
                {COLORS.slice(0, 6).map((_, i) => (
                  <Path key={i} d={wedge(52, 52, 48, i * 60, (i + 1) * 60)} fill={`url(#lg${i})`} stroke="#0D0D1A" strokeWidth={2} />
                ))}
                <Circle cx={52} cy={52} r={22} fill="#0D0D1A" />
                <Circle cx={52} cy={52} r={15} fill="#5F27CD" />
                <Path d="M52 42 L60 57 L44 57 Z" fill="white" opacity={0.95} />
              </Svg>
            </View>
            <Text style={{ fontSize: 36, fontWeight: '900', letterSpacing: -1, color: '#EAEAEA' }}>Task Roulette</Text>
            <Text style={{ marginTop: 8, color: '#8888AA', fontSize: 15 }}>وظایفت رو به شانس بسپار!</Text>
          </View>

          <View style={{ backgroundColor: '#14203A', borderRadius: 24, padding: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' }}>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: '#8888AA', fontSize: 13, marginBottom: 6 }}>نام شما</Text>
              <TextInput
                value={userName}
                onChangeText={setUserName}
                placeholder="مثلاً: علی رضایی"
                placeholderTextColor="#8B8BA7"
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.10)',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  color: '#EAEAEA',
                  fontSize: 15,
                }}
              />
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={{ color: '#8888AA', fontSize: 13, marginBottom: 6 }}>ایمیل</Text>
              <TextInput
                value={userEmail}
                onChangeText={setUserEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                placeholderTextColor="#8B8BA7"
                autoCapitalize="none"
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.10)',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  color: '#EAEAEA',
                  fontSize: 15,
                }}
              />
            </View>

            <TouchableOpacity onPress={() => setScreen('dashboard')} style={{ backgroundColor: '#5F27CD', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>شروع کنید ←</Text>
            </TouchableOpacity>
          </View>

          <Pressable onPress={() => setDark((d) => !d)} style={{ marginTop: 20, alignItems: 'center' }}>
            <Text style={{ color: '#8888AA', fontSize: 13 }}>{dark ? '☀️ تم روشن' : '🌙 تم تاریک'}</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  if (screen === 'report' && selected) {
    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        <View style={{ backgroundColor: selected.color + 'CC', paddingTop: 52, paddingBottom: 68, paddingHorizontal: 24, position: 'relative' }}>
          <Pressable
            onPress={() => {
              setLocked(false)
              setSelected(null)
              setScreen('dashboard')
            }}
            style={{ position: 'absolute', top: 28, right: 20 }}
          >
            <Text style={{ color: '#fff', fontSize: 20 }}>←</Text>
          </Pressable>
          <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, textAlign: 'center', marginBottom: 10 }}>🎯 کار انتخاب‌شده توسط گردونه</Text>
          <Text style={{ color: '#fff', fontSize: 30, fontWeight: '900', textAlign: 'center', marginBottom: 8 }}>{selected.title}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.82)', fontSize: 15, textAlign: 'center' }}>{selected.description}</Text>
        </View>

        <View style={{ maxWidth: 520, alignSelf: 'center', width: '100%', marginTop: -30, paddingHorizontal: 20, paddingBottom: 60 }}>
          <View style={{ backgroundColor: card, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: bdr }}>
            <View style={{ marginBottom: 18 }}>
              <Text style={{ color: sub, fontSize: 13, marginBottom: 6 }}>این کار را چگونه انجام دادی؟</Text>
              <TextInput
                value={reportForm.note}
                onChangeText={(value) => setReportForm((f) => ({ ...f, note: value }))}
                placeholder="توضیح مختصری بنویسید..."
                placeholderTextColor={sub}
                multiline
                numberOfLines={3}
                style={{
                  width: '100%',
                  minHeight: 80,
                  backgroundColor: dark ? 'rgba(255,255,255,0.05)' : '#F8F9FA',
                  borderWidth: 1,
                  borderColor: bdr,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  color: tc,
                  fontSize: 14,
                  textAlignVertical: 'top',
                }}
              />
            </View>

            <View style={{ marginBottom: 18 }}>
              <Text style={{ color: sub, fontSize: 13, marginBottom: 10 }}>سختی کار</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <TouchableOpacity key={s} onPress={() => setReportForm((f) => ({ ...f, difficulty: s }))}>
                    <Text style={{ fontSize: 30, opacity: s <= reportForm.difficulty ? 1 : 0.2, transform: [{ scale: s === reportForm.difficulty ? 1.2 : 1 }] }}>
                      ⭐
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={{ textAlign: 'center', color: sub, fontSize: 12, marginTop: 6 }}>{['', 'خیلی آسان', 'آسان', 'متوسط', 'سخت', 'خیلی سخت'][reportForm.difficulty]}</Text>
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={{ color: sub, fontSize: 13, marginBottom: 6 }}>زمان انجام</Text>
              <TextInput
                value={reportForm.at}
                onChangeText={(value) => setReportForm((f) => ({ ...f, at: value }))}
                placeholder="YYYY-MM-DDTHH:mm"
                placeholderTextColor={sub}
                style={{
                  width: '100%',
                  backgroundColor: dark ? 'rgba(255,255,255,0.05)' : '#F8F9FA',
                  borderWidth: 1,
                  borderColor: bdr,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  color: tc,
                  fontSize: 14,
                }}
              />
            </View>

            <TouchableOpacity onPress={submitReport} style={{ backgroundColor: '#10AC84', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>✓ ثبت گزارش و ادامه</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={skipTask} style={{ borderWidth: 1, borderColor: bdr, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ color: sub, fontSize: 14 }}>رد کردن این کار</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  if (screen === 'stats') {
    const doneCount = done.length
    const total = tasks.length
    const skipCount = tasks.filter((t) => t.skipped).length
    const fires = Math.max(1, Math.floor(doneCount / 5))

    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20 }}>
          <Pressable onPress={() => setScreen('dashboard')}>
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
                  <Text style={{ fontSize: 14, fontWeight: '600', textDecorationLine: t.completed ? 'line-through' : 'none', color: t.completed ? sub : tc }}>
                    {t.title}
                  </Text>
                  {t.difficulty ? <Text style={{ fontSize: 11, color: sub }}>{'⭐'.repeat(t.difficulty)}</Text> : null}
                </View>
                <View style={{ backgroundColor: t.completed ? '#10AC8418' : t.skipped ? '#63636918' : '#FF9F4318', borderRadius: 6, paddingHorizontal: 9, paddingVertical: 3 }}>
                  <Text style={{ fontSize: 11, color: t.completed ? '#10AC84' : t.skipped ? '#636E72' : '#FF9F43' }}>
                    {t.completed ? 'انجام شد' : t.skipped ? 'رد شد' : 'در انتظار'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12, backgroundColor: card, borderBottomWidth: 1, borderBottomColor: bdr }}>
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
          <TouchableOpacity onPress={() => setDark((d) => !d)} style={{ backgroundColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', borderRadius: 10, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
            <Text>{dark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setScreen('stats')} style={{ backgroundColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', borderRadius: 10, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
            <Text>📊</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ alignItems: 'center', paddingVertical: 18 }}>
        <Text style={{ fontSize: 27, fontWeight: '900', backgroundColor: 'transparent', color: '#A855F7' }}>{'Task Roulette'}</Text>
        <Text style={{ color: sub, fontSize: 13, marginTop: 4 }}>{n > 0 ? `${n} کار در گردونه` : 'همه کارها انجام شد! 🎉'}</Text>
      </View>

      <View style={{ alignItems: 'center', paddingTop: 8 }}>
        <View style={{ position: 'relative' }}>
          <View style={{ position: 'absolute', top: -8, left: '50%', transform: [{ translateX: -11 }], zIndex: 20 }}>
            <Svg width={22} height={32} viewBox="0 0 22 32">
              <Path d="M11,32 L1,2 L21,2 Z" fill="#FECA57" stroke={dark ? '#0D0D1A' : '#F0F2F8'} strokeWidth={1.5} />
              <Path d="M11,28 L4,6 L18,6 Z" fill="#FF9F43" opacity={0.4} />
            </Svg>
          </View>

          <View style={{ width: SZ + 28, height: SZ + 28, borderRadius: 999, borderWidth: 3, borderColor: locked && selected ? selected.color + '55' : 'rgba(255,255,255,0.06)', boxShadow: locked && selected ? `0 0 0 1px ${selected.color}20, 0 0 70px ${selected.color}35, 0 12px 60px rgba(0,0,0,0.5)` : `0 12px 60px rgba(0,0,0,${dark ? 0.55 : 0.18})`, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
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
                        <SvgText
                          x={tx}
                          y={ty}
                          textAnchor="middle"
                          alignmentBaseline="middle"
                          fill="white"
                          fontSize={fs}
                          fontWeight="800"
                          transform={`rotate(${mid + 90},${tx},${ty})`}
                          opacity={locked ? (isSel ? 1 : 0.55) : 1}
                        >
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

            <Pressable onPress={spin} disabled={spinning || locked || n === 0} style={{ position: 'absolute', width: 60, height: 60, borderRadius: 999, alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="white" opacity={n === 0 ? 0.2 : 1}>
                {locked ? <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /> : <Path d="M9 6L20 12L9 18Z" />}
              </Svg>
            </Pressable>
          </View>
        </View>

        {!locked && n > 0 && (
          <View style={{ marginTop: 16 }}>
            <TouchableOpacity onPress={spin} disabled={spinning} style={{ backgroundColor: spinning ? 'rgba(95,39,205,0.5)' : '#5F27CD', borderRadius: 50, paddingVertical: 11, paddingHorizontal: 36, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>{spinning ? '⏳ در حال چرخش...' : '🎰 بچرخان!'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {locked && selected && (
        <View style={{ marginHorizontal: 20, marginTop: 14, backgroundColor: `${selected.color}16`, borderWidth: 1.5, borderColor: `${selected.color}45`, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: selected.color }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '800', fontSize: 15, color: tc }}>{selected.title}</Text>
            <Text style={{ color: sub, fontSize: 12 }}>{selected.description}</Text>
          </View>
          <TouchableOpacity onPress={() => setScreen('report')} style={{ backgroundColor: selected.color, borderRadius: 10, paddingVertical: 9, paddingHorizontal: 16 }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>ثبت گزارش</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 120 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ margin: 0, fontSize: 15, fontWeight: '700', color: tc }}>کارهای امروز ({n})</Text>
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
            <View style={{ backgroundColor: `${PRIORITY_COLOR[task.priority]}18`, borderRadius: 6, paddingHorizontal: 9, paddingVertical: 3 }}>
              <Text style={{ fontSize: 11, color: PRIORITY_COLOR[task.priority] }}>{PRIORITY_LABEL[task.priority]}</Text>
            </View>
            <Pressable onPress={() => setTasks((p) => p.filter((t) => t.id !== task.id))}>
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

      <TouchableOpacity onPress={() => setShowAdd(true)} style={{ position: 'absolute', bottom: 28, left: '50%', transform: [{ translateX: -90 }], backgroundColor: '#5F27CD', borderRadius: 30, paddingVertical: 14, paddingHorizontal: 32, alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 30px rgba(95,39,205,0.58)' }}>
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800' }}>+ افزودن کار جدید</Text>
      </TouchableOpacity>

      <Modal visible={showAdd} transparent animationType="slide">
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.78)', justifyContent: 'flex-end' }} onPress={(e) => e.target === e.currentTarget && setShowAdd(false)}>
          <View style={{ backgroundColor: dark ? '#14203A' : '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 }}>
            <View style={{ width: 40, height: 4, backgroundColor: 'rgba(128,128,128,0.2)', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
            <Text style={{ fontSize: 18, fontWeight: '800', marginBottom: 20, color: tc }}>افزودن کار جدید</Text>

            <View style={{ marginBottom: 14 }}>
              <Text style={{ color: sub, fontSize: 13, marginBottom: 6 }}>عنوان کار *</Text>
              <TextInput value={newTask.title} onChangeText={(value) => setNewTask((t) => ({ ...t, title: value }))} placeholder="مثلاً: پاسخ به ایمیل‌ها" autoFocus style={{ backgroundColor: dark ? 'rgba(255,255,255,0.07)' : '#F8F9FA', borderWidth: 1, borderColor: bdr, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, color: tc, fontSize: 14 }} />
            </View>

            <View style={{ marginBottom: 14 }}>
              <Text style={{ color: sub, fontSize: 13, marginBottom: 6 }}>توضیحات</Text>
              <TextInput value={newTask.description} onChangeText={(value) => setNewTask((t) => ({ ...t, description: value }))} placeholder="جزئیات بیشتر..." style={{ backgroundColor: dark ? 'rgba(255,255,255,0.07)' : '#F8F9FA', borderWidth: 1, borderColor: bdr, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, color: tc, fontSize: 14 }} />
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: sub, fontSize: 13, marginBottom: 8 }}>اولویت</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                  <Pressable key={p} onPress={() => setNewTask((t) => ({ ...t, priority: p }))} style={{ flex: 1, borderRadius: 10, borderWidth: 2, borderColor: newTask.priority === p ? PRIORITY_COLOR[p] : 'transparent', backgroundColor: newTask.priority === p ? `${PRIORITY_COLOR[p]}18` : dark ? 'rgba(255,255,255,0.06)' : '#F8F9FA', paddingVertical: 9, alignItems: 'center' }}>
                    <Text style={{ color: newTask.priority === p ? PRIORITY_COLOR[p] : sub, fontSize: 13, fontWeight: '700' }}>{PRIORITY_LABEL[p]}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable onPress={() => setShowAdd(false)} style={{ flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: bdr, alignItems: 'center' }}>
                <Text style={{ color: sub, fontSize: 14 }}>انصراف</Text>
              </Pressable>
              <Pressable onPress={addTask} disabled={!newTask.title.trim()} style={{ flex: 2, paddingVertical: 12, borderRadius: 12, backgroundColor: '#5F27CD', alignItems: 'center', opacity: newTask.title.trim() ? 1 : 0.45 }}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>اضافه کن</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
