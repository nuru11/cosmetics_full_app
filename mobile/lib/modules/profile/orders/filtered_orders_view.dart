import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';
import '../../orders/order_list_widgets.dart';
import 'filtered_orders_controller.dart';

class FilteredOrdersView extends GetView<FilteredOrdersController> {
  const FilteredOrdersView({
    super.key,
    required this.title,
    required this.emptyTitle,
    required this.emptyMessage,
  });

  final String title;
  final String emptyTitle;
  final String emptyMessage;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.brandWhite,
      appBar: AppBar(
        centerTitle: false,
        elevation: 0,
        scrolledUnderElevation: 0,
        title: Text(
          title,
          style: GoogleFonts.playfairDisplay(
            fontSize: 24,
            fontWeight: FontWeight.w600,
            color: AppColors.brandWhite,
          ),
        ),
        backgroundColor: AppColors.brandBlue,
        foregroundColor: AppColors.brandWhite,
      ),
      body: Obx(() {
        final list = controller.filteredOrders;

        if (controller.isLoading.value && controller.orders.isEmpty) {
          return const Center(
            child: CircularProgressIndicator(color: AppColors.brandBlue),
          );
        }

        if (controller.error.value != null && controller.orders.isEmpty) {
          return OrderListErrorState(
            message: controller.error.value!,
            onRetry: controller.loadOrders,
          );
        }

        if (list.isEmpty) {
          return OrderListEmptyState(
            title: emptyTitle,
            message: emptyMessage,
          );
        }

        return RefreshIndicator(
          color: AppColors.brandBlue,
          onRefresh: controller.loadOrders,
          child: ListView.separated(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(16),
            itemCount: list.length,
            separatorBuilder: (_, __) => const SizedBox(height: 16),
            itemBuilder: (context, index) {
              return OrderCard(order: list[index]);
            },
          ),
        );
      }),
    );
  }
}

class MyOrdersView extends GetView<FilteredOrdersController> {
  const MyOrdersView({super.key});

  @override
  Widget build(BuildContext context) {
    return const FilteredOrdersView(
      title: 'My Orders',
      emptyTitle: 'No active orders',
      emptyMessage: 'Orders in progress will appear here.',
    );
  }
}

class OrderHistoryView extends GetView<FilteredOrdersController> {
  const OrderHistoryView({super.key});

  @override
  Widget build(BuildContext context) {
    return const FilteredOrdersView(
      title: 'Order History',
      emptyTitle: 'No past orders',
      emptyMessage: 'Delivered and cancelled orders appear here.',
    );
  }
}
