"use client"

import { useState, useEffect } from "react"

interface LandingPageProps {
  onLogin: () => void
  onRegister: () => void
}

export default function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  const [logoAnimation, setLogoAnimation] = useState(false)

  useEffect(() => {
    setLogoAnimation(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4">
      {/* Logo animado */}
      <div className={`text-center mb-12 ${logoAnimation ? "animate-slide-in" : "opacity-0"}`}>
        <h1 className="arcade-font text-4xl md:text-6xl lg:text-8xl text-glow-red text-[#FF0000] mb-4 animate-pulse-glow">
          KOF
        </h1>
        <h2 className="arcade-font text-xl md:text-2xl lg:text-3xl text-glow-gold text-[#FFD700] animate-float">
          BATTLE ARENA
        </h2>
        <div className="mt-6 text-white/80 font-orbitron text-sm md:text-base">
          ¡Prepárate para la batalla definitiva!
        </div>
      </div>

      {/* Botones principales */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <button
          onClick={onLogin}
          className="arcade-button px-8 py-4 text-lg md:text-xl arcade-font rounded-lg min-w-[200px]"
        >
          INICIAR SESIÓN
        </button>
        <button
          onClick={onRegister}
          className="arcade-button px-8 py-4 text-lg md:text-xl arcade-font rounded-lg min-w-[200px] bg-gradient-to-br from-[#FFD700] to-[#B8860B] text-black border-[#FF0000]"
        >
          REGISTRARSE
        </button>
      </div>

      {/* Información adicional */}
      <div className="text-center text-white/60 max-w-2xl">
        <p className="mb-4 text-sm md:text-base">
          Únete a la arena de combate más épica. Selecciona tu equipo, domina las técnicas especiales y conviértete en
          el Rey de los Luchadores.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs md:text-sm">
          <span className="bg-[#FF0000]/20 px-3 py-1 rounded border border-[#FF0000]/50">Batallas 1vs1</span>
          <span className="bg-[#FFD700]/20 px-3 py-1 rounded border border-[#FFD700]/50 text-[#FFD700]">
            Equipos 3vs3
          </span>
          <span className="bg-white/20 px-3 py-1 rounded border border-white/50">Multijugador</span>
        </div>
      </div>

      {/* Efectos visuales de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#FF0000]/10 rounded-full blur-xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#FFD700]/10 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
    </div>
  )
}
