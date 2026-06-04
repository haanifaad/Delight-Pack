import 'package:cloud_firestore/cloud_firestore.dart';

class DatabaseService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // Stream for a specific order tracking
  Stream<DocumentSnapshot> getOrderStream(String orderId) {
    return _db.collection('orders').doc(orderId).snapshots();
  }

  // Stream for support chat
  Stream<QuerySnapshot> getSupportChatStream(String userId) {
    return _db
        .collection('support_chats')
        .where('clientId', isEqualTo: userId)
        .orderBy('timestamp', descending: true)
        .snapshots();
  }

  Future<void> sendMessage(String userId, String text) async {
    await _db.collection('support_chats').add({
      'clientId': userId,
      'text': text,
      'sender': 'client',
      'timestamp': FieldValue.serverTimestamp(),
    });
  }
}
