import { AlertTriangleIcon } from 'lucide-react';
import { ProjectModal } from './ProjectModal';

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectTitle: string;
  isDeleting: boolean;
}

export function DeleteProjectModal({
  isOpen,
  onClose,
  onConfirm,
  projectTitle,
  isDeleting,
}: DeleteProjectModalProps) {
  return (
    <ProjectModal isOpen={isOpen} onClose={onClose} title="Delete Project">
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-amber-600">
          <AlertTriangleIcon className="h-10 w-10" />
          <h3 className="text-lg font-medium">Are you sure you want to delete this project?</h3>
        </div>
        
        <p className="text-gray-600">
          You are about to delete <span className="font-medium">"{projectTitle}"</span>. This action cannot be undone.
        </p>
        
        <div className="pt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Project'}
          </button>
        </div>
      </div>
    </ProjectModal>
  );
} 