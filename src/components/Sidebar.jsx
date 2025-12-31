import NodeDetails from "./NodeDetails";

export default function Sidebar({ node }) {
  return (
    <div className="w-80 border-l border-gray-700 bg-gray-900 text-white p-4 overflow-y-auto">
      <NodeDetails node={node} />
    </div>
  );
}
