school-management-system/
│
├── apps/
│   ├── web/                        # React Web App (Vite)
│   ├── desktop/                    # Electron App (React Renderer)
│   └── api/                        # Express Backend API
│
├── packages/
│   ├── shared/                     # Shared types, utils, constants
│   ├── ui/                         # (Optional) Shared UI components
│   └── config/                     # Shared ESLint, TS configs
│
├── scripts/                        # Build, dev, release scripts
├── docs/                           # Architecture, API docs
├── tests/                          # E2E / integration tests
│
├── .env.example
├── .gitignore
├── package.json                    # Root workspace config
├── pnpm-workspace.yaml / yarn.lock
├── turbo.json / nx.json            # (Optional) Monorepo tooling
├── tsconfig.base.json
└── README.md




apps/web/
├── public/
│   ├── icons/
│   ├── images/
│   └── favicon.ico
│
├── src/
│   ├── app/                        # App bootstrap
│   │   ├── App.tsx
│   │   ├── routes.tsx
│   │   └── providers.tsx
│
│   ├── pages/                      # Route-level pages
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── students/
│   │   ├── teachers/
│   │   ├── attendance/
│   │   ├── exams/
│   │   ├── fees/
│   │   ├── library/
│   │   ├── transport/
│   │   ├── hostel/
│   │   ├── inventory/
│   │   ├── hr/
│   │   ├── payroll/
│   │   ├── reports/
│   │   └── settings/
│
│   ├── components/
│   │   ├── ui/                     # Buttons, Modal, Table, Input
│   │   ├── layout/                 # Sidebar, Header, Footer
│   │   └── common/
│
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePermission.ts
│   │   └── useDebounce.ts
│
│   ├── services/
│   │   ├── apiClient.ts            # Axios / Fetch wrapper
│   │   ├── auth.service.ts
│   │   ├── student.service.ts
│   │   ├── attendance.service.ts
│   │   └── fee.service.ts
│
│   ├── store/                      # Zustand / Redux
│   │   ├── auth.store.ts
│   │   ├── user.store.ts
│   │   └── settings.store.ts
│
│   ├── utils/
│   │   ├── date.ts
│   │   ├── permissions.ts
│   │   └── validators.ts
│
│   ├── styles/
│   │   ├── globals.css
│   │   └── theme.css
│
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│
│   └── main.tsx
│
├── .env.development
├── .env.production
├── vite.config.ts
├── tsconfig.json
└── package.json




apps/desktop/
├── electron/
│   ├── main.ts                     # Electron main process
│   ├── preload.ts                  # Secure IPC bridge
│   ├── ipc/
│   │   ├── auth.ipc.ts
│   │   └── system.ipc.ts
│   └── electron-env.d.ts
│
├── renderer/                       # React renderer
│   ├── src/
│   │   ├── app/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── services/
│   │   └── main.tsx
│
│   └── index.html
│
├── assets/
│   ├── icons/
│   └── installer/
│
├── electron-builder.json           # Packaging config
├── forge.config.ts                 # Electron Forge config
├── tsconfig.json
└── package.json





apps/api/
├── src/
│   ├── app.ts                      # Express app setup
│   ├── server.ts                   # HTTP server bootstrap
│
│   ├── config/
│   │   ├── env.ts
│   │   ├── database.ts
│   │   ├── jwt.ts
│   │   └── logger.ts
│
│   ├── modules/                    # Domain-driven modules
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.types.ts
│   │   │
│   │   ├── users/
│   │   ├── students/
│   │   ├── teachers/
│   │   ├── attendance/
│   │   ├── exams/
│   │   ├── timetable/
│   │   ├── fees/
│   │   ├── transport/
│   │   ├── hostel/
│   │   ├── library/
│   │   ├── inventory/
│   │   ├── accounts/
│   │   ├── payroll/
│   │   ├── hr/
│   │   ├── communication/
│   │   └── reports/
│
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── rateLimit.middleware.ts
│
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeds/
│   │   └── index.ts
│
│   ├── utils/
│   │   ├── apiResponse.ts
│   │   ├── pagination.ts
│   │   └── permissions.ts
│
│   ├── routes.ts                  # Central route loader
│   └── types/
│       └── express.d.ts
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── .env.development
├── .env.production
├── tsconfig.json
├── nodemon.json
└── package.json






packages/shared/
├── src/
│   ├── types/
│   │   ├── user.ts
│   │   ├── student.ts
│   │   ├── attendance.ts
│   │   └── fee.ts
│   │
│   ├── constants/
│   │   ├── roles.ts
│   │   ├── permissions.ts
│   │   └── modules.ts
│   │
│   └── utils/
│       ├── date.ts
│       └── currency.ts
│
├── tsconfig.json
└── package.json




scripts/
├── dev.sh
├── build.sh
├── migrate.sh
├── seed.sh
└── electron-package.sh
