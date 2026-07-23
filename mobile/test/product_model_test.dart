import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/config/api_config.dart';
import 'package:mobile/core/utils/image_url.dart';
import 'package:mobile/data/models/product.dart';

void main() {
  test('Product.fromJson parses API shape with variants', () {
    final product = Product.fromJson({
      'id': 'abc-123',
      'productName': 'Rose Lip Balm',
      'productDescription': 'Moisturizing balm',
      'categoryId': 'cat-1',
      'category': {'id': 'cat-1', 'name': 'Lips', 'slug': 'lips'},
      'gender': 'UNISEX',
      'brand': 'Glow',
      'status': 'ACTIVE',
      'displayPrice': '19.99',
      'displayImage': '/uploads/products/img.jpg',
      'variants': [
        {
          'id': 'var-1',
          'variantDescription': '3.3 Oz',
          'price': '19.99',
          'inStock': true,
          'productVersion': 'ORIGINAL',
          'variantImages': ['/uploads/products/img.jpg'],
        },
      ],
    });

    expect(product.productName, 'Rose Lip Balm');
    expect(product.categoryName, 'Lips');
    expect(product.price, 19.99);
    expect(product.primaryImage, '/uploads/products/img.jpg');
    expect(product.variants.length, 1);
    expect(product.variants.first.displayLabel, '3.3 Oz');
  });

  test('Product.fromJson reads snake_case fields', () {
    final product = Product.fromJson({
      'id': 'x',
      'product_name': 'Miss Dior',
      'category_id': 'cat-1',
      'variants': [
        {
          'id': 'v1',
          'price': 99,
          'product_version': 'PREMIUM',
          'inStock': true,
        },
      ],
    });

    expect(product.productName, 'Miss Dior');
    expect(product.categoryId, 'cat-1');
    expect(product.variants.first.productVersion, 'PREMIUM');
  });

  test('Product.fromJson parses variantImages JSON string', () {
    final product = Product.fromJson({
      'id': 'x',
      'productName': 'Test',
      'categoryId': 'c1',
      'variants': [
        {
          'id': 'v1',
          'price': 10,
          'variant_images':
              '["http://localhost:3000/uploads/products/img.png"]',
        },
      ],
    });

    expect(product.variants.first.variantImages.length, 1);
    expect(
      product.variants.first.variantImages.first,
      'http://localhost:3000/uploads/products/img.png',
    );
  });

  test('resolveImageUrl returns empty for missing urls', () {
    expect(resolveImageUrl(null), '');
    expect(resolveImageUrl(''), '');
    expect(resolveImageUrl('   '), '');
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
