import 'package:get/get.dart';

import '../../core/network/api_client.dart';
import '../../data/models/order.dart';
import '../../data/repositories/order_repository.dart';

class OrdersController extends GetxController {
  OrdersController(this._repository);

  final OrderRepository _repository;

  final orders = <Order>[].obs;
  final isLoading = false.obs;
  final error = RxnString();

  @override
  void onInit() {
    super.onInit();
    loadOrders();
  }

  Future<void> loadOrders() async {
    isLoading.value = true;
    error.value = null;
    try {
      orders.assignAll(await _repository.getOrders());
    } on ApiException catch (e) {
      error.value = e.message;
    } catch (_) {
      error.value = 'Could not load orders. Check your connection.';
    } finally {
      isLoading.value = false;
    }
  }

  /// Call after checkout or when the Orders tab becomes visible.
  static Future<void> refreshIfRegistered() async {
    if (Get.isRegistered<OrdersController>()) {
      await Get.find<OrdersController>().loadOrders();
    }
  }
}
