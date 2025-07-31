"use client"

import { useState, useEffect } from "react"

interface BattleArenaProps {
  mode: "1v1" | "3v3"
  playerTeam: any[]
  enemyTeam: any[]
  onBack: () => void
}

export default function BattleArena({ mode, playerTeam, enemyTeam, onBack }: BattleArenaProps) {
  const [playerCurrentFighter, setPlayerCurrentFighter] = useState(0)
  const [enemyCurrentFighter, setEnemyCurrentFighter] = useState(0)
  const [playerHealth, setPlayerHealth] = useState(playerTeam[0]?.health || 100)
  const [enemyHealth, setEnemyHealth] = useState(enemyTeam[0]?.health || 100)
  const [battleLog, setBattleLog] = useState<string[]>([])
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [battleEnded, setBattleEnded] = useState(false)
  const [winner, setWinner] = useState<"player" | "enemy" | null>(null)

  const currentPlayer = playerTeam[playerCurrentFighter]
  const currentEnemy = enemyTeam[enemyCurrentFighter]

  const addToBattleLog = (message: string) => {
    setBattleLog((prev) => [...prev.slice(-4), message])
  }

  const calculateDamage = (attacker: any, defender: any) => {
    const baseDamage = attacker.attack
    const defense = defender.defense
    const randomFactor = 0.8 + Math.random() * 0.4 // 80% - 120%
    return Math.max(1, Math.floor((baseDamage - defense * 0.3) * randomFactor))
  }

  const executePlayerAttack = () => {
    if (!isPlayerTurn || battleEnded) return

    const damage = calculateDamage(currentPlayer, currentEnemy)
    const newEnemyHealth = Math.max(0, enemyHealth - damage)
    setEnemyHealth(newEnemyHealth)

    addToBattleLog(`${currentPlayer.name} ataca por ${damage} de daño!`)

    if (newEnemyHealth === 0) {
      addToBattleLog(`${currentEnemy.name} ha sido derrotado!`)

      if (enemyCurrentFighter < enemyTeam.length - 1) {
        setEnemyCurrentFighter((prev) => prev + 1)
        setEnemyHealth(enemyTeam[enemyCurrentFighter + 1].health)
      } else {
        setBattleEnded(true)
        setWinner("player")
        addToBattleLog("¡VICTORIA! Has ganado la batalla!")
        return
      }
    }

    setIsPlayerTurn(false)

    // Turno enemigo después de 1.5 segundos
    setTimeout(() => {
      executeEnemyAttack()
    }, 1500)
  }

  const executeEnemyAttack = () => {
    if (battleEnded) return

    const damage = calculateDamage(currentEnemy, currentPlayer)
    const newPlayerHealth = Math.max(0, playerHealth - damage)
    setPlayerHealth(newPlayerHealth)

    addToBattleLog(`${currentEnemy.name} contraataca por ${damage} de daño!`)

    if (newPlayerHealth === 0) {
      addToBattleLog(`${currentPlayer.name} ha sido derrotado!`)

      if (playerCurrentFighter < playerTeam.length - 1) {
        setPlayerCurrentFighter((prev) => prev + 1)
        setPlayerHealth(playerTeam[playerCurrentFighter + 1].health)
      } else {
        setBattleEnded(true)
        setWinner("enemy")
        addToBattleLog("DERROTA! Has perdido la batalla!")
        return
      }
    }

    setIsPlayerTurn(true)
  }

  useEffect(() => {
    addToBattleLog("¡La batalla ha comenzado!")
  }, [])

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-600/20 border border-gray-500 text-gray-400 rounded hover:bg-gray-600/40 transition-all arcade-font text-xs"
        >
          ← VOLVER
        </button>
        <h1 className="arcade-font text-xl md:text-3xl text-glow-red text-[#FF0000]">BATALLA {mode.toUpperCase()}</h1>
        <div className="text-right text-sm text-white/80">Turno: {isPlayerTurn ? "JUGADOR" : "ENEMIGO"}</div>
      </div>

      {/* Arena de batalla */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Luchador del jugador */}
        <div className="character-card p-6 rounded-lg">
          <h3 className="arcade-font text-lg text-[#FFD700] text-center mb-4">TU LUCHADOR</h3>
          <div className="text-center mb-4">
            <img
              src={currentPlayer?.image || "/placeholder.svg?height=120&width=120&query=fighter"}
              alt={currentPlayer?.name}
              className="w-24 h-24 mx-auto rounded-lg mb-2"
            />
            <h4 className="arcade-font text-[#FFD700]">{currentPlayer?.name}</h4>
          </div>

          {/* Barra de vida del jugador */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white">VIDA</span>
              <span className="text-green-400">
                {playerHealth}/{currentPlayer?.health}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 border border-green-500">
              <div
                className="health-bar bg-gradient-to-r from-green-600 to-green-400 h-full rounded-full"
                style={{ width: `${(playerHealth / (currentPlayer?.health || 100)) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Equipo restante */}
          <div className="text-center">
            <p className="text-xs text-white/60 mb-2">EQUIPO RESTANTE</p>
            <div className="flex justify-center gap-2">
              {playerTeam.map((fighter, index) => (
                <div
                  key={fighter.id}
                  className={`w-8 h-8 rounded border-2 ${
                    index === playerCurrentFighter
                      ? "border-[#FFD700] bg-[#FFD700]/20"
                      : index < playerCurrentFighter
                        ? "border-red-500 bg-red-500/20"
                        : "border-white/50 bg-white/10"
                  }`}
                >
                  <span className="text-xs flex items-center justify-center h-full">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Log de batalla */}
        <div className="character-card p-6 rounded-lg">
          <h3 className="arcade-font text-lg text-[#FF0000] text-center mb-4 text-glow-red">LOG DE BATALLA</h3>
          <div className="bg-black/50 rounded-lg p-4 h-64 overflow-y-auto">
            {battleLog.map((log, index) => (
              <div
                key={index}
                className={`text-sm mb-2 animate-slide-in ${
                  log.includes("daño")
                    ? "text-red-400"
                    : log.includes("VICTORIA")
                      ? "text-green-400"
                      : log.includes("DERROTA")
                        ? "text-red-500"
                        : "text-white/80"
                }`}
              >
                {log}
              </div>
            ))}
          </div>

          {/* Botón de ataque */}
          <div className="mt-4 text-center">
            {!battleEnded ? (
              <button
                onClick={executePlayerAttack}
                disabled={!isPlayerTurn}
                className={`arcade-button px-6 py-3 arcade-font rounded-lg ${
                  isPlayerTurn ? "glow-red animate-pulse-glow" : "opacity-50 cursor-not-allowed"
                }`}
              >
                {isPlayerTurn ? "¡ATACAR!" : "ESPERANDO..."}
              </button>
            ) : (
              <div className="space-y-2">
                <div className={`arcade-font text-lg ${winner === "player" ? "text-green-400" : "text-red-400"}`}>
                  {winner === "player" ? "¡VICTORIA!" : "¡DERROTA!"}
                </div>
                <button onClick={onBack} className="arcade-button px-6 py-3 arcade-font rounded-lg">
                  CONTINUAR
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Luchador enemigo */}
        <div className="character-card p-6 rounded-lg">
          <h3 className="arcade-font text-lg text-[#FF0000] text-center mb-4">ENEMIGO</h3>
          <div className="text-center mb-4">
            <img
              src="/placeholder.svg?height=120&width=120"
              alt={currentEnemy?.name}
              className="w-24 h-24 mx-auto rounded-lg mb-2"
            />
            <h4 className="arcade-font text-[#FF0000]">{currentEnemy?.name}</h4>
          </div>

          {/* Barra de vida del enemigo */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white">VIDA</span>
              <span className="text-red-400">
                {enemyHealth}/{currentEnemy?.health}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 border border-red-500">
              <div
                className="health-bar bg-gradient-to-r from-red-600 to-red-400 h-full rounded-full"
                style={{ width: `${(enemyHealth / (currentEnemy?.health || 100)) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Equipo enemigo restante */}
          <div className="text-center">
            <p className="text-xs text-white/60 mb-2">ENEMIGOS RESTANTES</p>
            <div className="flex justify-center gap-2">
              {enemyTeam.map((fighter, index) => (
                <div
                  key={fighter.id}
                  className={`w-8 h-8 rounded border-2 ${
                    index === enemyCurrentFighter
                      ? "border-[#FF0000] bg-[#FF0000]/20"
                      : index < enemyCurrentFighter
                        ? "border-gray-500 bg-gray-500/20"
                        : "border-white/50 bg-white/10"
                  }`}
                >
                  <span className="text-xs flex items-center justify-center h-full">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
