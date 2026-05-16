import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/data/services/wishlist_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  test('loadIds returns empty when unset', () async {
    final storage = await WishlistStorage.create();
    expect(storage.loadIds(), isEmpty);
  });

  test('saveIds round-trips and deduplicates while preserving order', () async {
    final storage = await WishlistStorage.create();
    await storage.saveIds(['b', 'a', 'a', 'c']);
    expect(storage.loadIds(), ['b', 'a', 'c']);
  });

  test('saveIds empty clears list', () async {
    final storage = await WishlistStorage.create();
    await storage.saveIds(['x']);
    await storage.saveIds([]);
    expect(storage.loadIds(), isEmpty);
  });
}
