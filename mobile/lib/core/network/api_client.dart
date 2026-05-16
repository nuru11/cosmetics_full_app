import 'dart:convert';

import 'package:http/http.dart' as http;

import '../config/api_config.dart';

class ApiException implements Exception {
  ApiException(this.message, {this.statusCode});

  final String message;
  final int? statusCode;

  @override
  String toString() => message;
}

class ApiClient {
  ApiClient({http.Client? client}) : _client = client ?? http.Client();

  final http.Client _client;

  String get _baseUrl => ApiConfig.baseUrl.replaceAll(RegExp(r'/+$'), '');

  Future<Map<String, dynamic>> getJson(String path) async {
    final uri = Uri.parse('$_baseUrl/${path.replaceFirst(RegExp(r'^/+'), '')}');
    final response = await _client.get(
      uri,
      headers: const {'Accept': 'application/json'},
    );

    if (response.statusCode == 404) {
      throw ApiException('Not found', statusCode: 404);
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      String message = 'Request failed (${response.statusCode})';
      try {
        final body = jsonDecode(response.body) as Map<String, dynamic>;
        if (body['error'] is String) message = body['error'] as String;
      } catch (_) {}
      throw ApiException(message, statusCode: response.statusCode);
    }

    if (response.body.isEmpty) {
      return {};
    }

    final decoded = jsonDecode(response.body);
    if (decoded is Map<String, dynamic>) return decoded;
    throw ApiException('Invalid response format');
  }
}
