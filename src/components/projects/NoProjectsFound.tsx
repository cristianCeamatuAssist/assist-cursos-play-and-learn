import { PlusIcon } from 'lucide-react';

type NoProjectsFoundProps = {
  onAddProject: () => void;
};

export function NoProjectsFound({ onAddProject }: NoProjectsFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg text-center">
      <div className="h-24 w-24 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
        <PlusIcon className="h-12 w-12 text-indigo-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
      <p className="text-gray-500 mb-6 max-w-md">
        You haven't created any projects yet. Start by creating your first project to track your work.
      </p>
      <button
        onClick={onAddProject}
        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        <span>Add Your First Project</span>
      </button>
    </div>
  );
} 