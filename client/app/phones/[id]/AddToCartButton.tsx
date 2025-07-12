"use client";

import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../lib/redux/features/cookie/cookieSlice";
import { Button, addToast } from "@heroui/react";

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

interface Color {
  name: string;
  hex: string;
}

interface AddToCartButtonProps {
  phone: Product;
  selectedColor?: Color;
}

export default function AddToCartButton({ phone, selectedColor }: AddToCartButtonProps) {
  const dispatch = useDispatch();
  const [alertMessage, setAlertMessage] = useState("");

  const showTemporaryAlert = (message: string) => {
    setAlertMessage(message);
    addToast({
      description: alertMessage,
      color: "success",
      timeout: 2000,
    })
  }

  const handleAddToCart = useCallback(() => {
    const cartItem = {
      ...phone,
      selectedColor: selectedColor
        ? { name: selectedColor.name, hex: selectedColor.hex }
        : null,
    };

    dispatch(addItemToCart(cartItem));
    showTemporaryAlert(
      `${phone.mobile_name} (${selectedColor?.name || "Default Color"}) added to cart!`
    );
  }, [dispatch, phone, selectedColor, showTemporaryAlert]);

  return (
      <Button onPress={handleAddToCart} color="primary" className="px-6 py-2">
        Add to Cart
      </Button>
  );
}
