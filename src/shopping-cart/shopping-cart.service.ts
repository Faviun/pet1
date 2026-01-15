import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BoilerPartsService } from 'src/boiler-parts/boiler-parts.service';
import { UsersService } from 'src/users/users.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ShoppingCart } from './shopping-cart.model';

@Injectable()
export class ShoppingCartService {
  private readonly logger = new Logger(ShoppingCartService.name);

  constructor(
    @InjectModel(ShoppingCart)
    private shoppingCartModel: typeof ShoppingCart,
    private readonly usersService: UsersService,
    private readonly boilerPartsService: BoilerPartsService,
  ) {}

  async findAll(userId: number | string): Promise<ShoppingCart[]> {
    const cartItems = await this.shoppingCartModel.findAll({
      where: { userId },
    });

    return cartItems.map((item) => item.get({ plain: true }));
  }

  async add(addToCartDto: AddToCartDto): Promise<ShoppingCart> {
    try {
      // 1. Находим пользователя
      const user = await this.usersService.findOne({
        where: { username: addToCartDto.username },
      });

      if (!user) {
        throw new NotFoundException(
          `Пользователь "${addToCartDto.username}" не найден`,
        );
      }

      // 2. Находим деталь
      const part = await this.boilerPartsService.findOne(addToCartDto.partId);

      if (!part) {
        throw new NotFoundException(
          `Товар с ID "${addToCartDto.partId}" не найден`,
        );
      }

      // 3. Проверяем, есть ли уже такой товар в корзине
      const existingCartItem = await this.shoppingCartModel.findOne({
        where: {
          userId: user.id,
          partId: part.id,
        },
      });

      // 4. Если товар уже в корзине - увеличиваем количество
      if (existingCartItem) {
        existingCartItem.count += 1;
        existingCartItem.total_price =
          existingCartItem.price * existingCartItem.count;

        const updated = await existingCartItem.save();
        this.logger.log(
          `Увеличено количество товара ${part.id} в корзине пользователя ${user.id}`,
        );
        return updated;
      }

      // 5. Извлекаем данные из детали с использованием getDataValue()
      const boilerManufacturer = part.getDataValue('boiler_manufacturer');
      const partsManufacturer = part.getDataValue('parts_manufacturer');
      const price = part.getDataValue('price');
      const inStock = part.getDataValue('in_stock');
      const name = part.getDataValue('name');
      const images = part.getDataValue('images');

      // 6. Парсим изображение
      let firstImage = '';
      if (images) {
        try {
          const parsedImages = JSON.parse(images);
          firstImage =
            Array.isArray(parsedImages) && parsedImages.length > 0
              ? parsedImages[0]
              : images;
        } catch {
          firstImage = images;
        }
      }

      // 7. Создаем новую запись в корзине
      const cartData = {
        userId: user.id,
        partId: part.id,
        boiler_manufacturer: boilerManufacturer,
        parts_manufacturer: partsManufacturer,
        price: price,
        in_stock: inStock,
        image: firstImage,
        name: name,
        total_price: price,
        count: 1,
      };

      const newCartItem = await this.shoppingCartModel.create(cartData as any);

      this.logger.log(
        `Добавлен товар ${part.id} в корзину пользователя ${user.id}`,
      );
      return newCartItem;
    } catch (error) {
      this.logger.error(
        `Ошибка при добавлении в корзину: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async updateCount(
    count: number,
    partId: number | string,
  ): Promise<{ count: number }> {
    const [affectedCount] = await this.shoppingCartModel.update(
      { count },
      { where: { partId } },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(
        `Элемент корзины с partId "${partId}" не найден`,
      );
    }

    const cartItem = await this.shoppingCartModel.findOne({
      where: { partId },
    });

    if (!cartItem) {
      throw new NotFoundException(
        `Элемент корзины с partId "${partId}" не найден`,
      );
    }

    // Используем getDataValue()
    return { count: cartItem.getDataValue('count') };
  }

  async updateTotalPrice(
    total_price: number,
    partId: number | string,
  ): Promise<{ total_price: number }> {
    const [affectedCount] = await this.shoppingCartModel.update(
      { total_price },
      { where: { partId } },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(
        `Элемент корзины с partId "${partId}" не найден`,
      );
    }

    const cartItem = await this.shoppingCartModel.findOne({
      where: { partId },
    });

    if (!cartItem) {
      throw new NotFoundException(
        `Элемент корзины с partId "${partId}" не найден`,
      );
    }

    // Используем getDataValue()
    return { total_price: cartItem.getDataValue('total_price') };
  }

  async remove(partId: number | string): Promise<void> {
    const cartItem = await this.shoppingCartModel.findOne({
      where: { partId },
    });

    if (!cartItem) {
      throw new NotFoundException(
        `Элемент корзины с partId "${partId}" не найден`,
      );
    }

    await cartItem.destroy();
  }

  async removeAll(userId: number | string): Promise<void> {
    const deletedCount = await this.shoppingCartModel.destroy({
      where: { userId },
    });

    if (deletedCount === 0) {
      throw new NotFoundException(`Корзина пользователя ${userId} пуста`);
    }
  }
}
