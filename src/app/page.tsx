'use client';

import { Navbar } from '@/components/Navbar';
import { PlusIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { DeleteProjectModal } from '@/components/projects/DeleteProjectModal';
import { NoProjectsFound } from '@/components/projects/NoProjectsFound';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { Priority, Status } from '@/generated/prisma';
import { createProjectSchema } from '@/lib/schemas';

type Project = {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  startDate: Date;
  endDate: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function Home() {
  const { status } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthenticated = status === 'authenticated';
  const isLoadingSession = status === 'loading';

  // Fetch projects when user is authenticated
  useEffect(() => {
    const fetchProjects = async () => {
      if (isAuthenticated) {
        try {
          setIsLoading(true);
          const response = await fetch('/api/projects');
          
          if (!response.ok) {
            throw new Error('Failed to fetch projects');
          }
          
          const data: Project[] = await response.json();
          setProjects(data);
        } catch (error) {
          console.error('Error fetching projects:', error);
          toast.error('Failed to load projects. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProjects();
  }, [isAuthenticated]);

  // Project CRUD operations
  const handleAddProject = async (data: z.infer<typeof createProjectSchema>) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const newProject: Project = await response.json();
      setProjects([newProject, ...projects]);
      setIsAddModalOpen(false);
      toast.success('Project created successfully!');
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProject = async (data: z.infer<typeof createProjectSchema>) => {
    if (!currentProject) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/projects/${currentProject.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      const updatedProject: Project = await response.json();
      setProjects(projects.map(p => (p.id === updatedProject.id ? updatedProject : p)));
      setIsEditModalOpen(false);
      toast.success('Project updated successfully!');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!currentProject) return;
    
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/projects/${currentProject.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      setProjects(projects.filter(p => p.id !== currentProject.id));
      setIsDeleteModalOpen(false);
      toast.success('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modal handlers
  const openAddModal = () => setIsAddModalOpen(true);
  
  const openEditModal = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setCurrentProject(project);
      setIsEditModalOpen(true);
    }
  };
  
  const openDeleteModal = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setCurrentProject(project);
      setIsDeleteModalOpen(true);
    }
  };

  // Render authenticated content or landing page
  const renderContent = () => {
    if (isLoadingSession || (isAuthenticated && isLoading)) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    if (isAuthenticated) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add Project
            </button>
          </div>

          {projects.length === 0 ? (
            <NoProjectsFound onAddProject={openAddModal} />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Cursos Play and Learn</h1>
        <p className="text-xl mb-8 max-w-2xl">
          An interactive learning platform for courses and educational content
        </p>
        <div className="flex gap-4 flex-col sm:flex-row">
          <Link 
            href="/register" 
            className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </Link>
          <Link 
            href="/login" 
            className="border border-gray-300 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {renderContent()}
      
      {/* Add Project Modal */}
      <ProjectModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New Project"
      >
        <ProjectForm 
          onSubmit={handleAddProject} 
          onCancel={() => setIsAddModalOpen(false)} 
          isSubmitting={isSubmitting} 
        />
      </ProjectModal>

      {/* Edit Project Modal */}
      {currentProject && (
        <ProjectModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          title="Edit Project"
        >
          <ProjectForm 
            initialData={currentProject} 
            onSubmit={handleEditProject} 
            onCancel={() => setIsEditModalOpen(false)} 
            isSubmitting={isSubmitting} 
          />
        </ProjectModal>
      )}

      {/* Delete Project Modal */}
      {currentProject && (
        <DeleteProjectModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteProject}
          projectTitle={currentProject.title}
          isDeleting={isSubmitting}
        />
      )}
      
      <footer className="py-6 border-t border-gray-200 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Cursos Play and Learn. All rights reserved.</p>
      </footer>
    </div>
  );
}
