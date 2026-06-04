import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { Pool } from 'pg';
import { generateAndUploadInvoice } from './invoiceService';

const PORT = 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Helper function to simulate fetching a BOM for an order
async function getBillOfMaterials(orderId: string) {
  // In a real app, this would query another table (e.g. `order_bom`)
  console.log(`Fetching BOM for order ${orderId}...`);
  return [
    { material_id: 'paper_roll_standard', quantity: 5 },
    { material_id: 'ink_cyan', quantity: 2 },
    { material_id: 'ink_magenta', quantity: 2 },
  ];
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Route to handle order status change
  app.post('/api/orders/status', async (req, res) => {
    const { orderId, newStatus } = req.body;

    if (!orderId || !newStatus) {
      return res.status(400).json({ error: 'orderId and newStatus are required.' });
    }

    if (newStatus === 'In Production') {
      let client;
      try {
        // Try connecting to the database
        // If DATABASE_URL is not set, this will fail or we can mock it.
        if (!process.env.DATABASE_URL) {
          console.warn("DATABASE_URL is not set. Simulating the transaction.");
          
          const bom = await getBillOfMaterials(orderId);
          console.log(`[SIMULATION] BEGIN Transaction`);
          
          for (const item of bom) {
             console.log(`[SIMULATION] Deduced ${item.quantity} of ${item.material_id} from inventory.`);
          }
          console.log(`[SIMULATION] COMMIT Transaction`);
          
          return res.json({ 
            success: true, 
            message: 'Simulated inventory deduction since no DB is connected.',
            bom
          });
        }

        // Real Database Execution
        client = await pool.connect();
        await client.query('BEGIN'); // Start transaction
        
        const bom = await getBillOfMaterials(orderId);

        // Deduct exactly based on BOM
        for (const item of bom) {
          const updateQuery = `
            UPDATE inventory 
            SET quantity = quantity - $1 
            WHERE material_id = $2 AND quantity >= $1
            RETURNING quantity;
          `;
          const result = await client.query(updateQuery, [item.quantity, item.material_id]);

          if (result.rowCount === 0) {
            // Either the item doesn't exist, or not enough quantity. Rollback!
            throw new Error(`Insufficient inventory or invalid material: ${item.material_id}`);
          }
        }

        await client.query('COMMIT'); // Commit transaction
        res.json({ success: true, message: 'Inventory updated successfully.' });

      } catch (error: any) {
        if (client) {
          await client.query('ROLLBACK'); // Rollback on error
        }
        console.error('Transaction Failed, rolled back:', error);
        res.status(500).json({ error: error.message || 'Database transaction failed.' });
      } finally {
        if (client) {
          client.release();
        }
      }
    } else {
      res.json({ success: true, message: `Status updated to ${newStatus}. No inventory action required.` });
    }
  });

  // API Route to generate an invoice
  app.post('/api/invoice/generate', async (req, res) => {
    try {
       const invoiceData = req.body;
       
       if (!invoiceData.invoiceNumber || !invoiceData.items || !Array.isArray(invoiceData.items)) {
          return res.status(400).json({ error: 'Invalid invoice data' });
       }
       
       const url = await generateAndUploadInvoice(invoiceData);
       res.json({ success: true, url });
    } catch (error: any) {
       console.error("Invoice Generation Error:", error);
       res.status(500).json({ error: error.message || 'Invoice generation failed' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
