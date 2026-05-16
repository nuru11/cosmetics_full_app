const { Cart, CartItem, Product, Category } = require('../../lib/db');

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
            model: Product,
            as: 'product',
            include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
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

  async addItem(userId, { productId, quantity = 1 }) {
    const product = await Product.findOne({
      where: { id: productId, status: 'ACTIVE' },
    });
    if (!product) {
      const err = new Error('Product not found or not available');
      err.status = 404;
      throw err;
    }
    if (product.stock < quantity) {
      const err = new Error('Insufficient stock');
      err.status = 400;
      throw err;
    }

    const cart = await getOrCreateCart(userId);
    const existing = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (product.stock < newQty) {
        const err = new Error('Insufficient stock');
        err.status = 400;
        throw err;
      }
      await existing.update({ quantity: newQty });
    } else {
      await CartItem.create({ cartId: cart.id, productId, quantity });
    }

    return loadCartWithItems(cart.id);
  },

  async updateItemQuantity(userId, productId, quantity) {
    if (quantity < 1) {
      const err = new Error('Quantity must be at least 1');
      err.status = 400;
      throw err;
    }

    const cart = await getOrCreateCart(userId);
    const item = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });
    if (!item) {
      const err = new Error('Cart item not found');
      err.status = 404;
      throw err;
    }

    const product = await Product.findOne({ where: { id: productId } });
    if (!product || product.stock < quantity) {
      const err = new Error('Insufficient stock');
      err.status = 400;
      throw err;
    }

    await item.update({ quantity });
    return loadCartWithItems(cart.id);
  },

  async removeItem(userId, productId) {
    const cart = await getOrCreateCart(userId);
    await CartItem.destroy({ where: { cartId: cart.id, productId } });
    return loadCartWithItems(cart.id);
  },

  async clearCart(userId) {
    const cart = await getOrCreateCart(userId);
    await CartItem.destroy({ where: { cartId: cart.id } });
    return loadCartWithItems(cart.id);
  },
};

module.exports = { cartService, getOrCreateCart, loadCartWithItems };
