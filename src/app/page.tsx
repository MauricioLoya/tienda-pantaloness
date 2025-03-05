import NavBar from '@/modules/store/Navbar'
import SectionBox from '@/modules/store/SectionBox'

export default function Home() {
  return (
    <>
      <NavBar />
      <SectionBox>
        <div className="carousel  w-full rounded-lg">
          <div id="slide1" className="carousel-item relative w-full">
            <img
              src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp"
              className="w-full object-cover h-full rounded-lg"
            />
            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
              <a href="#slide4" className="btn btn-circle">
                ❮
              </a>
              <a href="#slide2" className="btn btn-circle">
                ❯
              </a>
            </div>
          </div>
        </div>
      </SectionBox>
    </>
  )
}
