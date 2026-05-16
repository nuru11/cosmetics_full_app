import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/network/api_client.dart';
import 'package:mobile/data/repositories/product_repository.dart';
import 'package:mobile/data/services/product_api.dart';

/// Run against a live API:
/// flutter test test/product_api_integration_test.dart --dart-define=API_BASE_URL=http://localhost:3000/api
void main() {
  const baseUrl = String.fromEnvironment('API_BASE_URL');
  final runIntegration = baseUrl.isNotEmpty && !baseUrl.contains('YOUR_DEPLOYED_HOST');

  if (!runIntegration) {
  test('integration skipped — pass API_BASE_URL via --dart-define', () {});
    return;
  }

  late ProductRepository repository;

  setUp(() {
    repository = ProductRepository(ProductApi(ApiClient()));
  });

  test('fetchProducts returns a list from API', () async {
    final products = await repository.getProducts();
    expect(products, isA<List>());
  }, timeout: const Timeout(Duration(seconds: 15)));
}
