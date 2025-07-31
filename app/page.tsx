"use client"

import { useState } from "react"
import LandingPage from "./components/LandingPage"
import LoginPage from "./components/LoginPage"
import Dashboard from "./components/Dashboard"
import BattleArena from "./components/BattleArena"
import CombatArena from "./components/CombatArena"

export default function KOFApp() {
  const [currentView, setCurrentView] = useState<"landing" | "login" | "register" | "dashboard" | "battle">("landing")
  const [user, setUser] = useState<any>(null)
  const [battleMode, setBattleMode] = useState<"1v1" | "3v3" | null>(null)
  const [selectedTeams, setSelectedTeams] = useState<{ teamA: any[], teamB: any[] }>({ teamA: [], teamB: [] })

  const handleLogin = (userData: any) => {
    setUser(userData)
    setCurrentView("dashboard")
  }

  const handleStartBattle = (mode: "1v1" | "3v3", teams: { teamA: any[], teamB: any[] }) => {
    setBattleMode(mode)
    setSelectedTeams(teams)
    setCurrentView("battle")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setBattleMode(null)
    setSelectedTeams({ teamA: [], teamB: [] })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#330000] relative overflow-hidden">
      {/* Partículas de fondo */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {currentView === "landing" && (
        <LandingPage onLogin={() => setCurrentView("login")} onRegister={() => setCurrentView("register")} />
      )}

      {(currentView === "login" || currentView === "register") && (
        <LoginPage mode={currentView} onLogin={handleLogin} onBack={() => setCurrentView("landing")} />
      )}

      {currentView === "dashboard" && (
        <Dashboard
          user={user}
          onStartBattle={handleStartBattle}
          onLogout={() => {
            setUser(null)
            setCurrentView("landing")
          }}
        />
      )}

      {currentView === "battle" && battleMode && (
        <CombatArena 
          playerA={selectedTeams.teamA[0]} 
          playerB={selectedTeams.teamB[0]} 
          onBack={handleBackToDashboard}
          mode={battleMode}
          teamA={selectedTeams.teamA}
          teamB={selectedTeams.teamB}
        />
      )}
    </div>
  )
}
