import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  Image,
} from "@chakra-ui/react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import NoData from "../assets/images/NoData.png";

export function DataTable({ data, columns }) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TableContainer py={5} bg={"white"} width={"100%"}>
      <Table variant={"simple"} overflowX={"auto"}>
        <Thead bg={"gray.50"}>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Th
                    fontSize={"sm"}
                    fontWeight={"bold"}
                    fontcolor={"gray.700"}
                    textTransform={"uppercase"}
                    border={"none"}
                    key={header.id}
                    pl={5}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        {data && data.length === 0 ? (
          <Tr>
            <Td
              border={"none"}
              colSpan={table.getHeaderGroups()[0].headers.length}
            >
              <Box fontSize={"14px"} fontWeight={500} color={"gray.400"}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <Image h={"400px"} src={NoData} />
                  <Text>No Data Available</Text>
                </Box>
              </Box>
            </Td>
          </Tr>
        ) : (
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <Td
                      fontSize={"md"}
                      fontWeight={"normal"}
                      color={"gray.700"}
                      borderBottom="1px"
                      borderColor="gray.150"
                      borderStyle="solid"
                      key={cell.id}
                      pl={5}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
        )}
      </Table>
    </TableContainer>
  );
}
