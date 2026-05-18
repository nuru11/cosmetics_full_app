import 'package:get/get.dart';

import '../../../core/network/api_client.dart';
import '../../../data/models/order.dart';
import '../../../data/repositories/order_repository.dart';
import '../../orders/order_status_filter.dart';

class FilteredOrdersController extends GetxController {
  FilteredOrdersController(this._repository, this.filter);

  final OrderRepository _repository;
  final OrderListFilter filter;

  final orders = <Order>[].obs;
  final isLoading = false.obs;
  final error = RxnString();

  List<Order> get filteredOrders => orders
      .where((o) => orderMatchesFilter(o.status, filter))
      .toList(growable: false);

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
}
