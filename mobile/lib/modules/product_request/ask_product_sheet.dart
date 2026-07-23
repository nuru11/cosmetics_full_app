import 'dart:io';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/theme/app_colors.dart';
import '../../data/services/checkout_contact_storage.dart';
import '../cart/widgets/delivery_contact_fields.dart';

String? validateProductDescription(String? value) {
  final trimmed = value?.trim() ?? '';
  if (trimmed.isEmpty) return 'Description is required';
  if (trimmed.length < 10) return 'Please add a bit more detail (min 10 characters)';
  if (trimmed.length > 2000) return 'Description is too long (max 2000 characters)';
  return null;
}

class AskProductSheet extends StatefulWidget {
  const AskProductSheet({
    super.key,
    required this.initialContact,
    required this.isSubmitting,
    required this.pickedImage,
    required this.onPickImage,
    required this.onRemoveImage,
    required this.onSubmit,
  });

  final CheckoutContact initialContact;
  final bool isSubmitting;
  final File? pickedImage;
  final Future<void> Function() onPickImage;
  final VoidCallback onRemoveImage;
  final Future<void> Function({
    required String description,
    required CheckoutContact contact,
  }) onSubmit;

  @override
  State<AskProductSheet> createState() => _AskProductSheetState();
}

class _AskProductSheetState extends State<AskProductSheet> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _descriptionController;
  late final TextEditingController _nameController;
  late final TextEditingController _phoneController;
  late final TextEditingController _cityController;

  @override
  void initState() {
    super.initState();
    _descriptionController = TextEditingController();
    _nameController = TextEditingController(text: widget.initialContact.name);
    _phoneController = TextEditingController(text: widget.initialContact.phone);
    _cityController = TextEditingController(text: widget.initialContact.city);
  }

  @override
  void dispose() {
    _descriptionController.dispose();
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
    await widget.onSubmit(
      description: _descriptionController.text.trim(),
      contact: contact,
    );
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.viewInsetsOf(context).bottom;
    final pickedImage = widget.pickedImage;

    return Padding(
      padding: EdgeInsets.fromLTRB(20, 16, 20, 16 + bottomInset),
      child: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Ask for a product',
                style: GoogleFonts.playfairDisplay(
                  fontSize: 22,
                  fontWeight: FontWeight.w600,
                  color: AppColors.brandBlack,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Tell us what you are looking for and we will try to find it for you.',
                style: GoogleFonts.montserrat(
                  fontSize: 13,
                  color: AppColors.textMuted,
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _descriptionController,
                validator: validateProductDescription,
                maxLines: 4,
                minLines: 3,
                textCapitalization: TextCapitalization.sentences,
                decoration: InputDecoration(
                  labelText: 'Product description',
                  hintText: 'Brand, name, shade, size...',
                  alignLabelWithHint: true,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: const BorderSide(
                      color: AppColors.brandBlue,
                      width: 2,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Reference photo (optional)',
                style: GoogleFonts.montserrat(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textDark,
                ),
              ),
              const SizedBox(height: 8),
              if (pickedImage != null)
                Stack(
                  clipBehavior: Clip.none,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Image.file(
                        pickedImage,
                        height: 120,
                        width: double.infinity,
                        fit: BoxFit.cover,
                      ),
                    ),
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Material(
                        color: AppColors.brandWhite,
                        shape: const CircleBorder(),
                        elevation: 2,
                        child: IconButton(
                          onPressed:
                              widget.isSubmitting ? null : widget.onRemoveImage,
                          icon: const Icon(Icons.close, size: 18),
                          tooltip: 'Remove photo',
                        ),
                      ),
                    ),
                  ],
                )
              else
                OutlinedButton.icon(
                  onPressed: widget.isSubmitting ? null : widget.onPickImage,
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.brandBlue,
                    side: const BorderSide(color: AppColors.brandBlueLight),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  icon: const Icon(Icons.add_photo_alternate_outlined),
                  label: Text(
                    'Add photo',
                    style: GoogleFonts.montserrat(fontWeight: FontWeight.w600),
                  ),
                ),
              const SizedBox(height: 20),
              Text(
                'Your contact details',
                style: GoogleFonts.montserrat(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textDark,
                ),
              ),
              const SizedBox(height: 12),
              DeliveryContactFields(
                nameController: _nameController,
                phoneController: _phoneController,
                cityController: _cityController,
              ),
              const SizedBox(height: 20),
              FilledButton(
                onPressed: widget.isSubmitting ? null : _submit,
                style: FilledButton.styleFrom(
                  backgroundColor: AppColors.brandBlue,
                  foregroundColor: AppColors.brandWhite,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: widget.isSubmitting
                    ? const SizedBox(
                        height: 22,
                        width: 22,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: AppColors.brandWhite,
                        ),
                      )
                    : Text(
                        'Send request',
                        style: GoogleFonts.montserrat(
                          fontWeight: FontWeight.w700,
                        ),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
