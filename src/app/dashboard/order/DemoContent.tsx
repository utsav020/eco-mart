"use client";

import React, { useState, useCallback } from "react";
import DataTable, { TableColumn } from "react-data-table-component";

interface DataRow {
  id: number;
  orderNo: string;
  customer: string;
  date: string;
  amount: string;
  category: string;
  status: string;
}

const OverviewTable: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<DataRow[]>([]);
  const [toggleCleared] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [activeFilter, setActiveFilter] = useState<string>("All 250");

  const data: DataRow[] = [
    { id: 1, orderNo: "#87451", customer: "Esther Howard", date: "02/03/2022", amount: "$200", category: "Notebook", status: "Delivered" },
    { id: 2, orderNo: "#87452", customer: "Wade Warren", date: "02/03/2022", amount: "$220", category: "Notebook", status: "Delivered" },
    { id: 3, orderNo: "#87453", customer: "Jenny Wilson", date: "02/03/2022", amount: "$300", category: "Notebook", status: "Delivered" },
    { id: 4, orderNo: "#87454", customer: "Guy Hawkins", date: "02/03/2022", amount: "$400", category: "Notebook", status: "Delivered" },
    { id: 5, orderNo: "#87455", customer: "Robert Fox", date: "02/03/2022", amount: "$450", category: "Notebook", status: "Delivered" },
    { id: 6, orderNo: "#87456", customer: "Albert Flores", date: "02/03/2022", amount: "$220", category: "Notebook", status: "Delivered" },
    { id: 7, orderNo: "#87457", customer: "Floyd Miles", date: "02/03/2022", amount: "$270", category: "Notebook", status: "Delivered" },
    { id: 8, orderNo: "#87458", customer: "Bessie Cooper", date: "02/03/2022", amount: "$199", category: "Notebook", status: "Delivered" },
    { id: 9, orderNo: "#87459", customer: "Devon Lane", date: "02/03/2022", amount: "$120", category: "Notebook", status: "Delivered" },
    { id: 10, orderNo: "#87460", customer: "Guy Hawkins", date: "02/03/2022", amount: "$122", category: "Notebook", status: "Delivered" },
  ];

  const columns: TableColumn<DataRow>[] = [
    {
      name: "Order No",
      selector: (row) => row.orderNo,
      sortable: true,
      cell: (row) => <p className="text-green-600 font-semibold">{row.orderNo}</p>,
      width: "20%",
    },
    {
      name: "Customer",
      selector: (row) => row.customer,
      sortable: true,
      cell: (row) => <p className="font-medium text-gray-900">{row.customer}</p>,
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
      cell: (row) => <p className="font-medium text-gray-700">{row.date}</p>,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
      cell: (row) => <p className="font-medium text-gray-800">{row.amount}</p>,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
      cell: (row) => <p className="font-medium text-gray-800">{row.category}</p>,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-sm text-green-600">{row.status}</span>
          <img src="/assets/images-dashboard/grocery/20.png" alt="" className="w-4 h-4" />
          <div className="flex gap-2 text-xs text-blue-600 cursor-pointer">
            <span>Edit</span>
            <span>Delete</span>
          </div>
        </div>
      ),
    },
  ];

  const handleRowSelected = useCallback((state: { selectedRows: DataRow[] }) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const filteredItems = data.filter((item) =>
    item.customer.toLowerCase().includes(filterText.toLowerCase()) ||
    item.orderNo.toLowerCase().includes(filterText.toLowerCase()) ||
    item.status.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="w-full p-4 md:p-6 lg:p-10 bg-white min-h-screen flex flex-col">

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h3 className="text-3xl font-bold text-gray-900">Overview</h3>

        <div className="">
          <select className="border rounded-md px-4 py-2 bg-white text-gray-700 text-sm shadow-sm focus:outline-none">
          <option>Week</option>
          <option>Month</option>
          <option>Year</option>
          <option>6 Month</option>
        </select>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["All 250", "New Item 150", "Disabled 154"].map((filter) => (
          <div className="">
            <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all 
              ${
                activeFilter === filter
                  ? "bg-green-600 text-white border-green-600 shadow"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
          >
            {filter}
          </button>
          </div>
        ))}
      </div>

      {/* SEARCH & ROW COUNT */}
      <div className="bg-white shadow-md rounded-xl  p-4 mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <label className="flex items-center justify-between w-[110px] gap-2 text-md font-medium text-gray-600">
          Show:
          <div className="">
            <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
            className="border rounded px-2 py-1 text-sm bg-gray-50"
          >
            {[5, 10, 15, 20].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          </div>
          
        </label>

        <div className="border rounded-lg py-2 text-sm md:w-64 bg-gray-50 focus:outline-none">
          <input
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className=""
        />
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-2">
        <DataTable
          columns={columns}
          data={filteredItems}
          selectableRows
          onSelectedRowsChange={handleRowSelected}
          clearSelectedRows={toggleCleared}
          pagination
          paginationPerPage={rowsPerPage}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          highlightOnHover
          className="text-sm"
          noDataComponent="No data found"
        />
      </div>

      {/* FOOTER */}
      <footer className="mt-10 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
        <p>© 2025 All Rights Reserved.</p>
        <ul className="flex gap-4 mt-2 md:mt-0">
          <li><a href="#" className="hover:text-gray-900">Terms</a></li>
          <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
          <li><a href="#" className="hover:text-gray-900">Help</a></li>
        </ul>
      </footer>
    </div>
  );
};

export default OverviewTable;
