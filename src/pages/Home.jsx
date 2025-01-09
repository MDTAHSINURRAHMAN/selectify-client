import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import axios from "axios";
import Navbar from "../components/shared/Navbar";

const Home = () => {
  const [recentQueries, setRecentQueries] = useState([]);
  const [loading, setLoading] = useState(true);

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
      image: "https://i.ibb.co/VqWBk8J/slider1.jpg",
      title: "Make Informed Choices",
      description: "Join our community in making ethical consumer decisions",
    },
    {
      image: "https://i.ibb.co/0fnF4Yv/slider2.jpg",
      title: "Support What Matters",
      description: "Your purchases have power. Choose wisely with Selectify",
    },
    {
      image: "https://i.ibb.co/XkQvbR6/slider3.jpg",
      title: "Community-Driven Insights",
      description: "Learn from others' experiences and share your own",
    },
  ];

  return (
    <div>
      <Navbar></Navbar>
      <div className="container mx-auto px-4 py-8">
        {/* Slider Section */}
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          autoplay={{ delay: 3000 }}
          navigation
          pagination={{ clickable: true }}
          loop={true}
        >
          {sliderData.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative h-[400px] rounded-lg overflow-hidden"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
                  <motion.h2
                    className="text-3xl font-semibold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {slide.title}
                  </motion.h2>
                  <motion.p
                    className="mt-4 text-lg text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                  >
                    {slide.description}
                  </motion.p>
                </div>
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
