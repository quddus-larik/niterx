"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Button,
  Divider,
  Switch,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  addToast,
} from "@heroui/react";
import { FaArrowLeft } from "react-icons/fa";
import { Icon } from "@iconify/react";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState("");
  const [cell, setCell] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/user");
      setUserData(response.data);
    } catch (error) {
      addToast({ title: "Failed to load profile", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEditOpen = () => {
    if (userData?.user?.database) {
      setName(userData.user.database.username || "");
      setCell(userData.user.database.cell || "");
      setAddress(userData.user.database.address || "");
      setZip(userData.user.database.zip || "");
      setCity(userData.user.database.city || "");
    }
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    if (!userData?.user?.email) return;
    setSaving(true);
    try {
      const response = await axios.post("/api/user/update", {
        email: userData.user.email,
        username: name,
        cell,
        address,
        zip,
        city,
      });

      if (!response.data.error) {
        addToast({ title: "Profile updated!", color: "success" });
        setIsEditOpen(false);
        fetchUserData();
      } else {
        addToast({
          title: response.data.message || "Failed to update",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: error.response?.data?.message || "Server error",
        color: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-background text-foreground">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="shadow-lg rounded-xl">
          <CardHeader className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <Button
              variant="flat"
              color="primary"
              startContent={<FaArrowLeft />}
              onPress={() => window.history.back()}
              className="font-semibold"
            >
              Back to Shop
            </Button>
            <Button
              color="primary"
              endContent={<Icon icon="lucide:edit" />}
              onPress={handleEditOpen}
              className="font-semibold"
            >
              Edit Profile
            </Button>
          </CardHeader>
          <Divider className="bg-gray-200" />
          <CardBody className="p-6 space-y-8">
            {loading ? (
              <div className="flex justify-center py-10">
                <Spinner size="lg" color="primary" />
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-10">
                  <Avatar
                    src={userData?.user?.image}
                    fallback={<Icon icon="lucide:user" className="w-full h-full text-gray-400" />}
                    className="shadow-lg w-28 h-28 text-large ring-3 ring-primary-500"
                    isBordered
                  />
                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <h1 className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900 md:justify-start">
                      {userData?.user?.database?.username ||
                        userData?.user?.name ||
                        "N/A"}
                    </h1>
                    <p className="flex items-center justify-center gap-2 text-lg text-gray-600 md:justify-start">
                      <Icon icon="lucide:mail" className="text-gray-500" />
                      {userData?.user?.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 px-4 py-2 rounded-lg gap-y-6 gap-x-8 sm:grid-cols-2 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Icon icon="lucide:phone" className="text-xl text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-base font-semibold text-gray-800">
                        {userData?.user?.database?.cell ||
                          "+92 ●●●● ●●●●●●"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Icon
                      icon="lucide:map-pin"
                      className="text-xl text-primary-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-base font-semibold text-gray-800">
                        {userData?.user?.database?.address || "Not added"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Icon
                      icon="lucide:move-horizontal"
                      className="text-xl text-primary-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-500">ZIP Code</p>
                      <p className="text-base font-semibold text-gray-800">
                        {userData?.user?.database?.zip || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Icon
                      icon="lucide:building"
                      className="text-xl text-primary-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-500">City</p>
                      <p className="text-base font-semibold text-gray-800">
                        {userData?.user?.database?.city || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardBody>
        </Card>

        <Card className="shadow-lg rounded-xl">
          <CardHeader className="p-6">
            <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
          </CardHeader>
          <Divider className="bg-gray-200" />
          <CardBody className="px-6 py-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Icon icon="lucide:bell" className="text-2xl text-primary-600" />
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    Email Notifications
                  </p>
                  <p className="text-sm text-gray-600">
                    Receive updates & offers from us
                  </p>
                </div>
              </div>
              <Switch defaultSelected color="primary" size="lg" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Icon icon="lucide:shield" className="text-2xl text-primary-600" />
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-gray-600">
                    Add extra security to your account
                  </p>
                </div>
              </div>
              <Switch color="primary" size="lg" />
            </div>
          </CardBody>
        </Card>
      </div>

      <Modal isOpen={isEditOpen} onOpenChange={setIsEditOpen} placement="center">
        <ModalContent>
          <ModalHeader className="text-xl font-bold text-gray-900">
            Edit Profile
          </ModalHeader>
          <ModalBody className="px-6 py-4 space-y-6">
            <Input
              label="Full Name"
              labelPlacement="outside"
              placeholder="Enter your name"
              value={name}
              onValueChange={setName}
              fullWidth
              variant="bordered"
              size="md"
            />
            <Input
              label="Phone Number"
              labelPlacement="outside"
              placeholder="+92 XXXX XXXXXXX"
              value={cell}
              onValueChange={setCell}
              fullWidth
              variant="bordered"
              size="md"
            />
            <Input
              label="Address"
              labelPlacement="outside"
              placeholder="e.g., 123 Main St, Anytown"
              value={address}
              onValueChange={setAddress}
              fullWidth
              variant="bordered"
              size="md"
            />
            <Input
              label="ZIP Code"
              labelPlacement="outside"
              placeholder="e.g., 12345"
              value={zip}
              onValueChange={setZip}
              fullWidth
              variant="bordered"
              size="md"
            />
            <Input
              label="City"
              labelPlacement="outside"
              placeholder="e.g., New York"
              value={city}
              onValueChange={setCity}
              fullWidth
              variant="bordered"
              size="md"
            />
          </ModalBody>
          <ModalFooter className="flex justify-end gap-3 px-6 py-4">
            <Button
              variant="light"
              onPress={() => setIsEditOpen(false)}
              isDisabled={saving}
              className="font-semibold"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleSave}
              isLoading={saving}
              className="font-semibold"
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}