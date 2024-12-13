import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MdDelete } from "react-icons/md";

import { FaRegEdit } from "react-icons/fa";
import axiosInstance from "@/config/axiosConfig";
import toast from "react-hot-toast";
import * as Yup from "yup";

const EditProduct = ({ data, getPurchaseIndents }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <AlertDialog className="" open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <label
          className="bg-green-800 text-white px-2 py-1 rounded-md mr-2 text-xs justify-center cursor-pointer flex items-center gap-1"
          onClick={handleOpen}
        >
          Edit <FaRegEdit />
        </label>
      </AlertDialogTrigger>

      <AlertDialogContent className="min-w-[80%] max-h-[90%] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Product</AlertDialogTitle>
          <AlertDialogDescription>
            Please update the product details below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Edit Product Modal will open here */}
        <EditProductModal
          data={data}
          handleCancel={handleClose} // Use handleClose to close the modal
          getPurchaseIndents={getPurchaseIndents}
        />

        <AlertDialogFooter>
          {/* <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClose}>Update</AlertDialogAction> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const validationSchema = Yup.object({
  documentNo: Yup.string().required("Document No. is required."),
  documentDate: Yup.date().required("Document Date is required."),
  indentType: Yup.string().required("Indent Type is required."),
  isReserved: Yup.boolean().required("Is Reserved field is required."),
  department: Yup.string().required("Department is required."),
  chargeType: Yup.string().required("Charge Type is required."),
  requestedBy: Yup.string().required("Requested By is required."),
  indentTag: Yup.array()
    .of(Yup.object().required("Each Indent Tag must be a string."))
    .min(1, "Indent Tag is required."), // Ensure at least one tag
  itemDetails: Yup.array().of(
    Yup.object({
      itemName: Yup.string().required("Item Name is required."),
      techSpec: Yup.string().max(
        1000,
        "Technical Specification cannot exceed 1000 characters."
      ),
      make: Yup.string().required("make is required"),
      uom: Yup.string().required("UOM is required."),
      qty: Yup.number()
        .typeError("Quantity must be a number.")
        .required("Quantity is required.")
        .positive("Quantity must be greater than 0."),
      rate: Yup.number()
        .typeError("Rate must be a number.")
        .required("Rate is required.")
        .positive("Rate must be greater than 0."),
      amount: Yup.number()
        .typeError("Amount must be a number.")
        .required("Amount is required.")
        .positive("Amount must be greater than 0."),
      requiredOn: Yup.date().required("Required On date is required."),
      remarks: Yup.string().max(1000, "Remarks cannot exceed 1000 characters."),
    })
  ),
});

export default EditProduct;

const EditProductModal = ({ data, handleCancel, getPurchaseIndents }) => {
  console.log("editProductModal", data);
  const [formData, setFormData] = useState({
    documentNo: data.documentNo,
    documentDate: data.documentDate,
    indentType: data.indentType._id,
    isReserved: data.isReserved, // Assuming isReserved is a string.
    department: data.department._id,
    chargeType: data.chargeType,
    requestedBy: data.requestedBy,
    indentTag: data.indentTag.map((tag) => ({ value: tag, label: tag })),
    remarks: data.remarks,
    itemDetails: data.items.map((item) => ({
      _id: item._id,
      itemName: item.itemName._id,
      techSpec: item.techSpec,
      make: item.make._id,
      uom: item.uom,
      qty: item.qty,
      rate: item.rate,
      amount: item.amount,
      requiredOn: item.requiredOn,
      remarks: item.remarks,
    })),
  });
  const [items, setItems] = useState([]);
  const [makes, setMakes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [indentTypes, setIndentTypes] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      debugger;
      try {
        const [itemsRes, makesRes, departmentsRes, indentTypesRes] =
          await Promise.all([
            axiosInstance.get("/item/getItems"),
            axiosInstance.get("/make/getMakes"),
            axiosInstance.get("/department/getDepartments"),
            axiosInstance.get("/indentType/getIndentTypes"),
          ]);
        if (itemsRes.status === 200) setItems(itemsRes.data);
        if (makesRes.status === 200) setMakes(makesRes.data);
        if (departmentsRes.status === 200) setDepartments(departmentsRes.data);
        if (indentTypesRes.status === 200) setIndentTypes(indentTypesRes.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const requestedByOptions = [
    { value: "John Doe", label: "John Doe" },
    { value: "Jane Smith", label: "Jane Smith" },
    { value: "Michael Johnson", label: "Michael Johnson" },
  ];

  const indentTagOptions = [
    { value: "Urgent", label: "Urgent" },
    { value: "Office Supplies", label: "Office Supplies" },
    { value: "Maintenance", label: "Maintenance" },
  ];

  // Handle changes for Requested By
  const handleRequestedByChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      requestedBy: selectedOption ? selectedOption.value : "",
    }));
  };

  // Handle changes for Indent Tag
  const handleIndentTagChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      indentTag: selectedOptions || [], // Update with selected options or empty array
    }));
  };

  const handleInputChange = (e, index, field) => {
    const updatedItemDetails = [...formData.itemDetails];
    updatedItemDetails[index][field] = e.target.value;
    setFormData((prev) => ({
      ...prev,
      itemDetails: updatedItemDetails,
    }));
  };

  // Handler to update state
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handler for itemDetails array
  const handleItemChange = (index, field, value) => {
    const updatedItems = formData.itemDetails.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData((prev) => ({ ...prev, itemDetails: updatedItems }));
  };

  function formatDateToInput(dateString) {
    const date = new Date(dateString); // Convert the ISO string to a Date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Format as yyyy-MM-dd
  }

  const handleUpdate = async (e) => {
    // Handle the update logic

    e.preventDefault();
    console.log("formData", formData);

    const payload = {
      ...formData,
      indentTag: formData.indentTag.map((tag) => tag.value), // Transform back to strings
    };

    if (formData.itemDetails.length < 1)
      return toast.error("Please add atleast one item!");

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      console.log("Validated FormData:", formData);

      try {
        const response = await axiosInstance.put(
          `/purchaseIndent/updatePurchaseIndent/${data._id}`,
          payload
        );
        console.log(response.data);
        if (response.status === 200) {
          toast.success("Data updated successfull!");
          getPurchaseIndents();
          handleCancel();
        }
      } catch (error) {
        console.log(error);
        toast.error("error while updating the data");
      }
    } catch (validationError) {
      if (validationError.inner) {
        // Loop through all validation errors and display them as toasts
        validationError.inner.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        // If no specific validation errors, show a generic error
        toast.error("Validation failed. Please check your inputs.");
      }
    }
  };

  const deleteItem = (id) => {
    setFormData((prev) => ({
      ...prev,
      itemDetails: prev.itemDetails.filter((item) => item._id !== id),
    }));
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
      <div className="p-6 bg-white rounded-md shadow-md w-full">
        {/* Document Info Form */}
        <form onSubmit={handleUpdate} className="grid grid-cols-4 gap-2">
          {/* Document No */}
          <div>
            <label className="block mb-1 font-medium">Document No.</label>
            <input
              type="text"
              name="documentNo"
              value={formData.documentNo}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Document Date */}
          <div>
            <label className="block mb-1 font-medium">Document Date</label>
            <input
              type="date"
              name="documentDate"
              value={formatDateToInput(formData.documentDate)}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Indent Type */}
          <div className="">
            <label className="block mb-1 font-medium">Indent Type</label>
            <select
              name="indentType"
              value={formData.indentType}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select</option>
              {indentTypes?.map((indent) => (
                <option key={indent._id} value={indent._id}>
                  {indent.type}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block mb-1 font-medium">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Department</option>
              {departments?.map((dpt) => (
                <option key={dpt._id} value={dpt._id}>
                  {dpt.department}
                </option>
              ))}
            </select>
          </div>

          {/* Charge Type */}
          <div className="">
            <label className="block mb-1 font-medium">Charge Type</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="chargeType"
                  value="Chargeable"
                  checked={formData.chargeType === "Chargeable"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Chargeable
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="chargeType"
                  value="Non Chargeable"
                  checked={formData.chargeType === "Non Chargeable"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Non Chargeable
              </label>
              {/* Is Reserved */}
            </div>
          </div>
          <div>
            <label htmlFor="">Requested By</label>
            <input
              placeholder="Requested By"
              className="w-full p-2 border rounded-md"
              name="requestedBy"
              type="text"
              value={formData.requestedBy}
              onChange={handleChange}
            />
          </div>

          {/* Indent Tag Field */}

          <div className="col-span-2">
            <label className="block mb-1 font-medium">Indent Tag</label>
            <CreatableSelect
              isMulti
              options={indentTagOptions} // Available options for tagging
              value={formData.indentTag} // Ensure it uses the transformed data
              onChange={handleIndentTagChange} // Update state on change
              placeholder="Add tags"
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          {/* Remarks */}
          <div className="col-span-4 mt-2">
            <textarea
              name="remarks"
              value={formData.remarks}
              placeholder="Remarks"
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows="1"
            />
          </div>

          <div className="flex items-center h-full col-span-4">
            <input
              type="checkbox"
              name="isReserved"
              checked={formData.isReserved}
              onChange={handleChange}
              className="mr-2"
              id="isReserved"
            />
            <label htmlFor="isReserved" className="font-medium text-red-600">
              Is Reserved
            </label>
          </div>

          {/* Item Details */}
          <h2 className="text-lg font-medium col-span-4 mt-5">Item Details</h2>
          <div className="col-span-4 -mt-4">
            {formData.itemDetails.map((item, index) => (
              <>
                <div className="mt-7">
                  <button
                    htmlFor=""
                    className="bg-red-600 px-4 py-1 !rounded-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteItem(item._id);
                    }}
                  >
                    <MdDelete color="white" />
                  </button>
                </div>
                <div key={index} className="grid grid-cols-4 gap-2 ">
                  <select
                    name="itemName"
                    className="w-full p-2 border rounded-md"
                    onChange={(e) => {
                      handleItemChange(index, "itemName", e.target.value);
                      console.log(e.target.value);
                    }}
                    value={item.itemName}
                  >
                    <option value="">Item Name</option>
                    {items?.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>

                  <select
                    name="make"
                    value={item.make}
                    onChange={(e) =>
                      handleItemChange(index, "make", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select Make</option>
                    {makes?.map((make) => (
                      <option key={make._id} value={make._id}>
                        {make.makeName}
                      </option>
                    ))}
                  </select>

                  <select
                    name="uom"
                    value={formData.itemDetails.department}
                    onChange={(e) =>
                      handleItemChange(index, "uom", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">UOM</option>
                    <option value="Electrical Department">
                      Electrical Department
                    </option>
                    <option value="Mechanical Department">
                      Mechanical Department
                    </option>
                  </select>

                  <div className="flex ">
                    <label className="block mb-1 font-medium">
                      Required On
                    </label>
                    <input
                      type="date"
                      value={formatDateToInput(item.requiredOn)}
                      onChange={(e) =>
                        handleItemChange(index, "requiredOn", e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <input
                    type="number"
                    placeholder="Quantity"
                    value={item.qty}
                    onChange={(e) =>
                      handleItemChange(index, "qty", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />

                  <input
                    type="number"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) =>
                      handleItemChange(index, "rate", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />

                  <div className="col-span-2 flex items-center gap-2 relative">
                    <label
                      htmlFor=""
                      className="inline-block w-[50%] text-center mb-1 font-medium"
                    >
                      Amount
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      readOnly={true}
                      value={item.qty * item.rate}
                      onChange={(e) =>
                        handleItemChange(index, "amount", e.target.value)
                      }
                      className="w-full p-2 border rounded-md outline-none"
                    />
                    <label htmlFor="" className="absolute top-[9px] right-5">
                      ₹
                    </label>
                  </div>

                  <textarea
                    placeholder="Tech Specification"
                    value={item.techSpec}
                    onChange={(e) =>
                      handleItemChange(index, "techSpec", e.target.value)
                    }
                    className="w-full col-span-2 p-2 border rounded-md"
                    rows="1"
                  />
                  <textarea
                    placeholder="Remarks"
                    value={item.remarks}
                    onChange={(e) =>
                      handleItemChange(index, "remarks", e.target.value)
                    }
                    className="w-full col-span-2 p-2 border rounded-md"
                    rows="1"
                  />
                </div>
              </>
            ))}
          </div>
          <div className="flex justify-end space-x-4 mt-5">
            <button
              onClick={(e) => {
                e.preventDefault();
                handleCancel();
              }}
              className="px-6 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
