import '../../core/network/api_client.dart';
import '../models/product.dart';

class ProductApi {
  ProductApi(this._client);

  final ApiClient _client;

  Future<List<Product>> fetchProducts() async {
    final data = await _client.getJson('products');
    final list = data['products'];
    if (list is! List) return [];
    return list
        .whereType<Map<String, dynamic>>()
        .map(Product.fromJson)
        .toList();
  }

  Future<Product> fetchProductById(String id) async {
    final data = await _client.getJson('products/$id');
    final product = data['product'];
    if (product is! Map<String, dynamic>) {
      throw ApiException('Product not found', statusCode: 404);
    }
    return Product.fromJson(product);
  }
}
