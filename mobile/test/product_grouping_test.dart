import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/data/models/product.dart';
import 'package:mobile/data/models/product_variant.dart';
import 'package:mobile/modules/products/models/product_comparison.dart';

Product _product({
  required String id,
  required String name,
  required String categoryId,
  required List<ProductVariant> variants,
  String brand = 'DIOR',
}) {
  return Product(
    id: id,
    productName: name,
    categoryId: categoryId,
    categoryName: 'Fragrance',
    gender: 'UNISEX',
    status: 'ACTIVE',
    variants: variants,
    brand: brand,
  );
}

ProductVariant _variant({
  required String id,
  String version = 'ORIGINAL',
  double price = 100,
  String? description,
}) {
  return ProductVariant(
    id: id,
    price: price,
    productVersion: version,
    stock: 1,
    variantImages: const [],
    variantDescription: description,
  );
}

void main() {
  test('chunkProductsIntoPairs groups singles by two', () {
    final products = List.generate(
      5,
      (i) => _product(
        id: '$i',
        name: 'Solo $i',
        categoryId: 'c1',
        variants: [_variant(id: 'v$i')],
      ),
    );
    final rows = chunkProductsIntoPairs(products);
    expect(rows.length, 3);
    expect(rows[0].length, 2);
    expect(rows[2].length, 1);
  });

  test('slotsFromVariants includes duplicate versions', () {
    final product = _product(
      id: 'p1',
      name: 'Same',
      categoryId: 'c1',
      variants: [
        _variant(id: '1', version: 'ORIGINAL'),
        _variant(id: '2', version: 'ORIGINAL'),
        _variant(id: '3', version: 'TWO_LEVEL'),
      ],
    );
    final slots = slotsFromVariants(product);
    expect(slots.length, 3);
    expect(slots.where((s) => s.versionKey == 'ORIGINAL').length, 2);
    expect(slots[0].displayLabel, 'ORIGINAL');
    expect(slots[1].displayLabel, 'ORIGINAL · 2');
  });

  test('slotsFromVariants labels duplicate TWO_LEVEL columns', () {
    final product = _product(
      id: 'p1',
      name: 'Same',
      categoryId: 'c1',
      variants: [
        _variant(id: '1', version: 'ORIGINAL'),
        _variant(id: '2', version: 'TWO_LEVEL'),
        _variant(id: '3', version: 'TWO_LEVEL'),
      ],
    );
    final slots = slotsFromVariants(product);
    expect(slots.length, 3);
    expect(slots[1].displayLabel, '2ND');
    expect(slots[2].displayLabel, '2ND · 2');
  });

  test('expandProductsToListingEntries emits one entry per variant', () {
    final product = _product(
      id: 'p1',
      name: 'Rose',
      categoryId: 'c1',
      variants: [
        _variant(id: 'v1', version: 'ORIGINAL'),
        _variant(id: 'v2', version: 'TWO_LEVEL'),
        _variant(id: 'v3', version: 'PREMIUM'),
      ],
    );
    final entries = expandProductsToListingEntries([product]);
    expect(entries.length, 3);
    expect(entries.map((e) => e.variant.id).toList(), ['v1', 'v2', 'v3']);
  });

  test('expandProductsToListingEntries keeps single-variant products as one entry', () {
    final product = _product(
      id: 'p1',
      name: 'Solo',
      categoryId: 'c1',
      variants: [_variant(id: 'v1')],
    );
    final entries = expandProductsToListingEntries([product]);
    expect(entries.length, 1);
    expect(entries.first.variant.id, 'v1');
  });

  test('expandProductsToListingEntries sums variants across products', () {
    final products = [
      _product(
        id: 'p1',
        name: 'A',
        categoryId: 'c1',
        variants: [
          _variant(id: 'v1'),
          _variant(id: 'v2'),
        ],
      ),
      _product(
        id: 'p2',
        name: 'B',
        categoryId: 'c1',
        variants: [_variant(id: 'v3')],
      ),
    ];
    expect(expandProductsToListingEntries(products).length, 3);
  });

  test('chunkListingEntriesIntoPairs groups entries by two', () {
    final product = _product(
      id: 'p1',
      name: 'Rose',
      categoryId: 'c1',
      variants: List.generate(
        5,
        (i) => _variant(id: 'v$i'),
      ),
    );
    final entries = expandProductsToListingEntries([product]);
    final rows = chunkListingEntriesIntoPairs(entries);
    expect(rows.length, 3);
    expect(rows[0].length, 2);
    expect(rows[2].length, 1);
  });

  test('ProductComparison.fromProduct uses parent product id for navigation', () {
    final product = _product(
      id: 'parent-1',
      name: 'Rose',
      categoryId: 'c1',
      variants: [
        _variant(id: 'v1', version: 'ORIGINAL'),
        _variant(id: 'v2', version: 'TWO_LEVEL'),
      ],
    );
    final comparison = ProductComparison.fromProduct(product);
    expect(comparison.navigateProductId, 'parent-1');
    expect(comparison.versions.length, 2);
  });
}
