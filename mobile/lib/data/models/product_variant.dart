import 'dart:convert';

typedef ProductVersion = String;

class ProductVariant {
  const ProductVariant({
    required this.id,
    required this.price,
    required this.productVersion,
    required this.inStock,
    required this.variantImages,
    this.variantDescription,
    this.color,
    this.size,
    this.sku,
    this.sortOrder = 0,
  });

  final String id;
  final String? variantDescription;
  final double price;
  final bool inStock;
  final String? sku;
  final String? color;
  final String? size;
  final ProductVersion productVersion;
  final List<String> variantImages;
  final int sortOrder;

  String? get primaryImage =>
      variantImages.isNotEmpty ? variantImages.first : null;

  String get displayLabel {
    if (variantDescription != null && variantDescription!.trim().isNotEmpty) {
      return variantDescription!.trim();
    }
    if (size != null && size!.trim().isNotEmpty) return size!.trim();
    return productVersion;
  }

  factory ProductVariant.fromJson(Map<String, dynamic> json) {
    return ProductVariant(
      id: json['id'] as String,
      variantDescription:
          (json['variantDescription'] ?? json['variant_description']) as String?,
      price: _parsePrice(json['price']),
      inStock: _parseInStock(json['inStock'] ?? json['in_stock'] ?? json['stock']),
      sku: json['sku'] as String?,
      color: json['color'] as String?,
      size: json['size'] as String?,
      productVersion: (json['productVersion'] ?? json['product_version'] as String?)
              ?.toString()
              .toUpperCase() ??
          'ORIGINAL',
      variantImages: _parseImages(
        json['variantImages'] ?? json['variant_images'],
      ),
      sortOrder: json['sortOrder'] as int? ?? json['sort_order'] as int? ?? 0,
    );
  }

  static bool _parseInStock(dynamic value) {
    if (value == null) return true;
    if (value is bool) return value;
    if (value is num) return value > 0;
    if (value is String) {
      final normalized = value.trim().toLowerCase();
      if (normalized == 'true' || normalized == '1') return true;
      if (normalized == 'false' || normalized == '0') return false;
      final asNumber = int.tryParse(normalized);
      if (asNumber != null) return asNumber > 0;
    }
    return true;
  }

  static double _parsePrice(dynamic value) {
    if (value is num) return value.toDouble();
    if (value is String) return double.tryParse(value) ?? 0;
    return 0;
  }

  static List<String> _parseImages(dynamic value) {
    if (value == null) return [];
    if (value is List) {
      return value.map((e) => e.toString()).where((s) => s.isNotEmpty).toList();
    }
    if (value is String) {
      final trimmed = value.trim();
      if (trimmed.isEmpty || trimmed == '[]') return [];
      try {
        final decoded = jsonDecode(trimmed);
        if (decoded is List) {
          return decoded
              .map((e) => e.toString())
              .where((s) => s.isNotEmpty)
              .toList();
        }
      } catch (_) {}
    }
    return [];
  }
}
