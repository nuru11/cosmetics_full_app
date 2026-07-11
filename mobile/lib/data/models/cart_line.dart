class CartLine {
  const CartLine({
    required this.variantId,
    required this.quantity,
  });

  final String variantId;
  final int quantity;

  CartLine copyWith({String? variantId, int? quantity}) {
    return CartLine(
      variantId: variantId ?? this.variantId,
      quantity: quantity ?? this.quantity,
    );
  }

  Map<String, dynamic> toJson() => {
        'variantId': variantId,
        'quantity': quantity,
      };

  factory CartLine.fromJson(Map<String, dynamic> json) {
    final variantId = json['variantId']?.toString() ??
        json['variant_id']?.toString() ??
        '';
    return CartLine(
      variantId: variantId,
      quantity: json['quantity'] as int? ?? 0,
    );
  }
}
