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
      'cart_action.unavailable_title'.tr,
      'cart_action.unavailable_product'.tr,
      snackPosition: SnackPosition.BOTTOM,
    );
    return false;
  }

  if (!variant.inStock) {
    Get.snackbar(
      'cart_action.out_of_stock_title'.tr,
      'cart_action.out_of_stock_message'.tr,
      snackPosition: SnackPosition.BOTTOM,
    );
    return false;
  }

  final cart = Get.find<CartService>();
  final current = cart.quantityFor(variant.id);
  final requested = current + quantity;

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
      'cart_action.no_options_title'.tr,
      'cart_action.no_options_message'.tr,
      snackPosition: SnackPosition.BOTTOM,
    );
    return Future.value(false);
  }
  return addVariantToCart(product, variant, quantity: quantity);
}
