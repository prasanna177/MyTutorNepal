import {
  Box,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { DataTable } from "../DataTable";

const TabTable = ({
  firstTab,
  secondTab,
  firstData,
  secondData,
  columns,
  isLoading,
}) => {
  return (
    <Tabs variant={"soft-rounded"} colorScheme="purple">
      <TabList>
        <Tab>
          <HStack>
            <Text>{firstTab}</Text>
            <Box>({firstData.length})</Box>
          </HStack>
        </Tab>
        <Tab>
          <HStack>
            <Text>{secondTab}</Text>
            <Box>({secondData.length})</Box>
          </HStack>
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <DataTable columns={columns} data={firstData} isLoading={isLoading} />
        </TabPanel>
        <TabPanel>
          <DataTable
            columns={columns}
            data={secondData}
            isLoading={isLoading}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default TabTable;
