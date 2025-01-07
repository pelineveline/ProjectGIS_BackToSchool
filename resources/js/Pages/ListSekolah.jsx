import React, { useEffect, useState } from "react";
import UserLayout from "@/Layouts/UserLayout";
import DataTable from "react-data-table-component";
import { Inertia } from "@inertiajs/inertia";
import { redirect } from "react-router-dom";
import { all } from "axios";

const ListSekolah = () => {
    const [dataSekolah, setDataSekolah] = useState([]);
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        nama: "",
        alamat: "",
        garis_bujur: "",
        garis_lintang: "",
        foto: null,
    }); // Cek apakah pengguna admin

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle file input changes
    const handleFileChange = (e) => {
        setFormData({ ...formData, foto: e.target.files[0] });
    };

    const handleCancel = () => {
        // Reset form data
        setFormData({
            id: null,
            nama: "",
            alamat: "",
            garis_bujur: "",
            garis_lintang: "",
            foto: null,
        });

        // Tutup modal
        setShowModal(false);
    };


    // Fetch data sekolah dari API Laravel
    useEffect(() => {
        fetch("/api/schools-list")
            .then((response) => response.json())
            .then((data) => setDataSekolah(data))
            .catch((error) => console.error("Error fetching data:", error));

        // Cek role pengguna dari sesi
        fetch("/api/check-role") // Endpoint untuk cek role
            .then((response) => response.json())
            .then((data) => setIsAdmin(data.isAdmin === 1)) // Set true jika admin
            .catch((error) => console.error("Error checking role:", error));
    }, []);

    // Filter data berdasarkan tipe dan pencarian
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
            selector: (row, index) => index + 1,
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
                    className="underline hover:text-blue-700"
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

    // Tambahkan kolom Action jika pengguna admin
    if (isAdmin) {
        columns.push({
            name: "Action",
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        className="text-white bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
                        onClick={() => handleUpdate(row.id)}
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
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const formDataToSubmit = new FormData();

        if (formData.id) {
            formDataToSubmit.append('id', formData.id);
        }

        Object.keys(formData).forEach((key) => {
            // Hanya tambahkan jika key bukan `foto` atau jika `foto` ada
            if (key !== 'foto' || (key === 'foto' && formData[key])) {
                formDataToSubmit.append(key, formData[key]);
            }
        });

        Inertia.post('/api/schools-list/store', formDataToSubmit, {
            onSuccess: () => {
                alert(`Data successfully saved!`);
                setShowModal(false);
            },
            onError: (errors) => {
                console.error(errors);
                alert("Terjadi kesalahan saat menyimpan data.");
            },
        });
    };


    const handleUpdate = (id) => {
        fetch(`/api/schools-list/${id}`) // API endpoint untuk mengambil data berdasarkan ID
            .then((response) => response.json())
            .then((data) => {
                setFormData({
                    id: data.id, // Tambahkan ID
                    nama: data.nama,
                    alamat: data.alamat,
                    garis_bujur: data.garis_bujur,
                    garis_lintang: data.garis_lintang,
                    foto: null, // Foto tidak langsung ditampilkan
                });
                setShowModal(true); // Tampilkan modal
            })
            .catch((error) => console.error("Error fetching data:", error));
    };


    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this school?")) {

            Inertia.delete(`/api/schools-list/${id}`, {
                preserveScroll: true,
                preserveState: false,
                onSuccess: (page) => {
                    if (page.props.flash?.success) {
                        alert(page.props.flash.success); // Display flash success message
                    }
                },
                onError: (errors) => {
                    console.log(errors);
                    alert('Failed to delete item');
                }
            });
        }


    };

    const handleRowClick = (row) => {
        redirect(`/sekolah/${row.id}`); // Arahkan ke halaman detail sekolah berdasarkan ID
    };

    return (
        <UserLayout>
            <div className="container mx-auto py-10 font-mono">
                <div className="flex justify-between items-center mb-6 ">
                    <h1 className="text-2xl font-bold">List Sekolah</h1>
                    {/* Tombol Create Data hanya muncul jika admin */}
                    {isAdmin && (
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            onClick={() => setShowModal(true)} // Logika create data
                        >
                            Create Data
                        </button>
                    )}
                </div>
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
                    paginationPerPage={20}
                    paginationRowsPerPageOptions={[10, 20, 30, 100]}
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
                            {formData.id ? "Update Data Sekolah" : "Create Data Sekolah"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Nama</label>
                                <input
                                    type="text"
                                    name="nama"
                                    value={formData.nama}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Alamat</label>
                                <input
                                    type="text"
                                    name="alamat"
                                    value={formData.alamat}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Garis Bujur</label>
                                <input
                                    type="text"
                                    name="garis_bujur"
                                    value={formData.garis_bujur}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Garis Lintang</label>
                                <input
                                    type="text"
                                    name="garis_lintang"
                                    value={formData.garis_lintang}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Foto</label>
                                <input
                                    type="file"
                                    name="foto"
                                    onChange={handleFileChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                {/* Cancel Button */}
                                <button
                                    type="button"
                                    onClick={handleCancel} // Reset form dan tutup modal
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                {/* Submit Button */}
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

export default ListSekolah;
