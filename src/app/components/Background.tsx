import Image from 'next/image'
 
export default function Background() {
  return (
      <div className="relative h-screen overflow-hidden">
        <Image
          alt="Doctor with Xray"
          src='/images/bg.jpg'
          quality={100}
          height={1300}
          width={1600}
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: '80% 40%',
            height: 'calc(100vh - 96px)',
            width: '100vw',
          }}
        />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] z-0 pointer-events-none"></div>
      </div>
  )
}