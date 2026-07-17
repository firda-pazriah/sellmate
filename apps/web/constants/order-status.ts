export const ORDER_STATUS = {
  ready_to_pickup: {
    label: "Ready to pickup",
    badge: "success",
    buttonLabel: null,
  },
  pending_packaging: {
    label: "Need to be packaged",
    badge: "warning",
    buttonLabel: "Print Resi",
  },
  pending_acceptance: {
    label: "Need to confirm",
    badge: "info",
    buttonLabel: "Confirm Order",
  },
} as const;
