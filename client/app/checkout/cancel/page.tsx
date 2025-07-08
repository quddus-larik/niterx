'use client'

import React, { useState } from 'react';
import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { ImCross } from 'react-icons/im';

const CancelPayment = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoBack = () => {
    setLoading(true);
    router.push('/phones');
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="w-full max-w-md p-10 text-center bg-white shadow-xl rounded-2xl">
        <ImCross className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Payment Cancelled</h2>
        <p className="mb-6 text-gray-600">
          Your transaction was cancelled. You can return to the market and try again anytime.
        </p>
        <Button
          isLoading={loading}
          onPress={handleGoBack}
          variant="outline"
          className="w-full"
        >
          Go Back to Market
        </Button>
      </div>
    </div>
  );
};

export default CancelPayment;
