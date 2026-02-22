import GroceryStore3D from "./GroceryStore3D";

export default function ShelfScreen() {
  return (
    <main className="h-screen min-h-0 bg-[#C2352B] text-cereal-brown flex flex-col overflow-hidden">
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
