import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-[#707070]'>
        <p>ABOUT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Welcome to SafaiWala . the best cleaning service provider from South India- Bangalore. We take great pride in offering all of our clients a reliable, trustworthy and affordable service. we’ve steadily grown and built a reputation for excellence. We guarantee that you will receive the highest standard of service for the best possible price. SafaiWala  offers impeccable service from start to finish. We offer a broad range of cleaning services for Residential, corporate ,Industrial and others, throughout the Ahemdabad.</p>
          <p>We take the time to understand each of our client’s needs, in order to ensure that they receive the best possible bespoke cleaning services for their premises. Our cleaning staff are well trained, motivated and supported by a team of local, knowledgable and experienced operational managers.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>We are an organisation that cares about our people and our clients – To be the most admired cleaning and facility services partner in our chosen segments in India</p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>WHY  <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>OUR MISSION:</b>
          <p>Our mission at Sfaiwala is to provide a precision cleaning service that results in optimal customer satisfaction.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Our Team: </b>
          <p>Our team are highly trained, full-time professional cleaners,totally reliable,providing quality cleaning services in Ahemdabad at affordable prices.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>SafaiWala Promises:</b>
          <p >TRAINED STAFF,COMPLETE BACKGROUND CHECK,COMPLETE STAFF PROFILING,COMPLETE CHARACTER CHECK.</p>
        </div>
      </div>

    </div>
  )
}

export default About
