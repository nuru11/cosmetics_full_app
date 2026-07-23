import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/theme/app_colors.dart';
import 'models/product_comparison.dart';
import 'products_controller.dart';
import 'widgets/product_grid_card.dart';

class SearchView extends StatefulWidget {
  const SearchView({super.key});

  @override
  State<SearchView> createState() => _SearchViewState();
}

class _SearchViewState extends State<SearchView> {
  late final TextEditingController _searchController;
  late final FocusNode _searchFocusNode;
  late final ProductsController _controller;
  String _query = '';

  @override
  void initState() {
    super.initState();
    _controller = Get.find<ProductsController>();
    _searchController = TextEditingController();
    _searchFocusNode = FocusNode();
    _searchController.addListener(_onSearchChanged);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _searchFocusNode.requestFocus();
    });
  }

  void _onSearchChanged() {
    setState(() => _query = _searchController.text);
  }

  void _clearSearch() {
    _searchController.clear();
    _searchFocusNode.requestFocus();
  }

  @override
  void dispose() {
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    _searchFocusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.homeBackground,
      appBar: AppBar(
        backgroundColor: AppColors.brandBlue,
        foregroundColor: AppColors.brandWhite,
        title: TextField(
          controller: _searchController,
          focusNode: _searchFocusNode,
          autofocus: true,
          style: GoogleFonts.montserrat(
            fontSize: 16,
            color: AppColors.brandWhite,
          ),
          decoration: InputDecoration(
            hintText: 'common.search'.tr,
            hintStyle: GoogleFonts.montserrat(
              fontSize: 16,
              color: AppColors.brandWhite.withValues(alpha: 0.7),
            ),
            border: InputBorder.none,
            isDense: true,
            contentPadding: EdgeInsets.zero,
          ),
        ),
        actions: [
          if (_query.isNotEmpty)
            IconButton(
              onPressed: _clearSearch,
              icon: const Icon(Icons.clear),
              tooltip: 'common.clear'.tr,
            ),
        ],
      ),
      body: Obx(() {
        if (_controller.isLoading.value && _controller.products.isEmpty) {
          return const Center(
            child: CircularProgressIndicator(color: AppColors.brandBlue),
          );
        }

        final trimmed = _query.trim();
        if (trimmed.isEmpty) {
          return _EmptyPrompt(
            icon: Icons.search,
            message: 'products.search_hint'.tr,
          );
        }

        final rows = _controller.searchListingRows(trimmed);
        if (rows.isEmpty) {
          return _EmptyPrompt(
            icon: Icons.search_off_outlined,
            message: 'products.no_search_results'.tr,
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.only(top: 8, bottom: 24),
          itemCount: rows.length,
          itemBuilder: (context, index) => _SearchGridRow(entries: rows[index]),
        );
      }),
    );
  }
}

class _EmptyPrompt extends StatelessWidget {
  const _EmptyPrompt({required this.icon, required this.message});

  final IconData icon;
  final String message;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 48, color: AppColors.textMuted),
            const SizedBox(height: 16),
            Text(
              message,
              textAlign: TextAlign.center,
              style: GoogleFonts.montserrat(
                fontSize: 14,
                color: AppColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SearchGridRow extends StatelessWidget {
  const _SearchGridRow({required this.entries});

  final List<ProductListingEntry> entries;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 6, 16, 6),
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: ProductGridCard(
                product: entries.first.product,
                highlightVariant: entries.first.variant,
                onTap: () => Get.toNamed(
                  '/product/${entries.first.product.id}?variantId=${entries.first.variant.id}',
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: entries.length > 1
                  ? ProductGridCard(
                      product: entries[1].product,
                      highlightVariant: entries[1].variant,
                      onTap: () => Get.toNamed(
                        '/product/${entries[1].product.id}?variantId=${entries[1].variant.id}',
                      ),
                    )
                  : const SizedBox.shrink(),
            ),
          ],
        ),
      ),
    );
  }
}
