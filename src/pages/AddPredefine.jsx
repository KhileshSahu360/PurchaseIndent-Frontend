import Item from "@/components/Item";
import { Button } from "../components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs"
import ItemMasterTable from "@/components/Item";
import DepartmentMasterTable from "@/components/Department";
import IndentTypeMasterTable from "@/components/IndentType";
import MakeMasterTable from "@/components/Make";

const AddPredefine = () => {
  return (
    <Tabs defaultValue="itemName" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="itemName">Item Name</TabsTrigger>
        <TabsTrigger value="department">Department</TabsTrigger>
        <TabsTrigger value="indentType">Indent Type</TabsTrigger>
        <TabsTrigger value="make">Make</TabsTrigger>
      </TabsList>
      <TabsContent value="itemName">
        <ItemMasterTable/>
      </TabsContent>
      <TabsContent value="department">
        <DepartmentMasterTable/>
      </TabsContent>
      <TabsContent value="indentType">
        <IndentTypeMasterTable/>
      </TabsContent>
      <TabsContent value="make">
        <MakeMasterTable/>
      </TabsContent>
    </Tabs>
  )
}

export default AddPredefine;