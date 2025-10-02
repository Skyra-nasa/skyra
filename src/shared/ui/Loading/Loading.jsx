import './loading.scss';

function Loading() {
    return (
        <div className='flex flex-col gap-8 justify-center items-center inset-0 fixed bg-[#ffffff1c] opacity-60'>
            <p className='textAnimate text-2xl '></p>
            <div className='loaderAnimate'><span></span></div>
        </div>
    )
}

export default Loading
