import React, { useEffect, useState } from 'react'
import ReviewCard from './ReviewCard'
import { useSelector } from 'react-redux';

function ReviewPage() {
  const [latestReview, setLatestReview] = useState([]);
  const { allReview } = useSelector(state => state.review)

  useEffect(() => {
    if (allReview) {
      setLatestReview(allReview.slice(0, 6));
    }
  }, [allReview])

  return (
    <div className='flex items-center justify-center flex-col py-16 w-full bg-transparent'>
      <div className="text-center mb-14 px-4">
        <h1 className='md:text-5xl text-3xl font-black text-[#171717] mb-4'>
          Real Reviews from Real Learners
        </h1>
        <p className='lg:w-2/3 md:w-3/4 mx-auto text-base md:text-lg text-[#666666] leading-relaxed font-medium'>
          Discover how our Virtual Courses are transforming learning experiences through real feedback from students and professionals worldwide.
        </p>
      </div>

      <div className='w-full max-w-7xl flex items-center justify-center flex-wrap gap-8 px-4'>
        {latestReview.length > 0 ? (
          latestReview.map((item, index) => (
            <ReviewCard key={index} rating={item.rating} image={item.user.photoUrl} text={item.comment} name={item.user.name} role={item.user.role} />
          ))
        ) : (
          <p className="text-[#666666] text-lg italic font-medium">No reviews yet. Be the first to share your experience!</p>
        )}
      </div>
    </div>
  )
}

export default ReviewPage
