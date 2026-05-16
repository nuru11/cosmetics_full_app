import '../config/api_config.dart';

String resolveImageUrl(String? url) {
  if (url == null || url.trim().isEmpty) return '';
  final trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('/')) {
    return '${ApiConfig.origin}$trimmed';
  }
  return '${ApiConfig.origin}/$trimmed';
}

/// Resolves a product image URL, falling back to the app default placeholder.
String resolveProductImageUrl(String? url) {
  final resolved = resolveImageUrl(url);
  if (resolved.isEmpty) return ApiConfig.defaultProductImageUrl;
  return resolved;
}
