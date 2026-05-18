class OrderLineItem {
  const OrderLineItem({
    required this.id,
    required this.productId,
    required this.quantity,
    required this.unitPrice,
    required this.lineTotal,
    this.productName,
  });

  final String id;
  final String productId;
  final int quantity;
  final double unitPrice;
  final double lineTotal;
  final String? productName;

  factory OrderLineItem.fromJson(Map<String, dynamic> json) {
    final product = json['product'];
    String? name;
    if (product is Map<String, dynamic>) {
      name = product['name'] as String?;
    }
    return OrderLineItem(
      id: json['id'] as String? ?? '',
      productId: json['productId'] as String? ?? json['product_id'] as String? ?? '',
      quantity: _int(json['quantity']),
      unitPrice: _double(json['unitPrice'] ?? json['unit_price']),
      lineTotal: _double(json['lineTotal'] ?? json['line_total']),
      productName: name,
    );
  }
}

class Order {
  const Order({
    required this.id,
    required this.status,
    required this.totalAmount,
    required this.createdAt,
    this.customerName,
    this.phone,
    this.city,
    this.items = const [],
  });

  final String id;
  final String status;
  final double totalAmount;
  final DateTime? createdAt;
  final String? customerName;
  final String? phone;
  final String? city;
  final List<OrderLineItem> items;

  factory Order.fromJson(Map<String, dynamic> json) {
    final rawItems = json['items'];
    final items = rawItems is List
        ? rawItems
            .whereType<Map<String, dynamic>>()
            .map(OrderLineItem.fromJson)
            .toList()
        : <OrderLineItem>[];

    return Order(
      id: json['id'] as String? ?? '',
      status: json['status'] as String? ?? 'PENDING',
      totalAmount: _double(json['totalAmount'] ?? json['total_amount']),
      createdAt: _date(json['createdAt'] ?? json['created_at']),
      customerName:
          json['customerName'] as String? ?? json['customer_name'] as String?,
      phone: json['phone'] as String?,
      city: json['city'] as String?,
      items: items,
    );
  }
}

double _double(dynamic value) {
  if (value is num) return value.toDouble();
  if (value is String) return double.tryParse(value) ?? 0;
  return 0;
}

int _int(dynamic value) {
  if (value is int) return value;
  if (value is num) return value.toInt();
  if (value is String) return int.tryParse(value) ?? 0;
  return 0;
}

DateTime? _date(dynamic value) {
  if (value is String && value.isNotEmpty) {
    return DateTime.tryParse(value);
  }
  return null;
}
