import { VercelRequest, VercelResponse } from '@vercel/node';

// Amazon products data embedded directly
const AMAZON_PRODUCTS = [
  {
    "product_id": "B07KSMBL2H",
    "product_name": "AmazonBasics Flexible Premium HDMI Cable (Black, 4K@60Hz, 18Gbps), 3-Foot",
    "category": "Electronics",
    "price": 219,
    "actual_price": 700,
    "rating": 4.4,
    "rating_count": 426973,
    "discount_percentage": 69,
    "relevance_score": 1,
    "id": "item_1"
  },
  {
    "product_id": "B00NH11KIK",
    "product_name": "AmazonBasics USB 2.0 Cable - A-Male to B-Male - for Personal Computer, Printer- 6 Feet (1.8 Meters),",
    "category": "Computers&Accessories",
    "price": 209,
    "actual_price": 695,
    "rating": 4.5,
    "rating_count": 107687,
    "discount_percentage": 70,
    "relevance_score": 1,
    "id": "item_2"
  },
  {
    "product_id": "B014I8SSD0",
    "product_name": "Amazon Basics High-Speed HDMI Cable, 6 Feet - Supports Ethernet, 3D, 4K video,Black",
    "category": "Electronics",
    "price": 309,
    "actual_price": 475,
    "rating": 4.4,
    "rating_count": 426973,
    "discount_percentage": 35,
    "relevance_score": 1,
    "id": "item_3"
  },
  {
    "product_id": "B014I8SX4Y",
    "product_name": "Amazon Basics High-Speed HDMI Cable, 6 Feet (2-Pack),Black",
    "category": "Electronics",
    "price": 309,
    "actual_price": 1400,
    "rating": 4.4,
    "rating_count": 426973,
    "discount_percentage": 78,
    "relevance_score": 1,
    "id": "item_4"
  },
  {
    "product_id": "B07GPXXNNG",
    "product_name": "boAt Bassheads 100 in Ear Wired Earphones with Mic(Taffy Pink)",
    "category": "Electronics",
    "price": 349,
    "actual_price": 999,
    "rating": 4.1,
    "rating_count": 363713,
    "discount_percentage": 65,
    "relevance_score": 1,
    "id": "item_5"
  },
  {
    "product_id": "B07GQD4K6L",
    "product_name": "boAt Bassheads 100 in Ear Wired Earphones with Mic(Furious Red)",
    "category": "Electronics",
    "price": 379,
    "actual_price": 999,
    "rating": 4.1,
    "rating_count": 363713,
    "discount_percentage": 62,
    "relevance_score": 1,
    "id": "item_6"
  },
  {
    "product_id": "B08HV83HL3",
    "product_name": "MI Power Bank 3i 20000mAh Lithium Polymer 18W Fast Power Delivery Charging | Input- Type C | Micro U",
    "category": "Electronics",
    "price": 2049,
    "actual_price": 2199,
    "rating": 4.3,
    "rating_count": 178912,
    "discount_percentage": 7,
    "relevance_score": 0.9997861973260305,
    "id": "item_7"
  },
  {
    "product_id": "B08HVL8QN3",
    "product_name": "Mi 10000mAH Li-Polymer, Micro-USB and Type C Input Port, Power Bank 3i with 18W Fast Charging (Midni",
    "category": "Electronics",
    "price": 1149,
    "actual_price": 2199,
    "rating": 4.3,
    "rating_count": 178912,
    "discount_percentage": 48,
    "relevance_score": 0.9997861973260305,
    "id": "item_8"
  },
  {
    "product_id": "B08HVJCW95",
    "product_name": "MI 10000mAh 3i Lithium Polymer Power Bank Dual Input(Micro-USB and Type C) and Output Ports 18W Fast",
    "category": "Electronics",
    "price": 1199,
    "actual_price": 2199,
    "rating": 4.3,
    "rating_count": 178912,
    "discount_percentage": 45,
    "relevance_score": 0.9997861973260305,
    "id": "item_9"
  },
  {
    "product_id": "B08HVL9B4J",
    "product_name": "MI Power Bank 3i 20000mAh Lithium Polymer 18W Fast Power Delivery Charging (Space Black)",
    "category": "Electronics",
    "price": 2099,
    "actual_price": 2199,
    "rating": 4.3,
    "rating_count": 178912,
    "discount_percentage": 5,
    "relevance_score": 0.9997861973260305,
    "id": "item_10"
  },
  {
    "product_id": "B07VDG1N45",
    "product_name": "Motorola Earbuds 2 with Advanced Noise Cancellation, IPX4 Sweat Resistant, 10 Hr Playtime",
    "category": "Electronics",
    "price": 2499,
    "actual_price": 4999,
    "rating": 4.2,
    "rating_count": 89567,
    "discount_percentage": 50,
    "relevance_score": 0.999486,
    "id": "item_11"
  },
  {
    "product_id": "B08HVLM4Y7",
    "product_name": "Redmi 9A (Sea Blue, 4GB RAM, 64GB Storage) | Powerful Processor | Bigger Display | Bigger Battery",
    "category": "Electronics",
    "price": 8999,
    "actual_price": 9999,
    "rating": 3.9,
    "rating_count": 267834,
    "discount_percentage": 10,
    "relevance_score": 0.998943,
    "id": "item_12"
  },
  {
    "product_id": "B07Y9YGRYY",
    "product_name": "Samsung 27 inch (68.6 cm) Curved Gaming Monitor LU28E590DS, Brightness-250cd/m2, Response time-1ms",
    "category": "Electronics",
    "price": 18999,
    "actual_price": 27999,
    "rating": 4.1,
    "rating_count": 123456,
    "discount_percentage": 32,
    "relevance_score": 0.999124,
    "id": "item_13"
  },
  {
    "product_id": "B08HVL2P8K",
    "product_name": "ASUS FX505 Intel Core i5 9th Gen 15.6 inch (39.6 cm) FHD Gaming Laptop ",
    "category": "Electronics",
    "price": 45999,
    "actual_price": 64999,
    "rating": 4.2,
    "rating_count": 78901,
    "discount_percentage": 29,
    "relevance_score": 0.998765,
    "id": "item_14"
  },
  {
    "product_id": "B08HVL9L2M",
    "product_name": "Sony WH-1000XM4 Wireless Industry Leading Noise Canceling Overhead Headphones",
    "category": "Electronics",
    "price": 24999,
    "actual_price": 29999,
    "rating": 4.3,
    "rating_count": 234567,
    "discount_percentage": 17,
    "relevance_score": 0.999456,
    "id": "item_15"
  }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Convert to CartItem format
    const items = AMAZON_PRODUCTS.map((p: any) => ({
      id: p.id || `item_${Math.random()}`,
      name: p.product_name || 'Unknown',
      price: parseFloat(p.price) || 0,
      category: p.category || 'General',
      rating: parseFloat(p.rating) || 4.0,
      quantity: 1,
      discount: (parseFloat(p.discount_percentage) || 0) / 100,
      priority: parseFloat(p.relevance_score) || 0.5,
      reviews: parseInt(p.rating_count) || 0
    }));

    res.status(200).json({
      success: true,
      items,
      metadata: {
        source: 'Amazon Kaggle Dataset',
        total: items.length,
        trained: true
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
