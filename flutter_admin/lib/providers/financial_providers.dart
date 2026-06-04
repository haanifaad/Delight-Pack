import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../repositories/financial_repository.dart';
import '../models/financial_data_models.dart';

// Repository Provider
final financialRepositoryProvider = Provider<FinancialRepository>((ref) {
  return FinancialRepository();
});

// Real-time Stream Provider for Transactions
final transactionsStreamProvider = StreamProvider<List<TransactionModel>>((ref) {
  final repository = ref.watch(financialRepositoryProvider);
  return repository.streamTransactions();
});

// Real-time Stream Provider for Spreadsheet Grid Data
final spreadsheetStreamProvider = StreamProvider<Map<String, CellModel>>((ref) {
  final repository = ref.watch(financialRepositoryProvider);
  return repository.streamSpreadsheetData();
});
