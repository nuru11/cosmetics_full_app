import 'package:get/get.dart';

import '../../data/models/product.dart';
import '../../data/models/product_variant.dart';
import 'cart_service.dart';

Future<bool> addVariantToCart(
  Product product,
  ProductVariant variant, {
  int quantity = 1,
}) async {
  if (product.status.toUpperCase() != 'ACTIVE') {
    Get.snackbar(
      'Unavailable',
      'This product is not available.',
      snackPosition: SnackPosition.BOTTOM,
    );
    return false;
  }

  if (variant.stock <= 0) {
    Get.snackbar(
      'Out of stock',
      'This option is currently unavailable.',
      snackPosition: SnackPosition.BOTTOM,
    );
    return false;
  }

  final cart = Get.find<CartService>();
  final current = cart.quantityFor(variant.id);
  final requested = current + quantity;

  if (requested > variant.stock) {
    if (current >= variant.stock) {
      Get.snackbar(
        'Stock limit',
        'Only ${variant.stock} available.',
        snackPosition: SnackPosition.BOTTOM,
      );
      return false;
    }
    await cart.setQuantity(variant.id, variant.stock);
    Get.snackbar(
      'Stock limit',
      'Quantity adjusted to ${variant.stock}.',
      snackPosition: SnackPosition.BOTTOM,
    );
    return true;
  }

  if (current > 0) {
    await cart.setQuantity(variant.id, requested);
  } else {
    await cart.add(variant.id, quantity: quantity);
  }
  return true;
}

Future<bool> addProductToCart(Product product, {int quantity = 1}) {
  final variant = product.firstInStockVariant ?? product.defaultVariant;
  if (variant == null) {
    Get.snackbar(
      'Unavailable',
      'No purchasable options for this product.',
      snackPosition: SnackPosition.BOTTOM,
    );
    return Future.value(false);
  }
  return addVariantToCart(product, variant, quantity: quantity);
}
