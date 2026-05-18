class ApiConfig {
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://192.168.1.17:3000/api',
  );

  static const String defaultProductImageUrl =
      'https://assets.easyapplicantflow.com/cosmetics/cosmeticsimg3.png';

  static String get origin {
    final trimmed = baseUrl.replaceAll(RegExp(r'/+$'), '');
    if (trimmed.endsWith('/api')) {
      return trimmed.substring(0, trimmed.length - 4);
    }
    return trimmed;
  }
}
