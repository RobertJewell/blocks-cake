import { NavigationEditor } from "./navigation-editor";

export function GlobalView() {
  return (
    <div className="p-6 flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Globals</h1>
        </div>

        <NavigationEditor className="max-w-md" />
      </div>
    </div>
  );
}
