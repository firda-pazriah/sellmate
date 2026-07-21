import { COGSTable } from "@/components/cogs-table/table";
import { COGS } from "@/components/cogs-table/types";
import { Container } from "@/components/ui/container";
import data from "./data.json";

export default function COGSCalculator() {
  return (
    <Container className="grid h-full grid-cols-12 gap-4 pb-0">
      <Container className="bg-gray-50 rounded-sm border border-muted col-span-4 space-y-4 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        <div className="gap-0">
          <h1 className="text-3xl font-semibold">COGS Calculator</h1>
        </div>
      </Container>
      <Container className="space-y-4 col-span-8">
        <div className="gap-0">
          <h1 className="text-3xl font-semibold">COGS Product</h1>
          <span className="text-sm text-muted-foreground">
            This price can be edited and add in the future
          </span>
        </div>
        <COGSTable data={data as COGS[]} />
      </Container>
    </Container>
  );
}
