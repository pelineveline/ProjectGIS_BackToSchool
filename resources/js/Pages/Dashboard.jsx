import { Head } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

const Dasboard = () => {
    return (
        <UserLayout>
            <section
                className="relative w-full bg-cover bg-center py-32 md:py-40 text-center font-mono"
            >
                {/* Overlay image */}
                <div className="absolute inset-0 bg-black"></div>

                {/* Konten teks */}
                <div className="relative z-10 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-[32px] md:text-[48px] lg:text-[64px] xl:text-[80px] font-bold text-white">
                        Back To School
                    </h1>
                    <p className="text-white text-[16px] md:text-[18px] lg:text-[24px] max-w-xl mx-auto">
                        Cari Sekolah Impian Mu!
                    </p>
                </div>
            </section>

            <section className="w-full mx-auto bg-white py-12 4xl:py-20 font-mono">

                {/* Section Tentang Kami */}
                <section className="relative bg-cover bg-center h-[40rem] px-4 sm:px-8 lg:px-12 text-black py-16 4xl:h-[60rem] 4xl:py-20 text-center sm:text-right brightness-95">

                    <div className="relative z-10">
                        <h2 className="text-[48px] sm:text-[72px] lg:text-[96px] font-bold mb-4 4xl:text-[128px]">Tentang Kami</h2>
                        <p className="text-black mb-6 text-[18px] sm:text-[24px] lg:text-[32px] max-w-xl mx-auto sm:max-w-full sm:pl-[15rem] font-light">
                            Website ini memiliki database sekolah negeri yang ada di Kota Pekanbaru dengan letaknya pada peta, serta ada radius untuk melihat sampai mana batas zonasinya (sesuai peraturan pemerintah yaitu radius 500m)
                        </p>

                    </div>
                </section>

            </section>
        </UserLayout>
    );
};

export default Dasboard
