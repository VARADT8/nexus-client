import Background from "./components/Background";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen">
      <div className="relative ">
        <div className="absolute p-6 md:p-12 z-10 w-full h-full flex flex-col justify-start">
          <h1 className="text-4xl md:text-5xl mt-4 md:mt-10 mb-12 rounded-xl bg-white/70 backdrop-blur-md p-6 max-w-xl leading-tight font-extrabold text-slate-800 shadow-lg text-wrap">
            Early Detection of Scoliosis & Knee OA through ML
          </h1>
          <div className="mb-16">
            <Link href="/pages/osteoarthritis#top">
              <button className="bg-sky-600 text-white px-8 py-2 rounded-full hover:bg-sky-700 transform duration-300">
                Read more
              </button>
            </Link>
          </div>
          <div className="flex flex-col md:flex-row gap-8 bg-orange-50 md:bg-transparent">
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl max-w-80 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col">
              <Image
                src="/images/icons8-scoliosis-1.png"
                width={40}
                height={40}
                alt="Scoliosis"
                className="mb-4"
              />
              <h3 className="text-2xl font-semibold text-slate-800 mb-4">Scoliosis</h3>
              <p className="text-wrap text-slate-600 leading-relaxed mb-6 flex-grow">
                Scoliosis is a sideways curve of the spine, often resembling an
                &quot;S&quot; or &quot;C&quot; shape. It most commonly affects
                children and teens, and while the cause is often unknown, early
                detection and management can help prevent complications.
              </p>
              <div className="mt-auto">
                <Link
                  href={{
                    pathname: "/pages/final/uploadImage",
                    query: { name: "scoliosis" },
                  }}
                >
                  <button
                    className="w-full bg-sky-600 rounded-lg text-white font-medium px-4 py-3 hover:bg-sky-700 hover:shadow-md transform transition-all duration-300"
                    type="button"
                  >
                    Upload Image
                  </button>
                </Link>
              </div>
            </div>
            {/* <div> */}
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl max-w-80 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col">
              <Image
                src="/images/icons8-knee-joint-50.png"
                width={40}
                height={40}
                alt="Osteoarthritis"
                className="mb-4"
              />
              <h3 className="text-2xl font-semibold text-slate-800 mb-4">Osteoarthritis</h3>
              <p className="text-wrap text-slate-600 leading-relaxed mb-6 flex-grow">
                Knee osteoarthritis is a degenerative joint condition causing
                pain, stiffness, and swelling in the knee. It results from
                cartilage breakdown and can be managed through pain
                medications, lifestyle changes, physical therapy and medical consultation.
              </p>
              <div className="mt-auto">
                <Link
                  href={{
                    pathname: "/pages/final/uploadImage",
                    query: { name: "osteoarthritis" },
                  }}
                >
                  <button
                    className="w-full bg-sky-600 rounded-lg text-white font-medium px-4 py-3 hover:bg-sky-700 hover:shadow-md transform transition-all duration-300"
                    type="button"
                  >
                    Upload Image
                  </button>
                </Link>
              </div>
            </div>
            {/* </div> */}
            {/* <div> */}
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl max-w-80 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col">
              <Image
                src="/images/icons8-read-1.png"
                width={40}
                height={40}
                alt="Read More Book"
                className="mb-4"
              />
              <h3 className="text-2xl font-semibold text-slate-800 mb-4">Read More</h3>
              <p className="text-wrap text-slate-600 leading-relaxed mb-6 flex-grow">
                Early Detection is the Key : The project aids doctors in
                precise early detection, integrating patient data for
                personalized interventions. Ongoing research focuses on
                targeted therapies and also explores innovative treatments.
              </p>
              <div className="mt-auto">
                <Link href="/pages/osteoarthritis#top">
                  <button
                    className="w-full bg-sky-600 rounded-lg text-white font-medium px-4 py-3 hover:bg-sky-700 hover:shadow-md transform transition-all duration-300"
                    type="button"
                  >
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
            {/* </div> */}
          </div>
        </div>
        <Background />
      </div>
    </div>
  );
}
