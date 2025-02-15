import React from 'react';

const Loader = () => {
	return (
		<div className=''>
			<div className='relative text-base w-[5.5em] h-[5.5em]'>
				{/* Vertical line */}
				<div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 h-full w-1 bg-black'></div>

				{/* Animated box */}
				<div className='absolute left-[0.2em] bottom-[0.18em] w-4 h-4 bg-orange-500 rounded-[15%] animate-rollingRock'></div>
			</div>
		</div>
	);
};

export default Loader;
