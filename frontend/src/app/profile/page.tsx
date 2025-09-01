import Image from "next/image";

export default function Profile() {
  return (
    <div className="flex flex-col flex-1 items-center">
      <div className="flex flex-col items-center mt-10 p-10 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl border border-gray-200">
         <h1 className='text-3xl pb-5 font-extrabold text-blue-800'>Gal Helner</h1>
        <Image src="/profile-logo.png" alt="Profile Image" width={200} height={200} className="rounded-full mt-4"/>
      </div>
    </div>
  );
}