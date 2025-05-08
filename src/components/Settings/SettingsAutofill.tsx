
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Key, CreditCard, UserRound, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const SettingsAutofill: React.FC = () => {
  const [passwordsEnabled, setPasswordsEnabled] = useState(true);
  const [paymentMethodsEnabled, setPaymentMethodsEnabled] = useState(false);
  const [addressesEnabled, setAddressesEnabled] = useState(true);
  const [formFillEnabled, setFormFillEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [passwordGenerator, setPasswordGenerator] = useState(true);
  
  const { toast } = useToast();
  
  const handleManagePasswords = () => {
    toast({
      title: "Password Manager",
      description: "Opening password manager",
    });
  };
  
  const handleManagePayments = () => {
    toast({
      title: "Payment Methods",
      description: "Opening payment methods manager",
    });
  };
  
  const handleManageAddresses = () => {
    toast({
      title: "Addresses",
      description: "Opening address manager",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2">Autofill</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Manage autofill settings for forms, passwords, and payment methods
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-md font-medium mb-3">Passwords</h3>
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm">Save and fill passwords</p>
              <p className="text-xs text-muted-foreground">
                Nexus Wave can save and auto-fill your passwords
              </p>
            </div>
            <Switch 
              checked={passwordsEnabled}
              onCheckedChange={setPasswordsEnabled}
            />
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm">Suggest strong passwords</p>
              <p className="text-xs text-muted-foreground">
                Generate secure passwords when creating new accounts
              </p>
            </div>
            <Switch 
              checked={passwordGenerator}
              onCheckedChange={setPasswordGenerator}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Biometric authentication</p>
              <p className="text-xs text-muted-foreground">
                Use fingerprint or facial recognition for password autofill
              </p>
            </div>
            <Switch 
              checked={biometricEnabled}
              onCheckedChange={setBiometricEnabled}
            />
          </div>
          
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleManagePasswords}
            >
              <Key className="h-4 w-4 mr-1" />
              Manage saved passwords
            </Button>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Payment methods</h3>
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm">Save and fill payment methods</p>
              <p className="text-xs text-muted-foreground">
                Nexus Wave can save your payment details for faster checkout
              </p>
            </div>
            <Switch 
              checked={paymentMethodsEnabled}
              onCheckedChange={setPaymentMethodsEnabled}
            />
          </div>
          
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleManagePayments}
            >
              <CreditCard className="h-4 w-4 mr-1" />
              Manage payment methods
            </Button>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Addresses and more</h3>
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm">Save and fill addresses</p>
              <p className="text-xs text-muted-foreground">
                Automatically fill in forms with your saved addresses
              </p>
            </div>
            <Switch 
              checked={addressesEnabled}
              onCheckedChange={setAddressesEnabled}
            />
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm">Form autofill</p>
              <p className="text-xs text-muted-foreground">
                Automatically fill common form fields like name and email
              </p>
            </div>
            <Switch 
              checked={formFillEnabled}
              onCheckedChange={setFormFillEnabled}
            />
          </div>
          
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleManageAddresses}
            >
              <UserRound className="h-4 w-4 mr-1" />
              Manage addresses
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsAutofill;
