"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useCallback, useEffect, useState } from "react";
import { useVirtualScroll } from "virtual-scroll-library";

interface Post {
  id: number;
  title: string;
  content: string;
}

const VirtualScrollExample: React.FC = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [threshold, setThreshold] = useState(200);
  const [initialItemCount, setInitialItemCount] = useState(5);
  const [resetKey, setResetKey] = useState(0);

  const fetchPosts = useCallback(
    async (page: number, itemsPerPage: number): Promise<Post[]> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return Array.from({ length: itemsPerPage }, (_, i) => ({
        id: (page - 1) * itemsPerPage + i + 1,
        title: `Post ${(page - 1) * itemsPerPage + i + 1}`,
        content: `This is the content of post ${
          (page - 1) * itemsPerPage + i + 1
        }. It demonstrates the virtual scrolling capability.`,
      }));
    },
    []
  );

  const generateInitialItems = useCallback((): Post[] => {
    return Array.from({ length: initialItemCount }, (_, i) => ({
      id: i + 1,
      title: `Initial Post ${i + 1}`,
      content: `This is an initial post to demonstrate pre-loaded content.`,
    }));
  }, [initialItemCount]);

  const { allItems, newLoadedItems, isLoading, containerRef } =
    useVirtualScroll<Post>({
      fetchItems: fetchPosts,
      initialItems: generateInitialItems(),
      itemsPerPage,
      threshold,
    });

  const [lastLoadedItems, setLastLoadedItems] = useState<Post[]>([]);

  useEffect(() => {
    if (newLoadedItems.length > 0) {
      setLastLoadedItems(newLoadedItems);
    }
  }, [newLoadedItems]);

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
    setInitialItemCount(5);
  };

  return (
    <div className="space-y-4 mt-5">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Virtual Scroll Demo</h2>
        <Button
          onClick={() =>
            window.open(
              "https://www.npmjs.com/package/virtual-scroll-library",
              "_blank"
            )
          }
        >
          View on NPM
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="itemsPerPage">Items Per Page</Label>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(Number(value))}
          >
            <SelectTrigger id="itemsPerPage">
              <SelectValue placeholder="Select items per page" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="threshold">Threshold (px)</Label>
          <Input
            id="threshold"
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="initialItems">Initial Items</Label>
          <Input
            id="initialItems"
            type="number"
            value={initialItemCount}
            onChange={(e) => setInitialItemCount(Number(e.target.value))}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleReset}>Reset with New Settings</Button>
        </div>
      </div>

      <div className="mb-4">
        <Badge variant="outline" className="mr-2">
          Total Items: {allItems.length}
        </Badge>
        <Badge variant="outline" className="mr-2">
          New Loaded Items: {lastLoadedItems.length}
        </Badge>
        <Badge variant="outline">Loading: {isLoading ? "Yes" : "No"}</Badge>
      </div>

      <div className="bg-secondary p-2 rounded-md mb-2 text-center">
        Scroll down in the box below to load more items
      </div>

      <div
        ref={containerRef}
        className="h-[40vh] overflow-auto border rounded-md"
      >
        {allItems.map((post) => (
          <Card key={post.id} className="m-4">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{post.content}</p>
            </CardContent>
          </Card>
        ))}
        {isLoading && (
          <div className="p-4 text-center">Loading more posts...</div>
        )}
      </div>

      {lastLoadedItems.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Last Loaded Items:</h3>
          <ul className="list-disc pl-5">
            {lastLoadedItems.map((item) => (
              <li key={item.id}>{item.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VirtualScrollExample;
