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
