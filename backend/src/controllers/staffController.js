const prisma = require('../prisma');

exports.getKanbanJobs = async (req, res) => {
  try {
    const jobs = await prisma.jobOrder.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

exports.updateJobStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const job = await prisma.jobOrder.update({
      where: { id },
      data: { status }
    });
    res.json({ job });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job' });
  }
};

exports.getMachines = async (req, res) => {
  try {
    const machines = await prisma.machine.findMany();
    res.json({ machines });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch machines' });
  }
};

exports.toggleMachineStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const machine = await prisma.machine.update({
      where: { id },
      data: { status }
    });
    res.json({ machine });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update machine' });
  }
};

exports.logInventory = async (req, res) => {
  try {
    const { sku, type, quantity } = req.body;
    const material = await prisma.material.findUnique({ where: { sku } });
    if (!material) return res.status(404).json({ error: 'Material not found' });
    
    const log = await prisma.inventoryLog.create({
      data: {
        materialId: material.id,
        type,
        quantity: parseFloat(quantity)
      }
    });

    const newStock = type === 'CHECK_IN' ? material.stockLevel + parseFloat(quantity) : material.stockLevel - parseFloat(quantity);
    
    await prisma.material.update({
      where: { id: material.id },
      data: { stockLevel: newStock }
    });

    res.json({ success: true, log });
  } catch (error) {
    res.status(500).json({ error: 'Inventory log failed' });
  }
};
