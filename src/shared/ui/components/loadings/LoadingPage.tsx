import React from 'react'
import { ImSpinner9 } from 'react-icons/im'

export const LoadingPage = () => {
    return (
        <div className="absolute w-screen h-screen bg-white opacity-80 flex justify-center items-center text-5xl">
            <ImSpinner9 className="animate-spin" />
        </div>
    )
}
