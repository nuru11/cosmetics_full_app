import '../services/product_request_api.dart';

class ProductRequestRepository {
  ProductRequestRepository(this._api);

  final ProductRequestApi _api;

  Future<void> submit({
    required String description,
    required String customerName,
    required String phone,
    String? imageBase64,
  }) {
    return _api.submit(
      description: description,
      customerName: customerName,
      phone: phone,
      imageBase64: imageBase64,
    );
  }
}
