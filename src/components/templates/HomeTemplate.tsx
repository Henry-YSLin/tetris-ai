import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

const HomeTemplate: React.FC = () => {
	return (
		<div className='flex flex-col justify-center items-center select-none min-h-screen bg-gradient-to-br from-gray-900  to-blue-700'>
			<h1 className='text-6xl text-green-500 border-b-4 pb-4'>Hello World !</h1>
			<h2 className='text-2xl text-gray-300 mt-10'>
				Click{' '}
				<Link
					to="/test"
					className='text-green-400 underline'
				>
					here
				</Link>{' '}
				to play pre-alpha Tetris<br/>
				<Link
					to="/multi/local"
					className='text-green-400 underline'
				>
					Local Multi
				</Link>
			</h2>
		</div>
	);
};

export default HomeTemplate;
