import 'dart:math';

import 'package:get/get.dart';

import '../../core/network/api_client.dart';
import '../../data/models/category.dart';
import '../../data/models/product.dart';
import '../../data/repositories/category_repository.dart';
import '../../data/repositories/product_repository.dart';
import 'models/product_comparison.dart';

class ProductsController extends GetxController {
  ProductsController(this._productRepository, this._categoryRepository);

  final ProductRepository _productRepository;
  final CategoryRepository _categoryRepository;
  final _random = Random();

  final products = <Product>[].obs;
  final categories = <Category>[].obs;
  final selectedCategoryId = RxnString();
  final searchQuery = ''.obs;
  final sections = <CategoryProductSection>[].obs;
  final productCount = 0.obs;
  final isLoading = true.obs;
  final error = RxnString();

  @override
  void onInit() {
    super.onInit();
    loadAll();
  }

  Future<void> loadAll() async {
    isLoading.value = true;
    error.value = null;
    try {
      final results = await Future.wait([
        _productRepository.getProducts(),
        _categoryRepository.getCategories(),
      ]);
      products.assignAll(results[0] as List<Product>);
      categories.assignAll(results[1] as List<Category>);
      _rebuildSections();
    } on ApiException catch (e) {
      error.value = e.message;
    } catch (_) {
      error.value =
          'Could not load products. Check your connection and API URL.';
    } finally {
      isLoading.value = false;
    }
  }

  void selectCategory(String? categoryId) {
    selectedCategoryId.value = categoryId;
    _rebuildSections();
  }

  void setSearchQuery(String query) {
    final trimmed = query.trim();
    if (searchQuery.value == trimmed) return;
    searchQuery.value = trimmed;
    _rebuildSections();
  }

  void _rebuildSections() {
    final filtered = _filteredProducts();
    productCount.value = filtered.length;
    sections.assignAll(_buildCategorySections(filtered));
  }

  List<Product> _filteredProducts() {
    var result = products.toList();

    final id = selectedCategoryId.value;
    if (id != null) {
      result = result.where((p) => p.categoryId == id).toList();
    }

    final query = searchQuery.value.toLowerCase();
    if (query.isNotEmpty) {
      result = result.where((p) {
        final name = p.productName.toLowerCase();
        final brand = p.brand?.toLowerCase() ?? '';
        return name.contains(query) || brand.contains(query);
      }).toList();
    }

    return result;
  }

  List<CategoryProductSection> _buildCategorySections(List<Product> items) {
    if (items.isEmpty) return [];

    final productsByCategory = <String, List<Product>>{};
    final categoryNames = <String, String>{};
    final categorySlugs = <String, String?>{};

    for (final product in items) {
      final categoryId = product.categoryId;
      categoryNames[categoryId] = product.categoryName;
      categorySlugs[categoryId] ??= product.category?.slug;
      productsByCategory.putIfAbsent(categoryId, () => []).add(product);
    }

    final categoryOrder = categories.map((c) => c.id).toList();
    final slugById = {for (final c in categories) c.id: c.slug};
    final allCategoryIds = productsByCategory.keys.toSet();

    final selectedId = selectedCategoryId.value;
    final orderedIds = selectedId != null
        ? [selectedId]
        : [
            ...categoryOrder.where(allCategoryIds.contains),
            ...allCategoryIds.where((id) => !categoryOrder.contains(id)),
          ];

    final result = <CategoryProductSection>[];
    for (final id in orderedIds) {
      final categoryProducts = List<Product>.from(productsByCategory[id] ?? []);
      categoryProducts.sort((a, b) => a.productName.compareTo(b.productName));
      categoryProducts.shuffle(_random);
      final rows = chunkProductsIntoPairs(categoryProducts);

      if (rows.isEmpty) continue;

      result.add(
        CategoryProductSection(
          categoryId: id,
          categoryName: categoryNames[id] ?? '—',
          categorySlug: slugById[id] ?? categorySlugs[id],
          comparisons: const [],
          singleProductRows: rows,
        ),
      );
    }

    return result;
  }

  @override
  Future<void> refresh() => loadAll();
}
