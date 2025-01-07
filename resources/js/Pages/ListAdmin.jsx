import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Inertia } from "@inertiajs/inertia";
import UserLayout from "@/Layouts/UserLayout";

const ListAdmin = () => {
    const [dataAdmin, setDataAdmin] = useState([]); // Data admin dari API
    const [search, setSearch] = useState(""); // State untuk pencarian
    const [showModal, setShowModal] = useState(false); // Modal visibility
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        email: ""
    }); // State untuk form data

    // Fetch data admin dari API Laravel
    useEffect(() => {
        fetch("/api/admin-list")
            .then((response) => response.json())
            .then((data) => setDataAdmin(data))
            .catch((error) => console.error("Error fetching admin data:", error));
    }, []);

    // Filter data berdasarkan pencarian
    const filteredData = dataAdmin.filter((item) => {
        return (
            (item.name?.toLowerCase().includes(search.toLowerCase()) || "") &&
            (item.email?.toLowerCase().includes(search.toLowerCase()) || "")
        );
    });

    const handleCancel = () => {
        // Reset form data
        setFormData({
            id: null,
            name: "",
            email: ""
        });

        // Tutup modal
        setShowModal(false);
    };

    // Definisi kolom untuk tabel
    const columns = [
        {
            name: "No",
            selector: (row, index) => index + 1,
            sortable: true,
            width: "5rem",
        },
        {
            name: "name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        className="text-white bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
                        onClick={() => handleUpdate(row)}
                    >
                        Update
                    </button>
                    <button
                        className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDelete(row.id)}
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle Create/Update Form Submit
    const handleSubmit = (e) => {
        e.preventDefault();

        // Jika ID ada, berarti ini adalah update
        const endpoint = formData.id
            ? `/api/admin-list/store` // Sama untuk create dan update
            : `/api/admin-list/store`;

        // Kirim data menggunakan Inertia
        Inertia.post(endpoint, formData, {
            onSuccess: () => {
                alert("Data successfully saved!");
                setShowModal(false); // Tutup modal
                handleCancel(); // Reset form
                fetchData(); // Refresh data
            },
            onError: (errors) => {
                console.error(errors);
                alert("Error saving data.");
            },
        });
    };


    // Handle Delete
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this admin?")) {
            Inertia.delete(`/api/admin-list/${id}`, {
                onSuccess: () => {
                    alert("Data successfully deleted!");
                    fetchData(); // Refresh data
                },
                onError: (errors) => {
                    console.error(errors);
                    alert("Failed to delete item.");
                },
            });
        }
    };

    // Handle Update
    const handleUpdate = (row) => {
        setFormData({
            id: row.id,
            name: row.name,
            email: row.email,
            password: "", // Password kosong saat update
        });
        setShowModal(true); // Tampilkan modal
    };

    // Fetch data again
    const fetchData = () => {
        fetch("/api/admin-list")
            .then((response) => response.json())
            .then((data) => setDataAdmin(data))
            .catch((error) => console.error("Error fetching admin data:", error));
    };

    return (
        <UserLayout>
            <div className="container mx-auto py-10 font-mono">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">List Admin</h1>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={() => setShowModal(true)} // Tampilkan modal untuk create
                    >
                        Create Admin
                    </button>
                </div>
                <div className="flex items-center mb-4 gap-4">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="p-2 border border-gray-300 rounded flex-1"
                    />
                </div>

                {/* Tabel */}
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 20, 30]}
                    highlightOnHover
                    striped
                    responsive
                />
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-mono">
                    <div className="bg-white rounded-lg p-6 w-1/2">
                        <h2 className="text-xl font-bold mb-4">
                            {formData.id ? "Update Admin" : "Create Admin"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2"> Nama </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </UserLayout>
    );
};

export default ListAdmin;


