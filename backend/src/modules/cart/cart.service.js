const { Cart, CartItem, Product, ProductVariant, Category } = require('../../lib/db');

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) {
    cart = await Cart.create({ userId });
  }
  return cart;
}

async function loadCartWithItems(cartId) {
  return Cart.findOne({
    where: { id: cartId },
    include: [
      {
        model: CartItem,
        as: 'items',
        include: [
          {
            model: ProductVariant,
            as: 'variant',
            include: [
              {
                model: Product,
                as: 'product',
                include: [
                  {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug'],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });
}

const cartService = {
  async getCart(userId) {
    const cart = await getOrCreateCart(userId);
    return loadCartWithItems(cart.id);
  },

  async addItem(userId, { variantId, quantity = 1 }) {
    const variant = await ProductVariant.findOne({
      where: { id: variantId },
      include: [{ model: Product, as: 'product' }],
    });
    if (!variant || !variant.product || variant.product.status !== 'ACTIVE') {
      const err = new Error('Variant not found or not available');
      err.status = 404;
      throw err;
    }
    if (!variant.inStock) {
      const err = new Error('Variant out of stock');
      err.status = 400;
      throw err;
    }

    const cart = await getOrCreateCart(userId);
    const existing = await CartItem.findOne({
      where: { cartId: cart.id, variantId },
    });

    if (existing) {
      const newQty = existing.quantity + quantity;
      await existing.update({ quantity: newQty });
    } else {
      await CartItem.create({ cartId: cart.id, variantId, quantity });
    }

    return loadCartWithItems(cart.id);
  },

  async updateItemQuantity(userId, variantId, quantity) {
    if (quantity < 1) {
      const err = new Error('Quantity must be at least 1');
      err.status = 400;
      throw err;
    }

    const cart = await getOrCreateCart(userId);
    const item = await CartItem.findOne({
      where: { cartId: cart.id, variantId },
    });
    if (!item) {
      const err = new Error('Cart item not found');
      err.status = 404;
      throw err;
    }

    const variant = await ProductVariant.findOne({
      where: { id: variantId },
      include: [{ model: Product, as: 'product' }],
    });
    if (
      !variant ||
      !variant.product ||
      variant.product.status !== 'ACTIVE' ||
      !variant.inStock
    ) {
      const err = new Error('Variant not found or not available');
      err.status = 400;
      throw err;
    }

    await item.update({ quantity });
    return loadCartWithItems(cart.id);
  },

  async removeItem(userId, variantId) {
    const cart = await getOrCreateCart(userId);
    await CartItem.destroy({ where: { cartId: cart.id, variantId } });
    return loadCartWithItems(cart.id);
  },

  async clearCart(userId) {
    const cart = await getOrCreateCart(userId);
    await CartItem.destroy({ where: { cartId: cart.id } });
    return loadCartWithItems(cart.id);
  },
};

module.exports = { cartService, getOrCreateCart, loadCartWithItems };
