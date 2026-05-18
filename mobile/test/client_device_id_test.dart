import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/device/client_device_id.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  test('resolve uses stored fallback UUID when platform id unavailable', () async {
    final service = ClientDeviceId();
    final first = await service.resolve();
    expect(first.length >= 8, isTrue);

    final second = await service.resolve();
    expect(second, first);
  });
}
