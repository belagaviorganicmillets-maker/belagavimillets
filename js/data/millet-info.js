/**
 * "Know Your Five Millets" — educational content, separate from the
 * commercial product data (products.js / ambali.js) since this section
 * exists to inform, not to sell a specific pack size or price.
 *
 * Wording is deliberately conservative — no disease-cure or
 * disease-treatment claims. Source noted per item for maintainability;
 * update the wording (not just the source link) if a claim changes.
 */

const MILLET_INFO = [
  {
    id: "foxtail",
    name: "Foxtail Millet",
    kn: "Navane",
    theme: "gold",

    // Grain image used in "Know Your Millets"
    grainImage: "assets/ambali/foxtail-grains.jpg",

    intro: "One of India's oldest cultivated grains, with a mild, slightly nutty flavour.",

    points: [
      "Good source of plant protein",
      "Contains dietary fibre",
      "Naturally gluten free",
      "Low glycemic index"
    ]

    // FAO: ~11.7g protein, ~6g fibre/100g
    // https://www.jewelfarmer.com/blogs/superfood-knowledge-hub/foxtail-millet-nutrition-facts-calories-protein-fiber
  },

  {
    id: "barnyard",
    name: "Barnyard Millet",
    kn: "Oodalu",
    theme: "teal",

    // Grain image used in "Know Your Millets"
    grainImage: "assets/ambali/barnyard-grains.jpg",

    intro: "A light, easy-to-digest grain often the first millet introduced to children or elders.",

    points: [
      "Low glycemic index",
      "Contains dietary minerals",
      "Naturally gluten free",
      "High in dietary fibre"
    ]

    // GI ~41.7-50 (dehulled):
    // Ugare et al., J Food Sci Technol, 2011
    // https://pmc.ncbi.nlm.nih.gov/articles/PMC3907638/
  },

  {
    id: "little",
    name: "Little Millet",
    kn: "Saame",
    theme: "mauve",

    // Grain image used in "Know Your Millets"
    grainImage: "assets/ambali/little-grains.jpg",

    intro: "A small-grained millet valued for its iron content and quick cooking time.",

    points: [
      "Contains iron",
      "Source of antioxidants",
      "Naturally gluten free",
      "Supports a balanced diet"
    ]

    // Iron among the higher of minor millets studied:
    // https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10532853/
  },

  {
    id: "kodo",
    name: "Kodo Millet",
    kn: "Harka",
    theme: "olive",

    // Grain image used in "Know Your Millets"
    grainImage: "assets/ambali/kodo-grains.jpg",

    intro: "A fibre-rich millet with a mild, neutral flavour that cooks similarly to rice.",

    points: [
      "High in dietary fibre",
      "Good source of plant protein",
      "Naturally gluten free",
      "Supports digestive wellness"
    ]

    // 9.0g dietary fibre/100g:
    // ICMR Indian Food Composition Tables, 2017
  },

  {
    id: "browntop",
    name: "Browntop Millet",
    kn: "Korle",
    theme: "terracotta",

    // Grain image used in "Know Your Millets"
    grainImage: "assets/ambali/browntop-grains.jpg",

    intro: "A rarer, nutrient-dense millet grown mainly on marginal dryland farms.",

    points: [
      "High in dietary fibre",
      "Good source of plant protein",
      "Contains dietary minerals",
      "Naturally gluten free"
    ]

    // Highest protein/fibre among minor millets studied:
    // https://www.frontiersin.org/journals/sustainable-food-systems/articles/10.3389/fsufs.2022.974126/full
  }
];