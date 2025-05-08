
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const SettingsAutofill: React.FC = () => {
  const [passwordsEnabled, setPasswordsEnabled] = useState(true);
  const [paymentMethodsEnabled, setPaymentMethodsEnabled] = useState(false);
  const [addressesEnabled, setAddressesEnabled] = useState(true);

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
          <div className="flex justify-between items-center">
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
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Payment methods</h3>
          <div className="flex justify-between items-center">
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
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Addresses and more</h3>
          <div className="flex justify-between items-center">
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
        </div>
      </div>
    </div>
  );
};

export default SettingsAutofill;
