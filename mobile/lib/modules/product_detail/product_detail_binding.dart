import 'package:get/get.dart';

import '../../core/network/api_client.dart';
import '../../data/repositories/product_repository.dart';
import '../../data/services/product_api.dart';
import 'product_detail_controller.dart';

class ProductDetailBinding extends Bindings {
  @override
  void dependencies() {
    if (!Get.isRegistered<ApiClient>()) {
      Get.lazyPut<ApiClient>(() => ApiClient(), fenix: true);
    }
    if (!Get.isRegistered<ProductApi>()) {
      Get.lazyPut<ProductApi>(() => ProductApi(Get.find<ApiClient>()), fenix: true);
    }
    if (!Get.isRegistered<ProductRepository>()) {
      Get.lazyPut<ProductRepository>(
        () => ProductRepository(Get.find<ProductApi>()),
        fenix: true,
      );
    }
    Get.lazyPut<ProductDetailController>(
      () => ProductDetailController(
        Get.find<ProductRepository>(),
        Get.parameters['id'] ?? '',
      ),
    );
  }
}
