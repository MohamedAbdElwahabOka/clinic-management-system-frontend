import React from 'react'
import CustomSources from './_components/customSources'
import { Button } from '@/components/ui/button'
import LoadingImage from './_components/loadingImage'

export default function OfficialPage() {
  return (
    <div className='px-10 w-full'>
      <div className='flex justify-between sm:flex-row flex-col gap-3 py-3'>
        <CustomSources title='Patient Portal' desc='Manage your clinic with ease and efficiency' />
        <CustomSources title='Resources' desc='Explore our library of helpful articles' />
        <CustomSources title='Testimonials' desc='Hear from our satisfied clients.' />
        <CustomSources title='Careers' desc='Join our team and make a difference.' />
      </div>
      <div className='py-10 w-full items-center justify-center flex flex-col'>
        <div className='md:w-1/3'>
          <h1 className='text-5xl font-bold text-center py-5'>Streamline Your Clinic Management Effortlessly</h1>
          <p className='text-lg text-center py-5'>Transform your practice with our comprehensive clinic management system designed specifically for doctors. Experience seamless appointment scheduling, efficient expense tracking, and secure access to medical records—all in one place.</p>
        </div>
        <div className='flex gap-3 py-5'>
          <Button>
            Get Started
          </Button>
          <Button variant='outline' className='ml-3'>Learn More</Button>
        </div>
      </div>
      <div className='py-10 w-full items-center justify-center'>

        <LoadingImage />
      </div>

      <div className='flex md:flex sm:flex gap-5 py-10 w-full items-center justify-between'>
        <div className='flex flex-col items-start justify-start w-1/3 px-2'>

          <h1 className='text-3xl font-bold py-5'>Streamline Your Clinic&apos;s Financial Management with Our Expense Tracking Feature</h1>
          <p className='text-lg text-justify py-5'>Efficiently manage your clinic&apos;s expenses with our intuitive platform. Gain insights into your spending patterns to make informed financial decisions.</p>
          <div className='flex gap-3'>

            <CustomSources title='Expense Overview' desc='Easily view all clinic expenses in one centralized location for better tracking.' />
            <CustomSources title='Budget Control' desc='Set budgets and receive alerts to stay within your financial limits.' />
          </div>
        </div>

        <div className='flex items-center justify-center w-1/3 py-3'>

          <LoadingImage />
        </div>
      </div>
      <div className='flex gap-5 py-10 w-full items-center justify-between'>
        <div className='flex flex-col items-start justify-start w-1/3 px-2'>

          <h1 className='text-3xl font-bold py-5'>Effortless Management of Appointment Payments</h1>
          <p className='text-lg text-justify py-5'>Our Appointment Payments feature simplifies the payment process, ensuring that you can manage various payment types with ease. Keep track of all transactions and provide a seamless experience for your patients.</p>
         
        </div>

        <div className='flex items-center justify-center w-1/3 py-3'>

          <LoadingImage />
        </div>
      </div>


    </div>
  )
}
