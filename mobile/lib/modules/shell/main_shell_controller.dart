import 'package:get/get.dart';

import '../orders/order_status_filter.dart';
import '../orders/orders_controller.dart';
import '../profile/profile_controller.dart';

class MainShellController extends GetxController {
  final selectedIndex = 0.obs;

  void switchToTab(int index, {OrdersTabFilter? ordersFilter}) {
    if (index == 2 && ordersFilter != null) {
      if (Get.isRegistered<OrdersController>()) {
        Get.find<OrdersController>().setFilter(ordersFilter);
      }
    }

    selectedIndex.value = index;

    if (index == 2) {
      OrdersController.refreshIfRegistered();
    }

    if (index == 3 && Get.isRegistered<ProfileController>()) {
      Get.find<ProfileController>().reload();
    }
  }
}
