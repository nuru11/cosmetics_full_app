import '../../../data/models/product.dart';
import '../../../data/models/product_variant.dart';

/// Sort priority for columns in a same-name comparison row.
const productVersionOrder = ['ORIGINAL', 'TWO_LEVEL', 'PREMIUM'];

class ProductVersionSlot {
  const ProductVersionSlot({
    required this.versionKey,
    required this.displayLabel,
    required this.product,
    required this.variant,
    required this.defaultSubtitle,
  });

  final String versionKey;
  final String displayLabel;
  final Product product;
  final ProductVariant variant;
  final String defaultSubtitle;

  static String labelFor(String versionKey) {
    switch (versionKey.toUpperCase()) {
      case 'ORIGINAL':
        return 'ORIGINAL';
      case 'TWO_LEVEL':
        return '2ND';
      case 'PREMIUM':
        return 'PREMIUM';
      default:
        return versionKey;
    }
  }

  static String defaultSubtitleFor(String versionKey) {
    switch (versionKey.toUpperCase()) {
      case 'ORIGINAL':
        return 'Authentic sealed, full box';
      case 'TWO_LEVEL':
        return 'Same product, no box';
      case 'PREMIUM':
        return 'Premium / limited edition';
      default:
        return '';
    }
  }

  factory ProductVersionSlot.fromVariant({
    required Product product,
    required ProductVariant variant,
    required String displayLabel,
  }) {
    final key = variant.productVersion.toUpperCase();
    return ProductVersionSlot(
      versionKey: key,
      displayLabel: displayLabel,
      product: product,
      variant: variant,
      defaultSubtitle: variant.variantDescription?.trim().isNotEmpty == true
          ? variant.variantDescription!.trim()
          : defaultSubtitleFor(key),
    );
  }
}

List<ProductVersionSlot> slotsFromVariants(Product product) {
  final indexed = product.variants.asMap().entries.toList();
  indexed.sort((a, b) {
    final va = a.value.productVersion.toUpperCase();
    final vb = b.value.productVersion.toUpperCase();
    final ia = productVersionOrder.indexOf(va);
    final ib = productVersionOrder.indexOf(vb);
    final oa = ia >= 0 ? ia : productVersionOrder.length;
    final ob = ib >= 0 ? ib : productVersionOrder.length;
    if (oa != ob) return oa.compareTo(ob);
    return a.key.compareTo(b.key);
  });

  final versionOccurrence = <String, int>{};
  return indexed.map((entry) {
    final variant = entry.value;
    final key = variant.productVersion.toUpperCase();
    versionOccurrence[key] = (versionOccurrence[key] ?? 0) + 1;
    final n = versionOccurrence[key]!;
    final baseLabel = ProductVersionSlot.labelFor(key);
    final displayLabel = n > 1 ? '$baseLabel · $n' : baseLabel;

    return ProductVersionSlot.fromVariant(
      product: product,
      variant: variant,
      displayLabel: displayLabel,
    );
  }).toList();
}

class ProductComparison {
  const ProductComparison({
    required this.product,
    required this.productName,
    required this.categoryId,
    required this.categoryName,
    required this.versions,
    this.brand,
  });

  final Product product;
  final String? brand;
  final String productName;
  final String categoryId;
  final String categoryName;
  final List<ProductVersionSlot> versions;

  factory ProductComparison.fromProduct(Product product) {
    return ProductComparison(
      product: product,
      brand: product.brand,
      productName: product.productName,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      versions: slotsFromVariants(product),
    );
  }

  String get displayBrand =>
      (brand != null && brand!.isNotEmpty) ? brand!.toUpperCase() : '—';

  ProductVariant? get originalVariant {
    for (final slot in versions) {
      if (slot.versionKey == 'ORIGINAL') return slot.variant;
    }
    return versions.isNotEmpty ? versions.first.variant : null;
  }

  int? savingsPercentVersusOriginal(ProductVariant versionVariant) {
    final orig = originalVariant?.price;
    final price = versionVariant.price;
    if (orig == null || orig <= 0 || price >= orig) return null;
    return (((orig - price) / orig) * 100).round();
  }

  String? get navigateProductId => product.id;

  bool get showScrollHint => versions.length > 1;
}

class CategoryProductSection {
  const CategoryProductSection({
    required this.categoryId,
    required this.categoryName,
    required this.categorySlug,
    required this.comparisons,
    required this.singleProductRows,
  });

  final String categoryId;
  final String categoryName;
  final String? categorySlug;
  final List<ProductComparison> comparisons;
  final List<List<Product>> singleProductRows;

  bool get isEmpty => comparisons.isEmpty && singleProductRows.isEmpty;
}

/// Chunks products into rows of 2 for the grid layout.
List<List<Product>> chunkProductsIntoPairs(List<Product> products) {
  final rows = <List<Product>>[];
  for (var i = 0; i < products.length; i += 2) {
    if (i + 1 < products.length) {
      rows.add([products[i], products[i + 1]]);
    } else {
      rows.add([products[i]]);
    }
  }
  return rows;
}
