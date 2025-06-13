
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, Wallet, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SwapState {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
}

type SwapStep = 'swap' | 'connect' | 'confirm' | 'processing' | 'success' | 'error';

const SwapModal: React.FC<SwapModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<SwapStep>('swap');
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [swapData, setSwapData] = useState<SwapState>({
    fromToken: 'ETH',
    toToken: 'NWAV',
    fromAmount: '1',
    toAmount: '0.0'
  });
  const [transactionHash, setTransactionHash] = useState('');

  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', balance: '2.5' },
    { symbol: 'USDC', name: 'USD Coin', balance: '1,000' },
    { symbol: 'USDT', name: 'Tether', balance: '500' },
    { symbol: 'NWAV', name: 'Nexus Wave', balance: '0' }
  ];

  const handleAmountChange = (value: string) => {
    setSwapData(prev => ({
      ...prev,
      fromAmount: value,
      toAmount: value ? (parseFloat(value) * 1000).toString() : '0.0' // Mock exchange rate
    }));
  };

  const handleConnectWallet = async () => {
    setCurrentStep('connect');
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnected(true);
      setWalletAddress('0x742d35Cc6634C0532925a3b8D4FD842D');
      setCurrentStep('swap');
      toast.success('Wallet connected successfully!');
    }, 2000);
  };

  const handleGetQuote = () => {
    if (!isConnected) {
      handleConnectWallet();
      return;
    }
    
    if (!swapData.fromAmount || parseFloat(swapData.fromAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setCurrentStep('confirm');
  };

  const handleConfirmSwap = () => {
    setCurrentStep('processing');
    
    // Simulate transaction processing
    setTimeout(() => {
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
      setTransactionHash(mockTxHash);
      setCurrentStep('success');
      toast.success('Transaction completed successfully!');
    }, 3000);
  };

  const handleClose = () => {
    setCurrentStep('swap');
    setSwapData({
      fromToken: 'ETH',
      toToken: 'NWAV',
      fromAmount: '1',
      toAmount: '0.0'
    });
    onClose();
  };

  const renderSwapInterface = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Swap Tokens</h3>
        <p className="text-muted-foreground">Exchange tokens directly using 0x Protocol</p>
      </div>

      {/* You Pay Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium">You Pay</label>
        <div className="flex gap-2">
          <Select value={swapData.fromToken} onValueChange={(value) => setSwapData(prev => ({ ...prev, fromToken: value }))}>
            <SelectTrigger className="w-48 h-12 bg-card border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tokens.filter(t => t.symbol !== swapData.toToken).map(token => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  {token.name} ({token.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="1"
            value={swapData.fromAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="flex-1 h-12 text-lg border-2"
          />
        </div>
      </div>

      {/* Swap Arrow */}
      <div className="flex justify-center">
        <div className="w-12 h-12 rounded-lg border-2 border-border bg-card flex items-center justify-center">
          <ArrowDown className="h-5 w-5" />
        </div>
      </div>

      {/* You Receive Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium">You Receive</label>
        <div className="flex gap-2">
          <Select value={swapData.toToken} onValueChange={(value) => setSwapData(prev => ({ ...prev, toToken: value }))}>
            <SelectTrigger className="w-48 h-12 bg-card border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tokens.filter(t => t.symbol !== swapData.fromToken).map(token => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  {token.name} ({token.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="text"
            value={swapData.toAmount}
            readOnly
            className="flex-1 h-12 text-lg border-2 bg-muted"
          />
        </div>
      </div>

      {/* Wallet Connection Status */}
      {isConnected && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-700">
            Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
        </div>
      )}

      {/* Action Button */}
      <Button 
        onClick={handleGetQuote}
        className="w-full h-12 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      >
        {!isConnected ? (
          <>
            <Wallet className="mr-2 h-5 w-5" />
            Connect Wallet
          </>
        ) : (
          'Get Quote'
        )}
      </Button>
    </div>
  );

  const renderConnecting = () => (
    <div className="text-center space-y-4 py-8">
      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <h3 className="text-xl font-semibold">Connecting Wallet</h3>
      <p className="text-muted-foreground">Please approve the connection in your wallet</p>
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Confirm Swap</h3>
        <p className="text-muted-foreground">Review your transaction details</p>
      </div>

      <div className="space-y-4 p-4 bg-muted rounded-lg">
        <div className="flex justify-between">
          <span>You Pay:</span>
          <span className="font-semibold">{swapData.fromAmount} {swapData.fromToken}</span>
        </div>
        <div className="flex justify-between">
          <span>You Receive:</span>
          <span className="font-semibold">{swapData.toAmount} {swapData.toToken}</span>
        </div>
        <div className="flex justify-between">
          <span>Exchange Rate:</span>
          <span>1 {swapData.fromToken} = 1,000 {swapData.toToken}</span>
        </div>
        <div className="flex justify-between">
          <span>Network Fee:</span>
          <span>~$5.20</span>
        </div>
        <hr />
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>{swapData.fromAmount} {swapData.fromToken} + fees</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentStep('swap')} className="flex-1">
          Back
        </Button>
        <Button onClick={handleConfirmSwap} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          Confirm Swap
        </Button>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center space-y-4 py-8">
      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <h3 className="text-xl font-semibold">Processing Transaction</h3>
      <p className="text-muted-foreground">Please wait while your transaction is being processed...</p>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-4 py-8">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      <h3 className="text-xl font-semibold text-green-600">Transaction Successful!</h3>
      <div className="space-y-2">
        <p className="text-muted-foreground">Your swap has been completed successfully</p>
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm">Transaction Hash:</p>
          <p className="font-mono text-xs break-all">{transactionHash}</p>
        </div>
      </div>
      <Button onClick={handleClose} className="w-full">
        Close
      </Button>
    </div>
  );

  const getStepContent = () => {
    switch (currentStep) {
      case 'swap':
        return renderSwapInterface();
      case 'connect':
        return renderConnecting();
      case 'confirm':
        return renderConfirmation();
      case 'processing':
        return renderProcessing();
      case 'success':
        return renderSuccess();
      default:
        return renderSwapInterface();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buy $NWAV Tokens</DialogTitle>
        </DialogHeader>
        {getStepContent()}
      </DialogContent>
    </Dialog>
  );
};

export default SwapModal;
