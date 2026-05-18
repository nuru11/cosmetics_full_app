import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/data/models/order.dart';

void main() {
  test('Order.fromJson parses guest order fields', () {
    final order = Order.fromJson({
      'id': 'order-1',
      'status': 'PENDING',
      'totalAmount': '42.50',
      'customerName': 'Sara',
      'phone': '+96170123456',
      'city': 'Beirut',
      'createdAt': '2026-05-18T10:00:00.000Z',
      'items': [
        {
          'id': 'line-1',
          'productId': 'prod-1',
          'quantity': 2,
          'unitPrice': '10',
          'lineTotal': '20',
          'product': {'name': 'Lipstick'},
        },
      ],
    });

    expect(order.id, 'order-1');
    expect(order.totalAmount, 42.5);
    expect(order.customerName, 'Sara');
    expect(order.city, 'Beirut');
    expect(order.items.length, 1);
    expect(order.items.first.productName, 'Lipstick');
  });
}
