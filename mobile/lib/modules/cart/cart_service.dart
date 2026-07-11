import 'package:get/get.dart';

import '../../data/models/cart_line.dart';
import '../../data/services/cart_storage.dart';

class CartService extends GetxService {
  CartService([CartStorage? storage]) : _storage = storage;

  CartStorage? _storage;

  /// Newest-added variant lines first.
  final lines = <CartLine>[].obs;

  Future<CartService> init() async {
    _storage ??= await CartStorage.create();
    lines.assignAll(_storage!.loadLines());
    return this;
  }

  int quantityFor(String variantId) {
    for (final line in lines) {
      if (line.variantId == variantId) return line.quantity;
    }
    return 0;
  }

  int get totalItemCount =>
      lines.fold<int>(0, (sum, line) => sum + line.quantity);

  int get totalItemCountForHomeCartIcon => lines.length.toInt();

  Future<void> add(String variantId, {int quantity = 1}) async {
    if (variantId.isEmpty || quantity < 1) return;

    final list = lines.toList();
    final index = list.indexWhere((l) => l.variantId == variantId);
    if (index >= 0) {
      final existing = list.removeAt(index);
      list.insert(
        0,
        existing.copyWith(quantity: existing.quantity + quantity),
      );
    } else {
      list.insert(0, CartLine(variantId: variantId, quantity: quantity));
    }
    lines.assignAll(list);
    await _persist();
  }

  Future<void> setQuantity(String variantId, int quantity) async {
    if (variantId.isEmpty) return;

    final list = lines.toList();
    final index = list.indexWhere((l) => l.variantId == variantId);
    if (index < 0) return;

    if (quantity < 1) {
      list.removeAt(index);
    } else {
      list[index] = list[index].copyWith(quantity: quantity);
    }
    lines.assignAll(list);
    await _persist();
  }

  Future<void> remove(String variantId) async {
    final list = lines.where((l) => l.variantId != variantId).toList();
    if (list.length == lines.length) return;
    lines.assignAll(list);
    await _persist();
  }

  Future<void> clear() async {
    if (lines.isEmpty) return;
    lines.clear();
    await _persist();
  }

  Future<void> pruneInvalid(Set<String> validVariantIds) async {
    final next =
        lines.where((l) => validVariantIds.contains(l.variantId)).toList();
    if (next.length != lines.length) {
      lines.assignAll(next);
      await _persist();
    }
  }

  Future<void> _persist() async {
    await _storage?.saveLines(lines.toList());
  }
}
