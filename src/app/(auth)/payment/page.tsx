'use client';

import { createCheckoutSession } from '@/actions/actions';
import H1 from '@/components/h1';
import { Button } from '@/components/ui/button';

export default function PaymentPage() {
  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>PetSoft access requires payment</H1>
      <Button
        onClick={() => {
          createCheckoutSession();
        }}
      >
        Buy lifetime access for $199
      </Button>
    </main>
  );
}
