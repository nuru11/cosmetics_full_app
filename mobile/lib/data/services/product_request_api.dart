import '../../core/network/api_client.dart';

class ProductRequestApi {
  ProductRequestApi(this._client);

  final ApiClient _client;

  Future<void> submit({
    required String description,
    required String customerName,
    required String phone,
    required String city,
    String? imageBase64,
  }) async {
    final body = <String, dynamic>{
      'description': description,
      'customerName': customerName,
      'phone': phone,
      'city': city,
    };
    if (imageBase64 != null && imageBase64.isNotEmpty) {
      body['imageBase64'] = imageBase64;
    }

    await _client.postJson('product-requests', body: body);
  }
}
