'use client';

import React, { useState, useEffect } from 'react';
import { addToast, Button } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { BsCheckCircleFill } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/app/lib/redux/features/cookie/cookieSlice';

const SuccessPayment = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    dispatch(clearCart());
    addToast({
      title: "your cart cleared for success transaction.",
      color: "default"
    })
  },[])

  const handleGoBack = () => {
    setLoading(true);
    router.push('/phones');
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-green-50">
      <div className="w-full max-w-md p-10 text-center bg-white shadow-xl rounded-2xl">
        <BsCheckCircleFill className="w-16 h-16 mx-auto mb-4 text-green-500" />
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Payment Successful</h2>
        <p className="mb-6 text-gray-600">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <Button
          isLoading={loading}
          onPress={handleGoBack}
          className="w-full"
        >
          Go Back to Market
        </Button>
      </div>
    </div>
  );
};

export default SuccessPayment;
