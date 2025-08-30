# 🗳️ Blockchain Elections - Supabase Backend

Sistema completo de elecciones transparentes usando **Supabase Edge Functions**, **Polygon** y **viem**.

## 🚀 Características

- ✅ **6 Edge Functions** implementadas y listas para deploy
- 🔗 **Integración blockchain** con Polygon mainnet usando viem
- 🔒 **Votación anónima** con sistema de hashes
- 📊 **Sincronización automática** via polling de eventos
- 🛡️ **Autenticación JWT** y autorización por roles
- 📈 **Resultados en tiempo real** con estadísticas completas

## 📁 Estructura del Proyecto

```
blockchain-elections/
├── supabase/
│   ├── functions/
│   │   ├── _shared/            # Helpers compartidos
│   │   │   ├── blockchain.ts   # Cliente viem + helpers blockchain
│   │   │   ├── auth.ts         # Autenticación JWT + helpers
│   │   │   ├── types.ts        # Interfaces TypeScript
│   │   │   └── cors.ts         # Headers CORS
│   │   ├── createElection/     # Crear elección on-chain + off-chain
│   │   ├── requestCandidacy/   # Solicitar candidatura
│   │   ├── approveCandidacy/   # Aprobar candidatos (on-chain)
│   │   ├── vote/              # Emitir voto anónimo
│   │   ├── getElectionResults/ # Obtener resultados
│   │   └── pollOnchainEvents/  # Sincronizar eventos blockchain
│   └── migrations/
│       └── 001_add_blockchain_fields.sql
├── contracts/
│   └── abi.json               # ABI del contrato inteligente
├── scripts/                   # Scripts de prueba con curl
│   ├── test-create-election.sh
│   ├── test-request-candidacy.sh
│   ├── test-approve-candidacy.sh
│   ├── test-vote.sh
│   ├── test-get-results.sh
│   └── test-polling.sh
├── .env.example
└── README.md
```

## ⚙️ Configuración Requerida

### 1. Variables de Entorno en Supabase Dashboard

Ve a tu Dashboard > Configuración > Edge Functions > Environment Variables:

```bash
ALCHEMY_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/ZluJ7pXTyZSeM19sInGA4
CHAIN_ID=80002
CONTRACT_ADDRESS=0x88Cf938baf924Fb0DA22f4d56679f6d00fa44E48
PRIVATE_KEY_OWNER=1374ce70e5a0af652f8ecd39e2f11143ac357834395719744b309311d16b6da6
JWT_SECRET=nY74CZx+pgU2AlmcfeXGoV9tJzcg7lnqGmLirmysOP3HcuetylCxUDdLw2YKreno2ijkfMvNphSBK0KMVAPIag==
ADMIN_EMAIL=pablo.gallar@gmail.com
```

### 🚀 DEPLOYED CONTRACT INFORMATION

**✅ Contract Successfully Deployed!**

- **Contract Address**: `0x88Cf938baf924Fb0DA22f4d56679f6d00fa44E48`
- **Network**: Polygon Amoy Testnet (Chain ID: 80002)  
- **Deployment Date**: August 30, 2025
- **Owner**: `0x8b57A52c32B3A58cE1c99Ef1179f2f8ACbde189F`
- **Explorer**: https://amoy.polygonscan.com/address/0x88Cf938baf924Fb0DA22f4d56679f6d00fa44E48
- **Deployment TX**: https://amoy.polygonscan.com/tx/0xcaba40153e0ea0b76d264ec9ecf6116e25a770dc997f3a28161bfe9601040d9c

### 2. Aplicar Migración de Base de Datos

```bash
# Si tienes CLI linkado:
npx supabase db push

# O aplica manualmente el SQL en tu Dashboard
```

## 🛠️ Deployment

### Deploy de Edge Functions

```bash
# Deploy todas las functions
npx supabase functions deploy

# O deploy individual
npx supabase functions deploy createElection
npx supabase functions deploy requestCandidacy
npx supabase functions deploy approveCandidacy
npx supabase functions deploy vote
npx supabase functions deploy getElectionResults  
npx supabase functions deploy pollOnchainEvents
```

## 🧪 Testing

### Preparar Tests

1. **Obtener JWT Token**: Autentica tu usuario y obtén el token JWT
2. **Configurar URLs**: Reemplaza `https://iryqlbksafhjgmtukjny.supabase.co` con tu URL
3. **Obtener IDs**: Crea elección primero, luego usa los IDs para otros tests

### Ejecutar Tests

```bash
# 1. Crear elección
./scripts/test-create-election.sh "https://tu-proyecto.supabase.co" "tu_jwt_token"

# 2. Solicitar candidatura  
./scripts/test-request-candidacy.sh "https://tu-proyecto.supabase.co" "tu_jwt_token" "election_id" "party_id"

# 3. Aprobar candidato
./scripts/test-approve-candidacy.sh "https://tu-proyecto.supabase.co" "tu_jwt_token" "candidate_id" "true"

# 4. Emitir voto
./scripts/test-vote.sh "https://tu-proyecto.supabase.co" "tu_jwt_token" "election_id" "candidate_id"

# 5. Ver resultados
./scripts/test-get-results.sh "https://tu-proyecto.supabase.co" "tu_jwt_token" "election_id"

# 6. Sincronizar blockchain
./scripts/test-polling.sh "https://tu-proyecto.supabase.co" "tu_jwt_token" "election_id" "false"
```

## 🔄 API Endpoints

### 1. `POST /functions/v1/createElection`
Crea una elección on-chain y off-chain.

**Body:**
```json
{
  "title": "Presidential Election 2024",
  "description": "National presidential election",
  "startDate": "2024-09-01T00:00:00Z",
  "endDate": "2024-09-07T23:59:59Z", 
  "candidacyStart": "2024-08-01T00:00:00Z",
  "candidacyEnd": "2024-08-31T23:59:59Z",
  "maxCandidatesPerParty": 2
}
```

### 2. `POST /functions/v1/requestCandidacy`
Solicita candidatura para una elección.

**Body:**
```json
{
  "electionId": "uuid-here",
  "partyId": "uuid-here", 
  "description": "Experienced leader...",
  "proposals": "1. Reform education 2. Economic growth",
  "photoUrl": "https://example.com/photo.jpg"
}
```

### 3. `POST /functions/v1/approveCandidacy`
Aprueba o rechaza un candidato (solo propietarios de elección).

**Body:**
```json
{
  "candidateId": "uuid-here",
  "approved": true
}
```

### 4. `POST /functions/v1/vote`
Emite un voto anónimo.

**Body:**
```json
{
  "electionId": "uuid-here", 
  "candidateId": "uuid-here"
}
```

### 5. `GET /functions/v1/getElectionResults?electionId=uuid`
Obtiene resultados completos de la elección.

### 6. `POST /functions/v1/pollOnchainEvents?electionId=uuid&forceSync=false`
Sincroniza eventos del blockchain.

## 🔐 Sistema de Votación Anónima

1. **Hash Generation**: Se genera un hash único por voto combinando:
   - User ID + Election ID + Candidate ID + Timestamp
2. **Blockchain Storage**: El hash se almacena on-chain sin revelar identidad
3. **Database Sync**: Los eventos se sincronizan automáticamente
4. **Privacy**: No es posible rastrear votos individuales

## 📊 Polling de Eventos

El sistema sincroniza automáticamente:
- ✅ Eventos `VoteCast` del blockchain
- ✅ Actualización de conteos en tiempo real  
- ✅ Manejo de duplicados
- ✅ Recuperación de errores

## 🛡️ Security Features

- **JWT Authentication** para todos los endpoints
- **Row Level Security** en todas las tablas
- **Election Ownership** verificado en operaciones críticas
- **Anonymous Voting** con hashes irreversibles
- **Blockchain Immutability** para transparencia

## 🚨 Troubleshooting

### Error: "Contract ABI not found"
- Verifica que `contracts/abi.json` contenga el ABI completo de tu contrato
- Asegúrate que el formato JSON sea válido

### Error: "Failed to connect to blockchain"  
- Confirma que `ALCHEMY_RPC_URL` sea correcta y esté activa
- Verifica que `CHAIN_ID` corresponda a la red (137 = Polygon Mainnet)

### Error: "Invalid or expired token"
- Genera un nuevo JWT token con el `JWT_SECRET` correcto
- Verifica que el usuario exista y esté activo en la base de datos

### Error: "User not found or inactive"
- Confirma que el usuario tenga `is_active = true`
- Verifica que el `user_id` en el token JWT sea correcto

## 📝 Próximos Pasos

1. **Deploy a Production**: Configura variables reales y deploy
2. **Frontend Integration**: Conecta con tu aplicación frontend  
3. **Monitoring**: Configura logs y alertas para Edge Functions
4. **Scaling**: Considera rate limiting y caching para alta demanda
5. **Security Audit**: Revisa permisos y validaciones antes de producción

## 🤝 Support

Para issues y feedback:
- Revisa los logs en Supabase Dashboard > Edge Functions
- Verifica la configuración de variables de entorno
- Confirma que las migraciones se aplicaron correctamente

---

**✅ Sistema completamente implementado y listo para deploy!** 🚀