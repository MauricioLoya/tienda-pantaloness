import FooterPage from '@/modules/landing/FooterPage'
import NavBar from '@/modules/landing/Navbar'
import SectionBox from '@/modules/landing/SectionBox'
import ProductCard from '@/modules/product-list/componentes/ProductCard'

export default function Home() {
  return (
    <>
      <NavBar />
      <SectionBox>
        <div
          className="hero h-[45rem] bg-cover bg-center rounded-lg"
          style={{
            backgroundImage:
              'url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)'
          }}
        >
          <div className="hero-overlay bg-opacity-60 rounded-lg"></div>
          <div className="hero-content text-neutral-content h-full w-full">
            <div className="h-full w-full flex flex-col justify-end items-start">
              <h2 className="mb-5 text-5xl font-bold">Selección de la casa</h2>
              <p className="mb-5 max-w-md">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda excepturi exercitationem quasi. In deleniti eaque aut
                repudiandae et a id nisi.
              </p>
              <button className="btn btn-primary">Ir a la categoria</button>
            </div>
          </div>
        </div>
      </SectionBox>
      <SectionBox bgColor="bg-primary" className="grid gap-6">
        <h2 className="text-white font-semibold text-4xl">
          Productos Seleccionados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div className="mx-auto">
            <ProductCard />
          </div>
          <div className="mx-auto">
            <ProductCard />
          </div>
          <div className="mx-auto">
            <ProductCard />
          </div>
          <div className="mx-auto">
            <ProductCard />
          </div>
        </div>
        <div className="flex justify-center">
          <button className="btn btn-secondary">Ver más</button>
        </div>
      </SectionBox>
      <SectionBox>
        <div
          className="hero h-[45rem] bg-cover bg-center rounded-lg"
          style={{
            backgroundImage:
              'url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)'
          }}
        >
          <div className="hero-overlay bg-opacity-60 rounded-lg"></div>
          <div className="hero-content text-neutral-content h-full w-full">
            <div className="h-full w-full flex flex-col justify-end items-start">
              <h2 className="mb-5 text-5xl font-bold">Selección de la casa</h2>
              <p className="mb-5 max-w-md">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda excepturi exercitationem quasi. In deleniti eaque aut
                repudiandae et a id nisi.
              </p>
              <button className="btn btn-primary">Ir a la categoria</button>
            </div>
          </div>
        </div>
      </SectionBox>
      <SectionBox bgColor="bg-secondary" className="grid gap-6">
        <h2 className="text-white font-semibold text-4xl">
          Liquidacion de temporada
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div className="mx-auto">
            <ProductCard />
          </div>
          <div className="mx-auto">
            <ProductCard />
          </div>
          <div className="mx-auto">
            <ProductCard />
          </div>
          <div className="mx-auto">
            <ProductCard />
          </div>
        </div>
        <div className="flex justify-center">
          <button className="btn btn-primary">Ver más</button>
        </div>
      </SectionBox>
      <SectionBox bgColor="bg-white" className="grid gap-6">
        <div className="hero bg-base-200  rounded-lg">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <img
              alt="Contact"
              src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
              className="max-w-sm rounded-lg shadow-2xl"
            />
            <div>
              <h1 className="text-5xl font-bold">Box Office News!</h1>
              <p className="py-6">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda excepturi exercitationem quasi. In deleniti eaque aut
                repudiandae et a id nisi.
              </p>
              <button className="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>
      </SectionBox>
      <FooterPage />
    </>
  )
}
