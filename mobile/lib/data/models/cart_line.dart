class CartLine {
  const CartLine({
    required this.productId,
    required this.quantity,
  });

  final String productId;
  final int quantity;

  CartLine copyWith({String? productId, int? quantity}) {
    return CartLine(
      productId: productId ?? this.productId,
      quantity: quantity ?? this.quantity,
    );
  }

  Map<String, dynamic> toJson() => {
        'productId': productId,
        'quantity': quantity,
      };

  factory CartLine.fromJson(Map<String, dynamic> json) {
    final qty = json['quantity'];
    return CartLine(
      productId: json['productId']?.toString() ?? '',
      quantity: qty is int ? qty : int.tryParse(qty?.toString() ?? '') ?? 1,
    );
  }
}
