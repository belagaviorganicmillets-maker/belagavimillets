/**
 * Fresh Millet Ambali — five separate products (one per millet), each sold
 * as two independent size variants. 200ml and 300ml are tracked as
 * separate cart line items (see lib/pricing.js and app.js), so a customer
 * can order both sizes of the same millet in one order.
 *
 * Pricing is centralized once here (not duplicated per item) — both sizes
 * cost the same across all five varieties today. If a variety ever needs
 * its own price, move that item's price out of AMBALI_VARIANTS into its
 * own product entry instead of duplicating ₹39/₹49 five times.
 */
const AMBALI_VARIANTS = [
 { size: "200ml", price: 39, isAmbali: true },
{ size: "300ml", price: 49, isAmbali: true }
];

/**
 * grainImage / ambaliImage: real photography isn't reliably available for
 * these specific botanical varieties from free/stock sources (verified by
 * checking — most "millet" stock photos are mislabeled rice/wheat/corn).
 * These currently point at clearly-labelled placeholder graphics in
 * assets/ambali/ so the card architecture is real-image-ready — swap the
 * files (same filenames) with real photos whenever they're available, no
 * code changes needed.
 */
const AMBALI_PRODUCTS = [
  {
    id: "foxtail",
    name: "Foxtail Millet Ambali",
    kn: "Navane Ambali",
    theme: "gold",
    tag: "Blood sugar friendly",
    grainImage: "assets/ambali/foxtail-grains.jpg",
    ambaliImage: "assets/ambali/foxtail-glass.jpg",
    description: "Made from stone-ground foxtail millet, fermented and simmered the traditional way. Foxtail has a low glycemic index and releases energy slowly, so this is the ambali families reach for when they want a steadier alternative to rice or wheat.",
    benefits: ["Rich in fibre", "Good source of plant protein", "Supports energy and stamina", "Gluten free"],
    available: true
    // FAO composition data: ~11.7g protein, ~6g fibre/100g —
    // https://www.jewelfarmer.com/blogs/superfood-knowledge-hub/foxtail-millet-nutrition-facts-calories-protein-fiber
  },
  {
    id: "barnyard",
    name: "Barnyard Millet Ambali",
    kn: "Oodalu Ambali",
    theme: "teal",
    tag: "Light on the stomach",
    grainImage: "assets/ambali/barnyard-grains.jpg",
    ambaliImage: "assets/ambali/barnyard-glass.jpg",
    description: "The lightest ambali in the range — barnyard millet is high in fibre and easy to digest, which is why it's usually the first one recommended for children, elders, or anyone easing back into food after being unwell.",
    benefits: ["Low glycemic index", "Rich in minerals", "Supports metabolism", "Gluten free"],
    available: true
    // Low GI (41.7-50, dehulled): Ugare et al., J Food Sci Technol, 2011 —
    // https://pmc.ncbi.nlm.nih.gov/articles/PMC3907638/
  },
  {
    id: "little",
    name: "Little Millet Ambali",
    kn: "Saame Ambali",
    theme: "mauve",
    tag: "Iron & antioxidants",
    grainImage: "assets/ambali/little-grains.jpg",
    ambaliImage: "assets/ambali/little-glass.jpg",
    description: "Little millet carries a dependable dose of iron and antioxidants into every glass, brewed fresh each morning — a good everyday pick for anyone who wants a steady top-up.",
    benefits: ["Rich in iron", "Rich in antioxidants", "Supports overall wellness", "Gluten free"],
    available: true
    // Iron content among the higher of the minor millets: ICMR/NIN minor
    // millet composition studies — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10532853/
  },
  {
    id: "kodo",
    name: "Kodo Millet Ambali",
    kn: "Harka Ambali",
    theme: "olive",
    tag: "Keeps you full",
    grainImage: "assets/ambali/kodo-grains.jpg",
    ambaliImage: "assets/ambali/kodo-glass.jpg",
    description: "Kodo millet's high fibre content helps you feel full for longer, making it a wholesome and satisfying choice any time of the day.",
    benefits: ["Rich in fibre", "Good source of plant protein", "Supports digestive wellness", "Gluten free"],
    available: true
    // 9.0g dietary fibre/100g: ICMR Indian Food Composition Tables, 2017
  },
  {
    id: "browntop",
    name: "Browntop Millet Ambali",
    kn: "Korle Ambali",
    theme: "terracotta",
    tag: "Highest in protein",
    grainImage: "assets/ambali/browntop-grains.jpg",
    ambaliImage: "assets/ambali/browntop-glass.jpg",
    description: "The most nutrient-dense of the five, browntop millet ambali is a great choice for sustained energy and balanced nutrition.",
    benefits: ["Rich in fibre", "Good source of minerals", "Nutrient-rich whole grain", "Gluten free"],
    available: true
    // Highest protein/fibre among minor millets studied: Frontiers in
    // Sustainable Food Systems, 2022 — https://www.frontiersin.org/journals/sustainable-food-systems/articles/10.3389/fsufs.2022.974126/full
  }
];

/**
 * Preparation guide — exact steps/quantities as supplied by the owner.
 * Do not alter the quantities or timings.
 */
const PREP_STEPS = [
  { step: 1, title: "Measure", detail: "1 tsp or 5 g of millet powder" },
  { step: 2, title: "Water", detail: "1/2 litre (500 ml) of water" },
  { step: 3, title: "Soak", detail: "Soak for 8 hours" },
  { step: 4, title: "Boil", detail: "Boil for 20 minutes on low flame" },
  { step: 5, title: "Cool", detail: "Leave for 10 minutes to cool" },
  { step: 6, title: "Transfer", detail: "Transfer to a clean mud pot" },
  { step: 7, title: "Ferment", detail: "Cover with a clean cloth, ferment for 8 hours" },
  { step: 8, title: "Enjoy", detail: "Enjoy your healthy millet ambali" }
];
