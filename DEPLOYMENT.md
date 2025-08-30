# 🚀 Deployment Guide - VotingContract

Este documento guía el despliegue del contrato inteligente `VotingContract` en la red de prueba Polygon Amoy.

## 📋 Prerrequisitos

1. **Private Key**: Tu clave privada para el despliegue
2. **Alchemy API Key**: Para conectar con Polygon Amoy
3. **Fondos**: Tokens MATIC en la billetera (Faucet: https://faucet.polygon.technology/)

## ⚙️ Configuración

### 1. Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```bash
# Blockchain Configuration
ALCHEMY_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/TU_API_KEY_AQUI
PRIVATE_KEY_OWNER=tu_private_key_sin_0x_prefix

# Otras configuraciones
JWT_SECRET=tu_jwt_secret
ADMIN_EMAIL=tu_email@gmail.com
```

⚠️ **IMPORTANTE**: Nunca commits el archivo `.env` al repositorio.

### 2. Verificar Configuración

```bash
# Compilar contrato
npm run compile

# Ejecutar tests
npm test
```

## 🌐 Despliegue

### Desplegar en Polygon Amoy (Testnet)

```bash
npm run deploy:amoy
```

Este comando:
1. Conecta a la red Polygon Amoy usando Alchemy
2. Despliega el contrato `VotingContract`
3. Guarda la información del despliegue en `deployment-info.json`
4. Espera 6 confirmaciones de bloque

### Output Esperado

```
Deploying VotingContract...
VotingContract deployed to: 0x1234567890123456789012345678901234567890
Deployment info saved to deployment-info.json
Waiting for block confirmations...
Contract deployment confirmed!
```

## 📄 Post-Despliegue

### 1. Actualizar Variables de Entorno

Después del despliegue exitoso, actualizar `.env`:

```bash
CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

### 2. Verificar en Explorer

Visita [PolygonScan Amoy](https://amoy.polygonscan.com/) y busca la dirección del contrato para verificar:
- ✅ Contrato desplegado correctamente
- ✅ Código fuente (si se verifica)
- ✅ Transacciones iniciales

### 3. Actualizar Edge Functions

Actualizar las variables de entorno en Supabase Dashboard:
- `CONTRACT_ADDRESS`: Dirección del contrato desplegado
- `ALCHEMY_RPC_URL`: Tu URL de Alchemy
- `CHAIN_ID`: 80002 (Polygon Amoy)

## 🔍 Información del Deployment

El archivo `deployment-info.json` contiene:

```json
{
  "contractAddress": "0x...",
  "network": "amoy",
  "deploymentBlock": 12345678,
  "deploymentHash": "0x...",
  "timestamp": "2024-08-30T18:00:00.000Z"
}
```

## 🔧 Funciones Principales del Contrato

### Owner Functions
- `createElection(title, startTime, candidacyEnd, endTime)`: Crear elección
- `approveCandidate(electionId, candidateId, candidateName)`: Aprobar candidato

### Public Functions  
- `registerCandidate(electionId)`: Registrar candidato
- `vote(electionId, candidateId, voteHash)`: Emitir voto

### View Functions
- `getElection(electionId)`: Obtener información de elección
- `getCandidate(candidateId)`: Obtener información de candidato
- `hasUserVoted(voter, electionId)`: Verificar si votó

## 🚨 Troubleshooting

### Error: "insufficient funds"
- Verifica que tienes MATIC en tu billetera
- Usa faucet: https://faucet.polygon.technology/

### Error: "Invalid private key"
- Verifica formato de private key (sin prefijo 0x)
- Regenera la clave si es necesario

### Error: "Network connection failed"
- Verifica URL de Alchemy
- Confirma que la API key es válida

### Error: "Contract deployment failed"
- Revisa gas limit y gas price
- Verifica que el contrato compila sin errores

## 📊 Gas Estimation

Costos aproximados en Polygon Amoy:
- **Deploy**: ~2,500,000 gas (~0.005 MATIC)
- **createElection**: ~200,000 gas
- **approveCandidate**: ~100,000 gas  
- **vote**: ~150,000 gas

## ✅ Checklist Post-Despliegue

- [ ] Contrato desplegado exitosamente
- [ ] Dirección guardada en `.env`
- [ ] Variables actualizadas en Supabase
- [ ] Tests ejecutados correctamente
- [ ] Contrato verificado en Explorer
- [ ] Edge Functions testeadas con nueva dirección

---

**🎉 ¡Listo para producción!** El contrato está desplegado y configurado correctamente.