import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/data/services/wishlist_storage.dart';
import 'package:mobile/modules/saved/wishlist_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  test('toggle updates savedIds immediately and persists', () async {
    final storage = await WishlistStorage.create();
    final service = WishlistService(storage);
    await service.init();

    expect(service.savedIds.length, 0);

    final saved = await service.toggle('product-1');
    expect(saved, isTrue);
    expect(service.isSaved('product-1'), isTrue);
    expect(service.savedIds.length, 1);

    final reloaded = WishlistService(storage);
    await reloaded.init();
    expect(reloaded.isSaved('product-1'), isTrue);

    final removed = await reloaded.toggle('product-1');
    expect(removed, isFalse);
    expect(reloaded.savedIds.length, 0);
    expect(storage.loadIds(), isEmpty);
  });

  test('toggle updates savedIds length synchronously after assignAll', () async {
    final storage = await WishlistStorage.create();
    final service = WishlistService(storage);
    await service.init();

    await service.toggle('a');
    expect(service.savedIds.length, 1);

    await service.toggle('b');
    expect(service.savedIds.length, 2);

    await service.toggle('a');
    expect(service.savedIds.length, 1);
    expect(service.isSaved('a'), isFalse);
    expect(service.isSaved('b'), isTrue);
  });

  test('newest saved id appears first in savedIds', () async {
    final storage = await WishlistStorage.create();
    final service = WishlistService(storage);
    await service.init();

    await service.toggle('first');
    await service.toggle('second');
    await service.toggle('third');

    expect(service.savedIds, ['third', 'second', 'first']);

    final reloaded = WishlistService(storage);
    await reloaded.init();
    expect(reloaded.savedIds, ['third', 'second', 'first']);
  });

  test('pruneToValidIds drops unknown ids', () async {
    final storage = await WishlistStorage.create();
    final service = WishlistService(storage);
    await service.init();

    await service.toggle('gone');
    await service.toggle('kept');
    await service.pruneToValidIds({'kept'});

    expect(service.isSaved('gone'), isFalse);
    expect(service.isSaved('kept'), isTrue);
    expect(storage.loadIds(), ['kept']);
  });
}
