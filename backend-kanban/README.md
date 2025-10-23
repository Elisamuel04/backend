# backend
Backend en Nodejs MiniKanban proyecto de Elisamuel Valera para la prueba Tec. Dev Full Stack (Node.js + Angular)

# Requeriments
- npm 11.6.2
- node v20.19.5
- PosgreSQL 18 o inferior PORT: 5433 Password: samuel
- jsonwebtoken 9.0.2 (npm install jsonwebtoken@9.0.2)
- bcrypt@6.0.0 (npm install bcrypt@6.0.0)


# Primero crear la base de datos (PSQL)
CREATE DATABASE kanban_db;

# Ejecutar este comando en postgresql V18 o inferior para crear la base de datos y tablas  cambiar el 18 por la version instalada
# En terminal, CMD o powershell tener en cuenta en estar ubicado en el directorio backend-kanban
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -p 5433 -d kanban_db -f "database/init.sql"

#  A manera de prueba correr el Localhost de angular resgistrarse y logearse para poner a prueba el MiniKanban
