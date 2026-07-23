import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_colors.dart';

class ProductDetailDescription extends StatefulWidget {
  const ProductDetailDescription({
    super.key,
    required this.description,
  });

  final String description;

  @override
  State<ProductDetailDescription> createState() =>
      _ProductDetailDescriptionState();
}

class _ProductDetailDescriptionState extends State<ProductDetailDescription> {
  static const _collapsedMaxLines = 4;
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'product.about'.tr,
          style: GoogleFonts.montserrat(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: AppColors.textDark,
          ),
        ),
        const SizedBox(height: 10),
        LayoutBuilder(
          builder: (context, constraints) {
            final textStyle = GoogleFonts.montserrat(
              fontSize: 14,
              color: AppColors.textDark,
              height: 1.6,
            );
            final span = TextSpan(text: widget.description, style: textStyle);
            final tp = TextPainter(
              text: span,
              maxLines: _collapsedMaxLines,
              textDirection: Directionality.of(context),
            )..layout(maxWidth: constraints.maxWidth);

            final exceedsMaxLines = tp.didExceedMaxLines;

            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.description,
                  maxLines: _expanded ? null : _collapsedMaxLines,
                  overflow: _expanded ? null : TextOverflow.ellipsis,
                  style: textStyle,
                ),
                if (exceedsMaxLines)
                  TextButton(
                    onPressed: () => setState(() => _expanded = !_expanded),
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.only(top: 4),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      foregroundColor: AppColors.brandBlue,
                    ),
                    child: Text(
                      _expanded ? 'product.read_less'.tr : 'product.read_more'.tr,
                      style: GoogleFonts.montserrat(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
              ],
            );
          },
        ),
      ],
    );
  }
}
