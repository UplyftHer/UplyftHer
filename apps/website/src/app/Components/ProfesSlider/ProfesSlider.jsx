'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from "react-slick";
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import "./ProfesSlider.css";

function ProfesSlider() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
  
    useEffect(() => {
      setMounted(true);
  
      const fetchTestimonials = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}api/admin/testimonials`);
          if (response.data?.testimonials) {
            setTestimonials(response.data.testimonials);
          }
        } catch (error) {
          console.error('API Error:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchTestimonials();
    }, []);
  
    if (!mounted) {
      return null; // Ensuring no mismatch between SSR and CSR
    }
  
    // Custom Previous Arrow Component
    function CustomPrevArrow(props) {
      const { onClick } = props;
      return (
        <div className="custom-arrow custom-prev" onClick={onClick}>
          <FaArrowLeft size={20} />
        </div>
      );
    }
  
    // Custom Next Arrow Component
    function CustomNextArrow(props) {
      const { onClick } = props;
      return (
        <div className="custom-arrow custom-next" onClick={onClick}>
          <FaArrowRight size={20} />
        </div>
      );
    }
  
    const ProfsliderSetting = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        // autoplay: true,
        // autoplaySpeed: 3000,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        responsive: [
          { breakpoint: 1399, settings: { slidesToShow: 4, slidesToScroll: 1 } },
          { breakpoint: 1199, settings: { slidesToShow: 3, slidesToScroll: 1 } },
          { breakpoint: 991, settings: { slidesToShow: 2, slidesToScroll: 1 } },
          { breakpoint: 680, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        ],
      };

    return (
      <div className='ProfSliderSec'>

       
      {loading ? (
        <p>Loading...</p>
      ) : testimonials.length > 0 ? (
        <Slider {...ProfsliderSetting}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="ProfCard">
              <div className="Profimg">
                <Image 
                  src={testimonial.image || '/Images/test1.jpg'} 
                  alt={`testimonial-${index}`} 
                  width={110} 
                  height={140} 
                  priority 
                />
              </div>
              <div className="ProfText">
                <h6>{testimonial.name}, {testimonial.age}</h6>
                <p>{testimonial.country}</p>
                {/* <h6>{testimonial.bio}</h6>
                <p>– {testimonial.name}, {testimonial.age}, {testimonial.country}</p> */}
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <></>
      )}
    </div>
    );
}

export default ProfesSlider;
