const prisma = require('../prisma');

async function main() {
  const sku = 'SKU-PAPER-01';
  
  const existing = await prisma.material.findUnique({
    where: { sku }
  });

  if (!existing) {
    const mat = await prisma.material.create({
      data: {
        sku,
        name: 'High-Gloss Paper Roll (1000m)',
        stockLevel: 50,
        unit: 'rolls'
      }
    });
    console.log('Seeded material:', mat);
  } else {
    console.log('Material already exists:', existing);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
