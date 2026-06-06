export const stats = {
  totalLeads: 128,
  newLeadsToday: 14,
  totalConversations: 342,
  activeToday: 27,
  totalOrders: 89,
  pendingOrders: 12,
  conversionRate: "18.4%",
};

export const recentLeads = [
  { id: 1, name: "Sarah Johnson",   email: "sarah.j@email.com",   phone: "+1 555-0101", product: "Unisex Hoodie",        status: "new",      time: "2 min ago" },
  { id: 2, name: "Marcus Lee",      email: "marcus.lee@email.com", phone: "+1 555-0102", product: "Crop Hoodie",          status: "contacted", time: "18 min ago" },
  { id: 3, name: "Priya Sharma",    email: "priya.s@email.com",    phone: "+1 555-0103", product: "One-Piece Swimsuit",   status: "new",      time: "34 min ago" },
  { id: 4, name: "James Carter",    email: "james.c@email.com",    phone: "+1 555-0104", product: "Men's Windbreaker",    status: "converted", time: "1 hr ago" },
  { id: 5, name: "Aisha Patel",     email: "aisha.p@email.com",    phone: "+1 555-0105", product: "Tie-Strap Midi Dress", status: "new",      time: "2 hr ago" },
];

export const leads = [
  { id: 1,  name: "Sarah Johnson",   email: "sarah.j@email.com",    phone: "+1 555-0101", product: "Unisex Hoodie",          status: "new",       date: "Jun 7, 2026" },
  { id: 2,  name: "Marcus Lee",      email: "marcus.lee@email.com",  phone: "+1 555-0102", product: "Crop Hoodie",            status: "contacted", date: "Jun 7, 2026" },
  { id: 3,  name: "Priya Sharma",    email: "priya.s@email.com",     phone: "+1 555-0103", product: "One-Piece Swimsuit",     status: "new",       date: "Jun 7, 2026" },
  { id: 4,  name: "James Carter",    email: "james.c@email.com",     phone: "+1 555-0104", product: "Men's Windbreaker",      status: "converted", date: "Jun 7, 2026" },
  { id: 5,  name: "Aisha Patel",     email: "aisha.p@email.com",     phone: "+1 555-0105", product: "Tie-Strap Midi Dress",   status: "new",       date: "Jun 6, 2026" },
  { id: 6,  name: "Noah Williams",   email: "noah.w@email.com",      phone: "+1 555-0106", product: "Blank Black T-Shirt",    status: "new",       date: "Jun 6, 2026" },
  { id: 7,  name: "Lily Chen",       email: "lily.c@email.com",      phone: "+1 555-0107", product: "Glow Up Sweatshirt",     status: "contacted", date: "Jun 6, 2026" },
  { id: 8,  name: "Ethan Brown",     email: "ethan.b@email.com",     phone: "+1 555-0108", product: "Snapback Hat",           status: "converted", date: "Jun 5, 2026" },
  { id: 9,  name: "Mia Davis",       email: "mia.d@email.com",       phone: "+1 555-0109", product: "Skater Dress",           status: "new",       date: "Jun 5, 2026" },
  { id: 10, name: "Liam Garcia",     email: "liam.g@email.com",      phone: "+1 555-0110", product: "Recycled Basketball Jersey", status: "new",   date: "Jun 5, 2026" },
];

export const conversations = [
  {
    id: 1, name: "Sarah Johnson", email: "sarah.j@email.com",
    preview: "Do you have the hoodie in XL?",
    messages: [
      { role: "assistant", content: "Welcome to Glow Up Goods! How can I help you today? 🛍️" },
      { role: "user",      content: "Hi, I'm looking for a hoodie" },
      { role: "assistant", content: "Great choice! Our **Unisex Hoodie** is $39.99 and comes in S–3XL. Note it runs small — order one size up. Which size are you usually?" },
      { role: "user",      content: "Usually a L, so XL then?" },
      { role: "assistant", content: "Exactly right! XL will fit perfectly. Want me to share the link to add it to cart?" },
    ],
    time: "2 min ago", status: "active",
  },
  {
    id: 2, name: "Marcus Lee", email: "marcus.lee@email.com",
    preview: "What's the return policy?",
    messages: [
      { role: "assistant", content: "Welcome to Glow Up Goods! How can I help you today?" },
      { role: "user",      content: "What's the return policy?" },
      { role: "assistant", content: "We accept refunds for wrong items or damaged products within **30 days** of purchase. Just email us at ana1987milosevic@gmail.com. Can I help with anything else?" },
    ],
    time: "18 min ago", status: "closed",
  },
  {
    id: 3, name: "Priya Sharma", email: "priya.s@email.com",
    preview: "Free shipping on swimwear?",
    messages: [
      { role: "assistant", content: "Welcome to Glow Up Goods!" },
      { role: "user",      content: "Do you offer free shipping on swimwear?" },
      { role: "assistant", content: "Yes! Free shipping on US orders over **$75** and international orders over **$100**. Our One-Piece Swimsuit is $40.99 — just add 2 items and you qualify!" },
    ],
    time: "34 min ago", status: "active",
  },
  {
    id: 4, name: "James Carter", email: "james.c@email.com",
    preview: "Track my order #GU-4821",
    messages: [
      { role: "user",      content: "I want to track my order" },
      { role: "assistant", content: "Sure! Could you share your order number and email?" },
      { role: "user",      content: "Order #GU-4821, james.c@email.com" },
      { role: "assistant", content: "Let me check that for you. Your order was shipped on Jun 4 and is expected by Jun 9. 📦" },
    ],
    time: "1 hr ago", status: "closed",
  },
];

export const orders = [
  { id: "GU-4821", customer: "James Carter",   email: "james.c@email.com",   product: "Men's Windbreaker",        amount: "$49.99", status: "shipped",    date: "Jun 4, 2026" },
  { id: "GU-4820", customer: "Aisha Patel",    email: "aisha.p@email.com",    product: "Tie-Strap Midi Dress",     amount: "$45.55", status: "processing", date: "Jun 5, 2026" },
  { id: "GU-4819", customer: "Ethan Brown",    email: "ethan.b@email.com",    product: "Snapback Hat",             amount: "$25.55", status: "delivered",  date: "Jun 3, 2026" },
  { id: "GU-4818", customer: "Lily Chen",      email: "lily.c@email.com",     product: "Glow Up Sweatshirt",       amount: "$34.99", status: "processing", date: "Jun 5, 2026" },
  { id: "GU-4817", customer: "Noah Williams",  email: "noah.w@email.com",     product: "Blank Black T-Shirt",      amount: "$29.99", status: "shipped",    date: "Jun 4, 2026" },
  { id: "GU-4816", customer: "Sarah Johnson",  email: "sarah.j@email.com",    product: "Unisex Hoodie x2",         amount: "$79.98", status: "pending",    date: "Jun 6, 2026" },
  { id: "GU-4815", customer: "Liam Garcia",    email: "liam.g@email.com",     product: "Basketball Jersey",        amount: "$35.55", status: "delivered",  date: "Jun 2, 2026" },
  { id: "GU-4814", customer: "Mia Davis",      email: "mia.d@email.com",      product: "Skater Dress + Skirt",     amount: "$83.93", status: "shipped",    date: "Jun 4, 2026" },
];
