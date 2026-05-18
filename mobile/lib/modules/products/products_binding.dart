import 'package:get/get.dart';

import '../../core/bindings/api_bindings.dart';
import '../../data/repositories/category_repository.dart';
import '../../data/repositories/product_repository.dart';
import 'products_controller.dart';

class ProductsBinding extends Bindings {
  @override
  void dependencies() {
    registerApiDependencies();
    Get.lazyPut<ProductsController>(
      () => ProductsController(
        Get.find<ProductRepository>(),
        Get.find<CategoryRepository>(),
      ),
    );
  }
}
