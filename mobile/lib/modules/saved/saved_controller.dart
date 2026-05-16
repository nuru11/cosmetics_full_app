import 'dart:async';

import 'package:get/get.dart';

import '../../data/models/product.dart';
import '../products/models/product_comparison.dart';
import '../products/products_controller.dart';
import 'wishlist_service.dart';

class SavedController extends GetxController {
  SavedController(this._wishlist, this._products);

  final WishlistService _wishlist;
  final ProductsController _products;

  final rows = <List<Product>>[].obs;

  bool get hasSavedIds => _wishlist.savedIds.isNotEmpty;

  bool get isCatalogLoading =>
      _products.isLoading.value && _products.products.isEmpty;

  String? get catalogError => _products.error.value;

  @override
  void onInit() {
    super.onInit();
    ever(_wishlist.savedIds, (_) => _rebuild());
    ever(_products.products, (_) => _rebuild());
    ever(_products.categories, (_) => _rebuild());
    ever(_products.isLoading, (_) => _rebuild());
    _rebuild();
  }

  void _rebuild() {
    if (!_products.isLoading.value &&
        _products.error.value == null &&
        _products.products.isNotEmpty) {
      final catalogIds = _products.products.map((p) => p.id).toSet();
      unawaited(_wishlist.pruneToValidIds(catalogIds));
    }

    final order = _wishlist.savedIds;
    final rank = <String, int>{
      for (var i = 0; i < order.length; i++) order[i]: i,
    };

    final saved = _products.products
        .where((p) => _wishlist.isSaved(p.id))
        .toList()
      ..sort(
        (a, b) => (rank[a.id] ?? order.length).compareTo(rank[b.id] ?? order.length),
      );

    if (saved.isEmpty) {
      rows.clear();
      return;
    }

    rows.assignAll(chunkProductsIntoPairs(saved));
  }

  @override
  Future<void> refresh() => _products.refresh();
}
