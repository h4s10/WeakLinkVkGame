/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_HOST: string | undefined
  readonly VITE_SERVER_PORT: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
