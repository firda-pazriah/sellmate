"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PERMISSION_MODULES, PermissionModuleId } from "@/constants/permission-modules";

type Props = {
  value: PermissionModuleId[];
  onChange: (value: PermissionModuleId[]) => void;
};

export function PermissionChecklist({ value, onChange }: Props) {
  function toggle(moduleId: PermissionModuleId, checked: boolean) {
    if (checked) {
      onChange([...value, moduleId]);
    } else {
      onChange(value.filter((id) => id !== moduleId));
    }
  }

  return (
    <div className="space-y-3">
      {PERMISSION_MODULES.map((module) => {
        const checked = value.includes(module.id);
        const inputId = `permission-${module.id}`;

        return (
          <Label
            key={module.id}
            htmlFor={inputId}
            className="flex items-start gap-3 rounded-md border border-border p-3 font-normal has-data-checked:border-primary/30 has-data-checked:bg-primary/5"
          >
            <Checkbox
              id={inputId}
              checked={checked}
              onCheckedChange={(next) => toggle(module.id, next)}
              className="mt-0.5"
            />
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{module.label}</span>
                {module.mobileOnly && (
                  <Badge variant="outline" className="text-xs">
                    Mobile only
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {module.description}
              </p>
            </div>
          </Label>
        );
      })}

      {value.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No modules selected — this employee won&apos;t see any modules
          when they log in.
        </p>
      )}
    </div>
  );
}
