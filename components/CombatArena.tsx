"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import "./combat.css"

interface Fighter {
  id: string
  name: string
  health: number
  maxHealth: number
  attack: number
  defense: number
  position: number
}

interface DamageNumber {
  id: string
  damage: number
  x: number
  y: number
}

export default function CombatArena() {
  // Estado de los luchadores
  const [playerA, setPlayerA] = useState<Fighter>({
    id: "playerA",
    name: "RYU",
    health: 100,
    maxHealth: 100,
    attack: 25,
    defense: 10,
    position: 20, // porcentaje desde la izquierda
  })

  const [playerB, setPlayerB] = useState<Fighter>({
    id: "playerB",
    name: "KEN",
    health: 100,
    maxHealth: 100,
    attack: 23,
    defense: 12,
    position: 70, // porcentaje desde la izquierda
  })

  // Estado del juego
  const [gameState, setGameState] = useState<"playing" | "finished">("playing")
  const [winner, setWinner] = useState<string | null>(null)
  const [currentTurn, setCurrentTurn] = useState<"playerA" | "playerB">("playerA")
  const [isExecutingTurn, setIsExecutingTurn] = useState(false)
  const [battleLog, setBattleLog] = useState<string[]>([])
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([])
  const [movingPlayers, setMovingPlayers] = useState<Set<string>>(new Set())
  const [attackingPlayers, setAttackingPlayers] = useState<Set<string>>(new Set())

  // Referencias para el manejo de teclas
  const keysPressed = useRef<Set<string>>(new Set())

  // Función para agregar entrada al log de batalla
  const addToBattleLog = useCallback((message: string, type: "system" | "damage" | "normal" = "normal") => {
    setBattleLog((prev) => [...prev.slice(-9), message])
  }, [])

  // Función para mostrar número de daño
  const showDamageNumber = useCallback(
    (damage: number, targetPlayer: "playerA" | "playerB") => {
      const target = targetPlayer === "playerA" ? playerA : playerB
      const x = targetPlayer === "playerA" ? target.position + 10 : target.position - 5
      const y = 40 + Math.random() * 20

      const damageId = `damage-${Date.now()}-${Math.random()}`
      setDamageNumbers((prev) => [
        ...prev,
        {
          id: damageId,
          damage,
          x,
          y,
        },
      ])

      // Remover el número después de la animación
      setTimeout(() => {
        setDamageNumbers((prev) => prev.filter((d) => d.id !== damageId))
      }, 1500)
    },
    [playerA, playerB],
  )

  // Función para calcular daño
  const calculateDamage = useCallback((attacker: Fighter, defender: Fighter): number => {
    const baseDamage = attacker.attack
    const defense = defender.defense
    const randomFactor = 0.8 + Math.random() * 0.4 // 80% - 120%
    const finalDamage = Math.max(1, Math.floor((baseDamage - defense * 0.3) * randomFactor))
    return finalDamage
  }, [])

  // Función principal para ejecutar turno
  const ejecutarTurno = useCallback(async () => {
    if (isExecutingTurn || gameState === "finished") return

    setIsExecutingTurn(true)

    const attacker = currentTurn === "playerA" ? playerA : playerB
    const defender = currentTurn === "playerA" ? playerB : playerA
    const attackerSetter = currentTurn === "playerA" ? setPlayerA : setPlayerB
    const defenderSetter = currentTurn === "playerA" ? setPlayerB : setPlayerA

    // Animación de ataque
    setAttackingPlayers((prev) => new Set([...prev, attacker.id]))
    addToBattleLog(`${attacker.name} prepara su ataque...`, "system")

    // Simular llamada a API (aquí puedes conectar con tu backend)
    try {
      // Simulación de llamada a API
      const apiResponse = await simulateAPICall({
        attacker: attacker.id,
        defender: defender.id,
        attackType: "basic",
      })

      // Procesar respuesta de la API
      const damage = apiResponse.damage || calculateDamage(attacker, defender)
      const newHealth = Math.max(0, defender.health - damage)

      setTimeout(() => {
        // Aplicar daño
        defenderSetter((prev) => ({ ...prev, health: newHealth }))
        showDamageNumber(damage, currentTurn === "playerA" ? "playerB" : "playerA")
        addToBattleLog(`${attacker.name} inflige ${damage} de daño a ${defender.name}!`, "damage")

        // Verificar si hay ganador
        if (newHealth <= 0) {
          setGameState("finished")
          setWinner(attacker.name)
          addToBattleLog(`¡${attacker.name} gana la batalla!`, "system")
        } else {
          // Cambiar turno
          setCurrentTurn(currentTurn === "playerA" ? "playerB" : "playerA")
          addToBattleLog(`Turno de ${currentTurn === "playerA" ? playerB.name : playerA.name}`, "system")
        }

        // Remover animación de ataque
        setAttackingPlayers((prev) => {
          const newSet = new Set(prev)
          newSet.delete(attacker.id)
          return newSet
        })

        setIsExecutingTurn(false)
      }, 600)
    } catch (error) {
      console.error("Error en la llamada a la API:", error)
      addToBattleLog("Error en la conexión. Intenta de nuevo.", "system")
      setIsExecutingTurn(false)
      setAttackingPlayers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(attacker.id)
        return newSet
      })
    }
  }, [isExecutingTurn, gameState, currentTurn, playerA, playerB, addToBattleLog, showDamageNumber, calculateDamage])

  // Simulación de llamada a API REST
  const simulateAPICall = async (battleData: any): Promise<any> => {
    // Aquí puedes reemplazar con tu llamada real a la API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          damage: Math.floor(Math.random() * 30) + 15,
          message: "Ataque ejecutado correctamente",
        })
      }, 500)
    })
  }

  // Función para mover jugadores
  const movePlayer = useCallback(
    (playerId: string, direction: "left" | "right") => {
      if (isExecutingTurn || gameState === "finished") return

      const setter = playerId === "playerA" ? setPlayerA : setPlayerB
      const moveAmount = 5

      setter((prev) => {
        let newPosition = prev.position
        if (direction === "left") {
          newPosition = Math.max(5, prev.position - moveAmount)
        } else {
          newPosition = Math.min(85, prev.position + moveAmount)
        }
        return { ...prev, position: newPosition }
      })

      // Mostrar animación de movimiento
      setMovingPlayers((prev) => new Set([...prev, playerId]))
      setTimeout(() => {
        setMovingPlayers((prev) => {
          const newSet = new Set(prev)
          newSet.delete(playerId)
          return newSet
        })
      }, 300)
    },
    [isExecutingTurn, gameState],
  )

  // Manejo de eventos de teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      keysPressed.current.add(key)

      // Controles del Jugador A
      if (key === "a") {
        movePlayer("playerA", "left")
      } else if (key === "d") {
        movePlayer("playerA", "right")
      }

      // Controles del Jugador B
      if (key === "arrowleft") {
        movePlayer("playerB", "left")
      } else if (key === "arrowright") {
        movePlayer("playerB", "right")
      }

      // Ejecutar turno con barra espaciadora
      if (key === " ") {
        event.preventDefault()
        ejecutarTurno()
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current.delete(event.key.toLowerCase())
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [movePlayer, ejecutarTurno])

  // Función para reiniciar el juego
  const restartGame = () => {
    setPlayerA({
      id: "playerA",
      name: "RYU",
      health: 100,
      maxHealth: 100,
      attack: 25,
      defense: 10,
      position: 20,
    })
    setPlayerB({
      id: "playerB",
      name: "KEN",
      health: 100,
      maxHealth: 100,
      attack: 23,
      defense: 12,
      position: 70,
    })
    setGameState("playing")
    setWinner(null)
    setCurrentTurn("playerA")
    setIsExecutingTurn(false)
    setBattleLog(["¡Nueva batalla comenzada!"])
    setDamageNumbers([])
    setMovingPlayers(new Set())
    setAttackingPlayers(new Set())
  }

  // Función para obtener el color de la barra de vida
  const getHealthBarColor = (health: number, maxHealth: number): string => {
    const percentage = (health / maxHealth) * 100
    if (percentage > 60) return "high"
    if (percentage > 30) return "medium"
    return "low"
  }

  // Inicializar log de batalla
  useEffect(() => {
    addToBattleLog("¡Batalla iniciada! Presiona ESPACIO para atacar.", "system")
    addToBattleLog(`Turno de ${playerA.name}`, "system")
  }, [addToBattleLog, playerA.name])

  return (
    <div className="combat-arena">
      {/* Fondo del escenario */}
      <div className="stage-background" />
      <div className="stage-floor" />

      {/* Barras de vida */}
      <div className="health-bar-container player-a">
        <div className="player-name">{playerA.name}</div>
        <div className="health-bar">
          <div
            className={`health-fill ${getHealthBarColor(playerA.health, playerA.maxHealth)}`}
            style={{ width: `${(playerA.health / playerA.maxHealth) * 100}%` }}
          />
          <div className="health-text">
            {playerA.health}/{playerA.maxHealth}
          </div>
        </div>
      </div>

      <div className="health-bar-container player-b">
        <div className="player-name">{playerB.name}</div>
        <div className="health-bar">
          <div
            className={`health-fill ${getHealthBarColor(playerB.health, playerB.maxHealth)}`}
            style={{ width: `${(playerB.health / playerB.maxHealth) * 100}%` }}
          />
          <div className="health-text">
            {playerB.health}/{playerB.maxHealth}
          </div>
        </div>
      </div>

      {/* Luchadores */}
      <div
        className={`fighter ${movingPlayers.has("playerA") ? "moving" : ""} ${
          attackingPlayers.has("playerA") ? "attacking" : ""
        }`}
        style={{ left: `${playerA.position}%` }}
      >
        <div className="fighter-sprite">
          <div>
            {playerA.name}
            <br />
            ATK: {playerA.attack}
            <br />
            DEF: {playerA.defense}
          </div>
        </div>
      </div>

      <div
        className={`fighter ${movingPlayers.has("playerB") ? "moving" : ""} ${
          attackingPlayers.has("playerB") ? "attacking" : ""
        }`}
        style={{ left: `${playerB.position}%` }}
      >
        <div className="fighter-sprite player-b">
          <div>
            {playerB.name}
            <br />
            ATK: {playerB.attack}
            <br />
            DEF: {playerB.defense}
          </div>
        </div>
      </div>

      {/* Números de daño */}
      {damageNumbers.map((damage) => (
        <div
          key={damage.id}
          className="damage-number"
          style={{
            left: `${damage.x}%`,
            top: `${damage.y}%`,
          }}
        >
          -{damage.damage}
        </div>
      ))}

      {/* UI de combate */}
      <div className="combat-ui">
        {/* Información de controles */}
        <div className="controls-info">
          <div>JUGADOR A: A (←) | D (→)</div>
          <div>JUGADOR B: ← | →</div>
          <div>ESPACIO: EJECUTAR TURNO</div>
          <div>TURNO ACTUAL: {currentTurn === "playerA" ? playerA.name : playerB.name}</div>
        </div>

        {/* Botón de turno */}
        <button className="turn-button" onClick={ejecutarTurno} disabled={isExecutingTurn || gameState === "finished"}>
          {isExecutingTurn ? "EJECUTANDO..." : "EJECUTAR TURNO (ESPACIO)"}
        </button>

        {/* Log de batalla */}
        <div className="battle-log">
          <div style={{ fontWeight: "bold", marginBottom: "10px", color: "#ffd700" }}>LOG DE BATALLA:</div>
          {battleLog.map((entry, index) => (
            <div
              key={index}
              className={`log-entry ${entry.includes("daño") ? "damage" : entry.includes("Turno") || entry.includes("¡") ? "system" : ""}`}
            >
              {entry}
            </div>
          ))}
        </div>
      </div>

      {/* Overlay de ganador */}
      {gameState === "finished" && winner && (
        <div className="winner-overlay">
          <div className="winner-content">
            <div className="winner-title">¡GANADOR!</div>
            <div className="winner-subtitle">{winner}</div>
            <button className="restart-button" onClick={restartGame}>
              NUEVA BATALLA
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
