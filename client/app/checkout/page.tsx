'use client';

import { useState, useMemo, useCallback, FormEvent, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios"; // Import axios to fetch user data
import {
  FaMobileAlt,
  FaArrowLeft,
  FaTrash,
  FaGoogle,
} from "react-icons/fa";
import {
  Input,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Alert,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  clearCart,
  removeCartItem,
} from "../lib/redux/features/cookie/cookieSlice";
import { IoCard, IoCash } from "react-icons/io5";
import { RiEBike2Fill } from "react-icons/ri";
import CheckoutButton from "./checkout-btn";

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
  price: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// Define the structure of the user data expected from /api/user
interface UserDataResponse {
  error: boolean;
  message: string;
  user: {
    email: string;
    image: string;
    name: string;
    database: {
      address: string;
      cell: string;
      city: string;
      email: string;
      username: string;
      zip: string;
      _id: string;
    };
  };
}

export default function Checkout() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state: any) => state.cookie.data) as CartItem[];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    cell: "", // Added cell field
    paymentMethod: "cash on delivery", // Changed default to "cash on delivery" as it's a common initial choice
  });
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [Payment, SetPayment] = useState<null | number>(102); // Set initial payment method to Cash On Delivery (ID 102)
  const [alertStatus, setAlertStatus] = useState<"success" | "error" | "info" | "warning">("info");

  // State to hold the fetched user data
  const [fetchedUserData, setFetchedUserData] = useState<UserDataResponse | null>(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get<UserDataResponse>("/api/user");
        setFetchedUserData(response.data);
      } catch (error) {
        console.error("Error fetching user profile data:", error);
        // Optionally show a toast or alert if fetching fails
      }
    };
    fetchProfileData();
  }, []);

  // Populate form data once fetchedUserData is available
  useEffect(() => {
    if (fetchedUserData && fetchedUserData.user) {
      const { user } = fetchedUserData;
      setFormData((prev) => ({
        ...prev,
        name: user.database?.username || user.name || "", // Prioritize database username
        email: user.email || "",
        address: user.database?.address || "",
        city: user.database?.city || "",
        zip: user.database?.zip || "",
        cell: user.database?.cell || "", // Populate new cell field
      }));
    }
  }, [fetchedUserData]);


  const isFormValid = useMemo(() => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.address.trim() &&
      formData.city.trim() &&
      formData.zip.trim() &&
      formData.cell.trim() // Added cell to validation
    );
  }, [formData]);

  const paymentMethods = [
    { id: 101, value: "c payment", label: "Card Payment", content: <IoCard /> },
    { id: 102, value: "cash on delivery", label: "Cash On Delivery", content: <IoCash /> },
    { id: 103, value: "google pay", label: "Google Pay", content: <FaGoogle /> },
  ];

  const PKR_TO_USD_RATE = 0.0035; // Consider fetching this dynamically

const totalAmounts = useMemo(() => {
    const calculatedPKR = cartItems.reduce(
        (acc, item) => acc + (item.product.price || 0) * item.quantity,
        0 // Initial value for the accumulator
    );
    const calculatedUSD = calculatedPKR * PKR_TO_USD_RATE;
    return {
        totalPKR: calculatedPKR,
        totalUSD: calculatedUSD,
    };
}, [cartItems, PKR_TO_USD_RATE]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }));
    const selectedMethod = paymentMethods.find(method => method.value === value);
    SetPayment(selectedMethod ? selectedMethod.id : null);
  }, [paymentMethods]);

  const showTemporaryAlert = useCallback((message: string, status: "success" | "error" | "info" | "warning" = "info") => {
    setAlertMessage(message);
    setAlertStatus(status);
    setShowAlert(true);
    const timer = setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
      setAlertStatus("info");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setIsProcessingOrder(true);

    if (!isFormValid) {
      showTemporaryAlert("Please fill in all required fields.", "error");
      setIsProcessingOrder(false);
      return;
    }

    try {
      // Simulate API call for placing order
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showTemporaryAlert("Order placed successfully!", "success");
      dispatch(clearCart());
      setFormData({
        name: "",
        email: "",
        address: "",
        city: "",
        zip: "",
        cell: "", // Clear cell field after order
        paymentMethod: "cash on delivery",
      });
      SetPayment(102); // Reset payment method to default
    } catch (error) {
      console.error("Order failed:", error);
      showTemporaryAlert("Failed to place order. Please try again.", "error");
    } finally {
      setIsProcessingOrder(false);
    }
  }, [formData, isFormValid, dispatch, showTemporaryAlert]);

  const handleRemoveFromCart = useCallback((productId: string) => {
    dispatch(removeCartItem(productId));
    showTemporaryAlert("Item removed from cart!");
  }, [dispatch, showTemporaryAlert]);

  return (
    <main className="min-h-screen p-4 bg-slate-100 sm:p-8">
      <header className="flex items-center justify-between p-4 mb-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <Button startContent={<FaArrowLeft />} onPress={() => router.back()}>Back to Catalog</Button>
      </header>

      <div className="grid max-w-4xl grid-cols-1 gap-6 mx-auto lg:grid-cols-2">
        <Card className="p-4">
          <CardHeader className="pb-4 text-xl font-semibold text-gray-800">Your Order Summary</CardHeader>
          <Divider />
          <CardBody className="py-4">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500">
                Your cart is empty. Please add items from the <Link href="/phones" className="text-blue-600 hover:underline">catalog</Link>.
              </p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md">
                      {item.product.phone_img ? (
                        <Image
                          src={item.product.phone_img}
                          alt={item.product.mobile_name}
                          width={64}
                          height={64}
                          className="object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).onerror = null;
                            (e.target as HTMLImageElement).src = `https://placehold.co/64x64/E5E7EB/4B5563?text=📱`;
                          }}
                        />
                      ) : (
                        <FaMobileAlt className="text-3xl text-gray-400" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-800">{item.product.mobile_name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <span className="font-semibold text-gray-900 text-tiny">{item.product.price}</span>
                    </div>
                    <Button isIconOnly color="danger" variant="faded" onPress={() => handleRemoveFromCart(item.product.id)}>
                      <FaTrash />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
          <Divider />
          <CardFooter className="flex items-center justify-between pt-4">
            <span className="text-lg font-extrabold text-primary-600">USD {totalAmounts.totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-lg font-extrabold text-primary-600">PKR {totalAmounts.totalPKR.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </CardFooter>
        </Card>

        <Card className={`p-4 ${cartItems.length === 0 ? "hidden" : "block"}`}>
          <CardHeader className="pb-4 text-xl font-semibold text-gray-800">Shipping & Payment Details</CardHeader>
          <Divider />
          <CardBody className="py-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full Name" name="name" value={formData.name} onChange={handleInputChange} required />
              <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              <Input label="Phone Number" name="cell" value={formData.cell} onChange={handleInputChange} required placeholder="+92XXXXXXXXXX" /> {/* New cell input */}
              <Input label="Address" name="address" value={formData.address} onChange={handleInputChange} required />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="City" name="city" value={formData.city} onChange={handleInputChange} required />
                <Input label="Zip Code" name="zip" value={formData.zip} onChange={handleInputChange} required />
              </div>
              <Select
                label="Payment Method"
                selectedKeys={[formData.paymentMethod]}
                onSelectionChange={(keys) => handleSelectChange(Array.from(keys)[0] as string)}
                className="w-full"
              >
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value} startContent={method.content} onPress={() => SetPayment(method.id)}>
                    {method.label}
                  </SelectItem>
                ))}
              </Select>
              {Payment === 101 ? (
                <CheckoutButton amount={totalAmount || 21} isDisabled={!isFormValid} />
              ) : Payment === 102 ? (
                <Button isLoading={isProcessingOrder} className="w-full text-white bg-black" startContent={<RiEBike2Fill className="text-lg text-white" />} isDisabled={!isFormValid} type="submit">
                  Order Now
                </Button>
              ) : Payment === 103 ? (
                <Button isLoading={isProcessingOrder} className="w-full text-white bg-black" startContent={<FaGoogle className="text-lg text-white" />} isDisabled={!isFormValid} type="submit">
                  Pay Now
                </Button>
              ) : (
                <Button className="w-full text-white bg-black" startContent={<FaGoogle className="text-lg text-white" />} isDisabled>
                  Select Payment Method
                </Button>
              )}
            </form>
          </CardBody>
        </Card>
      </div>

      {showAlert && (
        <div className="fixed z-50 bottom-4 right-4">
          <Alert color={alertStatus} title={alertMessage} onClose={() => setShowAlert(false)} variant="faded" duration={3000} />
        </div>
      )}
    </main>
  );
}
