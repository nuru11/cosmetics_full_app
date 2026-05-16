import '../models/category.dart';
import '../services/category_api.dart';

class CategoryRepository {
  CategoryRepository(this._api);

  final CategoryApi _api;

  Future<List<Category>> getCategories() => _api.fetchCategories();
}
