import Loader from '@/components/Loader';

export default function Loading() {
	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
			<Loader />
		</div>
	);
}
