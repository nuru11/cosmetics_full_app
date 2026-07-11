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

  void _rebuildSections() {
    final filtered = _filteredProducts();
    productCount.value = filtered.length;
    sections.assignAll(_buildCategorySections(filtered));
  }

  List<Product> _filteredProducts() {
    final id = selectedCategoryId.value;
    if (id == null) return products.toList();
    return products.where((p) => p.categoryId == id).toList();
  }

  List<CategoryProductSection> _buildCategorySections(List<Product> items) {
    if (items.isEmpty) return [];

    final comparisonsByCategory = <String, List<ProductComparison>>{};
    final singlesByCategory = <String, List<Product>>{};
    final categoryNames = <String, String>{};
    final categorySlugs = <String, String?>{};

    for (final product in items) {
      final categoryId = product.categoryId;
      categoryNames[categoryId] = product.categoryName;
      categorySlugs[categoryId] ??= product.category?.slug;

      if (product.variants.length >= 2) {
        comparisonsByCategory
            .putIfAbsent(categoryId, () => [])
            .add(ProductComparison.fromProduct(product));
      } else {
        singlesByCategory.putIfAbsent(categoryId, () => []).add(product);
      }
    }

    final categoryOrder = categories.map((c) => c.id).toList();
    final slugById = {for (final c in categories) c.id: c.slug};
    final allCategoryIds = {
      ...comparisonsByCategory.keys,
      ...singlesByCategory.keys,
    };

    final selectedId = selectedCategoryId.value;
    final orderedIds = selectedId != null
        ? [selectedId]
        : [
            ...categoryOrder.where(allCategoryIds.contains),
            ...allCategoryIds.where((id) => !categoryOrder.contains(id)),
          ];

    final result = <CategoryProductSection>[];
    for (final id in orderedIds) {
      final comparisons = comparisonsByCategory[id] ?? [];
      comparisons.sort((a, b) => a.productName.compareTo(b.productName));

      final singles = List<Product>.from(singlesByCategory[id] ?? []);
      singles.shuffle(_random);
      final rows = chunkProductsIntoPairs(singles);

      if (comparisons.isEmpty && rows.isEmpty) continue;

      result.add(
        CategoryProductSection(
          categoryId: id,
          categoryName: categoryNames[id] ?? '—',
          categorySlug: slugById[id] ?? categorySlugs[id],
          comparisons: comparisons,
          singleProductRows: rows,
        ),
      );
    }

    return result;
  }

  @override
  Future<void> refresh() => loadAll();
}
