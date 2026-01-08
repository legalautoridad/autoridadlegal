# 🛡️ PROTOCOLO DE GITHUB Y VERSIONES

El Agente debe usar las herramientas MCP de GitHub siguiendo este flujo:

1.  **Nunca trabajar en `main` directamente** para nuevas features.
2.  **Crear Rama:** Antes de empezar, `create_branch` (ej: `feat/admin-panel`).
3.  **Commits Atómicos:** Al terminar una sub-tarea lógica, haz un commit con mensaje convencional:
    - `feat: añade panel de admin`
    - `fix: corrige redirección de login`
    - `style: ajusta modal de verificación`
4.  **Push:** Sube los cambios al terminar la sesión de trabajo.
5.  **Pull Request:** No es necesario crear PR, pero sí dejar la rama lista para merge manual o automático.
