export default function NodeDetails({ node }) {
  if (!node) {
    return (
      <p className="text-gray-400 text-sm">Hover on a node to see details</p>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-blue-400 mb-3">{node.name}</h2>

      {node.description && (
        <div>
          <strong className="text-gray-300">Description:</strong>
          <p className="text-gray-400 text-sm mt-1">{node.description}</p>
        </div>
      )}

      {node.structure && (
        <div>
          <strong className="text-gray-300">Structure:</strong>
          <p className="text-gray-400 text-sm mt-1 font-mono bg-gray-800 p-2 rounded">
            {node.structure}
          </p>
        </div>
      )}

      {node.example && (
        <div>
          <strong className="text-gray-300">Example:</strong>
          <p className="text-gray-400 text-sm mt-1 italic">"{node.example}"</p>
        </div>
      )}

      {node.keywords && (
        <div>
          <strong className="text-gray-300">Keywords:</strong>
          <div className="flex flex-wrap gap-2 mt-2">
            {node.keywords.map((k) => (
              <span
                key={k}
                className="bg-blue-600 text-white text-xs px-2 py-1 rounded"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
