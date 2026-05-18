import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/data/services/cart_storage.dart';
import 'package:mobile/modules/cart/cart_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  test('add merges quantity and moves line to front', () async {
    final storage = await CartStorage.create();
    final service = CartService(storage);
    await service.init();

    await service.add('a');
    await service.add('b');
    await service.add('a');

    expect(service.lines.length, 2);
    expect(service.lines[0].productId, 'a');
    expect(service.lines[0].quantity, 2);
    expect(service.lines[1].productId, 'b');
    expect(service.totalItemCount, 3);
  });

  test('setQuantity removes line when below 1', () async {
    final storage = await CartStorage.create();
    final service = CartService(storage);
    await service.init();

    await service.add('a', quantity: 2);
    await service.setQuantity('a', 1);
    expect(service.quantityFor('a'), 1);

    await service.setQuantity('a', 0);
    expect(service.lines, isEmpty);
    expect(storage.loadLines(), isEmpty);
  });

  test('remove and clear update lines and persist', () async {
    final storage = await CartStorage.create();
    final service = CartService(storage);
    await service.init();

    await service.add('a');
    await service.add('b');
    await service.remove('a');
    expect(service.lines.length, 1);
    expect(service.lines.single.productId, 'b');

    await service.clear();
    expect(service.lines, isEmpty);

    final reloaded = CartService(storage);
    await reloaded.init();
    expect(reloaded.lines, isEmpty);
  });

  test('pruneInvalid drops unknown product ids', () async {
    final storage = await CartStorage.create();
    final service = CartService(storage);
    await service.init();

    await service.add('gone');
    await service.add('kept');
    await service.pruneInvalid({'kept'});

    expect(service.lines.length, 1);
    expect(service.lines.single.productId, 'kept');
    expect(storage.loadLines().single.productId, 'kept');
  });
}
