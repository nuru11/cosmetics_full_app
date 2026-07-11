import 'package:get/get.dart';

import '../../data/services/wishlist_storage.dart';

class WishlistService extends GetxService {
  WishlistService([WishlistStorage? storage]) : _storage = storage;

  WishlistStorage? _storage;

  /// Variant IDs, newest saved first.
  final savedVariantIds = <String>[].obs;

  Future<WishlistService> init() async {
    _storage ??= await WishlistStorage.create();
    savedVariantIds.assignAll(_storage!.loadIds());
    return this;
  }

  bool isSaved(String variantId) => savedVariantIds.contains(variantId);

  Future<bool> toggle(String variantId) async {
    if (variantId.isEmpty) return false;

    final list = savedVariantIds.toList();
    if (list.contains(variantId)) {
      list.remove(variantId);
      savedVariantIds.assignAll(list);
      await _persist();
      return false;
    }

    list.insert(0, variantId);
    savedVariantIds.assignAll(list);
    await _persist();
    return true;
  }

  Future<void> pruneToValidIds(Set<String> validVariantIds) async {
    final next = savedVariantIds.where(validVariantIds.contains).toList();
    if (next.length != savedVariantIds.length) {
      savedVariantIds.assignAll(next);
      await _persist();
    }
  }

  Future<void> _persist() async {
    await _storage?.saveIds(savedVariantIds.toList());
  }
}
