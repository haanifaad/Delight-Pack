class TransactionModel {
  final String id;
  final String date;
  final String type;
  final String ledger;
  final double amount;

  TransactionModel({
    required this.id,
    required this.date,
    required this.type,
    required this.ledger,
    required this.amount,
  });

  factory TransactionModel.fromFirestore(Map<String, dynamic> data, String id) {
    return TransactionModel(
      id: id,
      date: data['date'] ?? '',
      type: data['type'] ?? '',
      ledger: data['ledger'] ?? '',
      amount: (data['amount'] ?? 0.0).toDouble(),
    );
  }
}

class CellModel {
  final String cellId;
  final String value;
  final String computedValue;

  CellModel({
    required this.cellId,
    required this.value,
    required this.computedValue,
  });

  factory CellModel.fromFirestore(Map<String, dynamic> data, String id) {
    return CellModel(
      cellId: id,
      value: data['value'] ?? '',
      computedValue: data['computedValue'] ?? '',
    );
  }
}
