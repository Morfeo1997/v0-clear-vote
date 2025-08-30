# 🚀 Edge Functions Deployment Guide

## 📋 Prerequisites

Antes de desplegar las Edge Functions, asegúrate de tener:

1. ✅ **Smart Contract desplegado**: `0x88Cf938baf924Fb0DA22f4d56679f6d00fa44E48`
2. ✅ **Variables de entorno configuradas** en Supabase Dashboard
3. ✅ **Supabase CLI instalado**: `npm install -g supabase`
4. ✅ **Acceso al proyecto** Supabase

---

## 🔧 Método 1: Deployment via Supabase CLI

### Step 1: Obtener Credenciales

#### 1.1 Project Reference
- Ve a: https://supabase.com/dashboard
- Abre tu proyecto
- Ve a **Settings > General**
- Copia el **Project ID** (ej: `abc123def456ghi789`)

#### 1.2 Access Token
- Ve a: https://supabase.com/dashboard/account/tokens
- Click **"Generate new token"**
- Nombre: `Edge Functions Deploy`
- Copia el token generado

### Step 2: Autenticar y Linkear

```bash
# Autenticar con token
export SUPABASE_ACCESS_TOKEN="tu_access_token_aqui"

# Linkear proyecto
npx supabase link --project-ref tu_project_id_aqui
```

### Step 3: Desplegar Functions

```bash
# Ir al directorio correcto
cd supabase

# Desplegar todas las functions
npx supabase functions deploy

# O desplegar individualmente:
npx supabase functions deploy createElection
npx supabase functions deploy requestCandidacy
npx supabase functions deploy approveCandidacy
npx supabase functions deploy vote
npx supabase functions deploy getElectionResults
npx supabase functions deploy pollOnchainEvents
```

---

## 🔧 Método 2: Deployment via Dashboard (Manual)

### Si el CLI no funciona, puedes desplegar manualmente:

#### 1. Ve a tu Supabase Dashboard
- https://supabase.com/dashboard
- Abre tu proyecto
- Ve a **Edge Functions**

#### 2. Crear Functions Manualmente

Para cada function en `supabase/functions/`, crea una nueva function:

**Function Names:**
- `createElection`
- `requestCandidacy` 
- `approveCandidacy`
- `vote`
- `getElectionResults`
- `pollOnchainEvents`

#### 3. Copiar Código

Para cada function:
1. Click **"Create a new function"**
2. Nombre: usar los nombres de arriba
3. Copiar el contenido de `supabase/functions/[nombre]/index.ts`
4. También copiar el contenido de `supabase/functions/_shared/` si es referenciado

---

## 🧪 Testing Edge Functions

### Después del deployment, usar los scripts de test:

```bash
# Asegurar que los scripts sean ejecutables
chmod +x scripts/test-*.sh

# Test crear elección
./scripts/test-create-election.sh "https://tu-proyecto.supabase.co" "tu_jwt_token"

# Test registrar candidato
./scripts/test-request-candidacy.sh "https://tu-proyecto.supabase.co" "tu_jwt_token" "election_id" "party_id"

# Test aprobar candidato
./scripts/test-approve-candidacy.sh "https://tu-proyecto.supabase.co" "tu_jwt_token" "candidate_id" "true"

# Test votar
./scripts/test-vote.sh "https://tu-proyecto.supabase.co" "tu_jwt_token" "election_id" "candidate_id"

# Test resultados
./scripts/test-get-results.sh "https://tu-proyecto.supabase.co" "tu_jwt_token" "election_id"

# Test polling eventos
./scripts/test-polling.sh "https://tu-proyecto.supabase.co" "tu_jwt_token" "election_id" "false"
```

---

## ⚙️ Verificar Environment Variables

### En Supabase Dashboard > Settings > Edge Functions > Environment Variables:

Confirma que estas variables estén configuradas:

```bash
ALCHEMY_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/ZluJ7pXTyZSeM19sInGA4
CHAIN_ID=80002
CONTRACT_ADDRESS=0x88Cf938baf924Fb0DA22f4d56679f6d00fa44E48
PRIVATE_KEY_OWNER=1374ce70e5a0af652f8ecd39e2f11143ac357834395719744b309311d16b6da6
JWT_SECRET=nY74CZx+pgU2AlmcfeXGoV9tJzcg7lnqGmLirmysOP3HcuetylCxUDdLw2YKreno2ijkfMvNphSBK0KMVAPIag==
ADMIN_EMAIL=pablo.gallar@gmail.com
```

---

## 🚨 Troubleshooting

### Error: "Cannot find project ref"
- Verifica que el PROJECT_ID sea correcto
- Asegúrate de tener permisos en el proyecto
- Prueba re-autenticarse: `npx supabase logout && npx supabase login`

### Error: "Invalid access token"
- Genera un nuevo token en: https://supabase.com/dashboard/account/tokens
- Verifica que el token tenga permisos adecuados
- Asegúrate de usar el token completo (sin truncar)

### Error: "Function deployment failed"
- Verifica que las variables de entorno estén configuradas
- Revisa los logs en Supabase Dashboard > Edge Functions
- Confirma que el código no tenga errores de sintaxis

### Edge Function Errors
- Revisa **Supabase Dashboard > Edge Functions > Logs**
- Verifica que `CONTRACT_ADDRESS` sea correcto
- Confirma que `ALCHEMY_RPC_URL` esté funcionando

---

## ✅ Post-Deployment Checklist

Después del deployment exitoso:

- [ ] **6 Edge Functions** desplegadas correctamente
- [ ] **Environment variables** configuradas
- [ ] **Test básico** ejecutado exitosamente
- [ ] **Logs limpios** en Supabase Dashboard
- [ ] **Smart contract integration** verificada

---

## 🎯 Ready for Use!

Una vez completado el deployment:

1. **Tus Edge Functions estarán en**:
   - `https://tu-proyecto.supabase.co/functions/v1/createElection`
   - `https://tu-proyecto.supabase.co/functions/v1/requestCandidacy`
   - `https://tu-proyecto.supabase.co/functions/v1/approveCandidacy`
   - `https://tu-proyecto.supabase.co/functions/v1/vote`
   - `https://tu-proyecto.supabase.co/functions/v1/getElectionResults`
   - `https://tu-proyecto.supabase.co/functions/v1/pollOnchainEvents`

2. **Integration completa** con smart contract desplegado

3. **Sistema de elecciones** 100% funcional

---

*Ready to deploy? Follow the steps above and your blockchain elections system will be fully operational!*