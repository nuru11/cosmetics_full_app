bool isActiveOrderStatus(String status) {
  final s = status.toUpperCase();
  return s == 'PENDING' || s == 'PAID' || s == 'SHIPPED';
}

bool isHistoryOrderStatus(String status) {
  final s = status.toUpperCase();
  return s == 'DELIVERED' || s == 'CANCELLED';
}

enum OrderListFilter { active, history }

enum OrdersTabFilter { all, active, past }

bool orderMatchesFilter(String status, OrderListFilter filter) {
  switch (filter) {
    case OrderListFilter.active:
      return isActiveOrderStatus(status);
    case OrderListFilter.history:
      return isHistoryOrderStatus(status);
  }
}

bool orderMatchesTabFilter(String status, OrdersTabFilter filter) {
  switch (filter) {
    case OrdersTabFilter.all:
      return true;
    case OrdersTabFilter.active:
      return isActiveOrderStatus(status);
    case OrdersTabFilter.past:
      return isHistoryOrderStatus(status);
  }
}
