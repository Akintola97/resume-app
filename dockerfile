# Use Node.js LTS as base
FROM node:20-alpine AS base

WORKDIR /app

# Copy package.json and lock files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema first
COPY prisma ./prisma

# Copy rest of the code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# -----------------------------
# Production image
# -----------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy only needed files
COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public

# ✅ Instead of copying from base, copy prisma directly from context
COPY prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
