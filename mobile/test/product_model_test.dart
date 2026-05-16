import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/config/api_config.dart';
import 'package:mobile/core/utils/image_url.dart';
import 'package:mobile/data/models/product.dart';

void main() {
  test('Product.fromJson parses API shape', () {
    final product = Product.fromJson({
      'id': 'abc-123',
      'productName': 'Rose Lip Balm',
      'productDescription': 'Moisturizing balm',
      'categoryId': 'cat-1',
      'category': {'id': 'cat-1', 'name': 'Lips', 'slug': 'lips'},
      'price': '19.99',
      'gender': 'UNISEX',
      'brand': 'Glow',
      'status': 'ACTIVE',
      'productVersion': 'ORIGINAL',
      'stock': 10,
      'productImages': ['/uploads/products/img.jpg'],
    });

    expect(product.productName, 'Rose Lip Balm');
    expect(product.categoryName, 'Lips');
    expect(product.price, 19.99);
    expect(product.primaryImage, '/uploads/products/img.jpg');
  });

  test('Product.fromJson reads snake_case product_version', () {
    final product = Product.fromJson({
      'id': 'x',
      'product_name': 'Miss Dior',
      'category_id': 'cat-1',
      'price': 99,
      'product_version': 'PREMIUM',
    });

    expect(product.productName, 'Miss Dior');
    expect(product.categoryId, 'cat-1');
    expect(product.productVersion, 'PREMIUM');
  });

  test('Product.fromJson parses productImages JSON string', () {
    final product = Product.fromJson({
      'id': 'x',
      'productName': 'Test',
      'categoryId': 'c1',
      'price': 10,
      'productImages':
          '["http://localhost:3000/uploads/products/img.png"]',
    });

    expect(product.productImages.length, 1);
    expect(
      product.productImages.first,
      'http://localhost:3000/uploads/products/img.png',
    );
  });

  test('resolveProductImageUrl uses default when empty', () {
    expect(
      resolveProductImageUrl(null),
      ApiConfig.defaultProductImageUrl,
    );
    expect(
      resolveProductImageUrl(''),
      ApiConfig.defaultProductImageUrl,
    );
  });

  test('resolveImageUrl prepends origin for relative paths', () {
    expect(
      resolveImageUrl('/uploads/x.jpg'),
      '${ApiConfig.origin}/uploads/x.jpg',
    );
    expect(
      resolveImageUrl('https://cdn.example.com/a.jpg'),
      'https://cdn.example.com/a.jpg',
    );
  });
}
