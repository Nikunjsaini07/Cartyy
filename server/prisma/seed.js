import { Prisma } from "@prisma/client";
import { prisma } from "../src/lib/prisma.js";

const decimal = (value) => new Prisma.Decimal(Number(value).toFixed(2));

function createEmiPlans(price, cashbackBase) {
  const noCostTenures = [3, 6, 9, 12, 18];
  const cashbackMultipliers = { 3: 0.5, 6: 0.7, 9: 0.85, 12: 1, 18: 1.15 };

  const noCostPlans = noCostTenures.map((tenure) => {
    const monthlyAmount = Math.ceil(price / tenure);
    const cashbackAmount =
      Math.round((cashbackBase * cashbackMultipliers[tenure]) / 100) * 100;
    const totalPayable = monthlyAmount * tenure;
    return {
      tenureMonths: tenure,
      monthlyAmount: decimal(monthlyAmount),
      interestRate: decimal(0),
      cashbackAmount: decimal(cashbackAmount),
      totalPayable: decimal(totalPayable),
      effectiveCost: decimal(totalPayable - cashbackAmount),
      isNoCost: true,
      isRecommended: tenure === 12,
    };
  });

  const interestRate = 10.5;
  const tenure = 24;
  const monthlyRate = interestRate / 12 / 100;
  const monthlyAmount = Math.ceil(
    (price * monthlyRate * (1 + monthlyRate) ** tenure) /
      ((1 + monthlyRate) ** tenure - 1),
  );
  const cashbackAmount = Math.round((cashbackBase * 1.35) / 100) * 100;
  const totalPayable = monthlyAmount * tenure;

  return [
    ...noCostPlans,
    {
      tenureMonths: tenure,
      monthlyAmount: decimal(monthlyAmount),
      interestRate: decimal(interestRate),
      cashbackAmount: decimal(cashbackAmount),
      totalPayable: decimal(totalPayable),
      effectiveCost: decimal(totalPayable - cashbackAmount),
      isNoCost: false,
      isRecommended: false,
    },
  ];
}

function buildVariants({
  prefix,
  colours,
  storages,
  baseMrp,
  basePrice,
  imageUrl,
  stock = 12,
  finish,
}) {
  return colours.flatMap((colour, colourIndex) =>
    storages.map((storage, storageIndex) => {
      const priceStep = storageIndex * Math.round(basePrice * 0.12);
      const mrpStep = storageIndex * Math.round(baseMrp * 0.12);
      return {
        sku: `${prefix}-${storage.label.replace(/\s+/g, "")}-${colour.code}`,
        color: colour.name,
        colorHex: colour.hex,
        storage: storage.label,
        finish,
        mrp: baseMrp + mrpStep,
        price: basePrice + priceStep,
        imageUrl: colour.imageUrl ?? imageUrl,
        stock: stock - storageIndex * 2 - colourIndex,
      };
    }),
  );
}

const products = [
  {
    name: "iPhone 17 Pro",
    slug: "iphone-17-pro",
    brand: "Apple",
    description:
      "The pro iPhone with a precision aluminium unibody, powerful camera system and all-day performance.",
    highlights: ["Pro camera system", "ProMotion display", "All-day battery"],
    featured: true,
    variants: buildVariants({
      prefix: "IP17P",
      colours: [
        {
          name: "Cosmic Orange",
          hex: "#C87545",
          code: "ORG",
          imageUrl:
            "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-cosmicorange-202509_AV2?wid=724&hei=540&fmt=p-jpg&qlt=95&.v=NUNzdzNKR0FJbmhKWm5YamRHb05tVmdrMFhaMHcxOUdwN3E1MFVmcEJVQStOWWtDbG9UcVh0bko2OVlSNFRrSUJzS0RYWXBINXM3OEFKMGgwUWg2N2R6aVFvTWJROGFYWFRaQWY2U0drUlhYZzMvbUU5VlZOUzVUa2JpV3ZLZEZkVmxBbDRrSERSOWFmTHhZaDM5UmVR",
        },
        {
          name: "Deep Blue",
          hex: "#263248",
          code: "BLU",
          imageUrl:
            "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-deepblue-202509_AV2?wid=724&hei=540&fmt=jpeg&qlt=90&.v=NUNzdzNKR0FJbmhKWm5YamRHb05tZUV6Rm9QZCtVTmthVDZRTDBVMjU4WHNLaDFpcFc5dW9FRUNrVXE0MVVoRGh2Q29kcWs4WTl5cjdvUC9sdGZWcmRlVUN5anBMYXArdTZxQXVZNFlaRkZRMElzc2c4QzJSTGJwZ0ZIWFMreDJmbW94YnYxc1YvNXZ4emJGL0IxNFp3",
        },
        {
          name: "Silver",
          hex: "#D9D9D6",
          code: "SIL",
          imageUrl:
            "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-17-pro-finish-select-silver-202509_AV2?wid=724&hei=540&fmt=jpeg&qlt=90&.v=NUNzdzNKR0FJbmhKWm5YamRHb05tVGJOdEdsYjE3KzExOGFjT0NXdW5CR0ZuR0xSWXBlNjhaVFk2ZGJNSGE3NEVrYzZ4aGx2Q085bnhRaVROeFdKVDdrNkxqcEdrM2x6OUZ3Z2JnTllhUVBsaDdVbyt6ZHpBMTRqaGk0VVUxTnE",
        },
      ],
      storages: [{ label: "256 GB" }, { label: "512 GB" }],
      baseMrp: 134900,
      basePrice: 127400,
      imageUrl:
        "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-compare-iphone-17-pro-202509?.v=M0dlUVBobHVpY1h1dmlaR3RZekpEMi9sbCsxVVJmYjNiS29STjQrZEV5NnNlL1VpWDFHcHBMQXVUWWdWdkZZNGJPbDJJWDFrVGJEYlIxTitTcHhVWldNTk4rSDJkMy8vL20va2hrM1NheXZ4VldteDRHenNWeThpV3EzUWVVd2o&fmt=png-alpha&hei=512&wid=400",
      finish: "Aluminium unibody",
      stock: 18,
    }),
  },
  {
    name: "Galaxy S25 Ultra",
    slug: "samsung-galaxy-s25-ultra",
    brand: "Samsung",
    description:
      "A titanium flagship built for detailed photography, precise note-taking and effortless multitasking.",
    highlights: ["200 MP camera", "Built-in S Pen", "Titanium frame"],
    featured: true,
    variants: buildVariants({
      prefix: "S25U",
      colours: [
        {
          name: "Titanium Silverblue",
          hex: "#AAB4C0",
          code: "SLB",
          imageUrl:
            "https://images.samsung.com/is/image/samsung/assets/ae/2501/smartphones/galaxy-s25-ultra/specs/163x346_Titanium_Silverblue_P3.jpg?$163_346_PNG$=",
        },
        {
          name: "Titanium Gray",
          hex: "#777A7C",
          code: "GRY",
          imageUrl:
            "https://images.samsung.com/is/image/samsung/assets/ae/2501/smartphones/galaxy-s25-ultra/specs/163x346_Titanium_Gray_P3.jpg?$163_346_PNG$=",
        },
        {
          name: "Titanium Black",
          hex: "#2D2F32",
          code: "BLK",
          imageUrl:
            "https://images.samsung.com/is/image/samsung/assets/ae/2501/smartphones/galaxy-s25-ultra/specs/163x346_Titanium_Black_P3.jpg?$163_346_PNG$=",
        },
        {
          name: "Titanium Whitesilver",
          hex: "#D8D7D1",
          code: "WHS",
          imageUrl:
            "https://images.samsung.com/is/image/samsung/assets/ae/2501/smartphones/galaxy-s25-ultra/specs/163x346_Titanium_Whitesilver_P3.jpg?$163_346_PNG$=",
        },
      ],
      storages: [{ label: "256 GB" }, { label: "512 GB" }],
      baseMrp: 129999,
      basePrice: 119999,
      imageUrl: "https://news.samsung.com/medialibrary/download/59235/small",
      finish: "Titanium",
      stock: 22,
    }),
  },
  {
    name: "Pixel 10 Pro",
    slug: "google-pixel-10-pro",
    brand: "Google",
    description:
      "Google's polished flagship pairs intelligent photography with a clean and helpful Android experience.",
    highlights: [
      "Pro triple camera",
      "Seven years of updates",
      "Bright LTPO display",
    ],
    variants: buildVariants({
      prefix: "PX10P",
      colours: [
        {
          name: "Moonstone",
          hex: "#8993A7",
          code: "MON",
          imageUrl:
            "https://lh3.googleusercontent.com/TQAq9phgtDh9tHxQp6BGvZIXUZBumGaUUFIhcEA3CH6vleYALiPQVtwpbP4kJmlEjyoWC5IADli9IUWFVI_0yEPGHh6upgl_QYM=s1200",
        },
        {
          name: "Jade",
          hex: "#B5C4AA",
          code: "JAD",
          imageUrl:
            "https://lh3.googleusercontent.com/mvEG8eXNc2qv5ajJI1d8TQ8UCfLG9YEtL_sP-mAuQRWLigwHUDgvv8SShiFo41q_0_Drh1wMOgPo5PXrAFDMrrpvuqCn10VFyQ=s1200",
        },
        {
          name: "Porcelain",
          hex: "#E7E2D8",
          code: "POR",
          imageUrl:
            "https://lh3.googleusercontent.com/-BeWXRomXcRYCrUiQmbZPukx1ZIkwo4-pdzWaxpTvLUD-1zK_UcQGLLtkhKjcoMTq_-lE4_SzR89l7NswXQ8lb9dhRuSH-XuK5sj=s1200",
        },
        {
          name: "Obsidian",
          hex: "#2B2C2E",
          code: "OBS",
          imageUrl:
            "https://lh3.googleusercontent.com/j53dCl_x0k2CQAF9RtLwy8JZcsEvGtnRwSzYQAsNwFTZ6HG05sLHssy1Pu69d3Q8xgTDk0JKsVQObnzMY5z_IBWDPr2DkhxCzT0=s1200",
        },
      ],
      storages: [{ label: "256 GB" }, { label: "512 GB" }],
      baseMrp: 109999,
      basePrice: 99999,
      imageUrl:
        "https://lh3.googleusercontent.com/TQAq9phgtDh9tHxQp6BGvZIXUZBumGaUUFIhcEA3CH6vleYALiPQVtwpbP4kJmlEjyoWC5IADli9IUWFVI_0yEPGHh6upgl_QYM=s1200",
      finish: "Satin metal",
      stock: 16,
    }),
  },
  {
    name: "OnePlus 15",
    slug: "oneplus-15",
    brand: "OnePlus",
    description:
      "Fast, fluid and built for long sessions with flagship performance and exceptionally quick charging.",
    highlights: ["120 Hz AMOLED", "100W fast charging", "Flagship performance"],
    variants: buildVariants({
      prefix: "OP15",
      colours: [
        {
          name: "Infinite Black",
          hex: "#202225",
          code: "BLK",
          imageUrl:
            "https://www.oneplus.in/content/dam/oneplus/2025/product-station/15/assets/videos-experience-black-44-1-80a160.png.webp",
        },
        {
          name: "Ultra Violet",
          hex: "#6D5B89",
          code: "VIO",
          imageUrl:
            "https://www.oneplus.in/content/dam/oneplus/2025/product-station/15/assets/videos-experience-purple-44-1-eb49a4.png.webp",
        },
      ],
      storages: [{ label: "256 GB" }, { label: "512 GB" }],
      baseMrp: 74999,
      basePrice: 69999,
      imageUrl:
        "https://www.oneplus.in/content/dam/oneplus/2025/product-station/15/assets/images-kv-mo-phone-1-c46d36.png.webp",
      finish: "Frosted glass",
      stock: 27,
    }),
  },
  {
    name: "Nothing Phone (3)",
    slug: "nothing-phone-3",
    brand: "Nothing",
    description:
      "A distinctive flagship with a considered transparent design, clean software and tactile controls.",
    highlights: ["Glyph Matrix", "Clean Nothing OS", "50 MP camera system"],
    variants: buildVariants({
      prefix: "NP3",
      colours: [
        {
          name: "White",
          hex: "#ECECE9",
          code: "WHT",
          imageUrl:
            "https://cdn.shopify.com/s/files/1/0586/3270/0077/files/0000s_0011_Phone-3-white.png?v=1753757325",
        },
        {
          name: "Black",
          hex: "#242526",
          code: "BLK",
          imageUrl:
            "https://cdn.shopify.com/s/files/1/0586/3270/0077/files/0000s_0012_Phone-3-black.png?v=1753757353",
        },
      ],
      storages: [{ label: "256 GB" }, { label: "512 GB" }],
      baseMrp: 79999,
      basePrice: 74999,
      imageUrl:
        "https://cdn.shopify.com/s/files/1/0376/5420/0459/files/0000s_0011_Phone-3-white.png?v=1753434595",
      finish: "Textured glass",
      stock: 19,
    }),
  },
  {
    name: "X300 Ultra",
    slug: "vivo-x300-ultra",
    brand: "vivo",
    description:
      "vivo's camera-first flagship combines three ZEISS prime cameras, sustained performance and a large all-day battery.",
    highlights: [
      "ZEISS triple camera",
      "Snapdragon 8 Elite Gen 5",
      "6600 mAh battery",
    ],
    variants: buildVariants({
      prefix: "VIX3U",
      colours: [
        {
          name: "Victory Green",
          hex: "#56685D",
          code: "GRN",
          imageUrl:
            "https://exstatic-in.vivo.com/Oz84QB3Wo0uns8j1/in/1777877357131/398e0d1586a2789bafdb85d7c51af016.png.webp",
        },
        {
          name: "Eclipse Black",
          hex: "#242524",
          code: "BLK",
          imageUrl:
            "https://exstatic-in.vivo.com/Oz84QB3Wo0uns8j1/in/1777877311967/5700b7b3f3b4c6b8e1ba77dd6ea08e4c.png.webp",
        },
      ],
      storages: [{ label: "512 GB" }, { label: "1 TB" }],
      baseMrp: 199999,
      basePrice: 159999,
      imageUrl:
        "https://exstatic-in.vivo.com/Oz84QB3Wo0uns8j1/in/1777877357131/398e0d1586a2789bafdb85d7c51af016.png.webp",
      finish: "Glass and aluminium",
      stock: 10,
    }),
  },
];

async function main() {
  const managedSlugs = [
    ...products.map((product) => product.slug),
    "motorola-razr-60-ultra",
    "vivo-x200-pro",
  ];
  const createProduct = (product) =>
    prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        description: product.description,
        highlights: product.highlights,
        isFeatured: product.featured ?? false,
        variants: {
          create: product.variants.map((variant, index) => ({
            sku: variant.sku,
            color: variant.color,
            colorHex: variant.colorHex,
            storage: variant.storage,
            finish: variant.finish,
            mrp: decimal(variant.mrp),
            sellingPrice: decimal(variant.price),
            imageUrl: variant.imageUrl,
            stock: variant.stock,
            isDefault: index === 0,
            emiPlans: {
              create: createEmiPlans(
                variant.price,
                Math.max(2500, Math.round(variant.price * 0.055)),
              ),
            },
          })),
        },
      },
    });

  await prisma.$transaction([
    prisma.product.deleteMany({ where: { slug: { in: managedSlugs } } }),
    ...products.map(createProduct),
  ]);

  console.log(
    `Seeded ${await prisma.product.count()} products, ${await prisma.productVariant.count()} variants and ${await prisma.emiPlan.count()} EMI plans.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
