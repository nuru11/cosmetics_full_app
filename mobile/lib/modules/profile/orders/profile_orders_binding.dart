import 'package:get/get.dart';

import '../../../core/bindings/api_bindings.dart';
import '../../../data/repositories/order_repository.dart';
import '../../orders/order_status_filter.dart';
import 'filtered_orders_controller.dart';

class ProfileOrdersBinding extends Bindings {
  ProfileOrdersBinding({required this.filter});

  final OrderListFilter filter;

  @override
  void dependencies() {
    registerApiDependencies();
    Get.lazyPut<FilteredOrdersController>(
      () => FilteredOrdersController(Get.find<OrderRepository>(), filter),
    );
  }
}

class MyOrdersBinding extends Bindings {
  @override
  void dependencies() {
    ProfileOrdersBinding(filter: OrderListFilter.active).dependencies();
  }
}

class OrderHistoryBinding extends Bindings {
  @override
  void dependencies() {
    ProfileOrdersBinding(filter: OrderListFilter.history).dependencies();
  }
}
