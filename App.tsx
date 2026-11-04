import React from 'react'
import { StatusBar, View } from 'react-native'
import { AddTaskModal } from './src/components/AddTaskModal'
import { DashboardScreen } from './src/screens/DashboardScreen'
import { LoginScreen } from './src/screens/LoginScreen'
import { ReportScreen } from './src/screens/ReportScreen'
import { StatsScreen } from './src/screens/StatsScreen'
import { useTaskStore } from './src/store/useTaskStore'

export default function App() {
  const dark = useTaskStore((state) => state.dark)
  const screen = useTaskStore((state) => state.screen)
  const tasks = useTaskStore((state) => state.tasks)
  const active = useTaskStore((state) => state.tasks.filter((task) => !task.completed && !task.skipped))
  const done = useTaskStore((state) => state.tasks.filter((task) => task.completed))
  const rotation = useTaskStore((state) => state.rotation)
  const spinning = useTaskStore((state) => state.spinning)
  const locked = useTaskStore((state) => state.locked)
  const selected = useTaskStore((state) => state.selected)
  const spinCount = useTaskStore((state) => state.spinCount)
  const showAdd = useTaskStore((state) => state.showAdd)
  const newTask = useTaskStore((state) => state.newTask)
  const reportForm = useTaskStore((state) => state.reportForm)
  const userName = useTaskStore((state) => state.userName)
  const userEmail = useTaskStore((state) => state.userEmail)

  const setDark = useTaskStore((state) => state.setDark)
  const setScreen = useTaskStore((state) => state.setScreen)
  const setUserName = useTaskStore((state) => state.setUserName)
  const setUserEmail = useTaskStore((state) => state.setUserEmail)
  const setShowAdd = useTaskStore((state) => state.setShowAdd)
  const setNewTask = useTaskStore((state) => state.setNewTask)
  const updateReportField = useTaskStore((state) => state.updateReportField)
  const startSpin = useTaskStore((state) => state.startSpin)
  const submitReport = useTaskStore((state) => state.submitReport)
  const skipSelectedTask = useTaskStore((state) => state.skipSelectedTask)
  const addTask = useTaskStore((state) => state.addTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)

  if (screen === 'login') {
    return (
      <>
        <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
        <LoginScreen
          dark={dark}
          userName={userName}
          userEmail={userEmail}
          onNameChange={setUserName}
          onEmailChange={setUserEmail}
          onContinue={() => setScreen('dashboard')}
          onToggleTheme={() => setDark(!dark)}
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
        onNoteChange={(note) => updateReportField('note', note)}
        onDifficultyChange={(difficulty) => updateReportField('difficulty', difficulty)}
        onDateChange={(at) => updateReportField('at', at)}
        onSubmit={submitReport}
        onSkip={skipSelectedTask}
        onBack={() => {
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
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
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
        onToggleTheme={() => setDark(!dark)}
        onOpenStats={() => setScreen('stats')}
        onSpin={startSpin}
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
