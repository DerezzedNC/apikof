"use client"

import { useState } from "react"

interface DashboardProps {
  user: any
  onStartBattle: (mode: "1v1" | "3v3", teams: { teamA: any[], teamB: any[] }) => void
  onLogout: () => void
}

const CHARACTERS = [
  { id: 1, name: "RYU", health: 100, attack: 85, defense: 70, image: "/assets/ryu.Gif" },
  { id: 2, name: "CHUN-LI", health: 90, attack: 80, defense: 75, image: "/assets/chunli.gif" },
  { id: 3, name: "KEN", health: 95, attack: 90, defense: 65, image: "/assets/ken.gif" },
  { id: 4, name: "BLANKA", health: 110, attack: 75, defense: 80, image: "/assets/blanka.gif" },
  { id: 5, name: "ZANGIEF", health: 120, attack: 95, defense: 85, image: "/placeholder.svg?height=120&width=120" },
  { id: 6, name: "DHALSIM", health: 85, attack: 70, defense: 60, image: "/assets/dhal.gif" },
  { id: 7, name: "GUILE", health: 100, attack: 80, defense: 75, image: "/assets/guile.gif" },
  { id: 8, name: "SAGAT", health: 105, attack: 90, defense: 70, image: "/placeholder.svg?height=120&width=120" },
]

export default function Dashboard({ user, onStartBattle, onLogout }: DashboardProps) {
  const [selectedMode, setSelectedMode] = useState<"1v1" | "3v3" | null>(null)
  const [selectedTeamA, setSelectedTeamA] = useState<any[]>([])
  const [selectedTeamB, setSelectedTeamB] = useState<any[]>([])

  const handleCharacterSelect = (character: any, team: "A" | "B") => {
    const maxTeamSize = selectedMode === "1v1" ? 1 : 3
    const selectedTeam = team === "A" ? selectedTeamA : selectedTeamB
    const setSelectedTeam = team === "A" ? setSelectedTeamA : setSelectedTeamB

    // Verificar si el personaje ya está seleccionado en el otro equipo
    const otherTeam = team === "A" ? selectedTeamB : selectedTeamA
    if (otherTeam.find((c) => c.id === character.id)) {
      return // No permitir seleccionar el mismo personaje en ambos equipos
    }

    if (selectedTeam.find((c) => c.id === character.id)) {
      setSelectedTeam(selectedTeam.filter((c) => c.id !== character.id))
    } else if (selectedTeam.length < maxTeamSize) {
      setSelectedTeam([...selectedTeam, character])
    }
  }

  const canStartBattle = selectedMode && 
    selectedTeamA.length === (selectedMode === "1v1" ? 1 : 3) && 
    selectedTeamB.length === (selectedMode === "1v1" ? 1 : 3)

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="arcade-font text-2xl md:text-4xl text-glow-gold text-[#FFD700] mb-2">
            BIENVENIDO, {user.username.toUpperCase()}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-white/80">
            <span>Nivel: {user.level}</span>
            <span>Victorias: {user.wins}</span>
            <span>Derrotas: {user.losses}</span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="mt-4 md:mt-0 px-4 py-2 bg-red-600/20 border border-red-500 text-red-400 rounded hover:bg-red-600/40 transition-all arcade-font text-xs"
        >
          SALIR
        </button>
      </div>

      {/* Selección de modo */}
      <div className="mb-8">
        <h2 className="arcade-font text-xl md:text-2xl text-[#FF0000] mb-4 text-glow-red">
          SELECCIONA MODO DE BATALLA
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => {
              setSelectedMode("1v1")
              setSelectedTeam([])
            }}
            className={`arcade-button px-6 py-4 text-lg arcade-font rounded-lg flex-1 ${
              selectedMode === "1v1" ? "glow-red" : ""
            }`}
          >
            BATALLA 1 VS 1
          </button>
          <button
            onClick={() => {
              setSelectedMode("3v3")
              setSelectedTeam([])
            }}
            className={`arcade-button px-6 py-4 text-lg arcade-font rounded-lg flex-1 ${
              selectedMode === "3v3" ? "glow-red" : ""
            }`}
          >
            EQUIPO 3 VS 3
          </button>
        </div>
      </div>

      {selectedMode && (
        <>
          {/* Equipos seleccionados */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Equipo A */}
              <div>
                <h3 className="arcade-font text-lg text-[#FF0000] mb-4 text-glow-red">
                  EQUIPO A ({selectedTeamA.length}/{selectedMode === "1v1" ? 1 : 3})
                </h3>
                <div className="flex flex-wrap gap-4 min-h-[100px] p-4 bg-red-900/30 rounded-lg border border-[#FF0000]/30">
                  {selectedTeamA.map((character, index) => (
                    <div key={character.id} className="character-card selected p-3 rounded-lg w-24 text-center">
                      <img
                        src={character.image || "/placeholder.svg"}
                        alt={character.name}
                        className="w-16 h-16 mx-auto mb-2 rounded"
                      />
                      <div className="arcade-font text-xs text-[#FFD700]">{character.name}</div>
                    </div>
                  ))}
                  {Array.from({ length: (selectedMode === "1v1" ? 1 : 3) - selectedTeamA.length }).map((_, index) => (
                    <div
                      key={`empty-a-${index}`}
                      className="w-24 h-24 border-2 border-dashed border-red-300/30 rounded-lg flex items-center justify-center"
                    >
                      <span className="text-red-300/50 text-xs">VACÍO</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipo B */}
              <div>
                <h3 className="arcade-font text-lg text-[#0000FF] mb-4 text-glow-blue">
                  EQUIPO B ({selectedTeamB.length}/{selectedMode === "1v1" ? 1 : 3})
                </h3>
                <div className="flex flex-wrap gap-4 min-h-[100px] p-4 bg-blue-900/30 rounded-lg border border-[#0000FF]/30">
                  {selectedTeamB.map((character, index) => (
                    <div key={character.id} className="character-card selected p-3 rounded-lg w-24 text-center">
                      <img
                        src={character.image || "/placeholder.svg"}
                        alt={character.name}
                        className="w-16 h-16 mx-auto mb-2 rounded"
                      />
                      <div className="arcade-font text-xs text-[#FFD700]">{character.name}</div>
                    </div>
                  ))}
                  {Array.from({ length: (selectedMode === "1v1" ? 1 : 3) - selectedTeamB.length }).map((_, index) => (
                    <div
                      key={`empty-b-${index}`}
                      className="w-24 h-24 border-2 border-dashed border-blue-300/30 rounded-lg flex items-center justify-center"
                    >
                      <span className="text-blue-300/50 text-xs">VACÍO</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grilla de personajes */}
          <div className="mb-8">
            <h3 className="arcade-font text-lg text-[#FFD700] mb-4 text-glow-gold">SELECCIONA TUS LUCHADORES</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {CHARACTERS.map((character) => {
                const isInTeamA = selectedTeamA.find((c) => c.id === character.id)
                const isInTeamB = selectedTeamB.find((c) => c.id === character.id)
                const isSelected = isInTeamA || isInTeamB
                
                return (
                  <div
                    key={character.id}
                    onClick={() => {
                      if (!isSelected) {
                        // Si no está seleccionado, preguntar a qué equipo agregarlo
                        const team = window.confirm(`¿A qué equipo quieres agregar a ${character.name}?\n\nOK = Equipo A (Rojo)\nCancelar = Equipo B (Azul)`) ? "A" : "B"
                        handleCharacterSelect(character, team)
                      } else {
                        // Si ya está seleccionado, removerlo del equipo correspondiente
                        if (isInTeamA) {
                          handleCharacterSelect(character, "A")
                        } else {
                          handleCharacterSelect(character, "B")
                        }
                      }
                    }}
                    className={`character-card p-4 rounded-lg cursor-pointer transition-all ${
                      isInTeamA ? "selected-team-a border-2 border-red-500 bg-red-900/20" :
                      isInTeamB ? "selected-team-b border-2 border-blue-500 bg-blue-900/20" :
                      "border border-white/20"
                    }`}
                  >
                    <img
                      src={character.image || "/placeholder.svg"}
                      alt={character.name}
                      className="w-full h-24 object-cover rounded mb-3"
                    />
                    <h4 className="arcade-font text-xs text-[#FFD700] text-center mb-2">{character.name}</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-white/80">
                        <span>VIDA:</span>
                        <span className="text-green-400">{character.health}</span>
                      </div>
                      <div className="flex justify-between text-white/80">
                        <span>ATQ:</span>
                        <span className="text-red-400">{character.attack}</span>
                      </div>
                      <div className="flex justify-between text-white/80">
                        <span>DEF:</span>
                        <span className="text-blue-400">{character.defense}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 text-xs rounded ${
                          isInTeamA ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                        }`}>
                          {isInTeamA ? "A" : "B"}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Botón de iniciar batalla */}
          {canStartBattle && (
            <div className="text-center">
              <button
                onClick={() => onStartBattle(selectedMode, { teamA: selectedTeamA, teamB: selectedTeamB })}
                className="arcade-button px-12 py-6 text-xl arcade-font rounded-lg glow-gold animate-pulse-glow"
              >
                ¡INICIAR BATALLA!
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
