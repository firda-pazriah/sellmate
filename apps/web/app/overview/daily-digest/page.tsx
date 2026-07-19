import { TaskItem } from "@/components/task-card";
import { Container } from "@/components/ui/container";
import { StatCard } from "@/components/stat-card";

import { Progress } from "@/components/ui/progress";
import { MessageSquare, Printer, Zap } from "lucide-react";

function DailyDigest() {
  return (
    <Container className="flex gap-4 p-0 h-full">
      <Container className="rounded-sm gap-4 flex flex-col border border-muted  w-8/12">
        <div className="gap-0">
          <h1 className="text-3xl font-semibold">Today</h1>
          <span className="text-sm text-muted-foreground">1 of 3 done</span>
        </div>
        <Progress value={100 / 3} />
        <TaskItem
          title="Pickup within 22 minutes"
          subtitle="Pickup in 47 min"
          icon={Zap}
          variant="danger"
        />

        <TaskItem
          title="Reply to 2-star review"
          subtitle="Pickup in 47 min"
          icon={MessageSquare}
        />

        <TaskItem
          title="Print 8 resi for today's orders"
          subtitle="Pickup in 47 min"
          icon={Printer}
        />
      </Container>
      <Container className="bg-gray-50 h-full gap-4 flex flex-col w-4/12">
        <StatCard
          title="Dana Penjualan"
          value="IDR 308.731"
          previousLabel="Yesterday IDR 320.510"
          change={-3.68}
        />

        <StatCard
          title="Orders"
          value={1672}
          previousLabel="Yesterday 1701"
          change={8.12}
        />

        <StatCard title="Visitors" value="381,436" />
      </Container>
    </Container>
  );
}

export default DailyDigest;
