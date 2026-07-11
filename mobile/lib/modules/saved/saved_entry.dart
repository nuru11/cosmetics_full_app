import '../../data/models/product.dart';
import '../../data/models/product_variant.dart';

class SavedEntry {
  const SavedEntry({
    required this.product,
    required this.variant,
  });

  final Product product;
  final ProductVariant variant;
}

List<List<SavedEntry>> chunkSavedEntriesIntoPairs(List<SavedEntry> entries) {
  final rows = <List<SavedEntry>>[];
  for (var i = 0; i < entries.length; i += 2) {
    if (i + 1 < entries.length) {
      rows.add([entries[i], entries[i + 1]]);
    } else {
      rows.add([entries[i]]);
    }
  }
  return rows;
}
