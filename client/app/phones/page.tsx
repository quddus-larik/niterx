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
  FaFilter,
  FaShoppingCart,
  FaTag,
} from "react-icons/fa";
import { IoCloseCircle, IoBagCheckOutline } from "react-icons/io5";
import { FiArrowUpRight } from "react-icons/fi";
import { Icon } from "@iconify/react";
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
  Select,
  SelectItem,
  Badge,
  Avatar,
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
  
  const [UserData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(true);
 
  useEffect(() => {
    axios.get("/api/user").then(res => setUserData(res.data));
    console.warn(UserData);
  }, []);

  const { data, loading, error } = useQuery<{ getAllPhones: Product[] }>(
    GET_ALL_PHONES,
    {
      onCompleted: () => setIsLoading(false),
      onError: () => setIsLoading(false)
    }
  );
  const allPhones = data?.getAllPhones || [];

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
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
  };

  const handleAddCart = useCallback(
    (product: Product) => {
      const exists = cartItems.some((i) => i.product.doc_id === product.doc_id);
      dispatch(addItemToCart(product));
      Alert("Cart", exists ? `Increased quantity of ${product.mobile_name}!` : `${product.mobile_name} added!`, "success", 2000);
    },
    [cartItems, dispatch]
  );
  
  const handleUpdateQuantity = (id: number, delta: number) => {
    dispatch(updateCartItemQuantity({ productId: id, delta }));
  };
  
  const handleRemoveFromCart = (id: string) => {
    dispatch(removeCartItem(id));
    Alert("item removed", undefined, "default", 2000);
  };
  
  const handleClearCart = () => {
    dispatch(clearCart());
    Alert("Cart Cleared", undefined, "default", 2000);
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

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, i) => sum + ((i.product.price || 0) * i.quantity), 0),
    [cartItems]
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon icon="mdi:cellphone-off" className="mb-4 text-6xl text-gray-300" />
      <h3 className="mb-2 text-xl font-semibold text-gray-600">No phones found</h3>
      <p className="max-w-md text-gray-500">
        {uiState.searchTerm || selectedCategory !== "all" 
          ? "Try adjusting your search or filter criteria"
          : "We're updating our inventory. Please check back later."}
      </p>
    </div>
  );

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner size="lg" color="default" />
          <p className="mt-4 text-gray-600">Loading phones...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header
        totalCartItems={totalCart}
        onClearCart={handleClearCart}
        onToggleCartModal={toggleCart}
        loggedInUserData={UserData}
      />
      
      <div className="p-4 mx-auto max-w-7xl pt-28">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mobile Phones</h1>
              <p className="text-sm text-gray-600">
                {filteredPhones.length} {filteredPhones.length === 1 ? 'phone' : 'phones'} available
              </p>
            </div>
            
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col gap-4 mb-6 sm:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Search phones by name..."
                startContent={<FaSearch className="text-gray-400" />}
                value={uiState.searchTerm}
                onChange={handleSearchChange}
                endContent={
                  uiState.searchTerm && (
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={clearSearch}
                    >
                      <IoCloseCircle />
                    </Button>
                  )
                }
                classNames={{
                  input: "text-sm",
                  inputWrapper: "bg-white shadow-sm border-gray-200"
                }}
              />
            </div>
            <Select
              placeholder="Filter by category"
              selectedKeys={selectedCategory ? [selectedCategory] : []}
              onSelectionChange={(keys) => {
                const category = Array.from(keys)[0] as string || "all";
                const params = new URLSearchParams(searchParams.toString());
                category !== "all" ? params.set("category", category) : params.delete("category");
                router.replace(`/phones?${params.toString()}`, { shallow: true });
              }}
              startContent={<FaFilter className="text-gray-400" />}
              className="w-full sm:w-48"
              classNames={{
                trigger: "bg-white shadow-sm border-gray-200"
              }}
            >
              {categories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name === "all" ? "All Categories" : category.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>

        {/* Content */}
        {error ? (
          <Card className="shadow-sm">
            <CardBody>
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Icon icon="mdi:alert-circle" className="mb-4 text-6xl text-red-300" />
                <h3 className="mb-2 text-xl font-semibold text-red-600">Failed to load phones</h3>
                <p className="mb-4 text-gray-500">{error.message}</p>
                <Button
                  color="primary"
                  onPress={() => router.refresh()}
                  startContent={<FaSearch />}
                >
                  Try Again
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : filteredPhones.length === 0 ? (
          <Card className="shadow-sm">
            <CardBody>
              <EmptyState />
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPhones.map((phone) => (
              <Card key={phone.doc_id} className="transition-shadow shadow-sm hover:shadow-md">
                <CardHeader className="p-0">
                  <Link href={`/phones/${phone.doc_id}`} className="block w-full">
                    <div className="flex items-center justify-center p-4 bg-white aspect-square">
                      {phone.phone_img ? (
                        <Image
                          src={phone.phone_img}
                          alt={phone.mobile_name}
                          width={200}
                          height={200}
                          className="object-contain max-w-full max-h-full"
                        />
                      ) : (
                        <FaMobileAlt className="text-5xl text-gray-300" />
                      )}
                    </div>
                  </Link>
                </CardHeader>

                <CardBody className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold leading-tight text-gray-900">
                      {phone.mobile_name}
                    </h3>
                    <Chip
                      size="sm"
                      variant="flat"
                      color="default"
                      className="text-xs"
                    >
                      {phone.category?.name || "N/A"}
                    </Chip>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {phone.price ? phone.price.toLocaleString("en-PK", {
                          style: "currency",
                          currency: "PKR",
                        }) : "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {phone.qty} in stock
                      </p>
                    </div>
                  </div>
                </CardBody>

                <CardFooter className="gap-2 p-4 pt-0">
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    onPress={() => handleAddCart(phone)}
                    startContent={<FaShoppingBag />}
                    className="flex-1"
                    isDisabled={phone.qty === 0}
                  >
                    Add to Cart
                  </Button>
                  <Link href={`/phones/${phone.doc_id}`}>
                    <Button
                      size="sm"
                      color="primary"
                      isIconOnly
                      variant="solid"
                    >
                      <FiArrowUpRight />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Footer */}
        {filteredPhones.length > 0 && (
          <div className="p-4 mt-8 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {filteredPhones.length} of {allPhones.length} phones
              </span>
              <span>
                {selectedCategory !== "all" && `Category: ${selectedCategory}`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Cart Modal */}
      <Modal
        isOpen={uiState.showCartModal}
        onOpenChange={toggleCart}
        scrollBehavior="inside"
        size="2xl"
      >
        <ModalContent>
          <ModalHeader className="flex items-center gap-2">
            <FaShoppingCart />
            Shopping Cart
            <Badge content={totalCart} color="primary" size="sm" />
          </ModalHeader>
          <ModalBody>
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Icon icon="mdi:cart-outline" className="mb-4 text-6xl text-gray-300" />
                <h3 className="mb-2 text-lg font-semibold text-gray-600">Your cart is empty</h3>
                <p className="text-gray-500">Add some phones to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product.doc_id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                    <Avatar
                      src={item.product.phone_img}
                      alt={item.product.mobile_name}
                      className="w-16 h-16 rounded-none"
                      fallback={<FaMobileAlt className="text-gray-400" />}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {item.product.mobile_name}
                      </h3>
                      <p className="text-sm text-gray-600">{item.product.category?.name}</p>
                      <p className="text-sm font-medium text-gray-900">
                        {(item.product.price || 0).toLocaleString("en-PK", {
                          style: "currency",
                          currency: "PKR",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        isIconOnly
                        onPress={() => handleUpdateQuantity(item.product.doc_id, -1)}
                        isDisabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </Button>
                      <span className="w-8 font-medium text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="flat"
                        isIconOnly
                        onPress={() => handleUpdateQuantity(item.product.doc_id, 1)}
                        isDisabled={item.quantity >= item.product.qty}
                      >
                        <FaPlus />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="light"
                      color="danger"
                      isIconOnly
                      onPress={() => handleRemoveFromCart(item.product.doc_id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ModalBody>
          <ModalFooter className="flex flex-col gap-4">
            {cartItems.length > 0 && (
              <div className="w-full p-4 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-gray-900">
                    {cartTotal.toLocaleString("en-PK", {
                      style: "currency",
                      currency: "PKR",
                    })}
                  </span>
                </div>
              </div>
            )}
            <div className="flex w-full gap-2">
              <Button
                color="primary"
                isLoading={uiState.isCheckingOut}
                onPress={handleCheckout}
                isDisabled={cartItems.length === 0}
                startContent={<IoBagCheckOutline />}
                className="flex-1"
              >
                Checkout
              </Button>
              <Button
                variant="flat"
                onPress={toggleCart}
                className="flex-1"
              >
                Continue Shopping
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </main>
  );
}