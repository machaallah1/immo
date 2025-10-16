import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card>
        <div className="p-4">
          <h1 className="text-2xl font-bold">Home</h1>
          <p className="text-gray-500">Home</p>
          <Button className="mt-2">Button</Button>
        </div>
      </Card>
    </div>
  );
}
