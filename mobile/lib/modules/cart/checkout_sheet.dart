import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/theme/app_colors.dart';
import '../../data/services/checkout_contact_storage.dart';
import 'widgets/delivery_contact_fields.dart';

class CheckoutSheet extends StatefulWidget {
  const CheckoutSheet({
    super.key,
    required this.initialContact,
    required this.isSubmitting,
    required this.onSubmit,
  });

  final CheckoutContact initialContact;
  final bool isSubmitting;
  final Future<void> Function(CheckoutContact contact) onSubmit;

  @override
  State<CheckoutSheet> createState() => _CheckoutSheetState();
}

class _CheckoutSheetState extends State<CheckoutSheet> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _phoneController;
  late final TextEditingController _cityController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.initialContact.name);
    _phoneController = TextEditingController(text: widget.initialContact.phone);
    _cityController = TextEditingController(text: widget.initialContact.city);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _cityController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final contact = contactFromControllers(
      name: _nameController,
      phone: _phoneController,
      city: _cityController,
    );
    await widget.onSubmit(contact);
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.viewInsetsOf(context).bottom;

    return Padding(
      padding: EdgeInsets.fromLTRB(20, 16, 20, 16 + bottomInset),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              'Delivery details',
              style: GoogleFonts.playfairDisplay(
                fontSize: 22,
                fontWeight: FontWeight.w600,
                color: AppColors.headerBrown,
              ),
            ),
            const SizedBox(height: 16),
            DeliveryContactFields(
              nameController: _nameController,
              phoneController: _phoneController,
              cityController: _cityController,
            ),
            const SizedBox(height: 20),
            FilledButton(
              onPressed: widget.isSubmitting ? null : _submit,
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.headerBrown,
                foregroundColor: AppColors.gold,
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
              child: widget.isSubmitting
                  ? const SizedBox(
                      height: 22,
                      width: 22,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: AppColors.gold,
                      ),
                    )
                  : Text(
                      'Place order',
                      style: GoogleFonts.montserrat(
                        fontWeight: FontWeight.w700,
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
