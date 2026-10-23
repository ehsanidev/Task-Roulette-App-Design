import React from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'

interface LoginScreenProps {
  dark: boolean
  userName: string
  userEmail: string
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onContinue: () => void
  onToggleTheme: () => void
}

export function LoginScreen({ dark, userName, userEmail, onNameChange, onEmailChange, onContinue, onToggleTheme }: LoginScreenProps) {
  return (
    <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: '#0D0D1A' }}>
      <View style={{ width: '100%', maxWidth: 420 }}>
        <View style={{ alignItems: 'center', marginBottom: 44 }}>
          <View style={{ position: 'relative', width: 104, height: 104, marginBottom: 20 }}>
            <View style={{ width: 104, height: 104, borderRadius: 999, backgroundColor: '#1A1A2E', overflow: 'hidden' }} />
          </View>
          <Text style={{ fontSize: 36, fontWeight: '900', letterSpacing: -1, color: '#EAEAEA' }}>Task Roulette</Text>
          <Text style={{ marginTop: 8, color: '#8888AA', fontSize: 15 }}>وظایفت رو به شانس بسپار!</Text>
        </View>

        <View style={{ backgroundColor: '#14203A', borderRadius: 24, padding: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' }}>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: '#8888AA', fontSize: 13, marginBottom: 6 }}>نام شما</Text>
            <TextInput value={userName} onChangeText={onNameChange} placeholder="مثلاً: علی رضایی" placeholderTextColor="#8B8BA7" style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: '#EAEAEA', fontSize: 15 }} />
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: '#8888AA', fontSize: 13, marginBottom: 6 }}>ایمیل</Text>
            <TextInput value={userEmail} onChangeText={onEmailChange} placeholder="you@example.com" keyboardType="email-address" placeholderTextColor="#8B8BA7" autoCapitalize="none" style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: '#EAEAEA', fontSize: 15 }} />
          </View>

          <Pressable onPress={onContinue} style={{ backgroundColor: '#5F27CD', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>شروع کنید ←</Text>
          </Pressable>
        </View>

        <Pressable onPress={onToggleTheme} style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ color: '#8888AA', fontSize: 13 }}>{dark ? '☀️ تم روشن' : '🌙 تم تاریک'}</Text>
        </Pressable>
      </View>
    </View>
  )
}
