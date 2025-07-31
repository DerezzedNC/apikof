# KOF Battle Arena 🥊

Un juego de combate inspirado en Street Fighter, desarrollado con Next.js y TypeScript.

## 🎮 Características

- **Modos de batalla**: 1vs1 y 3vs3
- **Personajes clásicos**: Ryu, Ken, Chun-Li, Blanka, Dhalsim, Guile
- **Sistema de turnos**: Combate por turnos con animaciones
- **Interfaz arcade**: Diseño retro con efectos visuales
- **Selección de equipos**: Elige personajes para ambos bandos
- **Efectos visuales**: Animaciones, partículas y efectos de combate

## 🚀 Tecnologías

- **Next.js 15** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos y animaciones
- **Radix UI** - Componentes de interfaz
- **Framer Motion** - Animaciones avanzadas

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/kof-battle-arena.git

# Entrar al directorio
cd kof-battle-arena

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

## 🎯 Cómo jugar

1. **Inicia sesión** o regístrate
2. **Selecciona el modo**: 1vs1 o 3vs3
3. **Elige tus personajes** para ambos equipos
4. **¡Combate!** Presiona "¡ATACAR!" para ejecutar turnos
5. **Gana** derrotando a todos los personajes del equipo contrario

## 🌐 Despliegue

### Render
1. Conecta tu repositorio a Render
2. Configura como servicio web
3. Build Command: `npm install --legacy-peer-deps && npm run build`
4. Start Command: `npm start`

### Variables de entorno
```env
NODE_ENV=production
```

## 📁 Estructura del proyecto

```
kof-battle-arena/
├── app/
│   ├── components/
│   │   ├── CombatArena.tsx
│   │   ├── Dashboard.tsx
│   │   ├── LandingPage.tsx
│   │   └── ...
│   ├── globals.css
│   └── page.tsx
├── public/
│   └── assets/
│       ├── ryu.Gif
│       ├── ken.gif
│       └── ...
└── package.json
```

## 🎨 Características visuales

- **Diseño pixel art**: Estilo retro arcade
- **Animaciones fluidas**: Efectos de combate
- **Partículas**: Efectos atmosféricos
- **Barras de vida**: Con efectos visuales
- **Interfaz responsiva**: Funciona en móviles

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- Inspirado en Street Fighter de Capcom
- Iconos de Lucide React
- Componentes de Radix UI 