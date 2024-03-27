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
  VStack,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import NoData from "../../assets/images/NoData.png";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

export function DataTable({ data, columns, isLoading }) {
  const table = useReactTable({
    columns,
    data,
    debugTable: true,
    getSortedRowModel: getSortedRowModel(),
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
                    <Box
                      _hover={
                        header.column.getCanSort() ? { cursor: "pointer" } : {}
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <TriangleUpIcon color={"primary.0"} />,
                        desc: <TriangleDownIcon color={"primary.0"} />,
                      }[header.column.getIsSorted()] ?? null}
                    </Box>
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        {isLoading ? (
          <Tr>
            <Td
              border={"none"}
              colSpan={table.getHeaderGroups()[0].headers.length}
            >
              <Flex justifyContent={"center"} m={8}>
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="primary.600"
                  size="xl"
                />
              </Flex>
            </Td>
          </Tr>
        ) : data?.length === 0 ? (
          <Tr>
            <Td
              border={"none"}
              colSpan={table.getHeaderGroups()[0].headers.length}
            >
              <Box fontSize={"14px"} fontWeight={500} color={"gray.400"}>
                <VStack
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <Image h={"400px"} src={NoData} />
                  <Text variant={"overline"}>No Data Available</Text>
                </VStack>
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
