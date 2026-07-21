"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import { COGSTable } from "@/components/cogs-table/table";
import { cogsListSchema } from "@/components/cogs-table/types";
import { Container } from "@/components/ui/container";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ToggleGroupItem, ToggleGroup } from "@/components/ui/toggle-group";
import { Save } from "lucide-react";
import { StatCard } from "@/components/daily-digest/stat-card";
import { Button } from "@/components/ui/button";
import rawData from "./data.json";

const parsed = cogsListSchema.safeParse(rawData);
if (!parsed.success && process.env.NODE_ENV !== "production") {
  console.error("Invalid COGS data:", parsed.error);
}
const cogsData = parsed.success ? parsed.data : [];

const numberFormatter = new Intl.NumberFormat("id-ID");

type MarginOption = "30" | "50" | "70" | "custom";

type Fees = {
  supply: number;
  production: number;
  packaging: number;
  others: number;
};

const INITIAL_FEES: Fees = {
  supply: 0,
  production: 0,
  packaging: 0,
  others: 0,
};

function parseNonNegativeNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export default function COGSCalculator() {
  const [productName, setProductName] = useState("");
  const [fees, setFees] = useState<Fees>(INITIAL_FEES);
  const [marginOption, setMarginOption] = useState<MarginOption>("30");
  const [customMargin, setCustomMargin] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const totalCogs =
    fees.supply + fees.production + fees.packaging + fees.others;
  const marginPercent =
    marginOption === "custom" ? customMargin : Number(marginOption);
  const isMarginValid = marginPercent >= 0 && marginPercent < 100;

  const recommendedPrice = useMemo(() => {
    if (!isMarginValid || totalCogs <= 0) return null;
    return Math.round(totalCogs / (1 - marginPercent / 100));
  }, [totalCogs, marginPercent, isMarginValid]);

  const handleFeeChange =
    (key: keyof Fees) => (e: ChangeEvent<HTMLInputElement>) => {
      setFees((prev) => ({
        ...prev,
        [key]: parseNonNegativeNumber(e.target.value),
      }));
    };

  const handleMarginChange = (value: string) => {
    if (value) setMarginOption(value as MarginOption);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || recommendedPrice === null) return;
    setIsSaving(true);
    // TODO: persist data via API
  };

  return (
    <Container className="grid h-full grid-cols-12 gap-4 pb-0">
      <Container className="bg-gray-50 rounded-sm border border-muted col-span-4 space-y-4 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        <div>
          <h1 className="text-3xl font-semibold">COGS Calculator</h1>
          <span className="text-sm text-muted-foreground">
            Calculate the sell price and get the recommendation
          </span>
        </div>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="product_name">Product Name</FieldLabel>
              <Input
                id="product_name"
                type="text"
                placeholder="Product Name / SKU"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                disabled={isSaving}
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="supply_fee">Supply Fee</FieldLabel>
                <Input
                  id="supply_fee"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={fees.supply}
                  onChange={handleFeeChange("supply")}
                  disabled={isSaving}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="production_fee">Production Fee</FieldLabel>
                <Input
                  id="production_fee"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={fees.production}
                  onChange={handleFeeChange("production")}
                  disabled={isSaving}
                  required
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="packaging_fee">Packaging Fee</FieldLabel>
                <Input
                  id="packaging_fee"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={fees.packaging}
                  onChange={handleFeeChange("packaging")}
                  disabled={isSaving}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="others_fee">Others Fee</FieldLabel>
                <Input
                  id="others_fee"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={fees.others}
                  onChange={handleFeeChange("others")}
                  disabled={isSaving}
                  required
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="total_cogs">Total COGS</FieldLabel>
              <Input
                id="total_cogs"
                type="text"
                value={`IDR ${numberFormatter.format(totalCogs)}`}
                disabled
              />
            </Field>
            <Field>
              <FieldLabel>Margin Target</FieldLabel>
              <ToggleGroup variant="outline" disabled={isSaving}>
                <ToggleGroupItem
                  value="30"
                  aria-label="30% margin"
                  onPressedChange={() => handleMarginChange("30")}
                >
                  30%
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="50"
                  aria-label="50% margin"
                  onPressedChange={() => handleMarginChange("50")}
                >
                  50%
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="70"
                  aria-label="70% margin"
                  onPressedChange={() => handleMarginChange("70")}
                >
                  70%
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="custom"
                  aria-label="Custom margin"
                  onPressedChange={() => handleMarginChange("custom")}
                >
                  Custom
                </ToggleGroupItem>
              </ToggleGroup>
              {marginOption === "custom" && (
                <Input
                  type="number"
                  min={0}
                  max={99}
                  placeholder="Custom margin %"
                  aria-label="Custom margin percentage"
                  value={customMargin}
                  onChange={(e) =>
                    setCustomMargin(parseNonNegativeNumber(e.target.value))
                  }
                  disabled={isSaving}
                />
              )}
              {!isMarginValid && (
                <span className="text-xs text-destructive">
                  Margin must be between 0 and 99%.
                </span>
              )}
            </Field>
            <StatCard
              title="Price Recommendation"
              value={
                recommendedPrice !== null
                  ? `IDR ${numberFormatter.format(recommendedPrice)}`
                  : "—"
              }
            />
            <Field>
              <Button
                type="submit"
                disabled={
                  isSaving || !productName.trim() || recommendedPrice === null
                }
              >
                <Save />
                {isSaving ? "Saving…" : "Save"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </Container>
      <Container className="space-y-4 col-span-8">
        <div className="gap-0">
          <h2 className="text-3xl font-semibold">COGS Product</h2>
          <span className="text-sm text-muted-foreground">
            This price can be edited and add in the future
          </span>
        </div>
        <COGSTable data={cogsData} />
      </Container>
    </Container>
  );
}
