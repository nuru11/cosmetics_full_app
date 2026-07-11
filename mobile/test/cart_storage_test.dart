import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/data/models/cart_line.dart';
import 'package:mobile/data/services/cart_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  test('loadLines returns empty when unset', () async {
    final storage = await CartStorage.create();
    expect(storage.loadLines(), isEmpty);
  });

  test('saveLines round-trips cart lines', () async {
    final storage = await CartStorage.create();
    await storage.saveLines([
      const CartLine(variantId: 'a', quantity: 2),
      const CartLine(variantId: 'b', quantity: 1),
    ]);
    final loaded = storage.loadLines();
    expect(loaded.length, 2);
    expect(loaded[0].variantId, 'a');
    expect(loaded[0].quantity, 2);
    expect(loaded[1].variantId, 'b');
  });

  test('loadLines filters invalid entries', () async {
    final storage = await CartStorage.create();
    await storage.saveLines([
      const CartLine(variantId: '', quantity: 1),
      const CartLine(variantId: 'ok', quantity: 0),
    ]);
    expect(storage.loadLines(), isEmpty);
  });

  test('saveLines empty clears cart', () async {
    final storage = await CartStorage.create();
    await storage.saveLines([const CartLine(variantId: 'x', quantity: 1)]);
    await storage.saveLines([]);
    expect(storage.loadLines(), isEmpty);
  });
}
