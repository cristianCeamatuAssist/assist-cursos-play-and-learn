import { Priority, Status } from '@/generated/prisma';
import { format } from 'date-fns';
import {
    ArrowRightIcon,
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon,
    EditIcon,
    TrashIcon,
    XCircleIcon
} from 'lucide-react';

type ProjectCardProps = {
  project: {
    id: string;
    title: string;
    description?: string | null;
    status: Status;
    priority: Priority;
    startDate: Date;
    endDate?: Date | null;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const { id, title, description, status, priority, startDate, endDate } = project;

  const statusConfig = {
    ACTIVE: { 
      label: 'Active',
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircleIcon className="h-4 w-4 mr-1" /> 
    },
    ON_HOLD: { 
      label: 'On Hold',
      color: 'bg-yellow-100 text-yellow-800',
      icon: <ClockIcon className="h-4 w-4 mr-1" /> 
    },
    COMPLETED: { 
      label: 'Completed',
      color: 'bg-blue-100 text-blue-800',
      icon: <CheckCircleIcon className="h-4 w-4 mr-1" /> 
    },
    CANCELLED: { 
      label: 'Cancelled',
      color: 'bg-red-100 text-red-800',
      icon: <XCircleIcon className="h-4 w-4 mr-1" /> 
    },
  };
  
  const priorityConfig = {
    LOW: { 
      label: 'Low',
      color: 'bg-gray-100 text-gray-800',
    },
    MEDIUM: { 
      label: 'Medium',
      color: 'bg-yellow-100 text-yellow-800',
    },
    HIGH: { 
      label: 'High',
      color: 'bg-red-100 text-red-800',
    },
  };

  const currentStatus = statusConfig[status];
  const currentPriority = priorityConfig[priority];

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{title}</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(id)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Edit project"
            >
              <EditIcon className="h-5 w-5 text-gray-500" />
            </button>
            <button 
              onClick={() => onDelete(id)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Delete project"
            >
              <TrashIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        {description && (
          <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentStatus.color}`}>
            {currentStatus.icon}
            {currentStatus.label}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentPriority.color}`}>
            {currentPriority.label} Priority
          </span>
        </div>
        
        <div className="text-sm text-gray-500">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>Start: {format(new Date(startDate), 'MMM d, yyyy')}</span>
          </div>
          {endDate && (
            <div className="flex items-center mt-1">
              <ArrowRightIcon className="h-4 w-4 mr-1" />
              <span>End: {format(new Date(endDate), 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 