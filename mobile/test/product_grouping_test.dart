import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/data/models/product.dart';
import 'package:mobile/modules/products/models/product_comparison.dart';

Product _p({
  required String id,
  required String name,
  required String categoryId,
  String version = 'ORIGINAL',
  String brand = 'DIOR',
}) {
  return Product(
    id: id,
    productName: name,
    categoryId: categoryId,
    categoryName: 'Fragrance',
    price: 100,
    gender: 'UNISEX',
    status: 'ACTIVE',
    productVersion: version,
    stock: 1,
    productImages: const [],
    brand: brand,
  );
}

void main() {
  test('chunkProductsIntoPairs groups singles by two', () {
    final products = List.generate(5, (i) => _p(id: '$i', name: 'Solo $i', categoryId: 'c1'));
    final rows = chunkProductsIntoPairs(products);
    expect(rows.length, 3);
    expect(rows[0].length, 2);
    expect(rows[2].length, 1);
  });

  test('slotsFromProductGroup includes duplicate versions', () {
    final group = [
      _p(id: '1', name: 'Same', categoryId: 'c1', version: 'ORIGINAL'),
      _p(id: '2', name: 'Same', categoryId: 'c1', version: 'ORIGINAL'),
      _p(id: '3', name: 'Same', categoryId: 'c1', version: 'TWO_LEVEL'),
    ];
    final slots = slotsFromProductGroup(group);
    expect(slots.length, 3);
    expect(slots.where((s) => s.versionKey == 'ORIGINAL').length, 2);
    expect(slots[0].displayLabel, 'ORIGINAL');
    expect(slots[1].displayLabel, 'ORIGINAL · 2');
  });

  test('slotsFromProductGroup labels duplicate TWO_LEVEL columns', () {
    final group = [
      _p(id: '1', name: 'Same', categoryId: 'c1', version: 'ORIGINAL'),
      _p(id: '2', name: 'Same', categoryId: 'c1', version: 'TWO_LEVEL'),
      _p(id: '3', name: 'Same', categoryId: 'c1', version: 'TWO_LEVEL'),
    ];
    final slots = slotsFromProductGroup(group);
    expect(slots.length, 3);
    expect(slots[1].displayLabel, '2ND');
    expect(slots[2].displayLabel, '2ND · 2');
  });

  test('productGroupKey ignores brand so same-name rows group together', () {
    final a = _p(id: '1', name: 'Rose', categoryId: 'c1', brand: 'A');
    final b = _p(id: '2', name: 'Rose', categoryId: 'c1', brand: 'B');
    expect(productGroupKey(a), productGroupKey(b));
  });
}
