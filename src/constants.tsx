import { Leaf, Ruler, HardHat, Building2, Users, Trophy, Calendar } from 'lucide-react';
import { Service, Project, Stat } from './types';

export const SERVICES: Service[] = [
  {
    title: "Elevation Work & Layout Planning",
    description: "Comprehensive elevation work and layout planning services tailored to meet your project's unique requirements. We ensure efficient and sustainable solutions.",
    icon: Ruler
  },
  {
    title: "Eco-Structural Design",
    description: "Prioritizing environmental sustainability without compromising on structural integrity. We integrate innovative techniques to create eco-friendly structures.",
    icon: Leaf
  },
  {
    title: "Project Management",
    description: "Precision and expertise from concept to completion. Our dedicated team ensures every aspect of the construction process is seamlessly executed.",
    icon: HardHat
  }
];

export const STATS: Stat[] = [
  { label: "Year Established", value: "2015" },
  { label: "Projects Completed", value: "150+" },
  { label: "Satisfied Clients", value: "120+" },
  { label: "Awards Recognized", value: "15+" }
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Green Valley Residence",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: 2,
    title: "Eco-Tech Office Park",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: 3,
    title: "Sustainable Urban Loft",
    category: "Interior",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: 4,
    title: "Modern Hillside Villa",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1600596542815-2495db969ef8?auto=format&fit=crop&q=80&w=1000"
  }
];
