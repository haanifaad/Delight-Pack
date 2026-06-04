import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/financial_data_models.dart';

class FinancialRepository {
  final FirebaseFirestore _firestore;

  FinancialRepository({FirebaseFirestore? firestore}) 
      : _firestore = firestore ?? FirebaseFirestore.instance;

  Stream<List<TransactionModel>> streamTransactions() {
    return _firestore
        .collection('transactions')
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs
          .map((doc) => TransactionModel.fromFirestore(doc.data(), doc.id))
          .toList();
    });
  }

  Stream<Map<String, CellModel>> streamSpreadsheetData() {
    return _firestore
        .collection('spreadsheetData')
        .snapshots()
        .map((snapshot) {
      final Map<String, CellModel> gridData = {};
      for (var doc in snapshot.docs) {
        gridData[doc.id] = CellModel.fromFirestore(doc.data(), doc.id);
      }
      return gridData;
    });
  }
}
