import 'package:get/get.dart';

import '../../core/bindings/api_bindings.dart';
import '../../data/repositories/product_request_repository.dart';
import 'product_request_controller.dart';

class ProductRequestBinding extends Bindings {
  @override
  void dependencies() {
    registerApiDependencies();
    Get.lazyPut<ProductRequestController>(
      () => ProductRequestController(Get.find<ProductRequestRepository>()),
    );
  }
}
