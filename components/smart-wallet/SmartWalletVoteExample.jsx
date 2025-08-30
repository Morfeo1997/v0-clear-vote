/**
 * Smart Wallet Integration Example
 * Shows how to integrate Smart Wallet authentication with the voting system
 */

import { useState, useEffect } from 'react';
import { useSignerStatus, useUser, useSendUserOperation } from '@account-kit/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Vote, Wallet, CheckCircle } from 'lucide-react';

export default function SmartWalletVoteExample({ electionId, candidateId }) {
  const [isVoting, setIsVoting] = useState(false);
  const [voteResult, setVoteResult] = useState(null);
  const [error, setError] = useState('');

  // Alchemy hooks
  const { isConnected } = useSignerStatus();
  const user = useUser();
  const { sendUserOperation, isSendingUserOperation } = useSendUserOperation();

  const handleVote = async () => {
    if (!isConnected || !user) {
      setError('Smart Wallet no está conectada');
      return;
    }

    setIsVoting(true);
    setError('');

    try {
      // Prepare the vote transaction
      const voteTransaction = {
        target: process.env.NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS,
        data: encodeFunctionData({
          abi: votingContractAbi,
          functionName: 'vote',
          args: [electionId, candidateId]
        }),
        value: '0' // No ETH value needed
      };

      // Send user operation through Smart Wallet
      const result = await sendUserOperation({
        uo: voteTransaction
      });

      // Wait for confirmation
      console.log('🗳️ Vote transaction sent:', result);
      
      // Update local state
      setVoteResult({
        txHash: result.hash,
        electionId,
        candidateId,
        timestamp: new Date().toISOString()
      });

      console.log('✅ Vote cast successfully with Smart Wallet');

    } catch (err) {
      console.error('❌ Smart Wallet vote error:', err);
      setError(err.message || 'Error al votar con Smart Wallet');
    } finally {
      setIsVoting(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Smart Wallet Requerida
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Necesitas conectar tu Smart Wallet para votar.
          </p>
          <Button disabled className="w-full">
            Conectar Smart Wallet Primero
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (voteResult) {
    return (
      <Card className="w-full max-w-md border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Voto Registrado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-green-50 p-3 rounded">
              <p className="text-sm text-green-700">
                Tu voto ha sido registrado exitosamente en la blockchain.
              </p>
            </div>
            
            <div className="text-sm space-y-1">
              <div><strong>Transacción:</strong> {voteResult.txHash?.slice(0, 20)}...</div>
              <div><strong>Elección:</strong> {voteResult.electionId}</div>
              <div><strong>Candidato:</strong> {voteResult.candidateId}</div>
              <div><strong>Hora:</strong> {new Date(voteResult.timestamp).toLocaleString()}</div>
            </div>

            <div className="bg-blue-50 p-3 rounded">
              <p className="text-xs text-blue-600">
                🎉 Votaste sin pagar gas fees gracias a tu Smart Wallet
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vote className="h-5 w-5" />
          Votar con Smart Wallet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded">
            <div className="text-sm text-blue-700 mb-1">Conectado como:</div>
            <div className="font-medium">{user?.email}</div>
            <div className="text-xs text-blue-600 mt-1">
              Wallet: {user?.address?.slice(0, 10)}...
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <Button 
            onClick={handleVote}
            disabled={isVoting || isSendingUserOperation}
            className="w-full"
          >
            {isVoting || isSendingUserOperation ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Procesando Voto...
              </>
            ) : (
              <>
                <Vote className="h-4 w-4 mr-2" />
                Confirmar Voto
              </>
            )}
          </Button>

          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>✅ Gas fees patrocinados</p>
            <p>✅ Transacción segura</p>
            <p>✅ Registrado en blockchain</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Hook for Smart Wallet integration in existing components
 */
export function useSmartWalletIntegration() {
  const { isConnected } = useSignerStatus();
  const user = useUser();
  const { sendUserOperation, isSendingUserOperation } = useSendUserOperation();

  const sendTransaction = async (transactionData) => {
    if (!isConnected) {
      throw new Error('Smart Wallet not connected');
    }

    try {
      const result = await sendUserOperation({
        uo: transactionData
      });

      return result;
    } catch (error) {
      console.error('Smart Wallet transaction error:', error);
      throw error;
    }
  };

  return {
    isConnected,
    user,
    sendTransaction,
    isSending: isSendingUserOperation
  };
}
