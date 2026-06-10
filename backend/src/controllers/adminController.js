const prisma = require('../prisma');

exports.getDashboardStats = (req, res) => {
  // Return mock data for dashboard to prove API connectivity
  res.json({
    cashFlow: "AED 145,200",
    machineUtilization: "92%",
    unresolvedComplaints: 3,
    wipValue: "AED 89,050"
  });
};

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role_level: true,
      }
    });
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.inviteUser = async (req, res) => {
  // Stub for inviting a user
  res.json({ message: 'User invite logic would execute here.' });
};

exports.getPricingMatrix = async (req, res) => {
  try {
    const pricing = await prisma.pricingMatrix.findMany();
    res.json({ pricing });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pricing' });
  }
};

exports.updatePricingMatrix = async (req, res) => {
  try {
    const { id, marginMultiplier } = req.body;
    const item = await prisma.pricingMatrix.update({
      where: { id },
      data: { marginMultiplier: parseFloat(marginMultiplier) }
    });
    res.json({ item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update pricing' });
  }
};

exports.getFinancialLedger = async (req, res) => {
  try {
    const ledger = await prisma.financialLedger.findMany({
      orderBy: { timestamp: 'desc' }
    });
    res.json({ ledger });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ledger' });
  }
};

exports.generateQuote = async (req, res) => {
  try {
    const { customerId, details } = req.body;
    const totalValue = details.items.reduce((acc, item) => acc + (item.qty * item.price), 0);
    const quote = await prisma.quote.create({
      data: {
        customerId,
        totalValue,
        status: 'DRAFT',
        details
      }
    });
    res.json({ quote });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate quote' });
  }
};
