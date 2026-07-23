import 'package:get/get.dart';

import '../device/client_device_id.dart';
import '../network/api_client.dart';
import '../../data/repositories/category_repository.dart';
import '../../data/repositories/order_repository.dart';
import '../../data/repositories/product_repository.dart';
import '../../data/repositories/product_request_repository.dart';
import '../../data/services/category_api.dart';
import '../../data/services/order_api.dart';
import '../../data/services/product_api.dart';
import '../../data/services/product_request_api.dart';

void registerApiDependencies() {
  if (!Get.isRegistered<ApiClient>()) {
    Get.lazyPut<ApiClient>(
      () => ApiClient(deviceId: Get.find<ClientDeviceId>()),
      fenix: true,
    );
  }
  if (!Get.isRegistered<ProductApi>()) {
    Get.lazyPut<ProductApi>(() => ProductApi(Get.find<ApiClient>()), fenix: true);
  }
  if (!Get.isRegistered<CategoryApi>()) {
    Get.lazyPut<CategoryApi>(() => CategoryApi(Get.find<ApiClient>()), fenix: true);
  }
  if (!Get.isRegistered<ProductRepository>()) {
    Get.lazyPut<ProductRepository>(
      () => ProductRepository(Get.find<ProductApi>()),
      fenix: true,
    );
  }
  if (!Get.isRegistered<CategoryRepository>()) {
    Get.lazyPut<CategoryRepository>(
      () => CategoryRepository(Get.find<CategoryApi>()),
      fenix: true,
    );
  }
  if (!Get.isRegistered<OrderApi>()) {
    Get.lazyPut<OrderApi>(() => OrderApi(Get.find<ApiClient>()), fenix: true);
  }
  if (!Get.isRegistered<OrderRepository>()) {
    Get.lazyPut<OrderRepository>(
      () => OrderRepository(Get.find<OrderApi>()),
      fenix: true,
    );
  }
  if (!Get.isRegistered<ProductRequestApi>()) {
    Get.lazyPut<ProductRequestApi>(
      () => ProductRequestApi(Get.find<ApiClient>()),
      fenix: true,
    );
  }
  if (!Get.isRegistered<ProductRequestRepository>()) {
    Get.lazyPut<ProductRequestRepository>(
      () => ProductRequestRepository(Get.find<ProductRequestApi>()),
      fenix: true,
    );
  }
}
