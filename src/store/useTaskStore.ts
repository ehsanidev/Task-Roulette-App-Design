import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { COLORS } from '../constants/colors'
import { SAMPLE_TASKS } from '../data/tasks'
import { NewTaskDraft, ReportDraft, Screen, Task } from '../types/task'

type TaskStore = {
  dark: boolean
  screen: Screen
  tasks: Task[]
  rotation: number
  spinning: boolean
  locked: boolean
  selected: Task | null
  spinCount: number
  showAdd: boolean
  newTask: NewTaskDraft
  reportForm: ReportDraft
  userName: string
  userEmail: string

  setDark: (dark: boolean) => void
  setScreen: (screen: Screen) => void
  setUserName: (userName: string) => void
  setUserEmail: (userEmail: string) => void
  setShowAdd: (showAdd: boolean) => void
  setNewTask: (draft: NewTaskDraft) => void
  updateReportField: <K extends keyof ReportDraft>(field: K, value: ReportDraft[K]) => void
  startSpin: () => void
  submitReport: () => void
  skipSelectedTask: () => void
  addTask: () => void
  deleteTask: (taskId: string) => void
}

const defaultReportForm: ReportDraft = {
  note: '',
  difficulty: 3,
  at: new Date().toISOString().slice(0, 16),
}

const defaultNewTask: NewTaskDraft = {
  title: '',
  description: '',
  priority: 'medium',
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      dark: true,
      screen: 'login',
      tasks: SAMPLE_TASKS,
      rotation: 0,
      spinning: false,
      locked: false,
      selected: null,
      spinCount: 0,
      showAdd: false,
      newTask: defaultNewTask,
      reportForm: defaultReportForm,
      userName: '',
      userEmail: '',

      setDark: (dark) => set({ dark }),
      setScreen: (screen) => set({ screen }),
      setUserName: (userName) => set({ userName }),
      setUserEmail: (userEmail) => set({ userEmail }),
      setShowAdd: (showAdd) => set({ showAdd }),
      setNewTask: (newTask) => set({ newTask }),
      updateReportField: (field, value) =>
        set((state) => ({
          reportForm: {
            ...state.reportForm,
            [field]: value,
          },
        })),

      startSpin: () => {
        const active = get().tasks.filter((task) => !task.completed && !task.skipped)
        if (get().spinning || get().locked || active.length === 0) return

        const idx = Math.floor(Math.random() * active.length)
        const seg = 360 / active.length
        const mid = (idx + 0.5) * seg
        const cur = ((get().rotation % 360) + 360) % 360
        const tgt = (360 - (mid % 360) + 360) % 360
        const delta = (tgt - cur + 360) % 360
        const nextRotation = get().rotation + 1800 + delta

        set({ rotation: nextRotation, spinning: true })

        setTimeout(() => {
          const current = get()
          const latestActive = current.tasks.filter((task) => !task.completed && !task.skipped)
          const selectedTask = latestActive[idx] ?? null

          set({
            spinning: false,
            locked: true,
            selected: selectedTask,
            spinCount: current.spinCount + 1,
          })
        }, 4100)
      },

      submitReport: () => {
        const selected = get().selected
        if (!selected) return

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === selected.id
              ? {
                  ...task,
                  completed: true,
                  reportNote: state.reportForm.note,
                  difficulty: state.reportForm.difficulty,
                  completedAt: state.reportForm.at,
                }
              : task,
          ),
          locked: false,
          selected: null,
          reportForm: defaultReportForm,
          screen: 'dashboard',
        }))
      },

      skipSelectedTask: () => {
        const selected = get().selected
        if (!selected) return

        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === selected.id ? { ...task, skipped: true } : task)),
          locked: false,
          selected: null,
          screen: 'dashboard',
        }))
      },

      addTask: () => {
        const { newTask, tasks } = get()
        if (!newTask.title.trim()) return

        const activeCount = tasks.filter((task) => !task.completed && !task.skipped).length
        const task: Task = {
          id: Date.now().toString(),
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          completed: false,
          skipped: false,
          color: COLORS[activeCount % COLORS.length],
        }

        set((state) => ({
          tasks: [...state.tasks, task],
          newTask: defaultNewTask,
          showAdd: false,
        }))
      },

      deleteTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        }))
      },
    }),
    {
      name: 'task-roulette-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        dark: state.dark,
        tasks: state.tasks,
        spinCount: state.spinCount,
        userName: state.userName,
        userEmail: state.userEmail,
      }),
    },
  ),
)
