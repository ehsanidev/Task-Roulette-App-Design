import React from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { PRIORITY_COLOR, PRIORITY_LABEL } from '../constants/colors'
import { NewTaskDraft, Priority } from '../types/task'

interface AddTaskModalProps {
  visible: boolean
  dark: boolean
  draft: NewTaskDraft
  onClose: () => void
  onChange: (draft: NewTaskDraft) => void
  onSubmit: () => void
}

export function AddTaskModal({ visible, dark, draft, onClose, onChange, onSubmit }: AddTaskModalProps) {
  if (!visible) return null

  return (
    <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.78)', justifyContent: 'flex-end', zIndex: 100 }}>
      <View style={{ backgroundColor: dark ? '#14203A' : '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 }}>
        <View style={{ width: 40, height: 4, backgroundColor: 'rgba(128,128,128,0.2)', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
        <Text style={{ fontSize: 18, fontWeight: '800', marginBottom: 20, color: dark ? '#EAEAEA' : '#1A1A2E' }}>افزودن کار جدید</Text>

        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: dark ? '#8888AA' : '#636E72', fontSize: 13, marginBottom: 6 }}>عنوان کار *</Text>
          <TextInput
            value={draft.title}
            onChangeText={(value) => onChange({ ...draft, title: value })}
            placeholder="مثلاً: پاسخ به ایمیل‌ها"
            autoFocus
            style={{ backgroundColor: dark ? 'rgba(255,255,255,0.07)' : '#F8F9FA', borderWidth: 1, borderColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, color: dark ? '#EAEAEA' : '#1A1A2E', fontSize: 14 }}
          />
        </View>

        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: dark ? '#8888AA' : '#636E72', fontSize: 13, marginBottom: 6 }}>توضیحات</Text>
          <TextInput
            value={draft.description}
            onChangeText={(value) => onChange({ ...draft, description: value })}
            placeholder="جزئیات بیشتر..."
            style={{ backgroundColor: dark ? 'rgba(255,255,255,0.07)' : '#F8F9FA', borderWidth: 1, borderColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, color: dark ? '#EAEAEA' : '#1A1A2E', fontSize: 14 }}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: dark ? '#8888AA' : '#636E72', fontSize: 13, marginBottom: 8 }}>اولویت</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['high', 'medium', 'low'] as Priority[]).map((p) => (
              <Pressable
                key={p}
                onPress={() => onChange({ ...draft, priority: p })}
                style={{ flex: 1, borderRadius: 10, borderWidth: 2, borderColor: draft.priority === p ? PRIORITY_COLOR[p] : 'transparent', backgroundColor: draft.priority === p ? `${PRIORITY_COLOR[p]}18` : dark ? 'rgba(255,255,255,0.06)' : '#F8F9FA', paddingVertical: 9, alignItems: 'center' }}
              >
                <Text style={{ color: draft.priority === p ? PRIORITY_COLOR[p] : dark ? '#8888AA' : '#636E72', fontSize: 13, fontWeight: '700' }}>{PRIORITY_LABEL[p]}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable onPress={onClose} style={{ flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', alignItems: 'center' }}>
            <Text style={{ color: dark ? '#8888AA' : '#636E72', fontSize: 14 }}>انصراف</Text>
          </Pressable>
          <Pressable onPress={onSubmit} disabled={!draft.title.trim()} style={{ flex: 2, paddingVertical: 12, borderRadius: 12, backgroundColor: '#5F27CD', alignItems: 'center', opacity: draft.title.trim() ? 1 : 0.45 }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>اضافه کن</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}
