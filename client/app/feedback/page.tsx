"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Textarea,
  Accordion,
  AccordionItem,
  Spinner,
} from "@heroui/react";
import { FaArrowLeft, FaPaperPlane, FaQuestionCircle } from "react-icons/fa";

export default function HelpFeedbackPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      console.log("Feedback submitted:", form);
      setLoading(false);
      setSubmitted(true);
    }, 1200); // Simulated request
  };

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
            <h2 className="text-xl font-bold text-gray-900">Help & Feedback</h2>
          </CardHeader>

          <CardBody className="p-6 space-y-8">
            {/* FAQs */}
            <section>
              <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-700">
                <FaQuestionCircle /> Frequently Asked Questions
              </h3>
              <Accordion defaultExpandedKeys={["1"]} selectionMode="multiple">
                <AccordionItem key="1" title="How can I track my order?">
                  You can track your order from your order history page where we provide real-time status updates.
                </AccordionItem>
                <AccordionItem key="2" title="How do I return a product?">
                  To initiate a return, go to the orders section, click on the order, and follow the return instructions.
                </AccordionItem>
                <AccordionItem key="3" title="How can I change my password?">
                  Visit the Settings page and use the password change section under Security.
                </AccordionItem>
              </Accordion>
            </section>

            {/* Contact Support Form */}
            <section>
              <h3 className="mb-4 text-lg font-semibold text-gray-700">Need more help?</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Your Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <Textarea
                label="Your Message"
                name="message"
                value={form.message}
                onChange={handleChange}
                minRows={4}
                className="mt-4"
              />
              <div className="mt-4 text-right">
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isDisabled={loading || !form.name || !form.email || !form.message}
                  startContent={loading ? <Spinner size="sm" /> : <FaPaperPlane />}
                >
                  {loading ? "Sending..." : submitted ? "Sent" : "Send Feedback"}
                </Button>
              </div>
              {submitted && (
                <p className="mt-3 text-sm font-medium text-green-600">
                  Thank you! Your feedback has been submitted.
                </p>
              )}
            </section>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
