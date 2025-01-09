import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Navbar from "../components/shared/Navbar";
import Logo from "../components/shared/logo";
import "../css/custom-swiper-bullet.css";

const Home = () => {
  const [recentQueries, setRecentQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchRecentQueries = async () => {
      try {
        const response = await axios.get("http://localhost:3000/all-queries");
        const sortedQueries = response.data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setRecentQueries(sortedQueries.slice(0, 6));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching queries:", error);
        setLoading(false);
      }
    };
    fetchRecentQueries();
  }, []);

  const sliderData = [
    {
      image:
        "https://i.ibb.co.com/9gHxdk2/pexels-paula-schmidt-353488-963486.jpg",
      title: "Comfort",
      subtitle: "Stylish Seating",
      description:
        "Discover the perfect chairs to enhance your comfort and style for any room in your home.",
    },
    {
      image:
        "https://i.ibb.co.com/kMS2Y25/pexels-pixabay-276534.jpg",
      title: "Elegance",
      subtitle: "Modern Living",
      description:
        "Explore sleek and functional furniture options to transform your living space into a modern haven.",
    },
    {
      image: "https://i.ibb.co.com/8BX4JvT/pexels-fotoaibe-1743229.jpg",
      title: "Relaxation",
      subtitle: "Cozy Bedrooms",
      description:
        "Create a restful sanctuary with thoughtfully recommended bedroom essentials.",
    },
  ];

  return (
    <div>
      <Logo></Logo>
      <Navbar></Navbar>
      <div className="pb-8">
        {/* Slider Section */}
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          autoplay={{ delay: 3000 }}
          navigation
          pagination={{ clickable: true }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {sliderData.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative h-[300px] md:h-[600px] rounded-none overflow-hidden"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <AnimatePresence>
                <div className="absolute inset-0 flex flex-col justify-center items-center md:items-start text-white pl-0 md:pl-20">
                  {/* Title Animation */}
                  <motion.h2
                    className="text-2xl md:text-4xl text-center md:text-left text-banner-title font-karla font-normal tracking-widest"
                    initial={{ y: -50, opacity: 0 }}
                    animate={
                      activeIndex === index
                        ? { y: 0, opacity: 1 }
                        : { opacity: 0 }
                    }
                    transition={{
                      duration: 0.5,
                      type: "spring",
                      stiffness: 80,
                    }}
                  >
                    {slide.title}
                  </motion.h2>

                  {/* Subtitle Animation */}
                  <motion.h3
                    className="mt-2 md:mt-4 text-2xl md:text-5xl text-center md:text-left text-banner-title font-karla font-bold tracking-widest"
                    initial={{ scale: 0 }}
                    animate={
                      activeIndex === index
                        ? { scale: 1, opacity: 1 }
                        : { scale: 0, opacity: 0 }
                    }
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    {slide.subtitle}
                  </motion.h3>

                  {/* Description Animation */}
                  <motion.p
                    className="mt-2 md:mt-6 text-sm md:text-2xl text-center md:text-left text-background-color font-karla font-normal"
                    initial={{ x: -100, opacity: 0 }}
                    animate={
                      activeIndex === index
                        ? { x: 0, opacity: 1 }
                        : { x: 100, opacity: 0 }
                    }
                    transition={{ duration: 0.7, delay: 0.5 }}
                  >
                    {slide.description}
                  </motion.p>
                </div>
                </AnimatePresence>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Recent Queries Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Recent Queries</h2>
          {loading ? (
            <div className="flex justify-center items-center">
              <p className="text-lg text-gray-600">Loading recent queries...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentQueries.map((query) => (
                <motion.div
                  key={query._id}
                  className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-semibold">{query.queryTitle}</h3>
                  <p className="mt-2 text-gray-600">{query.boycottReason}</p>
                  <div className="mt-4">
                    <span className="text-sm text-gray-400">
                      Posted on:{" "}
                      {new Date(query.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
