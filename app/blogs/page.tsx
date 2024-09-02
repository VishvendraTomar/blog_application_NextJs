"use client";

import { useEffect, useState } from 'react';

interface Blog {
  _id: string;
  title: string;
  content: string;
}

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await fetch('api/blogs?userId=66c48c52077464db279cd99c&categoryId=66c595a1077464db279cda11&endDate=2025-08-25&page=1&limit=10');
      const data = await response.json();
      setBlogs(data);
    };
    fetchBlogs();
  }, []);

  return (
    <div>
      <h1>Blogs</h1>
      <ul>
        {blogs.map(blog => (
          <li key={blog._id}>
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blogs;
