import 'package:flutter_riverpod/flutter_riverpod.dart';

enum DpAuthLevel {
  unauthenticated(0),
  l1User(1),
  l2Member(2),
  l3Staff(3),
  l4Admin(4),
  l5Developer(5);

  final int level;
  const DpAuthLevel(this.level);
}

class AuthState {
  final DpAuthLevel authLevel;
  final String? token;

  const AuthState({this.authLevel = DpAuthLevel.unauthenticated, this.token});

  bool get isAuthenticated => authLevel.level > 0;
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(const AuthState());

  void login(String username, String password) {
    // In a real app, you would make an API call here and decode the JWT
    // For now, we simulate different roles based on the username
    DpAuthLevel level = DpAuthLevel.unauthenticated;
    
    if (username.contains('user')) {
      level = DpAuthLevel.l1User;
    } else if (username.contains('member')) level = DpAuthLevel.l2Member;
    else if (username.contains('staff')) level = DpAuthLevel.l3Staff;
    else if (username.contains('admin')) level = DpAuthLevel.l4Admin;
    else if (username.contains('dev')) level = DpAuthLevel.l5Developer;
    else level = DpAuthLevel.l1User; // default fallback

    state = AuthState(authLevel: level, token: 'mock_jwt_token_for_${level.name}');
  }

  void logout() {
    state = const AuthState();
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});
