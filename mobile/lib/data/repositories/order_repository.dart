import '../models/order.dart';
import '../services/order_api.dart';

class OrderRepository {
  OrderRepository(this._api);

  final OrderApi _api;

  Future<Order> placeOrder({
    required List<({String productId, int quantity})> items,
    required String customerName,
    required String phone,
    required String city,
  }) {
    final payload = items
        .map((e) => {'productId': e.productId, 'quantity': e.quantity})
        .toList();
    return _api.checkout(
      items: payload,
      customerName: customerName,
      phone: phone,
      city: city,
    );
  }

  Future<List<Order>> getOrders() => _api.fetchOrders();
}
