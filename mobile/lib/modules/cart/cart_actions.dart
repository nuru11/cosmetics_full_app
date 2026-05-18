import 'package:get/get.dart';

import '../../data/models/product.dart';
import 'cart_service.dart';

Future<bool> addProductToCart(Product product, {int quantity = 1}) async {
  if (product.status.toUpperCase() != 'ACTIVE') {
    Get.snackbar(
      'Unavailable',
      'This product is not available.',
      snackPosition: SnackPosition.BOTTOM,
    );
    return false;
  }

  if (product.stock <= 0) {
    Get.snackbar(
      'Out of stock',
      'This product is currently unavailable.',
      snackPosition: SnackPosition.BOTTOM,
    );
    return false;
  }

  final cart = Get.find<CartService>();
  final current = cart.quantityFor(product.id);
  final requested = current + quantity;

  if (requested > product.stock) {
    if (current >= product.stock) {
      Get.snackbar(
        'Stock limit',
        'Only ${product.stock} available.',
        snackPosition: SnackPosition.BOTTOM,
      );
      return false;
    }
    await cart.setQuantity(product.id, product.stock);
    Get.snackbar(
      'Stock limit',
      'Quantity adjusted to ${product.stock}.',
      snackPosition: SnackPosition.BOTTOM,
    );
    return true;
  }

  if (current > 0) {
    await cart.setQuantity(product.id, requested);
  } else {
    await cart.add(product.id, quantity: quantity);
  }
  return true;
}
