import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/theme/app_colors.dart';
import 'order_list_widgets.dart';
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
          'Orders',
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

        if (controller.orders.isEmpty) {
          return const OrderListEmptyState(
            title: 'No orders yet',
            message: 'Your placed orders will appear here.',
          );
        }

        return RefreshIndicator(
          color: AppColors.brandBlue,
          onRefresh: controller.loadOrders,
          child: ListView.separated(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(16),
            itemCount: controller.orders.length,
            separatorBuilder: (_, __) => const SizedBox(height: 16),
            itemBuilder: (context, index) {
              return OrderCard(order: controller.orders[index]);
            },
          ),
        );
      }),
    );
  }
}
