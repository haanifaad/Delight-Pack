import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

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
  final User? user;

  const AuthState({this.authLevel = DpAuthLevel.unauthenticated, this.user});

  bool get isAuthenticated => authLevel.level > 0 && user != null;
}

class AuthNotifier extends Notifier<AuthState> {
  @override
  AuthState build() {
    _init();
    return const AuthState();
  }

  void _init() {
    FirebaseAuth.instance.authStateChanges().listen((User? user) async {
      if (user == null) {
        state = const AuthState();
      } else {
        // Fetch role from Firestore
        try {
          final doc = await FirebaseFirestore.instance.collection('users').doc(user.uid).get();
          DpAuthLevel level = DpAuthLevel.l1User; // default
          if (doc.exists) {
            final data = doc.data();
            final role = data?['role']?.toString().toLowerCase() ?? 'user';
            
            if (role == 'admin') {
              level = DpAuthLevel.l4Admin;
            } else if (role == 'staff') {
              level = DpAuthLevel.l3Staff;
            } else if (role == 'member') {
              level = DpAuthLevel.l2Member;
            } else if (role == 'developer') {
              level = DpAuthLevel.l5Developer;
            }
          }
          state = AuthState(authLevel: level, user: user);
        } catch (e) {
          state = AuthState(authLevel: DpAuthLevel.l1User, user: user); // Fallback to basic user
        }
      }
    });
  }

  Future<void> login(String email, String password) async {
    await FirebaseAuth.instance.signInWithEmailAndPassword(email: email, password: password);
  }

  Future<void> logout() async {
    await FirebaseAuth.instance.signOut();
  }
}

final authProvider = NotifierProvider<AuthNotifier, AuthState>(() {
  return AuthNotifier();
});
