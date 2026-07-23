import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/l10n/l10n_helpers.dart';
import '../../core/theme/app_colors.dart';
import 'order_list_widgets.dart';
import 'order_status_filter.dart';
import 'orders_controller.dart';

class OrdersView extends GetView<OrdersController> {
  const OrdersView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.brandWhite,
      appBar: AppBar(
        centerTitle: false,
        elevation: 0,
        scrolledUnderElevation: 0,
        title: Text(
          'orders.title'.tr,
          style: GoogleFonts.playfairDisplay(
            fontSize: 24,
            fontWeight: FontWeight.w600,
            color: AppColors.brandWhite,
          ),
        ),
        backgroundColor: AppColors.brandBlue,
        foregroundColor: AppColors.brandWhite,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(52),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            child: Obx(
              () => Row(
                children: [
                  _FilterChip(
                    label: 'orders.filter_all'.tr,
                    selected: controller.filter.value == OrdersTabFilter.all,
                    onTap: () => controller.setFilter(OrdersTabFilter.all),
                  ),
                  const SizedBox(width: 8),
                  _FilterChip(
                    label: 'orders.filter_active'.tr,
                    selected: controller.filter.value == OrdersTabFilter.active,
                    onTap: () => controller.setFilter(OrdersTabFilter.active),
                  ),
                  const SizedBox(width: 8),
                  _FilterChip(
                    label: 'orders.filter_past'.tr,
                    selected: controller.filter.value == OrdersTabFilter.past,
                    onTap: () => controller.setFilter(OrdersTabFilter.past),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      body: Obx(() {
        if (controller.isLoading.value && controller.orders.isEmpty) {
          return const Center(
            child: CircularProgressIndicator(color: AppColors.brandBlue),
          );
        }

        if (controller.error.value != null && controller.orders.isEmpty) {
          return OrderListErrorState(
            message: trLocalizedError(controller.error.value),
            onRetry: controller.loadOrders,
          );
        }

        if (controller.orders.isEmpty) {
          return OrderListEmptyState(
            title: 'orders.empty_title'.tr,
            message: 'orders.empty_message'.tr,
          );
        }

        final list = controller.filteredOrders;
        if (list.isEmpty) {
          return _FilteredEmptyState(filter: controller.filter.value);
        }

        return RefreshIndicator(
          color: AppColors.brandBlue,
          onRefresh: controller.loadOrders,
          child: ListView.separated(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(16),
            itemCount: list.length,
            separatorBuilder: (_, index) => const SizedBox(height: 16),
            itemBuilder: (context, index) {
              return OrderCard(order: list[index]);
            },
          ),
        );
      }),
    );
  }
}

class _FilterChip extends StatelessWidget {
  const _FilterChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Material(
        color: selected
            ? AppColors.brandWhite
            : AppColors.brandWhite.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(20),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Text(
              label,
              textAlign: TextAlign.center,
              style: GoogleFonts.montserrat(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: selected ? AppColors.brandBlue : AppColors.brandWhite,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _FilteredEmptyState extends StatelessWidget {
  const _FilteredEmptyState({required this.filter});

  final OrdersTabFilter filter;

  @override
  Widget build(BuildContext context) {
    final (titleKey, messageKey) = switch (filter) {
      OrdersTabFilter.active => ('orders.no_active', 'orders.no_active_message'),
      OrdersTabFilter.past => ('orders.no_past', 'orders.no_past_message'),
      OrdersTabFilter.all => ('orders.empty_title', 'orders.empty_message'),
    };

    return OrderListEmptyState(
      title: titleKey.tr,
      message: messageKey.tr,
    );
  }
}
