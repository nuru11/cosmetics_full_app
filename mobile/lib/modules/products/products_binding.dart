import 'package:get/get.dart';

import '../../core/network/api_client.dart';
import '../../data/repositories/category_repository.dart';
import '../../data/repositories/product_repository.dart';
import '../../data/services/category_api.dart';
import '../../data/services/product_api.dart';
import 'products_controller.dart';

class ProductsBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<ApiClient>(() => ApiClient(), fenix: true);
    Get.lazyPut<ProductApi>(() => ProductApi(Get.find<ApiClient>()), fenix: true);
    Get.lazyPut<CategoryApi>(() => CategoryApi(Get.find<ApiClient>()), fenix: true);
    Get.lazyPut<ProductRepository>(
      () => ProductRepository(Get.find<ProductApi>()),
      fenix: true,
    );
    Get.lazyPut<CategoryRepository>(
      () => CategoryRepository(Get.find<CategoryApi>()),
      fenix: true,
    );
    Get.lazyPut<ProductsController>(
      () => ProductsController(
        Get.find<ProductRepository>(),
        Get.find<CategoryRepository>(),
      ),
    );
  }
}
