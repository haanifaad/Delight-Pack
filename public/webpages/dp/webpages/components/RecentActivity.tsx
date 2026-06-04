import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ActivityData } from "@/types";

const activityData: ActivityData[] = [
  {
    id: "ACT-001",
    action: "Order Fulfilled",
    details: "PO-7782 complete and ready for dispatch.",
    timestamp: "2 hours ago",
    user: "System",
  },
  {
    id: "ACT-002",
    action: "Invoice Paid",
    details: "INV-2026-08A processed via wire transfer.",
    timestamp: "5 hours ago",
    user: "Finance Dept",
  },
  {
    id: "ACT-003",
    action: "Support Ticket Opened",
    details: "Ticket #4492 - API Integration Issue.",
    timestamp: "Yesterday",
    user: "Tom Cook",
  },
  {
    id: "ACT-004",
    action: "New Order Placed",
    details: "PO-7783 received containing 45 line items.",
    timestamp: "Yesterday",
    user: "System",
  },
  {
    id: "ACT-005",
    action: "Shipment Delayed",
    details: "PO-7770 delayed due to carrier weather alert.",
    timestamp: "2 days ago",
    user: "Logistics",
  },
];

export function RecentActivity() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6 border-b border-slate-100">
        <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">
          Latest actions across your account.
        </p>
      </div>
      <div className="p-6 pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="hidden md:table-cell">User</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activityData.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">
                  {activity.action}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {activity.details}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="secondary" className="font-normal text-slate-500">
                    {activity.user}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground whitespace-nowrap">
                  {activity.timestamp}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
