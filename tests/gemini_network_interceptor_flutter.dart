/**
 * gemini_network_interceptor_flutter.dart
 * 
 * Instructions: If you are using the `dio` or `http` package, you can add this interceptor 
 * to your client setup in your Flutter app to audit the Gemini API endpoints.
 * 
 * Example usage with Dio:
 * final dio = Dio();
 * dio.interceptors.add(GeminiAuditInterceptor());
 */

import 'package:dio/dio.dart';
import 'dart:math';

class GeminiAuditInterceptor extends Interceptor {
  final _random = Random();

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final url = options.uri.toString();
    
    // Target Gemini API endpoints
    if (url.contains('gemini') || url.contains('generativelanguage.googleapis.com')) {
      print('[Audit Interceptor] Intercepted Gemini API call to: $url');
      
      // Simulate a 30% chance of network failure
      if (_random.nextDouble() < 0.3) {
        print('[Audit Interceptor] Injecting deliberate 503 Service Unavailable error.');
        return handler.reject(
          DioException(
            requestOptions: options,
            type: DioExceptionType.badResponse,
            response: Response(
              requestOptions: options,
              statusCode: 503,
              statusMessage: 'Service Unavailable',
              data: {'error': 'Service Unavailable injected by audit interceptor'},
            ),
          ),
        );
      }

      // Simulate a 20% chance of timeout
      if (_random.nextDouble() < 0.2) {
        print('[Audit Interceptor] Injecting deliberate network timeout payload.');
        await Future.delayed(Duration(seconds: 15));
        return handler.reject(
          DioException(
            requestOptions: options,
            type: DioExceptionType.connectionTimeout,
            error: 'Simulated network timeout',
          ),
        );
      }
    }
    
    super.onRequest(options, handler);
  }
}
