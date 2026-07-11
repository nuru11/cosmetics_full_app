import 'dart:async';

import 'package:get/get.dart';

import '../../data/models/product.dart';
import '../../data/models/product_variant.dart';
import '../products/products_controller.dart';
import 'saved_entry.dart';
import 'wishlist_service.dart';

class SavedController extends GetxController {
  SavedController(this._wishlist, this._products);

  final WishlistService _wishlist;
  final ProductsController _products;

  final rows = <List<SavedEntry>>[].obs;

  bool get hasSavedIds => _wishlist.savedVariantIds.isNotEmpty;

  bool get isCatalogLoading =>
      _products.isLoading.value && _products.products.isEmpty;

  String? get catalogError => _products.error.value;

  @override
  void onInit() {
    super.onInit();
    ever(_wishlist.savedVariantIds, (_) => _rebuild());
    ever(_products.products, (_) => _rebuild());
    ever(_products.categories, (_) => _rebuild());
    ever(_products.isLoading, (_) => _rebuild());
    _rebuild();
  }

  Map<String, ({Product product, ProductVariant variant})> _variantIndex() {
    final index = <String, ({Product product, ProductVariant variant})>{};
    for (final product in _products.products) {
      for (final variant in product.variants) {
        index[variant.id] = (product: product, variant: variant);
      }
    }
    return index;
  }

  void _rebuild() {
    if (!_products.isLoading.value &&
        _products.error.value == null &&
        _products.products.isNotEmpty) {
      final variantIds = _products.products
          .expand((p) => p.variants)
          .map((v) => v.id)
          .toSet();
      unawaited(_wishlist.pruneToValidIds(variantIds));
    }

    final order = _wishlist.savedVariantIds;
    final byVariantId = _variantIndex();

    final saved = <SavedEntry>[];
    for (final variantId in order) {
      final match = byVariantId[variantId];
      if (match != null) {
        saved.add(SavedEntry(product: match.product, variant: match.variant));
      }
    }

    if (saved.isEmpty) {
      rows.clear();
      return;
    }

    rows.assignAll(chunkSavedEntriesIntoPairs(saved));
  }

  @override
  Future<void> refresh() => _products.refresh();
}
