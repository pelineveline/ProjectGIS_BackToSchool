import React, { useEffect, useState } from "react";
import UserLayout from "@/Layouts/UserLayout";
import DataTable from "react-data-table-component";

const ListSekolah = () => {
  const [dataSekolah, setDataSekolah] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/sekolahOke.json")
      .then((response) => response.json())
      .then((data) => {
        const extractedData = data.features.map((feature, index) => ({
          id: index + 1,
          nama: feature.properties.Nama_Sekol,
          alamat: feature.properties.Alamat,
          tipe: feature.properties.Nama_Sekol.slice(0, 3).toUpperCase(),
        }));
        setDataSekolah(extractedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredData = dataSekolah.filter((item) => {
    const matchesFilter = filter === "All" || item.tipe === filter;
    const matchesSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.alamat.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const columns = [
    {
      name: "No",
      selector: (row) => row.id,
      sortable: true,
      width: "5rem",
    },
    {
      name: "Nama Sekolah",
      selector: (row) => row.nama,
      sortable: true,
      cell: (row) => (
        <a
          href={`/sekolah/${row.id}`}
          className="text-blue-500 underline hover:text-blue-700"
        >
          {row.nama}
        </a>
      ),
    },
    {
      name: "Alamat",
      selector: (row) => row.alamat,
      sortable: true,
    },
  ];

  return (
    <UserLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">List Sekolah</h1>
        <div className="flex items-center mb-4 gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="All">All</option>
            <option value="SMA">SMA</option>
            <option value="SMP">SMP</option>
            <option value="SDN">SDN</option>
          </select>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or address..."
            className="p-2 border border-gray-300 rounded flex-1"
          />
        </div>
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30, 50]}
          highlightOnHover
          striped
          responsive
        />
      </div>
    </UserLayout>
  );
};

export default ListSekolah;
