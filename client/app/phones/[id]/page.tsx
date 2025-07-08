"use client";

import { gql, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Chip,
  Button,
  Skeleton,
  Badge,
  Avatar,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Breadcrumbs,
  BreadcrumbItem,
  Tooltip,
} from "@heroui/react";
import {
  FaMemory,
  FaSdCard,
  FaCamera,
  FaWeightHanging,
  FaMicrochip,
  FaDisplay,
  FaBookmark,
  FaShare,
  FaStar,
  FaArrowLeft,
  FaCheck,
  FaTruck,
  FaShield,
  FaClock,
  FaPhone,
  FaGlobe,
} from "react-icons/fa6";
import { FaMobileAlt } from "react-icons/fa";
import AddToCartButton from "./AddToCartButton";
import { ImArrowUpLeft } from "react-icons/im";
import { useState } from "react";

const GET_PHONE_BY_ID = gql`
  query GetPhone($doc_id: Int!) {
    getPhone(doc_id: $doc_id) {
      mobile_name
      phone_img
      price
      ram
      internal_memory
      operating_system
      front_camera
      back_camera
      processor
      screen_size
      phone_weight
      color {
        avaliable
        hex
        name
        phone_img
      }
      category {
        name
      }
    }
  }
`;

// Professional data for enhanced features
const professionalReviews = [
  {
    id: 1,
    user: "Michael K.",
    rating: 5,
    comment: "Outstanding build quality and performance for business use.",
  },
  {
    id: 2,
    user: "Jennifer L.",
    rating: 4,
    comment:
      "Reliable device with excellent battery life and professional features.",
  },
  {
    id: 3,
    user: "Robert S.",
    rating: 5,
    comment: "Premium device that delivers on all fronts. Highly recommended.",
  },
];

const technicalSpecs = {
  display: { type: "AMOLED", resolution: "1080x2400", refresh: "120Hz" },
  battery: { capacity: "4500mAh", charging: "Fast Charging 45W" },
  connectivity: ["5G", "Wi-Fi 6E", "Bluetooth 5.3", "NFC", "USB-C"],
  colors: ["Graphite", "Silver", "Midnight"],
  warranty: "2 Years International Warranty",
  certifications: ["IP68", "MIL-STD-810G"],
};

export default function PhoneDetailPage() {
  const { id } = useParams();
  const doc_id = parseInt(id as string);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [ImageUrl, setImageUrl] = useState("");

  const { data, loading, error } = useQuery(GET_PHONE_BY_ID, {
    variables: { doc_id },
  });

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <Card className="w-full shadow-sm">
            <CardHeader className="pb-6">
              <div className="flex flex-col w-full gap-4">
                <Skeleton className="w-2/5 rounded-md">
                  <div className="w-2/5 h-3 bg-gray-200 rounded-md"></div>
                </Skeleton>
                <Skeleton className="w-3/5 rounded-md">
                  <div className="w-3/5 h-8 bg-gray-200 rounded-md"></div>
                </Skeleton>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                <Skeleton className="rounded-md">
                  <div className="bg-gray-200 rounded-md h-96"></div>
                </Skeleton>
                <div className="space-y-6">
                  <Skeleton className="w-4/5 rounded-md">
                    <div className="w-4/5 h-6 bg-gray-200 rounded-md"></div>
                  </Skeleton>
                  <Skeleton className="w-full rounded-md">
                    <div className="w-full h-4 bg-gray-200 rounded-md"></div>
                  </Skeleton>
                  <Skeleton className="w-3/5 rounded-md">
                    <div className="w-3/5 h-4 bg-gray-200 rounded-md"></div>
                  </Skeleton>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !data?.getPhone) return notFound();

  const phone = data.getPhone;
  const averageRating = 4.7;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/phones">
                <Button
                  variant="light"
                  size="sm"
                  startContent={<FaArrowLeft className="text-gray-600" />}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Back
                </Button>
              </Link>
              <Breadcrumbs size="sm" className="hidden md:flex">
                <BreadcrumbItem>
                  <Link href="/">Home</Link>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <Link href="/phones">Mobile Phones</Link>
                </BreadcrumbItem>
                <BreadcrumbItem>{phone.mobile_name}</BreadcrumbItem>
              </Breadcrumbs>
            </div>
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                aria-label="Save"
                className="text-gray-600 hover:text-gray-900"
              >
                <FaBookmark />
              </Button>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                aria-label="Share"
                className="text-gray-600 hover:text-gray-900"
              >
                <FaShare />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 gap-12 mb-12 lg:grid-cols-2">
          {/* Product Image */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardBody className="p-8 bg-white">
                <div className="flex items-center justify-center aspect-square">
                  {phone.phone_img ? (
                    <Image
                      src={ImageUrl.trim() !== "" ? ImageUrl : phone.phone_img}
                      alt={phone.mobile_name}
                      width={400}
                      height={400}
                      className="object-contain drop-shadow-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <FaMobileAlt className="w-32 h-32 text-gray-300" />
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Product Features */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Key Features
                </h3>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <FaCheck className="flex-shrink-0 text-green-600" />
                    <span className="text-gray-700">
                      Premium build quality with professional design
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FaCheck className="flex-shrink-0 text-green-600" />
                    <span className="text-gray-700">
                      Advanced security features for business use
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FaCheck className="flex-shrink-0 text-green-600" />
                    <span className="text-gray-700">
                      Enterprise-grade performance and reliability
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FaCheck className="flex-shrink-0 text-green-600" />
                    <span className="text-gray-700">
                      Extended warranty and professional support
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Chip
                variant="flat"
                color="default"
                size="sm"
                className="mb-3 text-gray-700 bg-gray-100"
              >
                {phone.category.name}
              </Chip>
              <h1 className="mb-4 text-3xl font-bold text-gray-900">
                {phone.mobile_name}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(averageRating)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {averageRating} ({professionalReviews.length} reviews)
                </span>
              </div>

              <div className="mb-6 text-3xl font-bold text-gray-900">
                PKR{" "+phone.price.toLocaleString("en-PK", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="flex items-center gap-2 p-1">
                {phone.color.map((itm) => (
                  <Tooltip content={itm.name} showArrow={true} size="sm">
                    <Button
                      key={itm.hex}
                      size="sm"
                      radius="full"
                      isIconOnly
                      className="p-2 mb-2 text-white rounded-full"
                      style={{ backgroundColor: itm.hex }}
                      onClick={() => setImageUrl(itm.phone_img)}
                    />
                  </Tooltip>
                ))}
              </div>

              {/* Business Benefits */}
              <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <FaTruck className="text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Free Shipping
                    </p>
                    <p className="text-xs text-gray-600">Next business day</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <FaShield className="text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      2 Year Warranty
                    </p>
                    <p className="text-xs text-gray-600">
                      International coverage
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <FaClock className="text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      24/7 Support
                    </p>
                    <p className="text-xs text-gray-600">Business priority</p>
                  </div>
                </div>
              </div>

              {/* Quick Specifications */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FaMemory className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Memory
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {phone.ram}
                  </p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FaSdCard className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Storage
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {phone.internal_memory}
                  </p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FaDisplay className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Display
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {phone.screen_size}
                  </p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCamera className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Camera
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {phone.back_camera}
                  </p>
                </div>
              </div>

              

              {/* Action Buttons */}
              <div className="space-y-3">
                <AddToCartButton phone={phone} />
                <Button
                  startContent={<ImArrowUpLeft />}
                  fullWidth
                  color="warning"
                  variant="flat"
                >
                  Compare
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <Card className="border-0 shadow-sm">
          <CardBody className="p-8">
            <Tabs
              aria-label="Product information"
              color="default"
              variant="underlined"
              classNames={{
                tabList:
                  "gap-6 w-full relative rounded-none p-0 border-b border-gray-200",
                cursor: "w-full bg-gray-900",
                tab: "max-w-fit px-0 h-12",
                tabContent:
                  "group-data-[selected=true]:text-gray-900 font-medium",
              }}
            >
              <Tab
                key="specifications"
                title={
                  <div className="flex items-center space-x-2">
                    <FaMicrochip className="w-4 h-4" />
                    <span>Technical Specifications</span>
                  </div>
                }
              >
                <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2">
                  <div>
                    <h4 className="mb-4 text-lg font-semibold text-gray-900">
                      Performance
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-700">Processor</span>
                        <span className="font-medium text-gray-900">
                          {phone.processor}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-700">RAM</span>
                        <span className="font-medium text-gray-900">
                          {phone.ram}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-700">Storage</span>
                        <span className="font-medium text-gray-900">
                          {phone.internal_memory}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-700">Operating System</span>
                        <span className="font-medium text-gray-900">
                          {phone.operating_system}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-700">Weight</span>
                        <span className="font-medium text-gray-900">
                          {phone.phone_weight}g
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-4 text-lg font-semibold text-gray-900">
                      Camera & Display
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-700">Screen Size</span>
                        <span className="font-medium text-gray-900">
                          {phone.screen_size}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-700">Display Type</span>
                        <span className="font-medium text-gray-900">
                          {technicalSpecs.display.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-700">Resolution</span>
                        <span className="font-medium text-gray-900">
                          {technicalSpecs.display.resolution}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-700">Front Camera</span>
                        <span className="font-medium text-gray-900">
                          {phone.front_camera}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-700">Back Camera</span>
                        <span className="font-medium text-gray-900">
                          {phone.back_camera}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab
                key="reviews"
                title={
                  <div className="flex items-center space-x-2">
                    <FaStar className="w-4 h-4" />
                    <span>Customer Reviews</span>
                    <Badge
                      content={professionalReviews.length}
                      color="default"
                      size="sm"
                    />
                  </div>
                }
              >
                <div className="mt-8">
                  <div className="flex items-center gap-6 pb-6 mb-8 border-b border-gray-200">
                    <div className="text-center">
                      <div className="mb-1 text-4xl font-bold text-gray-900">
                        {averageRating}
                      </div>
                      <div className="flex items-center justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(averageRating)
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        Based on {professionalReviews.length} reviews
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {professionalReviews.map((review) => (
                      <div
                        key={review.id}
                        className="pb-6 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-start gap-4">
                          <Avatar
                            name={review.user}
                            size="sm"
                            className="text-gray-700 bg-gray-200"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-medium text-gray-900">
                                {review.user}
                              </span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.rating
                                        ? "text-yellow-500"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="leading-relaxed text-gray-700">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Tab>

              <Tab
                key="support"
                title={
                  <div className="flex items-center space-x-2">
                    <FaShield className="w-4 h-4" />
                    <span>Support & Warranty</span>
                  </div>
                }
              >
                <div className="mt-8 space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card className="border border-gray-200 shadow-none">
                      <CardBody className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <FaShield className="text-2xl text-gray-600" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            Warranty Coverage
                          </h3>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• 2 years international warranty</li>
                          <li>• Manufacturing defects coverage</li>
                          <li>• Free repair or replacement</li>
                          <li>• Worldwide service centers</li>
                        </ul>
                      </CardBody>
                    </Card>
                    <Card className="border border-gray-200 shadow-none">
                      <CardBody className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <FaPhone className="text-2xl text-gray-600" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            Customer Support
                          </h3>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• 24/7 technical support</li>
                          <li>• Live chat assistance</li>
                          <li>• Email support within 2 hours</li>
                          <li>• Phone support in multiple languages</li>
                        </ul>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
