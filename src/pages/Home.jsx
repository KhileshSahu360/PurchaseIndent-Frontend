import axiosInstance from "@/config/axiosConfig";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import CreatableSelect from "react-select/creatable";

import * as Yup from "yup";

const validationSchema = Yup.object({
  documentNo: Yup.string().required("Document No. is required."),
  documentDate: Yup.date().required("Document Date is required."),
  indentType: Yup.string().required("Indent Type is required."),
  isReserved: Yup.boolean().required("Is Reserved field is required."),
  department: Yup.string().required("Department is required."),
  chargeType: Yup.string().required("Charge Type is required."),
  requestedBy: Yup.string().required("Requested By is required."),
  indentTag: Yup.array()
    .of(Yup.string().required("Each Indent Tag must be a string."))
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
        .required("Amount is required.")
        .positive("Amount must be greater than 0."),
      requiredOn: Yup.date().required("Required On date is required."),
      remarks: Yup.string().max(1000, "Remarks cannot exceed 1000 characters."),
    })
  ),
});

const Home = () => {
  const [formData, setFormData] = useState({
    documentNo: "",
    documentDate: new Date().toISOString().slice(0, 10),
    indentType: "",
    isReserved: false,
    department: "",
    chargeType: "",
    requestedBy: "",
    indentTag: [],
    remarks: "",
    itemDetails: [
      {
        itemName: "",
        techSpec: "",
        make: "",
        uom: "",
        qty: "",
        rate: "",
        amount: "",
        requiredOn: "",
        remarks: "",
      },
    ],
  });

  const [items, setItems] = useState([]);
  const [makes, setMakes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [indentTypes, setIndentTypes] = useState([]);
  const [indentTags, setIndentTags] = useState([]);
  const [requestBys, setRequestedBys] = useState([]);

  const generateIndentTagsOption = (tags) => {
    console.log("tags", tags);
    return tags?.map((tag) => ({ value: tag.tag, label: tag.tag }));
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [
          itemsRes,
          makesRes,
          departmentsRes,
          indentTypesRes,
          indentTagsRes,
          requestedBysRes,
        ] = await Promise.all([
          axiosInstance.get("/item/getItems"),
          axiosInstance.get("/make/getMakes"),
          axiosInstance.get("/department/getDepartments"),
          axiosInstance.get("/indentType/getIndentTypes"),
          axiosInstance.get("/indentTag/getIndentTags"),
          axiosInstance.get("/requestedBy/getRequestedBy"),
        ]);
        if (itemsRes.status === 200) setItems(itemsRes.data);
        if (makesRes.status === 200) setMakes(makesRes.data);
        if (departmentsRes.status === 200) setDepartments(departmentsRes.data);
        if (indentTypesRes.status === 200) setIndentTypes(indentTypesRes.data);
        if (requestedBysRes.status === 200)
          setRequestedBys(requestedBysRes.data);
        if (indentTagsRes.status === 200)
          setIndentTags(generateIndentTagsOption(indentTagsRes.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const genRanHex = (size) => {
    return [...Array(size)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");
  };
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      documentNo: genRanHex(6).toUpperCase(),
    }));
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
      indentTag: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
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
  const handleItemChange = (index, field, value, itemcode) => {
    debugger
    setFormData((prev) => {
      const updatedItems = prev.itemDetails.map((item, i) => {
        if (i === index) {
          // Update the field (qty or rate)
          const updatedItem = { ...item, [field]: value };

          // Recalculate the amount if qty or rate changes
          if (field === "qty" || field === "rate") {
            const qty = field === "qty" ? value : updatedItem.qty || 0;
            const rate = field === "rate" ? value : updatedItem.rate || 0;
            updatedItem.amount = Number(qty) * Number(rate);
          }
          if(field === 'itemName'){
            updatedItem.uom = itemcode;
          }

          return updatedItem;
        }
        return item;
      });

      return { ...prev, itemDetails: updatedItems };
    });
  };

  // Add a new row for item details
  const addNewItemRow = () => {
    setFormData((prev) => ({
      ...prev,
      itemDetails: [
        ...prev.itemDetails,
        {
          itemName: "",
          techSpec: "",
          make: "",
          uom: "",
          qty: "",
          rate: "",
          amount: "",
          requiredOn: "",
          remarks: "",
        },
      ],
    }));
  };

  const resetFormData = () => {
    debugger;
    setFormData({
      documentNo: genRanHex(6).toUpperCase(),
      documentDate: new Date().toISOString().slice(0, 10),
      indentType: "",
      isReserved: false,
      department: "",
      chargeType: "",
      requestedBy: "",
      indentTag: [],
      remarks: "",
      itemDetails: [
        {
          itemName: "",
          techSpec: "",
          make: "",
          uom: "",
          qty: "",
          rate: "",
          amount: "",
          requiredOn: "",
          remarks: "",
        },
      ],
    });
  };

  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();

    if (formData.itemDetails.length < 1)
      return toast.error("Please add atleast one item!");

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      console.log("Validated FormData:", formData);

      try {
        const response = await axiosInstance.post(
          "/purchaseIndent/newPurchaseIndent",
          formData
        );
        console.log("Purchase Indent Created:", response.data);
        if (response.status === 200) {
          toast.success("New Purchase Indent successfully created!");
          resetFormData();
        }
      } catch (error) {
        console.log(error);
        toast.error("something went wrong please try again later!");
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

    console.log("formData", formData);
  };

  const deleteItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      itemDetails: prev.itemDetails.filter((_, indx) => indx !== index),
    }));
  };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-xl font-bold mb-4">Purchase Indent Form</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-2">
        {/* Document No */}
        <div>
          <label className="block mb-1 font-medium">
            Document No. <span className="text-red-600">*</span>
          </label>
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
          <label className="block mb-1 font-medium">
            Document Date <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            name="documentDate"
            value={formData.documentDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Indent Type */}
        <div className="">
          <label className="block mb-1 font-medium">
            Indent Type <span className="text-red-600">*</span>
          </label>
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
          <label className="block mb-1 font-medium">
            Department <span className="text-red-600">*</span>
          </label>
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
          <label className="block mb-1 font-medium">
            Charge Type <span className="text-red-600">*</span>
          </label>
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
          <label className="block mb-1 font-medium">
            Requested By <span className="text-red-600">*</span>
          </label>
          <input
            list="requestedBy"
            id="requestedBy"
            name="requestedBy"
            className="w-full p-2 border rounded-md"
            value={formData.requestedBy}
            onChange={handleChange}
          />
          <datalist id="requestedBy">
            {requestBys.map((option, index) => (
              <option key={option.name} value={option.name} />
            ))}
          </datalist>
        </div>

        {/* Indent Tag Field */}

        <div className="col-span-2">
          <label className="block mb-1 font-medium">
            Indent Tag <span className="text-red-600">*</span>
          </label>
          <CreatableSelect
            isMulti
            options={indentTags}
            onChange={handleIndentTagChange}
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
            Is Reserved <span className="text-red-600">*</span>
          </label>
        </div>

        {/* Item Details */}
        <h2 className="text-lg font-medium col-span-4 mt-5">
          Item Details <span className="text-red-600">*</span>
        </h2>
        <div className="col-span-4 -mt-4">
          {formData.itemDetails.map((item, index) => (
            <>
              <div className="mt-7">
                <button
                  htmlFor=""
                  className="bg-red-600 px-4 py-1 !rounded-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteItem(index);
                  }}
                >
                  <MdDelete color="white" />
                </button>
              </div>
              <div key={index} className="grid grid-cols-4 gap-2">
                <div className="flex items-start h-full">
                  <select
                    name="itemName"
                    className="w-[100%] h-full"
                    id=""
                    onChange={(e) =>{
                      const selectedItem = items.find((item) => item._id === e.target.value);
                      handleItemChange(index, "itemName", selectedItem._id, selectedItem.itemCode);
                    }}
                    value={formData.itemDetails.itemName}
                  >
                    <option value="">Item Name</option>
                    {items?.map((item) => (
                      <option key={item._id} value={item._id} itemCode={item.itemCode}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <span className="text-red-600">*</span>
                </div>
                <div className="flex items-start">
                  <select
                    name="make"
                    value={formData.itemDetails.make}
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
                  <span className="text-red-600">*</span>
                </div>

                <div className="flex items-start">
                  <input type="text" placeholder="UOM"  readOnly value={item.uom}  className="w-full p-2 border rounded-md outline-none"/>
                  <span className="text-red-600">*</span>
                </div>

                <div className="flex ">
                  <label className="block mb-1 font-medium">
                    Required On <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.requiredOn}
                    onChange={(e) =>
                      handleItemChange(index, "requiredOn", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-start">
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={item.qty}
                    onChange={(e) =>
                      handleItemChange(index, "qty", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />
                  <span className="text-red-600">*</span>
                </div>

                <div className="flex items-start">
                  <input
                    type="number"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) =>
                      handleItemChange(index, "rate", e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                  />
                  <span className="text-red-600">*</span>
                </div>

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
                    value={Number(item.amount)}
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
          <button
            type="button"
            onClick={addNewItemRow}
            className="bg-blue-500 text-white p-2 rounded-md mt-2"
          >
            Add More Item
          </button>
        </div>

        <div className="col-span-1 mt-6">
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Home;
