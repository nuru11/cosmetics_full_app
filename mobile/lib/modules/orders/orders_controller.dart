import 'package:get/get.dart';

import '../../core/network/api_client.dart';
import '../../data/models/order.dart';
import '../../data/repositories/order_repository.dart';
import 'order_status_filter.dart';

class OrdersController extends GetxController {
  OrdersController(this._repository);

  final OrderRepository _repository;

  final orders = <Order>[].obs;
  final filter = OrdersTabFilter.all.obs;
  final isLoading = false.obs;
  final error = RxnString();

  List<Order> get filteredOrders => orders
      .where((o) => orderMatchesTabFilter(o.status, filter.value))
      .toList(growable: false);

  void setFilter(OrdersTabFilter value) {
    filter.value = value;
  }

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
      error.value = 'error.load_orders';
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
