import 'dart:convert';

import 'category.dart';

typedef ProductGender = String;
typedef ProductStatus = String;
typedef ProductVersion = String;

class Product {
  const Product({
    required this.id,
    required this.productName,
    required this.categoryId,
    required this.categoryName,
    required this.price,
    required this.gender,
    required this.status,
    required this.productVersion,
    required this.stock,
    required this.productImages,
    this.productDescription,
    this.brand,
    this.color,
    this.size,
    this.sku,
    this.category,
  });

  final String id;
  final String productName;
  final String? productDescription;
  final String categoryId;
  final String categoryName;
  final Category? category;
  final double price;
  final ProductGender gender;
  final String? brand;
  final ProductStatus status;
  final ProductVersion productVersion;
  final String? color;
  final String? size;
  final int stock;
  final String? sku;
  final List<String> productImages;

  String? get primaryImage =>
      productImages.isNotEmpty ? productImages.first : null;

  factory Product.fromJson(Map<String, dynamic> json) {
    final categoryJson = json['category'];
    Category? category;
    String categoryName = '—';
    if (categoryJson is Map<String, dynamic>) {
      category = Category.fromJson(categoryJson);
      categoryName = category.name;
    }

    final productImages = _parseImages(
      json['productImages'] ?? json['product_images'],
    );

    return Product(
      id: json['id'] as String,
      productName: (json['productName'] ?? json['product_name']) as String,
      productDescription:
          (json['productDescription'] ?? json['product_description']) as String?,
      categoryId: (json['categoryId'] ?? json['category_id']) as String,
      categoryName: categoryName,
      category: category,
      price: _parsePrice(json['price']),
      gender: json['gender'] as String? ?? 'UNISEX',
      brand: json['brand'] as String?,
      status: json['status'] as String? ?? 'ACTIVE',
      productVersion: (json['productVersion'] ?? json['product_version'] as String?)
              ?.toString()
              .toUpperCase() ??
          'ORIGINAL',
      color: json['color'] as String?,
      size: json['size'] as String?,
      stock: json['stock'] as int? ?? 0,
      sku: json['sku'] as String?,
      productImages: productImages,
    );
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
