"use client";
import React, { useRef, useEffect, useState } from "react";
import { register } from "swiper/element/bundle";
import Image from "next/image";
import "./Carousel.scss";
import Link from "next/link";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { Navigation, Pagination } from "swiper/modules";
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { getMerchantProductAction } from "@/actions/shop-actions";
import { convertRialToToman, numberWithCommas } from "@/libs/utils";
import useCartStore from "@/store/useCartStore";
import { Oval } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

register();

const SliderCard = ({ item }) => {
  let { width } = useWindowDimensions();
  let [image, set_image] = useState(item.image);
  const { addToCart, decrementItemCount, getItemCount } = useCartStore();

  const count = getItemCount(item?.uid);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  const changeImageToHover = (i) => {
    return i ? i.replace("%231", "%23model") : "";
  };
  const [hoverImage, set_hoverImage] = useState(changeImageToHover(item.image));

  useEffect(() => {
    if (width > 600) set_image(item.image);
    else set_image(item.image);
  }, [width]);

  // Function to truncate text if it's longer than 40 characters
  const truncateText = (text) => {
    if (text.length > 60) {
      return text.substring(0, 60) + "...";
    }
    return text;
  };

  return (
    <div className="slider-card">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div className="image-container">
            <Link href={`/shop/products/${item.uid}`}>
              <Image
                className="slider-image-carousel"
                src={image}
                width={1500}
                height={350}
                alt=""
              />
              <Image
                className="sub-image"
                src={hoverImage}
                width={1500}
                height={350}
                alt=""
              />
            </Link>
            {count > 0 ? (
              <div className="bio-regal-cart-actions">
                {!isLoadingProduct ? (
                  <button
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "11px",
                    }}
                    className="inc-btn"
                    onClick={async () => {
                      setIsLoadingProduct(true);
                      await addToCart(item.merchant.uid, item);
                      setIsLoadingProduct(false);
                    }}
                  >
                    <span style={{ fontSize: "17px", paddingTop: "4px" }}>
                      <FontAwesomeIcon icon={faPlus} />
                    </span>
                  </button>
                ) : null}
                <div style={{ paddingRight: "8px", paddingLeft: "8px" }}>
                  {isLoadingProduct ? (
                    <Oval
                      visible={true}
                      height="20"
                      width="20"
                      color="#FFFFFF"
                      ariaLabel="oval-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  ) : (
                    count
                  )}
                </div>
                {!isLoadingProduct ? (
                  <button
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "11px",
                    }}
                    className="dec-btn"
                    onClick={async () => {
                      setIsLoadingProduct(true);
                      await decrementItemCount(item.merchant.uid, item);
                      setIsLoadingProduct(false);
                    }}
                  >
                    <span style={{ fontSize: "17px", paddingTop: "4px" }}>
                      <FontAwesomeIcon icon={faMinus} />
                    </span>
                  </button>
                ) : null}
              </div>
            ) : (
              <span
                className="positive-button"
                onClick={async (e) => {
                  e.stopPropagation();
                  console.log(`Button clicked for item: ${item.uid}`);
                  setIsLoadingProduct(true);
                  await addToCart(item.merchant.uid, item);
                  setIsLoadingProduct(false);
                }}
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ width: "", height: "15px" }}
                />
              </span>
            )}
          </div>
        </div>
        <Link href={`/shop/products/${item.uid}`}>
          <div className="description-box">
            <h3 className="product-title">{truncateText(item?.name)}</h3>
            <p className="brand-name">{truncateText(item?.brand?.name)}</p>
            {item?.discont > 0 ? (
              <p className="discount-price">
                {" "}
                تومان
                {numberWithCommas(convertRialToToman(item?.price_original))}
              </p>
            ) : null}
            <p className="product-price">
              {" "}
              تومان
              {numberWithCommas(convertRialToToman(item?.price))}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

const Carousel = ({ section, merchant }) => {
  const swiperElRef = useRef(null);
  const [regalItems, setRegalItems] = useState([]);

  useEffect(() => {
    if (section?.items?.length > 0) {
      getProductsWithCat(section.items[0].link_to_uid);
    }
  }, [section]);

  const getProductsWithCat = async (catId) => {
    try {
      let filters = { category__uid: catId, ordering: "regal_index" };
      const products = await getMerchantProductAction(filters, merchant.uid);
      console.log("products : ", products);
      setRegalItems(products.results);
    } catch (e) {
      console.log("error : ", e);
    }
  };

  useEffect(() => {
    const swiperEl = swiperElRef.current;
    const swiperInstance = swiperEl.swiper;

    if (swiperInstance) {
      swiperInstance.params.breakpoints = {
        0: {
          slidesPerView: 3,
          spaceBetween: 4,
        },
        576: {
          slidesPerView: 2,
          spaceBetween: 4,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: -8,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: -8,
        },
        1200: {
          slidesPerView: 5,
          spaceBetween: -8,
        },
      };
      swiperInstance.update();
    }
  }, [regalItems]);

  const handleNextSlide = () => {
    if (swiperElRef.current) {
      swiperElRef.current.swiper.slideNext();
    }
  };

  const handlePrevSlide = () => {
    if (swiperElRef.current) {
      swiperElRef.current.swiper.slidePrev();
    }
  };

  return (
    <div className="MainWrapper" style={{ margin: "12px 3.5%" }}>
      <div>
        <div>
          <div style={{ width: "100%", height: "50px", position: "relative" }}>
            <div className="slider-buttons">
              <Button
                className="slider-button prev"
                onClick={handlePrevSlide}
                icon={<RightOutlined />}
              />
              <Button
                className="slider-button next"
                onClick={handleNextSlide}
                icon={<LeftOutlined />}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="slider-section">
            <swiper-container
              ref={swiperElRef}
              autoplay="false"
              navigation="false"
              pagination="false"
              modules={[Navigation, Pagination]}
            >
              {regalItems?.map((item) => (
                <swiper-slide key={item.uid}>
                  <SliderCard item={item} />
                </swiper-slide>
              ))}
            </swiper-container>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
