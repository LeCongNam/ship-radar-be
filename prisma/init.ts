import { Prisma } from '../generated/prisma/client';
import { prisma } from '../src/lib/prisma/prisma';

function createOrderBarcode(): string {
  // This is a simplified version of a barcode generator.
  // You might want to use a more robust library for production.
  const prefix = 'ORD';
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

function getFourLastDigitsOfOrderBarcode(barcode: string): string {
  return barcode.slice(-4);
}

async function main() {
  console.log('Starting the init script...');

  // 1. Get total count of orders
  const orderCount = await prisma.order.count();

  if (orderCount === 0) {
    console.error(
      'No orders found in the database. Please seed some data first.',
    );
    return;
  }

  // 2. Get a random order
  const skip = Math.floor(Math.random() * orderCount);
  const randomOrder = await prisma.order.findFirst({
    skip: skip,
    include: {
      orderItems: true, // Include order items to clone them as well
    },
  });

  if (!randomOrder) {
    console.error('Could not fetch a random order.');
    return;
  }

  console.log(`Cloning order with ID: ${randomOrder.id}`);

  // 3. Prepare data for cloning
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, createdAt, updatedAt, orderItems, ...orderDataToClone } =
    randomOrder;

  const totalRecordsToCreate = 100_000_000;
  const batchSize = 10_000; // createMany is more efficient in batches
  const batches = Math.ceil(totalRecordsToCreate / batchSize);

  console.log(
    `Preparing to create ${totalRecordsToCreate} records in ${batches} batches of ${batchSize}...`,
  );

  for (let i = 0; i < batches; i++) {
    const newOrdersData: Prisma.OrderCreateManyInput[] = [];
    for (let j = 0; j < batchSize; j++) {
      // Create a slightly different order to avoid unique constraints if any
      const newBarcode = createOrderBarcode();
      const newOrderData = {
        ...orderDataToClone,
        // Modify fields that might be unique or need variation
        totalPrice: new Prisma.Decimal(
          orderDataToClone.totalPrice.toNumber() + Math.random(),
        ),
        noted: `Cloned order from ${randomOrder.id} - copy ${
          i * batchSize + j + 1
        }`,
        orderBarcode: newBarcode,
        orderBarcodeFilter: getFourLastDigitsOfOrderBarcode(newBarcode),
      };
      newOrdersData.push(newOrderData);
    }

    try {
      await prisma.order.createMany({
        data: newOrdersData,
        skipDuplicates: true, // Skip if a duplicate is found
      });
      console.log(`Batch ${i + 1}/${batches} created successfully.`);
    } catch (error) {
      console.error(`Error creating batch ${i + 1}:`, error);
      // Decide if you want to stop or continue on error
    }
  }

  console.log('Script finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
