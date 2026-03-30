# ELFISIO - Sistema de Gestión de Fisioterapia 🏥

![ELFISIO Banner](frontend/public/robots.txt)

## 📋 Descripción General

**ELFISIO** es una aplicación web completa para la gestión de citas, historiales clínicos y servicios de rehabilitación física e integral. Utiliza una arquitectura moderna con un backend robusto en Spring Boot y un frontend interactivo con React.

**Estado del Proyecto:** En desarrollo  
**Versión:** 0.0.1-SNAPSHOT  
**Última Actualización:** Marzo 2026

---

## 🏗️ Arquitectura del Proyecto

```
┌─────────────────────────────────────────────────────────────────┐
│                      ELFISIO Application                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐          ┌──────────────────────┐         │
│  │   FRONTEND       │          │     BACKEND          │         │
│  │  (React + Vite)  │◄────────►│  (Spring Boot 3.2)   │         │
│  │                  │   REST   │                      │         │
│  │  • TypeScript    │    API   │  • Spring MVC        │         │
│  │  • Tailwind CSS  │   JSON   │  • Spring Security   │         │
│  │  • Shadcn UI     │ (8092)   │  • Spring Data JPA   │         │
│  │                  │          │  • JWT Authentication│         │
│  └──────────────────┘          └──────────────────────┘         │
│           │                              │                      │
│           │                              │                      │
│           └──────────────┬───────────────┘                      │
│                          │                                      │
│                          ▼                                      │
│        ┌─────────────────────────────┐                          │
│        │  Supabase (PostgreSQL)      │                          │
│        │  • User Management          │                          │
│        │  • Booking Data             │                          │
│        │  • Historical Records       │                          │
│        │  • Authentication           │                          │
│        └─────────────────────────────┘                          │
│                          │                                      │
│                          ▼                                      │
│        ┌─────────────────────────────┐                          │
│        │  H2 Database (Development)  │                          │
│        │  • Local File: data/fisiodb │                          │
│        │  • Persistent Storage       │                          │
│        └─────────────────────────────┘                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Estructura del Proyecto

```
FISIOTERAPIA/
│
├── 📄 README.md                           # Este archivo
│
├── 📁 backend/                            # Backend Spring Boot
│   ├── 📄 pom.xml                        # Configuración Maven
│   ├── 📄 mvnw & mvnw.cmd               # Maven Wrapper
│   ├── 📁 src/
│   │   ├── main/
│   │   │   ├── java/com/fisioterapia/    # Código fuente Java
│   │   │   │   ├── FisioterapiaApplication.java  # Classe Principal
│   │   │   │   ├── config/              # Configuraciones
│   │   │   │   ├── controller/          # Controladores REST
│   │   │   │   ├── service/             # Lógica de negocio
│   │   │   │   ├── repository/          # Acceso a datos
│   │   │   │   ├── model/               # Entidades JPA
│   │   │   │   ├── security/            # Seguridad JWT
│   │   │   │   └── filter/              # Filtros HTTP
│   │   │   └── resources/
│   │   │       ├── application.properties   # Configuración
│   │   │       └── static/              # Recursos estáticos
│   │   └── test/                        # Tests unitarios
│   │
│   ├── 📁 target/                       # Artefactos compilados
│   │   ├── backend-0.0.1-SNAPSHOT.jar  # JAR ejecutable
│   │   └── classes/                    # Clases compiladas
│   │
│   └── 📁 data/                         # Base de datos H2
│       └── fisiodb.mv.db                # Archivo de BD
│
├── 📁 frontend/                          # Frontend React + Vite
│   ├── 📄 package.json                  # Dependencias npm
│   ├── 📄 bun.lockb                     # Lock file Bun
│   ├── 📄 vite.config.ts               # Configuración Vite
│   ├── 📄 tsconfig.json                # Configuración TypeScript
│   ├── 📄 tailwind.config.ts           # Configuración Tailwind
│   ├── 📄 eslint.config.js             # Linting
│   ├── 📄 playwright.config.ts         # Tests E2E
│   │
│   ├── 📁 src/                         # Código fuente React
│   │   ├── 📄 main.tsx                 # Entry point
│   │   ├── 📄 App.tsx                  # Componente principal
│   │   ├── 📄 index.css               # Estilos globales
│   │   │
│   │   ├── 📁 components/              # Componentes React
│   │   │   ├── 📄 AuthLayout.tsx       # Layout autenticación
│   │   │   ├── 📄 AdminLayout.tsx      # Layout admin
│   │   │   ├── 📄 Header.tsx           # Encabezado
│   │   │   ├── 📄 Footer.tsx           # Pie de página
│   │   │   ├── 📄 BookingSection.tsx   # Sección de reservas
│   │   │   ├── 📄 ServicesSection.tsx  # Servicios
│   │   │   ├── 📄 HeroSection.tsx      # Sección hero
│   │   │   ├── 📄 NavLink.tsx          # Enlace navegación
│   │   │   ├── 📄 ScrollToTop.tsx      # Scroll superior
│   │   │   ├── 📄 WhatsAppButton.tsx   # Botón WhatsApp
│   │   │   └── 📁 ui/                  # Componentes Shadcn UI
│   │   │       ├── accordion.tsx
│   │   │       ├── alert-dialog.tsx
│   │   │       ├── button.tsx
│   │   │       ├── dialog.tsx
│   │   │       ├── form.tsx
│   │   │       ├── input.tsx
│   │   │       └── ... (20+ componentes UI)
│   │   │
│   │   ├── 📁 pages/                   # Páginas/Rutas
│   │   │   ├── 📄 Index.tsx            # Inicio
│   │   │   ├── 📄 Login.tsx            # Login
│   │   │   ├── 📄 Register.tsx         # Registro
│   │   │   ├── 📄 ForgotPasswordPage.tsx
│   │   │   ├── 📄 ActivateAccountPage.tsx
│   │   │   ├── 📄 NotificationsPage.tsx
│   │   │   ├── 📄 HistoriaPage.tsx     # Historial
│   │   │   ├── 📄 NosotrosPage.tsx     # Nosotros
│   │   │   ├── 📄 HelpPage.tsx         # Ayuda
│   │   │   ├── 📄 PoliticaCookiesPage.tsx
│   │   │   ├── 📄 TerminosCondicionesPage.tsx
│   │   │   ├── 📄 TratamientoDatosPage.tsx
│   │   │   ├── 📄 NotFound.tsx         # 404
│   │   │   ├── 📁 profile/             # Páginas de perfil
│   │   │   └── 📁 admin/               # Páginas admin
│   │   │
│   │   ├── 📁 contexts/                # React Contexts
│   │   │   └── 📄 AuthContext.tsx      # Contexto autenticación
│   │   │
│   │   ├── 📁 hooks/                   # Custom Hooks
│   │   │   ├── 📄 use-mobile.tsx
│   │   │   ├── 📄 use-toast.ts
│   │   │   ├── 📄 useAppSettings.ts
│   │   │   └── 📄 useLocalStorage.ts
│   │   │
│   │   ├── 📁 lib/                     # Utilidades
│   │   │   ├── 📄 api.ts               # Cliente API HTTP
│   │   │   └── 📄 utils.ts             # Funciones auxiliares
│   │   │
│   │   ├── 📁 integrations/            # Integraciones externas
│   │   │   └── 📁 supabase/            # Cliente Supabase
│   │   │
│   │   ├── 📁 assets/                  # Imágenes y recursos
│   │   └── 📁 test/                    # Tests con Vitest
│   │       ├── 📄 setup.ts
│   │       └── 📄 example.test.ts
│   │
│   ├── 📁 public/                      # Archivos públicos
│   │   ├── 📄 robots.txt
│   │   └── 📁 docs/
│   │
│   ├── 📄 playwright-fixture.ts        # Fixtures Playwright
│   └── 📄 index.html                   # HTML principal
│
├── 📁 supabase/                         # Configuración Supabase
│   ├── 📄 config.toml                  # Configuración proyecto
│   └── 📁 migrations/                  # Migraciones BD
│       └── 📄 20260312153428_*.sql
│
└── 📁 data/                            # Base datos local
    └── 📄 fisiodb.mv.db                # Archivo H2 database
```

---

## 🚀 Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

### Backend
- **Java Development Kit (JDK) 17+** 
  - [Descargar JDK 17+](https://www.oracle.com/java/technologies/downloads/)
  - Verifica la instalación:
    ```bash
    java -version
    ```

- **Maven 3.8+** (incluido con Maven Wrapper)
  - O descargar desde [maven.apache.org](https://maven.apache.org/)
  - Verifica:
    ```bash
    mvn -version
    ```

### Frontend
- **Node.js 18+** o **Bun 1.0+**
  - [Descargar Node.js](https://nodejs.org/) (Recomendado: LTS)
  - O [Descargar Bun](https://bun.sh/)
  - Verifica:
    ```bash
    node --version
    npm --version
    ```

### Base de Datos
- **H2 Database** - Incluido automáticamente
- **Supabase** - Cuenta y credenciales configuradas (opcional)

### Control de Versiones (Opcional)
- **Git** 
  - [Descargar Git](https://git-scm.com/)

---

## ⚙️ Configuración

### 1. Configuración Backend (Spring Boot)

#### Variables de Entorno (Opcional)
Puedes override variables editando `backend/src/main/resources/application.properties`:

**Archivo: `backend/src/main/resources/application.properties`**
```properties
# Base de Datos
spring.datasource.url=jdbc:h2:file:./data/fisiodb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# Puerto del servidor
server.port=8092

# Base de datos - H2 (update/create)
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# URL Frontend (para emails)
app.frontend.url=http://localhost:8080

# Email (Gmail SMTP)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=torresluisalberto95@gmail.com
spring.mail.password=${SPRING_MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### 2. Configuración Frontend (React + Vite)

#### Variables de Entorno
Crea un archivo `.env` en la carpeta `frontend/`:

**Archivo: `frontend/.env`**
```env
# API Backend
VITE_API_BASE=http://localhost:8092/api

# Supabase (si usas autenticación)
VITE_SUPABASE_URL=https://viztqykaumvmwaqojila.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Desarrollo
VITE_ENABLE_TAGGER=false
```

---

## 📥 Instalación Paso a Paso

### Opción A: Ejecución Local Completa (Recomendado)

#### Paso 1: Clonar el Repositorio
```bash
# Navega a tu directorio deseado
cd ~/projects

# Si el proyecto está en un repo Git
git clone https://github.com/tu-usuario/ease-app.git
cd FISIOTERAPIA

# O si ya tienes la carpeta
cd FISIOTERAPIA
```

#### Paso 2: Configurar y Ejecutar el Backend

```bash
# Navega a la carpeta backend
cd backend

# Opción A: Usar Maven Wrapper (No requiere Maven instalado)
./mvnw spring-boot:run          # En Linux/Mac
mvnw.cmd spring-boot:run        # En Windows PowerShell
mvn spring-boot:run             # Si tienes Maven instalado

# El backend estará disponible en: http://localhost:8092
# Espera el mensaje: "Started FisioterapiaApplication"
```

**Output esperado:**
```
... (logs de Spring)
2026-03-29 10:15:32.123  INFO ... Started FisioterapiaApplication in 2.456 seconds
Tomcat started on port(s): 8092 (http)
```

#### Paso 3: Abrir Nueva Terminal y Configurar Frontend

```bash
# Desde la raíz del proyecto (FISIOTERAPIA/)
cd frontend

# Instalar dependencias con npm (o bun/yarn)
npm install

# O con Bun (más rápido)
bun install

# O con Yarn
yarn install
```

#### Paso 4: Ejecutar el Frontend

```bash
# Desde la carpeta frontend/
npm run dev

# O con Bun
bun run dev

# O con Yarn
yarn dev

# El servidor estará en: http://localhost:5173
```

**Output esperado:**
```
  VITE v5.4.19  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

#### Paso 5: Acceder a la Aplicación

Abre tu navegador y ve a: **http://localhost:5173**

Deberías ver:
- ✅ Página de inicio con login/registro
- ✅ Conexión al backend funcionando
- ✅ Toast notifications funcionando
- ✅ Formularios de reserva interactivos

---

### Opción B: Build para Producción

#### Compilar Backend
```bash
cd backend

# Compilar a JAR
mvn package -DskipTests

# Ejecutar JAR
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

#### Compilar Frontend
```bash
cd frontend

# Build producción
npm run build

# La carpeta dist/ contiene los archivos estáticos listos
```

---

## 🛠️ Comandos Disponibles

### Backend (Spring Boot)

```bash
# Ejecutar en desarrollo
cd backend
mvn spring-boot:run

# Compilar JAR
mvn clean package

# Ejecutar JAR compilado
java -jar target/backend-0.0.1-SNAPSHOT.jar

# Tests unitarios
mvn test

# Limpiar archivos generados
mvn clean
```

### Frontend (React + Vite)

```bash
# Navega a frontend/
cd frontend

# Servidor desarrollo (con hot reload)
npm run dev

# Build producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint

# Tests unitarios
npm test

# Tests en modo watch
npm run test:watch
```

---

## 📊 Tecnologías Utilizadas

### Backend
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| Spring Boot | 3.2.4 | Framework principal |
| Java | 17 | Lenguaje |
| Spring MVC | 3.2.4 | REST APIs |
| Spring Security | 3.2.4 | Autenticación |
| Spring Data JPA | 3.2.4 | ORM |
| JWT (JJWT) | 0.11.5 | Token authentication |
| H2 Database | Latest | Base de datos local |
| Maven | 3.8+ | Build tool |

### Frontend
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| React | 18.3.1 | UI framework |
| TypeScript | 5.8.3 | Lenguaje tipado |
| Vite | 5.4.19 | Build tool |
| Tailwind CSS | 3.4.17 | Estilos |
| Shadcn UI | Latest | Componentes UI |
| React Router | 6.30.1 | Enrutamiento |
| React Query | 5.83.0 | State management |
| Radix UI | Latest | Primitivos UI |
| Zod | 3.25.76 | Validación schemas |
| React Hook Form | 7.61.1 | Formularios |
| Supabase JS | 2.99.1 | Backend as a Service |
| Recharts | 2.15.4 | Gráficos |
| Date-fns | 3.6.0 | Manipulación fechas |

### Base de Datos
| Tecnología | Propósito |
|-----------|----------|
| H2 Database | Desarrollo y testing |
| Supabase (PostgreSQL) | Producción |

---

## 🔑 Características Principales

### 🟢 Funcionalidades Implementadas
- ✅ Autenticación con JWT
- ✅ Registro de usuarios
- ✅ Login seguro
- ✅ Recuperación de contraseña
- ✅ Gestión de perfil
- ✅ Sistema de reservas de citas
- ✅ Historial de tratamientos
- ✅ Panel de administración
- ✅ Notificaciones
- ✅ Integración Supabase
- ✅ Envío de emails
- ✅ Interfaz responsive
- ✅ Temas claro/oscuro (Next Themes)

### 🟡 Funcionalidades en Desarrollo
- 🔄 Pagos online
- 🔄 Reportes avanzados
- 🔄 Integración calendarios externos
- 🔄 App móvil nativa

---

## 📱 Estructura de Rutas

### Frontend
```
/                          → Página de inicio
/login                     → Iniciar sesión
/register                  → Crear cuenta
/forgot-password           → Recuperar contraseña
/activate-account          → Activar cuenta
/notifications             → Notificaciones
/profile/*                 → Perfil de usuario
/admin/*                   → Panel administrativo
/historia                  → Historial de tratamientos
/nosotros                  → Información de la empresa
/help                      → Centro de ayuda
/politica-cookies          → Política de cookies
/terminos-condiciones      → Términos y condiciones
/tratamiento-datos         → Política de tratamiento de datos
```

### Backend API
```
POST   /api/auth/register              → Registro
POST   /api/auth/login                 → Login
POST   /api/auth/refresh               → Refresh token
GET    /api/users/me                   → Datos del usuario actual
GET    /api/bookings                   → Listar reservas
POST   /api/bookings                   → Crear reserva
GET    /api/bookings/{id}              → Obtener reserva
PUT    /api/bookings/{id}              → Actualizar reserva
DELETE /api/bookings/{id}              → Cancelar reserva
```

---

## 🐛 Solución de Problemas

### Puerto en Uso
```bash
# Si el puerto 8092 ya está en uso
# Cambiar puerto en: backend/src/main/resources/application.properties
server.port=8093

# Para el frontend, si 5173 está ocupado:
npm run dev -- --port 3000
```

### Error de Conexión Backend
```bash
# Verifica que el backend esté corriendo en terminal separada
# Verifica la URL en frontend/.env
VITE_API_BASE=http://localhost:8092

# Revisa la consola del navegador (F12) para CORS errors
```

### Base de Datos Corrupta
```bash
# Eliminar BD local
rm -rf backend/data/fisiodb*     # Linux/Mac
rmdir /S backend\data\fisiodb*   # Windows

# Será recreada automáticamente al iniciar backend
```

### Node Modules Grande
```bash
# Limpiar caché npm
npm cache clean --force

# Reinstalar dependencias
rm -rf frontend/node_modules
npm install
```

### Error de Java
```bash
# Verifica versión de Java
java -version

# Debe ser 17 o superior
# Si no, instala JDK 17+ desde:
# https://www.oracle.com/java/technologies/downloads/
```

---

## 📚 Documentación Adicional

### Backend Docs
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [JWT JJWT](https://github.com/jwtk/jjwt)

### Frontend Docs
- [React Documentation](https://react.dev)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [React Router](https://reactrouter.com)
- [TypeScript](https://www.typescriptlang.org)
- [Supabase](https://supabase.com/docs)

### Proyectos Externos
- [Supabase Project](https://supabase.com/projects) (proyecto: viztqykaumvmwaqojila)

---

## 📝 Variables de Entorno Completo

### Backend (.env o application.properties)
```properties
# Database
SPRING_DATASOURCE_URL=jdbc:h2:file:./data/fisiodb
SPRING_DATASOURCE_USERNAME=sa
SPRING_DATASOURCE_PASSWORD=

# Server
SERVER_PORT=8092

# JPA
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=true

# Security & JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=86400000

# Frontend URL
APP_FRONTEND_URL=http://localhost:8080

# Email
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your_email@gmail.com
SPRING_MAIL_PASSWORD=your_app_password

# Email SSL
SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH=true
SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE=true
SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_REQUIRED=true
```

### Frontend (.env)
```env
# API
VITE_API_BASE=http://localhost:8092/api

# Supabase
VITE_SUPABASE_URL=https://viztqykaumvmwaqojila.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here

# Development
VITE_ENABLE_TAGGER=false
```

---

## 🤝 Contribuciones

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autores

- **Luis Alberto Torres** - Desarrollador Principal
  - Email: torresluisalberto95@gmail.com

---

## 🆘 Soporte

Si encuentras problemas:

1. **Revisa esta documentación** - Solución de problemas
2. **Consulta los logs** 
   - Backend: Terminal donde corre `mvn spring-boot:run`
   - Frontend: Consola del navegador (F12)
3. **Abre un Issue** en el repositorio
4. **Contacta al equipo** de desarrollo

---

## ✨ Changelog

### v0.0.1 (Actual)
- Estructura base de proyecto
- Backend Spring Boot con H2
- Frontend React con Vite
- Autenticación JWT
- Sistema de reservas básico
- Historial de tratamientos
- Panel administrativo
- Integración Supabase

---

## 🔐 Seguridad

⚠️ **IMPORTANTE**: 

- Nunca commits credenciales reales (emails, passwords)
- Usa `.env` local para variables sensibles
- Las variables en `application.properties` son para desarrollo
- Antes de producción, configura variables de entorno del servidor

---

## 📊 Diagramas Adicionales

### Flujo de Autenticación
```
Usuario
   │
   ├──> POST /api/auth/login (email, password)
   │
   ├──> Backend valida credenciales
   │
   └──> Retorna JWT Token
   
   ├──> Frontend almacena token en localStorage
   │
   └──> Token en headers: Authorization: Bearer {token}
```

### Flujo de Reserva
```
Usuario completa formulario
   │
   ├──> POST /api/bookings (datos reserva)
   │
   ├──> Backend valida datos
   │
   ├──> Guarda en BD
   │
   ├──> Envía email confirmación
   │
   └──> Muestra toast de éxito
```

---

## 📞 Información de Contacto

- **Email**: torresluisalberto95@gmail.com
- **WhatsApp**: Botón en la aplicación
- **Oficina**: Contactar vía formulario en /help

---

**Última actualización**: 29 de Marzo, 2026  
**Estado**: En desarrollo activo  
**Versión**: 0.0.1-SNAPSHOT
