# React CLI Generator

Una herramienta de línea de comandos para generar componentes, hooks, páginas y más para proyectos React con TypeScript.

## 🚀 Características

- 📦 Generación de componentes React con TypeScript
- 🎣 Generación de Custom Hooks
- 🎨 Múltiples opciones de estilos (CSS, SCSS, Styled Components)
- 📝 Generación automática de tests
- 📱 Componentes responsivos
- 🎯 Páginas pre-configuradas
- 🔄 Contextos con providers
- 📊 Layouts predefinidos

## 📋 Requisitos Previos

```bash
Node.js >= 14.0.0
npm >= 6.0.0
```

## 🛠️ Instalación

### Global (recomendado)

```bash
npm install -g @puertochenta/react-cli-generator
```

### Local

```bash
npm install --save-dev @puertochenta/react-cli-generator
```

## 💻 Uso

### Comando Principal

```bash
react-cli generate
# o
react-cli g
```

### Tipos de Generadores

1. **Componentes**

```bash
# El CLI te guiará a través de las opciones
react-cli g

# Opciones disponibles:
- Componente Básico
- Card
- Modal
- Tabla
- Lista
- Navbar
```

2. **Hooks**

```bash
# Tipos disponibles:
- Hook de Estado
- Hook de API
- Hook de Formulario
- Hook de Media Query
- Hook de LocalStorage
```

3. **Layouts**

```bash
# Tipos disponibles:
- Layout por Defecto
- Layout de Dashboard
- Layout de Autenticación
- Layout de Landing
```

4. **Páginas**

```bash
# Tipos disponibles:
- Página Básica
- Página de Detalle
- Página de Lista
- Página de Dashboard
```

### Ejemplos de Uso

```bash
# Ejemplo 1: Generar un componente
react-cli g
> Selecciona: Componente
> Tipo: Card
> Nombre: UserCard
> Estilos: SCSS
> ¿Incluir tests?: Sí

# Ejemplo 2: Generar un hook
react-cli g
> Selecciona: Hook
> Tipo: API
> Nombre: useUserData
```

## 📁 Estructura Generada

```
src/
├── components/
│   └── UserCard/
│       ├── UserCard.tsx
│       ├── UserCard.scss
│       └── UserCard.test.tsx
├── hooks/
│   └── useUserData.ts
├── layouts/
│   └── DashboardLayout/
│       └── DashboardLayout.tsx
└── pages/
    └── UserList/
        └── UserList.tsx
```

## ⚙️ Configuración

Puedes personalizar los templates creando un archivo `.react-cli-rc.json` en la raíz de tu proyecto:

```json
{
  "templatesPath": "./templates",
  "stylesFormat": "scss",
  "testingLibrary": "jest",
  "typescript": true,
  "prettierConfig": true
}
```

## 🎨 Estilos Disponibles

- CSS
- SCSS
- Styled Components
- CSS Modules
- Tailwind CSS

## 🧪 Testing

Los tests se generan automáticamente usando:

- Jest
- React Testing Library
- User Event
- Jest Axe (para tests de accesibilidad)

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Compilar
npm run build

# Tests
npm run test

# Linting
npm run lint

# Formatear código
npm run format
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al Branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙋 FAQs

**P: ¿Puedo usar el CLI con JavaScript en lugar de TypeScript?**
R: Sí, el CLI detectará automáticamente tu configuración del proyecto.

**P: ¿Cómo puedo personalizar los templates?**
R: Puedes crear tus propios templates en el directorio especificado en `.react-cli-rc.json`.

**P: ¿Es compatible con Next.js?**
R: Sí, el CLI detectará si estás en un proyecto Next.js y ajustará las plantillas según corresponda.

## 🐛 Reportar Bugs

Si encuentras algún bug, por favor abre un issue en:
[https://github.com/viroruga/react-cli-generator/issues](https://github.com/tu-usuario/react-cli-generator/issues)

## 📫 Contacto

PuertoChenta - [@puertochenta.eas](https://instagram.com/puertochenta.eas)

Link del Proyecto: [https://github.com/viroruga/react-cli-generator](https://github.com/viroruga/react-cli-generator)
