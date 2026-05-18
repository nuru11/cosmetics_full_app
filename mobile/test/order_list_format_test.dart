import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/theme/app_colors.dart';
import 'package:mobile/modules/orders/order_list_widgets.dart';

void main() {
  group('formatOrderDisplayDate', () {
    test('formats as Month d, yyyy · HH:mm', () {
      final dt = DateTime(2026, 5, 12, 14, 32);
      expect(formatOrderDisplayDate(dt), 'May 12, 2026 · 14:32');
    });
  });

  group('formatOrderShortId', () {
    test('uppercases first 8 chars with hash prefix', () {
      expect(
        formatOrderShortId('abcdef12-uuid-rest'),
        '#ABCDEF12',
      );
    });

    test('handles short ids', () {
      expect(formatOrderShortId('abc'), '#ABC');
    });
  });

  group('formatOrderStatusLabel', () {
    test('title-cases status', () {
      expect(formatOrderStatusLabel('DELIVERED'), 'Delivered');
      expect(formatOrderStatusLabel('pending'), 'Pending');
    });
  });

  group('orderStatusBadgeColors', () {
    test('DELIVERED uses green palette', () {
      final colors = orderStatusBadgeColors('DELIVERED');
      expect(colors.bg, AppColors.statusDeliveredBg);
      expect(colors.fg, AppColors.statusDeliveredText);
    });

    test('PENDING uses warm palette', () {
      final colors = orderStatusBadgeColors('PENDING');
      expect(colors.bg, AppColors.statusPendingBg);
      expect(colors.fg, AppColors.statusPendingText);
    });

    test('SHIPPED uses neutral palette', () {
      final colors = orderStatusBadgeColors('SHIPPED');
      expect(colors.bg, AppColors.statusNeutralBg);
      expect(colors.fg, AppColors.statusNeutralText);
    });
  });
}
