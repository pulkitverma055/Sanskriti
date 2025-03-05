import React from 'react';
import { Link } from 'react-router-dom';
import IndiaMap from '../components/IndiaMap';
import MapComponent from '../components/MapComponet';

const Home = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to the Project</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link to="/authentication" className="bg-blue-500 text-white p-4 rounded text-center">Authentication</Link>
        <Link to="/registration" className="bg-green-500 text-white p-4 rounded text-center">Registration</Link>
        <Link to="/services" className="bg-yellow-500 text-white p-4 rounded text-center">Services</Link>
        <Link to="/marketplace" className="bg-red-500 text-white p-4 rounded text-center">Marketplace</Link>
      </div><div className='flex'>
      <div className='w-[50%]'><IndiaMap /></div>
      <div className='w-[50%]'><MapComponent /></div>
      </div>
    </div>
  );
};

export default Home;
