"use client";

import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldContent, FieldError } from "@/components/ui/field";

import { PermissionChecklist } from "./permission-checklist";
import { inviteEmployeeSchema } from "./types";
import type { PermissionModuleId } from "@/constants/permission-modules";
import type { TeamMember } from "./types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Omit to invite a new employee; pass an existing member to edit their permissions. */
  member?: TeamMember;
  onSubmit: (input: { email: string; permissions: PermissionModuleId[] }) => void;
};

export function TeamMemberSheet({
  open,
  onOpenChange,
  member,
  onSubmit,
}: Props) {
  const isEditing = Boolean(member);

  const [email, setEmail] = useState(member?.email ?? "");
  const [permissions, setPermissions] = useState<PermissionModuleId[]>(
    member?.permissions ?? [],
  );
  const [emailError, setEmailError] = useState<string | null>(null);

  // No effect needed to "reset" this form: the parent gives this
  // component a fresh `key` each time it opens (see ManageTeamView),
  // which remounts it and re-runs these useState initializers against
  // whatever `member` is current — the idiomatic way to reset state tied
  // to a prop, instead of syncing it imperatively in an effect.

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isEditing) {
      const result = inviteEmployeeSchema.shape.email.safeParse(email);
      if (!result.success) {
        setEmailError(result.error.issues[0]?.message ?? "Invalid email");
        return;
      }
    }

    onSubmit({ email, permissions });
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <SheetHeader>
            <SheetTitle>
              {isEditing ? `Edit access — ${member?.name}` : "Undang Employee"}
            </SheetTitle>
            <SheetDescription>
              {isEditing
                ? "Update which modules this employee can see. Unchecked modules are hidden entirely from their view."
                : "Enter the employee's email and choose which modules they can access. Permissions are set now, at invite time."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-6 px-4">
            {!isEditing && (
              <Field>
                <FieldContent>
                  <Label htmlFor="invite-email">Employee email</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="employee@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    aria-invalid={Boolean(emailError)}
                  />
                  <FieldError errors={emailError ? [{ message: emailError }] : undefined} />
                </FieldContent>
              </Field>
            )}

            <div className="space-y-2">
              <Label>Module access</Label>
              <PermissionChecklist value={permissions} onChange={setPermissions} />
            </div>
          </div>

          <SheetFooter className="flex-row justify-end">
            <SheetClose render={<Button type="button" variant="outline" />}>
              Cancel
            </SheetClose>
            <Button type="submit">
              {isEditing ? "Simpan perubahan" : "Kirim undangan"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
