import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Priority, Status } from '@prisma/client';
import { format } from 'date-fns';

type Project = {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  startDate: Date;
  endDate: Date | null;
};

interface UserProjectsProps {
  projects: Project[];
}

export function UserProjects({ projects }: UserProjectsProps) {
  if (!projects.length) {
    return <span className="text-gray-500 text-sm">No projects</span>;
  }

  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800 border-green-200',
    COMPLETED: 'bg-blue-100 text-blue-800 border-blue-200',
    ON_HOLD: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
  };

  const priorityColors = {
    LOW: 'bg-gray-100 text-gray-800 border-gray-200',
    MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    HIGH: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="space-y-1">
      <TooltipProvider>
        {projects.map((project) => (
          <div key={project.id} className="inline-block mr-2 mb-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help text-indigo-600 hover:text-indigo-800 hover:underline text-sm">
                  {project.title}
                </span>
              </TooltipTrigger>
              <TooltipContent className="w-72 p-4" side="right">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">{project.title}</h4>
                  
                  {project.description && (
                    <p className="text-xs text-gray-600">{project.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className={statusColors[project.status]}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className={priorityColors[project.priority]}>
                      {project.priority} Priority
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    <div>Start: {format(new Date(project.startDate), 'MMM d, yyyy')}</div>
                    {project.endDate && (
                      <div>End: {format(new Date(project.endDate), 'MMM d, yyyy')}</div>
                    )}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </TooltipProvider>
    </div>
  );
} 