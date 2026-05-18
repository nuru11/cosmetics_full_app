import 'package:get/get.dart';

import '../../core/bindings/api_bindings.dart';
import '../../data/repositories/order_repository.dart';
import 'orders_controller.dart';

class OrdersBinding extends Bindings {
  @override
  void dependencies() {
    registerApiDependencies();
    if (!Get.isRegistered<OrdersController>()) {
      Get.put<OrdersController>(
        OrdersController(Get.find<OrderRepository>()),
        permanent: true,
      );
    }
  }
}
