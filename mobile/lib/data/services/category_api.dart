import '../../core/network/api_client.dart';
import '../models/category.dart';

class CategoryApi {
  CategoryApi(this._client);

  final ApiClient _client;

  Future<List<Category>> fetchCategories() async {
    final data = await _client.getJson('categories');
    final list = data['categories'];
    if (list is! List) return [];
    return list
        .whereType<Map<String, dynamic>>()
        .map(Category.fromJson)
        .toList();
  }
}
