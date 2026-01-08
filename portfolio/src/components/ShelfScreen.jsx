import GroceryStore3D from "./GroceryStore3D";

export default function ShelfScreen() {
  return (
    <main className="min-h-screen bg-[#C2352B] text-cereal-brown flex flex-col">
      {/* Full-screen 3D Grocery Store */}
      <div className="flex-1 w-full">
        <GroceryStore3D
          onAisleChange={(aisleId) => {
            // Optional: Can sync with external state if needed
            console.log('Aisle changed to:', aisleId);
          }}
        />
      </div>
    </main>
  );
}
