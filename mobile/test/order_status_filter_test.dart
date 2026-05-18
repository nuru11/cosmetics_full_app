import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/modules/orders/order_status_filter.dart';

void main() {
  group('isActiveOrderStatus', () {
    test('returns true for PENDING, PAID, SHIPPED', () {
      expect(isActiveOrderStatus('PENDING'), isTrue);
      expect(isActiveOrderStatus('paid'), isTrue);
      expect(isActiveOrderStatus('Shipped'), isTrue);
    });

    test('returns false for DELIVERED, CANCELLED, unknown', () {
      expect(isActiveOrderStatus('DELIVERED'), isFalse);
      expect(isActiveOrderStatus('cancelled'), isFalse);
      expect(isActiveOrderStatus(''), isFalse);
      expect(isActiveOrderStatus('UNKNOWN'), isFalse);
    });
  });

  group('isHistoryOrderStatus', () {
    test('returns true for DELIVERED and CANCELLED', () {
      expect(isHistoryOrderStatus('DELIVERED'), isTrue);
      expect(isHistoryOrderStatus('cancelled'), isTrue);
    });

    test('returns false for active and unknown statuses', () {
      expect(isHistoryOrderStatus('PENDING'), isFalse);
      expect(isHistoryOrderStatus('PAID'), isFalse);
      expect(isHistoryOrderStatus('SHIPPED'), isFalse);
      expect(isHistoryOrderStatus(''), isFalse);
    });
  });

  group('orderMatchesFilter', () {
    test('active filter matches in-progress only', () {
      expect(orderMatchesFilter('PENDING', OrderListFilter.active), isTrue);
      expect(orderMatchesFilter('DELIVERED', OrderListFilter.active), isFalse);
    });

    test('history filter matches completed only', () {
      expect(orderMatchesFilter('DELIVERED', OrderListFilter.history), isTrue);
      expect(orderMatchesFilter('PENDING', OrderListFilter.history), isFalse);
    });
  });
}
