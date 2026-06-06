export const leadCapture = {
  enabled: true,
  discountPercent: 10,
  discountCode: "GLOWUP10",
  offerMessage: "Sign up and get 10% OFF your first order!",
  fields: [
    { name: "name", label: "Full Name", required: true },
    { name: "email", label: "Email Address", required: true },
    { name: "phone", label: "Phone Number", required: false },
  ],
  triggerPhrases: [
    "interested in a product",
    "want a discount",
    "newsletter",
    "10% off",
    "best deal",
  ],
};
