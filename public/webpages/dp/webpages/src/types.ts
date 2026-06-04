export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readingTime: string;
  imageUrl: string;
}
