"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Input,
  Button,
  Switch,
  Spinner,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import { FaArrowLeft, FaSave, FaLock, FaBell, FaUser, FaMoon } from "react-icons/fa";
import axios from "axios";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    notifications: true,
    twoFactorAuth: false,
    theme: "light",
  });

  useEffect(() => {
    axios.get("/api/user").then((res) => {
      const user = res.data.user;
      setUserData(user);
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
        password: "",
        confirmPassword: "",
        notifications: user?.settings?.notifications ?? true,
        twoFactorAuth: user?.settings?.twoFA ?? false,
        theme: user?.settings?.theme || "light",
      });
    }).finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: Replace with actual PUT/PATCH API logic
    console.log("Saving settings:", formData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" color="default" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-md">
          <CardHeader className="flex items-center justify-between p-4">
            <Button
              variant="light"
              color="default"
              startContent={<FaArrowLeft />}
              onPress={() => window.history.back()}
            >
              Back
            </Button>
            <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
          </CardHeader>

          <Divider />

          <CardBody className="p-6 space-y-8">

            {/* Security */}
            <section>
              <div className="flex items-center gap-2 mb-4 font-semibold text-gray-600">
                <FaLock /> Security
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="New Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-medium text-gray-700">
                  Enable Two-Factor Authentication (2FA)
                </span>
                <Switch
                  isSelected={formData.twoFactorAuth}
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, twoFactorAuth: val }))
                  }
                />
              </div>
            </section>

            <Divider />

            {/* Preferences */}
            <section>
              <div className="flex items-center gap-2 mb-4 font-semibold text-gray-600">
                <FaBell /> Preferences
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Receive Email Notifications
                  </span>
                  <Switch
                    isSelected={formData.notifications}
                    onValueChange={(val) =>
                      setFormData((prev) => ({ ...prev, notifications: val }))
                    }
                  />
                </div>
                
              </div>
            </section>

            <Divider />

            {/* Save */}
            <div className="text-right">
              <Button
                color="primary"
                startContent={<FaSave />}
                onPress={handleSave}
              >
                Save All Changes
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
