import 'package:get/get.dart';

import '../../data/models/cart_line.dart';
import '../../data/services/cart_storage.dart';

class CartService extends GetxService {
  CartService([CartStorage? storage]) : _storage = storage;

  CartStorage? _storage;

  /// Newest-added product lines first.
  final lines = <CartLine>[].obs;

  Future<CartService> init() async {
    _storage ??= await CartStorage.create();
    lines.assignAll(_storage!.loadLines());
    return this;
  }

  int quantityFor(String productId) {
    for (final line in lines) {
      if (line.productId == productId) return line.quantity;
    }
    return 0;
  }

  int get totalItemCount =>
      lines.fold<int>(0, (sum, line) => sum + line.quantity);

      int get totalItemCountForHomeCartIcon => lines.length.toInt();

  /// Adds [quantity] (default 1). Merges with existing line; moves line to front.
  Future<void> add(String productId, {int quantity = 1}) async {
    if (productId.isEmpty || quantity < 1) return;

    final list = lines.toList();
    final index = list.indexWhere((l) => l.productId == productId);
    if (index >= 0) {
      final existing = list.removeAt(index);
      list.insert(
        0,
        existing.copyWith(quantity: existing.quantity + quantity),
      );
    } else {
      list.insert(0, CartLine(productId: productId, quantity: quantity));
    }
    lines.assignAll(list);
    await _persist();
  }

  Future<void> setQuantity(String productId, int quantity) async {
    if (productId.isEmpty) return;

    final list = lines.toList();
    final index = list.indexWhere((l) => l.productId == productId);
    if (index < 0) return;

    if (quantity < 1) {
      list.removeAt(index);
    } else {
      list[index] = list[index].copyWith(quantity: quantity);
    }
    lines.assignAll(list);
    await _persist();
  }

  Future<void> remove(String productId) async {
    final list = lines.where((l) => l.productId != productId).toList();
    if (list.length == lines.length) return;
    lines.assignAll(list);
    await _persist();
  }

  Future<void> clear() async {
    if (lines.isEmpty) return;
    lines.clear();
    await _persist();
  }

  Future<void> pruneInvalid(Set<String> validProductIds) async {
    final next =
        lines.where((l) => validProductIds.contains(l.productId)).toList();
    if (next.length != lines.length) {
      lines.assignAll(next);
      await _persist();
    }
  }

  Future<void> _persist() async {
    await _storage?.saveLines(lines.toList());
  }
}
