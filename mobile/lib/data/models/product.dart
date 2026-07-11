import 'category.dart';
import 'product_variant.dart';

typedef ProductGender = String;
typedef ProductStatus = String;

class Product {
  const Product({
    required this.id,
    required this.productName,
    required this.categoryId,
    required this.categoryName,
    required this.gender,
    required this.status,
    required this.variants,
    this.productDescription,
    this.brand,
    this.category,
    this.displayPrice,
    this.displayPriceMax,
    this.displayImage,
    this.variantCount,
  });

  final String id;
  final String productName;
  final String? productDescription;
  final String categoryId;
  final String categoryName;
  final Category? category;
  final ProductGender gender;
  final String? brand;
  final ProductStatus status;
  final List<ProductVariant> variants;
  final double? displayPrice;
  final double? displayPriceMax;
  final String? displayImage;
  final int? variantCount;

  ProductVariant? get defaultVariant =>
      variants.isNotEmpty ? variants.first : null;

  ProductVariant? get firstInStockVariant {
    for (final variant in variants) {
      if (variant.stock > 0) return variant;
    }
    return defaultVariant;
  }

  double get price => displayPrice ?? defaultVariant?.price ?? 0;

  int get stock => variants.fold<int>(0, (sum, v) => sum + v.stock);

  String? get primaryImage => displayImage ?? defaultVariant?.primaryImage;

  List<String> get productImages {
    final selected = defaultVariant;
    if (selected != null && selected.variantImages.isNotEmpty) {
      return selected.variantImages;
    }
    return const [];
  }

  factory Product.fromJson(Map<String, dynamic> json) {
    final categoryJson = json['category'];
    Category? category;
    String categoryName = '—';
    if (categoryJson is Map<String, dynamic>) {
      category = Category.fromJson(categoryJson);
      categoryName = category.name;
    }

    final variantsJson = json['variants'];
    final variants = variantsJson is List
        ? variantsJson
            .whereType<Map>()
            .map((e) => ProductVariant.fromJson(Map<String, dynamic>.from(e)))
            .toList()
        : <ProductVariant>[];

    return Product(
      id: json['id'] as String,
      productName: (json['productName'] ?? json['product_name']) as String,
      productDescription:
          (json['productDescription'] ?? json['product_description']) as String?,
      categoryId: (json['categoryId'] ?? json['category_id']) as String,
      categoryName: categoryName,
      category: category,
      gender: json['gender'] as String? ?? 'UNISEX',
      brand: json['brand'] as String?,
      status: json['status'] as String? ?? 'ACTIVE',
      variants: variants,
      displayPrice: _parseOptionalPrice(json['displayPrice'] ?? json['display_price']),
      displayPriceMax:
          _parseOptionalPrice(json['displayPriceMax'] ?? json['display_price_max']),
      displayImage: (json['displayImage'] ?? json['display_image']) as String?,
      variantCount: json['variantCount'] as int? ?? json['variant_count'] as int?,
    );
  }

  static double? _parseOptionalPrice(dynamic value) {
    if (value == null) return null;
    if (value is num) return value.toDouble();
    if (value is String) return double.tryParse(value);
    return null;
  }
}
