"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type FAQ = {
  question: string
  answer: string
}

type FAQCategory = {
  name: string
  faqs: FAQ[]
}

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("shopping")
  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({})

  const toggleFaq = (categoryName: string, index: number) => {
    const key = `${categoryName}-${index}`
    setOpenFaqs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const faqCategories: FAQCategory[] = [
    {
      name: "shopping",
      faqs: [
        {
          question: "How do I place an order?",
          answer:
            "To place an order, browse our products, select the items you want, add them to your cart, and proceed to checkout. You'll need to provide shipping and payment information to complete your purchase.",
        },
        {
          question: "Can I modify or cancel my order?",
          answer:
            "You can modify or cancel your order within 1 hour of placing it. After that, please contact our customer service team for assistance. Orders that have already been shipped cannot be modified or canceled.",
        },
        {
          question: "Do you offer international shipping?",
          answer:
            "Yes, we ship to most countries worldwide. Shipping rates and delivery times vary by location. You can see the shipping options available to your country during checkout.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All transactions are secure and encrypted for your protection.",
        },
        {
          question: "Do you offer gift wrapping?",
          answer:
            "Yes, we offer gift wrapping services for an additional fee. You can select this option during checkout and even include a personalized message for the recipient.",
        },
      ],
    },
    {
      name: "shipping",
      faqs: [
        {
          question: "How long will it take to receive my order?",
          answer:
            "Domestic orders typically arrive within 3-5 business days. International shipping can take 7-14 business days, depending on the destination and customs processing.",
        },
        {
          question: "How can I track my order?",
          answer:
            "Once your order ships, you'll receive a confirmation email with a tracking number. You can use this number to track your package on our website or the carrier's website.",
        },
        {
          question: "Do you ship to P.O. boxes?",
          answer:
            "Yes, we ship to P.O. boxes for standard shipping methods. However, expedited shipping options may require a physical address for delivery.",
        },
        {
          question: "What if my package is lost or damaged?",
          answer:
            "If your package is lost or arrives damaged, please contact our customer service team within 48 hours of the delivery date. We'll work with the shipping carrier to resolve the issue promptly.",
        },
        {
          question: "Are there any additional fees for shipping?",
          answer:
            "Standard shipping fees are calculated at checkout based on your location and order size. Orders over $50 qualify for free standard shipping. Import duties and taxes may apply for international orders.",
        },
      ],
    },
    {
      name: "returns",
      faqs: [
        {
          question: "What is your return policy?",
          answer:
            "We offer a 30-day return policy for most items. Products must be in their original condition with tags attached and original packaging. Some items, such as underwear and personalized products, are not eligible for return.",
        },
        {
          question: "How do I initiate a return?",
          answer:
            "To initiate a return, log into your account, go to your order history, and select the 'Return Item' option. You'll receive a return shipping label and instructions. Alternatively, you can contact our customer service team for assistance.",
        },
        {
          question: "How long does it take to process a refund?",
          answer:
            "Once we receive your return, it takes 3-5 business days to inspect the item and process your refund. The refund will be issued to your original payment method and may take an additional 5-10 business days to appear on your statement.",
        },
        {
          question: "Do you offer exchanges?",
          answer:
            "Yes, we offer exchanges for different sizes or colors of the same item. You can request an exchange through your account or by contacting our customer service team.",
        },
        {
          question: "Who pays for return shipping?",
          answer:
            "Customers are responsible for return shipping costs unless the return is due to our error (wrong item shipped, defective product, etc.). In those cases, we'll provide a prepaid return shipping label.",
        },
      ],
    },
    {
      name: "product",
      faqs: [
        {
          question: "How do I find my size?",
          answer:
            "We provide detailed size guides on each product page. Measure yourself according to the instructions and compare your measurements to our size charts. If you're between sizes, we generally recommend sizing up.",
        },
        {
          question: "Are your products true to size?",
          answer:
            "Our products generally run true to size, but fit can vary by style and material. We recommend checking the specific product reviews and size recommendations on each product page.",
        },
        {
          question: "How do I care for my products?",
          answer:
            "Care instructions are provided on the product page and on the care label of each item. Generally, we recommend washing in cold water and air drying to maintain the quality and longevity of your garments.",
        },
        {
          question: "Are your products ethically made?",
          answer:
            "Yes, we are committed to ethical manufacturing. All our products are made in facilities that adhere to fair labor practices, and we're continuously working to improve our sustainability efforts.",
        },
        {
          question: "Do you offer custom or personalized products?",
          answer:
            "We offer personalization options for select products. Look for the 'Personalize' option on eligible product pages. Custom orders typically take an additional 2-3 business days to process.",
        },
      ],
    },
    {
      name: "account",
      faqs: [
        {
          question: "How do I create an account?",
          answer:
            "You can create an account by clicking the 'Sign Up' link in the top right corner of our website. You'll need to provide your email address and create a password. You can also create an account during checkout.",
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer:
            "Click the 'Forgot Password' link on the login page. Enter your email address, and we'll send you a link to reset your password. The link is valid for 24 hours.",
        },
        {
          question: "How do I update my account information?",
          answer:
            "Log into your account and go to the 'Account Settings' or 'Profile' section. From there, you can update your personal information, shipping addresses, and payment methods.",
        },
        {
          question: "Can I view my order history?",
          answer:
            "Yes, you can view your complete order history by logging into your account and navigating to the 'Order History' section. You can track current orders and review past purchases.",
        },
        {
          question: "How do I subscribe or unsubscribe from emails?",
          answer:
            "You can subscribe to our newsletter during account creation or at checkout. To unsubscribe, click the 'Unsubscribe' link at the bottom of any email we send, or update your communication preferences in your account settings.",
        },
      ],
    },
  ]

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-600 text-center mb-12">
            Find answers to common questions about our products, shipping, returns, and more.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center mb-8 border-b">
            {faqCategories.map((category) => (
              <button
                key={category.name}
                className={`px-4 py-3 text-sm font-medium capitalize ${
                  activeCategory === category.name
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-black"
                }`}
                onClick={() => setActiveCategory(category.name)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* FAQs */}
          <div className="space-y-4">
            {faqCategories
              .find((category) => category.name === activeCategory)
              ?.faqs.map((faq, index) => {
                const isOpen = openFaqs[`${activeCategory}-${index}`] || false

                return (
                  <div key={index} className="border rounded-md overflow-hidden">
                    <button
                      className="w-full flex justify-between items-center p-4 text-left font-medium focus:outline-none"
                      onClick={() => toggleFaq(activeCategory, index)}
                    >
                      {faq.question}
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="p-4 pt-0 border-t">
                            <p className="text-gray-600">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
          </div>

          {/* Contact Section */}
          <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-2">Still have questions?</h2>
            <p className="text-gray-600 mb-4">
              If you couldn't find the answer to your question, please contact our customer support team.
            </p>
            <Link
              href="/contacts"
              className="inline-block bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
