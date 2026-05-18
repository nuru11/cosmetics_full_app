bool isActiveOrderStatus(String status) {
  final s = status.toUpperCase();
  return s == 'PENDING' || s == 'PAID' || s == 'SHIPPED';
}

bool isHistoryOrderStatus(String status) {
  final s = status.toUpperCase();
  return s == 'DELIVERED' || s == 'CANCELLED';
}

enum OrderListFilter { active, history }

bool orderMatchesFilter(String status, OrderListFilter filter) {
  switch (filter) {
    case OrderListFilter.active:
      return isActiveOrderStatus(status);
    case OrderListFilter.history:
      return isHistoryOrderStatus(status);
  }
}
