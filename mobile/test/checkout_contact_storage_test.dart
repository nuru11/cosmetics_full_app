import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/data/services/checkout_contact_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  test('load returns empty contact when unset', () async {
    final storage = await CheckoutContactStorage.create();
    expect(storage.load().isEmpty, isTrue);
  });

  test('save and load round-trips contact', () async {
    final storage = await CheckoutContactStorage.create();
    await storage.save(
      const CheckoutContact(
        name: 'Sara',
        phone: '+96170123456',
        city: 'Beirut',
      ),
    );
    final loaded = storage.load();
    expect(loaded.name, 'Sara');
    expect(loaded.phone, '+96170123456');
    expect(loaded.city, 'Beirut');
  });

  test('save trims whitespace', () async {
    final storage = await CheckoutContactStorage.create();
    await storage.save(
      const CheckoutContact(
        name: '  Sara  ',
        phone: ' 123 ',
        city: ' City ',
      ),
    );
    final loaded = storage.load();
    expect(loaded.name, 'Sara');
    expect(loaded.phone, '123');
    expect(loaded.city, 'City');
  });
}
