import '../../core/network/api_client.dart';
import '../models/order.dart';

class OrderApi {
  OrderApi(this._client);

  final ApiClient _client;

  Future<Order> checkout({
    required List<Map<String, dynamic>> items,
    required String customerName,
    required String phone,
    required String city,
  }) async {
    final data = await _client.postJson(
      'orders/checkout',
      body: {
        'items': items,
        'customerName': customerName,
        'phone': phone,
        'city': city,
      },
    );
    final order = data['order'];
    if (order is! Map<String, dynamic>) {
      throw ApiException('Invalid checkout response');
    }
    return Order.fromJson(order);
  }

  Future<List<Order>> fetchOrders() async {
    final data = await _client.getJson('orders');
    final list = data['orders'];
    if (list is! List) return [];
    return list
        .whereType<Map<String, dynamic>>()
        .map(Order.fromJson)
        .toList();
  }
}
