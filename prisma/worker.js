const { parentPort, workerData } = require('worker_threads');
const { v4: uuidv4 } = require('uuid');

const { prisma } = require('../src/lib/prisma/prisma');

async function run() {
  const { workerId, recordsToCreate } = workerData;
  const batchSize = 5000; // Số lượng dòng mỗi lần INSERT
  const loops = Math.ceil(recordsToCreate / batchSize);

  for (let i = 0; i < loops; i++) {
    let values = [];
    for (let j = 0; j < batchSize; j++) {
      const id = uuidv4();
      const barcode = `ORD${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`;
      const filter = barcode.slice(-4);
      const price = (Math.random() * 1000000).toFixed(2);

      // Build chuỗi giá trị cho SQL
      values.push(
        `('${id}', ${price}, 'PENDING', 'Receiver ${workerId}', '0900000', 'Address', 'Cloned', 1, '${barcode}', '${filter}', now(), now())`,
      );
    }

    // Chèn thẳng bằng Raw SQL để bỏ qua lớp xử lý object của Prisma
    await prisma.$executeRawUnsafe(`
      INSERT INTO "Order" (id, "totalPrice", status, "receiverName", "receiverPhone", "receiverAddress", noted, "shopId", "orderBarcode", "orderBarcodeFilter", "createdAt", "updatedAt")
      VALUES ${values.join(',')}
    `);

    if (i % 10 === 0) {
      parentPort.postMessage(
        `Tiến độ: ${(((i * batchSize) / recordsToCreate) * 100).toFixed(2)}%`,
      );
    }
  }
  parentPort.postMessage('Hoàn thành!');
}

run();
