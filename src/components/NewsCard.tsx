
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NewsItem } from '@/redux/slices/newsSlice';

interface NewsCardProps {
  data: NewsItem[];
}

const NewsCard: React.FC<NewsCardProps> = ({ data }) => {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Latest Crypto News</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {data && data.length > 0 ? (
            data.map((item) => (
              <li key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750">
                <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.title}</h3>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {item.source} • {new Date(item.publishedAt).toLocaleDateString()}
                  </span>
                  <a 
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Read More
                  </a>
                </div>
              </li>
            ))
          ) : (
            <li className="p-4 text-center text-gray-500">No news data available</li>
          )}
        </ul>
      </CardContent>
      <CardFooter className="pt-2">
        <a
          href="https://newsdata.io"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button variant="outline" className="w-full">
            View All News
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
