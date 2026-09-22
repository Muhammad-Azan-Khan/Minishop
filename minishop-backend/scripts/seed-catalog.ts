import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Category } from '../src/entities/category.entity';
import { Product } from '../src/entities/product.entity';

interface CatalogCategory {
  name: string;
  description: string;
  products: Array<{
    name: string;
    description: string;
    price: number;
    stock: number;
  }>;
}

const catalog: CatalogCategory[] = [
  {
    name: 'Electronics',
    description: 'Useful everyday technology and personal electronics.',
    products: [
      { name: 'Wireless Headphones', description: 'Comfortable over-ear headphones with clear sound and long battery life.', price: 8499, stock: 24 },
      { name: 'Portable Bluetooth Speaker', description: 'Compact wireless speaker with rich audio and splash resistance.', price: 4999, stock: 31 },
      { name: 'Fast-Charge Power Bank', description: 'A 10,000 mAh portable charger with dual USB outputs.', price: 3799, stock: 40 },
      { name: 'Fitness Smart Watch', description: 'Tracks daily activity, heart rate, sleep, and phone notifications.', price: 6999, stock: 18 },
      { name: 'Wireless Keyboard', description: 'Slim full-size keyboard designed for quiet, comfortable typing.', price: 3299, stock: 26 },
      { name: 'Full HD Webcam', description: '1080p webcam with a built-in microphone for calls and streaming.', price: 4599, stock: 20 },
    ],
  },
  {
    name: 'Home & Kitchen',
    description: 'Practical essentials that make daily life at home easier.',
    products: [
      { name: 'Digital Air Fryer', description: 'A compact air fryer with adjustable temperature and timer controls.', price: 18999, stock: 12 },
      { name: 'Electric Kettle', description: 'Fast-boiling stainless steel kettle with automatic shutoff.', price: 4299, stock: 28 },
      { name: 'Food Storage Set', description: 'Ten airtight containers for organizing pantry staples and leftovers.', price: 2999, stock: 35 },
      { name: 'Bedside Table Lamp', description: 'Warm LED lamp with three brightness settings and touch controls.', price: 3599, stock: 22 },
      { name: 'Cotton Throw Blanket', description: 'Soft woven throw suitable for sofas, reading chairs, and beds.', price: 4499, stock: 17 },
      { name: 'Kitchen Knife Set', description: 'Five stainless steel kitchen knives with a storage block.', price: 5799, stock: 15 },
    ],
  },
  {
    name: 'Fashion Accessories',
    description: 'Versatile accessories for work, travel, and everyday style.',
    products: [
      { name: 'Everyday Canvas Backpack', description: 'A durable backpack with a padded laptop sleeve and bottle pockets.', price: 3999, stock: 30 },
      { name: 'Classic Leather Wallet', description: 'A slim bi-fold wallet with six card slots and a cash compartment.', price: 2499, stock: 42 },
      { name: 'Polarized Sunglasses', description: 'Lightweight sunglasses with UV400 polarized lenses.', price: 2999, stock: 33 },
      { name: 'Reversible Casual Belt', description: 'A two-color adjustable belt with a rotating metal buckle.', price: 1999, stock: 27 },
      { name: 'Cotton Baseball Cap', description: 'A breathable six-panel cap with an adjustable back strap.', price: 1499, stock: 38 },
      { name: 'Structured Tote Bag', description: 'A roomy everyday tote with secure zip closure and inner pockets.', price: 3499, stock: 21 },
    ],
  },
  {
    name: 'Beauty & Personal Care',
    description: 'Daily skincare, grooming, and self-care essentials.',
    products: [
      { name: 'Gentle Face Cleanser', description: 'A fragrance-free daily cleanser suitable for all skin types.', price: 1599, stock: 45 },
      { name: 'Hydrating Moisturizer', description: 'Lightweight face moisturizer with hyaluronic acid and ceramides.', price: 2199, stock: 39 },
      { name: 'SPF 50 Sunscreen', description: 'Non-greasy broad-spectrum sun protection for daily use.', price: 1899, stock: 50 },
      { name: 'Repairing Shampoo', description: 'A nourishing shampoo formulated for dry and damaged hair.', price: 1399, stock: 36 },
      { name: 'Cordless Beard Trimmer', description: 'Rechargeable precision trimmer with multiple length settings.', price: 4999, stock: 19 },
      { name: 'Everyday Eau de Parfum', description: 'A balanced citrus and woody fragrance in a 50 ml bottle.', price: 5499, stock: 16 },
    ],
  },
  {
    name: 'Sports & Fitness',
    description: 'Equipment and accessories for training, movement, and recovery.',
    products: [
      { name: 'Non-Slip Yoga Mat', description: 'Cushioned exercise mat with a textured, non-slip surface.', price: 2999, stock: 32 },
      { name: 'Resistance Band Set', description: 'Five resistance levels with handles, anchors, and a carry pouch.', price: 2499, stock: 44 },
      { name: 'Adjustable Dumbbell Pair', description: 'Space-saving adjustable weights for strength training at home.', price: 13999, stock: 10 },
      { name: 'Insulated Sports Bottle', description: 'A stainless steel bottle that keeps drinks cold for hours.', price: 2299, stock: 41 },
      { name: 'Speed Jump Rope', description: 'An adjustable lightweight rope for cardio and conditioning.', price: 1199, stock: 48 },
      { name: 'Training Duffel Bag', description: 'A water-resistant gym bag with shoe and wet-item compartments.', price: 4199, stock: 23 },
    ],
  },
  {
    name: 'Books & Stationery',
    description: 'Thoughtful tools for reading, writing, planning, and creating.',
    products: [
      { name: 'Undated Weekly Planner', description: 'A flexible twelve-month planner with goals and habit trackers.', price: 1699, stock: 34 },
      { name: 'Hardcover Journal', description: 'A ruled A5 notebook with premium paper and an elastic closure.', price: 1299, stock: 55 },
      { name: 'Fine-Liner Pen Set', description: 'Twelve smooth-writing pens for notes, lettering, and illustration.', price: 1499, stock: 46 },
      { name: 'Wooden Desk Organizer', description: 'A compact organizer for pens, notes, cards, and small devices.', price: 2399, stock: 25 },
      { name: 'Artist Sketchbook', description: 'A spiral-bound sketchbook with heavyweight acid-free pages.', price: 1899, stock: 37 },
      { name: 'Rechargeable Book Light', description: 'A clip-on reading light with adjustable color and brightness.', price: 1799, stock: 29 },
    ],
  },
  {
    name: 'Toys & Games',
    description: 'Creative, educational, and social play for children and families.',
    products: [
      { name: 'Wooden Building Blocks', description: 'A colorful 60-piece block set for open-ended creative play.', price: 2799, stock: 26 },
      { name: 'World Map Puzzle', description: 'A 500-piece illustrated geography puzzle for family game night.', price: 1999, stock: 30 },
      { name: 'Remote Control Car', description: 'A rechargeable all-terrain toy car with responsive controls.', price: 5999, stock: 14 },
      { name: 'Family Strategy Game', description: 'An easy-to-learn board game for two to six players.', price: 3499, stock: 20 },
      { name: 'Kids Art Supply Kit', description: 'A portable case filled with crayons, pencils, paints, and paper.', price: 2999, stock: 24 },
      { name: 'Soft Plush Bear', description: 'A washable, child-friendly plush companion with embroidered details.', price: 2199, stock: 35 },
    ],
  },
  {
    name: 'Travel & Outdoors',
    description: 'Reliable gear for commuting, day trips, and outdoor adventures.',
    products: [
      { name: 'Compact Travel Pillow', description: 'Memory foam neck support with a washable travel pouch.', price: 2499, stock: 33 },
      { name: 'Packing Cube Set', description: 'Six lightweight organizers for tidier suitcases and backpacks.', price: 2899, stock: 28 },
      { name: 'LED Camping Lantern', description: 'Rechargeable lantern with multiple light modes and USB output.', price: 3299, stock: 22 },
      { name: 'Foldable Picnic Mat', description: 'A water-resistant outdoor mat that folds into a carry tote.', price: 2699, stock: 19 },
      { name: 'Digital Luggage Scale', description: 'A compact scale for checking baggage weight before travel.', price: 1599, stock: 40 },
      { name: 'Insulated Lunch Bag', description: 'A leak-resistant thermal bag for work, school, and day trips.', price: 2299, stock: 31 },
    ],
  },
  {
    name: 'Pet Supplies',
    description: 'Everyday feeding, grooming, comfort, and play essentials for pets.',
    products: [
      { name: 'Non-Slip Pet Bowl', description: 'A durable stainless steel food bowl with a non-slip rubber base.', price: 1299, stock: 38 },
      { name: 'Adjustable Dog Harness', description: 'A breathable padded harness with reflective trim for safer walks.', price: 2499, stock: 27 },
      { name: 'Cat Scratching Pad', description: 'A reversible corrugated scratcher with catnip for active indoor cats.', price: 1599, stock: 32 },
      { name: 'Pet Grooming Brush', description: 'A gentle self-cleaning brush for removing loose fur and tangles.', price: 1799, stock: 35 },
      { name: 'Washable Pet Bed', description: 'A soft cushioned bed with a removable, machine-washable cover.', price: 4499, stock: 18 },
      { name: 'Interactive Treat Toy', description: 'A rolling puzzle toy that dispenses treats during play.', price: 1999, stock: 29 },
    ],
  },
  {
    name: 'Baby Essentials',
    description: 'Comfortable and practical everyday items for babies and parents.',
    products: [
      { name: 'Muslin Swaddle Set', description: 'Three soft, breathable cotton wraps for sleep and nursing.', price: 2999, stock: 25 },
      { name: 'Silicone Feeding Set', description: 'A food-grade bowl, plate, cup, spoon, and bib for early meals.', price: 3499, stock: 22 },
      { name: 'Portable Changing Mat', description: 'A foldable waterproof mat with pockets for diapers and wipes.', price: 2299, stock: 31 },
      { name: 'Baby Bath Towel', description: 'An absorbent hooded cotton towel designed for sensitive skin.', price: 1899, stock: 34 },
      { name: 'Soft Activity Book', description: 'A sensory cloth book with textures, crinkles, and safe mirrors.', price: 1699, stock: 28 },
      { name: 'Nursery Night Light', description: 'A rechargeable touch lamp with a soft, sleep-friendly glow.', price: 2799, stock: 20 },
    ],
  },
  {
    name: 'Garden & DIY',
    description: 'Dependable tools and supplies for home projects and plant care.',
    products: [
      { name: 'Home Tool Kit', description: 'A compact set of essential hand tools for everyday household repairs.', price: 6999, stock: 16 },
      { name: 'Cordless Screwdriver', description: 'A rechargeable screwdriver with LED light and interchangeable bits.', price: 5499, stock: 19 },
      { name: 'Garden Hand Tool Set', description: 'A trowel, fork, cultivator, gloves, and storage bag for gardening.', price: 3299, stock: 24 },
      { name: 'Plant Watering Can', description: 'A balanced indoor watering can with a narrow precision spout.', price: 1899, stock: 30 },
      { name: 'Digital Measuring Tape', description: 'A compact rechargeable tape with digital distance display.', price: 3999, stock: 21 },
      { name: 'Work Safety Gloves', description: 'Cut-resistant breathable gloves with a secure textured grip.', price: 1399, stock: 42 },
    ],
  },
];

function getCatalogImageUrl(name: string, lock: number) {
  const tags = name
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, ',')
    .replace(/^,|,$/g, '');

  return `https://loremflickr.com/900/700/${tags}?lock=${lock}`;
}

async function seedCatalog() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });
  const dataSource = app.get(DataSource);

  let categoriesCreated = 0;
  let productsCreated = 0;
  let imagesAdded = 0;

  try {
    await dataSource.transaction(async (manager) => {
      const categoryRepository = manager.getRepository(Category);
      const productRepository = manager.getRepository(Product);

      for (const [categoryIndex, categoryData] of catalog.entries()) {
        let category = await categoryRepository.findOne({
          where: { name: categoryData.name },
        });

        const categoryImageUrl = getCatalogImageUrl(
          categoryData.name,
          100 + categoryIndex,
        );

        if (!category) {
          category = await categoryRepository.save(
            categoryRepository.create({
              name: categoryData.name,
              description: categoryData.description,
              imageUrl: categoryImageUrl,
            }),
          );
          categoriesCreated += 1;
          imagesAdded += 1;
        } else if (!category.imageUrl) {
          category.imageUrl = categoryImageUrl;
          category = await categoryRepository.save(category);
          imagesAdded += 1;
        }

        for (const [productIndex, productData] of categoryData.products.entries()) {
          const existingProduct = await productRepository.findOne({
            where: {
              name: productData.name,
              category: { id: category.id },
            },
          });

          if (!existingProduct) {
            await productRepository.save(
              productRepository.create({
                ...productData,
                category,
                imageUrl: getCatalogImageUrl(
                  productData.name,
                  1000 + categoryIndex * 10 + productIndex,
                ),
              }),
            );
            productsCreated += 1;
            imagesAdded += 1;
          } else if (!existingProduct.imageUrl) {
            existingProduct.imageUrl = getCatalogImageUrl(
              productData.name,
              1000 + categoryIndex * 10 + productIndex,
            );
            await productRepository.save(existingProduct);
            imagesAdded += 1;
          }
        }
      }
    });

    console.log(
      `Catalog seed complete: ${categoriesCreated} categories and ${productsCreated} products created; ${imagesAdded} missing images added.`,
    );
  } finally {
    await app.close();
  }
}

seedCatalog().catch((error: unknown) => {
  console.error('Catalog seed failed:', error);
  process.exitCode = 1;
});
