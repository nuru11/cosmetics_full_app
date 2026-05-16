import '../models/product.dart';
import '../services/product_api.dart';

class ProductRepository {
  ProductRepository(this._api);

  final ProductApi _api;

  Future<List<Product>> getProducts() => _api.fetchProducts();

  Future<Product> getProductById(String id) => _api.fetchProductById(id);
}
