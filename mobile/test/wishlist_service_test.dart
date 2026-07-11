import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/data/services/wishlist_storage.dart';
import 'package:mobile/modules/saved/wishlist_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  test('toggle updates savedVariantIds immediately and persists', () async {
    final storage = await WishlistStorage.create();
    final service = WishlistService(storage);
    await service.init();

    expect(service.savedVariantIds.length, 0);

    final saved = await service.toggle('variant-1');
    expect(saved, isTrue);
    expect(service.isSaved('variant-1'), isTrue);
    expect(service.savedVariantIds.length, 1);

    final reloaded = WishlistService(storage);
    await reloaded.init();
    expect(reloaded.isSaved('variant-1'), isTrue);

    final removed = await reloaded.toggle('variant-1');
    expect(removed, isFalse);
    expect(reloaded.savedVariantIds.length, 0);
    expect(storage.loadIds(), isEmpty);
  });

  test('toggle updates savedVariantIds length synchronously after assignAll', () async {
    final storage = await WishlistStorage.create();
    final service = WishlistService(storage);
    await service.init();

    await service.toggle('a');
    expect(service.savedVariantIds.length, 1);

    await service.toggle('b');
    expect(service.savedVariantIds.length, 2);

    await service.toggle('a');
    expect(service.savedVariantIds.length, 1);
    expect(service.isSaved('a'), isFalse);
    expect(service.isSaved('b'), isTrue);
  });

  test('newest saved variant id appears first in savedVariantIds', () async {
    final storage = await WishlistStorage.create();
    final service = WishlistService(storage);
    await service.init();

    await service.toggle('first');
    await service.toggle('second');
    await service.toggle('third');

    expect(service.savedVariantIds, ['third', 'second', 'first']);

    final reloaded = WishlistService(storage);
    await reloaded.init();
    expect(reloaded.savedVariantIds, ['third', 'second', 'first']);
  });

  test('pruneToValidIds drops unknown variant ids', () async {
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

  test('saving one variant does not mark sibling variant as saved', () async {
    final storage = await WishlistStorage.create();
    final service = WishlistService(storage);
    await service.init();

    await service.toggle('variant-original');
    await service.toggle('variant-two-level');

    expect(service.isSaved('variant-original'), isTrue);
    expect(service.isSaved('variant-two-level'), isTrue);

    await service.toggle('variant-original');

    expect(service.isSaved('variant-original'), isFalse);
    expect(service.isSaved('variant-two-level'), isTrue);
  });
}
