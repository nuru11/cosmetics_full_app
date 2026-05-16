import '../../../data/models/product.dart';

/// Sort priority for columns in a same-name comparison row.
const productVersionOrder = ['ORIGINAL', 'TWO_LEVEL', 'PREMIUM'];

class ProductVersionSlot {
  const ProductVersionSlot({
    required this.versionKey,
    required this.displayLabel,
    required this.product,
    required this.defaultSubtitle,
  });

  final String versionKey;
  final String displayLabel;
  final Product product;
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

  factory ProductVersionSlot.fromProduct(Product product) {
    final key = product.productVersion.toUpperCase();
    return ProductVersionSlot(
      versionKey: key,
      displayLabel: labelFor(key),
      product: product,
      defaultSubtitle: defaultSubtitleFor(key),
    );
  }
}

/// One slot per DB row in the group — duplicate versions each get their own column.
List<ProductVersionSlot> slotsFromProductGroup(List<Product> group) {
  final indexed = group.asMap().entries.toList();
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
    final product = entry.value;
    final key = product.productVersion.toUpperCase();
    versionOccurrence[key] = (versionOccurrence[key] ?? 0) + 1;
    final n = versionOccurrence[key]!;
    final baseLabel = ProductVersionSlot.labelFor(key);
    final displayLabel = n > 1 ? '$baseLabel · $n' : baseLabel;

    return ProductVersionSlot(
      versionKey: key,
      displayLabel: displayLabel,
      product: product,
      defaultSubtitle: ProductVersionSlot.defaultSubtitleFor(key),
    );
  }).toList();
}

class ProductComparison {
  const ProductComparison({
    required this.productName,
    required this.categoryId,
    required this.categoryName,
    required this.versions,
    this.brand,
  });

  final String? brand;
  final String productName;
  final String categoryId;
  final String categoryName;
  final List<ProductVersionSlot> versions;

  factory ProductComparison.fromGroup(List<Product> group) {
    final first = group.first;
    return ProductComparison(
      brand: first.brand,
      productName: first.productName,
      categoryId: first.categoryId,
      categoryName: first.categoryName,
      versions: slotsFromProductGroup(group),
    );
  }

  String get displayBrand =>
      (brand != null && brand!.isNotEmpty) ? brand!.toUpperCase() : '—';

  Product? get originalProduct {
    for (final slot in versions) {
      if (slot.versionKey == 'ORIGINAL') return slot.product;
    }
    return versions.isNotEmpty ? versions.first.product : null;
  }

  int? savingsPercentVersusOriginal(Product versionProduct) {
    final orig = originalProduct?.price;
    final price = versionProduct.price;
    if (orig == null || orig <= 0 || price >= orig) return null;
    return (((orig - price) / orig) * 100).round();
  }

  String? get navigateProductId =>
      versions.isNotEmpty ? versions.first.product.id : null;

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

String productGroupKey(Product p) {
  return '${p.categoryId}|${p.productName.trim().toLowerCase()}';
}
