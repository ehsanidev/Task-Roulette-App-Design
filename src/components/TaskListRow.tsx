import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Task } from '../types/task'

interface TaskListRowProps {
  task: Task
  onDelete: (taskId: string) => void
  dark: boolean
}

export function TaskListRow({ task, onDelete, dark }: TaskListRowProps) {
  return (
    <View style={{ backgroundColor: dark ? '#14203A' : '#fff', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, marginBottom: 10, borderWidth: 1, borderColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ width: 13, height: 13, borderRadius: 4, backgroundColor: task.color }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '700', fontSize: 14, color: dark ? '#EAEAEA' : '#1A1A2E' }}>{task.title}</Text>
        <Text style={{ color: dark ? '#8888AA' : '#636E72', fontSize: 12, marginTop: 2 }}>{task.description}</Text>
      </View>
      <View style={{ backgroundColor: `${task.color}22`, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 }}>
        <Text style={{ fontSize: 11, color: task.color }}>{task.priority === 'high' ? 'بالا' : task.priority === 'medium' ? 'متوسط' : 'پایین'}</Text>
      </View>
      <TouchableOpacity onPress={() => onDelete(task.id)}>
        <Text style={{ color: dark ? '#8888AA' : '#636E72', fontSize: 19, padding: 4 }}>×</Text>
      </TouchableOpacity>
    </View>
  )
}
