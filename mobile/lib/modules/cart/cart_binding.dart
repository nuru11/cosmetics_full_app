import 'package:get/get.dart';

import '../../core/bindings/api_bindings.dart';
import '../../data/repositories/order_repository.dart';
import '../../data/repositories/product_repository.dart';
import 'cart_controller.dart';
import 'cart_service.dart';

class CartBinding extends Bindings {
  @override
  void dependencies() {
    registerApiDependencies();
    Get.lazyPut<CartController>(
      () => CartController(
        Get.find<CartService>(),
        Get.find<ProductRepository>(),
        Get.find<OrderRepository>(),
      ),
    );
  }
}
