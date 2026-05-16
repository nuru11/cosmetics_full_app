import 'package:get/get.dart';

import '../products/products_controller.dart';
import 'saved_controller.dart';
import 'wishlist_service.dart';

class SavedBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<SavedController>(
      () => SavedController(
        Get.find<WishlistService>(),
        Get.find<ProductsController>(),
      ),
    );
  }
}
