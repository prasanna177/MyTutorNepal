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
  thirdTab,
  firstData,
  secondData,
  thirdData,
  columns,
  isLoading,
  hasThreeTabs,
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
        {hasThreeTabs && (
          <Tab>
            <HStack>
              <Text>{thirdTab}</Text>
              <Box>({thirdData.length})</Box>
            </HStack>
          </Tab>
        )}
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
        {hasThreeTabs && (
          <TabPanel>
            <DataTable
              columns={columns}
              data={thirdData}
              isLoading={isLoading}
            />
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  );
};

export default TabTable;
