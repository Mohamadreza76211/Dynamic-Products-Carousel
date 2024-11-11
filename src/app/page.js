"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import SwiperCore, { EffectCoverflow, Pagination } from "swiper";
import { useSearchParams, useRouter } from "next/navigation";

SwiperCore.use([EffectCoverflow, Pagination]);

const CurveSlider = ({ selectedCategory, cats }) => {
  const [slides, setSlides] = useState([]);
  const [visibleNames, setVisibleNames] = useState([]);
  const [visibleUids, setVisibleUids] = useState([]);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(2);
  const [isClicked, setIsClicked] = useState(false);
  const [displayedSlideIndex, setDisplayedSlideIndex] =
    useState(selectedSlideIndex);
  const [showNames, setShowNames] = useState(false);
  const [backgroundColors, setBackgroundColors] = useState([]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const cid = searchParams.get("cid");
  const mid = searchParams.get("mid");

  const parentsCategories = cats.filter((cat) => !cat.parent);
  const level1 = parentsCategories;

  const level2 = [];
  level1.forEach((l1) => {
    if (l1.childes?.length > 0) {
      l1.childes.forEach((l2) => {
        level2.push({ ...l2, parent: l1 });
      });
    }
  });

  const level3 = [];
  level2.forEach((l2) => {
    if (l2.childes?.length > 0) {
      l2.childes.forEach((l3) => {
        level3.push({ ...l3, parent: l2 });
      });
    }
  });

  const getVisibleImagesV1 = () => {
    const allImages = level1;
    const visibleImages = allImages.map((c) => c.image);
    const visibleNamesArray = allImages.map((c) => c.name);
    const visibleUidsArray = allImages.map((c) => c.uid);
    const backgroundColorsArray = allImages.map(
      (c) => c.color_code || "transparent"
    );

    setVisibleNames(visibleNamesArray);
    setVisibleUids(visibleUidsArray);
    setBackgroundColors(backgroundColorsArray);

    return visibleImages;
  };

  const swiperRef = useRef(null);

  useEffect(() => {
    const images = getVisibleImagesV1();
    setSlides(images);
  }, [cats]);

  const handleSlideChange = (swiper) => {
    const newIndex = swiper.realIndex;
    setSelectedSlideIndex(newIndex);
    setIsClicked(false);
  };

  const handleSlideClick = (index) => {
    setSelectedSlideIndex(index);
    setDisplayedSlideIndex(index);
    setIsClicked(true);
    setShowNames(true);

    const catUid = visibleUids[index];
    router.push(`/shop/search?cid=${catUid}&mid=${mid}`);
  };

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Swiper
        className="by"
        ref={swiperRef}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={3}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2,
          slideShadows: true,
        }}
        pagination={false}
        loop={true}
        initialSlide={0}
        onSlideChange={handleSlideChange}
        style={{ padding: "50px 0", width: "94%" }}
      >
        {slides?.map((slide, index) => (
          <SwiperSlide
            className="hello"
            key={index}
            onClick={() => handleSlideClick(index)}
            style={{
              backgroundImage: `url(${slide})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: backgroundColors[index],
              width: "358px",
              height: "400px",
              borderRadius: "10px",
              boxShadow: "0 15px 50px rgba(0, 0, 0, 0.2)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          />
        ))}
      </Swiper>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "-30px",
        }}
      >
        {showNames &&
          visibleNames.map((name, index) => (
            <div
              key={index}
              style={{
                padding: "10px",
                color: "black",
                textAlign: "center",
                fontWeight: "bold",
                display: displayedSlideIndex === index ? "block" : "none",
              }}
            >
              {name}
            </div>
          ))}
      </div>
    </section>
  );
};

export default CurveSlider;
