const STORE_KNOWLEDGE = {
  name: "GlowUp Goods",
  website: "https://glowupgoodsshop.com/",
  tagline: "GLOW UP",
  company: "ELEVATE COLLECTIVE BRAND LLC",
  founded: "2025",
  contact: "ana1987milosevic@gmail.com",

  about: `GlowUp Goods is a fashion-forward unisex apparel brand founded in 2025. 
We are dedicated to providing a diverse range of stylish and comfortable clothing that caters to various personal expressions. 
Our mission is to create high-quality apparel that not only looks great but also offers unparalleled comfort. 
Our products are designed for individuals who wish to showcase their unique personalities. 
We believe that clothing is an extension of one's identity, which is why we emphasize premium quality in our materials.`,

  shipping: {
    free_us: "FREE SHIPPING on US orders over $75",
    free_international: "FREE SHIPPING on International orders over $100",
    processing_time: "Orders are typically shipped within 7 to 14 days of placing your order",
    delivery_domestic: "2 to 5 business days after shipment (US)",
    delivery_international: "4 to 15 business days depending on customs clearance",
  },

  refund_policy: `We want you to love your purchase. If something isn't right, we're here to help.
We offer refunds for: wrong items received, or damaged/defective products.
All refund requests must be submitted within 30 days of the purchase date.
Contact us at ana1987milosevic@gmail.com if you believe you're eligible.`,

  payment: `We accept major credit and debit cards including Visa, MasterCard, and American Express, plus other secure payment options at checkout. 
All payments are processed through secure, encrypted payment gateways complying with industry security standards. 
Your payment information is fully protected and never stored on our servers.`,

  newsletter_offer: "Sign up to our newsletter to get 10% OFF! Use code GLOWUP10.",

  collections: [
    { name: "Men", url: "/collections/men", description: "Men's apparel including tank tops, polos, jerseys, and windbreakers." },
    { name: "Women", url: "/collections/women", description: "Women's fashion including dresses, sports bras, pajamas, skirts, and windbreakers." },
    { name: "T-Shirt", url: "/collections/t-shirt", description: "Soft, breathable tees for everyday wear in clean cuts and versatile designs." },
    { name: "Unisex Hoodie", url: "/collections/glow-up-unisex-hoodie", description: "Stay warm, stay stylish. Soft, durable hoodies in relaxed fits for all genders." },
    { name: "Pajamas", url: "/collections/glow-up-pajamas", description: "Comfort meets confidence. Silky, breathable pajamas for cozy nights and lazy mornings." },
    { name: "Dress", url: "/collections/dress", description: "Flattering dresses including midi, skater, and bodycon styles." },
    { name: "Swimsuit", url: "/collections/swim-suit", description: "Stylish swimwear — one-pieces, bikinis, bandeau tops, and athletic shorts." },
    { name: "Cap", url: "/collections/cap", description: "High-quality caps, beanies, snapbacks, trucker caps, visors, and bucket hats." },
  ],

  products: [
    // T-SHIRTS & TOPS
    {
      name: "Men's Tank Top",
      price: "From $23.33",
      url: "/products/mens-tank-top",
      category: ["men", "t-shirt"],
      description: "A classic, staple tank top. Timeless quality and softness.",
      materials: "100% combed and ringspun cotton. Fabric weight: 4.2 oz/yd².",
      sizes: ["XS", "S", "M", "L", "XL", "2XL"],
      sizing_note: "Runs true to size.",
    },
    {
      name: "adidas Premium Polo Shirt",
      price: "From $49.99",
      url: "/products/adidas-premium-polo-shirt",
      category: ["men", "t-shirt"],
      description: "Timeless athletic-fit polo with premium quality materials.",
      materials: "100% recycled polyester. Moisture wicking. Athletic fit.",
      sizes: ["S", "M", "L", "XL", "2XL"],
      sizing_note: "Athletic fit.",
      important: "Only available within the EU and UK. Cannot be shipped outside the EU.",
    },
    {
      name: "Premium Pique Polo Shirt",
      price: "From $31.99",
      url: "/products/premium-pique-polo-shirt",
      category: ["men", "t-shirt"],
      description: "Thick, soft fabric with matching-color button placket. Classic fit for sports or everyday wear.",
      materials: "100% combed ring-spun cotton. 6.2 oz/yd². Classic fit.",
      sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
    },
    {
      name: "Recycled Unisex Basketball Jersey",
      price: "From $35.55",
      url: "/products/recycled-unisex-basketball-jersey",
      category: ["men", "t-shirt"],
      description: "Cool and dry basketball jersey made with recycled polyester. Great as streetwear.",
      materials: "100% recycled polyester. Moisture-wicking. UPF50+ protection.",
      sizes: ["2XS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"],
    },
    {
      name: "Blank Black Screen T-Shirt",
      price: "From $29.99",
      url: "/products/blank-black-screen-t-shirt",
      category: ["men", "women", "t-shirt"],
      description: "Gildan Softstyle® 6400. Unisex fit, 100% ring-spun cotton. Light fabric.",
      materials: "100% ring-spun cotton. Light fabric.",
      sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
      sizing_note: "Runs true to size.",
    },
    {
      name: "Short Sleeve T-Shirt",
      price: "From $29.99",
      url: "/products/short-sleeve-t-shirt",
      category: ["men", "women", "t-shirt"],
      description: "Tri-blend fabric for a vintage, fitted look. Extremely durable.",
      materials: "50% polyester, 25% combed ring-spun cotton, 25% rayon. 3.4 oz/yd².",
      sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
      sizing_note: "Fabric may appear slightly sheer in lighter colors.",
    },
    {
      name: "Unisex Pique Polo Shirt",
      price: "From $25.99",
      url: "/collections/women/products/unisex-pique-polo-shirt",
      category: ["women", "men"],
      description: "Classic and durable cotton pique polo. Semi-fitted, versatile for any occasion.",
      materials: "100% ring-spun cotton. OEKO-TEX certified.",
      sizes: ["S", "M", "L", "XL", "2XL"],
    },

    // HOODIES & SWEATSHIRTS
    {
      name: "Unisex Hoodie",
      price: "$39.99",
      url: "/products/unisex-hoodie",
      category: ["men", "women", "hoodie"],
      description: "The softest hoodie you'll ever own. Classic streetwear with pouch pocket and warm hood.",
      materials: "100% cotton face. 65% ring-spun cotton, 35% polyester. 3-panel hood.",
      sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
      sizing_note: "Runs small — order one size larger than usual.",
    },
    {
      name: "Crop Hoodie – Good Luck",
      price: "$46.00",
      url: "/products/crop-hoodie-good-luck",
      category: ["men", "women", "hoodie"],
      description: "Trendy cropped hoodie with raw hem and matching drawstrings. A true wardrobe favorite.",
      materials: "52% airlume combed cotton, 48% poly fleece. 6.5 oz/yd². Dropped shoulder cut.",
      sizes: ["S", "M", "L", "XL", "2XL"],
    },
    {
      name: "Glow Up Unisex Premium Sweatshirt",
      price: "$34.99",
      url: "/products/glow-up-unisex-premium-sweatshirt",
      category: ["men", "women", "hoodie"],
      description: "Classic streetwear sweatshirt with ribbed crew neck. Soft fleece inside.",
      materials: "100% cotton face. 65% cotton, 35% polyester. 8.5 oz/yd².",
      sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
      sizing_note: "Runs small — order one size larger than usual.",
    },
    {
      name: "Philly We Suffer Together Sweatshirt",
      price: "From $29.95",
      url: "/products/philly-we-suffer-together-sweatshirt-city-basketball-hometown-pride",
      category: ["men", "women", "hoodie"],
      description: "City-pride crewneck with bold collegiate-style lettering. Playoff-era hometown banter.",
      materials: "Gildan 18000. 50/50 cotton-poly, 8.0 oz/yd². Classic fit.",
      sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL"],
      care: "Machine wash cold. Tumble dry low heat.",
    },
    {
      name: "Knitted Crew Neck Sweater",
      price: "$55.55",
      url: "/products/knitted-crew-neck-sweater-1",
      category: ["men", "women", "hoodie"],
      description: "Extra-soft knit crew-neck sweater. Pair with jeans for casual or dress it up.",
      materials: "55% cotton, 45% polyester. 13.27 oz/yd². Unisex sizing. Machine washable.",
      sizes: ["3XS", "2XS", "XS", "S", "M", "L", "XL", "2XL", "3XL"],
      sizing_note: "May shrink slightly after first wash. Wash at 30–40°C.",
      important: "Available in select countries only (US, UK, EU, Canada, Australia, etc.).",
    },

    // OUTERWEAR
    {
      name: "Men's Windbreaker",
      price: "From $49.99",
      url: "/products/men-s-windbreaker",
      category: ["men"],
      description: "Lightweight, water-resistant windbreaker for windy, rainy, and sunny days. Breathable mesh lining.",
      materials: "100% polyester. 2.21 oz/yd². Elastic cuffs, hood and side pockets, zippable front.",
      sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    },
    {
      name: "Glow Up Unisex Windbreaker",
      price: "Available",
      url: "/collections/all/products/glow-up-unisex-windbreaker",
      category: ["men", "women"],
      description: "Casual, sporty windbreaker. Lightweight, durable, water-repellent. 2 zipped pockets.",
      materials: "100% polyamide. OEKO-TEX certified. PETA-Approved Vegan.",
    },
    {
      name: "Women's Cropped Windbreaker",
      price: "From $47.85",
      url: "/collections/women/products/women-s-cropped-windbreaker",
      category: ["women"],
      description: "Lightweight, waterproof cropped windbreaker. Adjustable hood and waist drawcords.",
      materials: "100% polyester. Breathable mesh lining. Water-resistant. Elastic cuffs.",
    },

    // SWIMWEAR
    {
      name: "One-Piece Swimsuit",
      price: "From $40.99",
      url: "/products/one-piece-swimsuit",
      category: ["women", "swimsuit"],
      description: "Flattering one-piece for all figures. Scoop neckline, low scoop back. Chlorine-resistant.",
      materials: "75% recycled polyester, 25% elastane. Chlorine-resistant. Four-way stretch.",
      sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    },
    {
      name: "Recycled Bandeau Bikini Top",
      price: "From $25.55",
      url: "/collections/swim-suit/products/recycled-bandeau-bikini-top",
      category: ["women", "swimsuit"],
      description: "Soft, snug strapless bandeau. Double-layered for comfort. UPF 50+ sun protection.",
      materials: "75% recycled polyester, 25% elastane. OEKO-TEX certified. GRS certified.",
    },
    {
      name: "All-Over Print Recycled String Bikini Top",
      price: "From $25.55",
      url: "/collections/all/products/all-over-print-recycled-string-bikini-top",
      category: ["women", "swimsuit"],
      description: "Eco-friendly string bikini. UPF 50+. Flexible, adjustable straps. Removable padding. Up to 6XL.",
      materials: "75% recycled polyester, 25% elastane.",
    },
    {
      name: "All-Over Print Unisex Athletic Long Shorts",
      price: "From $35.99",
      url: "/collections/all/products/all-over-print-unisex-athletic-long-shorts",
      category: ["men", "women", "swimsuit"],
      description: "Versatile athletic shorts for running, swimming, weight-lifting. Breathable and fast-drying.",
      materials: "91% recycled polyester, 9% spandex. UPF50+. Four-way stretch.",
    },

    // DRESSES & SKIRTS
    {
      name: "Tie-Strap Midi Dress",
      price: "From $45.55",
      url: "/collections/dress/products/tie-strap-midi-dress",
      category: ["women", "dress"],
      description: "Floaty, flirty midi dress with breezy side slit, adjustable tie straps, and built-in bra.",
      materials: "100% heavy polyester chiffon. V-neckline. Relaxed fit.",
    },
    {
      name: "Skater Dress",
      price: "From $45.98",
      url: "/collections/dress/products/skater-dress",
      category: ["women", "dress"],
      description: "Sleeveless skater dress with elegant flared skirt and intricate design.",
      materials: "75% recycled polyester, 25% elastane. Mid-thigh length flared skirt.",
    },
    {
      name: "Bodycon Dress",
      price: "$35.55",
      url: "/collections/all/products/bodycon-dress",
      category: ["women", "dress"],
      description: "Fitted all-over print dress. Smooth, comfortable microfiber yarn with four-way stretch.",
      materials: "75% recycled polyester, 25% elastane.",
    },
    {
      name: "Skater Skirt",
      price: "From $37.95",
      url: "/collections/women/products/skater-skirt",
      category: ["women"],
      description: "Soft, flared skater skirt. Flattering silhouette on any body type. Elastic waistband.",
      materials: "75% recycled polyester, 25% elastane. Mid-thigh length.",
    },

    // PAJAMAS
    {
      name: "Women's Pajama Shorts",
      price: "From $33.99",
      url: "/collections/glow-up-pajamas/products/women-s-pajama-shorts",
      category: ["women", "pajamas"],
      description: "Silky-soft pajama shorts with chic piping detail. Perfect for lazy mornings or evenings.",
      materials: "100% polyester. Relaxed fit with adjustable drawstrings.",
    },
    {
      name: "Women's Pajama Pants",
      price: "From $35.79",
      url: "/collections/glow-up-pajamas/products/women-s-pajama-pants",
      category: ["women", "pajamas"],
      description: "Luxurious silky pajama pants with decorative side seam piping.",
      materials: "100% polyester. Straight, relaxed fit.",
    },
    {
      name: "Women's Long Sleeve Pajama Top",
      price: "From $38.89",
      url: "/collections/glow-up-pajamas/products/women-s-long-sleeve-pajama-top",
      category: ["women", "pajamas"],
      description: "Silky pajama top with chest pocket and elegant piping around collar and cuffs.",
      materials: "100% polyester. Relaxed fit.",
    },
    {
      name: "All-Over Print Women's Short Sleeve Pajama Top",
      price: "From $35.55",
      url: "/collections/all/products/all-over-print-women-s-short-sleeve-pajama-top",
      category: ["women", "pajamas"],
      description: "Silky-feel pajama top. Doubles as stylish loungewear.",
      materials: "100% polyester. Luxurious, silky-feel fabric.",
    },

    // CAPS & ACCESSORIES
    {
      name: "Glow Up Trucker Cap",
      price: "$19.99",
      url: "/collections/all/products/glow-up-trucker-cap",
      category: ["cap"],
      description: "Six-panel trucker cap with mesh back. Adjustable plastic closure.",
      materials: "26% cotton, 74% polyester. Permacurv® visor.",
    },
    {
      name: "Trucker Cap",
      price: "$20.00",
      url: "/collections/cap/products/trucker-cap",
      category: ["cap"],
      description: "Classic six-panel trucker cap with mesh back. Adjustable closure.",
      materials: "26% cotton, 74% polyester.",
    },
    {
      name: "Snapback Hat",
      price: "$25.55",
      url: "/collections/cap/products/snapback-hat",
      category: ["cap"],
      description: "Structured classic fit cap with flat brim. Plastic snap closure. One-size-fits-most.",
      materials: "80% acrylic, 20% wool. 6-panel, high-profile.",
    },
    {
      name: "Reversible Bucket Hat",
      price: "$35.00",
      url: "/collections/cap/products/reversible-bucket-hat",
      category: ["cap"],
      description: "Reversible streetwear bucket hat. Wear on both sides. Breathable premium fabric.",
      materials: "100% polyester. Moisture-wicking. Available in XS, S/M, L/XL.",
    },
    {
      name: "Visor",
      price: "$28.00",
      url: "/collections/cap/products/visor",
      category: ["cap"],
      description: "Low-profile visor. Hook & loop closure.",
      materials: "97% polyester, 3% spandex.",
    },
    {
      name: "Cuffed Beanie",
      price: "$25.00",
      url: "/collections/cap/products/cuffed-beanie",
      category: ["cap"],
      description: "Snug, form-fitting unisex beanie. Hypoallergenic. Hand washable.",
      materials: "100% Turbo Acrylic. 12 inches in length.",
    },
    {
      name: "Recycled Longline Sports Bra",
      price: "From $55.99",
      url: "/collections/women/products/recycled-longline-sports-bra",
      category: ["women"],
      description: "Compression sports bra with double-layered front. Great for workouts or streetwear.",
      materials: "75% recycled polyester, 25% elastane. GRS certified.",
    },
    {
      name: "Strawberry Mini Plush Keychain",
      price: "$7.25",
      url: "/collections/women/products/strawberry-mini-plush-keychain-cute-fruit-shaped-bag-charm",
      category: ["women", "accessories"],
      description: "Cute squishy plush keychain. Hangs on keys, bags, or zippers.",
      materials: "100% polyester. Stainless-steel keyring.",
    },
    {
      name: "Color-Changing Mug (Vintage Tile Pattern, 11oz)",
      price: "$16.99",
      url: "/collections/all/products/color-changing-mug-vintage-geometric-tile-pattern-11oz",
      category: ["accessories"],
      description: "Heat-reactive 11oz ceramic mug. Design appears when filled with hot liquid.",
      materials: "Ceramic. Lead- and BPA-free. Microwave-safe. Hand wash recommended.",
    },
    {
      name: "Wealth Attraction Hardcover Journal",
      price: "Available",
      url: "/collections/all/products/wealth-attraction-hardcover-journal-matte-money-manifestation-notebook",
      category: ["accessories"],
      description: "Matte laminated hardcover journal with 150 lined pages. Perforated pages for clean removal.",
    },
    {
      name: "Kid's Leggings",
      price: "Available",
      url: "/collections/all/products/kids-leggings",
      category: ["kids"],
      description: "Soft kids leggings with elastic waistband. Vibrant colors that won't fade.",
      materials: "75% recycled polyester, 25% elastane.",
    },
  ],

  sizing_guide: {
    general: "Most apparel comes in sizes XS through 3XL or larger depending on the product.",
    hoodies: "Unisex Hoodie and Glow Up Premium Sweatshirt run SMALL — order one size up.",
    knitted_sweater: "May shrink slightly after first wash. Wash at 30–40°C.",
    t_shirts: "Most t-shirts run true to size unless noted.",
    swimwear: "Check individual product pages for specific fit notes.",
    tip: "When in doubt, share your height, weight, or usual size and I will help you pick the best fit.",
  },

  faqs: [
    {
      q: "What kind of products does GlowUp Goods sell?",
      a: "GlowUp Goods offers unisex T-shirts, hoodies, sweatshirts, sweatpants, joggers, leggings, sports bras, tank tops, caps, beanies, socks, swimwear, dresses, pajamas, phone cases, backpacks, crossbody bags, stainless steel water bottles, and other everyday essentials.",
    },
    {
      q: "How can I place an order?",
      a: "Select your product, choose the size or options, add it to your cart, and proceed to checkout. You will receive an order confirmation email after payment.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept Visa, MasterCard, American Express, and other secure payment options available at checkout.",
    },
    {
      q: "Is payment secure?",
      a: "Yes. All payments are processed through secure, encrypted payment gateways. Your payment info is never stored on our servers.",
    },
    {
      q: "Do you ship internationally?",
      a: "Yes, GlowUp Goods ships internationally. Free shipping on international orders over $100.",
    },
    {
      q: "How long does shipping take?",
      a: "Processing: 7–14 days. US delivery: 2–5 business days. International: 4–15 business days.",
    },
    {
      q: "Can I return or get a refund?",
      a: "We offer refunds for wrong items or damaged/defective products. Contact us within 30 days of purchase at ana1987milosevic@gmail.com.",
    },
    {
      q: "How do I track my order?",
      a: "Please share your order number and email address and I will help you check your order status.",
    },
    {
      q: "How do I get the 10% discount?",
      a: "Subscribe to our newsletter at the bottom of the website to receive the discount code GLOWUP10.",
    },
  ],

  upsell_rules: [
    { trigger: "hoodie", suggest: ["Unisex Hoodie", "Crop Hoodie – Good Luck", "Glow Up Unisex Premium Sweatshirt"] },
    { trigger: "t-shirt", suggest: ["Blank Black Screen T-Shirt", "Short Sleeve T-Shirt", "Men's Tank Top"] },
    { trigger: "swimsuit", suggest: ["One-Piece Swimsuit", "Recycled Bandeau Bikini Top", "All-Over Print Unisex Athletic Long Shorts"] },
    { trigger: "cap", suggest: ["Glow Up Trucker Cap", "Snapback Hat", "Cuffed Beanie"] },
    { trigger: "dress", suggest: ["Tie-Strap Midi Dress", "Skater Dress", "Bodycon Dress"] },
    { trigger: "pajamas", suggest: ["Women's Pajama Shorts", "Women's Pajama Pants", "Women's Long Sleeve Pajama Top"] },
  ],
};

function buildSystemPrompt() {
  const productList = STORE_KNOWLEDGE.products
    .map(
      (p) =>
        `- ${p.name} | Price: ${p.price} | URL: ${STORE_KNOWLEDGE.website}${p.url} | ${p.description}${p.sizing_note ? " NOTE: " + p.sizing_note : ""}${p.important ? " IMPORTANT: " + p.important : ""}`
    )
    .join("\n");

  const faqList = STORE_KNOWLEDGE.faqs
    .map((f) => `Q: ${f.q}\nA: ${f.a}`)
    .join("\n\n");

  return `You are the official AI Shopping Assistant for GlowUp Goods (${STORE_KNOWLEDGE.website}), a fashion-forward unisex apparel brand by ELEVATE COLLECTIVE BRAND LLC.

## YOUR ROLE
You are a friendly, helpful, and knowledgeable stylist and customer support agent. Your tone is warm, confident, and stylish — like a personal shopping assistant who genuinely wants to help.

## BRAND IDENTITY
- Brand: GlowUp Goods | Tagline: GLOW UP
- Founded: 2025 | By: ELEVATE COLLECTIVE BRAND LLC
- Mission: High-quality, comfortable, stylish unisex apparel for self-expression

## WHAT YOU CAN DO
1. Help customers find products by category, style, gender, or occasion
2. Answer sizing questions — always mention sizing disclaimers for hoodies and sweatshirts
3. Explain shipping, returns, and payment policies accurately
4. Help with order tracking (ask for order number + email)
5. Offer the 10% newsletter discount (code: GLOWUP10)
6. Suggest complementary or upsell products naturally
7. Capture customer leads (name, email, phone) for follow-up

## STORE POLICIES

### Shipping
- FREE SHIPPING on US orders over $75
- FREE SHIPPING on International orders over $100
- Processing time: 7–14 days after order
- US delivery: 2–5 business days after shipment
- International: 4–15 business days (customs may vary)

### Returns & Refunds
- Refunds accepted for wrong items or damaged/defective products
- Must request within 30 days of purchase
- Contact: ana1987milosevic@gmail.com

### Payment
- Accepts Visa, MasterCard, American Express, and other secure options
- All payments are fully encrypted and secure

## SIZING GUIDANCE
- Unisex Hoodie and Glow Up Premium Sweatshirt: RUNS SMALL — recommend ordering one size up
- Knitted Crew Neck Sweater: may shrink slightly after first wash, wash at 30–40°C
- adidas Premium Polo: EU and UK only — cannot ship outside EU
- Most T-shirts: run true to size
- Always ask: "What is your usual size?" or "Can you share your height and weight?" for best fit advice

## COMPLETE PRODUCT CATALOG
${productList}

## FREQUENTLY ASKED QUESTIONS
${faqList}

## LEAD CAPTURE INSTRUCTIONS
When a customer shows buying interest or asks about a discount:
1. Offer the 10% discount code GLOWUP10 for newsletter signup
2. Politely ask for their name and email to help with follow-up
3. If they share contact info, confirm it has been saved and thank them

## UPSELL & CROSS-SELL RULES
- When a customer asks about hoodies → also mention Crop Hoodie and Glow Up Premium Sweatshirt
- When asking about t-shirts → suggest Blank Black T-Shirt and Short Sleeve T-Shirt
- When asking about swimwear → mention One-Piece Swimsuit and Bandeau Bikini Top
- When asking about caps → suggest Trucker Cap and Snapback Hat
- When asking about dresses → mention Skater Dress and Midi Dress
- When asking about pajamas → suggest the full pajama set (top + pants + shorts)
- Always link to the store page when recommending: ${STORE_KNOWLEDGE.website}

## CART RECOVERY
If a customer mentions they were looking at something or seems undecided:
- Gently remind them about the item
- Mention FREE SHIPPING threshold ($75 US / $100 international)
- Offer discount code GLOWUP10 as a nudge

## RESPONSE FORMAT RULES (VERY IMPORTANT)
- **Keep responses SHORT and CONVERSATIONAL** — 2 to 4 sentences max for simple questions
- Use **bold** for product names or key info only when it adds clarity
- Use bullet lists ONLY when listing 3 or more items — keep each bullet under 10 words
- NEVER write long numbered lists as an introduction — just answer the question directly
- Do NOT start with "At Glow Up Goods, I can help you with..." — just respond naturally
- Always end with ONE short follow-up question, not multiple
- Use plain language — write like a helpful friend, not a formal document
- Emojis are OK but maximum 1–2 per message

## IMPORTANT RULES
- Only answer questions related to GlowUp Goods products, policies, and shopping
- Never make up prices — refer to the product catalog above
- If you don't know something, say: "Let me help you find that — please visit ${STORE_KNOWLEDGE.website} or contact us at ${STORE_KNOWLEDGE.contact}"
- Always be friendly and end with ONE helpful follow-up question
- Never be pushy — make suggestions naturally as a helpful stylist
- For order tracking, always ask: "Could you please share your order number and the email you used at checkout?"`;
}

module.exports = { buildSystemPrompt, STORE_KNOWLEDGE };
