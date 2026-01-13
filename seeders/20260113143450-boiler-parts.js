'use strict';

import { faker } from '@faker-js/faker';

const boilerManufacturers = [
  'Ariston',
  'Chaffoteaux&Maury',
  'Baxi',
  'Bongioanni',
  'Saunier Duval',
  'Buderus',
  'Strategist',
  'Henry',
  'Northwest',
];

const partsManufacturers = [
  'Azure',
  'Gloves',
  'Cambridgeshire',
  'Salmon',
  'Montana',
  'Sensor',
  'Lesly',
  'Radian',
  'Gasoline',
  'Croatia',
];

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  const boilerPartsData = [];

  for (let i = 0; i < 100; i++) {
    const imageCount = faker.number.int({ min: 3, max: 5 });
    const images = [];

    for (let j = 0; j < imageCount; j++) {
      images.push(
        `https://picsum.photos/seed/${faker.string.uuid().substring(0, 8)}/800/600`,
      );
    }

    boilerPartsData.push({
      boiler_manufacturer:
        boilerManufacturers[
          Math.floor(Math.random() * boilerManufacturers.length)
        ],
      parts_manufacturer:
        partsManufacturers[
          Math.floor(Math.random() * partsManufacturers.length)
        ],
      price: faker.number.int({ min: 1000, max: 9999 }),
      name: faker.lorem.words({ min: 2, max: 4 }),
      description: faker.lorem.sentences(2),
      images: JSON.stringify(images),
      vendor_code: `V${faker.string.numeric(7)}`,
      in_stock: faker.number.int({ min: 0, max: 99 }),
      bestseller: faker.datatype.boolean(),
      new: faker.datatype.boolean(),
      popularity: faker.number.int({ min: 0, max: 999 }),
      compatibility: faker.lorem.words(4),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await queryInterface.bulkInsert('BoilerParts', boilerPartsData);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('BoilerParts', null, {});
}
