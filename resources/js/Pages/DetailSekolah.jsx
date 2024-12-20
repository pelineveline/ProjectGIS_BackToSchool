import React, { useEffect, useState } from "react";
import UserLayout from "@/Layouts/UserLayout";

const DetailSekolah = ({ id }) => {
  const [sekolah, setSekolah] = useState(null);

  // Data statis untuk foto (gunakan foto statis di folder public)
  const fotoSekolah = "/foto_sekolah1.jpg";

  useEffect(() => {
    // Ambil data sekolah dari file GeoJSON berdasarkan ID
    fetch("/sekolahOke.json")
      .then((response) => response.json())
      .then((data) => {
        const sekolahDetail = data.features.find(
          (feature, index) => index + 1 === parseInt(id)
        );
        if (sekolahDetail) {
          setSekolah(sekolahDetail.properties);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [id]);

  if (!sekolah) {
    return <div>Loading...</div>;
  }

  return (
    <UserLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Detail Sekolah</h1>
        <div className="flex flex-col items-center">
          {/* Foto Sekolah */}
          <img
            src={fotoSekolah}
            alt="Foto Sekolah"
            className="w-64 h-64 object-cover mb-6 rounded-lg shadow-md"
          />
          {/* Nama dan Alamat Sekolah */}
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">{sekolah.Nama_Sekol}</h2>
            <p className="text-gray-600">{sekolah.Alamat}</p>
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
