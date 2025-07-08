"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo, ChangeEvent, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { gql, useQuery } from "@apollo/client";
import {
  FaMobileAlt,
  FaShoppingBag,
  FaSearch,
  FaPlus,
  FaMinus,
  FaTrash,
} from "react-icons/fa";
import { IoCloseCircle, IoBagCheckOutline } from "react-icons/io5";
import { FiArrowUpRight } from "react-icons/fi";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Button,
  Input,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
  Alert,
  Chip,
  addToast,
} from "@heroui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "../lib/redux/features/cookie/cookieSlice";
import Header from "../../components/header";
import axios from "axios";

// GraphQL Query
const GET_ALL_PHONES = gql`
  query GetAllPhones {
    getAllPhones {
      doc_id
      mobile_name
      category {
        name
      }
      phone_img
      price
      qty
    }
  }
`;

interface Product {
  doc_id: string;
  mobile_name: string;
  category: { name: string };
  phone_img?: string;
  price?: number;
  qty: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface UiState {
  alertMessage: string;
  showCartModal: boolean;
  searchTerm: string;
  isCheckingOut: boolean;
}

export default function Phones() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((s: any) => s.cookie.data as CartItem[]);
  
  const [UserData,setUserData] = useState();
 
  useEffect(()=>{
  axios.get("/api/user").then(res=> setUserData(res.data));
  console.warn(UserData)
  },[])

  const { data, loading, error } = useQuery<{ getAllPhones: Product[] }>(
    GET_ALL_PHONES
  );
  const allPhones = data?.getAllPhones || [];

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [uiState, setUiState] = useState<UiState>({
    alertMessage: "",
    showCartModal: false,
    searchTerm: searchParams.get("q") || "",
    isCheckingOut: false,
  });

  // Build category list
  useEffect(() => {
    const unique = Array.from(
      new Set(allPhones.map((p) => p.category?.name).filter(Boolean))
    ).sort();
    setCategories([
      { id: "all", name: "all" },
      ...unique.map((n, i) => ({ id: `cat-${i}`, name: n! })),
    ]);
  }, [allPhones]);

  const selectedCategory = searchParams.get("category") || "all";

  // Filter phones by category and search term
  const filteredPhones = useMemo(() => {
    let list = allPhones;
    if (selectedCategory !== "all") {
      list = list.filter(
        (p) => p.category?.name.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    if (uiState.searchTerm) {
      const q = uiState.searchTerm.toLowerCase();
      list = list.filter((p) => p.mobile_name.toLowerCase().includes(q));
    }
    return list;
  }, [allPhones, selectedCategory, uiState.searchTerm]);

  // Helper to update URL params
  const updateUrl = useCallback(
    (q: string) => {
      const params = new URLSearchParams(searchParams.toString());
      q ? params.set("q", q) : params.delete("q");
      selectedCategory !== "all"
        ? params.set("category", selectedCategory)
        : params.delete("category");
      router.replace(`/phones?${params.toString()}`, { shallow: true });
    },
    [router, searchParams, selectedCategory]
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUiState((s) => ({ ...s, searchTerm: val }));
    updateUrl(val);
  };

  const clearSearch = () => {
    setUiState((s) => ({ ...s, searchTerm: "" }));
    updateUrl("");
  };

  const Alert = (title: string, description: string, color: string, timeout: number) => {
    addToast({
      title,
      description,
      color,
      timeout,
    });
  }


  const handleAddCart = useCallback(
    (product: Product) => {
      const exists = cartItems.some((i) => i.product.doc_id === product.doc_id);
      dispatch(addItemToCart(product));
      Alert("Cart",exists? `Increased quantity of ${product.mobile_name}!` : `${product.mobile_name} added!`,"success",2000)
    },
    [cartItems, dispatch]
  );
  
  const handleUpdateQuantity = (id: number, delta: number) => {
    dispatch(updateCartItemQuantity({ productId: id, delta }));
    Alert("Cart","quantity updated!","success",2000)
  };
  
  const handleRemoveFromCart = (id: string) => {
    dispatch(removeCartItem(id));
    Alert("item removed", undefined ,"default",2000)
  };
  
  const handleClearCart = () => {
    dispatch(clearCart());
    Alert("Cart Cleared", undefined  ,"default",2000)
  };

  const toggleCart = () => {
    setUiState((s) => ({ ...s, showCartModal: !s.showCartModal }));
  };

  const handleCheckout = () => {
    setUiState((s) => ({ ...s, isCheckingOut: true }));
    router.push("/checkout");
  };

  const totalCart = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.quantity, 0),
    [cartItems]
  );

  return (
    <main className="min-h-screen bg-slate-100">
      <Header
        totalCartItems={totalCart}
        onClearCart={handleClearCart}
        onToggleCartModal={toggleCart}
        loggedInUserData={UserData}
      />
      

      <div className="px-4 pb-8 mx-auto pt-28 max-w-7xl">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((c,idx) => (
            <Link
              key={idx+1}
              href={`/phones?category=${c.name}${uiState.searchTerm ? `&q=${uiState.searchTerm}` : ""}`}
            >
              <Button
                color={selectedCategory === c.name ? "primary" : "default"}
                variant="bordered"
                size="sm"
                radius="lg"
              >
                {c.name}
              </Button>
            </Link>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full mb-4 sm:w-auto">
          <Input
            type="text"
            placeholder="Search phones…"
            value={uiState.searchTerm}
            onChange={handleSearchChange}
            color="primary"
            endContent={
              <Button
                isIconOnly
                size="sm"
                className="bg-slate-50"
                onPress={clearSearch}
              >
                {uiState.searchTerm ? <IoCloseCircle /> : <FaSearch />}
              </Button>
            }
          />
        </div>

        {/* Phone Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="flex items-center justify-center w-full h-svh">
              <Spinner label="Getting phones..." />
            </div>
          ) : error ? (
            <div className="py-16 text-center text-red-600">
              <p className="text-lg font-semibold">Oops! Failed to load.</p>
              <p className="mb-4">{error.message}</p>
              <Button
                onPress={() => router.refresh()}
                startContent={<FaSearch />}
              >
                Retry
              </Button>
            </div>
          ) : filteredPhones.length === 0 ? (
            <p className="text-center text-gray-500">No phones found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPhones.map((phone) => (
                <Card
                  key={phone.id}
                  className="flex flex-col h-full hover:ring-1 ring-sky-500"
                >
                  <CardHeader className="p-0">
                    <Link
                      href={`/phones/${phone.doc_id}`}
                      className="block w-full bg-white aspect-square"
                    >
                      <div className="flex items-center justify-center w-full h-full">
                        {phone.phone_img ? (
                          <Image
                            src={phone.phone_img}
                            alt={phone.mobile_name}
                            width={200}
                            height={200}
                            className="object-contain max-w-full max-h-full"
                          />
                        ) : (
                          <FaMobileAlt className="text-5xl text-gray-400" />
                        )}
                      </div>
                    </Link>
                  </CardHeader>

                  <Divider />
                  <CardBody className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{phone.mobile_name}</h3>
                      <Chip size="sm" color="primary" variant="faded">
                        {phone.category?.name || "N/A"}
                      </Chip>
                    </div>
                    <p className="text-sm text-gray-600">
                      PKR{" "}
                      {phone.price.toLocaleString("en-PK", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }) || "N/A"}
                    </p>
                  </CardBody>
                  <CardFooter className="flex gap-2">
                    <Button
                      fullWidth
                      onPress={() => handleAddCart(phone)}
                      startContent={<FaShoppingBag />}
                    >
                      Add
                    </Button>
                    <Link href={`/phones/${phone.doc_id}`}>
                    <Button
                      color="primary"
                      isIconOnly
                      >
                      <FiArrowUpRight />
                    </Button>
                      </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        

        {/* Cart Modal */}
        <Modal
          isOpen={uiState.showCartModal}
          onOpenChange={toggleCart}
          scrollBehavior="inside"
        >
          <ModalContent>
            <ModalHeader>Your Shopping Cart</ModalHeader>
            <ModalBody>
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty.</p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-4 py-2 border-b"
                  >
                    <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-md">
                      {item.product.phone_img ? (
                        <Image
                          src={item.product.phone_img}
                          alt={item.product.mobile_name}
                          width={64}
                          height={64}
                          className="object-contain"
                        />
                      ) : (
                        <FaMobileAlt className="text-3xl text-gray-400" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold">
                        {item.product.mobile_name}
                      </h3>
                      <p className="text-sm">{item.product.category?.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="bordered"
                          isIconOnly
                          onPress={() =>
                            handleUpdateQuantity(item.product.doc_id, -1)
                          }
                          isDisabled={item.quantity <= 1}
                        >
                          <FaMinus />
                        </Button>
                        <span className="font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="bordered"
                          isIconOnly
                          onPress={() =>
                            handleUpdateQuantity(item.product.doc_id, 1)
                          }
                          isDisabled={item.quantity >= item.product.qty}
                        >
                          <FaPlus />
                        </Button>
                      </div>
                    </div>
                    <Button
                      isIconOnly
                      variant="light"
                      color="danger"
                      onPress={() => handleRemoveFromCart(item.product.doc_id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                ))
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="warning"
                isLoading={uiState.isCheckingOut}
                onPress={handleCheckout}
                isDisabled={cartItems.length === 0}
              >
                Checkout <IoBagCheckOutline />
              </Button>
              <Button color="primary" onPress={toggleCart}>
                Continue Shopping
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </main>
  );
}
