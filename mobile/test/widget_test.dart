import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:mobile/app.dart';
import 'package:mobile/modules/saved/wishlist_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  tearDown(Get.reset);

  testWidgets('App shows home header', (WidgetTester tester) async {
    await Get.putAsync<WishlistService>(() => WishlistService().init(), permanent: true);
    await tester.pumpWidget(const CosmeticsApp());
    await tester.pump();

    expect(find.text('Sahel'), findsOneWidget);
  });
}
