import Image from 'next/image';

export default function Home() {
  return (
    <div className='flex flex-col flex-1 items-center justify-center'>
      <h1 className='text-6xl pb-30'>Cyber Security Project</h1>
      <Image src="/cyber-logo-big.png" alt="Cyber Security Logo" width={200} height={200} />
    </div>
  );
}
