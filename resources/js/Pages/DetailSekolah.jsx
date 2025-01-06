import React, { useEffect, useState } from "react";
import UserLayout from "@/Layouts/UserLayout";

const DetailSekolah = ({ id }) => {
    const [sekolah, setSekolah] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Ambil data sekolah dari API berdasarkan ID
        fetch(`/api/schools/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Data not found");
                }
                return response.json();
            })
            .then((data) => {
                setSekolah(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching school data:", error);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!sekolah) {
        return <div>Data sekolah tidak ditemukan.</div>;
    }

    return (
        <UserLayout>
            <div className="container mx-auto py-10">
                <h1 className="text-2xl font-bold mb-4">Detail Sekolah</h1>
                <div className="flex flex-col items-center">
                    {/* Foto Sekolah */}
                    <img
                        src={sekolah.foto || "/default_school.jpg"} // Gunakan foto default jika foto tidak tersedia
                        alt="Foto Sekolah"
                        className="w-64 h-64 object-cover mb-6 rounded-lg shadow-md"
                    />
                    {/* Nama dan Alamat Sekolah */}
                    <div className="text-center">
                        <h2 className="text-xl font-bold mb-2">{sekolah.nama}</h2>
                        <p className="text-gray-600">{sekolah.alamat}</p>
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <a href="/" className="text-blue-500 underline hover:text-blue-700">
                        Kembali ke Daftar
                    </a>
                </div>
            </div>
        </UserLayout>
    );
};

export default DetailSekolah;
