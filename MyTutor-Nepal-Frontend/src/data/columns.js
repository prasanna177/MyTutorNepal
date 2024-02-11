import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export const COLUMNS = [
  columnHelper.accessor("fullName", {
    header: "Name",
  }),
  columnHelper.accessor("email", {
    header: "Email"
  }),
  columnHelper.accessor("role", {
    header: "Role"
  })
];
