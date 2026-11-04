export type Priority = 'high' | 'medium' | 'low'
export type Screen = 'login' | 'dashboard' | 'report' | 'stats'

export interface Task {
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

export interface NewTaskDraft {
  title: string
  description: string
  priority: Priority
}

export interface ReportDraft {
  note: string
  difficulty: number
  at: string
}
