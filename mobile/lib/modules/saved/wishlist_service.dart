import 'package:get/get.dart';

import '../../data/services/wishlist_storage.dart';

class WishlistService extends GetxService {
  WishlistService([WishlistStorage? storage]) : _storage = storage;

  WishlistStorage? _storage;
  /// Product IDs, newest saved first.
  final savedIds = <String>[].obs;

  Future<WishlistService> init() async {
    _storage ??= await WishlistStorage.create();
    savedIds.assignAll(_storage!.loadIds());
    return this;
  }

  bool isSaved(String productId) => savedIds.contains(productId);

  Future<bool> toggle(String productId) async {
    final list = savedIds.toList();
    if (list.contains(productId)) {
      list.remove(productId);
      savedIds.assignAll(list);
      await _persist();
      return false;
    }

    list.insert(0, productId);
    savedIds.assignAll(list);
    await _persist();
    return true;
  }

  Future<void> pruneToValidIds(Set<String> validIds) async {
    final next = savedIds.where(validIds.contains).toList();
    if (next.length != savedIds.length) {
      savedIds.assignAll(next);
      await _persist();
    }
  }

  Future<void> _persist() async {
    await _storage?.saveIds(savedIds.toList());
  }
}
