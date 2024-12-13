import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import EditProduct from "@/components/EditProduct";
import toast from "react-hot-toast";
import axiosInstance from "@/config/axiosConfig";

const DisplayProduct = () => {
  // Sample formData with multiple documents
  const [formData, setFormData] = useState([
    {
      documentNo: "ABC123",
      documentDate: "2024-12-10",
      indentType: "Capital",
      department: "Mechanical Department",
      isReserved: "true",
      chargeType: "Chargeable",
      requestedBy: "John Doe",
      remarks: "Urgent order",
      itemDetails: [
        {
          itemName: "Item 1",
          techSpec: "Spec 1",
          make: "Brand A",
          uom: "Unit 1",
          qty: 10,
          rate: 100,
          amount: 1000,
          requiredOn: "2024-12-15",
          remarks: "Urgent",
        },
        {
          itemName: "Item 2",
          techSpec: "Spec 2",
          make: "Brand B",
          uom: "Unit 2",
          qty: 20,
          rate: 50,
          amount: 1000,
          requiredOn: "2024-12-20",
          remarks: "Not Urgent",
        },
      ],
    },
    {
      documentNo: "DEF456",
      documentDate: "2024-12-12",
      indentType: "Maintenance",
      department: "Electrical Department",
      isReserved: "false",
      chargeType: "Non-Chargeable",
      requestedBy: "Jane Doe",
      remarks: "Routine maintenance",
      itemDetails: [
        {
          itemName: "Item 3",
          techSpec: "Spec 3",
          make: "Brand C",
          uom: "Unit 3",
          qty: 15,
          rate: 75,
          amount: 1125,
          requiredOn: "2024-12-18",
          remarks: "Priority",
        },
        {
          itemName: "Item 4",
          techSpec: "Spec 4",
          make: "Brand D",
          uom: "Unit 4",
          qty: 30,
          rate: 45,
          amount: 1350,
          requiredOn: "2024-12-22",
          remarks: "Routine",
        },
      ],
    },
  ]);

  const getPurchaseIndents = async() => {
    debugger
    try {
      const response = await axiosInstance.get('/purchaseIndent/getPurchaseIndents')
      if(response.status === 200){
        // console.log('response',response.data)
        setFormData(response.data);
      }
    } catch (error) {
      console.log(error)
      toast.error('something went wrong!')

    }
  }
  useEffect(()=>{
    getPurchaseIndents();
  },[])

  const handleDelete = (dataIndex, itemIndex) => {
    const updatedItems = [...formData[dataIndex].itemDetails];
    updatedItems.splice(itemIndex, 1);
    const updatedFormData = [...formData];
    updatedFormData[dataIndex].itemDetails = updatedItems;
    setFormData(updatedFormData);
  };

  const handleDeleteProduct = async(id) => {
    try {
        const response = await axiosInstance.delete(`/purchaseIndent/deletePurchaseIndent/${id}`)
        if(response.status === 200){
          toast.success('Successfully deleted!')
          getPurchaseIndents();
        }
      } catch (error) {
        console.log(error)
        toast.error('Deletion Failed!')
    }
  }


  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-xl font-bold mb-4">Purchase Indent Data</h1>

      {/* Iterate over formData to render multiple documents */}
      {formData && formData?.map((data, dataIndex) => (
        <ShowData
          key={data.documentNo}
          data={data}
          dataIndex={dataIndex}
          handleDelete={handleDelete}
          handleDeleteProduct={handleDeleteProduct}
          getPurchaseIndents={getPurchaseIndents}
        />
      ))}
    </div>
  );
};

function formatDateToDDMMYY(date) {
  const d = new Date(date); // Ensure input is a Date object
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = String(d.getFullYear()).slice(-2); // Get last two digits of the year

  return `${day}-${month}-${year}`;
}



const ShowData = ({ data, dataIndex, handleDeleteProduct,getPurchaseIndents }) => {
  const [isEditModeEnable, setIsEditModeEnable] = useState(false);
  return (
    <div key={uuidv4()} className="mb-14">
      {/* Document metadata in a single table */}
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left text-xs">S.No</th>
            <th className="px-4 py-2 text-left text-xs">Document No</th>
            <th className="px-4 py-2 text-left text-xs">Date</th>
            <th className="px-4 py-2 text-left text-xs">Indent Type</th>
            <th className="px-4 py-2 text-left text-xs">Department</th>
            <th className="px-4 py-2 text-left text-xs">IsReserved</th>
            <th className="px-4 py-2 text-left text-xs">Charge Type</th>
            <th className="px-4 py-2 text-left text-xs">Requested By</th>
            <th className="px-4 py-2 text-left text-xs">Remarks</th>
            <th className="px-4 py-2 text-left text-xs">Indent Tag</th>
            <th className="px-4 py-2 text-left text-xs">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2 text-sm">{dataIndex + 1}</td>
            <td className="border px-4 py-2 text-sm">{data.documentNo}</td>
            <td className="border px-4 py-2 text-sm">{formatDateToDDMMYY(data.documentDate)}</td>
            <td className="border px-4 py-2 text-sm">{data.indentType.type}</td>
            <td className="border px-4 py-2 text-sm">{data.department.department}</td>
            <td className="border px-4 py-2 text-sm">{data.isReserved ? 'true' : 'false'}</td>
            <td className="border px-4 py-2 text-sm">{data.chargeType}</td>
            <td className="border px-4 py-2 text-sm">{data.requestedBy}</td>
            <td className="border px-4 py-2 text-sm overflow-auto">{data.remarks}</td>
            <td className="border px-4 py-2 text-sm">{data.indentTag?.join(', ')}</td>
            <td className="border px-4 py-2 text-sm flex items-center">
              <EditProduct data={data} getPurchaseIndents={getPurchaseIndents}/>
              <button
                onClick={() => handleDeleteProduct(data._id)}
                className="bg-red-700 text-white justify-center px-2 py-1 rounded-md mr-2 text-xs flex items-center"
              >
                Delete
                <MdDelete/>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Item Details Tables */}
     {data?.items?.length > 0 ? <>
      <h2 className="text-lg font-semibold">Item Details</h2>
      <table
        key={uuidv4()}
        className="min-w-full table-auto border-collapse border border-gray-300 mb-6"
      >
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left text-xs">Item Name</th>
            <th className="px-4 py-2 text-left text-xs">Tech Specs</th>
            <th className="px-4 py-2 text-left text-xs">Make</th>
            <th className="px-4 py-2 text-left text-xs">UOM</th>
            <th className="px-4 py-2 text-left text-xs">Qty</th>
            <th className="px-4 py-2 text-left text-xs">Rate</th>
            <th className="px-4 py-2 text-left text-xs">Amount</th>
            <th className="px-4 py-2 text-left text-xs">Required On</th>
            <th className="px-4 py-2 text-left text-xs">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {data?.items?.map((item, itemIndex) => (
            <tr key={item._id}>
              <td className="border px-4 py-2 text-sm">{item.itemName.name}</td>
              <td className="border px-4 py-2 text-sm">{item.techSpec}</td>
              <td className="border px-4 py-2 text-sm">{item.make.makeName}</td>
              <td className="border px-4 py-2 text-sm">{item.uom}</td>
              <td className="border px-4 py-2 text-sm">{item.qty}</td>
              <td className="border px-4 py-2 text-sm">{item.rate}</td>
              <td className="border px-4 py-2 text-sm">{item.amount}</td>
              <td className="border px-4 py-2 text-sm">{formatDateToDDMMYY(item.requiredOn)}</td>
              <td className="border px-4 py-2 text-sm">{item.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </> : <h2 className="text-lg font-semibold mt-2">No Items!</h2>
    }
    </div>
  );
};

export default DisplayProduct;
