import React, { useMemo, useRef, useState } from 'react'
import { StatusBar, View } from 'react-native'
import { AddTaskModal } from './components/AddTaskModal'
import { DashboardScreen } from './screens/DashboardScreen'
import { LoginScreen } from './screens/LoginScreen'
import { ReportScreen } from './screens/ReportScreen'
import { StatsScreen } from './screens/StatsScreen'
import { SAMPLE_TASKS } from './data/tasks'
import { NewTaskDraft, ReportDraft, Screen, Task } from './types/task'

export default function App() {
  const [dark, setDark] = useState(true)
  const [screen, setScreen] = useState<Screen>('login')
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS)
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [locked, setLocked] = useState(false)
  const [selected, setSelected] = useState<Task | null>(null)
  const [spinCount, setSpinCount] = useState(0)
  const [showAdd, setShowAdd] = useState(false)
  const [newTask, setNewTask] = useState<NewTaskDraft>({ title: '', description: '', priority: 'medium' })
  const [reportForm, setReportForm] = useState<ReportDraft>({ note: '', difficulty: 3, at: new Date().toISOString().slice(0, 16) })
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

    setTasks((prev) => prev.map((task) => (task.id === selected.id ? { ...task, completed: true, reportNote: reportForm.note, difficulty: reportForm.difficulty, completedAt: reportForm.at } : task)))
    setLocked(false)
    setSelected(null)
    setReportForm({ note: '', difficulty: 3, at: new Date().toISOString().slice(0, 16) })
    setScreen('dashboard')
  }

  const skipTask = () => {
    if (!selected) return

    setTasks((prev) => prev.map((task) => (task.id === selected.id ? { ...task, skipped: true } : task)))
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
      color: ['#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB', '#0ABDE3', '#10AC84', '#5F27CD', '#01CBC6', '#E84393'][active.length % 9],
    }

    setTasks((prev) => [...prev, task])
    setNewTask({ title: '', description: '', priority: 'medium' })
    setShowAdd(false)
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  if (screen === 'login') {
    return (
      <>
        <StatusBar barStyle="light-content" />
        <LoginScreen
          dark={dark}
          userName={userName}
          userEmail={userEmail}
          onNameChange={setUserName}
          onEmailChange={setUserEmail}
          onContinue={() => setScreen('dashboard')}
          onToggleTheme={() => setDark((d) => !d)}
        />
      </>
    )
  }

  if (screen === 'report' && selected) {
    return (
      <ReportScreen
        selected={selected}
        dark={dark}
        reportForm={reportForm}
        onNoteChange={(note) => setReportForm((prev) => ({ ...prev, note }))}
        onDifficultyChange={(difficulty) => setReportForm((prev) => ({ ...prev, difficulty }))}
        onDateChange={(at) => setReportForm((prev) => ({ ...prev, at }))}
        onSubmit={submitReport}
        onSkip={skipTask}
        onBack={() => {
          setLocked(false)
          setSelected(null)
          setScreen('dashboard')
        }}
      />
    )
  }

  if (screen === 'stats') {
    return (
      <StatsScreen
        tasks={tasks}
        active={active}
        done={done}
        dark={dark}
        spinCount={spinCount}
        onBack={() => setScreen('dashboard')}
      />
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <DashboardScreen
        dark={dark}
        userName={userName}
        tasks={tasks}
        active={active}
        done={done}
        rotation={rotation}
        spinning={spinning}
        locked={locked}
        selected={selected}
        onToggleTheme={() => setDark((d) => !d)}
        onOpenStats={() => setScreen('stats')}
        onSpin={spin}
        onOpenReport={() => setScreen('report')}
        onDeleteTask={deleteTask}
        onAddTask={() => setShowAdd(true)}
      />

      <AddTaskModal
        visible={showAdd}
        dark={dark}
        draft={newTask}
        onClose={() => setShowAdd(false)}
        onChange={setNewTask}
        onSubmit={addTask}
      />
    </View>
  )
}
