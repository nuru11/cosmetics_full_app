import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/widgets/product_version_badge.dart';

void main() {
  testWidgets('shows ORIGINAL label for ORIGINAL version', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: ProductVersionBadge(versionKey: 'ORIGINAL'),
        ),
      ),
    );

    expect(find.text('ORIGINAL'), findsOneWidget);
  });

  testWidgets('shows 2ND label for TWO_LEVEL version', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: ProductVersionBadge(versionKey: 'TWO_LEVEL'),
        ),
      ),
    );

    expect(find.text('2ND'), findsOneWidget);
  });

  testWidgets('shows PREMIUM label for PREMIUM version', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: ProductVersionBadge(versionKey: 'PREMIUM'),
        ),
      ),
    );

    expect(find.text('PREMIUM'), findsOneWidget);
  });

  testWidgets('uses custom label when provided', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: ProductVersionBadge(
            versionKey: 'ORIGINAL',
            label: 'ORIGINAL · 2',
          ),
        ),
      ),
    );

    expect(find.text('ORIGINAL · 2'), findsOneWidget);
    expect(find.text('ORIGINAL'), findsNothing);
  });

  testWidgets('renders badges for all supported tiers', (tester) async {
    const tiers = ['ORIGINAL', 'TWO_LEVEL', 'PREMIUM'];

    for (final tier in tiers) {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ProductVersionBadge(versionKey: tier),
          ),
        ),
      );

      expect(find.byType(ProductVersionBadge), findsOneWidget);
      await tester.pumpWidget(const SizedBox.shrink());
    }
  });
}
