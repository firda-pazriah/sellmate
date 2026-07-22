"use client";

import { useState } from "react";
import { MoreVertical, ShieldCheck, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { TeamMemberSheet } from "./team-member-sheet";
import { RemoveMemberDialog } from "./remove-member-dialog";
import { INITIAL_TEAM_MEMBERS } from "./data";
import { TeamMember } from "./types";
import { PERMISSION_MODULES } from "@/constants/permission-modules";
import type { PermissionModuleId } from "@/constants/permission-modules";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function permissionLabels(ids: PermissionModuleId[]) {
  return PERMISSION_MODULES.filter((m) => ids.includes(m.id)).map(
    (m) => m.label,
  );
}

export function ManageTeamView() {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [removingMember, setRemovingMember] = useState<TeamMember | null>(null);

  const [sheetSession, setSheetSession] = useState(0);

  function openInvite() {
    setSheetSession((s) => s + 1);
    setInviteOpen(true);
  }

  function openEdit(employee: TeamMember) {
    setSheetSession((s) => s + 1);
    setEditingMember(employee);
  }

  const owner = members.find((m) => m.role === "owner");
  const employees = members.filter((m) => m.role === "employee");

  function handleInvite(input: {
    email: string;
    permissions: PermissionModuleId[];
  }) {
    const name = input.email.split("@")[0];

    const newMember: TeamMember = {
      id: `user_${crypto.randomUUID()}`,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: input.email,
      role: "employee",
      status: "invited",
      permissions: input.permissions,
      invitedAt: new Date().toISOString().slice(0, 10),
    };

    setMembers((prev) => [...prev, newMember]);
  }

  function handleUpdatePermissions(input: {
    email: string;
    permissions: PermissionModuleId[];
  }) {
    if (!editingMember) return;

    setMembers((prev) =>
      prev.map((m) =>
        m.id === editingMember.id
          ? { ...m, permissions: input.permissions }
          : m,
      ),
    );
    setEditingMember(null);
  }

  function handleRemove(memberId: string) {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    setRemovingMember(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="gap-0">
          <h1 className="text-3xl font-semibold">Manage Team</h1>
          <p className="text-sm text-muted-foreground">
            Control who has access to this account and which modules they can
            see.
          </p>
        </div>
        <Button onClick={openInvite}>
          <UserPlus />
          Undang Employee
        </Button>
      </div>

      <ItemGroup>
        {owner && (
          <Item variant="outline">
            <ItemMedia variant="image">
              <Avatar>
                <AvatarFallback>{initials(owner.name)}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>
                {owner.name}
                <Badge variant="info">Owner</Badge>
              </ItemTitle>
              <ItemDescription>{owner.email}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant="success">
                <ShieldCheck className="size-3" />
                Full access to all modules
              </Badge>
            </ItemActions>
          </Item>
        )}

        {employees.map((employee) => {
          const labels = permissionLabels(employee.permissions);

          return (
            <Item key={employee.id} variant="outline">
              <ItemMedia variant="image">
                <Avatar>
                  <AvatarFallback>{initials(employee.name)}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  {employee.name}
                  {employee.status === "invited" && (
                    <Badge variant="warning">Invitation pending</Badge>
                  )}
                </ItemTitle>
                <ItemDescription>{employee.email}</ItemDescription>
                <div className="mt-1 flex flex-wrap gap-1">
                  {labels.length > 0 ? (
                    labels.map((label) => (
                      <Badge key={label} variant="secondary">
                        {label}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No modules assigned — nothing is visible to them yet.
                    </span>
                  )}
                </div>
              </ItemContent>
              <ItemActions>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon-sm">
                        <MoreVertical />
                      </Button>
                    }
                  />
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => openEdit(employee)}>
                      Edit permissions
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setRemovingMember(employee)}
                    >
                      Remove employee
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </ItemActions>
            </Item>
          );
        })}

        {employees.length === 0 && (
          <Item variant="muted" className="justify-center py-8">
            <ItemContent className="items-center text-center">
              <ItemTitle className="justify-center">No employees yet</ItemTitle>
              <ItemDescription>
                Invite your first employee and choose which modules they can
                see.
              </ItemDescription>
            </ItemContent>
          </Item>
        )}
      </ItemGroup>

      <TeamMemberSheet
        key={`invite-${sheetSession}`}
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onSubmit={handleInvite}
      />

      <TeamMemberSheet
        key={`edit-${sheetSession}`}
        open={Boolean(editingMember)}
        onOpenChange={(open) => !open && setEditingMember(null)}
        member={editingMember ?? undefined}
        onSubmit={handleUpdatePermissions}
      />

      <RemoveMemberDialog
        open={Boolean(removingMember)}
        onOpenChange={(open) => !open && setRemovingMember(null)}
        member={removingMember}
        onConfirm={handleRemove}
      />
    </div>
  );
}
