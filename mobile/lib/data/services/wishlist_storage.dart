import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

const wishlistStorageKey = 'saved_variant_ids_v1';

class WishlistStorage {
  WishlistStorage(this._prefs);

  final SharedPreferences _prefs;

  static Future<WishlistStorage> create() async {
    final prefs = await SharedPreferences.getInstance();
    return WishlistStorage(prefs);
  }

  /// Newest saved variant IDs first.
  List<String> loadIds() {
    final raw = _prefs.getString(wishlistStorageKey);
    if (raw == null || raw.isEmpty) return [];
    try {
      final decoded = jsonDecode(raw);
      if (decoded is! List) return [];
      return decoded.map((e) => e.toString()).where((s) => s.isNotEmpty).toList();
    } catch (_) {
      return [];
    }
  }

  /// Perserves list order (newest-first); skips duplicate IDs.
  Future<void> saveIds(List<String> ids) async {
    final seen = <String>{};
    final unique = <String>[];
    for (final id in ids) {
      if (seen.add(id)) unique.add(id);
    }
    await _prefs.setString(wishlistStorageKey, jsonEncode(unique));
  }
}
