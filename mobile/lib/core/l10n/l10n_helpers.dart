import 'package:get/get.dart';

String trItemCount(int count) {
  if (count == 1) {
    return 'cart.one_item'.trParams({'count': '$count'});
  }
  return 'cart.n_items'.trParams({'count': '$count'});
}

String trOrderStatus(String status) {
  switch (status.trim().toUpperCase()) {
    case 'PENDING':
      return 'orders.status.pending'.tr;
    case 'PAID':
      return 'orders.status.paid'.tr;
    case 'SHIPPED':
      return 'orders.status.shipped'.tr;
    case 'DELIVERED':
      return 'orders.status.delivered'.tr;
    case 'CANCELLED':
      return 'orders.status.cancelled'.tr;
    default:
      if (status.trim().isEmpty) return 'orders.status.unknown'.tr;
      return 'orders.status.unknown'.tr;
  }
}

String trVersionLabel(String versionKey) {
  switch (versionKey.toUpperCase()) {
    case 'ORIGINAL':
      return 'version.original'.tr;
    case 'TWO_LEVEL':
      return 'version.two_level'.tr;
    case 'PREMIUM':
      return 'version.premium'.tr;
    default:
      return versionKey;
  }
}

String trVersionSubtitle(String versionKey) {
  switch (versionKey.toUpperCase()) {
    case 'ORIGINAL':
      return 'version.original_subtitle'.tr;
    case 'TWO_LEVEL':
      return 'version.two_level_subtitle'.tr;
    case 'PREMIUM':
      return 'version.premium_subtitle'.tr;
    default:
      return '';
  }
}

String trLocalizedError(String? message) {
  if (message == null || message.isEmpty) return '';
  if (message.startsWith('error.')) return message.tr;
  return message;
}
