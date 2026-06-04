import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

// Mock AuthService for JWT decoding
class AuthService {
  static Future<bool> isAuthenticated() async {
    // Check local storage for token
    return true; 
  }

  static Future<String?> getToken() async {
    // Return mock token
    return 'mock.jwt.token';
  }

  static Future<int> getUserRoleLevel() async {
    final token = await getToken();
    if (token == null) return 0;
    
    // Decode JWT logic here (mocked for now)
    // Map L1=1, L2=2, L3=3, L4=4, L5=5
    // Example: return JWT.decode(token).payload['role_level'];
    return 1; // Default to L1 User
  }
}

final GoRouter appRouter = GoRouter(
  initialLocation: '/login',
  redirect: (BuildContext context, GoRouterState state) async {
    final bool loggedIn = await AuthService.isAuthenticated();
    final bool loggingIn = state.matchedLocation == '/login';

    if (!loggedIn && !loggingIn) return '/login';
    if (loggedIn && loggingIn) {
      final int roleLevel = await AuthService.getUserRoleLevel();
      if (roleLevel >= 2) {
        return '/admin-dashboard';
      } else {
        return '/storefront';
      }
    }
    
    // Middleware interceptor to protect admin routes
    if (state.matchedLocation.startsWith('/admin')) {
       final int roleLevel = await AuthService.getUserRoleLevel();
       if (roleLevel < 2) {
         return '/storefront'; // Redirect unauthorized users
       }
    }

    return null;
  },
  routes: <RouteBase>[
    GoRoute(
      path: '/login',
      builder: (BuildContext context, GoRouterState state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/storefront',
      builder: (BuildContext context, GoRouterState state) => const CustomerStorefrontScreen(),
    ),
    GoRoute(
      path: '/admin-dashboard',
      builder: (BuildContext context, GoRouterState state) => const AdminDashboardScreen(),
    ),
  ],
);

// Mock Screens for routing demonstration
class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});
  @override Widget build(BuildContext context) => const Scaffold(body: Center(child: Text('Login Screen')));
}

class CustomerStorefrontScreen extends StatelessWidget {
  const CustomerStorefrontScreen({super.key});
  @override Widget build(BuildContext context) => const Scaffold(body: Center(child: Text('L1 Customer Storefront')));
}

class AdminDashboardScreen extends StatelessWidget {
  const AdminDashboardScreen({super.key});
  @override Widget build(BuildContext context) => const Scaffold(body: Center(child: Text('L2-L4 Admin Dashboard')));
}
