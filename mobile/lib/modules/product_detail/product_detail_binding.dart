import 'package:get/get.dart';

import '../../core/bindings/api_bindings.dart';
import '../../data/repositories/product_repository.dart';
import 'product_detail_controller.dart';

class ProductDetailBinding extends Bindings {
  @override
  void dependencies() {
    registerApiDependencies();
    Get.lazyPut<ProductDetailController>(
      () => ProductDetailController(
        Get.find<ProductRepository>(),
        Get.parameters['id'] ?? '',
      ),
    );
  }
}
