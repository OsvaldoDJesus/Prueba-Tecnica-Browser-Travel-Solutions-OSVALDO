# Outlet Rental Cars - Prueba Técnica Front-End

## Introducción del Proyecto

Este proyecto es una prueba técnica profesional que demuestra la implementación de un flujo completo de búsqueda y selección de vehículos para un sistema de renta de autos. La aplicación está construida con **Next.js**, **TypeScript**, **Redux Toolkit** y sigue principios de **arquitectura limpia** y **buenas prácticas** de desarrollo.


## Stack Tecnológico

### Core
- **Next.js 14** - Framework React con SSR y routing
- **React 18** - Biblioteca de UI
- **TypeScript 5** - Tipado estático

### Estado Global
- **Redux Toolkit 2** - Gestión de estado simplificada
- **Redux Thunk** - Middleware para acciones asíncronas (incluido en Toolkit)
- **React-Redux 9** - Bindings de React para Redux

### Estilos
- **CSS Modules** - Estilos con scope local
- **CSS Global** - Estilos base de la aplicación

### Desarrollo
- **ESLint** - Linter para calidad de código
- **Next.js ESLint Config** - Configuración optimizada

---

##  Cómo Ejecutar el Proyecto

### Prerrequisitos

- **Node.js** 18.x o superior
- **npm** o **yarn**

### Instalación

1. **Clonar el repositorio** (o descargar el proyecto)
   ```bash
   git clone <repository-url>
   cd outlet-rental-cars
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

---

## Arquitectura y Decisiones Técnicas

### Estructura de Carpetas

El proyecto sigue una **arquitectura por capas** que separa claramente las responsabilidades:

```
/src
  /pages          # Páginas de Next.js (routing automático)
    /api          # API Routes (endpoints mock)
  /components     # Componentes UI reutilizables
  /features       # (Reservado para features futuras)
  /store          # Configuración de Redux
    /slices       # Slices de Redux (lógica de negocio)
  /services       # Servicios de comunicación con APIs
  /models         # Modelos TypeScript (tipos e interfaces)
  /styles         # Estilos globales y módulos CSS
```

### Principios Aplicados

#### 1. **Separación de Responsabilidades (SRP)**
- **Componentes**: Solo se encargan de presentación
- **Services**: Manejan comunicación con APIs
- **Store/Slices**: Contienen lógica de negocio
- **Models**: Definen estructuras de datos

#### 2. **Inversión de Dependencias (DIP)**
- Los componentes reciben datos por props, no conocen Redux directamente
- Los servicios abstraen la comunicación con APIs
- Fácil de testear y mantener

#### 3. **Single Source of Truth**
- Redux como única fuente de verdad para el estado global
- Estado inicial hidratado desde SSR

#### 4. **Composición sobre Herencia**
- Componentes pequeños y reutilizables
- Composición de componentes para crear UI compleja

### Decisiones Técnicas Clave

#### **SSR con getServerSideProps**
- **Razón**: Mejor SEO, performance inicial y experiencia de usuario
- **Implementación**: Los datos se cargan en el servidor antes del render
- **Hidratación**: El estado de Redux se hidrata con datos del SSR para evitar fetches duplicados

#### **Redux Toolkit en lugar de Redux vanilla**
- **Razón**: Menos boilerplate, mejor DX, configuración simplificada
- **Thunks**: Para manejar acciones asíncronas de forma estándar

#### **CSS Modules**
- **Razón**: Scope local, sin conflictos de nombres, fácil mantenimiento
- **Alternativa considerada**: styled-jsx (también válida para Next.js)

#### **API Mock propia**
- **Razón**: No depender de APIs externas, control total sobre datos
- **Implementación**: Next.js API Routes que simulan un backend real

---

## Flujo de la Aplicación

### 1. **Página de Búsqueda (`/`)**

```
Usuario ingresa parámetros → Formulario valida → Navegación a /results
```

- Usuario completa: Ciudad, Fecha recogida, Fecha devolución
- Validación en cliente (HTML5 + JavaScript)
- Navegación con query params

### 2. **Página de Resultados (`/results`)**

```
SSR carga datos → Hidratación Redux → Usuario selecciona vehículo → Resumen actualizado
```

#### Flujo Detallado:

1. **Server-Side Rendering**
   - `getServerSideProps` se ejecuta en el servidor
   - Llama a `searchCars()` que usa `getMockCars()` directamente
   - Retorna datos como props a la página

2. **Hidratación del Estado**
   - El componente recibe `initialCars` y `searchParams` como props
   - `useEffect` hidrata el store de Redux con `hydrateFromSSR`
   - Evita fetch duplicado en el cliente

3. **Interacción del Usuario**
   - Usuario ve lista de vehículos disponibles
   - Al hacer clic en "Seleccionar", se actualiza `selectedCar` en Redux
   - El componente `Summary` se actualiza automáticamente

4. **Cálculo de Precio**
   - `Summary` calcula días de renta
   - Multiplica `pricePerDay * days`
   - Muestra precio total

### 3. **Estados de la Aplicación**

- **Loading**: Muestra spinner mientras se cargan datos
- **Error**: Muestra mensaje de error con opción de nueva búsqueda
- **Success**: Muestra resultados y permite selección
- **Selected**: Resalta vehículo seleccionado y muestra resumen

---

## Integración Conceptual con Pasarela de Pagos

### Flujo Propuesto (Sin Implementación)

Una vez que el usuario selecciona un vehículo y revisa el resumen, el siguiente paso lógico sería:

1. **Página de Confirmación**
   - Mostrar resumen completo de la reserva
   - Formulario de datos del cliente (nombre, email, teléfono)
   - Términos y condiciones

2. **Integración con Pasarela**
   - **Opción A**: Redirección a pasarela externa (Stripe, PayPal, etc.)
     - Generar sesión de pago en backend
     - Redirigir a URL de pago
     - Webhook para confirmar pago
   
   - **Opción B**: Pasarela embebida (Stripe Elements, etc.)
     - Componente de formulario de tarjeta
     - Tokenización en cliente
     - Procesamiento seguro en backend

3. **Confirmación y Reserva**
   - Backend crea reserva en base de datos
   - Envía email de confirmación
   - Redirige a página de éxito

### Consideraciones Técnicas

- **Seguridad**: Nunca procesar tarjetas en el cliente
- **PCI Compliance**: Usar servicios que cumplan PCI DSS
- **Idempotencia**: Prevenir pagos duplicados
- **Webhooks**: Confirmar pagos de forma asíncrona
- **Estados**: Manejar estados de pago (pending, completed, failed)

### Estructura Propuesta

```
/results → /checkout → /payment → /confirmation
```

Cada paso mantendría el estado en Redux y usaría SSR cuando sea necesario.

---

## Escalabilidad Futura

### Mejoras Inmediatas

1. **Testing**
   - Unit tests con Jest + React Testing Library
   - Integration tests para flujos completos
   - E2E tests con Playwright o Cypress

2. **Optimización de Performance**
   - Code splitting automático (Next.js ya lo hace)
   - Lazy loading de componentes pesados
   - Optimización de imágenes con `next/image`
   - Caching estratégico

3. **Manejo de Errores**
   - Error boundaries en React
   - Logging centralizado (Sentry, LogRocket)
   - Páginas de error personalizadas

### Escalabilidad a Mediano Plazo

1. **Backend Real**
   - Migrar de API mock a backend real (Node.js, Python, etc.)
   - Base de datos (PostgreSQL, MongoDB)
   - Autenticación (NextAuth.js, Auth0)
   - API RESTful o GraphQL

2. **Features Adicionales**
   - Filtros avanzados (precio, categoría, características)
   - Búsqueda con autocompletado
   - Comparación de vehículos
   - Favoritos/Guardados
   - Historial de búsquedas

3. **Internacionalización (i18n)**
   - next-i18next para múltiples idiomas
   - Formateo de fechas y monedas por región

4. **Estado Avanzado**
   - RTK Query para cache y sincronización
   - Optimistic updates
   - Offline support con Service Workers

### Escalabilidad a Largo Plazo

1. **Micro-frontends**
   - Module Federation si la app crece mucho
   - Separación por dominios de negocio

2. **Monorepo**
   - Nx o Turborepo para múltiples apps
   - Compartir componentes y utilidades

3. **Infraestructura**
   - CI/CD automatizado
   - Deploy en Vercel, AWS, o similar
   - CDN para assets estáticos
   - Monitoring y analytics

4. **Arquitectura de Features**
   - Feature-based folder structure
   - Cada feature con su propio store, components, services

---


## Notas Finales WORKFRAMES-DIAGRAMA

![Diagrama de arquitectura](/public/assets/images/DiagramaWorframe.png)



