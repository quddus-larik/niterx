"use client";

import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../lib/redux/features/cookie/cookieSlice";
import { Button, Alert } from "@heroui/react"; // Import HeroUI Alert and Button

interface Product {
  id: string;
  mobile_name: string;
  category: { name: string };
  operating_system: string;
  ram: string;
  internal_memory: string;
  front_camera: string;
  back_camera: string;
  phone_img?: string;
  price?: number;
}

interface AddToCartButtonProps {
  phone: Product;
}

export default function AddToCartButton({ phone }: AddToCartButtonProps) {
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const showTemporaryAlert = useCallback((message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    const timeout = setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
    }, 2500);
    return () => clearTimeout(timeout);
  }, []);

  const handleAddToCart = useCallback(() => {
    dispatch(addItemToCart(phone));
    showTemporaryAlert(`${phone.mobile_name} added to cart!`);
  }, [dispatch, phone, showTemporaryAlert]);

  return (
    <>
      <Button
        onPress={handleAddToCart}
        color="primary"
        className="px-6 py-2"
      >
        Add to Cart
      </Button>

      {showAlert && (
        <div className="fixed z-50 w-full max-w-sm bottom-4 right-4">
          <Alert
            color="success"
            title="Added to Cart"
            description={alertMessage}
            variant="faded"
            onClose={() => {
              setShowAlert(false);
              setAlertMessage("");
            }}
          />
        </div>
      )}
    </>
  );
}
