import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:google_fonts/google_fonts.dart';

class AdminOverrideGrid extends StatelessWidget {
  const AdminOverrideGrid({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<QuerySnapshot>(
      stream: FirebaseFirestore.instance.collection('orders').where('status', isEqualTo: 'pending').snapshots(),
      builder: (context, snapshot) {
        if (!snapshot.hasData) return const Center(child: CircularProgressIndicator());

        return ListView.builder(
          itemCount: snapshot.data!.docs.length,
          itemBuilder: (context, index) {
            final doc = snapshot.data!.docs[index];
            final data = doc.data() as Map<String, dynamic>;

            return Card(
              color: const Color(0xFF27272A),
              margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
              child: ListTile(
                title: Text(data['clientName'] ?? 'Unknown Client', style: GoogleFonts.inter(color: Colors.white)),
                subtitle: Text('Order: ${doc.id}', style: GoogleFonts.inter(color: Colors.grey)),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.check, color: Colors.green),
                      onPressed: () => _updateOrderStatus(doc.id, 'Processing'),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.red),
                      onPressed: () => _updateOrderStatus(doc.id, 'Rejected'),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  Future<void> _updateOrderStatus(String orderId, String newStatus) async {
    final batch = FirebaseFirestore.instance.batch();
    final orderRef = FirebaseFirestore.instance.collection('orders').doc(orderId);
    
    batch.update(orderRef, {'status': newStatus, 'updatedAt': FieldValue.serverTimestamp()});
    // Add additional batch operations if needed (e.g. log to audit trail)
    
    await batch.commit();
  }
}
