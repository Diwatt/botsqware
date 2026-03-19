# Utilisation de l'image officielle Bun (ultra légère)
FROM oven/bun:1 AS base
WORKDIR /app

# On installe les dépendances en cache pour aller très vite
FROM base AS install
COPY package.json ./
RUN bun install

# Étape finale
FROM base AS release
COPY --from=install /app/node_modules node_modules
COPY . .

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=8000

# Exposer le port
EXPOSE 8000

# Démarrer l'application avec Bun
CMD ["bun", "run", "src/index.ts"]
