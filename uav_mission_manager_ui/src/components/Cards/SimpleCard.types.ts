export interface SimpleCardProps {
  imagePath: string;
  altImagePath: string;
  sectionTitle: string;
  subsectionTitle: string;
    description: string;
    onDelete?: () => void; 
    showDelete?: boolean;
}