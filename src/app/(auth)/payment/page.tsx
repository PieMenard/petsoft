'use client';

import { createCheckoutSession } from '@/actions/actions';
import H1 from '@/components/h1';
import { Button } from '@/components/ui/button';
import { startTransition, useTransition } from 'react';

export default function PaymentPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>PetSoft access requires payment</H1>
      {!searchParams.success && (
        <Button
          disabled={isPending}
          onClick={async () => {
            startTransition(async () => {
              await createCheckoutSession();
            });
          }}
        >
          Buy lifetime access for $199
        </Button>
      )}

      {searchParams.success && (
        <p className="text-sm text-green-700">
          Payment successful! You now have lifetime access to PetSoft.
        </p>
      )}
      {searchParams.cancelled && (
        <p className="text-sm text-green-700">Payment cancelled. Try again.</p>
      )}
    </main>
  );
}