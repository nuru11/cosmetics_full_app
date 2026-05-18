import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../models/cart_line.dart';

const cartStorageKey = 'cart_lines';

class CartStorage {
  CartStorage(this._prefs);

  final SharedPreferences _prefs;

  static Future<CartStorage> create() async {
    final prefs = await SharedPreferences.getInstance();
    return CartStorage(prefs);
  }

  List<CartLine> loadLines() {
    final raw = _prefs.getString(cartStorageKey);
    if (raw == null || raw.isEmpty) return [];
    try {
      final decoded = jsonDecode(raw);
      if (decoded is! List) return [];
      return decoded
          .whereType<Map>()
          .map((e) => CartLine.fromJson(Map<String, dynamic>.from(e)))
          .where((line) => line.productId.isNotEmpty && line.quantity > 0)
          .toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> saveLines(List<CartLine> lines) async {
    final valid = lines
        .where((l) => l.productId.isNotEmpty && l.quantity > 0)
        .map((l) => l.toJson())
        .toList();
    await _prefs.setString(cartStorageKey, jsonEncode(valid));
  }
}
