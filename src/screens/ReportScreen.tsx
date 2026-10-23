import React from 'react'
import { Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Task } from '../types/task'

interface ReportScreenProps {
  selected: Task
  dark: boolean
  reportForm: { note: string; difficulty: number; at: string }
  onNoteChange: (value: string) => void
  onDifficultyChange: (value: number) => void
  onDateChange: (value: string) => void
  onSubmit: () => void
  onSkip: () => void
  onBack: () => void
}

export function ReportScreen({ selected, dark, reportForm, onNoteChange, onDifficultyChange, onDateChange, onSubmit, onSkip, onBack }: ReportScreenProps) {
  const bg = dark ? '#0D0D1A' : '#F0F2F8'
  const card = dark ? '#14203A' : '#FFFFFF'
  const tc = dark ? '#EAEAEA' : '#1A1A2E'
  const sub = dark ? '#8888AA' : '#636E72'
  const bdr = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ backgroundColor: `${selected.color}CC`, paddingTop: 52, paddingBottom: 68, paddingHorizontal: 24, position: 'relative' }}>
        <Pressable onPress={onBack} style={{ position: 'absolute', top: 28, right: 20 }}>
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
            <TextInput value={reportForm.note} onChangeText={onNoteChange} placeholder="توضیح مختصری بنویسید..." placeholderTextColor={sub} multiline numberOfLines={3} style={{ width: '100%', minHeight: 80, backgroundColor: dark ? 'rgba(255,255,255,0.05)' : '#F8F9FA', borderWidth: 1, borderColor: bdr, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: tc, fontSize: 14, textAlignVertical: 'top' }} />
          </View>

          <View style={{ marginBottom: 18 }}>
            <Text style={{ color: sub, fontSize: 13, marginBottom: 10 }}>سختی کار</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => onDifficultyChange(s)}>
                  <Text style={{ fontSize: 30, opacity: s <= reportForm.difficulty ? 1 : 0.2, transform: [{ scale: s === reportForm.difficulty ? 1.2 : 1 }] }}>⭐</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ textAlign: 'center', color: sub, fontSize: 12, marginTop: 6 }}>{['', 'خیلی آسان', 'آسان', 'متوسط', 'سخت', 'خیلی سخت'][reportForm.difficulty]}</Text>
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: sub, fontSize: 13, marginBottom: 6 }}>زمان انجام</Text>
            <TextInput value={reportForm.at} onChangeText={onDateChange} placeholder="YYYY-MM-DDTHH:mm" placeholderTextColor={sub} style={{ width: '100%', backgroundColor: dark ? 'rgba(255,255,255,0.05)' : '#F8F9FA', borderWidth: 1, borderColor: bdr, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: tc, fontSize: 14 }} />
          </View>

          <TouchableOpacity onPress={onSubmit} style={{ backgroundColor: '#10AC84', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>✓ ثبت گزارش و ادامه</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onSkip} style={{ borderWidth: 1, borderColor: bdr, borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}>
            <Text style={{ color: sub, fontSize: 14 }}>رد کردن این کار</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
