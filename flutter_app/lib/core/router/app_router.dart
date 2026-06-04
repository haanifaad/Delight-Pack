import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../auth/auth_service.dart';
import '../../features/auth/login_screen.dart';
import '../../features/customer/customer_home.dart';
import '../../features/management/management_home.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);

  return GoRouter(
    initialLocation: '/login',
    redirect: (context, state) {
      final isLoggingIn = state.uri.toString() == '/login';
      final isAuth = authState.isAuthenticated;

      if (!isAuth) {
        return isLoggingIn ? null : '/login';
      }

      if (isLoggingIn) {
        if (authState.authLevel == DpAuthLevel.l1User) {
          return '/customer';
        } else {
          return '/management';
        }
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/customer',
        builder: (context, state) => const CustomerHome(),
      ),
      GoRoute(
        path: '/management',
        builder: (context, state) => const ManagementHome(),
      ),
    ],
  );
});
