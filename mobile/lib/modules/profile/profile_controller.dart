import 'package:get/get.dart';

import '../../data/services/checkout_contact_storage.dart';
import '../orders/orders_controller.dart';
import '../saved/wishlist_service.dart';
import '../shell/main_shell_controller.dart';

class ProfileController extends GetxController {
  final displayName = ''.obs;
  final hasContactName = false.obs;

  int get orderCount =>
      Get.isRegistered<OrdersController>()
          ? Get.find<OrdersController>().orders.length
          : 0;

  int get savedCount => Get.find<WishlistService>().savedVariantIds.length;

  @override
  void onInit() {
    super.onInit();
    reload();
  }

  Future<void> reload() async {
    await _loadDisplayName();
    await OrdersController.refreshIfRegistered();
  }

  Future<void> _loadDisplayName() async {
    final storage = await CheckoutContactStorage.create();
    final contact = storage.load();
    final name = contact.name.trim();
    hasContactName.value = name.isNotEmpty;
    displayName.value = name.isNotEmpty ? name : 'profile.guest'.tr;
  }

  void switchToOrdersTab() {
    Get.find<MainShellController>().switchToTab(2);
  }

  void switchToSavedTab() {
    Get.find<MainShellController>().switchToTab(1);
  }
}
