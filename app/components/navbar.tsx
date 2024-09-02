"use client";

import { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const toggleCategoryDropdown = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  return (
    <nav className="bg-black sticky  top-0 z-50 shadow-md">
      <div className="container mx-auto">
        <ul className="flex space-x-6 p-4">
          <li><Link href="/blogs" className="text-white font-bold hover:underline">Blogs</Link></li>
          <li
            className="relative"
            onMouseEnter={toggleCategoryDropdown}
            onMouseLeave={toggleCategoryDropdown}
          >
            <span className="text-white font-bold cursor-pointer hover:underline">Category</span>
            {isCategoryOpen && (
              <ul className="absolute left-0 mt-2 bg-black shadow-lg rounded-md border border-gray-200 w-40">
                <li className="p-2 hover:bg-gray-100"><Link href="/category/tech">Tech</Link></li>
                <li className="p-2 hover:bg-gray-100"><Link href="/category/lifestyle">Lifestyle</Link></li>
                <li className="p-2 hover:bg-gray-100"><Link href="/category/education">Education</Link></li>
              </ul>
            )}
          </li>
          <li><Link href="/users" className="text-white font-bold hover:underline">Users</Link></li>
        </ul>
        <div className="border-t-2 border-white"></div>
      </div>
    </nav>
  );
};

export default Navbar;
