/**
 * Millet Powder products (shelf-stable, sold by the packet).
 *
 * Every card on the "Our Millet Powders" section is rendered from this
 * array — do not hardcode product name/price/benefits anywhere else.
 *
 * `availability` drives both the card badge and whether Add to Cart is
 * enabled — one field, no per-card special-casing:
 *   "available"    → orderable as normal
 *   "coming-soon"  → visible (image, info, price) but not orderable;
 *                    card shows "Coming Soon" and the button is disabled
 *   "sold-out"     → visible but temporarily out of stock today
 *
 * Powders are currently "coming-soon" per the owner's instruction — flip
 * to "available" here (nowhere else) once ready to sell them.
 *
 * Benefit wording is kept conservative and general (no disease-cure or
 * disease-treatment claims), per general nutrition-labelling practice.
 * Where a specific figure is used, the source is noted in a comment —
 * update these if the owner has lab-tested figures for their own batches.
 */
const PRODUCTS = [
  {
    id: "foxtail-millet-powder",
    name: "Foxtail Millet Powder",
    category: "Millet Powder",
    kn: "Navane",
    theme: "gold",
    image: "assets/products/foxtail-millet-powder.png",
    description: "Stone-ground foxtail millet, milled the traditional way for everyday cooking.",
    benefits: [
      "Rich in fibre",
      "Good source of plant protein",
      "Supports energy and stamina",
      "Gluten free"
    ],
    packSize: "50 g",
    price: 29,
    shelfLife: "3 months",
    availability: "coming-soon"
    // General millet fibre/protein figures: Smart Food (ICRISAT-affiliated) —
    // https://www.smartfood.org/project/the-glycemic-index-and-load-of-millets-can-a-person-with-diabetes-eat-millets/
  },
  {
    id: "barnyard-millet-powder",
    name: "Barnyard Millet Powder",
    category: "Millet Powder",
    kn: "Oodalu",
    theme: "teal",
    image: "assets/products/barnyard-millet-powder.png",
    description: "A light, easy-to-digest millet, ground fresh into a fine cooking powder.",
    benefits: [
      "Low glycemic index",
      "Rich in minerals",
      "Supports metabolism",
      "Gluten free"
    ],
    packSize: "50 g",
    price: 29,
    shelfLife: "3 months",
    availability: "coming-soon"
    // Low glycemic index (GI ~41.7–50, dehulled): Ugare et al., J Food Sci
    // Technol, 2011 — https://pmc.ncbi.nlm.nih.gov/articles/PMC3907638/
  },
  {
    id: "little-millet-powder",
    name: "Little Millet Powder",
    category: "Millet Powder",
    kn: "Saame",
    theme: "mauve",
    image: "assets/products/little-millet-powder.png",
    description: "A small-grained millet known for its iron content, ground into a fine powder.",
    benefits: [
      "Rich in iron",
      "Rich in antioxidants",
      "Supports overall wellness",
      "Gluten free"
    ],
    packSize: "50 g",
    price: 29,
    shelfLife: "3 months",
    availability: "coming-soon"
    // Iron content among the higher of the minor millets: ICMR/NIN minor
    // millet composition studies — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10532853/
  },
  {
    id: "kodo-millet-powder",
    name: "Kodo Millet Powder",
    category: "Millet Powder",
    kn: "Harka",
    theme: "olive",
    image: "assets/products/kodo-millet-powder.png",
    description: "A fibre-rich millet with a mild, neutral flavour, ground fresh for daily use.",
    benefits: [
      "Rich in fibre",
      "Good source of plant protein",
      "Supports digestive wellness",
      "Gluten free"
    ],
    packSize: "50 g",
    price: 29,
    shelfLife: "3 months",
    availability: "coming-soon"
    // 9.0 g dietary fibre / 100 g: ICMR Indian Food Composition Tables, 2017
  },
  {
    id: "browntop-millet-powder",
    name: "Browntop Millet Powder",
    category: "Millet Powder",
    kn: "Korle",
    theme: "terracotta",
    image: "assets/products/browntop-millet-powder.png",
    description: "The most nutrient-dense of the five, stone-ground into a fine cooking powder.",
    benefits: [
      "Rich in fibre",
      "Good source of minerals",
      "Nutrient-rich whole grain",
      "Gluten free"
    ],
    packSize: "50 g",
    price: 29,
    shelfLife: "3 months",
    availability: "coming-soon"
    // Highest protein/fibre among minor millets studied: Frontiers in
    // Sustainable Food Systems, 2022 — https://www.frontiersin.org/journals/sustainable-food-systems/articles/10.3389/fsufs.2022.974126/full
  }
];

/**
 * 5 Millet Combo Pack — one packet containing all five varieties.
 * Kept as a separate object (not just another PRODUCTS entry) because it
 * has its own contents list and a different card treatment.
 */
const COMBO_PRODUCT = {
  id: "five-millet-combo-pack",
  name: "5 Millet Combo Pack",
  category: "Combo Pack",
  theme: "combo",
  image: "assets/products/five-millet-combo-pack.png",
  description: "Explore all five millet varieties in one pack.",
  badge: "5 Varieties · One Pack",
  includedProducts: [
    { name: "Foxtail Millet Powder", size: "50 g" },
    { name: "Barnyard Millet Powder", size: "50 g" },
    { name: "Little Millet Powder", size: "50 g" },
    { name: "Kodo Millet Powder", size: "50 g" },
    { name: "Browntop Millet Powder", size: "50 g" }
  ],
  packSize: "250 g",
  price: 130,
  shelfLife: "3 months",
  availability: "coming-soon"
};
